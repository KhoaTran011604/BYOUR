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
  AlertCircle,
  Clock,
  FileText,
  ExternalLink,
  Bug,
} from "lucide-react"

// Fake data - will be replaced with DB data later
const testingFeatures = [
  {
    id: 1,
    name: "New Template: Portfolio Pro",
    description: "New portfolio template with beautiful layouts and animations.",
    version: "v2.5.0-beta",
    status: "testing",
    dueDate: "2024-01-20",
    testers: 12,
    bugs: 3,
    testUrl: "/builder/new?template=portfolio-pro-beta",
  },
  {
    id: 2,
    name: "Drag & Drop Reordering",
    description: "Drag and drop feature to reorder blocks in builder.",
    version: "v2.5.0-beta",
    status: "testing",
    dueDate: "2024-01-18",
    testers: 8,
    bugs: 1,
    testUrl: "/builder/test-dnd",
  },
  {
    id: 3,
    name: "AI Content Generator",
    description: "Use AI to auto-generate content for blocks.",
    version: "v2.6.0-alpha",
    status: "alpha",
    dueDate: "2024-02-01",
    testers: 5,
    bugs: 7,
    testUrl: "/builder/test-ai",
  },
  {
    id: 4,
    name: "Multi-language Support",
    description: "Multi-language support for website with translation management.",
    version: "v2.5.0-beta",
    status: "ready",
    dueDate: "2024-01-15",
    testers: 15,
    bugs: 0,
    testUrl: "/builder/test-i18n",
  },
]

const myTestHistory = [
  {
    id: 1,
    feature: "New Template: Portfolio Pro",
    date: "2024-01-12",
    duration: "45 minutes",
    bugsFound: 2,
    status: "completed",
  },
  {
    id: 2,
    feature: "Drag & Drop Reordering",
    date: "2024-01-10",
    duration: "30 minutes",
    bugsFound: 1,
    status: "completed",
  },
  {
    id: 3,
    feature: "Dark Mode",
    date: "2024-01-05",
    duration: "1 hour",
    bugsFound: 0,
    status: "completed",
  },
]

const statusConfig = {
  alpha: { label: "Alpha", color: "bg-purple-500", description: "Very early, many bugs" },
  testing: { label: "Beta Testing", color: "bg-amber-500", description: "Testing" },
  ready: { label: "Ready", color: "bg-green-500", description: "Ready for release" },
}

export default function ShaperTestingPage() {
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
            <h1 className="text-3xl font-bold">Testing Environment</h1>
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
                <div className="text-3xl font-bold text-accent">4</div>
                <div className="text-sm text-muted-foreground">Features being tested</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-500">11</div>
                <div className="text-sm text-muted-foreground">Bugs reported</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">3</div>
                <div className="text-sm text-muted-foreground">Bugs you found</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">2h 15m</div>
                <div className="text-sm text-muted-foreground">Testing time</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features to Test */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Features needing testing</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {testingFeatures.map((feature) => {
              const status = statusConfig[feature.status as keyof typeof statusConfig]
              return (
                <Card key={feature.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{feature.name}</CardTitle>
                        <CardDescription className="text-xs">{feature.version}</CardDescription>
                      </div>
                      <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">Due: {feature.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TestTube className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{feature.testers} testers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bug className="h-4 w-4 text-red-500" />
                        <span className="text-xs">{feature.bugs} bugs</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" disabled>
                        <Play className="mr-1 h-3 w-3" />
                        Start Testing
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        <FileText className="mr-1 h-3 w-3" />
                        Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
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
              <div className="space-y-4">
                {myTestHistory.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{test.feature}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{test.date}</span>
                        <span>•</span>
                        <span>{test.duration}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Bug className="h-3 w-3" />
                          {test.bugsFound} bugs
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
