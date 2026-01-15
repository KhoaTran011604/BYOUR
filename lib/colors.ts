import type { ColorScheme } from "./types"

export interface ColorPalette {
  name: string
  description: string
  primary: string
  secondary: string
  accent: string
  background: string
  backgroundAlt: string
  text: string
  textMuted: string
  border: string
}

export const colorSchemes: Record<ColorScheme, ColorPalette> = {
  warm: {
    name: "Warm",
    description: "Tông ấm, cam hồng",
    primary: "#F59E0B",
    secondary: "#EC4899",
    accent: "#8B5CF6",
    background: "#FFFBF7",
    backgroundAlt: "#FFF7ED",
    text: "#44403C",
    textMuted: "#78716C",
    border: "#E7E5E4",
  },
  ocean: {
    name: "Ocean",
    description: "Tông xanh dương",
    primary: "#0EA5E9",
    secondary: "#06B6D4",
    accent: "#3B82F6",
    background: "#F8FAFC",
    backgroundAlt: "#F0F9FF",
    text: "#334155",
    textMuted: "#64748B",
    border: "#E2E8F0",
  },
  forest: {
    name: "Forest",
    description: "Tông xanh lá",
    primary: "#10B981",
    secondary: "#84CC16",
    accent: "#14B8A6",
    background: "#FAFAF9",
    backgroundAlt: "#F0FDF4",
    text: "#3F3F46",
    textMuted: "#71717A",
    border: "#E4E4E7",
  },
  royal: {
    name: "Royal",
    description: "Tông tím vàng",
    primary: "#8B5CF6",
    secondary: "#A855F7",
    accent: "#EAB308",
    background: "#FAF5FF",
    backgroundAlt: "#FEF9C3",
    text: "#374151",
    textMuted: "#6B7280",
    border: "#E5E7EB",
  },
}

export function getGradient(colorScheme: ColorScheme): string {
  const colors = colorSchemes[colorScheme]
  return `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`
}

export function getPriceGradient(colorScheme: ColorScheme): string {
  const colors = colorSchemes[colorScheme]
  return `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
}
