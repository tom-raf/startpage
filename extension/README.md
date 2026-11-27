# Start page new tab extension

A tiny Firefox extension. It replaces the new tab page with the start page at
`https://tom-raf.github.io/startpage/`, shown in a full-window frame. The address
bar stays empty and keeps the cursor, so you can type a search at once.

The page itself still comes from GitHub Pages, so a push to `main` updates the
new tab too. You do not need to rebuild the extension.

## Install for testing (removed when Firefox restarts)

1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and pick `extension/manifest.json`.

## Install for good

Release Firefox only installs signed extensions. Mozilla signs "unlisted"
extensions for free, and they do not appear in the public store.

1. Get API keys at https://addons.mozilla.org/developers/addon/api/key/
2. From the repo root run:

   ```bash
   npx web-ext sign --source-dir extension --channel unlisted \
     --api-key YOUR_JWT_ISSUER --api-secret YOUR_JWT_SECRET
   ```

3. The signed `.xpi` appears in `web-ext-artifacts/`. Drag it into Firefox.

To change the extension later, raise `version` in `manifest.json` and sign again.

## Note on saved links

Firefox keeps storage for a framed page apart from the same page opened
directly. Edit your links from the new tab. To move links between the two,
use EXPORT JSON and IMPORT JSON.
