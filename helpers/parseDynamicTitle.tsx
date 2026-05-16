import React from 'react';

/**
 * Parses a CMS title string and returns an array of React nodes.
 *
 * Convention: wrap the word(s) you want italicised in *asterisks*.
 *
 * Examples:
 *   "Bringing *Hope* to the Hearts of Dooars"
 *   → ["Bringing ", <em>Hope</em>, " to the Hearts of Dooars"]
 *
 *   "We *Rise* Together"
 *   → ["We ", <em>Rise</em>, " Together"]
 *
 * - Supports multiple italic spans in one string.
 * - Preserves surrounding whitespace exactly.
 * - Falls back to a plain string when there are no asterisks.
 */
export function parseDynamicTitle(
  title: string,
  emStyle?: React.CSSProperties,
): React.ReactNode[] {
  // Split on *…* markers, keeping the captured group so we know which
  // segments were inside asterisks.
  const parts = title.split(/\*([^*]+)\*/);

  // parts alternates: [plain, italic, plain, italic, …]
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // Odd indices are the captured italic segments
      return (
        <em key={i} style={emStyle ?? { fontStyle: 'italic' }}>
          {part}
        </em>
      );
    }
    return part || null; // Even indices are plain text (skip empty strings)
  });
}