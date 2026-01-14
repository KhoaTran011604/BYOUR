import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Không tìm thấy trang</h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Trang web bạn đang tìm kiếm không tồn tại hoặc chưa được xuất bản.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Về trang chủ BYOUR</Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/auth/sign-up">Tạo website của bạn</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
