"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ServicesManager } from "@/components/boss/services-manager"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import type { Service } from "@/lib/types"

export default function ManageServicesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [services, setServices] = useState<Partial<Service>[]>([])
  const [websiteId, setWebsiteId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    // Get website
    const { data: website } = await supabase
      .from("websites")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!website) {
      router.push("/boss/website/create")
      return
    }

    setWebsiteId(website.id)

    // Get services
    const { data: servicesData } = await supabase
      .from("services")
      .select("*")
      .eq("website_id", website.id)
      .order("order_index")

    setServices(servicesData || [])
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!websiteId) return

    setIsSaving(true)
    const supabase = createClient()

    try {
      // Delete existing services
      await supabase.from("services").delete().eq("website_id", websiteId)

      // Insert new services
      if (services.length > 0) {
        const servicesData = services.map((service, index) => ({
          website_id: websiteId,
          title: service.title || "",
          description: service.description || null,
          price_type: service.price_type || "quote",
          price_amount: service.price_amount || null,
          currency: service.currency || "EUR",
          order_index: index,
          is_active: true,
        }))

        const { error } = await supabase.from("services").insert(servicesData)

        if (error) throw error
      }

      toast({
        title: "Services saved",
        description: "Your services have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save services. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-accent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/boss/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
          <CardDescription>
            Add, edit, or remove services displayed on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServicesManager services={services} onServicesChange={setServices} />
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/boss/dashboard">Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
