export type Page = "icons" | "concepts" | "docs";

interface SideNavProps {
  open: boolean;
  page: Page;
  docSlug: string;
  onPageChange: (page: Page) => void;
  onDocChange: (slug: string) => void;
}

export function SideNav({ open, page, docSlug, onPageChange, onDocChange }: SideNavProps) {
  return (
    <nav className="sidenav" data-open={open}>
      <span className="sidenav-section">Icons</span>
      <button
        className="sidenav-item"
        data-active={page === "icons"}
        onClick={() => onPageChange("icons")}
      >
        Icons
      </button>
      <button
        className="sidenav-item"
        data-active={page === "concepts"}
        onClick={() => onPageChange("concepts")}
      >
        Concepts
      </button>

      <span className="sidenav-section">Docs</span>
      <button
        className="sidenav-item"
        data-active={page === "docs" && docSlug === "adding-an-icon"}
        onClick={() => onDocChange("adding-an-icon")}
      >
        Adding an Icon
      </button>
      <button
        className="sidenav-item"
        data-active={page === "docs" && docSlug === "design-philosophy"}
        onClick={() => onDocChange("design-philosophy")}
      >
        Design Philosophy
      </button>
    </nav>
  );
}
