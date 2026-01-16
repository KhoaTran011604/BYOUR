import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto">
          The website you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go to TEST-002 home</Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/auth/sign-up">Create your website</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
