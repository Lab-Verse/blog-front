/**
 * JSON-LD structured data component for SEO.
 * Renders a <script type="application/ld+json"> tag with the provided data.
 */

interface Props {
  data: Record<string, unknown>
}

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
