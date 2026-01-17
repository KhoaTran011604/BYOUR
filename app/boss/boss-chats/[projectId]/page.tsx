"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ProjectGroupChat } from "@/components/shared/project-group-chat"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  MessageSquare,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  Loader2,
} from "lucide-react"
import type { HQProject, HQMilestone } from "@/lib/types"

interface ProjectWithDetails extends HQProject {
  hq_profiles?: {
    company_name: string
    hq_business_profiles?: {
      display_name: string
      logo_url: string | null
    }
  }
}

export default function BossChatDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<ProjectWithDetails | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const [milestones, setMilestones] = useState<HQMilestone[]>([])
  const [currentUser, setCurrentUser] = useState<{
    id: string
    name: string
    avatar: string | null
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProject()
  }, [projectId])

  const loadProject = async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profile) {
      setCurrentUser({
        id: user.id,
        name: profile.full_name || "You",
        avatar: profile.avatar_url,
      })
    }

    // Get project with HQ profile info
    const { data: projectData, error: projectError } = await supabase
      .from("hq_projects")
      .select(`
        *,
        hq_profiles (
          company_name,
          hq_business_profiles (
            display_name,
            logo_url
          )
        )
      `)
      .eq("id", projectId)
      .single()

    if (projectError || !projectData) {
      console.error("Error loading project:", projectError)
      router.push("/boss/boss-chats")
      return
    }

    setProject(projectData)

    // Get or check for existing chat
    const { data: chatData } = await supabase
      .from("hq_project_chats")
      .select("id")
      .eq("project_id", projectId)
      .single()

    if (chatData) {
      setChatId(chatData.id)
    }

    // Get milestones
    const { data: milestonesData } = await supabase
      .from("hq_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })

    if (milestonesData) {
      setMilestones(milestonesData)
    }

    setIsLoading(false)
  }

  const getClientName = () => {
    if (!project) return "Client"
    return (
      project.hq_profiles?.hq_business_profiles?.display_name ||
      project.hq_profiles?.company_name ||
      "Client"
    )
  }

  const statusConfig: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    draft: { variant: "outline", label: "Draft" },
    open: { variant: "secondary", label: "Open" },
    in_progress: { variant: "default", label: "In Progress" },
    review: { variant: "secondary", label: "Under Review" },
    completed: { variant: "default", label: "Completed" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!project || !currentUser) {
    return null
  }

  const status = statusConfig[project.status] || statusConfig.draft

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/boss/boss-chats">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chats
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{getClientName()}</span>
          </div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chat">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <FileText className="h-4 w-4" />
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <ProjectGroupChat
            projectId={projectId}
            chatId={chatId}
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
            currentUserAvatar={currentUser.avatar}
            userRole="boss"
          />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                    Description
                  </h4>
                  <p className="text-sm">{project.description}</p>
                </div>

                {project.requirements && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                      Requirements
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {project.requirements}
                    </p>
                  </div>
                )}

                {project.deliverables && project.deliverables.length > 0 && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                      Deliverables
                    </h4>
                    <ul className="list-inside list-disc text-sm">
                      {project.deliverables.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.skills_required && project.skills_required.length > 0 && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                      Skills Required
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {project.skills_required.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget & Timeline */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {project.currency}
                    {project.budget_min?.toLocaleString()} - {project.currency}
                    {project.budget_max?.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.deadline && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Deadline</span>
                      <span className="font-medium">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {project.timeline_start && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Date</span>
                      <span className="font-medium">
                        {new Date(project.timeline_start).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {project.timeline_end && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">End Date</span>
                      <span className="font-medium">
                        {new Date(project.timeline_end).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Milestones */}
              {milestones.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-medium">{milestone.title}</p>
                            {milestone.description && (
                              <p className="text-sm text-muted-foreground">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {milestone.currency}
                              {milestone.amount.toLocaleString()}
                            </p>
                            <Badge
                              variant={
                                milestone.status === "approved"
                                  ? "default"
                                  : milestone.status === "submitted"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {milestone.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
