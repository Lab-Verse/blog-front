'use client'

import { Button } from '@/shared/Button'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Textarea from '@/shared/Textarea'
import React, { FC, useRef, useState } from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  onSubmitComment?: (content: string) => Promise<void> | void
  onClickCancel?: () => void
  defaultValue?: string
  rows?: number
  isLoading?: boolean
  placeholder?: string
}

const SingleCommentForm: FC<Props> = ({
  className = 'mt-5',
  onSubmitComment,
  onClickCancel,
  defaultValue = '',
  rows = 4,
  isLoading = false,
  placeholder = 'Add to discussion',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState(defaultValue)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || !onSubmitComment) return
    await onSubmitComment(trimmed)
    setContent('')
    if (textareaRef.current) {
      textareaRef.current.value = ''
    }
  }

  return (
    <form className={`single-comment-form ${className}`} onSubmit={handleSubmit}>
      <Textarea
        placeholder={placeholder}
        ref={textareaRef}
        required={true}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={rows}
      />
      <div className="mt-3 flex gap-3">
        {onClickCancel && (
          <Button plain type="button" onClick={onClickCancel}>
            Cancel
          </Button>
        )}
        <ButtonPrimary type="submit" disabled={isLoading || !content.trim()}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </ButtonPrimary>
      </div>
    </form>
  )
}

export default SingleCommentForm
