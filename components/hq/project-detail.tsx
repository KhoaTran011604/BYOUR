"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Tag,
  Sparkles,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BossSuggestions } from "./boss-suggestions"
import { InvitesList } from "./invites-list"
import { InviteDialog } from "./invite-dialog"
import { ProjectGroupChat } from "@/components/shared/project-group-chat"
import { createClient } from "@/lib/supabase/client"
import type { HQProject, HQInvite, HQProjectStatus } from "@/lib/types"

interface ProjectDetailProps {
  project: HQProject
  invites: HQInvite[]
  suggestedBosses: any[]
  hqId: string
  currentUserId: string
  currentUserName: string
  currentUserAvatar: string | null
}

const statusConfig: Record<HQProjectStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: "Draft", color: "text-gray-600", bgColor: "bg-gray-500" },
  open: { label: "Open", color: "text-blue-600", bgColor: "bg-blue-500" },
  in_progress: { label: "In Progress", color: "text-yellow-600", bgColor: "bg-yellow-500" },
  review: { label: "In Review", color: "text-purple-600", bgColor: "bg-purple-500" },
  completed: { label: "Completed", color: "text-green-600", bgColor: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "text-red-600", bgColor: "bg-red-500" },
}

const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
}

export function ProjectDetail({
  project,
  invites,
  suggestedBosses,
  hqId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}: ProjectDetailProps) {
  const router = useRouter()
  const [selectedBossId, setSelectedBossId] = useState<string | null>(null)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)

  const status = statusConfig[project.status]
  const symbol = currencySymbols[project.currency] || project.currency

  // Load chat when project is in_progress
  useEffect(() => {
    if (project.status === "in_progress") {
      loadChatId()
    }
  }, [project.status])

  const loadChatId = async () => {
    const supabase = createClient()

    const { data: chatData } = await supabase
      .from("hq_project_chats")
      .select("id")
      .eq("project_id", project.id)
      .single()

    if (chatData) {
      setChatId(chatData.id)
    }
  }

  const pendingInvites = invites.filter((i) => i.status === "pending")
  const acceptedInvites = invites.filter((i) => i.status === "accepted")

  const handleInviteBoss = (bossId: string) => {
    setSelectedBossId(bossId)
    setShowInviteDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.title}</h1>
              <Badge
                variant="secondary"
                className={`${status.bgColor} text-white`}
              >
                {status.label}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground" suppressHydrationWarning>
              Created {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Cancel Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-wrap">{project.description}</p>

              {project.requirements && (
                <>
                  <Separator />
                  <div>
                    <h4 className="mb-2 font-medium">Requirements</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {project.requirements}
                    </p>
                  </div>
                </>
              )}

              {project.deliverables && project.deliverables.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 font-medium">
                      <Package className="h-4 w-4" />
                      Deliverables
                    </h4>
                    <ul className="space-y-1">
                      {project.deliverables.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs for Bosses & Invites */}
          <Tabs defaultValue="suggestions">
            <TabsList className="w-full">
              <TabsTrigger value="suggestions" className="flex-1">
                <Users className="mr-2 h-4 w-4" />
                Find Bosses
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Invites ({invites.length})
              </TabsTrigger>
              {project.status === "in_progress" && (
                <TabsTrigger value="chat" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="suggestions" className="mt-4">
              <BossSuggestions
                bosses={suggestedBosses}
                projectSkills={project.skills_required}
                onInvite={handleInviteBoss}
                invitedBossIds={invites.map((i) => i.boss_id)}
              />
            </TabsContent>

            <TabsContent value="invites" className="mt-4">
              <InvitesList
                invites={invites}
                projectId={project.id}
                hqId={hqId}
              />
            </TabsContent>

            {project.status === "in_progress" && (
              <TabsContent value="chat" className="mt-4">
                <ProjectGroupChat
                  projectId={project.id}
                  chatId={chatId}
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                  currentUserAvatar={currentUserAvatar}
                  userRole="hq"
                />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Budget
                </div>
                <span className="font-medium">
                  {symbol}
                  {project.budget_min.toLocaleString()} - {symbol}
                  {project.budget_max.toLocaleString()}
                </span>
              </div>

              {project.deadline && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Deadline
                  </div>
                  <span className="font-medium" suppressHydrationWarning>
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}

              {project.timeline_start && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Start Date
                  </div>
                  <span className="font-medium" suppressHydrationWarning>
                    {new Date(project.timeline_start).toLocaleDateString()}
                  </span>
                </div>
              )}

              {project.timeline_end && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    End Date
                  </div>
                  <span className="font-medium" suppressHydrationWarning>
                    {new Date(project.timeline_end).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4" />
                Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.skills_required.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invite Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Invite Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Pending Invites
                </span>
                <Badge variant="secondary">{pendingInvites.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Accepted</span>
                <Badge variant="secondary" className="bg-green-500 text-white">
                  {acceptedInvites.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Dialog */}
      <InviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        projectId={project.id}
        hqId={hqId}
        bossId={selectedBossId}
        projectBudget={{
          min: project.budget_min,
          max: project.budget_max,
          currency: project.currency,
        }}
        projectDeadline={project.deadline}
      />
    </div>
  )
}
