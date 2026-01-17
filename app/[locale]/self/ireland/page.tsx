"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Plane,
  FileText,
  Euro,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  CheckCircle2,
} from "lucide-react"

// Fake data - will be replaced with DB data later
const visaTypes = [
  {
    name: "Working Holiday Visa",
    duration: "1 year",
    requirements: ["18-30 years old", "Vietnamese passport", "Proof of funds €3,000", "Health insurance"],
    processing: "4-8 weeks",
    fee: "€100",
  },
  {
    name: "Critical Skills Employment Permit",
    duration: "2 years",
    requirements: ["Job offer from Irish company", "Minimum salary €32,000/year", "Relevant qualifications", "Experience"],
    processing: "8-12 weeks",
    fee: "€1,000",
  },
  {
    name: "Stamp 1G (Graduate Visa)",
    duration: "1-2 years",
    requirements: ["Graduate from Irish institution", "Level 8+ degree", "Apply within 6 months after graduation"],
    processing: "2-4 weeks",
    fee: "€300",
  },
]

const taxInfo = [
  {
    title: "Income Tax",
    rate: "20% - 40%",
    description: "20% for the first €40,000, 40% for the remainder",
  },
  {
    title: "USC (Universal Social Charge)",
    rate: "0.5% - 8%",
    description: "Social charge based on income",
  },
  {
    title: "PRSI (Social Insurance)",
    rate: "4%",
    description: "Mandatory social insurance",
  },
]

const cities = [
  {
    name: "Dublin",
    description: "Capital city and largest tech hub",
    avgSalary: "€50,000 - €80,000",
    costOfLiving: "High",
    highlights: ["Google, Meta, LinkedIn HQ", "Strong startup ecosystem", "Networking opportunities"],
  },
  {
    name: "Cork",
    description: "Second largest city with growing tech scene",
    avgSalary: "€45,000 - €70,000",
    costOfLiving: "Medium - High",
    highlights: ["Apple European HQ", "Lower cost than Dublin", "Good quality of life"],
  },
  {
    name: "Galway",
    description: "Cultural city with thriving medtech industry",
    avgSalary: "€40,000 - €65,000",
    costOfLiving: "Medium",
    highlights: ["Medtech hub", "University town", "Coastal lifestyle"],
  },
]

const freelanceOpportunities = [
  {
    field: "Software Development",
    demand: "Very high",
    avgRate: "€50-100/hour",
    platforms: ["Toptal", "Upwork", "LinkedIn"],
  },
  {
    field: "UI/UX Design",
    demand: "High",
    avgRate: "€40-80/hour",
    platforms: ["Dribbble", "Behance", "99designs"],
  },
  {
    field: "Digital Marketing",
    demand: "High",
    avgRate: "€35-70/hour",
    platforms: ["Fiverr", "Upwork", "PeoplePerHour"],
  },
  {
    field: "Content & Translation",
    demand: "Medium",
    avgRate: "€25-50/hour",
    platforms: ["ProZ", "TranslatorsCafe", "Upwork"],
  },
]

export default function IrelandGuidePage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/self">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Ireland Guide</h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive guide to working and freelancing in Ireland
          </p>
        </div>

        {/* Visa Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5 text-accent" />
            Common Visa types
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {visaTypes.map((visa) => (
              <Card key={visa.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{visa.name}</CardTitle>
                  <CardDescription>Duration: {visa.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Requirements:</p>
                      <ul className="text-xs space-y-1">
                        {visa.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t">
                      <span>Processing: {visa.processing}</span>
                      <span className="font-medium">{visa.fee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tax Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Euro className="h-5 w-5 text-accent" />
            Tax Information
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {taxInfo.map((tax) => (
              <Card key={tax.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{tax.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent mb-1">{tax.rate}</div>
                  <p className="text-xs text-muted-foreground">{tax.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-4 border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-4">
              <p className="text-sm">
                <strong>Note:</strong> Freelancers can register as Sole Trader or set up a Limited Company.
                Refer to Revenue.ie for more details on tax obligations.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cities Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-accent" />
            Cities to consider
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {cities.map((city) => (
              <Card key={city.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{city.name}</CardTitle>
                  <CardDescription>{city.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. salary:</span>
                      <span className="font-medium">{city.avgSalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <Badge variant="outline">{city.costOfLiving}</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Highlights:</p>
                    <ul className="text-xs space-y-1">
                      {city.highlights.map((h, idx) => (
                        <li key={idx}>• {h}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Freelance Opportunities */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-accent" />
            Freelance Opportunities
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {freelanceOpportunities.map((opp) => (
              <Card key={opp.field}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{opp.field}</CardTitle>
                    <Badge variant={opp.demand === "Very high" ? "default" : "secondary"}>{opp.demand}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Average rate:</span>
                    <span className="font-semibold text-accent">{opp.avgRate}</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Platforms:</p>
                    <div className="flex flex-wrap gap-1">
                      {opp.platforms.map((p) => (
                        <Badge key={p} variant="outline" className="text-xs">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Resources */}
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-accent" />
              Useful resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Official</h4>
                <ul className="space-y-1 text-sm">
                  <li>• citizensinformation.ie - Citizen information</li>
                  <li>• revenue.ie - Tax authority</li>
                  <li>• enterprise-ireland.com - Business support</li>
                  <li>• dbei.gov.ie - Work permits</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Community</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Vietnamese in Ireland (Facebook)</li>
                  <li>• Tech Ireland Slack</li>
                  <li>• Dublin Freelancers Meetup</li>
                  <li>• r/ireland subreddit</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
