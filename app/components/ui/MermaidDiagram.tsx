import React, { useEffect, useId, useState } from "react";
import { useTheme } from "../ThemeProvider";

type MermaidDiagramProps = {
  chart: string;
};

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const { theme } = useTheme();
  const id = useId();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function renderDiagram() {
      setIsLoading(true);
      setError("");

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: theme === "dark" ? "dark" : "default",
          securityLevel: "loose",
        });

        const renderId = `mermaid-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}-${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(renderId, chart);

        if (!isCancelled) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMsg =
            err instanceof Error ?
              err.message
            : "Failed to render Mermaid diagram";
          setError(errorMsg);
          setSvg("");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [chart, theme, id]);

  if (isLoading) {
    return (
      <div
        className="my-4 rounded-lg border border-border bg-muted/40 p-4 animate-pulse"
        role="status"
        aria-live="polite"
      >
        <div className="h-4 w-40 rounded bg-muted mb-3" />
        <div className="h-3 w-full rounded bg-muted mb-2" />
        <div className="h-3 w-5/6 rounded bg-muted mb-2" />
        <div className="h-3 w-2/3 rounded bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-red-500/40 bg-red-500/5 p-4">
        <p className="mb-2 text-sm text-red-500">
          Mermaid render error: {error}
        </p>
        <pre className="overflow-x-auto text-xs whitespace-pre-wrap">
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      className="my-4 overflow-x-auto rounded-lg border border-border bg-card p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
