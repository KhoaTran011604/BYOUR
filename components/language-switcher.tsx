'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { locales } from '@/i18n/config'

const localeNames: Record<string, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const segments = pathname.split('/')
    const currentLocaleIndex = locales.includes(segments[1] as any) ? 1 : -1

    let newPathname: string
    if (currentLocaleIndex === 1) {
      segments[1] = newLocale
      newPathname = segments.join('/')
    } else {
      newPathname = `/${newLocale}${pathname}`
    }

    router.push(newPathname)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{localeNames[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className={locale === loc ? 'bg-accent' : ''}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
