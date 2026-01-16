"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import type { BossVerificationStatus } from "@/lib/types"

interface VerificationStatusProps {
  userId: string
  initialStatus: BossVerificationStatus
  registrationNumber: string
}

const statusConfig = {
  pending: {
    icon: Clock,
    title: "Verification Pending",
    description: "Your registration is queued for verification",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    progress: 25,
  },
  verifying: {
    icon: Loader2,
    title: "Verifying Registration",
    description: "We are checking your registration number with official records",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    progress: 50,
  },
  verified: {
    icon: CheckCircle2,
    title: "Verification Successful",
    description: "Your business registration has been verified",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    progress: 100,
  },
  failed: {
    icon: XCircle,
    title: "Verification Failed",
    description: "We could not verify your registration number",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    progress: 0,
  },
}

export function VerificationStatus({
  userId,
  initialStatus,
  registrationNumber,
}: VerificationStatusProps) {
  const router = useRouter()
  const [status, setStatus] = useState<BossVerificationStatus>(initialStatus)
  const [isSimulating, setIsSimulating] = useState(initialStatus === "verifying")

  // Simulate verification process (in production, this would be a real API call)
  useEffect(() => {
    if (status === "verifying" && isSimulating) {
      const timer = setTimeout(async () => {
        // Simulate API verification - in production, this would check with CRO or other authority
        const isValid = registrationNumber.length >= 6

        const newStatus: BossVerificationStatus = isValid ? "verified" : "failed"
        setStatus(newStatus)
        setIsSimulating(false)

        // Update database
        const supabase = createClient()
        await supabase
          .from("boss_profiles")
          .update({
            verification_status: newStatus,
            verified_at: isValid ? new Date().toISOString() : null,
          })
          .eq("user_id", userId)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [status, isSimulating, registrationNumber, userId])

  const config = statusConfig[status]
  const Icon = config.icon

  const handleContinue = () => {
    router.push("/boss/dashboard")
  }

  const handleRetry = () => {
    router.push("/boss")
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${config.bgColor}`}
          >
            <Icon
              className={`h-8 w-8 ${config.color} ${
                status === "verifying" ? "animate-spin" : ""
              }`}
            />
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Registration Number</span>
              <span className="font-mono font-medium">{registrationNumber}</span>
            </div>
            <Progress value={config.progress} className="h-2" />
          </div>

          {status === "verifying" && (
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Verification steps:</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Registration number received</span>
                </li>
                <li className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span>Checking official records...</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Validating business status</span>
                </li>
              </ul>
            </div>
          )}

          {status === "verified" && (
            <div className="rounded-lg bg-green-500/10 p-4">
              <p className="text-sm text-green-700 dark:text-green-400">
                Your business is verified and ready. You can now create your HQ website
                and start receiving project invites.
              </p>
            </div>
          )}

          {status === "failed" && (
            <div className="rounded-lg bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                The registration number could not be verified. Please check the number
                and try again, or contact support if you believe this is an error.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          {status === "verified" && (
            <Button onClick={handleContinue} className="w-full">
              Continue to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {status === "failed" && (
            <Button onClick={handleRetry} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          {(status === "pending" || status === "verifying") && (
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
