"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Building2, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

const businessTypes = [
  { value: "sole_trader", label: "Sole Trader" },
  { value: "limited_company", label: "Limited Company" },
  { value: "partnership", label: "Partnership" },
  { value: "freelancer", label: "Freelancer" },
  { value: "contractor", label: "Contractor" },
]

interface RegistrationFormProps {
  userId: string
}

export function RegistrationForm({ userId }: RegistrationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    registrationNumber: "",
    companyName: "",
    businessType: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.registrationNumber.trim()) {
      setError("Registration number is required")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Create boss profile with pending verification
      const { error: insertError } = await supabase
        .from("boss_profiles")
        .insert({
          user_id: userId,
          registration_number: formData.registrationNumber.trim(),
          company_name: formData.companyName.trim() || null,
          business_type: formData.businessType || null,
          verification_status: "verifying",
        })

      if (insertError) throw insertError

      // Navigate to verification page
      router.push("/boss/verify")
    } catch (err) {
      console.error("Registration error:", err)
      setError("Failed to submit registration. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Briefcase className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl">Boss Mode Registration</CardTitle>
          <CardDescription>
            Enter your business registration number to verify your professional status
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">
                Registration Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="registrationNumber"
                placeholder="e.g., CRO123456"
                value={formData.registrationNumber}
                onChange={(e) =>
                  setFormData({ ...formData, registrationNumber: e.target.value })
                }
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Your company registration number or business license ID
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g., Acme Ltd"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) =>
                  setFormData({ ...formData, businessType: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Registration
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
