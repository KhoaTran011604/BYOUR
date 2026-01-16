"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  MessageSquare,
  Bug,
  Lightbulb,
  ThumbsUp,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react"

// Fake data - sẽ thay bằng dữ liệu từ DB sau
const myFeedbacks = [
  {
    id: 1,
    type: "feature",
    title: "Thêm dark mode cho dashboard",
    description: "Mong muốn có option dark mode để làm việc ban đêm dễ chịu hơn.",
    status: "reviewing",
    votes: 24,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    type: "bug",
    title: "Lỗi không save được block Creative",
    description: "Khi thêm nhiều items vào creative block, đôi khi không save được.",
    status: "in_progress",
    votes: 8,
    createdAt: "2024-01-08",
  },
  {
    id: 3,
    type: "improvement",
    title: "Cải thiện tốc độ load trang builder",
    description: "Builder hơi chậm khi có nhiều blocks, mong team optimize.",
    status: "completed",
    votes: 45,
    createdAt: "2024-01-05",
  },
]

const popularFeedbacks = [
  {
    id: 101,
    type: "feature",
    title: "Tích hợp Google Analytics",
    author: "Minh Tran",
    votes: 89,
    status: "planned",
  },
  {
    id: 102,
    type: "feature",
    title: "Export website thành PDF portfolio",
    author: "Linh Nguyen",
    votes: 67,
    status: "reviewing",
  },
  {
    id: 103,
    type: "feature",
    title: "Custom domain support",
    author: "Duc Pham",
    votes: 156,
    status: "in_progress",
  },
  {
    id: 104,
    type: "improvement",
    title: "Thêm nhiều template hơn",
    author: "Hoa Le",
    votes: 78,
    status: "planned",
  },
]

const statusConfig = {
  pending: { label: "Đang chờ", color: "bg-gray-500" },
  reviewing: { label: "Đang xem xét", color: "bg-blue-500" },
  planned: { label: "Đã lên kế hoạch", color: "bg-purple-500" },
  in_progress: { label: "Đang thực hiện", color: "bg-amber-500" },
  completed: { label: "Hoàn thành", color: "bg-green-500" },
}

const typeConfig = {
  bug: { label: "Bug", icon: Bug, color: "text-red-500" },
  feature: { label: "Feature", icon: Lightbulb, color: "text-blue-500" },
  improvement: { label: "Cải thiện", icon: ThumbsUp, color: "text-green-500" },
}

export default function ShaperFeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<string>("")

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
            <MessageSquare className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Feedback Hub</h1>
          </div>
          <p className="text-muted-foreground">
            Đóng góp ý kiến để giúp BYOUR trở nên tốt hơn
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Submit Feedback Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Gửi Feedback mới</CardTitle>
                <CardDescription>
                  Chia sẻ ý tưởng, báo cáo lỗi hoặc đề xuất cải thiện
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Loại feedback</Label>
                  <Select value={feedbackType} onValueChange={setFeedbackType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại feedback" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">
                        <div className="flex items-center gap-2">
                          <Bug className="h-4 w-4 text-red-500" />
                          Bug - Báo cáo lỗi
                        </div>
                      </SelectItem>
                      <SelectItem value="feature">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-500" />
                          Feature - Đề xuất tính năng mới
                        </div>
                      </SelectItem>
                      <SelectItem value="improvement">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                          Improvement - Cải thiện tính năng có sẵn
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input id="title" placeholder="Mô tả ngắn gọn feedback của bạn" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Chi tiết</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết feedback của bạn. Nếu là bug, vui lòng cung cấp các bước để tái hiện lỗi."
                    rows={5}
                  />
                </div>

                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Gửi Feedback
                </Button>
              </CardContent>
            </Card>

            {/* My Feedbacks */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Feedback của tôi</h2>
              <div className="space-y-4">
                {myFeedbacks.map((feedback) => {
                  const TypeIcon = typeConfig[feedback.type as keyof typeof typeConfig].icon
                  const status = statusConfig[feedback.status as keyof typeof statusConfig]
                  return (
                    <Card key={feedback.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <TypeIcon
                                className={`h-4 w-4 ${typeConfig[feedback.type as keyof typeof typeConfig].color}`}
                              />
                              <span className="font-medium">{feedback.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {feedback.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {feedback.createdAt}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {feedback.votes} votes
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`${status.color} text-white shrink-0`}
                          >
                            {status.label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Popular Feedbacks */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Feedback phổ biến</CardTitle>
                <CardDescription>Upvote những ý tưởng bạn thích</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularFeedbacks.map((feedback) => {
                  const status = statusConfig[feedback.status as keyof typeof statusConfig]
                  return (
                    <div
                      key={feedback.id}
                      className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-auto py-2 px-2 flex flex-col items-center gap-0"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span className="text-xs font-bold">{feedback.votes}</span>
                      </Button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{feedback.title}</p>
                        <p className="text-xs text-muted-foreground">by {feedback.author}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Thống kê của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-accent">3</div>
                    <div className="text-xs text-muted-foreground">Feedbacks</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-accent">77</div>
                    <div className="text-xs text-muted-foreground">Total Votes</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-green-500">1</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-amber-500">1</div>
                    <div className="text-xs text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
