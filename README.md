# startpage

A Firefox start page in the same "cream blueprint" style as [dailyquizgames](https://github.com/tom-raf/dailyquizgames).

- **Header:** live clock, date, ISO week and day of year, weather, today's high and low, rain chance, wind, sunrise and sunset. Day, week and year progress bars.
- **Cards:** website cards grouped into sections. Press **EDIT LINKS** to add, edit, remove and reorder sites and sections.
- **Storage:** edits save in the browser (localStorage). Use **EXPORT JSON** to back up and **IMPORT JSON** to restore or copy to another machine.
- **Weather:** [Open-Meteo](https://open-meteo.com). No API key. Set the town in edit mode.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Create a new repo on GitHub (for example `startpage`) and push this folder to `main`.
2. In the repo, open **Settings > Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on each push.
4. The page appears at `https://tom-raf.github.io/startpage/`.

## Set it in Firefox

- **Homepage:** Settings > Home > Homepage and new windows > Custom URLs. Paste the Pages URL.
- **New tab:** Firefox has no setting for a custom new tab URL. Use the small extension in [`extension/`](extension/README.md). It shows this page in every new tab and keeps the address bar empty.

## Change the default links

`src/defaults.ts` holds the starting set. A browser uses it only on first load or after **RESET TO DEFAULTS**. After that, the browser's own saved copy wins.
