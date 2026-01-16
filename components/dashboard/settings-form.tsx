"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { BackButton } from "../ui/back-button"

interface SettingsFormProps {
  user: User
  profile: Profile | null
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile?.full_name || user.user_metadata?.full_name || "")
  const [handle, setHandle] = useState(profile?.handle || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    // Validate handle format
    if (handle && !/^[a-z0-9-]+$/.test(handle)) {
      setError("Handle can only contain lowercase letters, numbers, and hyphens")
      setIsLoading(false)
      return
    }

    try {
      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            handle: handle || null,
          })
          .eq("id", user.id)

        if (error) throw error
      } else {
        // Create new profile
        const { error } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          handle: handle || null,
        })

        if (error) throw error
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("duplicate")) {
          setError("This handle is already taken. Please choose a different handle.")
        } else {
          setError(err.message)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <BackButton/>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your display information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="handle">Handle</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">byour.co/</span>
                <Input
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase())}
                  placeholder="your-handle"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Only use lowercase letters, numbers, and hyphens. This will be your website URL.
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">Changes saved successfully!</p>}

            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
