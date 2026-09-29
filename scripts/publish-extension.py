#!/usr/bin/env python3
"""Publish a tagged extension release and open its official registry PR."""

from __future__ import annotations

import argparse
import base64
import json
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path


REGISTRY_REPOSITORY = "yourcove/officialextensionregistry"
VERSION_PATTERN = re.compile(r"\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?\Z")


class PublishError(Exception):
    pass


def command(*args: str, cwd: Path | None = None, check: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(args, cwd=cwd, text=True, capture_output=True, check=False)
    if check and result.returncode:
        detail = (result.stderr or result.stdout).strip()
        raise PublishError(f"{' '.join(args)} failed: {detail}")
    return result


def github_json(*args: str) -> object:
    return json.loads(command("gh", *args).stdout)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def registry_entry(
    existing: dict | None,
    manifest: dict,
    extension_id: str,
    source_manifest_url: str,
    repository_url: str,
    version: str,
    changelog: str,
    download_url: str,
) -> dict:
    release = {
        "version": version,
        "changelog": changelog,
        "minCoveVersion": manifest["minCoveVersion"],
        "downloadUrl": download_url,
    }
    if existing is None:
        return {
            "id": extension_id,
            "sourceManifestUrl": source_manifest_url,
            "repositoryUrl": repository_url,
            "screenshots": [],
            "versions": [release],
            "name": manifest["name"],
            "description": manifest["description"],
            "author": manifest["author"],
            "kind": manifest["kind"],
            "categories": manifest["categories"],
        }

    if existing.get("id") != extension_id:
        raise PublishError(f"Registry identity conflicts with {extension_id}")
    if existing.get("repositoryUrl") != repository_url:
        raise PublishError("Registry repositoryUrl differs from the source repository")
    if existing.get("sourceManifestUrl") != source_manifest_url:
        raise PublishError("Registry sourceManifestUrl differs from the current manifest path")
    if not isinstance(existing.get("versions"), list):
        raise PublishError("Registry entry has no versions array")
    if any(item.get("version") == version for item in existing["versions"]):
        raise PublishError(f"Registry already contains {extension_id} {version}")
    existing["versions"].append(release)
    return existing


def remote_tag_commit(source_repository: str, tag: str) -> str | None:
    ref = f"refs/tags/{tag}"
    lines = command(
        "git", "ls-remote", f"https://github.com/{source_repository}.git", ref, f"{ref}^{{}}"
    ).stdout.splitlines()
    refs = dict(line.split("\t", 1)[::-1] for line in lines)
    return refs.get(f"{ref}^{{}}") or refs.get(ref)


def release_asset(source_repository: str, tag: str, asset_name: str) -> str | None:
    result = command(
        "gh", "release", "view", tag, "--repo", source_repository, "--json", "assets,url", check=False
    )
    if result.returncode:
        return None
    release = json.loads(result.stdout)
    for asset in release["assets"]:
        if asset["name"] == asset_name:
            return release["url"]
    return None


def live_registry_entry(registry_repository: str, extension_id: str) -> dict | None:
    result = command(
        "gh", "api", f"repos/{registry_repository}/contents/extensions/{extension_id}.json",
        "--jq", ".content", check=False,
    )
    if result.returncode:
        if "HTTP 404" in result.stderr:
            return None
        raise PublishError(f"Cannot read the official registry: {result.stderr.strip()}")
    return json.loads(base64.b64decode(result.stdout).decode("utf-8"))


def wait_for_release(source_repository: str, tag: str, head: str, asset_name: str) -> str:
    deadline = time.monotonic() + 900
    while time.monotonic() < deadline:
        url = release_asset(source_repository, tag, asset_name)
        if url:
            return url
        runs = github_json(
            "run", "list", "--repo", source_repository, "--workflow", "build.yml",
            "--event", "push", "--limit", "30", "--json",
            "databaseId,headBranch,headSha,status,conclusion,url",
        )
        matching = [run for run in runs if run["headBranch"] == tag and run["headSha"] == head]
        if matching and matching[0]["status"] == "completed" and matching[0]["conclusion"] != "success":
            raise PublishError(f"Release workflow failed: {matching[0]['url']}")
        time.sleep(10)
    raise PublishError("Timed out waiting for the release ZIP; rerun this command to resume")


def open_registry_pr(registry_repository: str, branch: str) -> str | None:
    owner = registry_repository.split("/", 1)[0]
    pull_requests = github_json(
        "pr", "list", "--repo", registry_repository, "--state", "open", "--limit", "100",
        "--json", "headRefName,headRepositoryOwner,url",
    )
    for pr in pull_requests:
        if pr["headRefName"] == branch and pr["headRepositoryOwner"]["login"].lower() == owner.lower():
            return pr["url"]
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--extension-id", required=True, help="Extension ID from release.json")
    parser.add_argument("--changelog-file", required=True, type=Path, help="Reviewed release notes for the registry")
    parser.add_argument("--commit", help="Commit to tag; its extension files must match local main")
    parser.add_argument("--push-main", action="store_true", help="Push local main before creating the release tag")
    parser.add_argument("--dry-run", action="store_true", help="Check and print the release plan without publishing")
    parser.add_argument("--registry-repository", default=REGISTRY_REPOSITORY)
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    if command("git", "branch", "--show-current", cwd=root).stdout.strip() != "main":
        raise PublishError("Run from a checkout on the main branch")
    if command("git", "status", "--porcelain", cwd=root).stdout.strip():
        raise PublishError("The source working tree must be clean")

    matches = []
    for descriptor_path in (root / "extensions").glob("*/release.json"):
        descriptor = read_json(descriptor_path)
        if descriptor.get("id") == args.extension_id:
            matches.append((descriptor_path.parent, descriptor))
    if len(matches) != 1:
        raise PublishError(f"Expected one release.json for {args.extension_id}; found {len(matches)}")
    extension_dir, descriptor = matches[0]
    manifest_path = extension_dir / descriptor["manifest"]
    manifest = read_json(manifest_path)
    version = manifest["version"]
    if manifest["id"] != args.extension_id or not VERSION_PATTERN.fullmatch(version):
        raise PublishError("Manifest ID or version is invalid")
    if not manifest.get("minCoveVersion"):
        raise PublishError("Manifest must declare minCoveVersion")
    changelog = args.changelog_file.read_text(encoding="utf-8").strip()
    if not changelog:
        raise PublishError("Changelog file is empty")

    origin_url = command("git", "remote", "get-url", "origin", cwd=root).stdout.strip()
    source_match = re.search(r"github\.com[:/]([^/]+/[^/]+?)(?:\.git)?$", origin_url)
    if not source_match:
        raise PublishError(f"Cannot derive a GitHub source repository from origin: {origin_url}")
    source_repository = source_match.group(1)
    registry_repository = args.registry_repository
    registry_owner = registry_repository.split("/", 1)[0]
    permission = github_json("repo", "view", registry_repository, "--json", "viewerPermission")["viewerPermission"]
    if permission not in ("ADMIN", "MAINTAIN", "WRITE"):
        raise PublishError("Upstream registry write access is required so CI can generate checksum and index")

    tag = f"{descriptor['tagPrefix']}v{version}"
    asset_name = f"{args.extension_id}-{version}.zip"
    source_url = f"https://github.com/{source_repository}"
    download_url = f"{source_url}/releases/download/{tag}/{asset_name}"
    relative_manifest = manifest_path.relative_to(root).as_posix()
    source_manifest_url = f"https://raw.githubusercontent.com/{source_repository}/main/{relative_manifest}"
    branch = f"publish/{extension_dir.name}/v{version}"
    head = command("git", "rev-parse", "HEAD", cwd=root).stdout.strip()
    release_commit = command("git", "rev-parse", "--verify", f"{args.commit or 'HEAD'}^{{commit}}", cwd=root).stdout.strip()
    extension_path = extension_dir.relative_to(root).as_posix()
    current_tree = command("git", "rev-parse", f"{head}:{extension_path}", cwd=root).stdout.strip()
    release_tree = command("git", "rev-parse", f"{release_commit}:{extension_path}", cwd=root).stdout.strip()
    if release_tree != current_tree:
        raise PublishError(f"Extension files at {release_commit} differ from local main")
    remote_head = command("gh", "api", f"repos/{source_repository}/commits/main", "--jq", ".sha").stdout.strip()
    if head != remote_head:
        if command("git", "merge-base", "--is-ancestor", remote_head, head, cwd=root, check=False).returncode:
            raise PublishError("Remote main is not an ancestor of HEAD; fetch and resolve the difference")
        if not args.push_main:
            raise PublishError("Local main is ahead of GitHub; rerun with --push-main")

    tagged_commit = remote_tag_commit(source_repository, tag)
    if tagged_commit and tagged_commit != release_commit:
        raise PublishError(f"Remote tag {tag} points to {tagged_commit}, not {release_commit}")
    local_tag = command("git", "rev-parse", "--verify", f"refs/tags/{tag}^{{}}", cwd=root, check=False)
    if local_tag.returncode == 0 and local_tag.stdout.strip() != release_commit:
        raise PublishError(f"Local tag {tag} points to another commit")

    current_entry = live_registry_entry(registry_repository, args.extension_id)
    registry_entry(
        current_entry, manifest, args.extension_id, source_manifest_url, source_url,
        version, changelog, download_url,
    )

    print(f"Source main: {source_repository}@{head}", flush=True)
    print(f"Release commit: {release_commit}", flush=True)
    print(f"Tag: {tag}", flush=True)
    print(f"Asset: {download_url}", flush=True)
    print(f"Registry: {'update' if current_entry else 'new extension'}", flush=True)
    print(f"Registry branch: {registry_repository}:{branch}", flush=True)
    if args.dry_run:
        print("Dry run complete; nothing published", flush=True)
        return

    if head != remote_head:
        print("Pushing source main...", flush=True)
        command(
            "git", "-c", "credential.helper=!gh auth git-credential", "push",
            f"https://github.com/{source_repository}.git", "HEAD:main", cwd=root,
        )
    if not tagged_commit:
        if local_tag.returncode:
            command("git", "tag", "--annotate", tag, "--message", f"{manifest['name']} {version}", release_commit, cwd=root)
        print("Pushing release tag...", flush=True)
        command(
            "git", "-c", "credential.helper=!gh auth git-credential", "push",
            f"https://github.com/{source_repository}.git", f"refs/tags/{tag}", cwd=root,
        )

    print("Waiting for the release ZIP...", flush=True)
    release_url = wait_for_release(source_repository, tag, release_commit, asset_name)
    print(f"Release: {release_url}", flush=True)

    existing_pr = open_registry_pr(registry_repository, branch)
    if existing_pr:
        print(f"Registry PR: {existing_pr}", flush=True)
        return

    with tempfile.TemporaryDirectory(prefix="cove-extension-registry-") as temp:
        checkout = Path(temp) / "registry"
        command("git", "clone", "--depth", "1", "--branch", "main",
                f"https://github.com/{registry_repository}.git", str(checkout))
        entry_path = checkout / "extensions" / f"{args.extension_id}.json"
        existing = read_json(entry_path) if entry_path.exists() else None
        entry = registry_entry(
            existing, manifest, args.extension_id, source_manifest_url, source_url,
            version, changelog, download_url,
        )
        write_json(entry_path, entry)
        command("git", "switch", "--create", branch, cwd=checkout)
        command("git", "add", str(entry_path.relative_to(checkout)), cwd=checkout)
        command(
            "git", "-c", f"user.name={command('git', 'config', 'user.name', cwd=root).stdout.strip()}",
            "-c", f"user.email={command('git', 'config', 'user.email', cwd=root).stdout.strip()}",
            "-c", "commit.gpgsign=false", "commit", "--message",
            f"Publish {manifest['name']} {version}", cwd=checkout,
        )
        print("Pushing upstream registry branch...", flush=True)
        command(
            "git", "-c", "credential.helper=!gh auth git-credential", "push",
            f"https://github.com/{registry_repository}.git", f"HEAD:refs/heads/{branch}", cwd=checkout,
        )

    pr_url = command(
        "gh", "pr", "create", "--repo", registry_repository, "--base", "main",
        "--head", f"{registry_owner}:{branch}", "--title", f"Publish {manifest['name']} {version}",
        "--body", f"Adds {args.extension_id} {version}.\n\nRelease: {release_url}\n",
    ).stdout.strip()
    print(f"Registry PR: {pr_url}", flush=True)
    print("Registry CI will generate the checksum and index. Merge the PR after validation.", flush=True)


if __name__ == "__main__":
    try:
        main()
    except (OSError, KeyError, ValueError, PublishError) as exc:
        print(f"publish-extension: {exc}", file=sys.stderr)
        sys.exit(1)
