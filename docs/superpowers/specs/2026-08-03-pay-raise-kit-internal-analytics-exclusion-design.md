# Pay Raise Kit Internal Analytics Exclusion Design

## Goal

Prevent visits from Dazhi's own browsers and Codex testing sessions from entering Pay Raise Kit's GA4 data, without relying on a fixed IP address or changing analytics behavior for normal visitors.

## Chosen approach

Use a first-party functional cookie named `prk_internal` as a browser-level analytics kill switch.

- Visiting `https://payraisekit.com/?internal=1` sets `prk_internal=1` for one year.
- Visiting `https://payraisekit.com/?internal=0` removes the cookie and restores normal analytics.
- After either action, the `internal` query parameter is removed from the visible URL with `history.replaceState`.
- When `prk_internal=1` is present, the Google Analytics component renders no Google tag scripts and sends no GA4 request.
- The `?internal=1` visit itself must not send analytics before the cookie is set.

Cookie attributes:

```text
Path=/; Max-Age=31536000; SameSite=Lax; Secure
```

Removing the cookie uses the same path plus `Max-Age=0`.

## Why this approach

GA4's native internal-traffic rule is based mainly on IP addresses. That is unreliable for changing home, mobile, VPN, and Codex browser connections. Tagging internal events and filtering them in GA4 would still transmit those events and could permanently discard data if the filter were activated incorrectly.

The cookie switch is local, reversible, and prevents transmission at the source. A visitor can also opt out by using the same query parameter; that is acceptable and privacy-positive.

## Alternatives not selected

1. **GA4 IP-based internal traffic rule:** simple but unreliable across dynamic IPs and multiple internal devices.
2. **Send a `traffic_type=internal` parameter and filter in GA4:** supports DebugView, but still sends the data and adds a permanent-filter failure mode.
3. **Depend on browser content blockers:** already useful in some browsers, but inconsistent and not an auditable project-level control.

## Architecture

`components/GoogleAnalytics.tsx` becomes a client-side gate around the existing GA4 scripts.

A small pure helper module owns:

- recognizing `internal=1` and `internal=0`;
- reading whether `prk_internal=1` is present;
- producing the exact set-cookie or expire-cookie value;
- returning the URL with only the `internal` parameter removed.

The React component owns browser effects:

1. Read the current query parameter before deciding whether analytics may render.
2. Set or remove the cookie when a valid toggle is present.
3. Remove the toggle parameter from the visible URL while preserving the pathname, other query parameters, and hash.
4. Render the existing GA4 scripts only after the decision is known and tracking is allowed.

There is no public settings UI, new route, account system, custom GA4 event, IP lookup, or GA4 data filter in scope.

## Behavior and edge cases

- An invalid or missing GA4 measurement ID continues to render nothing.
- A missing toggle leaves the existing cookie state unchanged.
- Unknown `internal` values are ignored and are not removed.
- `internal=1` takes effect immediately on the first visit and loads no GA4 script.
- `internal=0` clears the exclusion and permits GA4 to load on that visit.
- The cookie is first-party and functional; it contains no identity, analytics, or advertising data.
- Existing GA4 events cannot be removed retroactively. The control applies only to future visits.

## Testing

Automated tests must prove:

1. `internal=1` creates the one-year cookie, removes only that query parameter, and suppresses both GA4 scripts.
2. A later visit with the cookie still suppresses both scripts without a query parameter.
3. `internal=0` expires the cookie, removes only that query parameter, and restores the scripts.
4. Other query parameters and URL hashes survive cleanup.
5. Invalid measurement IDs still render nothing.
6. Ordinary visitors with no internal cookie retain the current privacy-safe GA4 configuration.

Production verification must confirm both directions:

- With internal mode enabled, no request is made to `googletagmanager.com` or GA4 `g/collect`.
- After disabling internal mode in a controlled test browser, the Google tag loads and a GA4 collection request is observable.
- Internal mode is then re-enabled on Dazhi's and Codex's working browsers.

## Deployment and rollback

Deploy through the existing Pay Raise Kit release flow after the full project verification passes. Roll back by reverting the analytics-gate commit; an existing `prk_internal` cookie becomes inert if the gate is removed.

## Separate Google configuration

GA4 and Google Search Console linking is a separate account-level configuration. The internal-cookie feature neither creates nor depends on that association.
