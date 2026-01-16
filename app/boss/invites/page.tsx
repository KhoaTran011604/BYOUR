"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { InvitesList } from "@/components/boss/invites-list"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { BossInvite } from "@/lib/types"

export default function InvitesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [invites, setInvites] = useState<BossInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInvites()
  }, [])

  const loadInvites = async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    // Get boss profile
    const { data: bossProfile } = await supabase
      .from("boss_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!bossProfile) {
      router.push("/boss")
      return
    }

    // Get invites
    const { data } = await supabase
      .from("boss_invites")
      .select("*")
      .eq("boss_id", bossProfile.id)
      .order("created_at", { ascending: false })

    setInvites(data || [])
    setIsLoading(false)
  }

  const handleAccept = async (inviteId: string) => {
    const supabase = createClient()

    // Update invite status
    const { error: inviteError } = await supabase
      .from("boss_invites")
      .update({ status: "accepted" })
      .eq("id", inviteId)

    if (inviteError) {
      toast({
        title: "Error",
        description: "Failed to accept invite. Please try again.",
        variant: "destructive",
      })
      return
    }

    // Get invite details to create project
    const invite = invites.find((i) => i.id === inviteId)
    if (!invite) return

    // Create project
    const { data: project, error: projectError } = await supabase
      .from("boss_projects")
      .insert({
        boss_id: invite.boss_id,
        client_id: invite.client_id,
        invite_id: invite.id,
        title: invite.project_title,
        description: invite.project_description,
        status: "in_progress",
        budget: invite.budget_max || invite.budget_min,
        currency: invite.currency,
        deadline: invite.deadline,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (projectError) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invite Accepted",
      description: "Project created successfully!",
    })

    // Refresh invites
    await loadInvites()

    // Navigate to project
    if (project) {
      router.push(`/boss/projects/${project.id}`)
    }
  }

  const handleDecline = async (inviteId: string) => {
    const supabase = createClient()

    const { error } = await supabase
      .from("boss_invites")
      .update({ status: "declined" })
      .eq("id", inviteId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to decline invite. Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invite Declined",
      description: "The invite has been declined.",
    })

    // Refresh invites
    await loadInvites()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-accent" />
      </div>
    )
  }

  return (
    <InvitesList
      invites={invites}
      onAccept={handleAccept}
      onDecline={handleDecline}
    />
  )
}
