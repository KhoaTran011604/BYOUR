import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Building2, User, Sparkles } from "lucide-react"

const modes = [
  {
    id: "boss",
    title: "Boss",
    description: "Dành cho freelancer chuyên nghiệp muốn xây dựng thương hiệu cá nhân và quản lý công việc độc lập",
    icon: Briefcase,
    features: ["Tạo microsite chuyên nghiệp", "Quản lý dịch vụ & giá cả", "Xây dựng portfolio"],
  },
  {
    id: "hq",
    title: "HQ",
    description: "Dành cho doanh nghiệp và agency muốn có mặt online chuyên nghiệp với website được thiết kế sẵn",
    icon: Building2,
    features: ["3 mẫu thiết kế cao cấp", "Tùy chỉnh nội dung dễ dàng", "URL riêng: byour.co/handle"],
  },
  {
    id: "self",
    title: "Self",
    description: "Dành cho người đang tìm hiểu về freelance và muốn khám phá con đường làm việc độc lập",
    icon: User,
    features: ["Tài nguyên học tập", "Hướng dẫn bắt đầu", "Cộng đồng hỗ trợ"],
  },
  {
    id: "shaper",
    title: "Shaper",
    description: "Dành cho những người đóng góp nội bộ, giúp xây dựng và phát triển nền tảng BYOUR",
    icon: Sparkles,
    features: ["Đóng góp nội dung", "Xây dựng cộng đồng", "Phát triển nền tảng"],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">BYOUR</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#modes"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Chế độ
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Tính năng
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Đăng nhập</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Bắt đầu miễn phí</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Văn phòng kỹ thuật số
              <span className="block text-accent">cho thời đại mới</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              BYOUR không chỉ là bảng tin việc làm - đây là không gian để các chuyên gia độc lập xây dựng cấu trúc công
              việc riêng. Một đăng nhập, bốn chế độ linh hoạt.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/auth/sign-up">
                  Tạo văn phòng của bạn
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="#modes">Khám phá các chế độ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section id="modes" className="border-t border-border/50 bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Một tài khoản, bốn chế độ</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Chuyển đổi linh hoạt giữa các vai trò tùy theo nhu cầu của bạn
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modes.map((mode) => (
              <div
                key={mode.id}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <mode.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{mode.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{mode.description}</p>
                <ul className="mt-4 space-y-2">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">HQ Website Builder</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tạo microsite chuyên nghiệp trong vài phút với công cụ kéo-thả trực quan
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="text-lg font-semibold">3 mẫu thiết kế</h3>
              <p className="mt-2 text-muted-foreground">
                Minimal, Editorial, Grid - mỗi mẫu được thiết kế tỉ mỉ để đảm bảo thẩm mỹ cao cấp
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="text-lg font-semibold">4 khối nội dung</h3>
              <p className="mt-2 text-muted-foreground">
                Hero, About, Services, Contact - kéo thả sắp xếp lại thứ tự theo ý muốn
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="text-lg font-semibold">Phong cách khóa</h3>
              <p className="mt-2 text-muted-foreground">
                Thiết kế được kiểm soát chặt chẽ để website của bạn luôn nhất quán và chuyên nghiệp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">Sẵn sàng bắt đầu?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Tạo văn phòng kỹ thuật số của riêng bạn ngay hôm nay. Hoàn toàn miễn phí.
          </p>
          <Button size="lg" variant="secondary" asChild className="mt-8">
            <Link href="/auth/sign-up">
              Đăng ký miễn phí
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">BYOUR</span>
              <span className="text-sm text-muted-foreground">© 2026</span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Điều khoản
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Bảo mật
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Liên hệ
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
