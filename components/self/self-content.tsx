"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/client"
import type { UserMode, Profile } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import {
  Building2,
  FileText,
  Lightbulb,
  ExternalLink,
  Globe,
  MapPin,
  ArrowUpCircle,
  Zap,
} from "lucide-react"

interface SelfContentProps {
  user: User
  profile: Profile | null
}

export function SelfContent({ user, profile }: SelfContentProps) {
  const [currentMode, setCurrentMode] = useState<UserMode>("self")

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
          <p className="text-muted-foreground">Khám phá và tìm hiểu về freelancing</p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <Link href="/self/business-registration">
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
                <Link href="/self/projects">
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
                <Link href="/self/hq-websites">
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
                <Link href="/self/ireland">
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
        </div>
      </main>
    </div>
  )
}
