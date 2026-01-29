# Design Philosophy

Cursor Icons are designed like glyphs, not illustrations. Every icon is treated with the same precision and craft you'd expect from a well-drawn typeface — ink traps, optical corrections, and deliberate construction. The result is a set that feels human, considered, and professional at every size.

## Sizes and grids

Icons come in two sizes, each built on its own pixel grid:

| Size | Grid | Stroke weight |
|------|------|---------------|
| **16px** | 16 × 16 | 1.25px |
| **24px** | 24 × 24 | 1.5px |

The 16px variant works well from roughly 14px up to around 20px. From about 22px onward, switch to the 24px variant. The reason for two sizes isn't just scaling — at larger sizes, you want more detail, and you want to control stroke weight rather than letting it grow proportionally. A 16px icon scaled to 32px would have strokes twice as thick, losing the intended feel.

The grid is a starting point, not a constraint. Stroke centers are placed on the grid where possible, but you can — and should — deviate when optical balance demands it.

![16 and 24 grid overlay](/images/sizes-and-grids.gif)

## Two styles

Every icon exists in two styles:

- **Outline** — constructed from strokes
- **Filled** — constructed from solid shapes with lines and shapes knocked out of them

In the filled style, interior details are always knockouts — cut directly from the solid shape. We never place closed outlined shapes on top of a fill.

![Outline vs filled comparison](/images/styles.png)

## Optical shapes

Every icon is designed to fit within one of four optical bounding shapes: circle, square, horizontal rectangle, or vertical rectangle. These shapes exist for both the 16px and 24px sizes and ensure visual consistency across the set — a circular icon like a globe and a square icon like a file should appear the same optical size when placed side by side.

![Optical shape templates](/images/optical-shapes.png)

The exact dimensions for each optical shape at both sizes:

| Shape | 16px | 24px |
|-------|------|------|
| **Square** | 13 × 13 | 19 × 19 |
| **Circle** | 14 × 14 | 21 × 21 |
| **Horizontal** | 14 × 11 | 21 × 17 |
| **Vertical** | 11 × 14 | 17 × 21 |

## Construction

Icons are not organic. They're closer to technical drawings or diagrams — but friendly ones.

The construction method is deliberate: start with lines that run horizontally, vertically, or at 45 degrees — other angles are fine too when needed — then round the corners so they follow the concept. A cloud isn't built from circles — it's built from straight segments with rounded joins. A heart isn't drawn freehand — it's constructed from angled lines with controlled corners. Freeform curves are avoided entirely.

This approach gives the set a consistent, engineered feel. The icons are made for a code editor, so they should feel technical and precise — but the rounded corners and caps keep them friendly.

![Cloud and heart construction breakdown](/images/construction.png)

## Stroke caps

All strokes use round caps.

![Round stroke caps](/images/stroke-caps.png)

## Roundness

Corner rounding on shapes is calibrated to sit between sharp and soft — not too geometric, not too bubbly. The shapes should feel precise but approachable.

![Corner roundness](/images/roundness.png)

## Optical adjustments

The icons borrow optical corrections from type design. These adjustments are subtle — especially at 16px — but the cumulative effect matters. It's what separates a set that feels carefully made from one that feels generated. The icons feel optically refined and human — not just drawn and left as-is.

This also opens the door to treating the set as a variable icon font in the future — adjusting stroke weight while maintaining optical quality at every point in the range.

### Ink traps

Where lines converge and create visually dense areas, we cut small shapes at the junctions to prevent optical clogging.

![Ink traps](/images/ink-traps.gif)

### Stroke thinning

Where a stroke meets another element, we thin it slightly. Keeping it at full weight would make the junction feel heavier than intended.

![Stroke thinning](compare:stroke-thinning)

## Natural proportions

Icons are not forced into a square. If an object is naturally vertical, the icon is vertical. If it's horizontal, it's horizontal. Objects maintain their real-world proportions rather than being squished or stretched to fill the bounding box.

This means the set avoids the "toy" look that comes from making every icon the same width and height. A pencil is tall and narrow. A monitor is wide and short. They should look that way.

![Natural proportions examples](/images/natural-proportions.png)

## Consistency

Recurring elements — folders, files, flasks, eyes, arrows, badges — are drawn identically every time they appear. If a folder shows up in ten different icons, it's the same folder. This compounds into a set that feels unified rather than assembled from parts.

![Consistency examples](/images/consistency.gif)

## Complexity and testing

Every icon should be tested at its intended display size. A 16px icon needs to read clearly at 16 pixels — not just look good zoomed in on a design canvas.

The goal is the right amount of detail: enough to communicate clearly, not so much that the icon feels busy or cluttered. When in doubt, simplify.
