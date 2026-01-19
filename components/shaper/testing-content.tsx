"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  TestTube,
  Play,
  CheckCircle2,
  Clock,
  FileText,
  Bug,
} from "lucide-react"
import type { ShaperTestingFeature, ShaperTestHistory, ShaperStats } from "@/lib/types"
import { testingStatusConfig, formatDuration, formatDate } from "@/lib/data/shaper-data"

interface TestingContentProps {
  userId: string
  testingFeatures: ShaperTestingFeature[]
  testHistory: ShaperTestHistory[]
  stats: ShaperStats | null
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

export function TestingContent({
  userId,
  testingFeatures,
  testHistory,
  stats: initialStats,
}: TestingContentProps) {
  const stats = initialStats || defaultStats
  const totalBugsInTesting = testingFeatures.reduce((sum, f) => sum + f.bugs_count, 0)

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
            <TestTube className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Testing Zone</h1>
          </div>
          <p className="text-muted-foreground">
            Test new features before they are officially released
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{testingFeatures.length}</div>
                <div className="text-sm text-muted-foreground">Features being tested</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">{totalBugsInTesting}</div>
                <div className="text-sm text-muted-foreground">Bugs reported</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{stats.total_bugs_reported}</div>
                <div className="text-sm text-muted-foreground">Bugs you found</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{stats.total_testing_hours}h</div>
                <div className="text-sm text-muted-foreground">Testing time</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features to Test */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Features needing testing</h2>
          {testingFeatures.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No features available for testing at the moment.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {testingFeatures.map((feature) => {
                const statusConfig = testingStatusConfig[feature.status]
                return (
                  <Card key={feature.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{feature.name}</CardTitle>
                          <CardDescription className="text-xs">{feature.version}</CardDescription>
                        </div>
                        <Badge className={`${statusConfig.color} text-white`}>
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>

                      <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">Due: {feature.due_date || "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TestTube className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{feature.testers_count} testers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bug className="h-4 w-4 text-red-500" />
                          <span className="text-xs">{feature.bugs_count} bugs</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/shaper/testing/${feature.id}`}>
                            <Play className="mr-1 h-3 w-3" />
                            Start Testing
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild={!!feature.docs_url}
                          disabled={!feature.docs_url}
                        >
                          {feature.docs_url ? (
                            <Link href={feature.docs_url}>
                              <FileText className="mr-1 h-3 w-3" />
                              Docs
                            </Link>
                          ) : (
                            <>
                              <FileText className="mr-1 h-3 w-3" />
                              Docs
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Testing Guidelines */}
        <Card className="mb-10 border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle>Testing Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Testing process</h4>
                <ol className="space-y-1 text-sm list-decimal list-inside">
                  <li>Read feature description and documentation</li>
                  <li>Click 'Start Testing' to open test environment</li>
                  <li>Try different use cases</li>
                  <li>Report bugs if you find issues</li>
                  <li>Record feedback on UX/UI</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">When reporting bugs</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Describe steps to reproduce the bug</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Take screenshot or record video</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Note browser and device</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Assess severity level</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Test History */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My testing history</h2>
          <Card>
            <CardContent className="pt-4">
              {testHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  You haven't tested any features yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {testHistory.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{test.feature_name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{formatDate(test.tested_at)}</span>
                          <span>•</span>
                          <span>{formatDuration(test.duration_minutes)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Bug className="h-3 w-3" />
                            {test.bugs_found} bugs
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          test.status === "completed"
                            ? "text-green-600 border-green-600"
                            : test.status === "in_progress"
                              ? "text-amber-600 border-amber-600"
                              : "text-gray-600 border-gray-600"
                        }
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {test.status === "completed"
                          ? "Completed"
                          : test.status === "in_progress"
                            ? "In Progress"
                            : "Abandoned"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
