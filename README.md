# FreshBook

A minimal Firefox add-on that hides selected Facebook UI elements:
- Stories
- Reels
- Suggested posts (heuristic; language variants supported)
- The wall / news feed (optional)

## Install for development (Firefox)

1. Install `web-ext`:
   - `npm i -g web-ext`

2. Run:
   - `web-ext run --source-dir src`

## Tests

Unit tests cover settings application and popup storage/messaging logic.

Run:
- `npm test`

## Notes

Facebook changes its DOM frequently. This MVP uses best-effort heuristics and may need updates.

## License
This add-on is distributed under the AGPLv3 license. Copyright 2025 - Shogun Web

## Privacy

No data collection. No tracking. No network requests.

See [PRIVACY.md](../PRIVACY.md).
