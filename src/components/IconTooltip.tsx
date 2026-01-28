import { useState, useCallback, useRef, useEffect } from "react";
import type { IconData, IconSize, IconStyle } from "../types";
import { ICON_COPY, ICON_CHECK, ICON_DOWNLOAD } from "../icons";

interface IconTooltipProps {
  icon: IconData;
  size: IconSize;
  style: IconStyle;
  anchorRect: DOMRect;
}

export function IconTooltip({ icon, size, style, anchorRect }: IconTooltipProps) {
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const svgContent = icon.svg[size]?.[style] ?? icon.svg["16"]?.[style] ?? "";

  const showCopied = useCallback((action: string) => {
    setCopiedAction(action);
    setTimeout(() => setCopiedAction(null), 1500);
  }, []);

  const copySvg = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(svgContent);
    showCopied("svg");
  }, [svgContent, showCopied]);

  const downloadSvg = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${icon.name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [svgContent, icon.name]);

  const copySymbol = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (icon.unicode) {
      const char = String.fromCodePoint(parseInt(icon.unicode, 16));
      navigator.clipboard.writeText(char);
      showCopied("symbol");
    }
  }, [icon.unicode, showCopied]);

  // Smart positioning: ensure tooltip stays fully on screen
  useEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const tooltipW = tooltip.offsetWidth;
    const tooltipH = tooltip.offsetHeight;
    const gap = 8;
    const margin = 12;

    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    // Default: center horizontally below the anchor
    let left = anchorRect.left + anchorRect.width / 2 - tooltipW / 2;
    let top = anchorRect.bottom + gap;

    // If tooltip goes below viewport, show above
    if (top + tooltipH > viewH - margin) {
      top = anchorRect.top - tooltipH - gap;
    }

    // If still goes above viewport, just pin to top
    if (top < margin) {
      top = margin;
    }

    // Clamp horizontal
    if (left < margin) {
      left = margin;
    } else if (left + tooltipW > viewW - margin) {
      left = viewW - tooltipW - margin;
    }

    setPosition({ top, left });
  }, [anchorRect]);

  return (
    <div
      ref={tooltipRef}
      className="icon-tooltip"
      style={{ top: position.top, left: position.left }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Preview */}
      <div className="icon-tooltip-preview">
        <div
          className="icon-tooltip-preview-icon"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Name and Unicode */}
      <div className="icon-tooltip-info">
        <span className="icon-tooltip-name">{icon.name}</span>
        {icon.unicode && (
          <span className="icon-tooltip-unicode">U+{icon.unicode}</span>
        )}
      </div>

      {/* Actions */}
      <div className="icon-tooltip-actions">
        <button
          className="icon-tooltip-action"
          data-copied={copiedAction === "svg"}
          onClick={copySvg}
        >
          <span dangerouslySetInnerHTML={{ __html: copiedAction === "svg" ? ICON_CHECK : ICON_COPY }} />
          {copiedAction === "svg" ? "Copied" : "Copy SVG"}
        </button>
        <button
          className="icon-tooltip-action"
          onClick={downloadSvg}
        >
          <span dangerouslySetInnerHTML={{ __html: ICON_DOWNLOAD }} />
          Download
        </button>
        {icon.unicode && (
          <button
            className="icon-tooltip-action"
            data-copied={copiedAction === "symbol"}
            onClick={copySymbol}
          >
            <span dangerouslySetInnerHTML={{ __html: copiedAction === "symbol" ? ICON_CHECK : ICON_COPY }} />
            {copiedAction === "symbol" ? "Copied" : "Symbol"}
          </button>
        )}
      </div>
    </div>
  );
}
