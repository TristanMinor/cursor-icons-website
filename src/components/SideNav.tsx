export type Page = "icons" | "concepts";

interface SideNavProps {
  open: boolean;
  page: Page;
  onPageChange: (page: Page) => void;
}

export function SideNav({ open, page, onPageChange }: SideNavProps) {
  return (
    <nav className="sidenav" data-open={open}>
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
    </nav>
  );
}
