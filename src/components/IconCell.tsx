import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import type { IconData, IconSize, IconStyle } from "../types";
import { IconTooltip } from "./IconTooltip";

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

const HOVER_DELAY = 400;

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (cellRef.current) {
        setAnchorRect(cellRef.current.getBoundingClientRect());
        setShowTooltip(true);
      }
    }, HOVER_DELAY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowTooltip(false);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!svgContent) return null;

  return (
    <>
      <div
        ref={cellRef}
        className="icon-cell"
        data-selected={selected}
        onClick={onSelect}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ padding }}
      >
        <div
          className="icon-cell-svg"
          style={{ width: displaySize, height: displaySize }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        {showName && <div className="icon-cell-name">{icon.name}</div>}
      </div>
      {showTooltip && anchorRect && createPortal(
        <IconTooltip
          icon={icon}
          size={size}
          style={style}
          anchorRect={anchorRect}
        />,
        document.body
      )}
    </>
  );
}
