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
import {
  Globe,
  Plus,
  ExternalLink,
  Pencil,
  Users,
  Lightbulb,
  Zap,
  Clock,
  MessageSquare,
  TestTube,
  Sparkles,
  FileText,
  Building2,
  MapPin,
  ArrowUpCircle,
  CheckCircle2,
} from "lucide-react"

interface DashboardContentProps {
  user: User
  profile: Profile | null
  website: Website | null
}

export function DashboardContent({ user, profile, website }: DashboardContentProps) {
  const router = useRouter()
  const [currentMode, setCurrentMode] = useState<UserMode>(profile?.current_mode || "self")
  const shaper_status = "approved"
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
          {/* Website Card - Boss mode only */}
          {currentMode === "boss" && (
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
          )}

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
              {/* Hướng dẫn Đăng ký KD */}
              <Card className="md:col-span-2 lg:col-span-2 border-accent/20 bg-accent/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Hướng dẫn Đăng ký Kinh doanh</CardTitle>
                  </div>
                  <CardDescription>
                    Bước đầu tiên để trở thành freelancer chuyên nghiệp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tìm hiểu cách đăng ký kinh doanh cá nhân, thuế, và các thủ tục pháp lý cần thiết để hoạt động hợp pháp.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/guides/business-registration">
                      <FileText className="mr-2 h-4 w-4" />
                      Xem hướng dẫn
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* 3 Resource Cards */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Example Projects</CardTitle>
                  </div>
                  <CardDescription>Xem các dự án mẫu</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tham khảo các dự án freelance thực tế để học hỏi cách trình bày và báo giá.
                  </p>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/examples/projects">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Xem Projects
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Example HQ Websites</CardTitle>
                  </div>
                  <CardDescription>Website doanh nghiệp mẫu</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Khám phá các website HQ chất lượng cao để lấy cảm hứng cho website của bạn.
                  </p>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/examples/hq-websites">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Xem Websites
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Ireland Guide</CardTitle>
                  </div>
                  <CardDescription>Hướng dẫn làm việc tại Ireland</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Thông tin về visa, thuế, và cơ hội freelance tại Ireland.
                  </p>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/guides/ireland">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Xem Guide
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Upgrade CTA */}
              <Card className="md:col-span-2 lg:col-span-3 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <ArrowUpCircle className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Sẵn sàng Upgrade?</h3>
                        <p className="text-sm text-muted-foreground">
                          Nâng cấp lên Boss Mode để mở khóa đầy đủ tính năng quản lý công việc freelance.
                        </p>
                      </div>
                    </div>
                    <Button size="lg" className="shrink-0">
                      <Zap className="mr-2 h-4 w-4" />
                      Upgrade ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {currentMode === "shaper" && (
            <>
              {/* Pending Approval - Waiting Screen */}
              {shaper_status !== "approved" && (
                <Card className="md:col-span-2 lg:col-span-3 border-amber-500/30 bg-amber-500/5">
                  <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="rounded-full bg-amber-500/10 p-4">
                        <Clock className="h-12 w-12 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl mb-2">Đang chờ phê duyệt</h3>
                        <p className="text-muted-foreground max-w-md">
                          Đơn đăng ký Shaper của bạn đang được Admin xem xét. Chúng tôi sẽ thông báo qua email khi có kết quả.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Đơn đăng ký đã được gửi thành công</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Approved - Shaper Dashboard (default when no status or approved) */}
              {shaper_status === "approved" && (
                <>
                  {/* Feedback Hub */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-accent" />
                        <CardTitle className="text-lg">Feedback Hub</CardTitle>
                      </div>
                      <CardDescription>Đóng góp ý kiến cho BYOUR</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Gửi phản hồi, đề xuất tính năng mới và báo cáo lỗi để cải thiện nền tảng.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/shaper/feedback">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Submit Feedback
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Testing Environment */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-accent" />
                        <CardTitle className="text-lg">Testing Environment</CardTitle>
                      </div>
                      <CardDescription>Thử nghiệm tính năng mới</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Truy cập môi trường thử nghiệm để test các tính năng trước khi phát hành chính thức.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/shaper/testing">
                          <TestTube className="mr-2 h-4 w-4" />
                          Test New Features
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Experimental Features */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        <CardTitle className="text-lg">Experimental Features</CardTitle>
                      </div>
                      <CardDescription>Trải nghiệm sớm nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Được quyền truy cập sớm vào các tính năng thử nghiệm trước tất cả người dùng khác.
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/shaper/early-access">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Early Access
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Rejected Status */}
              {profile?.shaper_status === "rejected" && (
                <Card className="md:col-span-2 lg:col-span-3 border-red-500/30 bg-red-500/5">
                  <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="rounded-full bg-red-500/10 p-4">
                        <Users className="h-12 w-12 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl mb-2">Đơn đăng ký chưa được duyệt</h3>
                        <p className="text-muted-foreground max-w-md">
                          Rất tiếc, đơn đăng ký Shaper của bạn chưa được phê duyệt lần này. Bạn có thể đăng ký lại sau.
                        </p>
                      </div>
                      <Button variant="outline" className="mt-2">
                        Đăng ký lại
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
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
