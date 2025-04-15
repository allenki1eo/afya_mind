import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Brain, Shield, Users, ArrowRight, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AfyaMind</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/login">
              <Button variant="primary">Login</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-healing-50/30 to-calm-50/30 -z-10" />
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Mental Health in Tanzania: <br />
              <span className="text-primary">The Crisis & Our Mission</span>
            </h1>
            <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
              Understanding the mental health landscape in Tanzania and how AfyaMind is working to bridge the gap in
              care.
            </p>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Mental health awareness in Tanzania"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">The Mental Health Crisis</h2>
                <p className="text-lg text-muted-foreground">
                  Tanzania faces a significant mental health crisis, with limited resources to address the growing needs
                  of its population.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Prevalence</h3>
                      <p className="text-muted-foreground">
                        Approximately 1 in 4 Tanzanians will experience a mental health condition in their lifetime, yet
                        mental health remains stigmatized and misunderstood.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Limited Resources</h3>
                      <p className="text-muted-foreground">
                        With fewer than 100 mental health professionals serving a population of over 60 million, access
                        to care is severely limited.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Stigma & Barriers</h3>
                      <p className="text-muted-foreground">
                        Cultural stigma, geographical distance to services, and cost constraints prevent many from
                        seeking the help they need.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Key Challenges</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The mental health landscape in Tanzania faces several critical challenges that AfyaMind aims to address.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Lack of Awareness</CardTitle>
                  <CardDescription>Limited understanding of mental health conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Many Tanzanians lack basic knowledge about mental health conditions, their symptoms, and available
                    treatments, leading to delayed or no care-seeking.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insufficient Infrastructure</CardTitle>
                  <CardDescription>Inadequate facilities and professionals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tanzania has only a handful of specialized mental health facilities and professionals, most
                    concentrated in urban areas, leaving rural populations underserved.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cultural Stigma</CardTitle>
                  <CardDescription>Negative perceptions and misconceptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Mental health conditions are often attributed to spiritual causes or personal weakness, creating
                    shame and preventing people from seeking professional help.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">How AfyaMind Helps</h2>
                <p className="text-lg text-muted-foreground">
                  AfyaMind is designed to address these challenges through technology, creating accessible mental health
                  support for all Tanzanians.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Accessibility</h3>
                      <p className="text-muted-foreground">
                        Our digital platform breaks down geographical barriers, allowing users to access mental health
                        resources from anywhere with an internet connection.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Anonymity</h3>
                      <p className="text-muted-foreground">
                        Users can seek help anonymously, reducing the impact of stigma and encouraging more people to
                        take the first step toward better mental health.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">AI-Powered Support</h3>
                      <p className="text-muted-foreground">
                        Our AI assistant provides 24/7 support, helping to bridge the gap in professional resources
                        while connecting users with human therapists when needed.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Education & Awareness</h3>
                      <p className="text-muted-foreground">
                        AfyaMind provides educational resources to improve understanding of mental health and reduce
                        stigma in Tanzanian communities.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="AfyaMind helping mental health in Tanzania"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32 bg-primary/10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Join Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Together, we can transform mental health care in Tanzania and create a future where everyone has access to
              the support they need.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/therapist/register">
                <Button size="lg" variant="outline" className="px-8">
                  Join as a Therapist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AfyaMind</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AfyaMind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
