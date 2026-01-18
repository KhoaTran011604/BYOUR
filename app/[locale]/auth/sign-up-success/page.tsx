import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold tracking-tight">TEST-002</h1>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We&apos;ve sent a confirmation link to your email. Please check your inbox and click the link
              to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
