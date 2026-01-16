"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Plane,
  FileText,
  Euro,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  CheckCircle2,
} from "lucide-react"

// Fake data - sẽ thay bằng dữ liệu từ DB sau
const visaTypes = [
  {
    name: "Working Holiday Visa",
    duration: "1 năm",
    requirements: ["18-30 tuổi", "Hộ chiếu VN", "Chứng minh tài chính €3,000", "Bảo hiểm y tế"],
    processing: "4-8 tuần",
    fee: "€100",
  },
  {
    name: "Critical Skills Employment Permit",
    duration: "2 năm",
    requirements: ["Job offer từ Irish company", "Lương tối thiểu €32,000/năm", "Bằng cấp liên quan", "Kinh nghiệm"],
    processing: "8-12 tuần",
    fee: "€1,000",
  },
  {
    name: "Stamp 1G (Graduate Visa)",
    duration: "1-2 năm",
    requirements: ["Tốt nghiệp từ trường Irish", "Bằng Level 8+", "Apply trong vòng 6 tháng sau tốt nghiệp"],
    processing: "2-4 tuần",
    fee: "€300",
  },
]

const taxInfo = [
  {
    title: "Income Tax",
    rate: "20% - 40%",
    description: "20% cho €40,000 đầu tiên, 40% cho phần còn lại",
  },
  {
    title: "USC (Universal Social Charge)",
    rate: "0.5% - 8%",
    description: "Phụ thu xã hội dựa trên thu nhập",
  },
  {
    title: "PRSI (Social Insurance)",
    rate: "4%",
    description: "Bảo hiểm xã hội bắt buộc",
  },
]

const cities = [
  {
    name: "Dublin",
    description: "Thủ đô và trung tâm tech lớn nhất",
    avgSalary: "€50,000 - €80,000",
    costOfLiving: "Cao",
    highlights: ["Google, Meta, LinkedIn HQ", "Startup ecosystem mạnh", "Networking opportunities"],
  },
  {
    name: "Cork",
    description: "Thành phố lớn thứ hai với tech scene đang phát triển",
    avgSalary: "€45,000 - €70,000",
    costOfLiving: "Trung bình - Cao",
    highlights: ["Apple European HQ", "Chi phí thấp hơn Dublin", "Chất lượng sống tốt"],
  },
  {
    name: "Galway",
    description: "Thành phố văn hóa với ngành medtech phát triển",
    avgSalary: "€40,000 - €65,000",
    costOfLiving: "Trung bình",
    highlights: ["Medtech hub", "University town", "Coastal lifestyle"],
  },
]

const freelanceOpportunities = [
  {
    field: "Software Development",
    demand: "Rất cao",
    avgRate: "€50-100/giờ",
    platforms: ["Toptal", "Upwork", "LinkedIn"],
  },
  {
    field: "UI/UX Design",
    demand: "Cao",
    avgRate: "€40-80/giờ",
    platforms: ["Dribbble", "Behance", "99designs"],
  },
  {
    field: "Digital Marketing",
    demand: "Cao",
    avgRate: "€35-70/giờ",
    platforms: ["Fiverr", "Upwork", "PeoplePerHour"],
  },
  {
    field: "Content & Translation",
    demand: "Trung bình",
    avgRate: "€25-50/giờ",
    platforms: ["ProZ", "TranslatorsCafe", "Upwork"],
  },
]

export default function IrelandGuidePage() {
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
            <MapPin className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Ireland Guide</h1>
          </div>
          <p className="text-muted-foreground">
            Hướng dẫn toàn diện về làm việc và freelance tại Ireland
          </p>
        </div>

        {/* Visa Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5 text-accent" />
            Các loại Visa phổ biến
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {visaTypes.map((visa) => (
              <Card key={visa.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{visa.name}</CardTitle>
                  <CardDescription>Thời hạn: {visa.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Yêu cầu:</p>
                      <ul className="text-xs space-y-1">
                        {visa.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t">
                      <span>Xử lý: {visa.processing}</span>
                      <span className="font-medium">{visa.fee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tax Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Euro className="h-5 w-5 text-accent" />
            Thông tin về Thuế
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {taxInfo.map((tax) => (
              <Card key={tax.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{tax.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent mb-1">{tax.rate}</div>
                  <p className="text-xs text-muted-foreground">{tax.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-4 border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-4">
              <p className="text-sm">
                <strong>Lưu ý:</strong> Freelancer có thể đăng ký làm Sole Trader hoặc thành lập Limited Company.
                Tham khảo Revenue.ie để biết thêm chi tiết về nghĩa vụ thuế.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cities Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-accent" />
            Các thành phố nên cân nhắc
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {cities.map((city) => (
              <Card key={city.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{city.name}</CardTitle>
                  <CardDescription>{city.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lương TB:</span>
                      <span className="font-medium">{city.avgSalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chi phí:</span>
                      <Badge variant="outline">{city.costOfLiving}</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Highlights:</p>
                    <ul className="text-xs space-y-1">
                      {city.highlights.map((h, idx) => (
                        <li key={idx}>• {h}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Freelance Opportunities */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-accent" />
            Cơ hội Freelance
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {freelanceOpportunities.map((opp) => (
              <Card key={opp.field}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{opp.field}</CardTitle>
                    <Badge variant={opp.demand === "Rất cao" ? "default" : "secondary"}>{opp.demand}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Rate trung bình:</span>
                    <span className="font-semibold text-accent">{opp.avgRate}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Platforms:</p>
                    <div className="flex flex-wrap gap-1">
                      {opp.platforms.map((p) => (
                        <Badge key={p} variant="outline" className="text-xs">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Resources */}
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-accent" />
              Tài nguyên hữu ích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Chính thức</h4>
                <ul className="space-y-1 text-sm">
                  <li>• citizensinformation.ie - Thông tin công dân</li>
                  <li>• revenue.ie - Cơ quan thuế</li>
                  <li>• enterprise-ireland.com - Hỗ trợ doanh nghiệp</li>
                  <li>• dbei.gov.ie - Work permits</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cộng đồng</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Vietnamese in Ireland (Facebook)</li>
                  <li>• Tech Ireland Slack</li>
                  <li>• Dublin Freelancers Meetup</li>
                  <li>• r/ireland subreddit</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
