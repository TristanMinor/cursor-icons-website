import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import addingAnIcon from "../docs/adding-an-icon.md?raw";
import designPhilosophy from "../docs/design-philosophy.md?raw";

function stripTitle(md: string): string {
  return md.replace(/^#\s+.+\n+/, "");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function extractToc(md: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const lines = md.split("\n");
  let inCodeBlock = false;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      entries.push({ id: slugify(text), text, level });
    }
  }
  return entries;
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

function CopyLinkButton({ id }: { id: string }) {
  const handleClick = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    window.history.replaceState(null, "", `#${id}`);
  }, [id]);

  return (
    <button
      className="docs-heading-copy"
      onClick={handleClick}
      title="Copy link to section"
      aria-label="Copy link to section"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 4.875C1.84518 4.875 2.125 5.15482 2.125 5.5V13.5C2.125 13.7071 2.29289 13.875 2.5 13.875H10.5C10.8452 13.875 11.125 14.1548 11.125 14.5C11.125 14.8452 10.8452 15.125 10.5 15.125H2.5C1.60254 15.125 0.875 14.3975 0.875 13.5V5.5C0.875 5.15482 1.15482 4.875 1.5 4.875ZM13.5 0.875C14.3975 0.875 15.125 1.60254 15.125 2.5V10.5C15.125 11.3975 14.3975 12.125 13.5 12.125H5.5C4.60254 12.125 3.875 11.3975 3.875 10.5V2.5C3.875 1.60254 4.60254 0.875 5.5 0.875H13.5ZM5.5 2.125C5.29289 2.125 5.125 2.29289 5.125 2.5V10.5C5.125 10.7071 5.29289 10.875 5.5 10.875H13.5C13.7071 10.875 13.875 10.7071 13.875 10.5V2.5C13.875 2.29289 13.7071 2.125 13.5 2.125H5.5Z" />
      </svg>
    </button>
  );
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [active, setActive] = useState(false);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Trigger enter animation on next frame
    requestAnimationFrame(() => setActive(true));
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Close on scroll
  useEffect(() => {
    const onScroll = () => onClose();
    window.addEventListener("scroll", onScroll, { capture: true, once: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, [onClose]);

  // Capture origin rect from the source image
  useEffect(() => {
    const sourceImg = document.querySelector(`img[data-lightbox-src="${src}"]`) as HTMLElement | null;
    if (sourceImg) {
      setOrigin(sourceImg.getBoundingClientRect());
    }
  }, [src]);

  return (
    <div
      className="docs-lightbox"
      data-active={active}
      onClick={onClose}
    >
      <button className="docs-lightbox-close" onClick={onClose} title="Close" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="5" y1="5" x2="15" y2="15" />
          <line x1="15" y1="5" x2="5" y2="15" />
        </svg>
      </button>
      <img
        ref={imgRef}
        className="docs-lightbox-img"
        src={src}
        alt={alt}
        style={
          !active && origin
            ? {
                position: "fixed",
                left: origin.left,
                top: origin.top,
                width: origin.width,
                height: origin.height,
              }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

interface DocsPageProps {
  activeSlug: string;
}

export function DocsPage({ activeSlug }: DocsPageProps) {
  const activeDoc = DOCS.find((d) => d.slug === activeSlug) ?? DOCS[0];
  const toc = useMemo(() => extractToc(activeDoc.content), [activeDoc.content]);
  const [lightboxSrc, setLightboxSrc] = useState<{ src: string; alt: string } | null>(null);

  // Scroll to hash on mount or doc change
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [activeSlug]);

  // Reset lightbox on doc change
  useEffect(() => {
    setLightboxSrc(null);
  }, [activeSlug]);

  return (
    <div className="docs-layout">
      <article className="docs-prose">
        <div className="docs-header">
          <p className="docs-subtitle">Docs</p>
          <h1 className="docs-title">{activeDoc.title}</h1>
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => {
              const text = String(children);
              const id = slugify(text);
              return (
                <h2 id={id} className="docs-heading-anchor">
                  {children}
                  <CopyLinkButton id={id} />
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = String(children);
              const id = slugify(text);
              return (
                <h3 id={id} className="docs-heading-anchor">
                  {children}
                  <CopyLinkButton id={id} />
                </h3>
              );
            },
            img: ({ alt, src }) =>
              src === "todo-image" ? (
                <span className="docs-image-placeholder">{alt}</span>
              ) : (
                <img
                  alt={alt || ""}
                  src={src}
                  data-lightbox-src={src}
                  className="docs-zoomable-img"
                  onClick={() => src && setLightboxSrc({ src, alt: alt || "" })}
                />
              ),
          }}
        >
          {activeDoc.contentWithoutTitle}
        </ReactMarkdown>
      </article>
      <nav className="docs-toc">
        {toc.map((entry) => (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            className="docs-toc-item"
            data-level={entry.level}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(entry.id);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                window.history.replaceState(null, "", `#${entry.id}`);
              }
            }}
          >
            {entry.text}
          </a>
        ))}
      </nav>
      {lightboxSrc && (
        <ImageLightbox
          src={lightboxSrc.src}
          alt={lightboxSrc.alt}
          onClose={() => setLightboxSrc(null)}
        />
      )}
    </div>
  );
}

export const DEFAULT_DOC_SLUG = DOCS[0].slug;
