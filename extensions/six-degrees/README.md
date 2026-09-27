# Six Degrees of Johnny Sins

Six Degrees of Johnny Sins adds a full-page home dashboard widget that finds the shortest chain of shared videos between two performers. Each link in the chain is a video in which the two performers on either side of it both appear.

The two ends of the chain are shown as From and To buttons at the top of the widget. Choosing a performer for either end finds the new path straight away, and **Shuffle** picks a random pair. A random pair starts from a random performer and ends at any performer they connect to within the maximum number of degrees, each with equal chance, so how far apart the pair is reflects the library rather than always stretching to the limit. Every time the dashboard opens, and every shuffle, draws a new random pair.

On a wide dashboard every performer in the chain sits on one rail, with each shared video above the gap between its two performers. Choosing a video highlights its link and describes it underneath, with the video's still, both performers, and **Open Video**, plus its release date when the screen is tall enough. In a narrow column the widget shows one link at a time: the two performers side by side, the video they share below them, and a progress bar, arrow buttons, or a swipe across the video to move along the chain. The performer picker is a centred panel on a wide screen and a bottom sheet on a phone, searchable and listing performers with the most videos first.

The widget's settings choose whether it opens with a random pair or a chosen pair, and how many degrees to search (1–6). A chosen pair that is further apart than that shows that there is no connection.

Paths come from one extension endpoint that joins Cove's authorization-filtered video and performer sets, requires performer and video read access, rejects share-link sessions, and returns only the connecting path. The performer picker and the From and To names use Cove's own performer search and performer lookup. It adds no database state. Libraries with more than 250,000 performer appearances are refused rather than searched.

Build a development ZIP from the repository root with `package-midnight-rider-extension --repository . --extension com.midnightrider.six-degrees --configuration Debug` and install the URL it prints through Cove's extension installer.
