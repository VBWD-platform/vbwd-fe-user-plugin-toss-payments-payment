# Toss Payments Plugin (fe-user)

Vue 3 plugin wiring Toss Payments widget v2 into the user storefront.
Two-phase: widget returns a `paymentKey` via return URL, frontend
calls the backend `/confirm` endpoint (server-side finalisation).

## Routes

| Path | Purpose |
|------|---------|
| `/pay/toss` | Widget mount |
| `/pay/toss/success` | Confirms via backend `/payments/confirm` |
| `/pay/toss/cancel` | User-cancelled |

## i18n

`en`, `ko`.

## Backend

Pairs with [`vbwd-plugin-toss-payments`](https://github.com/VBWD-platform/vbwd-plugin-toss-payments).

---

**Core:** [vbwd-fe-user](https://github.com/VBWD-platform/vbwd-fe-user)
