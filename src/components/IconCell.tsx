import type { IconData, IconSize, IconStyle } from "../types";

interface IconCellProps {
  icon: IconData;
  size: IconSize;
  style: IconStyle;
  displaySize: number;
  showName: boolean;
  padding: number;
  selected: boolean;
  onSelect: () => void;
}

export function IconCell({
  icon,
  size,
  style,
  displaySize,
  showName,
  padding,
  selected,
  onSelect,
}: IconCellProps) {
  const svgContent = icon.svg[size]?.[style];
  if (!svgContent) return null;

  return (
    <div
      className="icon-cell"
      data-selected={selected}
      onClick={onSelect}
      title={icon.displayName}
      style={{ padding }}
    >
      <div
        className="icon-cell-svg"
        style={{ width: displaySize, height: displaySize }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      {showName && <div className="icon-cell-name">{icon.name}</div>}
    </div>
  );
}
