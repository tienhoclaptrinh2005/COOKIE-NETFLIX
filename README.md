# VMT SHOP

Retro arcade session checker with public Guest access and a protected Admin Control Center.

## Local setup

1. Copy `.env.example` to `.env.local` and provide Upstash Redis credentials.
2. Create a password hash with `npm run hash:password -- "your strong password"`. Use the escaped output for a local `.env` file and the unescaped output in the Vercel Environment Variables dashboard.
3. Generate `AUTH_SECRET` with at least 32 random characters.
4. Run `npm install` and `npm run dev`.

Without Upstash, development falls back to process memory for quota counters. Production intentionally reports Redis as unavailable until credentials are configured. Cookie/session values are never returned by admin APIs.

## Redis keys

- Existing application keys `NetflixId` and `VN` are observed, never renamed.
- All data created by this application is stored as fields in the single Redis Hash `pixel_press`.
- `cau_hinh:gioi_han_ngay` stores the Guest daily limit (default `3`).
- `cau_hinh:thong_bao_popup` stores the bilingual Guest announcement, selected icon, enabled state, and optional validated link as structured JSON. Edit it from **Admin → System Settings** instead of editing Redis manually.
- `han_muc:YYYY-MM-DD:<ip-hash>` stores per-IP usage with a field-level TTL.
- `thong_ke:tong`, `thong_ke:live`, `thong_ke:die`, and `thong_ke:unknown` store aggregate counters.
- `dang_nhap:that_bai:<ip-hash>` stores failed-login counters with a 15-minute field TTL. Successful login deletes this field instead of creating a zero-valued key.
- Run `npm run migrate:redis` once to move legacy `config:*`, `quota:*`, `stats:*`, and `auth:attempt:*` keys into `pixel_press`. The migration never changes `NetflixId` or `VN`.

## Optional verification service

Set `CHECKER_API_URL` and `CHECKER_API_TOKEN` to connect a server-to-server verification service. A generic endpoint receives `{ "cookie": "..." }` and should return `{ "status": "LIVE" | "DIE" | "UNKNOWN", "message"?: string }`.

The built-in `cknetflix.vercel.app` adapter uses `POST /api/check-info` with `{ "content": "...", "mode": "infoonly" }`. Its `success` response is normalized to `LIVE`; known invalid-session errors are normalized to `DIE`; service or unsupported errors remain `UNKNOWN`. Account details and direct-login tokens are intentionally not returned to the browser.

If no checker is configured, structurally valid input returns `UNKNOWN` rather than pretending it was verified. Submitted cookies are sensitive credentials: only configure a third-party checker when you are authorized to transmit them and trust the provider's handling policy.

For optional VPN/proxy detection, a free VPNAPI.io account can be configured with `VPN_CHECK_URL=https://vpnapi.io/api/{ip}` and its API key as `VPN_CHECK_TOKEN`. The app also accepts top-level `vpn`/`proxy` fields and IPinfo's `is_vpn`/`is_proxy`/`is_tor`/`is_relay` response fields. For IPinfo Plus/Max, use `VPN_CHECK_URL=https://api.ipinfo.io/lookup/{ip}/anonymous` and the account access token as `VPN_CHECK_TOKEN`.
"# COOKIE-NETFLIX" 
