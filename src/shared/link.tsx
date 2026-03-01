'use client'

import * as Headless from '@headlessui/react'
import NextLink from 'next/link'
import { Link as I18nLink } from '@/i18n/navigation'
import React, { forwardRef } from 'react'

type LinkProps = React.ComponentPropsWithoutRef<typeof I18nLink>

export const Link = forwardRef(function Link(
  props: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const closeHeadless = Headless.useClose()

  return (
    <Headless.DataInteractive>
      <I18nLink
        {...props}
        ref={ref}
        onClick={(e) => {
          if (props.onClick) {
            props.onClick(e)
          }
          // Close the headlessui menu and aside
          closeHeadless()
        }}
      />
    </Headless.DataInteractive>
  )
})
