"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, Save, ExternalLink } from "lucide-react"

interface ProfileFormProps {
  user: User
  profile: Profile | null
  website: { handle: string; is_published: boolean } | null
}

export function ProfileForm({ user, profile, website }: ProfileFormProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile?.full_name || user.user_metadata?.full_name || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const displayName = fullName || user.email?.split("@")[0]
  const initials = displayName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      if (profile) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            avatar_url: avatarUrl || null,
          })
          .eq("id", user.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          avatar_url: avatarUrl || null,
        })

        if (error) throw error
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại Dashboard
        </Link>
      </Button>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật ảnh đại diện và thông tin hiển thị</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-accent text-accent-foreground text-xl">{initials || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Label htmlFor="avatarUrl">URL ảnh đại diện</Label>
                <div className="flex gap-2">
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Nhập URL hình ảnh hoặc sử dụng dịch vụ lưu trữ ảnh</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">Đã lưu thay đổi thành công!</p>}

            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Website Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Website của bạn</CardTitle>
              <CardDescription>{website ? `byour.co/${website.handle}` : "Chưa tạo website"}</CardDescription>
            </div>
            {website && (
              <Badge variant={website.is_published ? "default" : "secondary"}>
                {website.is_published ? "Đã xuất bản" : "Bản nháp"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {website ? (
            <div className="flex gap-3">
              <Button asChild variant="outline" className="bg-transparent">
                <Link href={`/${website.handle}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Xem website
                </Link>
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/builder/new">Tạo website mới</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Handle</span>
              <span className="font-medium">{profile?.handle || "Chưa đặt"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chế độ hiện tại</span>
              <span className="font-medium capitalize">{profile?.current_mode || "self"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày tham gia</span>
              <span className="font-medium">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("vi-VN")
                  : new Date().toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
