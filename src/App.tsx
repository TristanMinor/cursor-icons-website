import { useState, useEffect, useMemo, useCallback } from "react";
import { Toolbar } from "./components/Toolbar";
import { IconGrid } from "./components/IconGrid";
import { IconSidebar } from "./components/IconSidebar";
import { PasswordGate } from "./components/PasswordGate";
import { useIconSearch } from "./hooks/useIconSearch";
import type { IconSize, IconStyle, IconDataFile } from "./types";
import iconDataRaw from "./generated/icons.json";

const iconData = iconDataRaw as IconDataFile;

function parseHash(): Record<string, string> {
  const params: Record<string, string> = {};
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return params;
  for (const part of hash.split("&")) {
    const [k, v] = part.split("=");
    if (k && v !== undefined) params[decodeURIComponent(k)] = decodeURIComponent(v);
  }
  return params;
}

function App() {
  const initial = useMemo(() => parseHash(), []);

  const [query, setQuery] = useState(initial.q || "");
  const [size, setSize] = useState<IconSize>(
    initial.size === "24" ? "24" : "16"
  );
  const [style, setStyle] = useState<IconStyle>(
    initial.style === "filled" ? "filled" : "outline"
  );
  const [displaySize, setDisplaySize] = useState(
    initial.scale ? Math.max(12, Math.min(96, Number(initial.scale) || 16)) : (initial.size === "24" ? 24 : 16)
  );
  const [showNames, setShowNames] = useState(initial.names === "1");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    initial.icon || null
  );
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Sync state to URL hash
  const updateHash = useCallback(
    (overrides: Record<string, string | null> = {}) => {
      const state: Record<string, string | null> = {
        size,
        style,
        scale: String(displaySize),
        names: showNames ? "1" : null,
        icon: selectedIcon,
        q: query || null,
        ...overrides,
      };
      const parts: string[] = [];
      for (const [k, v] of Object.entries(state)) {
        if (v !== null && v !== undefined) {
          parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        }
      }
      const newHash = parts.length ? `#${parts.join("&")}` : "";
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, "", newHash || window.location.pathname);
      }
    },
    [size, style, displaySize, showNames, selectedIcon, query]
  );

  useEffect(() => {
    updateHash();
  }, [updateHash]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const allIcons = useMemo(() => iconData.icons, []);
  const filteredIcons = useIconSearch(allIcons, query);

  const selectedIconData = useMemo(
    () => allIcons.find((i) => i.name === selectedIcon) ?? null,
    [allIcons, selectedIcon]
  );

  return (
    <PasswordGate>
    <div className="app">
      <Toolbar
        query={query}
        onQueryChange={setQuery}
        size={size}
        onSizeChange={(s) => {
          setSize(s);
          setDisplaySize(Number(s));
        }}
        style={style}
        onStyleChange={setStyle}
        displaySize={displaySize}
        onDisplaySizeChange={setDisplaySize}
        showNames={showNames}
        onShowNamesChange={setShowNames}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
        iconCount={filteredIcons.length}
        totalCount={allIcons.length}
      />
      <div className="app-body">
        <div className="app-main">
          <IconGrid
            icons={filteredIcons}
            size={size}
            style={style}
            displaySize={displaySize}
            showNames={showNames}
            selectedIcon={selectedIcon}
            onSelectIcon={setSelectedIcon}
          />
        </div>
        {selectedIconData && (
          <IconSidebar
            icon={selectedIconData}
            size={size}
            style={style}
            onClose={() => setSelectedIcon(null)}
          />
        )}
      </div>
    </div>
    </PasswordGate>
  );
}

export default App;
