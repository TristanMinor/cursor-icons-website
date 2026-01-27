import type { IconSize, IconStyle } from "../types";
import { ICON_SEARCH, ICON_X, ICON_SUN, ICON_MOON } from "../icons";

interface ToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  size: IconSize;
  onSizeChange: (size: IconSize) => void;
  style: IconStyle;
  onStyleChange: (style: IconStyle) => void;
  displaySize: number;
  onDisplaySizeChange: (size: number) => void;
  showNames: boolean;
  onShowNamesChange: (show: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (dark: boolean) => void;
  iconCount: number;
  totalCount: number;
}

export function Toolbar({
  query,
  onQueryChange,
  size,
  onSizeChange,
  style,
  onStyleChange,
  displaySize,
  onDisplaySizeChange,
  showNames,
  onShowNamesChange,
  darkMode,
  onDarkModeChange,
  iconCount,
  totalCount,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      {/* Search */}
      <div className="toolbar-search">
        <span className="toolbar-search-icon" dangerouslySetInnerHTML={{ __html: ICON_SEARCH }} />
        <input
          className="toolbar-search-input"
          type="text"
          placeholder="Search icons by name, tag, or unicode..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {query && (
          <button
            className="toolbar-search-clear"
            onClick={() => onQueryChange("")}
            title="Clear search"
          >
            <span dangerouslySetInnerHTML={{ __html: ICON_X }} />
          </button>
        )}
      </div>

      <div className="toolbar-divider" />

      {/* Size toggle */}
      <div className="toolbar-group">
        <button
          className="toolbar-toggle"
          data-active={size === "16"}
          onClick={() => onSizeChange("16")}
        >
          16px
        </button>
        <button
          className="toolbar-toggle"
          data-active={size === "24"}
          onClick={() => onSizeChange("24")}
        >
          24px
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Style toggle */}
      <div className="toolbar-group">
        <button
          className="toolbar-toggle"
          data-active={style === "outline"}
          onClick={() => onStyleChange("outline")}
        >
          Outline
        </button>
        <button
          className="toolbar-toggle"
          data-active={style === "filled"}
          onClick={() => onStyleChange("filled")}
        >
          Filled
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Show names toggle */}
      <button
        className="toolbar-toggle"
        data-active={showNames}
        onClick={() => onShowNamesChange(!showNames)}
      >
        Names
      </button>

      <div className="toolbar-divider" />

      {/* Display size slider with editable input */}
      <div className="toolbar-slider">
        <input
          type="range"
          min={12}
          max={96}
          step={1}
          value={displaySize}
          onChange={(e) => onDisplaySizeChange(Number(e.target.value))}
        />
        <input
          type="number"
          className="toolbar-slider-input"
          value={displaySize}
          min={12}
          max={96}
          onChange={(e) => {
            const val = Math.max(12, Math.min(96, Number(e.target.value) || 12));
            onDisplaySizeChange(val);
          }}
        />
        <span className="toolbar-slider-label">px</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Icon count */}
      <span className="toolbar-icon-count">
        {iconCount === totalCount
          ? `${totalCount} icons`
          : `${iconCount} / ${totalCount}`}
      </span>

      <div className="toolbar-divider" />

      {/* Dark mode toggle */}
      <button
        className="toolbar-btn"
        onClick={() => onDarkModeChange(!darkMode)}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span dangerouslySetInnerHTML={{ __html: darkMode ? ICON_SUN : ICON_MOON }} />
      </button>
    </div>
  );
}
