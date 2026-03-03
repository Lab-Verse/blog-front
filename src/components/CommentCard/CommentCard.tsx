'use client'

import type { TComment } from '@/utils/dataTransformers'
import Avatar from '@/shared/Avatar'
import { Button } from '@/shared/Button'
import Textarea from '@/shared/Textarea'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/shared/dialog'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/shared/dropdown'
import {
  ArrowTurnBackwardIcon,
  Delete03Icon,
  Flag03Icon,
  MessageEdit01Icon,
  MoreHorizontalIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { Link } from '@/i18n/navigation'
import { FC, useRef, useState } from 'react'
import SingleCommentForm from '../SingleCommentForm'
import CommentLikeBtn from './CommentLikeBtn'
import CommentReplyBtn from './CommentReplyBtn'
import { useCreateCommentReplyMutation } from '@/app/redux/api/commentsReplies/commentsRepliesApi'
import { useUpdateCommentMutation, useDeleteCommentMutation } from '@/app/redux/api/comments/commentsApi'
import { useGetRepliesByCommentQuery } from '@/app/redux/api/commentsReplies/commentsRepliesApi'
import { cookies } from '@/app/redux/utils/cookies'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'

interface Props {
  className?: string
  comment: TComment
  postId: string
  onDeleted?: () => void
}

const CommentCard: FC<Props> = ({ className, comment, postId, onDeleted }) => {
  const { date, content, like, author, id, repliesCount } = comment

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null)
  const [isReplying, setIsReplying] = useState(false)
  const [isEditting, setIsEditting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [isOpenDialogReportComment, setIsOpenDialogReportComment] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const [createReply, { isLoading: isCreatingReply }] = useCreateCommentReplyMutation()
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation()
  const [deleteComment, { isLoading: isDeleteLoading }] = useDeleteCommentMutation()

  // Fetch replies when expanded
  const { data: replies } = useGetRepliesByCommentQuery(id, { skip: !showReplies })

  // Get current user ID from token
  const getUserId = (): string | null => {
    try {
      const token = cookies.getAccessToken()
      if (!token) return null
      const decoded: { sub?: string } = jwtDecode(token)
      return decoded?.sub || null
    } catch {
      return null
    }
  }

  const currentUserId = getUserId()
  const isOwnComment = currentUserId && author.id === currentUserId

  const openReplyForm = () => {
    setIsReplying(true)
    setTimeout(() => {
      textareaRef.current && (textareaRef.current as HTMLTextAreaElement).focus()
    }, 20)
  }
  const closeReplyForm = () => {
    setIsReplying(false)
  }

  const handleReplySubmit = async (replyContent: string) => {
    if (!currentUserId) {
      toast.error('Please log in to reply')
      return
    }
    try {
      await createReply({
        comment_id: id,
        user_id: currentUserId,
        content: replyContent,
      }).unwrap()
      closeReplyForm()
      setShowReplies(true)
      toast.success('Reply posted')
    } catch {
      toast.error('Failed to post reply')
    }
  }

  const handleEditSave = async () => {
    const trimmed = editContent.trim()
    if (!trimmed) return
    try {
      await updateComment({ id, data: { content: trimmed } }).unwrap()
      setIsEditting(false)
      toast.success('Comment updated')
    } catch {
      toast.error('Failed to update comment')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteComment({ id, postId }).unwrap()
      setIsDeleting(false)
      onDeleted?.()
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  const commentActions = [
    {
      name: 'Reply comment',
      icon: ArrowTurnBackwardIcon,
      onClick: openReplyForm,
      show: true,
    },
    {
      name: 'Edit comment',
      icon: MessageEdit01Icon,
      onClick: () => { setEditContent(content); setIsEditting(true) },
      show: !!isOwnComment,
    },
    {
      name: 'Delete comment',
      icon: Delete03Icon,
      onClick: () => setIsDeleting(true),
      show: !!isOwnComment,
    },
    {
      name: 'Report comment',
      icon: Flag03Icon,
      onClick: () => setIsOpenDialogReportComment(true),
      show: !isOwnComment,
    },
  ].filter((a) => a.show)

  return (
    <>
      <div className={clsx(`comment-card flex ${className}`)}>
        <Avatar className="size-8 rounded-full" src={author.avatar.src} width={32} height={32} sizes="32px" />
        <div className="ms-2 flex grow flex-col rounded-xl border border-neutral-200 p-4 text-sm sm:ms-3 sm:text-base dark:border-neutral-700">
          {/* AUTHOR INFOR */}
          <div className="relative flex items-center pe-6">
            <div className="absolute -end-3 -top-3">
              <Dropdown>
                <DropdownButton
                  as="button"
                  className="flex size-8.5 items-center justify-center rounded-lg bg-neutral-100 transition-colors duration-300 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  <HugeiconsIcon icon={MoreHorizontalIcon} size={20} />
                </DropdownButton>
                <DropdownMenu>
                  {commentActions.map((item, index) => (
                    <DropdownItem key={index} onClick={item.onClick}>
                      <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
                      {item.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <Link
              className="shrink-0 font-semibold text-neutral-800 dark:text-neutral-100"
              href={`/author/${author.handle}`}
            >
              {author.name}
            </Link>
            <span className="mx-2">·</span>
            <span className="line-clamp-1 text-xs text-neutral-600 sm:text-sm dark:text-neutral-400">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </span>
          </div>

          {/* CONTENT */}
          <p className="mt-2 mb-3 text-base/relaxed text-neutral-700 sm:mt-3 sm:mb-4 dark:text-neutral-300">
            {content}
          </p>

          {/* ACTION LIKE REPLY */}
          {isReplying ? (
            <SingleCommentForm
              onSubmitComment={handleReplySubmit}
              onClickCancel={closeReplyForm}
              className="grow"
              rows={3}
              placeholder="Write a reply..."
              isLoading={isCreatingReply}
            />
          ) : (
            <div className="flex items-center gap-2">
              <CommentLikeBtn likeCount={like.count} isLiked={like.isLiked} commentId={id} />
              <CommentReplyBtn onClick={openReplyForm} />
              {(repliesCount ?? 0) > 0 && (
                <button
                  className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? 'Hide' : 'View'} {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}
                </button>
              )}
            </div>
          )}

          {/* REPLIES */}
          {showReplies && replies && replies.length > 0 && (
            <div className="mt-4 space-y-3 border-s-2 border-neutral-100 ps-4 dark:border-neutral-700">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <Avatar
                    className="size-6 shrink-0 rounded-full"
                    src={reply.user?.profile?.profile_picture || reply.user?.avatar || ''}
                    width={24}
                    height={24}
                    sizes="24px"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {reply.user?.display_name || reply.user?.username || 'User'}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(reply.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DIALOG DELETE COMMENT */}
      <Dialog open={isDeleting} onClose={() => setIsDeleting(false)}>
        <DialogTitle>Delete comment?</DialogTitle>
        <DialogBody>
          <p>Are you sure you want to delete this comment? You cannot undo this action.</p>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsDeleting(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isDeleteLoading}>
            {isDeleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG EDIT COMMENT */}
      <Dialog size="3xl" open={isEditting} onClose={() => setIsEditting(false)}>
        <DialogTitle>Edit comment</DialogTitle>
        <DialogBody>
          <Textarea
            autoFocus
            data-autofocus
            placeholder="Add to discussion"
            ref={editTextareaRef}
            required={true}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={8}
          />
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsEditting(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG REPORT COMMENT */}
      <Dialog open={isOpenDialogReportComment} onClose={() => setIsOpenDialogReportComment(false)}>
        <DialogTitle>Report this comment?</DialogTitle>
        <DialogBody>
          <p>Are you sure you want to report this comment? This action will report this comment.</p>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpenDialogReportComment(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpenDialogReportComment(false)}>Report</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CommentCard
