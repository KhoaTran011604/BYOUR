"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Briefcase, Building2, User, Sparkles, ChevronDown, Check } from "lucide-react"
import type { UserMode } from "@/lib/types"

const modeIcons = {
  boss: Briefcase,
  hq: Building2,
  self: User,
  shaper: Sparkles,
}

const modePaths = {
  boss: "/boss",
  hq: "/hq",
  self: "/self",
  shaper: "/shaper",
}

interface ModeSelectorProps {
  currentMode: UserMode
  onModeChange: (mode: UserMode) => void
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const t = useTranslations("boss.modeSelector")

  const modes: UserMode[] = ["boss", "hq", "self", "shaper"]

  const handleModeChange = (mode: UserMode) => {
    onModeChange(mode)
    setOpen(false)
    router.push(modePaths[mode])
  }

  const CurrentIcon = modeIcons[currentMode]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-transparent">
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4" />
            <span>{t(currentMode)}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        {modes.map((mode) => {
          const Icon = modeIcons[mode]
          return (
            <DropdownMenuItem
              key={mode}
              onClick={() => handleModeChange(mode)}
              className="flex items-center gap-3 py-3"
            >
              <Icon className="h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">{t(mode)}</div>
                <div className="text-xs text-muted-foreground">{t(`${mode}Description`)}</div>
              </div>
              {currentMode === mode && <Check className="h-4 w-4 text-accent" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
