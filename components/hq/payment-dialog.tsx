"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  Loader2,
  CheckCircle2,
  Shield,
  Lock,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import type { HQInvite } from "@/lib/types"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invite: HQInvite | null
  projectId: string
  hqId: string
}

const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
}

export function PaymentDialog({
  open,
  onOpenChange,
  invite,
  projectId,
  hqId,
}: PaymentDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Mock payment form data
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const amount = invite?.proposed_budget || 0
  const symbol = "€" // Default to EUR

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!invite) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // In production, this would:
      // 1. Create a Stripe PaymentIntent
      // 2. Process the payment
      // 3. Create the project record

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create payment record
      const { error: paymentError } = await supabase.from("hq_payments").insert({
        hq_id: hqId,
        project_id: projectId,
        boss_id: invite.boss_id,
        amount: amount,
        currency: "EUR",
        status: "paid",
        paid_at: new Date().toISOString(),
      })

      if (paymentError) throw paymentError

      // Update project status to in_progress
      await supabase
        .from("hq_projects")
        .update({
          status: "in_progress",
          assigned_boss_id: invite.boss_id,
        })
        .eq("id", projectId)

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        onOpenChange(false)
        router.push(`/hq/projects/${projectId}`)
        router.refresh()
      }, 2000)
    } catch (err) {
      console.error("Payment error:", err)
      setError("Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading && !success) {
      setCardData({ cardNumber: "", expiry: "", cvc: "", name: "" })
      setError(null)
      setSuccess(false)
      onOpenChange(false)
    }
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <DialogTitle className="text-xl">Payment Successful!</DialogTitle>
            <DialogDescription className="mt-2">
              Your project is now active. You can start collaborating with the
              professional.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment
          </DialogTitle>
          <DialogDescription>
            Complete payment to start your project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Payment Summary */}
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Project Fee</span>
                <span className="font-medium">
                  {symbol}
                  {amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Platform Fee (5%)</span>
                <span className="font-medium">
                  {symbol}
                  {(amount * 0.05).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  {symbol}
                  {(amount * 1.05).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Card Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) =>
                    setCardData({ ...cardData, name: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    className="pl-10"
                    value={cardData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                      const formatted = value.replace(/(\d{4})/g, "$1 ").trim()
                      setCardData({ ...cardData, cardNumber: formatted })
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                      const formatted =
                        value.length > 2
                          ? `${value.slice(0, 2)}/${value.slice(2)}`
                          : value
                      setCardData({ ...cardData, expiry: formatted })
                    }}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="pl-10"
                      value={cardData.cvc}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 3)
                        setCardData({ ...cardData, cvc: value })
                      }}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 shrink-0" />
              <span>
                Your payment is secured by Stripe. We never store your card details.
              </span>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay {symbol}
                  {(amount * 1.05).toLocaleString()}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
