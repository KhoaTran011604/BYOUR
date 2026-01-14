"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Briefcase, Building2, User, Sparkles, ChevronDown, Check } from "lucide-react"
import type { UserMode } from "@/lib/types"

const modeConfig = {
  boss: { label: "Boss", icon: Briefcase, description: "Freelancer chuyên nghiệp" },
  hq: { label: "HQ", icon: Building2, description: "Doanh nghiệp & Agency" },
  self: { label: "Self", icon: User, description: "Đang tìm hiểu" },
  shaper: { label: "Shaper", icon: Sparkles, description: "Đóng góp nội bộ" },
}

interface ModeSelectorProps {
  currentMode: UserMode
  onModeChange: (mode: UserMode) => void
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const [open, setOpen] = useState(false)
  const current = modeConfig[currentMode]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-transparent">
          <div className="flex items-center gap-2">
            <current.icon className="h-4 w-4" />
            <span>{current.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        {(Object.entries(modeConfig) as [UserMode, typeof modeConfig.boss][]).map(([mode, config]) => (
          <DropdownMenuItem
            key={mode}
            onClick={() => {
              onModeChange(mode)
              setOpen(false)
            }}
            className="flex items-center gap-3 py-3"
          >
            <config.icon className="h-4 w-4" />
            <div className="flex-1">
              <div className="font-medium">{config.label}</div>
              <div className="text-xs text-muted-foreground">{config.description}</div>
            </div>
            {currentMode === mode && <Check className="h-4 w-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
