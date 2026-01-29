import { useState, useEffect, useMemo, useCallback } from "react";
import { Toolbar } from "./components/Toolbar";
import { IconGrid } from "./components/IconGrid";
import { IconSidebar } from "./components/IconSidebar";
import { SideNav } from "./components/SideNav";
import { ConceptsTable } from "./components/ConceptsTable";
import { DocsPage, DEFAULT_DOC_SLUG, getDocTitle } from "./components/DocsPage";
import { PasswordGate } from "./components/PasswordGate";
import { useIconSearch } from "./hooks/useIconSearch";
import { CONCEPTS } from "./data/concepts";
import type { IconSize, IconStyle, IconDataFile } from "./types";
import type { Page } from "./components/SideNav";
import iconDataRaw from "./generated/icons.json";

const iconData = iconDataRaw as IconDataFile;

function getPageFromPath(): Page {
  const path = window.location.pathname.replace(/\/+$/, "");
  if (path === "/concepts") return "concepts";
  if (path.startsWith("/docs")) return "docs";
  return "icons";
}

function getDocSlugFromPath(): string {
  const path = window.location.pathname.replace(/\/+$/, "");
  const match = path.match(/^\/docs\/(.+)/);
  return match ? match[1] : DEFAULT_DOC_SLUG;
}

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

  const [page, setPage] = useState<Page>(getPageFromPath);
  const [docSlug, setDocSlug] = useState(getDocSlugFromPath);
  const [menuOpen, setMenuOpen] = useState(true);
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

  const navigateTo = useCallback((p: Page) => {
    setPage(p);
    if (p !== "icons") {
      setSelectedIcon(null);
    }
    let basePath = "/";
    if (p === "concepts") basePath = "/concepts";
    if (p === "docs") basePath = `/docs/${docSlug}`;
    window.history.pushState(null, "", basePath + window.location.hash);
  }, [docSlug]);

  const navigateToDoc = useCallback((slug: string) => {
    setPage("docs");
    setDocSlug(slug);
    setSelectedIcon(null);
    window.history.pushState(null, "", `/docs/${slug}`);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      setPage(getPageFromPath());
      setDocSlug(getDocSlugFromPath());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
        window.history.replaceState(null, "", window.location.pathname + (newHash || ""));
      }
    },
    [size, style, displaySize, showNames, selectedIcon, query]
  );

  useEffect(() => {
    if (page !== "docs") {
      updateHash();
    }
  }, [updateHash, page]);

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

  const showSidebar = page === "icons" && selectedIconData;

  return (
    <PasswordGate>
    <div className="app-shell">
      <SideNav
        open={menuOpen}
        page={page}
        docSlug={docSlug}
        onPageChange={navigateTo}
        onDocChange={navigateToDoc}
      />
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
          page={page}
          onMenuToggle={() => setMenuOpen((v) => !v)}
          docTitle={page === "docs" ? getDocTitle(docSlug) : undefined}
        />
        <div className="app-body">
          <div className="app-main">
            {page === "icons" ? (
              <IconGrid
                icons={filteredIcons}
                size={size}
                style={style}
                displaySize={displaySize}
                showNames={showNames}
                selectedIcon={selectedIcon}
                onSelectIcon={setSelectedIcon}
              />
            ) : page === "concepts" ? (
              <ConceptsTable
                concepts={CONCEPTS}
                allIcons={allIcons}
                size={size}
                style={style}
                displaySize={displaySize}
                query={query}
              />
            ) : (
              <DocsPage
                activeSlug={docSlug}
              />
            )}
          </div>
          {showSidebar && (
            <IconSidebar
              icon={selectedIconData}
              size={size}
              style={style}
              onClose={() => setSelectedIcon(null)}
            />
          )}
        </div>
      </div>
    </div>
    </PasswordGate>
  );
}

export default App;
