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
const LEAVE_DELAY = 150;

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
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelEnter = useCallback(() => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
  }, []);

  const cancelLeave = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const handleCellEnter = useCallback(() => {
    cancelLeave();
    enterTimerRef.current = setTimeout(() => {
      if (cellRef.current) {
        setAnchorRect(cellRef.current.getBoundingClientRect());
        setShowTooltip(true);
      }
    }, HOVER_DELAY);
  }, [cancelLeave]);

  const handleCellLeave = useCallback(() => {
    cancelEnter();
    leaveTimerRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, LEAVE_DELAY);
  }, [cancelEnter]);

  const handleTooltipEnter = useCallback(() => {
    cancelLeave();
  }, [cancelLeave]);

  const handleTooltipLeave = useCallback(() => {
    leaveTimerRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, LEAVE_DELAY);
  }, []);

  useEffect(() => {
    return () => {
      cancelEnter();
      cancelLeave();
    };
  }, [cancelEnter, cancelLeave]);

  if (!svgContent) return null;

  return (
    <>
      <div
        ref={cellRef}
        className="icon-cell"
        data-selected={selected}
        onClick={onSelect}
        onMouseEnter={handleCellEnter}
        onMouseLeave={handleCellLeave}
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
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        />,
        document.body
      )}
    </>
  );
}
