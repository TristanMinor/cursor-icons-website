import { useState, useCallback, useMemo } from "react";
import type { IconData, IconSize, IconStyle } from "../types";
import type { ConceptEntry } from "../data/concepts";
import { ICON_COPY, ICON_CHECK, ICON_DOWNLOAD } from "../icons";

type SortKey = "concept" | "iconName" | "status";
type SortDir = "asc" | "desc";

interface ConceptsTableProps {
  concepts: ConceptEntry[];
  allIcons: IconData[];
  size: IconSize;
  style: IconStyle;
  displaySize: number;
  query: string;
}

export function ConceptsTable({ concepts, allIcons, size, style, displaySize, query }: ConceptsTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("concept");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = useCallback((key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }, [sortKey]);

  const findIcon = useCallback((iconName: string) => {
    return allIcons.find((i) => i.name === iconName) ?? null;
  }, [allIcons]);

  const getSvg = useCallback((icon: IconData | null) => {
    if (!icon) return "";
    return icon.svg[size]?.[style] ?? icon.svg["16"]?.[style] ?? "";
  }, [size, style]);

  const showCopied = useCallback((key: string) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }, []);

  const copySvg = useCallback((svg: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(svg);
    showCopied(key);
  }, [showCopied]);

  const downloadSvg = useCallback((svg: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const copySymbol = useCallback((unicode: string | null, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (unicode) {
      const char = String.fromCodePoint(parseInt(unicode, 16));
      navigator.clipboard.writeText(char);
      showCopied(key);
    }
  }, [showCopied]);

  const lowerQuery = query.toLowerCase();

  const sorted = useMemo(() => {
    const filtered = lowerQuery
      ? concepts.filter(
          (e) =>
            e.concept.toLowerCase().includes(lowerQuery) ||
            e.iconName.toLowerCase().includes(lowerQuery)
        )
      : [...concepts];

    filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return filtered;
  }, [concepts, lowerQuery, sortKey, sortDir]);

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " \u2227" : " \u2228";
  };

  return (
    <div className="concepts-table-wrapper">
      <table className="concepts-table">
        <thead>
          <tr>
            <th className="concepts-th-concept" onClick={() => toggleSort("concept")}>
              Concept{sortIndicator("concept")}
            </th>
            <th className="concepts-th-icon" onClick={() => toggleSort("iconName")}>
              Icon{sortIndicator("iconName")}
            </th>
            <th className="concepts-th-status" onClick={() => toggleSort("status")}>
              Status{sortIndicator("status")}
            </th>
            <th className="concepts-th-actions"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry) => {
            const icon = findIcon(entry.iconName);
            const svg = getSvg(icon);
            const rowKey = entry.concept;
            const svgCopiedKey = `svg-${rowKey}`;
            const symbolCopiedKey = `sym-${rowKey}`;

            return (
              <tr key={rowKey} className="concepts-row">
                <td className="concepts-cell-concept">
                  <span
                    className="concepts-cell-icon"
                    style={{ width: displaySize, height: displaySize }}
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                  <span className="concepts-cell-name">{entry.concept}</span>
                </td>
                <td className="concepts-cell-iconname"><code>{entry.iconName}</code></td>
                <td className="concepts-cell-status">
                  <span
                    className="concepts-status-badge"
                    data-status={entry.status}
                  >
                    {entry.status === "approved" ? "Approved" : "To be reviewed"}
                  </span>
                </td>
                <td className="concepts-cell-actions">
                  <div className="concepts-actions-row">
                    <button
                      className="concepts-action-btn"
                      data-copied={copiedKey === svgCopiedKey}
                      onClick={(e) => copySvg(svg, svgCopiedKey, e)}
                    >
                      <span dangerouslySetInnerHTML={{ __html: copiedKey === svgCopiedKey ? ICON_CHECK : ICON_COPY }} />
                      {copiedKey === svgCopiedKey ? "Copied!" : "Copy SVG"}
                    </button>
                    <button
                      className="concepts-action-btn"
                      onClick={(e) => downloadSvg(svg, entry.iconName, e)}
                    >
                      <span dangerouslySetInnerHTML={{ __html: ICON_DOWNLOAD }} />
                      Download SVG
                    </button>
                    {icon?.unicode && (
                      <button
                        className="concepts-action-btn"
                        data-copied={copiedKey === symbolCopiedKey}
                        onClick={(e) => copySymbol(icon.unicode, symbolCopiedKey, e)}
                      >
                        <span dangerouslySetInnerHTML={{ __html: copiedKey === symbolCopiedKey ? ICON_CHECK : ICON_COPY }} />
                        {copiedKey === symbolCopiedKey ? "Copied!" : "Copy Symbol"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
