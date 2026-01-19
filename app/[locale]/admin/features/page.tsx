import { getAllTestingFeatures } from "@/lib/api/admin"
import { FeaturesListAdmin } from "@/components/admin/features-list"

export default async function AdminFeaturesPage() {
  const features = await getAllTestingFeatures()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Testing Features</h1>
        <p className="text-muted-foreground">
          Manage shaper testing features and configure demo components
        </p>
      </div>
      <FeaturesListAdmin initialData={features} />
    </div>
  )
}
