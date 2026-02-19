"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

let idCounter = 0;

export function MermaidDiagram({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    const id = `mermaid-${idCounter++}`;
    mermaid.render(id, content).then(({ svg }) => {
      setSvg(svg);
    }).catch((err) => {
      console.error("Mermaid render error:", err);
      if (ref.current) {
        ref.current.textContent = content;
      }
    });
  }, [content]);

  return (
    <div
      ref={ref}
      className="my-4 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
