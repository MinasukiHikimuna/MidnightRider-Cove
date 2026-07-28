#!/usr/bin/env fish

argparse 'container=' 'network=' -- $argv
or exit 2

if not set --query _flag_container
    echo "Missing --container" >&2
    exit 2
end
if not set --query _flag_network
    echo "Missing --network" >&2
    exit 2
end

docker container inspect $_flag_container >/dev/null
or begin
    echo "Container does not exist: $_flag_container" >&2
    exit 1
end

docker network inspect $_flag_network >/dev/null
or begin
    echo "Network does not exist: $_flag_network" >&2
    exit 1
end

set attached (
    docker container inspect \
        --format '{{range $name, $_ := .NetworkSettings.Networks}}{{println $name}}{{end}}' \
        $_flag_container
)
if contains -- $_flag_network $attached
    exit 0
end

docker network connect $_flag_network $_flag_container
