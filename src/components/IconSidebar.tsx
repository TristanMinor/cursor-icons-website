import { useState, useCallback } from "react";
import type { IconData, IconSize, IconStyle } from "../types";
import { ICON_X, ICON_COPY, ICON_CHECK, ICON_DOWNLOAD } from "../icons";

interface IconSidebarProps {
  icon: IconData;
  size: IconSize;
  style: IconStyle;
  onClose: () => void;
}

export function IconSidebar({ icon, size, style, onClose }: IconSidebarProps) {
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState(96);
  const svgContent = icon.svg[size]?.[style] ?? icon.svg["16"]?.[style] ?? "";

  const showCopied = useCallback((action: string) => {
    setCopiedAction(action);
    setTimeout(() => setCopiedAction(null), 1500);
  }, []);

  const copySvg = useCallback(() => {
    navigator.clipboard.writeText(svgContent);
    showCopied("svg");
  }, [svgContent, showCopied]);

  const downloadSvg = useCallback(() => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${icon.name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [svgContent, icon.name]);

  const copySymbol = useCallback(() => {
    if (icon.unicode) {
      const char = String.fromCodePoint(parseInt(icon.unicode, 16));
      navigator.clipboard.writeText(char);
      showCopied("symbol");
    }
  }, [icon.unicode, showCopied]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">{icon.displayName}</span>
        <button className="sidebar-close" onClick={onClose} title="Close">
          <span dangerouslySetInnerHTML={{ __html: ICON_X }} />
        </button>
      </div>

      {/* Single preview with zoom */}
      <div className="sidebar-preview">
        <div
          className="sidebar-preview-icon"
          style={{ width: previewSize, height: previewSize }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {/* Preview zoom slider */}
      <div className="sidebar-zoom">
        <input
          type="range"
          min={16}
          max={256}
          step={1}
          value={previewSize}
          onChange={(e) => setPreviewSize(Number(e.target.value))}
        />
        <input
          type="number"
          className="sidebar-zoom-input"
          value={previewSize}
          min={16}
          max={256}
          onChange={(e) => {
            const val = Math.max(16, Math.min(256, Number(e.target.value) || 16));
            setPreviewSize(val);
          }}
        />
        <span className="sidebar-zoom-unit">px</span>
      </div>

      {/* Name */}
      <div className="sidebar-section">
        <div className="sidebar-label">Name</div>
        <div className="sidebar-value">{icon.name}</div>
      </div>

      {/* Unicode */}
      {icon.unicode && (
        <div className="sidebar-section">
          <div className="sidebar-label">Unicode</div>
          <div className="sidebar-value-row">
            <span className="sidebar-value-mono">U+{icon.unicode}</span>
            <button
              className="sidebar-copy-inline"
              data-copied={copiedAction === "unicode"}
              onClick={() => {
                navigator.clipboard.writeText(`U+${icon.unicode}`);
                showCopied("unicode");
              }}
              title="Copy Unicode"
            >
              <span dangerouslySetInnerHTML={{ __html: copiedAction === "unicode" ? ICON_CHECK : ICON_COPY }} />
            </button>
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="sidebar-section">
        <div className="sidebar-label">Tags</div>
        <div className="sidebar-tags">
          {icon.tags.map((tag) => (
            <span key={tag} className="sidebar-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="sidebar-actions">
        <div className="sidebar-actions-row">
          <button
            className="sidebar-action-btn sidebar-action-btn-vertical"
            data-copied={copiedAction === "svg"}
            onClick={copySvg}
          >
            <span dangerouslySetInnerHTML={{ __html: ICON_COPY }} />
            {copiedAction === "svg" ? "Copied!" : "Copy SVG"}
          </button>
          <button
            className="sidebar-action-btn sidebar-action-btn-vertical"
            onClick={downloadSvg}
          >
            <span dangerouslySetInnerHTML={{ __html: ICON_DOWNLOAD }} />
            Download SVG
          </button>
        </div>
        {icon.unicode && (
          <button
            className="sidebar-action-btn sidebar-action-btn-full"
            data-copied={copiedAction === "symbol"}
            onClick={copySymbol}
          >
            <span dangerouslySetInnerHTML={{ __html: ICON_COPY }} />
            {copiedAction === "symbol" ? "Copied!" : "Copy Symbol"}
          </button>
        )}
      </div>
    </div>
  );
}
