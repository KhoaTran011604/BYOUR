"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"

export interface DemoComponentProps {
  featureId: string
  userId: string
  onInteraction?: () => void // Called when user interacts with demo
}

// Lazy load demo components
const HQRatingDemo = dynamic(() => import("./hq-rating-demo").then((m) => m.HQRatingDemo), {
  loading: () => <DemoLoadingPlaceholder />,
})

const GenericDemo = dynamic(() => import("./generic-demo").then((m) => m.GenericDemo), {
  loading: () => <DemoLoadingPlaceholder />,
})

// Registry of available demo components
const DEMO_REGISTRY: Record<string, ComponentType<DemoComponentProps>> = {
  "hq-rating": HQRatingDemo,
  generic: GenericDemo,
}

export function getDemoComponent(componentKey: string | null): ComponentType<DemoComponentProps> | null {
  if (!componentKey) return null
  return DEMO_REGISTRY[componentKey] || null
}

export function DemoLoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg animate-pulse">
      <p className="text-muted-foreground">Loading demo...</p>
    </div>
  )
}
