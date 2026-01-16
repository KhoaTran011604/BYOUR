"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, FileText, Building2, Calculator, Shield } from "lucide-react"

// Fake data - will be replaced with DB data later
const steps = [
  {
    id: 1,
    title: "Prepare documents",
    description: "Prepare ID card, 3x4 photos, and related documents",
    details: [
      "Copy of valid ID card",
      "2 white background 3x4 photos",
      "Proof of permanent residence",
      "Professional certificates (if required by industry)",
    ],
  },
  {
    id: 2,
    title: "Register at tax authority",
    description: "Register personal tax code at district Tax Office",
    details: [
      "Fill out tax registration form 01-DK-TCT",
      "Submit documents at local Tax Office",
      "Receive tax code within 3-5 business days",
      "Activate electronic tax account",
    ],
  },
  {
    id: 3,
    title: "Business registration",
    description: "Register as individual business or private enterprise",
    details: [
      "Choose type: Individual business or Private enterprise",
      "Register business name at Planning & Investment Dept",
      "Pay registration fee (100,000 - 200,000 VND)",
      "Receive business registration certificate",
    ],
  },
  {
    id: 4,
    title: "Open bank account",
    description: "Open a bank account for business operations",
    details: [
      "Choose a bank that suits your needs",
      "Bring ID and business registration",
      "Register for Internet Banking",
      "Link to e-wallet if needed",
    ],
  },
]

const taxInfo = [
  {
    title: "Personal Income Tax",
    description: "Personal income tax from business activities",
    rate: "0.5% - 5%",
    note: "Depends on industry and revenue",
  },
  {
    title: "VAT",
    description: "Value added tax (if revenue > 100 million/year)",
    rate: "1% - 5%",
    note: "Flat-rate or deduction method",
  },
  {
    title: "Business License Tax",
    description: "Annual business license fee",
    rate: "300,000 - 1,000,000 VND",
    note: "Depends on previous year's revenue",
  },
]

export default function BusinessRegistrationGuidePage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/self">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Business Registration Guide</h1>
          </div>
          <p className="text-muted-foreground">
            Detailed step-by-step guide for personal business registration in Vietnam
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Steps to follow
          </h2>
          {steps.map((step, index) => (
            <Card key={step.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
                    {step.id}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-16">
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tax Information */}
        <div className="space-y-6 mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" />
            Tax information
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {taxInfo.map((tax, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{tax.title}</CardTitle>
                  <CardDescription className="text-xs">{tax.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent mb-1">{tax.rate}</div>
                  <p className="text-xs text-muted-foreground">{tax.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Important notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Always keep invoices and receipts for business transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Pay taxes on time to avoid late payment penalties</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Update information when there are changes in address or industry</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Consult an accountant or lawyer if needed</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
