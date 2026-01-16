"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "./button"

export function BackButton() {
  const router = useRouter()

  return (
    <Button variant="ghost" className="mb-4"  onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại Dashboard
    </Button>
  )
}
