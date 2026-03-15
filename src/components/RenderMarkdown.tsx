// @author Gemini CLI (gemini-3-pro-preview) | 2026-03-14 — initial version
// @author Claude Code (claude-opus-4-6) | 2026-03-14 — extracted to component, theme colors, heading support

function parseInlineStyles(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function RenderMarkdown({ text }: { text: string }) {
  if (!text) return null;

  const blocks = text.split(/\n\n+/);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        // Headings
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={i} className="text-lg font-semibold text-foreground">
              {parseInlineStyles(trimmed.slice(3))}
            </h3>
          );
        }

        // Lists
        const lines = trimmed.split("\n").filter((line) => line.trim());
        const isList = lines.every(
          (line) => line.trim().startsWith("- ") || line.trim().startsWith("* ")
        );

        if (isList) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-2 my-2">
              {lines.map((line, j) => {
                const content = line.trim().replace(/^[-*]\s+/, "");
                return (
                  <li key={j} className="text-muted-foreground leading-relaxed">
                    {parseInlineStyles(content)}
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={i} className="text-muted-foreground leading-relaxed">
            {parseInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
