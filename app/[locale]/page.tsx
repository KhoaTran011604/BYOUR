import Link from "next/link"
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Building2, User, Sparkles } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"

const modeIcons = {
  boss: Briefcase,
  hq: Building2,
  self: User,
  shaper: Sparkles,
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')
  const tNav = await getTranslations('navigation')
  const tCommon = await getTranslations('common')
  const tModes = await getTranslations('modes')

  const modes = [
    {
      id: "boss",
      title: tModes('boss.title'),
      description: tModes('boss.description'),
      icon: modeIcons.boss,
      features: [tModes('boss.feature1'), tModes('boss.feature2'), tModes('boss.feature3')],
    },
    {
      id: "hq",
      title: tModes('hq.title'),
      description: tModes('hq.description'),
      icon: modeIcons.hq,
      features: [tModes('hq.feature1'), tModes('hq.feature2'), tModes('hq.feature3')],
    },
    {
      id: "self",
      title: tModes('self.title'),
      description: tModes('self.description'),
      icon: modeIcons.self,
      features: [tModes('self.feature1'), tModes('self.feature2'), tModes('self.feature3')],
    },
    {
      id: "shaper",
      title: tModes('shaper.title'),
      description: tModes('shaper.description'),
      icon: modeIcons.shaper,
      features: [tModes('shaper.feature1'), tModes('shaper.feature2'), tModes('shaper.feature3')],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight">TEST-002</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#modes"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {tNav('modes')}
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {tNav('features')}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="ghost" asChild>
              <Link href="/auth/login">{tCommon('login')}</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">{t('startForFree')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              {t('heroTitle')}
              <span className="block text-accent">{t('heroTitleAccent')}</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              {t('heroDescription')}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/auth/sign-up">
                  {t('createOffice')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="#modes">{t('exploreModes')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section id="modes" className="border-t border-border/50 bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('modesTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('modesDescription')}
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modes.map((mode) => (
              <div
                key={mode.id}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/50 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <mode.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{mode.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{mode.description}</p>
                <ul className="mt-4 space-y-2">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('featuresTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('featuresDescription')}
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="text-lg font-semibold">{t('feature1Title')}</h3>
              <p className="mt-2 text-muted-foreground">
                {t('feature1Description')}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="text-lg font-semibold">{t('feature2Title')}</h3>
              <p className="mt-2 text-muted-foreground">
                {t('feature2Description')}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="text-lg font-semibold">{t('feature3Title')}</h3>
              <p className="mt-2 text-muted-foreground">
                {t('feature3Description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">{t('ctaTitle')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            {t('ctaDescription')}
          </p>
          <Button size="lg" variant="secondary" asChild className="mt-8">
            <Link href="/auth/sign-up">
              {t('signUpFree')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">TEST-002</span>
              <span className="text-sm text-muted-foreground">© 2026</span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                {tNav('terms')}
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                {tNav('privacy')}
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                {tNav('contact')}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
