/**
 * Normalizes OCR output for downstream AI / display while keeping lab-style tokens readable.
 *
 * Preserves: letters (Unicode), digits, common punctuation used in reports (. , / - + % ( ) [ ] : ; ° µ μ),
 * newlines for structure.
 */
export function cleanOcrText(raw: string): string {
  if (!raw) return "";

  let s = raw.normalize("NFC");

  // Strip replacement / control characters (keep \n)
  s = s.replace(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

  // Normalize line endings
  s = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Soft hyphen often inserted by PDF line breaks
  s = s.replace(/\u00AD/g, "");

  // Tabs → space
  s = s.replace(/\t/g, " ");

  const lines = s.split("\n");
  const cleanedLines = lines.map((line) => {
    // Non-breaking spaces → space
    let L = line.replace(/\u00A0/g, " ");
    // Collapse repeated spaces within a line
    L = L.replace(/ {2,}/g, " ");
    return L.trimEnd();
  });

  let out = cleanedLines.join("\n");

  // Trim each line start (keep intentional indentation minimal)
  out = out
    .split("\n")
    .map((l) => l.trimStart())
    .join("\n");

  // Collapse 3+ blank lines to 2
  out = out.replace(/\n{3,}/g, "\n\n");

  // Remove lines that are only odd symbols (noise), keep lines with alnum
  out = out
    .split("\n")
    .filter((line) => {
      if (line.trim().length === 0) return true;
      return /[\p{L}\p{N}]/u.test(line);
    })
    .join("\n");

  return out.trim();
}

/** Minimum embedded-text length to treat a PDF as text-based (not empty scan). */
export const MIN_PDF_EMBEDDED_TEXT_LENGTH = 20;
