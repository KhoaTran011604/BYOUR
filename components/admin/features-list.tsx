"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import Link from "next/link"
import {
  FlaskConical,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  EyeOff,
  Bug,
  Users,
  ClipboardList,
} from "lucide-react"
import type { ShaperTestingFeature, ShaperTestingStatus } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface FeaturesListAdminProps {
  initialData: ShaperTestingFeature[]
}

const statusConfig: Record<
  ShaperTestingStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  alpha: { label: "Alpha", variant: "destructive" },
  beta: { label: "Beta", variant: "secondary" },
  testing: { label: "Testing", variant: "default" },
  ready: { label: "Ready", variant: "outline" },
}

type FeatureFormData = {
  name: string
  description: string
  version: string
  status: ShaperTestingStatus
  due_date: string
  test_url: string
  docs_url: string
  demo_component: string
  demo_instructions: string
}

const defaultFormData: FeatureFormData = {
  name: "",
  description: "",
  version: "",
  status: "alpha",
  due_date: "",
  test_url: "",
  docs_url: "",
  demo_component: "generic",
  demo_instructions: "",
}

export function FeaturesListAdmin({ initialData }: FeaturesListAdminProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<ShaperTestingFeature | null>(null)
  const [formData, setFormData] = useState<FeatureFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = () => {
    setFormData(defaultFormData)
    setIsCreateOpen(true)
  }

  const handleEdit = (feature: ShaperTestingFeature) => {
    setSelectedFeature(feature)
    setFormData({
      name: feature.name,
      description: feature.description,
      version: feature.version,
      status: feature.status,
      due_date: feature.due_date || "",
      test_url: feature.test_url || "",
      docs_url: feature.docs_url || "",
      demo_component: feature.demo_component || "generic",
      demo_instructions: feature.demo_instructions || "",
    })
    setIsEditOpen(true)
  }

  const handleDeleteClick = (feature: ShaperTestingFeature) => {
    setSelectedFeature(feature)
    setIsDeleteOpen(true)
  }

  const handleToggleActive = async (feature: ShaperTestingFeature) => {
    try {
      const response = await fetch("/api/admin/features/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: feature.id }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.isActive ? "Feature activated" : "Feature deactivated")
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error(result.error || "Failed to toggle feature")
      }
    } catch {
      toast.error("Failed to toggle feature")
    }
  }

  const submitCreate = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Feature created successfully")
        setIsCreateOpen(false)
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error(result.error || "Failed to create feature")
      }
    } catch {
      toast.error("Failed to create feature")
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitEdit = async () => {
    if (!selectedFeature) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedFeature.id, ...formData }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Feature updated successfully")
        setIsEditOpen(false)
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error(result.error || "Failed to update feature")
      }
    } catch {
      toast.error("Failed to update feature")
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitDelete = async () => {
    if (!selectedFeature) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/features", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedFeature.id }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Feature deleted successfully")
        setIsDeleteOpen(false)
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error(result.error || "Failed to delete feature")
      }
    } catch {
      toast.error("Failed to delete feature")
    } finally {
      setIsSubmitting(false)
    }
  }

  const featureFormContent = (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="grid gap-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Feature name"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Feature description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="version">Version *</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
            placeholder="v1.0.0-beta"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, status: value as ShaperTestingStatus }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alpha">Alpha</SelectItem>
              <SelectItem value="beta">Beta</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="demo_component">Demo Component Key</Label>
          <Input
            id="demo_component"
            value={formData.demo_component}
            onChange={(e) => setFormData((prev) => ({ ...prev, demo_component: e.target.value }))}
            placeholder="hq-rating, boss-skills-tags, ..."
          />
          <p className="text-xs text-muted-foreground">
            Key để dev code component demo (vd: hq-rating, boss-skills-tags)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="test_url">Test URL</Label>
          <Input
            id="test_url"
            value={formData.test_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, test_url: e.target.value }))}
            placeholder="/builder/test-feature"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="docs_url">Docs URL</Label>
          <Input
            id="docs_url"
            value={formData.docs_url}
            onChange={(e) => setFormData((prev) => ({ ...prev, docs_url: e.target.value }))}
            placeholder="/docs/features/..."
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="demo_instructions">Demo Instructions</Label>
        <Textarea
          id="demo_instructions"
          value={formData.demo_instructions}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, demo_instructions: e.target.value }))
          }
          placeholder="Instructions for testers..."
          rows={4}
        />
      </div>
    </div>
  )

  if (initialData.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No testing features found</p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Feature
          </Button>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Testing Feature</DialogTitle>
              <DialogDescription>
                Add a new feature for shapers to test
              </DialogDescription>
            </DialogHeader>
            {featureFormContent}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitCreate} disabled={isSubmitting || !formData.name}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Feature
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((feature) => {
              const status = statusConfig[feature.status]

              return (
                <TableRow key={feature.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {feature.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {feature.version}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {feature.demo_component || "generic"}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {feature.testers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bug className="h-3 w-3" />
                        {feature.bugs_count}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {feature.due_date
                      ? format(new Date(feature.due_date), "MMM d, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isPending}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/features/${feature.id}/checklists`}>
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Test Cases
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(feature)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(feature)}>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(feature)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Testing Feature</DialogTitle>
            <DialogDescription>
              Add a new feature for shapers to test
            </DialogDescription>
          </DialogHeader>
          {featureFormContent}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitCreate} disabled={isSubmitting || !formData.name}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Testing Feature</DialogTitle>
            <DialogDescription>
              Update feature details and configuration
            </DialogDescription>
          </DialogHeader>
          {featureFormContent}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEdit} disabled={isSubmitting || !formData.name}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feature?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedFeature?.name}" and all associated test
              data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={submitDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
