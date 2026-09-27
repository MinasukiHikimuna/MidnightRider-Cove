# On This Day

On This Day adds a home dashboard widget that brings back videos released on today's date in past years. It samples up to the configured number of past years that have such videos and fetches up to eight videos from each.

One video from the selected year is featured as a large 16:9 still. Beneath it, a filmstrip shows every fetched video from that year under a heading with the year's full count, such as "7 videos from 2025". When a year has more videos than were fetched, a final "+N" tile opens the rest. Choosing a thumbnail features it, and **See All** or the "+N" tile opens the video list filtered to that exact date. On a wide dashboard the years are listed beside the featured video, each with a mosaic of up to four of its stills and its count. In a narrow column they become a row of year buttons with counts. The shuffle button picks a different, random set of years and videos. The selection is stable for the day: reloading the page keeps the day's pick, or the last shuffle, which the browser remembers for that widget until local midnight, when a new day's pick replaces it.

The widget reads only through Cove's authorization-filtered video search, requires video read access, and adds no database state or endpoints. Its settings are the number of years to show (1–12) and how many years to look back (1–50). On 29 February it searches only leap years.

Build a development ZIP from the repository root with `package-midnight-rider-extension --repository . --extension com.midnightrider.on-this-day --configuration Debug` and install the URL it prints through Cove's extension installer.
