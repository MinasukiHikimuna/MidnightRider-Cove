import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "publish-extension.py"
SPEC = importlib.util.spec_from_file_location("publish_extension", SCRIPT)
PUBLISH = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(PUBLISH)


class RegistryEntryTests(unittest.TestCase):
    def setUp(self):
        self.manifest = {
            "name": "On This Day",
            "description": "Anniversary videos",
            "author": "MidnightRider",
            "kind": "extension",
            "categories": ["library", "ui"],
            "minCoveVersion": "1.3.2-dev.36",
        }
        self.args = (
            self.manifest,
            "com.midnightrider.on-this-day",
            "https://raw.githubusercontent.com/example/repo/main/extensions/on-this-day/extension.json",
            "https://github.com/example/repo",
            "0.2.0",
            "Show all videos from an anniversary year.",
            "https://github.com/example/repo/releases/download/tag/package.zip",
        )

    def test_first_release_has_only_authored_fields(self):
        entry = PUBLISH.registry_entry(None, *self.args)
        self.assertEqual(entry["versions"][0]["version"], "0.2.0")
        self.assertEqual(entry["categories"], ["library", "ui"])
        self.assertNotIn("checksum", entry["versions"][0])
        self.assertNotIn("releasedAt", entry["versions"][0])

    def test_update_preserves_prior_release_and_metadata(self):
        entry = PUBLISH.registry_entry(None, *self.args)
        prior = {"version": "0.1.0", "checksum": "sha256:prior", "releasedAt": "prior"}
        entry["versions"] = [prior]
        entry["screenshots"] = ["existing.png"]
        updated = PUBLISH.registry_entry(entry, *self.args)
        self.assertEqual(updated["versions"][0], prior)
        self.assertEqual(len(updated["versions"]), 2)
        self.assertEqual(updated["versions"][1]["version"], "0.2.0")
        self.assertEqual(updated["screenshots"], ["existing.png"])

    def test_duplicate_version_is_rejected(self):
        entry = PUBLISH.registry_entry(None, *self.args)
        with self.assertRaisesRegex(PUBLISH.PublishError, "already contains"):
            PUBLISH.registry_entry(entry, *self.args)

    def test_conflicting_repository_is_rejected(self):
        entry = PUBLISH.registry_entry(None, *self.args)
        entry["repositoryUrl"] = "https://github.com/another/repo"
        with self.assertRaisesRegex(PUBLISH.PublishError, "repositoryUrl"):
            PUBLISH.registry_entry(entry, *self.args)


if __name__ == "__main__":
    unittest.main()
