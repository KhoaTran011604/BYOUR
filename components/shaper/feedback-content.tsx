"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  Send,
  Loader2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { ShaperFeedback, ShaperFeedbackType, ShaperStats } from "@/lib/types"
import { feedbackStatusConfig, formatDate } from "@/lib/data/shaper-data"

interface FeedbackContentProps {
  userId: string
  myFeedbacks: ShaperFeedback[]
  popularFeedbacks: (ShaperFeedback & { author_name: string })[]
  stats: ShaperStats | null
  votedFeedbacks: string[]
}

const typeIconMap = {
  bug: Bug,
  feature: Lightbulb,
  improvement: ThumbsUp,
}

const feedbackTypeConfig = {
  bug: { label: "Bug", color: "text-red-500" },
  feature: { label: "Feature", color: "text-blue-500" },
  improvement: { label: "Improvement", color: "text-green-500" },
}

const defaultStats: ShaperStats = {
  total_feedbacks: 0,
  total_bugs_reported: 0,
  total_features_tested: 0,
  total_testing_hours: 0,
  ranking: 0,
  total_shapers: 0,
  feedbacks_completed: 0,
  feedbacks_in_progress: 0,
  total_votes_received: 0,
}

export function FeedbackContent({
  userId,
  myFeedbacks: initialMyFeedbacks,
  popularFeedbacks: initialPopularFeedbacks,
  stats: initialStats,
  votedFeedbacks: initialVotedFeedbacks,
}: FeedbackContentProps) {
  const router = useRouter()
  const [feedbackType, setFeedbackType] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [myFeedbacks, setMyFeedbacks] = useState(initialMyFeedbacks)
  const [popularFeedbacks, setPopularFeedbacks] = useState(initialPopularFeedbacks)
  const [votedFeedbacks, setVotedFeedbacks] = useState(initialVotedFeedbacks)

  const stats = initialStats || defaultStats

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedbackType || !title.trim() || !description.trim()) {
      setSubmitError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const supabase = createClient()

    const { data, error } = await supabase
      .from("shaper_feedbacks")
      .insert({
        user_id: userId,
        type: feedbackType as ShaperFeedbackType,
        title: title.trim(),
        description: description.trim(),
      })
      .select()
      .single()

    if (error) {
      setSubmitError(error.message)
      setIsSubmitting(false)
      return
    }

    // Add to local state
    setMyFeedbacks([data, ...myFeedbacks])

    // Reset form
    setFeedbackType("")
    setTitle("")
    setDescription("")
    setIsSubmitting(false)

    // Refresh the page data
    router.refresh()
  }

  const handleVote = async (feedbackId: string) => {
    const supabase = createClient()
    const isVoted = votedFeedbacks.includes(feedbackId)

    if (isVoted) {
      // Remove vote
      await supabase
        .from("shaper_feedback_votes")
        .delete()
        .eq("feedback_id", feedbackId)
        .eq("user_id", userId)

      await supabase
        .from("shaper_feedbacks")
        .update({ votes: popularFeedbacks.find((f) => f.id === feedbackId)?.votes! - 1 })
        .eq("id", feedbackId)

      setVotedFeedbacks(votedFeedbacks.filter((id) => id !== feedbackId))
      setPopularFeedbacks(
        popularFeedbacks.map((f) =>
          f.id === feedbackId ? { ...f, votes: f.votes - 1 } : f
        )
      )
    } else {
      // Add vote
      await supabase.from("shaper_feedback_votes").insert({
        feedback_id: feedbackId,
        user_id: userId,
      })

      await supabase
        .from("shaper_feedbacks")
        .update({ votes: popularFeedbacks.find((f) => f.id === feedbackId)?.votes! + 1 })
        .eq("id", feedbackId)

      setVotedFeedbacks([...votedFeedbacks, feedbackId])
      setPopularFeedbacks(
        popularFeedbacks.map((f) =>
          f.id === feedbackId ? { ...f, votes: f.votes + 1 } : f
        )
      )
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/shaper">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Feedback Hub</h1>
          </div>
          <p className="text-muted-foreground">
            Contribute feedback to help improve the platform
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Submit Feedback Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submit new Feedback</CardTitle>
                <CardDescription>
                  Share ideas, report bugs, or suggest improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Feedback type</Label>
                    <Select value={feedbackType} onValueChange={setFeedbackType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">
                          <div className="flex items-center gap-2">
                            <Bug className="h-4 w-4 text-red-500" />
                            Bug - Report an issue
                          </div>
                        </SelectItem>
                        <SelectItem value="feature">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-500" />
                            Feature - Suggest new feature
                          </div>
                        </SelectItem>
                        <SelectItem value="improvement">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            Improvement - Improve existing feature
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of your feedback"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Details</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your feedback in detail. If it's a bug, please provide steps to reproduce."
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {submitError && <p className="text-sm text-red-500">{submitError}</p>}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* My Feedbacks */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">My Feedback</h2>
              {myFeedbacks.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    You haven't submitted any feedback yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myFeedbacks.map((feedback) => {
                    const TypeIcon = typeIconMap[feedback.type]
                    const typeConfig = feedbackTypeConfig[feedback.type]
                    const statusConfig = feedbackStatusConfig[feedback.status]
                    return (
                      <Card key={feedback.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <TypeIcon className={`h-4 w-4 ${typeConfig.color}`} />
                                <span className="font-medium">{feedback.title}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {feedback.description}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(feedback.created_at)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {feedback.votes} votes
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`${statusConfig.color} text-white shrink-0`}
                            >
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Popular Feedbacks */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Popular Feedback</CardTitle>
                <CardDescription>Upvote ideas you like</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {popularFeedbacks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    No feedbacks yet
                  </p>
                ) : (
                  popularFeedbacks.map((feedback) => {
                    const statusConfig = feedbackStatusConfig[feedback.status]
                    const isVoted = votedFeedbacks.includes(feedback.id)
                    return (
                      <div
                        key={feedback.id}
                        className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                      >
                        <Button
                          variant={isVoted ? "default" : "outline"}
                          size="sm"
                          className="h-auto py-2 px-2 flex flex-col items-center gap-0"
                          onClick={() => handleVote(feedback.id)}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span className="text-xs font-bold">{feedback.votes}</span>
                        </Button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{feedback.title}</p>
                          <p className="text-xs text-muted-foreground">
                            by {feedback.author_name}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Your statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-accent">{stats.total_feedbacks}</div>
                    <div className="text-xs text-muted-foreground">Feedbacks</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-accent">
                      {stats.total_votes_received}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Votes</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-green-500">
                      {stats.feedbacks_completed}
                    </div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-amber-500">
                      {stats.feedbacks_in_progress}
                    </div>
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
