"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Star,
  Briefcase,
  ExternalLink,
  Send,
  Filter,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import type { HQProject } from "@/lib/types"

interface BrowseBossesProps {
  bosses: any[]
  projects: Pick<HQProject, "id" | "title" | "status" | "skills_required">[]
  hqId: string
}

export function BrowseBosses({ bosses, projects, hqId }: BrowseBossesProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [selectedBoss, setSelectedBoss] = useState<any>(null)
  const [selectedProject, setSelectedProject] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")
  const [isInviting, setIsInviting] = useState(false)

  // Get unique skills from all bosses for filter dropdown
  const allSkills = Array.from(
    new Set(bosses.flatMap((boss) => boss.skills || []))
  ).sort()

  // Filter bosses
  const filteredBosses = bosses.filter((boss) => {
    const name = boss.profiles?.full_name || boss.company_name || ""
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (boss.bio || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSkill =
      skillFilter === "all" ||
      (boss.skills || []).some(
        (s: string) => s.toLowerCase() === skillFilter.toLowerCase()
      )
    return matchesSearch && matchesSkill
  })

  // Sort bosses
  const sortedBosses = [...filteredBosses].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "projects":
        return (b.projects_completed || 0) - (a.projects_completed || 0)
      case "rate_low":
        return (a.hourly_rate || 0) - (b.hourly_rate || 0)
      case "rate_high":
        return (b.hourly_rate || 0) - (a.hourly_rate || 0)
      default:
        return 0
    }
  })

  const handleInvite = async () => {
    if (!selectedBoss || !selectedProject) return

    setIsInviting(true)

    try {
      const supabase = createClient()

      await supabase.from("hq_invites").insert({
        hq_id: hqId,
        project_id: selectedProject,
        boss_id: selectedBoss.user_id,
        message: inviteMessage.trim() || null,
        status: "pending",
      })

      // Reset and close
      setSelectedBoss(null)
      setSelectedProject("")
      setInviteMessage("")
      router.refresh()
    } catch (err) {
      console.error("Invite error:", err)
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Browse Professionals</h1>
        <p className="text-muted-foreground">
          Find talented professionals for your projects
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or keywords..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={skillFilter} onValueChange={setSkillFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            {allSkills.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="projects">Most Projects</SelectItem>
            <SelectItem value="rate_low">Rate: Low to High</SelectItem>
            <SelectItem value="rate_high">Rate: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {sortedBosses.length} professionals
      </p>

      {/* Boss Grid */}
      {sortedBosses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              No professionals found matching your criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedBosses.map((boss) => {
            const profile = boss.profiles || {}

            return (
              <Card key={boss.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback>
                        {(profile.full_name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="line-clamp-1 text-base">
                        {profile.full_name || "Unknown"}
                      </CardTitle>
                      {boss.company_name && (
                        <CardDescription className="line-clamp-1">
                          {boss.company_name}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {boss.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{boss.rating}</span>
                      </div>
                    )}
                    {boss.hourly_rate && (
                      <span className="text-muted-foreground">
                        €{boss.hourly_rate}/hr
                      </span>
                    )}
                    {boss.projects_completed > 0 && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>{boss.projects_completed}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {boss.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {boss.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {boss.skills && boss.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {boss.skills.slice(0, 4).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {boss.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{boss.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>

                {/* Actions */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    {profile.handle && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a
                          href={`/b/${profile.handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Profile
                        </a>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedBoss(boss)}
                      disabled={projects.length === 0}
                    >
                      <Send className="h-4 w-4" />
                      Invite
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Invite Dialog */}
      <Dialog
        open={!!selectedBoss}
        onOpenChange={(open) => !open && setSelectedBoss(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to Project</DialogTitle>
            <DialogDescription>
              Send an invite to {selectedBoss?.profiles?.full_name || "this professional"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.length === 0 ? (
                    <SelectItem value="" disabled>
                      No open projects
                    </SelectItem>
                  ) : (
                    projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message (Optional)</Label>
              <Textarea
                placeholder="Add a personal message..."
                rows={3}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBoss(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!selectedProject || isInviting}
            >
              {isInviting ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
