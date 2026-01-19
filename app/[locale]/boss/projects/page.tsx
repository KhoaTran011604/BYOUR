import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  Briefcase,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProjectsPage() {
  const supabase = await createClient()
  const t = await getTranslations("boss.projects")
  const tCommon = await getTranslations("common")

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get boss profile
  const { data: bossProfile } = await supabase
    .from("boss_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!bossProfile || bossProfile.verification_status !== "verified") {
    redirect("/boss")
  }

  // Get projects
  const { data: projects } = await supabase
    .from("boss_projects")
    .select("*")
    .eq("boss_id", bossProfile.id)
    .order("created_at", { ascending: false })

  const activeProjects =
    projects?.filter(
      (p) => p.status === "in_progress" || p.status === "review"
    ) || []
  const completedProjects =
    projects?.filter((p) => p.status === "completed") || []

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "invited":
        return { label: t("invited"), variant: "outline" as const }
      case "in_progress":
        return { label: t("inProgress"), variant: "default" as const }
      case "review":
        return { label: t("inReview"), variant: "secondary" as const }
      case "completed":
        return { label: t("completed"), variant: "default" as const }
      case "cancelled":
        return { label: t("cancelled"), variant: "destructive" as const }
      default:
        return { label: status, variant: "outline" as const }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/boss/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("activeProjects")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("completed")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("totalProjects")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      {projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const status = getStatusConfig(project.status)
            return (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  {project.description && (
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.budget && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{tCommon("budget")}</span>
                      <span className="font-medium">
                        {project.currency}
                        {project.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {project.deadline && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{tCommon("deadline")}</span>
                      <span className="font-medium">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/boss/projects/${project.id}`}>
                      {t("viewProject")}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-medium">{t("noProjects")}</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              {t("acceptInvite")}
            </p>
            <Button asChild>
              <Link href="/boss/invites">
                {t("viewInvites")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
