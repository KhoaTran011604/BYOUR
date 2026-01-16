"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Globe, Users, Briefcase, Star } from "lucide-react"

// Fake data - sẽ thay bằng dữ liệu từ DB sau
const websites = [
  {
    id: 1,
    name: "Studio Minimal",
    handle: "studiominimal",
    industry: "Design Agency",
    description: "Agency thiết kế với phong cách tối giản, chuyên về branding và UI/UX cho các startup công nghệ.",
    features: ["Portfolio showcase", "Case studies", "Team page", "Contact form"],
    template: "Minimal",
    teamSize: "5-10",
    rating: 4.9,
    preview: "/self/studio-minimal",
  },
  {
    id: 2,
    name: "TechCorp Vietnam",
    handle: "techcorp",
    industry: "Software Development",
    description: "Công ty phát triển phần mềm với đội ngũ hơn 50 developer, chuyên về enterprise solutions.",
    features: ["Services showcase", "Portfolio", "Blog", "Careers page"],
    template: "Editorial",
    teamSize: "50+",
    rating: 4.8,
    preview: "/self/techcorp",
  },
  {
    id: 3,
    name: "Green Marketing",
    handle: "greenmarketing",
    industry: "Marketing Agency",
    description: "Agency marketing digital với focus vào sustainable brands và social impact.",
    features: ["Case studies", "Client testimonials", "Service packages", "Blog"],
    template: "Grid",
    teamSize: "10-20",
    rating: 4.7,
    preview: "/self/green-marketing",
  },
  {
    id: 4,
    name: "Legal Partners",
    handle: "legalpartners",
    industry: "Law Firm",
    description: "Văn phòng luật sư chuyên về luật doanh nghiệp, startup và sở hữu trí tuệ.",
    features: ["Practice areas", "Attorney profiles", "Publications", "Contact"],
    template: "Minimal",
    teamSize: "10-20",
    rating: 4.9,
    preview: "/self/legal-partners",
  },
  {
    id: 5,
    name: "Creative Lab",
    handle: "creativelab",
    industry: "Creative Studio",
    description: "Studio sáng tạo đa ngành: video production, animation, và interactive experiences.",
    features: ["Showreel", "Project gallery", "Services", "Collaboration form"],
    template: "Grid",
    teamSize: "5-10",
    rating: 4.8,
    preview: "/self/creative-lab",
  },
  {
    id: 6,
    name: "Finance Advisory",
    handle: "financeadvisory",
    industry: "Financial Services",
    description: "Công ty tư vấn tài chính cho SMEs và startups, chuyên về fundraising và M&A.",
    features: ["Services", "Team expertise", "Success stories", "Resources"],
    template: "Editorial",
    teamSize: "20-50",
    rating: 4.6,
    preview: "/self/finance-advisory",
  },
]

const industries = ["Tất cả", "Design Agency", "Software Development", "Marketing Agency", "Law Firm", "Creative Studio", "Financial Services"]

export default function ExampleHQWebsitesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Example HQ Websites</h1>
          </div>
          <p className="text-muted-foreground">
            Khám phá các website doanh nghiệp chất lượng cao để lấy cảm hứng cho website của bạn
          </p>
        </div>

        {/* Industries Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {industries.map((industry) => (
            <Badge
              key={industry}
              variant={industry === "Tất cả" ? "default" : "outline"}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              {industry}
            </Badge>
          ))}
        </div>

        {/* Websites Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {websites.map((website) => (
            <Card key={website.id} className="flex flex-col overflow-hidden">
              {/* Preview placeholder */}
              <div className="h-40 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <Globe className="h-12 w-12 text-accent/50" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{website.name}</CardTitle>
                    <CardDescription className="text-xs">byour.co/{website.handle}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{website.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <Badge variant="secondary" className="w-fit mb-3">
                  {website.industry}
                </Badge>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{website.description}</p>

                {/* Info */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>Template: {website.template}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Team: {website.teamSize}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {website.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href={`/khoa-tran`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Xem Preview
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mt-10 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Muốn có website như thế này?</h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade lên HQ Mode để tạo website chuyên nghiệp cho doanh nghiệp của bạn.
                </p>
              </div>
              <Button size="lg" disabled>
                Upgrade to HQ Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
