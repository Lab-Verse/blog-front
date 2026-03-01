'use client'

import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '@/shared/dropdown'
import { ButtonCircle } from '@/shared/Button'
import { Facebook01Icon, Mail01Icon, NewTwitterIcon, Share03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface ShareDropdownProps {
  /** Optional title used in email subject / Twitter text. Falls back to document.title */
  title?: string
  /** Render as a circle outline button (used on page headers) vs plain icon (post meta) */
  variant?: 'icon' | 'outline'
}

/**
 * Reusable share dropdown. Uses window.location.href for the current URL.
 * Works on post, category, tag, and author pages.
 */
export default function ShareDropdown({ title, variant = 'icon' }: ShareDropdownProps) {
  const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '')
  const getTitle = () => title || (typeof document !== 'undefined' ? document.title : '')

  const socials = [
    {
      name: 'Facebook',
      icon: Facebook01Icon,
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
          '_blank',
          'noopener,noreferrer'
        ),
    },
    {
      name: 'Twitter',
      icon: NewTwitterIcon,
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(getTitle())}`,
          '_blank',
          'noopener,noreferrer'
        ),
    },
    {
      name: 'Email',
      icon: Mail01Icon,
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(getTitle())}&body=${encodeURIComponent(getUrl())}`
      },
    },
  ]

  const button =
    variant === 'outline' ? (
      <DropdownButton as={ButtonCircle} outline className="size-10">
        <HugeiconsIcon icon={Share03Icon} size={20} />
      </DropdownButton>
    ) : (
      <DropdownButton
        as="button"
        className="flex size-8.5 items-center justify-center rounded-full bg-neutral-50 transition-colors duration-300 hover:bg-neutral-100 dark:bg-white/10 dark:hover:bg-white/20"
      >
        <HugeiconsIcon icon={Share03Icon} size={20} />
      </DropdownButton>
    )

  return (
    <Dropdown>
      {button}
      <DropdownMenu>
        {socials.map((item) => (
          <DropdownItem key={item.name} onClick={item.onClick}>
            <HugeiconsIcon icon={item.icon} size={20} data-slot="icon" />
            {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
