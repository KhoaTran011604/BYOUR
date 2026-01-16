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

    // Check if user has boss profile
    const { data: bossProfile } = await supabase
      .from("boss_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!bossProfile) {
      router.push("/boss")
      return
    }

    // Get invites from hq_invites with joined project and business profile data
    // Note: hq_invites.boss_id references profiles(id) which is user_id
    const { data, error } = await supabase
      .from("hq_invites")
      .select(`
        id,
        hq_id,
        project_id,
        boss_id,
        message,
        proposed_budget,
        proposed_deadline,
        status,
        created_at,
        updated_at,
        hq_projects (
          title,
          description,
          budget_min,
          budget_max,
          currency,
          deadline
        ),
        hq_profiles (
          company_name,
          hq_business_profiles (
            display_name,
            logo_url
          )
        )
      `)
      .eq("boss_id", user.id)
      .order("created_at", { ascending: false })

    // Transform data to BossInvite format
    const transformedInvites: BossInvite[] = (data || []).map((invite: any) => ({
      id: invite.id,
      boss_id: invite.boss_id,
      hq_id: invite.hq_id,
      hq_project_id: invite.project_id,
      client_name: invite.hq_profiles?.hq_business_profiles?.display_name
        || invite.hq_profiles?.company_name
        || "Unknown Company",
      client_avatar: invite.hq_profiles?.hq_business_profiles?.logo_url || null,
      project_title: invite.hq_projects?.title || "Untitled Project",
      project_description: invite.hq_projects?.description || null,
      budget_min: invite.hq_projects?.budget_min || null,
      budget_max: invite.hq_projects?.budget_max || null,
      currency: invite.hq_projects?.currency || "EUR",
      deadline: invite.hq_projects?.deadline || null,
      message: invite.message,
      proposed_budget: invite.proposed_budget,
      proposed_deadline: invite.proposed_deadline,
      status: invite.status,
      created_at: invite.created_at,
      updated_at: invite.updated_at,
    }))

    setInvites(transformedInvites)
    setIsLoading(false)
  }

  const handleAccept = async (inviteId: string) => {
    const supabase = createClient()

    // Get invite details for navigation
    const invite = invites.find((i) => i.id === inviteId)
    if (!invite) return

    // Call the accept_hq_invite function (handles everything server-side)
    const { data, error } = await supabase.rpc("accept_hq_invite", {
      invite_uuid: inviteId,
    })

    console.log("🚀 accept_hq_invite result:", data, error)

    if (error || !data?.success) {
      toast({
        title: "Error",
        description: data?.error || "Failed to accept invite. Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invite Accepted",
      description: "You have been assigned to this project!",
    })

    // Refresh invites
    await loadInvites()

    // Navigate to HQ project view for boss
    router.push(`/boss/hq-projects/${data.project_id}`)
  }

  const handleDecline = async (inviteId: string) => {
    const supabase = createClient()

    // Call the decline_hq_invite function
    const { data, error } = await supabase.rpc("decline_hq_invite", {
      invite_uuid: inviteId,
    })

    console.log("🚀 decline_hq_invite result:", data, error)

    if (error || !data?.success) {
      toast({
        title: "Error",
        description: data?.error || "Failed to decline invite. Please try again.",
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
