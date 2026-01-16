"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, FileText, Building2, Calculator, Shield } from "lucide-react"

// Fake data - sẽ thay bằng dữ liệu từ DB sau
const steps = [
  {
    id: 1,
    title: "Chuẩn bị hồ sơ",
    description: "Chuẩn bị CMND/CCCD, ảnh 3x4, và các giấy tờ liên quan",
    details: [
      "Bản sao CMND/CCCD còn hiệu lực",
      "2 ảnh 3x4 nền trắng",
      "Giấy xác nhận địa chỉ thường trú",
      "Bằng cấp chuyên môn (nếu ngành nghề yêu cầu)",
    ],
  },
  {
    id: 2,
    title: "Đăng ký tại cơ quan thuế",
    description: "Đăng ký mã số thuế cá nhân tại Chi cục Thuế quận/huyện",
    details: [
      "Điền tờ khai đăng ký thuế mẫu 01-ĐK-TCT",
      "Nộp hồ sơ tại Chi cục Thuế nơi cư trú",
      "Nhận mã số thuế trong 3-5 ngày làm việc",
      "Kích hoạt tài khoản thuế điện tử",
    ],
  },
  {
    id: 3,
    title: "Đăng ký kinh doanh",
    description: "Đăng ký hộ kinh doanh hoặc doanh nghiệp tư nhân",
    details: [
      "Chọn loại hình: Hộ kinh doanh hoặc DNTN",
      "Đăng ký tên kinh doanh tại Sở KH&ĐT",
      "Nộp lệ phí đăng ký (100,000 - 200,000 VND)",
      "Nhận giấy chứng nhận đăng ký kinh doanh",
    ],
  },
  {
    id: 4,
    title: "Mở tài khoản ngân hàng",
    description: "Mở tài khoản ngân hàng cho hoạt động kinh doanh",
    details: [
      "Chọn ngân hàng phù hợp với nhu cầu",
      "Mang theo CCCD và giấy ĐKKD",
      "Đăng ký Internet Banking",
      "Liên kết với ví điện tử nếu cần",
    ],
  },
]

const taxInfo = [
  {
    title: "Thuế TNCN",
    description: "Thuế thu nhập cá nhân từ hoạt động kinh doanh",
    rate: "0.5% - 5%",
    note: "Tùy thuộc vào ngành nghề và doanh thu",
  },
  {
    title: "Thuế GTGT",
    description: "Thuế giá trị gia tăng (nếu doanh thu > 100 triệu/năm)",
    rate: "1% - 5%",
    note: "Phương pháp khoán hoặc khấu trừ",
  },
  {
    title: "Thuế môn bài",
    description: "Lệ phí môn bài hàng năm",
    rate: "300,000 - 1,000,000 VND",
    note: "Tùy thuộc vào doanh thu năm trước",
  },
]

export default function BusinessRegistrationGuidePage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/self">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Hướng dẫn Đăng ký Kinh doanh</h1>
          </div>
          <p className="text-muted-foreground">
            Hướng dẫn chi tiết các bước đăng ký kinh doanh cá nhân tại Việt Nam
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Các bước thực hiện
          </h2>
          {steps.map((step, index) => (
            <Card key={step.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
                    {step.id}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-16">
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tax Information */}
        <div className="space-y-6 mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" />
            Thông tin về thuế
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {taxInfo.map((tax, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{tax.title}</CardTitle>
                  <CardDescription className="text-xs">{tax.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent mb-1">{tax.rate}</div>
                  <p className="text-xs text-muted-foreground">{tax.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Lưu ý quan trọng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Luôn giữ lại hóa đơn, chứng từ cho các giao dịch kinh doanh</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Nộp thuế đúng hạn để tránh phạt chậm nộp</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Cập nhật thông tin khi có thay đổi về địa chỉ, ngành nghề</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Tham khảo ý kiến kế toán hoặc luật sư nếu cần thiết</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
