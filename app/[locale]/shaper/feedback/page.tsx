import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FeedbackContent } from "@/components/shaper/feedback-content"
import {
  getMyFeedbacks,
  getPopularFeedbacks,
  getShaperStats,
  getUserVotedFeedbacks,
} from "@/lib/api/shaper"

export default async function ShaperFeedbackPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch all data in parallel
  const [myFeedbacks, popularFeedbacks, stats, votedFeedbacks] = await Promise.all([
    getMyFeedbacks(user.id),
    getPopularFeedbacks(10),
    getShaperStats(user.id),
    getUserVotedFeedbacks(user.id),
  ])

  return (
    <FeedbackContent
      userId={user.id}
      myFeedbacks={myFeedbacks}
      popularFeedbacks={popularFeedbacks}
      stats={stats}
      votedFeedbacks={votedFeedbacks}
    />
  )
}
