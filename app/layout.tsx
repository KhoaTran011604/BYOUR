import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SocketProvider } from "@/components/providers/socket-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "vietnamese"] })

export const metadata: Metadata = {
  title: "TEST-002 - Digital Office",
  description: "A platform for building digital offices for independent professionals and Vietnamese businesses",
  keywords: ["freelancer", "digital office", "website builder", "TEST-002", "Vietnam"],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SocketProvider>
          {children}
        </SocketProvider>
        <Analytics />
      </body>
    </html>
  )
}
