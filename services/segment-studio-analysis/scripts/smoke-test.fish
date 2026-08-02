#!/usr/bin/env fish

argparse \
    'base-url=' \
    'source-path=' \
    'request-id=?' \
    -- $argv
or exit 2

if not set --query _flag_base_url
    echo "Missing --base-url" >&2
    exit 2
end
if not set --query _flag_source_path
    echo "Missing --source-path" >&2
    exit 2
end

set request_id $_flag_request_id
if test -z "$request_id"
    set request_id (python -c 'import uuid; print(uuid.uuid4())')
end

set request_file (mktemp)
function cleanup --on-event fish_exit
    rm --force $request_file
end

env SOURCE_PATH=$_flag_source_path REQUEST_ID=$request_id python -c '
import json
import os
print(json.dumps({
    "schemaVersion": "1",
    "requestId": os.environ["REQUEST_ID"],
    "sourcePath": os.environ["SOURCE_PATH"],
    "analyses": ["aiTagging", "omnishotcut"],
    "proxy": {"enabled": True}
}))
' > $request_file

curl \
    --fail-with-body \
    --silent \
    --show-error \
    --header "Content-Type: application/json" \
    --data-binary "@$request_file" \
    "$_flag_base_url/v1/analyze-video"
