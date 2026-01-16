import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "vietnamese"] })

export const metadata: Metadata = {
  title: "TEST-002 - Văn phòng kỹ thuật số",
  description: "Nền tảng xây dựng văn phòng kỹ thuật số cho chuyên gia độc lập và doanh nghiệp Việt Nam",
  keywords: ["freelancer", "văn phòng kỹ thuật số", "website builder", "TEST-002", "Vietnam"],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
