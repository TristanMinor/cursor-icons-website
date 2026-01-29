# Adding an Icon

This guide covers the end-to-end process of adding a new icon to the Cursor Icons set — from design to shipping.

## 1. Design in Figma

Open the [Cursor Icons](https://www.figma.com/design/7XykK9nzkxTrOqnQRLmiiv/Cursor--Icons?node-id=2-253&t=AGvHkQFqylcU6ueA-1) master Figma file. This is the single source of truth for all icon designs.

Create your icon in all four variants:

- **16px / Outline**
- **16px / Filled**
- **24px / Outline**
- **24px / Filled**

> Flatten all paths in your icon. Boolean operations and grouped shapes must be merged into a single path. This is required for icon font generation — the font compiler cannot handle compound shapes or strokes that haven't been outlined and flattened.

## 2. Publish in Figma

Once the icon is finalized, publish the updated Figma file. This keeps the master file in sync and makes the icon available to the rest of the team.

## 3. Export SVGs

You need SVG files for each variant you've added or changed. For bulk exports — especially after systematic changes across many icons — use the [Cursor Icons: Overviews](https://www.figma.com/design/BdZbztu85O2LWAYkTaxdRY/Cursor-Icons--Overviews?node-id=0-1&t=32YMrQk4NlTJFaza-1) Figma file. Go to the [Export](https://www.figma.com/design/BdZbztu85O2LWAYkTaxdRY/Cursor-Icons--Overviews?node-id=1059-80652) page, which contains four boards:

| Board | Size | Style |
|-------|------|-------|
| 16 Outline | 16px | Outline |
| 16 Filled | 16px | Filled |
| 24 Outline | 24px | Outline |
| 24 Filled | 24px | Filled |

Export the updated icons from each board as SVG files. If you've only changed a few icons, you can also export individual SVGs directly from the master file.

## 4. Update the source repository

The source repository is [cursor-icons](https://github.com/TristanMinor/cursor-icons) (separate from this companion app).

Place the exported SVGs in the correct folders:

```
source/icons/
├── 16/
│   ├── outline/
│   │   └── your-icon.svg
│   └── filled/
│       └── your-icon.svg
└── 24/
    ├── outline/
    │   └── your-icon.svg
    └── filled/
        └── your-icon.svg
```

If you're updating an existing icon, replace the existing SVG files.

## 5. Generate fonts and ship

Open the [cursor-icons](https://github.com/TristanMinor/cursor-icons) repository in your terminal or editor and run `ship it`. This will:

1. **Build outline font** — Compile all outline SVGs into TTF, WOFF2, CSS, and JSON using fantasticon
2. **Build filled font** — Compile all filled SVGs into a separate font (with placeholders for any missing filled variants)
3. **Merge CSS** — Combine the outline and filled CSS into a single `cursor-icons.css` stylesheet
4. **Fix font metadata** — Set OS/2 weight class so outline (400) and filled (700) register as one font family
5. **Verify README** — Check that the README doesn't have stale icon counts
6. **Commit and push** — Stage everything and push to GitHub

The generated font files are placed alongside the SVGs:

```
source/fonts/
├── 16/
│   ├── outline/
│   │   ├── Cursor Icons Outline.ttf
│   │   └── Cursor Icons Outline.woff2
│   └── filled/
│       ├── Cursor Icons Filled.ttf
│       └── Cursor Icons Filled.woff2
└── 24/
    └── ...
```

## 6. Update the companion app

Once the source repository is updated, bring the changes into the companion app — [cursor-icons-website](https://github.com/TristanMinor/cursor-icons-website) (the website you're reading this on).

1. Copy the updated **SVGs** into `source/icons/` (matching the same folder structure)
2. Copy the updated **font files** into `source/fonts/`
3. Commit and push

The dev server automatically regenerates `icons.json` from the source files when it detects changes — no manual rebuild step needed. On production builds, this happens automatically as part of the build process.
