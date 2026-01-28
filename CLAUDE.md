# Cursor Icons Website — Development Guidelines

## UI Icons

**All icons used in the application UI must come from the Cursor Icons library** (`source/icons/16/outline/`). Never use hand-drawn SVGs, third-party icon libraries, or inline stroke-based icon markup.

Icon constants are defined in `src/icons.ts`. To use an icon in a component:

1. Find the appropriate icon in `source/icons/16/outline/`
2. Add it as a constant in `src/icons.ts` with `fill="currentColor"` (replacing any hardcoded fill color)
3. Import and render it via `dangerouslySetInnerHTML={{ __html: ICON_NAME }}`

Current UI icons sourced from the library:
- `ICON_SEARCH` — magnifying-glass.svg (search input)
- `ICON_X` — x.svg (close buttons, clear search)
- `ICON_SUN` — sun.svg (dark mode toggle)
- `ICON_MOON` — moon.svg (dark mode toggle)
- `ICON_COPY` — copy.svg (copy actions)
- `ICON_CHECK` — check.svg (copied confirmation)
- `ICON_DOWNLOAD` — arrow-bracket-to-down.svg (all download actions)
