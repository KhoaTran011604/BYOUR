"use client"

import { useState, useEffect, use } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Link } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/client"
import { ProjectChat } from "@/components/boss/project-chat"
import { WorkTracker } from "@/components/boss/work-tracker"
import { PaymentCard } from "@/components/boss/payment-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, FileCheck, DollarSign, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BossProject, ProjectMessage, BossPayment } from "@/lib/types"

interface Milestone {
  id: string
  title: string
  description?: string
  is_completed: boolean
  completed_at?: string
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: projectId } = use(params)
  const router = useRouter()
  const t = useTranslations("boss")
  const tCommon = useTranslations("common")
  const [project, setProject] = useState<BossProject | null>(null)
  const [messages, setMessages] = useState<ProjectMessage[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [payment, setPayment] = useState<BossPayment | null>(null)
  const [currentUser, setCurrentUser] = useState<{
    id: string
    name: string
    avatar?: string
  } | null>(null)
  const [clientInfo, setClientInfo] = useState<{
    name: string
    avatar?: string
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

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profile) {
      setCurrentUser({
        id: user.id,
        name: profile.full_name || "You",
        avatar: profile.avatar_url || undefined,
      })
    }

    // Get project
    const { data: projectData } = await supabase
      .from("boss_projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (!projectData) {
      router.push("/boss/projects")
      return
    }

    setProject(projectData)

    // Get messages (mock data for now)
    setMessages([
      {
        id: "1",
        project_id: projectId,
        sender_id: "client-1",
        sender_name: "Client",
        sender_avatar: null,
        message: "Hi! Looking forward to working with you on this project.",
        attachments: [],
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        project_id: projectId,
        sender_id: user.id,
        sender_name: profile?.full_name || "You",
        sender_avatar: profile?.avatar_url || null,
        message:
          "Thank you! I've reviewed the requirements and will start working on it right away.",
        attachments: [],
        created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
    ])

    // Get milestones (mock data for now)
    setMilestones([
      {
        id: "m1",
        title: "Initial setup and planning",
        description: "Set up project structure and define scope",
        is_completed: true,
        completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "m2",
        title: "Development phase",
        description: "Implement core features",
        is_completed: false,
      },
      {
        id: "m3",
        title: "Testing and review",
        is_completed: false,
      },
    ])

    // Set client info (mock)
    setClientInfo({
      name: "Client Name",
      avatar: undefined,
    })

    // Get payment if completed
    if (projectData.status === "completed") {
      // Mock payment data
      setPayment({
        id: "p1",
        project_id: projectId,
        boss_id: projectData.boss_id,
        amount: projectData.budget || 0,
        currency: projectData.currency || "€",
        status: "completed",
        payment_method: "Bank Transfer",
        transaction_id: "TXN123456",
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
    }

    setIsLoading(false)
  }

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    if (!currentUser || !project) return

    // In production, this would send to the database
    const newMessage: ProjectMessage = {
      id: `msg-${Date.now()}`,
      project_id: project.id,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_avatar: currentUser.avatar || null,
      message,
      attachments: [],
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
  }

  const handleAddMilestone = async (title: string, description?: string) => {
    const newMilestone: Milestone = {
      id: `m-${Date.now()}`,
      title,
      description,
      is_completed: false,
    }
    setMilestones((prev) => [...prev, newMilestone])
  }

  const handleToggleMilestone = async (milestoneId: string, completed: boolean) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              is_completed: completed,
              completed_at: completed ? new Date().toISOString() : undefined,
            }
          : m
      )
    )
  }

  const handleDeleteMilestone = async (milestoneId: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== milestoneId))
  }

  const handleSubmitForReview = async () => {
    if (!project) return

    const supabase = createClient()
    await supabase
      .from("boss_projects")
      .update({ status: "review" })
      .eq("id", project.id)

    setProject({ ...project, status: "review" })
  }

  const handleMarkComplete = async () => {
    if (!project) return

    const supabase = createClient()
    await supabase
      .from("boss_projects")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", project.id)

    setProject({
      ...project,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-accent" />
      </div>
    )
  }

  if (!project || !currentUser) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/boss/projects">
          <ArrowLeft className="h-4 w-4" />
          {t("projects.backToProjects")}
        </Link>
      </Button>

      {/* Tabs */}
      <Tabs defaultValue="chat">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            {t("tabs.chat")}
          </TabsTrigger>
          <TabsTrigger value="work" className="gap-2">
            <FileCheck className="h-4 w-4" />
            {t("tabs.work")}
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <DollarSign className="h-4 w-4" />
            {t("tabs.payment")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <ProjectChat
            project={project}
            messages={messages}
            currentUserId={currentUser.id}
            currentUserName={currentUser.name}
            currentUserAvatar={currentUser.avatar}
            clientName={clientInfo?.name || tCommon("client")}
            clientAvatar={clientInfo?.avatar}
            onSendMessage={handleSendMessage}
          />
        </TabsContent>

        <TabsContent value="work" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <WorkTracker
              project={project}
              milestones={milestones}
              onAddMilestone={handleAddMilestone}
              onToggleMilestone={handleToggleMilestone}
              onDeleteMilestone={handleDeleteMilestone}
              onSubmitForReview={handleSubmitForReview}
              onMarkComplete={handleMarkComplete}
            />
            <div className="space-y-6">
              {/* Project Info Card */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 font-semibold">{t("projects.projectDetails")}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{tCommon("project")}</span>
                    <span className="font-medium">{project.title}</span>
                  </div>
                  {project.budget && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{tCommon("budget")}</span>
                      <span className="font-medium">
                        {project.currency}
                        {project.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {project.deadline && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{tCommon("deadline")}</span>
                      <span className="font-medium">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {project.started_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t("projects.started")}</span>
                      <span className="font-medium">
                        {new Date(project.started_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <div className="mx-auto max-w-md">
            <PaymentCard project={project} payment={payment} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
