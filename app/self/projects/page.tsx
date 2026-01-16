"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Clock, DollarSign, Tag } from "lucide-react"

// Fake data - sẽ thay bằng dữ liệu từ DB sau
const projects = [
  {
    id: 1,
    title: "Website Landing Page cho Startup",
    category: "Web Development",
    description:
      "Thiết kế và phát triển landing page responsive cho startup fintech, tích hợp form đăng ký và animation.",
    client: "TechVN Startup",
    duration: "2 tuần",
    budget: "15,000,000 VND",
    skills: ["React", "Tailwind CSS", "Framer Motion"],
    deliverables: ["Figma design", "Source code", "Deployment"],
    status: "completed",
  },
  {
    id: 2,
    title: "Brand Identity Design",
    category: "Graphic Design",
    description:
      "Thiết kế bộ nhận diện thương hiệu bao gồm logo, color palette, typography và brand guidelines.",
    client: "Coffee House",
    duration: "3 tuần",
    budget: "25,000,000 VND",
    skills: ["Adobe Illustrator", "Photoshop", "Figma"],
    deliverables: ["Logo files", "Brand guidelines PDF", "Social media kit"],
    status: "completed",
  },
  {
    id: 3,
    title: "Mobile App UI/UX Design",
    category: "UI/UX Design",
    description:
      "Thiết kế giao diện và trải nghiệm người dùng cho ứng dụng đặt đồ ăn, bao gồm user research và prototyping.",
    client: "FoodGo",
    duration: "4 tuần",
    budget: "35,000,000 VND",
    skills: ["Figma", "User Research", "Prototyping"],
    deliverables: ["UI Kit", "Interactive prototype", "Design system"],
    status: "completed",
  },
  {
    id: 4,
    title: "Content Writing cho Blog",
    category: "Content Writing",
    description:
      "Viết 20 bài blog SEO-optimized về chủ đề công nghệ và khởi nghiệp, bao gồm keyword research.",
    client: "TechBlog VN",
    duration: "1 tháng",
    budget: "10,000,000 VND",
    skills: ["SEO Writing", "Research", "WordPress"],
    deliverables: ["20 bài viết", "SEO report", "Content calendar"],
    status: "completed",
  },
  {
    id: 5,
    title: "E-commerce Website",
    category: "Web Development",
    description:
      "Xây dựng website bán hàng với tính năng giỏ hàng, thanh toán online và quản lý đơn hàng.",
    client: "Fashion Store",
    duration: "6 tuần",
    budget: "45,000,000 VND",
    skills: ["Next.js", "Stripe", "PostgreSQL"],
    deliverables: ["Full website", "Admin dashboard", "Documentation"],
    status: "completed",
  },
  {
    id: 6,
    title: "Social Media Management",
    category: "Marketing",
    description:
      "Quản lý và phát triển kênh social media trong 3 tháng, bao gồm content creation và community management.",
    client: "Beauty Brand",
    duration: "3 tháng",
    budget: "30,000,000 VND",
    skills: ["Content Creation", "Analytics", "Community Management"],
    deliverables: ["90 posts", "Monthly reports", "Growth strategy"],
    status: "completed",
  },
]

const categories = ["Tất cả", "Web Development", "Graphic Design", "UI/UX Design", "Content Writing", "Marketing"]

export default function ExampleProjectsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Example Projects</h1>
          <p className="text-muted-foreground">
            Tham khảo các dự án freelance thực tế để học hỏi cách trình bày và báo giá
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "Tất cả" ? "default" : "outline"}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className="mb-2">
                    {project.category}
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Hoàn thành
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                <CardDescription className="text-xs">Client: {project.client}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>

                {/* Project Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Thời gian: {project.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Budget: {project.budget}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Skills:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-1">Deliverables:</p>
                  <p className="text-xs">{project.deliverables.join(" • ")}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="mt-10 border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle>Tips khi báo giá dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Luôn làm rõ scope of work trước khi báo giá</li>
              <li>• Tính toán thời gian buffer cho revisions và unexpected issues</li>
              <li>• Đưa ra deliverables cụ thể và có thể đo lường được</li>
              <li>• Chia milestone thanh toán để giảm rủi ro</li>
              <li>• Document mọi thứ trong hợp đồng hoặc email</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
