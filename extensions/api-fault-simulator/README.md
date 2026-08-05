# API Fault Simulator

A Cove extension that simulates browser-local API failures, timeouts, gateway errors, and latency. Its floating control remains available whenever the extension is installed and enabled.

Version 1.0.0 requires Cove 1.1.1-dev.81 or later.

Authentication and extension-management endpoints are always excluded from simulated faults so the control can be recovered. System health is excluded by default; an advanced UI option can include matching health requests for at most 60 seconds to reproduce startup failures without permanently hiding the control.

Use **Simulate API unavailable** for the standard outage scenario. This one-click preset faults all API requests and includes system health for the same bounded 60-second recovery window. The individual behavior, request-filter, and system-health controls remain available for custom scenarios.

The timeout mode is bounded to 30 seconds and added latency to 60 seconds. Because the middleware is active for any client that sends its browser-local rule cookie, install and enable this diagnostic extension only on Cove instances where users may intentionally simulate request failures.

Package from the MidnightRider-Cove repository with:

```bash
package-midnight-rider-extension --repository "$COVE_MIDNIGHT_RIDER_WORKSPACE" --extension com.midnightrider.api-fault-simulator
```

The extension is licensed under the GNU Affero General Public License v3.0 or later.
