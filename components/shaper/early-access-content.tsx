"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  Calendar,
  Users,
  Star,
  Rocket,
  Palette,
  Brain,
  Globe,
  Shield,
  type LucideIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type {
  ShaperExperimentalFeature,
  ShaperUpcomingRelease,
  ShaperProfile,
  ShaperFeatureStatus,
} from "@/lib/types"
import { featureStatusConfig } from "@/lib/data/shaper-data"

interface EarlyAccessContentProps {
  userId: string
  experimentalFeatures: ShaperExperimentalFeature[]
  upcomingReleases: ShaperUpcomingRelease[]
  shaperProfile: ShaperProfile | null
  featureToggles: Record<string, boolean>
}

// Icon mapping for experimental features
const iconMap: Record<string, LucideIcon> = {
  Brain,
  Zap,
  Palette,
  Globe,
  Users,
  Shield,
  Sparkles,
}

// Status icon mapping
const statusIconMap: Record<ShaperFeatureStatus, LucideIcon> = {
  available: Unlock,
  coming_soon: Calendar,
  locked: Lock,
}

export function EarlyAccessContent({
  userId,
  experimentalFeatures,
  upcomingReleases,
  shaperProfile,
  featureToggles: initialToggles,
}: EarlyAccessContentProps) {
  const [featureToggles, setFeatureToggles] = useState(initialToggles)

  const handleToggle = async (featureId: string, enabled: boolean) => {
    const supabase = createClient()

    // Optimistic update
    setFeatureToggles((prev) => ({ ...prev, [featureId]: enabled }))

    const { error } = await supabase.from("shaper_user_feature_toggles").upsert(
      {
        user_id: userId,
        feature_id: featureId,
        is_enabled: enabled,
        enabled_at: enabled ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,feature_id" }
    )

    if (error) {
      // Revert on error
      setFeatureToggles((prev) => ({ ...prev, [featureId]: !enabled }))
      console.error("Error toggling feature:", error)
    }
  }

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
            <Sparkles className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Early Access</h1>
          </div>
          <p className="text-muted-foreground">
            Experience experimental features before everyone else
          </p>
        </div>

        {/* Shaper Badge */}
        <Card className="mb-8 border-accent/30 bg-gradient-to-r from-accent/10 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-accent/20 p-3">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Shaper Status: Active</h3>
                <p className="text-sm text-muted-foreground">
                  You have early access to all experimental features. Thank you for being a Shaper!
                </p>
              </div>
              {shaperProfile && (
                <Badge className="ml-auto bg-accent text-accent-foreground">
                  <Sparkles className="mr-1 h-3 w-3" />
                  {shaperProfile.badge_level.charAt(0).toUpperCase() +
                    shaperProfile.badge_level.slice(1)}{" "}
                  Shaper
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experimental Features */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Experimental features</h2>
          {experimentalFeatures.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No experimental features available at the moment.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {experimentalFeatures.map((feature) => {
                const statusConfig = featureStatusConfig[feature.status]
                const StatusIcon = statusIconMap[feature.status]
                const FeatureIcon = iconMap[feature.icon_name] || Sparkles
                const isAvailable = feature.status === "available"
                const isEnabled = featureToggles[feature.id] || false

                return (
                  <Card key={feature.id} className={!isAvailable ? "opacity-70" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-accent/10 p-2">
                            <FeatureIcon className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{feature.name}</CardTitle>
                            <CardDescription className="text-xs">
                              Release: {feature.release_date || "TBD"}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={`${statusConfig.color} text-white`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>

                      <div className="flex items-center justify-between">
                        {isAvailable ? (
                          <>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{feature.access_count} users</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`feature-${feature.id}`}
                                checked={isEnabled}
                                onCheckedChange={(checked) => handleToggle(feature.id, checked)}
                              />
                              <Label htmlFor={`feature-${feature.id}`} className="text-sm">
                                {isEnabled ? "Enabled" : "Disabled"}
                              </Label>
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">
                            {feature.status === "coming_soon"
                              ? "Coming soon for Shapers"
                              : "Not yet available for early access"}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming Releases */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-accent" />
            Development roadmap
          </h2>
          <Card>
            <CardContent className="pt-6">
              {upcomingReleases.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No upcoming releases announced yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {upcomingReleases.map((release, index) => (
                    <div key={release.version} className="relative pl-6">
                      {index < upcomingReleases.length - 1 && (
                        <div className="absolute left-[9px] top-6 h-full w-0.5 bg-border" />
                      )}
                      <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-[10px] font-bold text-accent-foreground">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{release.version}</h4>
                          <Badge variant="outline" className="text-xs">
                            {release.release_date}
                          </Badge>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {release.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <Sparkles className="h-3 w-3 text-accent" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feedback CTA */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Have feedback on features?</h3>
                <p className="text-sm text-muted-foreground">
                  Your feedback helps us improve features before official release.
                </p>
              </div>
              <Button asChild>
                <Link href="/shaper/feedback">Send Feedback</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
