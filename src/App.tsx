import { useState, useEffect, useMemo } from "react";
import { Toolbar } from "./components/Toolbar";
import { IconGrid } from "./components/IconGrid";
import { IconSidebar } from "./components/IconSidebar";
import { PasswordGate } from "./components/PasswordGate";
import { useIconSearch } from "./hooks/useIconSearch";
import type { IconSize, IconStyle, IconDataFile } from "./types";
import iconDataRaw from "./generated/icons.json";

const iconData = iconDataRaw as IconDataFile;

function App() {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState<IconSize>("16");
  const [style, setStyle] = useState<IconStyle>("outline");
  const [displaySize, setDisplaySize] = useState(16);
  const [showNames, setShowNames] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

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
