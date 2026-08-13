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

## 3. Connect your Google Sheet (one time)

**Recommended — Apps Script (works even on a private sheet, loads all tabs at once):**
1. In your sheet: **Extensions ▸ Apps Script**. Delete what's there, paste the
   contents of `apps-script.gs`, Save.
2. **Deploy ▸ New deployment ▸ Web app.** Set *Execute as: Me*,
   *Who has access: Anyone*. **Deploy**, then authorise (it only reads the sheet).
3. Copy the **Web app URL** (ends in `/exec`), paste it into the dashboard's
   *Google Sheet source* box, choose a range (e.g. last 5 years), **Connect & load**.

**No-setup alternative:** make the sheet **Share ▸ Anyone with the link ▸ Viewer**,
then paste the normal sheet link. Slower (one request per tab) and blocked if your
organisation disables link-sharing — that's when to use the Apps Script method.

Tabs must follow the `MMM-YY-IN / -ST / -DT` convention, e.g. `Jun-26-ST`.

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
  selected metric. Tell me your real zone lists / tier rule and I'll bake them in.
- `in.geojson` loads but isn't drawn — a national choropleth is a single shape, so
  National uses the metrics table + trend instead. Say the word if you want it drawn.
- Data quirks handled automatically: comma-numbers, the 2-row headers, the two junk
  district rows, and the 6 UTs that appear only at district level.

## 4. Host it on GitHub Pages

GitHub Pages serves over HTTPS, so it *is* a proper web server — the "serve the
folder" step above is handled for you. GeoJSON auto-load and the Google Sheet
connection both work on the live URL.

**Steps**
1. Create a repo (e.g. `ebird-dashboard`). Commit `index.html`, `st.geojson`,
   `dt.geojson`, `in.geojson` at the **repo root**. (`apps-script.gs` and this file
   are optional — they don't affect the page.)
2. Repo **Settings ▸ Pages**. Under *Build and deployment*, Source = **Deploy from a
   branch**, Branch = **main**, folder = **/ (root)**. Save.
3. Wait ~1 minute. Your dashboard is live at
   `https://<your-username>.github.io/ebird-dashboard/`.

**Remembering your sheet link.** After you paste the Apps Script `/exec` URL and
connect once, the page stores it in *your* browser and auto-connects next time — it
is **not** written into the repo. You can also bookmark a preconfigured link with
`?sheet=<url>` on the end, but note that anyone you share that link with can then
load your data.

**Privacy — read this before making the repo public.**
- The page is a viewer; the interesting data lives in your Google Sheet, reached only
  when someone enters your Apps Script URL. Keep that URL out of the repo (the default)
  and a public page stays a public *tool*, not public *data*.
- The bundled `Jun-26` sample data **is** inside `index.html`, so it becomes public if
  the repo is public. If that matters, host from a **private repo** (GitHub Pages on
  private repos needs a paid plan) or ask me to strip the embedded sample.
- If you hardcode your sheet URL into the file for convenience, a public page exposes
  all of that data to anyone who finds it. Prefer the paste-once / bookmark approach.

**Custom URL / troubleshooting**
- Blank page or missing map on Pages: confirm the GeoJSON files are committed at the
  same level as `index.html` and named exactly `st.geojson` / `dt.geojson`.
- Add an empty file named `.nojekyll` at the repo root if any file ever fails to
  serve — it turns off GitHub's Jekyll processing. (Usually not needed here.)
- Updating monthly data needs no redeploy — the sheet is read live on each visit.
