import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import {
  Briefcase,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
} from "lucide-react"
import { Input } from "@/components/ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statusConfig = {
  invited: { label: "Invited", variant: "outline" as const },
  in_progress: { label: "In Progress", variant: "default" as const },
  review: { label: "In Review", variant: "secondary" as const },
  completed: { label: "Completed", variant: "default" as const },
  cancelled: { label: "Cancelled", variant: "destructive" as const },
}

export default async function ProjectsPage() {
  const supabase = await createClient()

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your active and past projects</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
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
            const status = statusConfig[project.status as keyof typeof statusConfig]
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
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">
                        {project.currency}
                        {project.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {project.deadline && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Deadline</span>
                      <span className="font-medium">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/boss/projects/${project.id}`}>
                      View Project
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
            <h3 className="mb-2 font-medium">No projects yet</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Accept an invite to start your first project
            </p>
            <Button asChild>
              <Link href="/boss/invites">
                View Invites
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
