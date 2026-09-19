'use client'

import NextLink from 'next/link'
import { useRouter as useNextRouter, usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { localeFromPath, localizedPath } from './i18n'

// Locale-bewuste Link: prefixt interne hrefs automatisch met de actieve taal (/fr/…).
// Externe links, mailto en #-ankers blijven ongewijzigd.
type LinkProps = React.ComponentProps<typeof NextLink>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, ...rest }, ref) {
  const locale = localeFromPath(usePathname())
  const h = typeof href === 'string' ? localizedPath(href, locale) : href
  return <NextLink ref={ref} href={h} {...rest} />
})

// Locale-bewuste router: push/replace prefixen interne paden met de actieve taal.
export function useRouter() {
  const router = useNextRouter()
  const locale = localeFromPath(usePathname())
  return {
    ...router,
    push: (href: string, options?: Parameters<typeof router.push>[1]) =>
      router.push(localizedPath(href, locale), options),
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) =>
      router.replace(localizedPath(href, locale), options),
  }
}
