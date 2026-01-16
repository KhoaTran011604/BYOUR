"use client"

import { useState } from "react"
import {
  Search,
  Star,
  Briefcase,
  ExternalLink,
  Send,
  CheckCircle2,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BossSuggestionsProps {
  bosses: any[]
  projectSkills: string[]
  onInvite: (bossId: string) => void
  invitedBossIds: string[]
}

export function BossSuggestions({
  bosses,
  projectSkills,
  onInvite,
  invitedBossIds,
}: BossSuggestionsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("match")

  const filteredBosses = bosses.filter((boss) => {
    const name = boss.profiles?.full_name || boss.company_name || ""
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Calculate match score based on skills
  const bossesWithScore = filteredBosses.map((boss) => {
    const bossSkills = boss.skills || []
    const matchingSkills = projectSkills.filter((skill) =>
      bossSkills.some(
        (bs: string) => bs.toLowerCase() === skill.toLowerCase()
      )
    )
    const matchScore = projectSkills.length > 0
      ? Math.round((matchingSkills.length / projectSkills.length) * 100)
      : 0
    return { ...boss, matchScore, matchingSkills }
  })

  // Sort bosses
  const sortedBosses = [...bossesWithScore].sort((a, b) => {
    switch (sortBy) {
      case "match":
        return b.matchScore - a.matchScore
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "rate_low":
        return (a.hourly_rate || 0) - (b.hourly_rate || 0)
      case "rate_high":
        return (b.hourly_rate || 0) - (a.hourly_rate || 0)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search professionals..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best Match</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="rate_low">Rate: Low to High</SelectItem>
            <SelectItem value="rate_high">Rate: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Boss List */}
      {sortedBosses.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No professionals found matching your criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedBosses.map((boss) => {
            const isInvited = invitedBossIds.includes(boss.user_id)
            const profile = boss.profiles || {}

            return (
              <Card key={boss.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-lg">
                        {(profile.full_name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">
                            {profile.full_name || "Unknown"}
                          </h3>
                          {boss.company_name && (
                            <p className="text-sm text-muted-foreground">
                              {boss.company_name}
                            </p>
                          )}
                        </div>

                        {boss.matchScore > 0 && (
                          <Badge
                            variant={
                              boss.matchScore >= 70
                                ? "default"
                                : boss.matchScore >= 40
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {boss.matchScore}% match
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                        {boss.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{boss.rating}</span>
                            <span className="text-muted-foreground">
                              ({boss.reviews_count} reviews)
                            </span>
                          </div>
                        )}
                        {boss.hourly_rate && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span>€{boss.hourly_rate}/hr</span>
                          </div>
                        )}
                        {boss.projects_completed > 0 && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            <span>{boss.projects_completed} projects</span>
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {boss.skills && boss.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {boss.skills.slice(0, 6).map((skill: string) => {
                            const isMatching = boss.matchingSkills?.includes(skill)
                            return (
                              <Badge
                                key={skill}
                                variant={isMatching ? "default" : "outline"}
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            )
                          })}
                          {boss.skills.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{boss.skills.length - 6}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        {profile.handle && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={`/${profile.handle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Profile
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => onInvite(boss.user_id)}
                          disabled={isInvited}
                        >
                          {isInvited ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Invited
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Invite
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
