# On This Day

On This Day adds a home dashboard widget that brings back videos released on today's date in past years. For each past year in the look-back window it picks one matching video. It then features one of those videos and lists the rest, newest first.

On a wide dashboard the widget shows the featured video beside a list of the other years and a rail with a dot for every year it searched. In a narrow column it shows the featured video above a row of year buttons. Choosing a year changes the featured video. Selecting the featured video opens it, and **See All from _year_** opens the video list filtered to that exact date. The shuffle button picks a different set of years and a different video for each year. The selection is stable for the day and refreshes at local midnight.

The widget reads only through Cove's authorization-filtered video search, requires video read access, and adds no database state or endpoints. Its settings are the number of memories to show (1–12) and how many years to look back (1–50). On 29 February it searches only leap years.

Build a development ZIP from the repository root with `package-midnight-rider-extension --repository . --extension com.midnightrider.on-this-day --configuration Debug` and install the URL it prints through Cove's extension installer.
