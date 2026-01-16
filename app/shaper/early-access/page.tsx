"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  Calendar,
  Users,
  Star,
  Rocket,
  Palette,
  Brain,
  Globe,
  Shield,
} from "lucide-react"

// Fake data - sẽ thay bằng dữ liệu từ DB sau
const experimentalFeatures = [
  {
    id: 1,
    name: "AI Content Assistant",
    description: "Sử dụng AI để gợi ý và tạo nội dung tự động cho website của bạn.",
    icon: Brain,
    status: "available",
    releaseDate: "2024-02-15",
    accessCount: 156,
    enabled: true,
  },
  {
    id: 2,
    name: "Advanced Analytics",
    description: "Dashboard analytics chi tiết với heatmaps và user journey tracking.",
    icon: Zap,
    status: "available",
    releaseDate: "2024-02-20",
    accessCount: 89,
    enabled: false,
  },
  {
    id: 3,
    name: "Custom Themes",
    description: "Tạo và chia sẻ custom themes với cộng đồng BYOUR.",
    icon: Palette,
    status: "available",
    releaseDate: "2024-03-01",
    accessCount: 234,
    enabled: true,
  },
  {
    id: 4,
    name: "Multi-site Management",
    description: "Quản lý nhiều websites từ một dashboard duy nhất.",
    icon: Globe,
    status: "coming_soon",
    releaseDate: "2024-03-15",
    accessCount: 0,
    enabled: false,
  },
  {
    id: 5,
    name: "Team Collaboration",
    description: "Invite team members và cộng tác real-time trên website.",
    icon: Users,
    status: "coming_soon",
    releaseDate: "2024-04-01",
    accessCount: 0,
    enabled: false,
  },
  {
    id: 6,
    name: "Enterprise SSO",
    description: "Single Sign-On integration cho doanh nghiệp.",
    icon: Shield,
    status: "locked",
    releaseDate: "2024-05-01",
    accessCount: 0,
    enabled: false,
  },
]

const upcomingReleases = [
  {
    version: "v2.5.0",
    date: "2024-01-25",
    features: ["New Portfolio Template", "Drag & Drop Builder", "Multi-language Support"],
  },
  {
    version: "v2.6.0",
    date: "2024-02-15",
    features: ["AI Content Assistant", "Performance Improvements", "New Animations"],
  },
  {
    version: "v3.0.0",
    date: "2024-03-01",
    features: ["Complete UI Redesign", "Custom Themes", "Plugin System"],
  },
]

const statusConfig = {
  available: { label: "Có sẵn", color: "bg-green-500", icon: Unlock },
  coming_soon: { label: "Sắp ra mắt", color: "bg-amber-500", icon: Calendar },
  locked: { label: "Chưa mở", color: "bg-gray-500", icon: Lock },
}

export default function ShaperEarlyAccessPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Early Access</h1>
          </div>
          <p className="text-muted-foreground">
            Trải nghiệm sớm các tính năng thử nghiệm trước tất cả người dùng khác
          </p>
        </div>

        {/* Shaper Badge */}
        <Card className="mb-8 border-accent/30 bg-gradient-to-r from-accent/10 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-accent/20 p-3">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Shaper Status: Active</h3>
                <p className="text-sm text-muted-foreground">
                  Bạn có quyền truy cập sớm vào tất cả tính năng thử nghiệm. Cảm ơn bạn đã đồng hành cùng BYOUR!
                </p>
              </div>
              <Badge className="ml-auto bg-accent text-accent-foreground">
                <Sparkles className="mr-1 h-3 w-3" />
                Shaper
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Experimental Features */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Tính năng thử nghiệm</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {experimentalFeatures.map((feature) => {
              const status = statusConfig[feature.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              const FeatureIcon = feature.icon
              const isAvailable = feature.status === "available"

              return (
                <Card key={feature.id} className={!isAvailable ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-accent/10 p-2">
                          <FeatureIcon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.name}</CardTitle>
                          <CardDescription className="text-xs">
                            Release: {feature.releaseDate}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={`${status.color} text-white`}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>

                    <div className="flex items-center justify-between">
                      {isAvailable ? (
                        <>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{feature.accessCount} người đang dùng</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`feature-${feature.id}`}
                              defaultChecked={feature.enabled}
                            />
                            <Label htmlFor={`feature-${feature.id}`} className="text-sm">
                              {feature.enabled ? "Đang bật" : "Đang tắt"}
                            </Label>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          {feature.status === "coming_soon"
                            ? "Sẽ có sẵn cho Shapers sớm"
                            : "Chưa mở cho early access"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Upcoming Releases */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-accent" />
            Lộ trình phát triển
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {upcomingReleases.map((release, index) => (
                  <div key={release.version} className="relative pl-6">
                    {index < upcomingReleases.length - 1 && (
                      <div className="absolute left-[9px] top-6 h-full w-0.5 bg-border" />
                    )}
                    <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                      <span className="text-[10px] font-bold text-accent-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{release.version}</h4>
                        <Badge variant="outline" className="text-xs">
                          {release.date}
                        </Badge>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {release.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback CTA */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Có góp ý về tính năng?</h3>
                <p className="text-sm text-muted-foreground">
                  Feedback của bạn giúp chúng tôi cải thiện các tính năng trước khi release chính thức.
                </p>
              </div>
              <Button asChild>
                <Link href="/shaper/feedback">
                  Gửi Feedback
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
