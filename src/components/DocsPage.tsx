import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import addingAnIcon from "../docs/adding-an-icon.md?raw";
import designPhilosophy from "../docs/design-philosophy.md?raw";

function stripTitle(md: string): string {
  return md.replace(/^#\s+.+\n+/, "");
}

interface DocEntry {
  slug: string;
  title: string;
  content: string;
  contentWithoutTitle: string;
}

const DOCS: DocEntry[] = [
  { slug: "adding-an-icon", title: "Adding an Icon", content: addingAnIcon, contentWithoutTitle: stripTitle(addingAnIcon) },
  { slug: "design-philosophy", title: "Design Philosophy", content: designPhilosophy, contentWithoutTitle: stripTitle(designPhilosophy) },
];

interface DocsPageProps {
  activeSlug: string;
  onNavigate: (slug: string) => void;
}

export function DocsPage({ activeSlug, onNavigate }: DocsPageProps) {
  const activeDoc = DOCS.find((d) => d.slug === activeSlug) ?? DOCS[0];

  return (
    <div className="docs-layout">
      <nav className="docs-sidebar">
        {DOCS.map((doc) => (
          <button
            key={doc.slug}
            className="docs-sidebar-item"
            data-active={doc.slug === activeDoc.slug}
            onClick={() => onNavigate(doc.slug)}
          >
            {doc.title}
          </button>
        ))}
      </nav>
      <article className="docs-prose">
        <div className="docs-header">
          <p className="docs-subtitle">Docs</p>
          <h1 className="docs-title">{activeDoc.title}</h1>
        </div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {activeDoc.contentWithoutTitle}
        </ReactMarkdown>
      </article>
    </div>
  );
}

export const DEFAULT_DOC_SLUG = DOCS[0].slug;
