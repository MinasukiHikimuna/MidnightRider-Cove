# Discovery Widgets

This extension contributes seven configurable, full-width dashboard widgets: On This Day, Tag of the Day, Forgotten Favorites, Quick Watch, Performer Spotlight, Continue a Collection, and Curation Queue.

It uses authenticated same-origin API access, deterministic per-day discovery with user-triggered reshuffling, local-midnight refresh, host-owned widget configuration, exact filtered navigation, permission-gated contributions, duplicate widget instances, loading/error/empty states, and responsive CSS container queries. It intentionally uses existing Cove APIs and does not add extension-owned endpoints or database state.

Build a development ZIP from the repository root with `package-midnight-rider-extension --repository . --extension com.midnightrider.discovery-widgets --configuration Debug` and install the URL it prints through Cove's extension installer.
