import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { PusherProvider } from "@/components/providers/pusher-provider"
import { Toaster } from "@/components/ui/toaster"
import { locales, type Locale } from '@/i18n/config'
import "../globals.css"

const inter = Inter({ subsets: ["latin", "vietnamese"] })

export const metadata: Metadata = {
  title: "TEST-002 - Digital Office",
  description: "A platform for building digital offices for independent professionals and Vietnamese businesses",
  keywords: ["freelancer", "digital office", "website builder", "TEST-002", "Vietnam"],
  generator: 'v0.app'
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

async function getMessages(locale: Locale) {
  return (await import(`../../messages/${locale}.json`)).default
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages(locale as Locale)

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PusherProvider>
            {children}
          </PusherProvider>
        </NextIntlClientProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
