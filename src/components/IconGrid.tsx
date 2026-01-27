import type { IconData, IconSize, IconStyle } from "../types";
import { IconCell } from "./IconCell";

interface IconGridProps {
  icons: IconData[];
  size: IconSize;
  style: IconStyle;
  displaySize: number;
  showNames: boolean;
  selectedIcon: string | null;
  onSelectIcon: (name: string) => void;
}

export function IconGrid({
  icons,
  size,
  style,
  displaySize,
  showNames,
  selectedIcon,
  onSelectIcon,
}: IconGridProps) {
  if (icons.length === 0) {
    return (
      <div className="icon-grid-empty">
        <div className="icon-grid-empty-title">No icons found</div>
        <div className="icon-grid-empty-text">
          Try a different search term
        </div>
      </div>
    );
  }

  // Check if this size has any icons at all
  const hasIcons = icons.some((icon) => icon.svg[size]?.[style] !== null);

  if (!hasIcons) {
    return (
      <div className="icon-grid-empty">
        <div className="icon-grid-empty-title">No {size}px icons yet</div>
        <div className="icon-grid-empty-text">
          This size is not yet available. Drop SVGs into source/icons/{size}/{style}/ to populate.
        </div>
      </div>
    );
  }

  // Scale gap proportionally: 4px at 12px, up to 16px at 96px
  const gap = Math.round(4 + (displaySize - 12) * (12 / 84));
  const padding = Math.round(8 + (displaySize - 12) * (12 / 84));
  const cellSize = displaySize + padding * 2 + (showNames ? 22 : 0);

  return (
    <div
      className="icon-grid"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${cellSize}px, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {icons.map((icon) => (
        <IconCell
          key={icon.name}
          icon={icon}
          size={size}
          style={style}
          displaySize={displaySize}
          showName={showNames}
          padding={padding}
          selected={selectedIcon === icon.name}
          onSelect={() => onSelectIcon(icon.name)}
        />
      ))}
    </div>
  );
}
