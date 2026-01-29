import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import addingAnIcon from "../docs/adding-an-icon.md?raw";
import designPhilosophy from "../docs/design-philosophy.md?raw";
import { ICON_COPY, ICON_X, ICON_CHEVRONS_LR } from "../icons";

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
      dangerouslySetInnerHTML={{ __html: ICON_COPY }}
    />
  );
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [active, setActive] = useState(false);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setActive(true));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const onScroll = () => onClose();
    window.addEventListener("scroll", onScroll, { capture: true, once: true });
    return () => window.removeEventListener("scroll", onScroll, { capture: true });
  }, [onClose]);

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
      <button
        className="docs-lightbox-close"
        onClick={onClose}
        title="Close"
        aria-label="Close"
        dangerouslySetInnerHTML={{ __html: ICON_X }}
      />
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

function CompareSlider({ srcA, srcB, labelA, labelB }: { srcA: string; srcB: string; labelA: string; labelB: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const labelARef = useRef<HTMLSpanElement>(null);
  const labelBRef = useRef<HTMLSpanElement>(null);
  const dragging = useRef(false);

  const applyPosition = useCallback((pct: number) => {
    if (overlayRef.current) overlayRef.current.style.clipPath = `inset(0 0 0 ${pct}%)`;
    if (dividerRef.current) dividerRef.current.style.left = `${pct}%`;
    if (labelARef.current) labelARef.current.style.opacity = pct < 10 ? "0" : "1";
    if (labelBRef.current) labelBRef.current.style.opacity = pct > 90 ? "0" : "1";
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    applyPosition((x / rect.width) * 100);
  }, [applyPosition]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) {
        e.preventDefault();
        updatePosition(e.clientX);
      }
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [updatePosition]);

  useEffect(() => {
    const onMove = (e: TouchEvent) => {
      if (dragging.current) {
        e.preventDefault();
        updatePosition(e.touches[0].clientX);
      }
    };
    const onEnd = () => { dragging.current = false; };
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className="compare-slider"
      onMouseDown={(e) => { dragging.current = true; updatePosition(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; updatePosition(e.touches[0].clientX); }}
    >
      <img className="compare-slider-img" src={srcA} alt={labelA} draggable={false} />
      <div ref={overlayRef} className="compare-slider-overlay" style={{ clipPath: "inset(0 0 0 50%)" }}>
        <img className="compare-slider-img" src={srcB} alt={labelB} draggable={false} />
      </div>
      <div ref={dividerRef} className="compare-slider-divider" style={{ left: "50%" }}>
        <div className="compare-slider-handle" dangerouslySetInnerHTML={{ __html: ICON_CHEVRONS_LR }} />
      </div>
      <span ref={labelARef} className="compare-slider-label compare-slider-label-a">{labelA}</span>
      <span ref={labelBRef} className="compare-slider-label compare-slider-label-b">{labelB}</span>
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

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightboxSrc({ src, alt });
  }, []);

  const mdComponents = useMemo(() => ({
    h2: ({ children }: { children?: React.ReactNode }) => {
      const text = String(children);
      const id = slugify(text);
      return (
        <h2 id={id} className="docs-heading-anchor">
          {children}
          <CopyLinkButton id={id} />
        </h2>
      );
    },
    h3: ({ children }: { children?: React.ReactNode }) => {
      const text = String(children);
      const id = slugify(text);
      return (
        <h3 id={id} className="docs-heading-anchor">
          {children}
          <CopyLinkButton id={id} />
        </h3>
      );
    },
    img: ({ alt, src }: { alt?: string; src?: string }) => {
      if (src === "todo-image") {
        return <span className="docs-image-placeholder">{alt}</span>;
      }
      if (src?.startsWith("compare:")) {
        const name = src.slice("compare:".length);
        return (
          <CompareSlider
            srcA={`/images/${name}-a.png`}
            srcB={`/images/${name}-b.png`}
            labelA="Before"
            labelB="After"
          />
        );
      }
      return (
        <img
          alt={alt || ""}
          src={src}
          data-lightbox-src={src}
          className="docs-zoomable-img"
          onClick={() => src && openLightbox(src, alt || "")}
        />
      );
    },
  }), [openLightbox]);

  const renderedMarkdown = useMemo(() => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={mdComponents}
      urlTransform={(url) => url}
    >
      {activeDoc.contentWithoutTitle}
    </ReactMarkdown>
  ), [activeDoc.contentWithoutTitle, mdComponents]);

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
        {renderedMarkdown}
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

export function getDocTitle(slug: string): string {
  return DOCS.find((d) => d.slug === slug)?.title ?? "Docs";
}
