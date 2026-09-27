# Six Degrees of Johnny Sins

Six Degrees of Johnny Sins adds a full-page home dashboard widget that finds the shortest chain of shared videos between two performers. Each link in the chain is a video in which the two performers on either side of it both appear.

The two ends of the chain are shown as From and To buttons at the top of the widget. Choosing a performer for either end finds the new path straight away, and **Shuffle** draws a new pair of the current chain type. Every time the dashboard opens, and every shuffle, draws a new pair. The arrow beside Shuffle opens the chain type menu:

- **Random pair** starts from a random performer and ends at any performer they connect to within the maximum number of degrees, each with equal chance, so how far apart the pair is reflects the library rather than always stretching to the limit.
- **Longest chain** searches from a random performer in the library's largest group of linked performers to one of the performers furthest from them within the maximum number of degrees, then from there to one of the performers furthest from that. Each shuffle starts somewhere else, so it tours different far-apart pairs instead of always showing the library's single longest chain.
- **Across the years** starts from a linked performer in the oldest tenth of the library by first video and ends at one in the newest tenth by latest video, and shows those two years in the badge. It finds such a chain whenever one exists within the maximum number of degrees.
- **Your Johnny Sins** finds the library's best-connected performer: of the 25 performers in its largest linked group with the most co-appearances, the one with the shortest average distance to the rest of that group. It shows a random performer's path to them, and Shuffle changes only the start. The hub is remembered for as long as the visible library stays the same.
- **Duos only** is a switch that works with every chain type and with chosen pairs. It links performers only through videos with exactly two performers, so large casts cannot shortcut a chain.

On a wide dashboard every performer in the chain sits on one rail, with each shared video above the gap between its two performers. Choosing a video highlights its link and describes it underneath, with the video's still, both performers, and **Open Video**, plus its release date when the screen is tall enough. In a narrow column the widget shows one link at a time: the two performers side by side, the video they share below them, and a progress bar, arrow buttons, or a swipe across the video to move along the chain. The performer picker is a centred panel on a wide screen and a bottom sheet on a phone, searchable and listing performers with the most videos first.

The widget's settings choose whether it opens with one of the chain types or a chosen pair, whether Duos only starts switched on, and how many degrees to search (1–6). A chosen pair that is further apart than that shows that there is no connection.

Paths come from one extension endpoint that joins Cove's authorization-filtered video and performer sets, requires performer and video read access, rejects share-link sessions, and returns only the connecting path. The performer picker and the From and To names use Cove's own performer search and performer lookup. It adds no database state. Libraries with more than 250,000 performer appearances are refused rather than searched.

Build a development ZIP from the repository root with `package-midnight-rider-extension --repository . --extension com.midnightrider.six-degrees --configuration Debug` and install the URL it prints through Cove's extension installer.
