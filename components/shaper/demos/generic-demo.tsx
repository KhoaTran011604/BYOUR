"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertCircle } from "lucide-react"
import type { DemoComponentProps } from "./index"

interface GenericDemoProps extends DemoComponentProps {
  testUrl?: string | null
  instructions?: string | null
}

export function GenericDemo({ featureId, testUrl, instructions, onInteraction }: GenericDemoProps) {
  return (
    <div className="space-y-6">
      {/* Instructions */}
      {instructions && (
        <div className="rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 p-4 border border-accent/20">
          <h3 className="font-semibold text-lg mb-2">Hướng dẫn Demo</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{instructions}</p>
        </div>
      )}

      {testUrl ? (
        /* External Demo Link */
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <ExternalLink className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Demo tính năng</h3>
            <p className="text-muted-foreground mb-6">
              Tính năng này có môi trường demo riêng. Nhấn nút bên dưới để mở và thử nghiệm.
            </p>
            <Button size="lg" asChild onClick={() => onInteraction?.()}>
              <a href={testUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Mở Demo
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* No Demo Available */
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Chưa có Demo</h3>
            <p className="text-muted-foreground mb-4">
              Tính năng này chưa có môi trường demo trực tiếp. Vui lòng đọc tài liệu và chuyển sang
              phần Checklist để bắt đầu đánh giá.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <div className="rounded-lg bg-muted/50 p-4 text-sm">
        <p className="font-medium mb-2">Lưu ý:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Hãy dành thời gian trải nghiệm tính năng trước khi đánh giá</li>
          <li>Ghi nhận các vấn đề hoặc ấn tượng ban đầu</li>
          <li>Sau khi hoàn thành, chuyển sang tab Checklist</li>
        </ul>
      </div>
    </div>
  )
}
