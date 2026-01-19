import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getTestingFeatureById, getTestChecklistsByFeature } from "@/lib/api/admin"
import { ChecklistsAdmin } from "@/components/admin/checklists-list"
import { Button } from "@/components/ui/button"

interface Props {
  params: Promise<{ featureId: string }>
}

export default async function AdminChecklistsPage({ params }: Props) {
  const { featureId } = await params
  const feature = await getTestingFeatureById(featureId)

  if (!feature) {
    notFound()
  }

  const checklists = await getTestChecklistsByFeature(featureId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/features">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Test Cases: {feature.name}</h1>
          <p className="text-muted-foreground">
            Manage test checklists for this feature
          </p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-muted-foreground">Version:</span>{" "}
            <code className="bg-muted px-2 py-0.5 rounded">{feature.version}</code>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>{" "}
            <span className="capitalize">{feature.status}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Demo:</span>{" "}
            <code className="bg-muted px-2 py-0.5 rounded">{feature.demo_component || "generic"}</code>
          </div>
          <div>
            <span className="text-muted-foreground">Total Tests:</span>{" "}
            <span className="font-medium">{checklists.length}</span>
          </div>
        </div>
      </div>

      <ChecklistsAdmin featureId={featureId} initialData={checklists} />
    </div>
  )
}
