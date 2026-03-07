'use client'

type StructuredDataProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Renders JSON-LD structured data in a <script> tag.
 * Accepts a single schema object or an array of schema objects.
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
