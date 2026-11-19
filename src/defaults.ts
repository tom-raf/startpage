import type { StoreData } from "./types";

// The starting set of links. The page copies this into the browser on first
// load. After that, edits made on the page win. To push a new default set to
// a fresh browser, change this file; to change your own browser, use EDIT.
export const DEFAULT_DATA: StoreData = {
  version: 1,
  settings: {
    place: { name: "London", lat: 51.5074, lon: -0.1278 },
  },
  sections: [
    {
      id: "daily",
      title: "DAILY",
      sites: [
        { id: "d1", name: "Daily Quiz Games", url: "https://tom-raf.github.io/dailyquizgames/", note: "Today's play log" },
        { id: "d2", name: "Gmail", url: "https://mail.google.com/" },
        { id: "d3", name: "Google Calendar", url: "https://calendar.google.com/" },
        { id: "d4", name: "BBC Weather", url: "https://www.bbc.co.uk/weather" },
      ],
    },
    {
      id: "dev",
      title: "DEV",
      sites: [
        { id: "v1", name: "GitHub", url: "https://github.com/tom-raf" },
        { id: "v2", name: "Claude", url: "https://claude.ai/" },
        { id: "v3", name: "Vercel", url: "https://vercel.com/dashboard" },
        { id: "v4", name: "Supabase", url: "https://supabase.com/dashboard" },
        { id: "v5", name: "MDN", url: "https://developer.mozilla.org/" },
      ],
    },
    {
      id: "news",
      title: "NEWS & READING",
      sites: [
        { id: "n1", name: "BBC News", url: "https://www.bbc.co.uk/news" },
        { id: "n2", name: "Hacker News", url: "https://news.ycombinator.com/" },
        { id: "n3", name: "The Verge", url: "https://www.theverge.com/" },
      ],
    },
    {
      id: "media",
      title: "MEDIA",
      sites: [
        { id: "m1", name: "YouTube", url: "https://www.youtube.com/" },
        { id: "m2", name: "Reddit", url: "https://www.reddit.com/" },
        { id: "m3", name: "Twitch", url: "https://www.twitch.tv/" },
      ],
    },
  ],
};
