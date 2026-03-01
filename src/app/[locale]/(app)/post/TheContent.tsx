import DOMPurify from 'isomorphic-dompurify'

const TheContent = ({ content }: { content: string }) => {
  if (!content) {
    return (
      <p className="text-neutral-500 dark:text-neutral-400 italic">
        No content available for this post.
      </p>
    )
  }

  const cleanHtml = DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target'],
  })

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
}

export default TheContent
