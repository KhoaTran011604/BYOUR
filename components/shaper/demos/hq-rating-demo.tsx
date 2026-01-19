"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star, Send, ThumbsUp, ThumbsDown, User, Building2, Clock, CheckCircle2 } from "lucide-react"
import type { DemoComponentProps } from "./index"

interface MockBoss {
  id: string
  name: string
  business_name: string
  avatar: string
  total_projects: number
  rating: number
  response_time: string
}

const MOCK_BOSSES: MockBoss[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    business_name: "ABC Tech Solutions",
    avatar: "/avatars/boss1.png",
    total_projects: 15,
    rating: 4.5,
    response_time: "< 1 hour",
  },
  {
    id: "2",
    name: "Trần Thị B",
    business_name: "Creative Studio",
    avatar: "/avatars/boss2.png",
    total_projects: 8,
    rating: 0, // No rating yet
    response_time: "< 30 mins",
  },
  {
    id: "3",
    name: "Lê Minh C",
    business_name: "Digital Marketing Pro",
    avatar: "/avatars/boss3.png",
    total_projects: 23,
    rating: 3.8,
    response_time: "< 2 hours",
  },
]

interface RatingFormState {
  bossId: string | null
  rating: number
  review: string
  wouldRecommend: boolean | null
  submitted: boolean
}

export function HQRatingDemo({ featureId, userId, onInteraction }: DemoComponentProps) {
  const [selectedBoss, setSelectedBoss] = useState<MockBoss | null>(null)
  const [ratingForm, setRatingForm] = useState<RatingFormState>({
    bossId: null,
    rating: 0,
    review: "",
    wouldRecommend: null,
    submitted: false,
  })

  const handleSelectBoss = (boss: MockBoss) => {
    setSelectedBoss(boss)
    setRatingForm({
      bossId: boss.id,
      rating: 0,
      review: "",
      wouldRecommend: null,
      submitted: false,
    })
    onInteraction?.()
  }

  const handleRatingChange = (value: number) => {
    setRatingForm((prev) => ({ ...prev, rating: value }))
    onInteraction?.()
  }

  const handleSubmitRating = () => {
    if (ratingForm.rating === 0 || ratingForm.wouldRecommend === null) return
    setRatingForm((prev) => ({ ...prev, submitted: true }))
    onInteraction?.()
  }

  const handleReset = () => {
    setSelectedBoss(null)
    setRatingForm({
      bossId: null,
      rating: 0,
      review: "",
      wouldRecommend: null,
      submitted: false,
    })
  }

  const renderStars = (value: number, onChange?: (v: number) => void, size: "sm" | "lg" = "lg") => {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-6 w-6"
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            disabled={!onChange}
            className={`p-0.5 transition-transform ${onChange ? "hover:scale-110 cursor-pointer" : ""}`}
          >
            <Star
              className={`${sizeClass} ${
                star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <div className="rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 p-4 border border-accent/20">
        <h3 className="font-semibold text-lg mb-1">HQ Rating Demo</h3>
        <p className="text-sm text-muted-foreground">
          Đây là demo của tính năng đánh giá Boss sau khi hoàn thành dự án. Hãy thử các chức năng bên dưới.
        </p>
      </div>

      {!selectedBoss ? (
        /* Boss Selection */
        <div className="space-y-4">
          <h4 className="font-medium">Chọn Boss để đánh giá:</h4>
          <div className="grid gap-4 md:grid-cols-3">
            {MOCK_BOSSES.map((boss) => (
              <Card
                key={boss.id}
                className="cursor-pointer transition-all hover:border-accent hover:shadow-md"
                onClick={() => handleSelectBoss(boss)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{boss.name}</p>
                      <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {boss.business_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {boss.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            {renderStars(Math.round(boss.rating), undefined, "sm")}
                            <span className="text-xs text-muted-foreground">({boss.rating})</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Chưa có đánh giá
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Phản hồi: {boss.response_time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : ratingForm.submitted ? (
        /* Success State */
        <Card className="text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Cảm ơn bạn đã đánh giá!</h3>
            <p className="text-muted-foreground mb-4">
              Đánh giá của bạn cho {selectedBoss.name} đã được ghi nhận.
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              {renderStars(ratingForm.rating, undefined, "lg")}
              <span className="font-medium">({ratingForm.rating}/5)</span>
            </div>
            <Button onClick={handleReset}>Thử lại với Boss khác</Button>
          </CardContent>
        </Card>
      ) : (
        /* Rating Form */
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle>{selectedBoss.name}</CardTitle>
                  <CardDescription>{selectedBoss.business_name}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Chọn Boss khác
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Đánh giá tổng thể *</Label>
              <div className="flex items-center gap-3">
                {renderStars(ratingForm.rating, handleRatingChange)}
                {ratingForm.rating > 0 && (
                  <span className="text-lg font-medium">{ratingForm.rating}/5</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {ratingForm.rating === 0 && "Chọn số sao để đánh giá"}
                {ratingForm.rating === 1 && "Rất tệ"}
                {ratingForm.rating === 2 && "Tệ"}
                {ratingForm.rating === 3 && "Bình thường"}
                {ratingForm.rating === 4 && "Tốt"}
                {ratingForm.rating === 5 && "Xuất sắc"}
              </p>
            </div>

            {/* Would Recommend */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Bạn có giới thiệu Boss này cho người khác? *</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={ratingForm.wouldRecommend === true ? "default" : "outline"}
                  className={`flex-1 ${ratingForm.wouldRecommend === true ? "bg-green-500 hover:bg-green-600" : ""}`}
                  onClick={() => {
                    setRatingForm((prev) => ({ ...prev, wouldRecommend: true }))
                    onInteraction?.()
                  }}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Có
                </Button>
                <Button
                  type="button"
                  variant={ratingForm.wouldRecommend === false ? "default" : "outline"}
                  className={`flex-1 ${ratingForm.wouldRecommend === false ? "bg-red-500 hover:bg-red-600" : ""}`}
                  onClick={() => {
                    setRatingForm((prev) => ({ ...prev, wouldRecommend: false }))
                    onInteraction?.()
                  }}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Không
                </Button>
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <Label htmlFor="review" className="text-base font-medium">
                Nhận xét (tùy chọn)
              </Label>
              <Textarea
                id="review"
                placeholder="Chia sẻ trải nghiệm làm việc với Boss này..."
                value={ratingForm.review}
                onChange={(e) => {
                  setRatingForm((prev) => ({ ...prev, review: e.target.value }))
                  onInteraction?.()
                }}
                rows={4}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleSubmitRating}
                disabled={ratingForm.rating === 0 || ratingForm.wouldRecommend === null}
              >
                <Send className="mr-2 h-4 w-4" />
                Gửi đánh giá
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Info */}
      <div className="rounded-lg bg-muted/50 p-4 text-sm">
        <p className="font-medium mb-2">Lưu ý:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Đây là môi trường demo, dữ liệu không được lưu thực tế</li>
          <li>Hãy thử tất cả các thao tác để hiểu rõ tính năng</li>
          <li>Sau khi dùng thử, chuyển sang tab Checklist để đánh giá các test case</li>
        </ul>
      </div>
    </div>
  )
}
