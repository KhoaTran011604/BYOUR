import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TestingContent } from "@/components/shaper/testing-content"
import { getTestingFeatures, getTestHistory, getShaperStats } from "@/lib/api/shaper"

export default async function ShaperTestingPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch all data in parallel
  const [testingFeatures, testHistory, stats] = await Promise.all([
    getTestingFeatures(),
    getTestHistory(user.id),
    getShaperStats(user.id),
  ])

  return (
    <TestingContent
      userId={user.id}
      testingFeatures={testingFeatures}
      testHistory={testHistory}
      stats={stats}
    />
  )
}
