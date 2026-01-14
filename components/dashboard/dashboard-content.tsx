"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/client"
import type { UserMode, Profile, Website } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import { Globe, Plus, ExternalLink, Pencil, BookOpen, Users, Lightbulb, Zap } from "lucide-react"

interface DashboardContentProps {
  user: User
  profile: Profile | null
  website: Website | null
}

export function DashboardContent({ user, profile, website }: DashboardContentProps) {
  const router = useRouter()
  const [currentMode, setCurrentMode] = useState<UserMode>(profile?.current_mode || "self")

  const handleModeChange = async (mode: UserMode) => {
    setCurrentMode(mode)
    const supabase = createClient()

    if (profile) {
      await supabase.from("profiles").update({ current_mode: mode }).eq("id", user.id)
    }
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0]

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={user} profile={profile} currentMode={currentMode} onModeChange={handleModeChange} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Xin chào, {displayName}</h1>
          <p className="text-muted-foreground">Chào mừng đến văn phòng kỹ thuật số của bạn</p>
        </div>

        {/* Mobile Mode Info */}
        <div className="mb-6 sm:hidden">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Chế độ hiện tại</span>
                <span className="font-medium capitalize">{currentMode}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Website Card - Always visible */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">Website của bạn</CardTitle>
              </div>
              <CardDescription>
                {website ? `byour.co/${website.handle}` : "Tạo microsite chuyên nghiệp"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {website ? (
                <div className="flex flex-col gap-2">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <span
                      className={website.is_published ? "text-green-600 font-medium" : "text-amber-600 font-medium"}
                    >
                      {website.is_published ? "Đã xuất bản" : "Bản nháp"}
                    </span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/builder/${website.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa website
                    </Link>
                  </Button>
                  {website.is_published && (
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href={`/${website.handle}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Xem website
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/builder/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo website mới
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Mode-specific Cards */}
          {currentMode === "boss" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Quản lý công việc</CardTitle>
                  </div>
                  <CardDescription>Theo dõi dự án và khách hàng</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quản lý công việc freelance của bạn một cách chuyên nghiệp
                  </p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Sắp ra mắt
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Khách hàng</CardTitle>
                  </div>
                  <CardDescription>Danh sách và quan hệ khách hàng</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Xây dựng mối quan hệ với khách hàng tiềm năng</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Sắp ra mắt
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {currentMode === "hq" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Đội ngũ</CardTitle>
                  </div>
                  <CardDescription>Quản lý thành viên team</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Mời và quản lý thành viên trong doanh nghiệp</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Sắp ra mắt
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Dự án</CardTitle>
                  </div>
                  <CardDescription>Quản lý dự án của công ty</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Theo dõi và quản lý các dự án đang thực hiện</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Sắp ra mắt
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {currentMode === "self" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Học tập</CardTitle>
                  </div>
                  <CardDescription>Tài nguyên cho người mới</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Khám phá các khóa học và hướng dẫn về freelance</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Sắp ra mắt
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Hướng dẫn</CardTitle>
                  </div>
                  <CardDescription>Bắt đầu hành trình freelance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Các bước cơ bản để bắt đầu làm việc độc lập</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Sắp ra mắt
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {currentMode === "shaper" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Đóng góp</CardTitle>
                  </div>
                  <CardDescription>Tạo nội dung cho cộng đồng</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Chia sẻ kiến thức và kinh nghiệm của bạn</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Sắp ra mắt
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Cộng đồng</CardTitle>
                  </div>
                  <CardDescription>Xây dựng cộng đồng BYOUR</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Kết nối và phát triển cộng đồng freelancer</p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Sắp ra mắt
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{website ? 1 : 0}</div>
                <div className="text-sm text-muted-foreground">Website</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">0</div>
                <div className="text-sm text-muted-foreground">Lượt xem</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent capitalize">{currentMode}</div>
                <div className="text-sm text-muted-foreground">Chế độ</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
