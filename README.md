# FreshBook

A minimal Firefox add-on that hides selected Facebook UI elements:
- Stories
- Reels
- Suggested posts (basic English-only heuristic)
- The wall / news feed (optional)

## Install for development (Firefox)

1. Install `web-ext`:
   - `npm i -g web-ext`

2. Run:
   - `cd clean-facebook-mvp/src`
   - `web-ext run --source-dir .`

## Notes

Facebook changes its DOM frequently. This MVP uses best-effort heuristics and may need updates.

## Privacy

No data collection. No tracking. No network requests.

See [PRIVACY.md](../PRIVACY.md).
