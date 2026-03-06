/**
 * Converts HTML content to clean plain text suitable for text-to-speech.
 * Strips tags, decodes entities, removes script/style/code blocks,
 * and preserves paragraph breaks as sentence pauses.
 */
export function htmlToPlainText(html: string): string {
  if (!html) return ''

  let text = html

  // Remove script, style, code, and pre blocks entirely
  text = text.replace(/<(script|style|code|pre|noscript)[^>]*>[\s\S]*?<\/\1>/gi, '')

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '')

  // Convert block-level elements to newlines for natural pauses
  text = text.replace(/<\/(p|div|h[1-6]|li|blockquote|tr|br\s*\/?)>/gi, '\n')
  text = text.replace(/<br\s*\/?>/gi, '\n')

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '')

  // Decode common HTML entities
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': '\u2018',
    '&rsquo;': '\u2019',
    '&ldquo;': '\u201C',
    '&rdquo;': '\u201D',
    '&hellip;': '…',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  }

  for (const [entity, char] of Object.entries(entities)) {
    text = text.replaceAll(entity, char)
  }

  // Decode numeric HTML entities (&#123; and &#x1A;)
  text = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))

  // Collapse multiple whitespace into single spaces per line
  text = text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')

  // Collapse 3+ consecutive newlines into 2 (paragraph break)
  text = text.replace(/\n{3,}/g, '\n\n')

  return text.trim()
}
