"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ClipboardList,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  AlertTriangle,
  X,
} from "lucide-react"
import type { ShaperTestChecklist } from "@/lib/types"
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
import { Switch } from "@/components/ui/switch"
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

interface ChecklistsAdminProps {
  featureId: string
  initialData: ShaperTestChecklist[]
}

type ChecklistFormData = {
  title: string
  description: string
  test_steps: string[]
  expected_result: string
  order_index: number
  is_critical: boolean
}

const defaultFormData: ChecklistFormData = {
  title: "",
  description: "",
  test_steps: [""],
  expected_result: "",
  order_index: 0,
  is_critical: false,
}

export function ChecklistsAdmin({ featureId, initialData }: ChecklistsAdminProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedChecklist, setSelectedChecklist] = useState<ShaperTestChecklist | null>(null)
  const [formData, setFormData] = useState<ChecklistFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = () => {
    setFormData({
      ...defaultFormData,
      order_index: initialData.length + 1,
    })
    setIsCreateOpen(true)
  }

  const handleEdit = (checklist: ShaperTestChecklist) => {
    setSelectedChecklist(checklist)
    setFormData({
      title: checklist.title,
      description: checklist.description || "",
      test_steps: checklist.test_steps.length > 0 ? checklist.test_steps : [""],
      expected_result: checklist.expected_result,
      order_index: checklist.order_index,
      is_critical: checklist.is_critical,
    })
    setIsEditOpen(true)
  }

  const handleDeleteClick = (checklist: ShaperTestChecklist) => {
    setSelectedChecklist(checklist)
    setIsDeleteOpen(true)
  }

  const addTestStep = () => {
    setFormData((prev) => ({
      ...prev,
      test_steps: [...prev.test_steps, ""],
    }))
  }

  const removeTestStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      test_steps: prev.test_steps.filter((_, i) => i !== index),
    }))
  }

  const updateTestStep = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      test_steps: prev.test_steps.map((step, i) => (i === index ? value : step)),
    }))
  }

  const submitCreate = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/checklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature_id: featureId,
          ...formData,
          test_steps: formData.test_steps.filter((s) => s.trim() !== ""),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Test case created successfully")
        setIsCreateOpen(false)
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error(result.error || "Failed to create test case")
      }
    } catch {
      toast.error("Failed to create test case")
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitEdit = async () => {
    if (!selectedChecklist) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/checklists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedChecklist.id,
          ...formData,
          test_steps: formData.test_steps.filter((s) => s.trim() !== ""),
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Test case updated successfully")
        setIsEditOpen(false)
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error(result.error || "Failed to update test case")
      }
    } catch {
      toast.error("Failed to update test case")
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitDelete = async () => {
    if (!selectedChecklist) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/checklists", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedChecklist.id }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Test case deleted successfully")
        setIsDeleteOpen(false)
        startTransition(() => {
          router.refresh()
        })
      } else {
        toast.error(result.error || "Failed to delete test case")
      }
    } catch {
      toast.error("Failed to delete test case")
    } finally {
      setIsSubmitting(false)
    }
  }

  const checklistFormContent = (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Test case title"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of what this test case covers"
          rows={2}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>Test Steps *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTestStep}>
            <Plus className="h-3 w-3 mr-1" />
            Add Step
          </Button>
        </div>
        <div className="space-y-2">
          {formData.test_steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
              <Input
                value={step}
                onChange={(e) => updateTestStep(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1"
              />
              {formData.test_steps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTestStep(index)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="expected_result">Expected Result *</Label>
        <Textarea
          id="expected_result"
          value={formData.expected_result}
          onChange={(e) => setFormData((prev) => ({ ...prev, expected_result: e.target.value }))}
          placeholder="What should happen when all steps are completed correctly"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="order_index">Order</Label>
          <Input
            id="order_index"
            type="number"
            min={1}
            value={formData.order_index}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, order_index: parseInt(e.target.value) || 1 }))
            }
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <Switch
            id="is_critical"
            checked={formData.is_critical}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, is_critical: checked }))
            }
          />
          <Label htmlFor="is_critical" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Critical Test
          </Label>
        </div>
      </div>
    </div>
  )

  if (initialData.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No test cases found for this feature</p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Test Case
          </Button>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Test Case</DialogTitle>
              <DialogDescription>
                Add a new test checklist item for this feature
              </DialogDescription>
            </DialogHeader>
            {checklistFormContent}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={submitCreate}
                disabled={isSubmitting || !formData.title || !formData.expected_result}
              >
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
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          {initialData.filter((c) => c.is_critical).length} critical tests
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Test Case
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>Test Case</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Expected Result</TableHead>
              <TableHead className="w-[100px]">Critical</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((checklist) => (
              <TableRow key={checklist.id}>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                    <span>{checklist.order_index}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{checklist.title}</div>
                    {checklist.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                        {checklist.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {checklist.test_steps.length} steps
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {checklist.expected_result}
                  </p>
                </TableCell>
                <TableCell>
                  {checklist.is_critical ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Critical
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Normal</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isPending}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(checklist)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(checklist)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Test Case</DialogTitle>
            <DialogDescription>
              Add a new test checklist item for this feature
            </DialogDescription>
          </DialogHeader>
          {checklistFormContent}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitCreate}
              disabled={isSubmitting || !formData.title || !formData.expected_result}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Test Case</DialogTitle>
            <DialogDescription>Update test case details</DialogDescription>
          </DialogHeader>
          {checklistFormContent}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitEdit}
              disabled={isSubmitting || !formData.title || !formData.expected_result}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test Case?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedChecklist?.title}". This action cannot be
              undone.
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
