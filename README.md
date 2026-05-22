# 360° Property Tour

A lightweight 360° panorama viewer with annotation support. Pure static — no backend, no build step.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (public).
2. Upload **all** of these files at the root of the repo (keep folder structure):

   ```
   index.html
   pano-viewer.jsx
   assets/pano-1.jpg
   ```

3. In the repo, go to **Settings → Pages**.
4. Under **Source**, select **Deploy from a branch** → branch `main` (or `master`), folder `/ (root)`.
5. Wait ~1 minute. Your viewer will be live at:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

6. Share that URL with your client.

## How sharing works

- Notes are encoded directly into the URL hash (`#…`). No database.
- Anyone who opens the URL sees the panorama and the notes encoded in the link.
- When the client adds/edits notes, they hit **share** → **copy link** to get a new URL containing their notes. They send that URL back to you.
- You open the URL → you see their notes. Round-trip complete.
- Notes also persist in the client's browser via `localStorage` — they won't lose work on reload.

## Swapping the panorama

Replace `assets/pano-1.jpg` with any equirectangular (2:1) 360° image. Update the `panoUrl` and `title` props in `index.html` if you want a different filename.
