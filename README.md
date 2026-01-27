# Cursor Icons Website

A static website for displaying and browsing Cursor Icons - client delivery.

## Project Structure

```
cursor-icons-website/
├── source/
│   ├── icons/          # SVG icon files
│   │   ├── 16/        # 16px icons
│   │   │   ├── filled/
│   │   │   └── outline/
│   │   └── 24/        # 24px icons
│   │       ├── filled/
│   │       └── outline/
│   └── fonts/         # Icon font files
│       ├── cursor-icons-outline/
│       └── cursor-icons-filled/
├── .gitignore
└── README.md
```

## Icon Files

Icons are organized by size (16px and 24px) and style (filled and outline). Simply place your SVG files in the appropriate folders:

- `source/icons/16/filled/` - 16px filled style icons
- `source/icons/16/outline/` - 16px outline style icons
- `source/icons/24/filled/` - 24px filled style icons
- `source/icons/24/outline/` - 24px outline style icons

The website will automatically read icons from these folders.

## Font Files

Icon fonts should be placed in the respective font folders:

- `source/fonts/cursor-icons-outline/` - Outline icon font and mapping files
- `source/fonts/cursor-icons-filled/` - Filled icon font and mapping files

Include the JSON mapping file that maps icon names to Unicode values.

## Features (To Be Implemented)

- Grid layout for displaying all icons
- Click an icon to view details in sidebar
- Copy icon as SVG
- Copy glyph from icon font
- Search icons by name and auto-generated tags
- Scale icons with slider
- Display Unicode values for each icon
- Automatic tag generation when icon list changes

## Development

Build instructions will be added once the website is implemented.
