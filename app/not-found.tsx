import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center">
        <div className="mb-6">
          <span className="text-2xl font-bold">TEST-002</span>
        </div>
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Trang không tồn tại</h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          Xin lỗi, chúng tôi không tìm thấy trang bạn đang tìm kiếm.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
