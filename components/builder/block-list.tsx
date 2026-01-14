"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import type { WebsiteBlock } from "@/lib/types"
import { GripVertical, Eye, EyeOff, Type, User, Briefcase, Mail } from "lucide-react"

const blockIcons = {
  hero: Type,
  about: User,
  services: Briefcase,
  contact: Mail,
}

const blockLabels = {
  hero: "Hero",
  about: "Giới thiệu",
  services: "Dịch vụ",
  contact: "Liên hệ",
}

interface BlockListProps {
  blocks: WebsiteBlock[]
  selectedBlockId: string | null
  onSelectBlock: (id: string) => void
  onReorderBlocks: (blocks: WebsiteBlock[]) => void
  onToggleVisibility: (id: string) => void
}

export function BlockList({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onReorderBlocks,
  onToggleVisibility,
}: BlockListProps) {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))

    if (dragIndex === dropIndex) return

    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(dragIndex, 1)
    newBlocks.splice(dropIndex, 0, removed)

    // Update order_index
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order_index: index,
    }))

    onReorderBlocks(reorderedBlocks)
  }

  return (
    <div className="p-4">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Khối nội dung</h3>
      <div className="space-y-2">
        {blocks.map((block, index) => {
          const Icon = blockIcons[block.block_type]
          return (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => onSelectBlock(block.id)}
              className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-all ${
                selectedBlockId === block.id
                  ? "border-accent bg-accent/5"
                  : "border-border bg-background hover:border-accent/50"
              } ${!block.is_visible ? "opacity-50" : ""}`}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <Icon className="h-4 w-4" />
              <span className="flex-1 text-sm font-medium">{blockLabels[block.block_type]}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleVisibility(block.id)
                }}
              >
                {block.is_visible ? (
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
            </div>
          )
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Kéo thả để sắp xếp lại thứ tự các khối</p>
    </div>
  )
}
