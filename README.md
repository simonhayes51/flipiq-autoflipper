# FLIPIQ — Coolify deployment

This is the standalone Next.js version of the FC 27 Autoflipper. It talks to the existing EAFC.Live API; it does not scrape FUT.GG or run an independent data collector.

## Coolify

1. Connect `simonhayes51/flipiq-autoflipper` in Coolify as a Dockerfile app, base directory `/`, Dockerfile location `/Dockerfile`, port `3000`.
2. Generate one random shared service token on your home server: `openssl rand -hex 32` (64 characters). Do not commit or paste the result into tickets/logs.
3. In **EAFC.Live Backend** Coolify environment, set `FLIPIQ_SERVICE_TOKEN` to that generated token. Redeploy the backend after its protected endpoint is merged.
4. In **FLIPIQ** Coolify environment, set `FLIPIQ_SERVICE_TOKEN` to the *same* token, `FLIPIQ_SITE_PASSWORD` to a different strong site password (at least 12 characters), and `EAFC_API_BASE` to the externally reachable backend origin without `/api/v2` (e.g. `https://api.eafc.live`). Mark tokens/passwords as secrets and do not use build-time public/NEXT_PUBLIC variables.
5. After the backend is available, merge the frontend's private integration PR and redeploy FLIPIQ. The site now uses HTTPS Basic Auth: username `flipiq`, password from `FLIPIQ_SITE_PASSWORD`.
6. Confirm `/api/market?path=%2Fmarket%2Fflipiq-opportunities%3Fpage_size%3D1` after signing into FLIPIQ. The JSON should have `scanner_candidates_considered` and full market fields, not `locked` teaser items.

This intentionally fails closed: the whole FLIPIQ site returns `503` if `FLIPIQ_SITE_PASSWORD` is absent, and the opportunities proxy returns `503` if its token is absent. The backend responds `401` for a wrong service token and `503` if its token is not configured. **Never deploy the private feed without protecting site access**; otherwise public visitors could consume EAFC.Live's full data through the proxy.

No database or volume is required for this dashboard version. Watchlist and preferences currently use browser localStorage; background alerts and server-side persistence are not yet implemented. The 3/6/9h charts are based on actual recorded BIN history and intentionally report insufficient data when unavailable.

Run locally with `npm ci`, `npm run build`, `npm start`.
