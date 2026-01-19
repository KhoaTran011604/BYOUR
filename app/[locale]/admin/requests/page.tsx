import { getAllShaperProfiles } from "@/lib/api/admin"
import { ShaperRequestsList } from "@/components/admin/shaper-requests-list"

export default async function AdminRequestsPage() {
  const shaperProfiles = await getAllShaperProfiles()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shaper Requests</h1>
        <p className="text-muted-foreground">
          Manage shaper program applications
        </p>
      </div>
      <ShaperRequestsList initialData={shaperProfiles} />
    </div>
  )
}
