import { useMemo } from "react";
import type { IconData } from "../types";

export function useIconSearch(
  icons: IconData[],
  query: string
): IconData[] {
  return useMemo(() => {
    if (!query.trim()) return icons;

    const terms = query.toLowerCase().trim().split(/\s+/);

    return icons.filter((icon) => {
      const searchable = [
        icon.name,
        icon.displayName.toLowerCase(),
        icon.unicode?.toLowerCase() ?? "",
        ...icon.tags,
      ].join(" ");

      return terms.every((term) => searchable.includes(term));
    });
  }, [icons, query]);
}
