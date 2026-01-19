"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  X,
  Plus,
  Search,
  CheckCircle2,
  Sparkles,
  Tag,
  Briefcase,
  Star,
  TrendingUp,
} from "lucide-react"
import type { DemoComponentProps } from "./index"

// Predefined skill categories
const SKILL_CATEGORIES = [
  {
    name: "Design",
    skills: ["UI/UX Design", "Graphic Design", "Logo Design", "Branding", "Illustration", "3D Design"],
  },
  {
    name: "Development",
    skills: ["React", "Next.js", "Node.js", "Python", "TypeScript", "Mobile App", "WordPress"],
  },
  {
    name: "Marketing",
    skills: ["SEO", "Content Marketing", "Social Media", "Google Ads", "Facebook Ads", "Email Marketing"],
  },
  {
    name: "Business",
    skills: ["Business Strategy", "Financial Planning", "Project Management", "Consulting", "Legal"],
  },
]

// Popular tags
const POPULAR_TAGS = [
  "Startup Friendly",
  "Fast Delivery",
  "Premium Quality",
  "Budget Friendly",
  "24/7 Support",
  "Revision Included",
  "NDA Available",
  "Long-term Partner",
  "Remote OK",
  "Vietnamese",
  "English Fluent",
  "Enterprise Ready",
]

interface BossProfile {
  name: string
  business_name: string
  skills: string[]
  tags: string[]
  experience_years: number
}

export function BossSkillsTagsDemo({ featureId, userId, onInteraction }: DemoComponentProps) {
  const [profile, setProfile] = useState<BossProfile>({
    name: "Nguyễn Văn Demo",
    business_name: "Demo Tech Solutions",
    skills: ["React", "Node.js", "UI/UX Design"],
    tags: ["Fast Delivery", "Premium Quality"],
    experience_years: 5,
  })

  const [skillSearch, setSkillSearch] = useState("")
  const [customSkill, setCustomSkill] = useState("")
  const [customTag, setCustomTag] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleAddSkill = (skill: string) => {
    if (!profile.skills.includes(skill) && profile.skills.length < 10) {
      setProfile((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
      onInteraction?.()
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
    onInteraction?.()
  }

  const handleAddTag = (tag: string) => {
    if (!profile.tags.includes(tag) && profile.tags.length < 8) {
      setProfile((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
      onInteraction?.()
    }
  }

  const handleRemoveTag = (tag: string) => {
    setProfile((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
    onInteraction?.()
  }

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !profile.skills.includes(customSkill.trim())) {
      handleAddSkill(customSkill.trim())
      setCustomSkill("")
    }
  }

  const handleAddCustomTag = () => {
    if (customTag.trim() && !profile.tags.includes(customTag.trim())) {
      handleAddTag(customTag.trim())
      setCustomTag("")
    }
  }

  const handleSave = () => {
    setSaved(true)
    onInteraction?.()
    setTimeout(() => setSaved(false), 3000)
  }

  const filteredCategories = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    skills: cat.skills.filter(
      (skill) =>
        skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !profile.skills.includes(skill)
    ),
  })).filter((cat) => cat.skills.length > 0)

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 border border-blue-500/20">
        <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Boss Skills & Tags Demo
        </h3>
        <p className="text-sm text-muted-foreground">
          Đây là demo tính năng quản lý Skills và Tags cho hồ sơ Boss. Hãy thử thêm/xóa skills và tags.
        </p>
      </div>

      {/* Current Profile Preview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{profile.business_name}</CardTitle>
              <CardDescription>{profile.name} • {profile.experience_years} năm kinh nghiệm</CardDescription>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Top Boss
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Skills Display */}
          <div>
            <Label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4" />
              Skills ({profile.skills.length}/10)
            </Label>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {profile.skills.length === 0 && (
                <span className="text-sm text-muted-foreground">Chưa có skill nào</span>
              )}
            </div>
          </div>

          {/* Tags Display */}
          <div>
            <Label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4" />
              Tags ({profile.tags.length}/8)
            </Label>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="pl-2 pr-1 py-1 flex items-center gap-1 border-green-500 text-green-700 dark:text-green-400"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {profile.tags.length === 0 && (
                <span className="text-sm text-muted-foreground">Chưa có tag nào</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Thêm Skills
          </CardTitle>
          <CardDescription>
            Chọn từ danh sách có sẵn hoặc thêm skill tùy chỉnh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm skill..."
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {SKILL_CATEGORIES.map((cat) => (
              <Button
                key={cat.name}
                variant={activeCategory === cat.name ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {(activeCategory
              ? filteredCategories.filter((c) => c.name === activeCategory)
              : filteredCategories
            )
              .flatMap((cat) => cat.skills)
              .slice(0, 12)
              .map((skill) => (
                <Button
                  key={skill}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => handleAddSkill(skill)}
                  disabled={profile.skills.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">{skill}</span>
                </Button>
              ))}
          </div>

          {/* Custom Skill */}
          <div className="flex gap-2">
            <Input
              placeholder="Thêm skill tùy chỉnh..."
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomSkill()}
            />
            <Button
              onClick={handleAddCustomSkill}
              disabled={!customSkill.trim() || profile.skills.length >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Tags Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Thêm Tags
          </CardTitle>
          <CardDescription>
            Tags giúp HQ dễ dàng tìm thấy bạn hơn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Popular Tags */}
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Tags phổ biến
            </Label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.filter((tag) => !profile.tags.includes(tag)).map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleAddTag(tag)}
                  disabled={profile.tags.length >= 8}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Tag */}
          <div className="flex gap-2">
            <Input
              placeholder="Thêm tag tùy chỉnh..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomTag()}
            />
            <Button
              onClick={handleAddCustomTag}
              disabled={!customTag.trim() || profile.tags.length >= 8}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="min-w-[150px]">
          {saved ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Đã lưu!
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </div>

      {/* Demo Info */}
      <div className="rounded-lg bg-muted/50 p-4 text-sm">
        <p className="font-medium mb-2">Lưu ý:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Đây là môi trường demo, dữ liệu không được lưu thực tế</li>
          <li>Giới hạn tối đa 10 skills và 8 tags</li>
          <li>Hãy thử thêm/xóa skills và tags để trải nghiệm tính năng</li>
          <li>Sau khi dùng thử, chuyển sang tab Checklist để đánh giá</li>
        </ul>
      </div>
    </div>
  )
}
