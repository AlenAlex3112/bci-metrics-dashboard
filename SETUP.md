# Bird Count India — Metrics Dashboard · Setup

Everything is in one file: **index.html**. No install, no build.

## 1. Put the files in one folder

```
ebird-dashboard/
├─ index.html          ← the dashboard
├─ in.geojson          ← India outline (optional; not drawn yet — see note)
├─ st.geojson          ← states  (needed for the State map)
├─ dt.geojson          ← districts (needed for the District map)
└─ apps-script.gs      ← the sheet connector (you paste this into Google, see step 3)
```

Name the GeoJSON files exactly `in.geojson`, `st.geojson`, `dt.geojson` and the
dashboard picks them up on its own.

## 2. Open it — the one real requirement

A browser will not let a file opened by double-click read its neighbour files or
reach Google (a security rule called CORS). So **serve the folder** — pick one:

**Option A · Python (already on most machines).** Open a terminal *in the folder* and run:
```
python -m http.server 8000
```
Then visit **http://localhost:8000** in your browser. That's it.
(Windows: `py -m http.server 8000`. Stop it later with Ctrl-C.)

**Option B · VS Code.** Install the “Live Server” extension, right-click
`index.html` ▸ *Open with Live Server*.

If you just double-click `index.html` instead, it still works — the map falls
back to the **Load GeoJSON** button and the sheet connection is disabled.

## 3. Connect your Google Sheet

Choose one of two connection methods depending on your privacy & deployment preferences:

**Option A · Privacy-Safe Public CSV (Recommended for Public Repos):**
- Make your Google Sheet **Share ▸ Anyone with the link ▸ Viewer**.
- Leave `APPS_SCRIPT_URL: ""` empty inside `CONFIG` at the top of `index.html`.
- The dashboard automatically fetches public CSV tabs month-by-month without revealing any `/exec` web app URL in your public repository code.

**Option B · Apps Script Web App (Fastest multi-year load for Private Repos / Internal use):**
1. In your sheet: **Extensions ▸ Apps Script**. Delete what's there, paste the contents of `apps-script.gs`, Save.
2. **Deploy ▸ New deployment ▸ Web app.** Set *Execute as: Me*, *Who has access: Anyone*. **Deploy**, then authorise.
3. Copy the **Web app URL** (ends in `/exec`), paste it into `CONFIG.APPS_SCRIPT_URL` at the top of `index.html` or append `?apps_script=<URL>` to your dashboard URL.

Tabs must follow the `MMM-YY-IN / -ST / -DT` convention, e.g. `Jun-26-ST`.

## Map Joins
- **States map (`st.geojson`)**: Uses `STATE.NAME` feature property (100% verified match across all 37 Indian states & UTs).
- **Districts map (`dt.geojson`)**: Uses `DISTRICT.NAME` feature property with built-in `DISTRICT_ALIASES` resolution (99%+ verified match across 735 district polygons).

## What each level shows
- **National** — all metrics table + a Jan–Jun (or full multi-year) trend line.
- **State** — choropleth, top-15 bar (coloured by zone), zone roll-up, and
  Power/Average/Weak terciles, plus a sortable table.
- **District** — same, grouped by parent state; use the State filter to focus.

## Exports
- **Excel** — National, States, Districts (for the chosen metric) + a multi-year
  national trend sheet when a sheet is connected.
- **Chart PNG** / **Map PNG** — whatever is currently on screen.

## Notes / things you can tune
- **Zones** and the **Power/Average/Weak** rule are assumptions. Zones live near the
  top of `index.html` in the `REGIONS` object; tiers are computed as terciles of the
  selected metric.
- `in.geojson` loads but isn't drawn — a national choropleth is a single shape, so
  National uses the metrics table + trend instead.
- Data quirks handled automatically: comma-numbers, 2-row headers, junk district rows (`code 0`), and UTs appearing at district level.

## 4. Host it on GitHub Pages

GitHub Pages serves over HTTPS — the "serve the folder" step above is handled for you. GeoJSON auto-load and the Google Sheet connection both work on the live URL.

**Steps**
1. Create a repo (e.g. `ebird-dashboard`). Commit `index.html`, `st.geojson`, `dt.geojson`, `in.geojson` at the **repo root**.
2. Repo **Settings ▸ Pages**. Under *Build and deployment*, Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)**. Save.
3. Wait ~1 minute. Your dashboard is live at `https://<your-username>.github.io/ebird-dashboard/`.

**Dynamic URL parameters:**
You can pass custom parameters in your browser URL:
- `https://<your-username>.github.io/ebird-dashboard/?sheet=YOUR_SHEET_ID`
- `https://<your-username>.github.io/ebird-dashboard/?apps_script=YOUR_EXEC_URL`

**Privacy Guidelines:**
- For a **public GitHub repository**, use Option A (Public CSV scan path) with `APPS_SCRIPT_URL: ""` so your Apps Script deployment URL is not committed to git.
- For a **private GitHub repository** with GitHub Pages enabled, Option B (Apps Script) delivers instant fetching across 60+ months in a single network call.

**Custom URL / troubleshooting**
- Blank page or missing map on Pages: confirm the GeoJSON files are committed at the
  same level as `index.html` and named exactly `st.geojson` / `dt.geojson`.
- Add an empty file named `.nojekyll` at the repo root if any file ever fails to
  serve — it turns off GitHub's Jekyll processing. (Usually not needed here.)
- Updating monthly data needs no redeploy — the sheet is read live on each visit.
