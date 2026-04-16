import { Facebook01Icon, Mail01Icon, NewTwitterIcon, YoutubeIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  className?: string
  socials?: typeof defaultSocials
}

const defaultSocials = [
  {
    name: 'Facebook',
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://www.facebook.com/theworldambassador',
    icon: Facebook01Icon,
  },
  {
    name: 'Email',
    href: process.env.NEXT_PUBLIC_SOCIAL_EMAIL || 'mailto:editor@twa.com.pk',
    icon: Mail01Icon,
  },
  {
    name: 'Twitter',
    href: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || 'https://x.com/theworldamb',
    icon: NewTwitterIcon,
  },
  {
    name: 'Youtube',
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || 'https://www.youtube.com/@theworldambassador',
    icon: YoutubeIcon,
  },
]

const SocialsList1: FC<Props> = ({ className, socials = defaultSocials }) => {
  return (
    <div className={clsx('flex flex-col gap-y-4', className)}>
      {socials.map((item, index) => (
        <a
          href={item.href}
          className="group flex items-center gap-x-2.5 text-sm text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          key={index}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HugeiconsIcon icon={item.icon} size={20} />
          {item.name}
        </a>
      ))}
    </div>
  )
}

export default SocialsList1
