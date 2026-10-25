# FLIPIQ — Coolify deployment

This is the standalone Next.js version of the FC 27 Autoflipper. It talks to the existing EAFC.Live API; it does not scrape FUT.GG or run an independent data collector.

## Coolify

1. Create a new GitHub repository, upload the contents of this folder, and connect it in Coolify as a new application.
2. Choose **Dockerfile** build strategy, base directory `/`, Dockerfile location `Dockerfile`, exposed port `3000`.
3. Add runtime environment variable `EAFC_API_BASE` with the externally reachable EAFC.Live API base URL (without `/api/v2`). Defaults to `https://api.eafc.live` if unset.
4. Assign a domain and HTTPS in Coolify, then deploy.
5. Visit `/api/market?path=%2Fmarket%2Ffreshness` to verify reachability. It should return source freshness JSON; a 503 means the upstream feed cannot be reached.

No database or volume is required for this dashboard version. Watchlist and preferences currently use browser localStorage; background alerts and server-side persistence are not yet implemented.

Run locally with `npm ci`, `npm run build`, `npm start`.
