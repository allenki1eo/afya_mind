import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Heart, Shield, Users, BarChart, MessageSquare, Mic, CheckCircle, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AfyaMind</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/onboarding">
              <Button variant="ghost">Get Started</Button>
            </Link>
            <Link href="/therapist/register">
              <Button variant="ghost">For Therapists</Button>
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
              Your Mental Health Journey <br />
              <span className="text-primary">Starts Here</span>
            </h1>
            <p className="max-w-[46rem] text-lg text-muted-foreground sm:text-xl">
              Anonymous, supportive, and accessible mental health resources for Tanzanians. Track your mood, chat with
              an AI assistant, and connect with therapists.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/onboarding">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/therapist/register">
                <Button size="lg" variant="outline" className="px-8">
                  Join as a Therapist
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32 bg-accent">
          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 md:grid-cols-3">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Anonymous Support</CardTitle>
                <CardDescription>Get help without sharing personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your privacy matters. Access mental health resources without compromising your identity.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Brain className="h-10 w-10 text-primary mb-4" />
                <CardTitle>AI-Powered Chat</CardTitle>
                <CardDescription>Talk to an empathetic AI assistant anytime</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Our AI assistant is available 24/7 to provide support, guidance, and a listening ear.</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Mood Tracking</CardTitle>
                <CardDescription>Monitor your emotional wellbeing over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Visualize your mood patterns and gain insights into your mental health journey.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mental Health in Tanzania Section */}
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Mental Health in Tanzania</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Understanding the landscape and challenges of mental health care in Tanzania
              </p>
            </div>

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
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">The Current Situation</h3>
                  <p>
                    Tanzania faces significant challenges in mental health care, with approximately 1 in 4 Tanzanians
                    experiencing a mental health condition in their lifetime. Despite this prevalence, there are fewer
                    than 100 mental health professionals serving a population of over 60 million people.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Barriers to Access</h3>
                  <p>
                    Many Tanzanians face barriers to mental health care, including stigma, limited resources,
                    geographical distance to services, and cost constraints. These barriers prevent many from seeking
                    the help they need.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Our Mission</h3>
                  <p>
                    AfyaMind aims to bridge these gaps by providing accessible, anonymous mental health support that
                    respects cultural contexts and reduces stigma through technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">How AfyaMind Works</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our comprehensive approach to mental health support
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Track Your Mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Log your daily mood and track patterns over time to gain insights into your emotional wellbeing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Chat with our AI assistant for immediate support, guidance, and mental health resources.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Voice Journaling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Record your thoughts and feelings through audio journals that are automatically transcribed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Connect with Therapists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Find and connect with qualified mental health professionals based on your needs and preferences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">User Experiences</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                How AfyaMind is making a difference in people's lives
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-bold">M</span>
                    </div>
                    <h3 className="font-medium mt-2">Maria, 28</h3>
                    <p className="text-sm text-muted-foreground">Dar es Salaam</p>
                  </div>
                  <p className="text-center italic">
                    "AfyaMind helped me understand my anxiety patterns. The mood tracking feature showed me how certain
                    situations affected my mental state, and the AI chat was there when I needed someone to talk to."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-bold">J</span>
                    </div>
                    <h3 className="font-medium mt-2">John, 35</h3>
                    <p className="text-sm text-muted-foreground">Arusha</p>
                  </div>
                  <p className="text-center italic">
                    "I was hesitant to seek help for my depression, but the anonymity of AfyaMind made it easier.
                    Eventually, I connected with a therapist through the app, which was a turning point in my journey."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-bold">F</span>
                    </div>
                    <h3 className="font-medium mt-2">Fatima, 22</h3>
                    <p className="text-sm text-muted-foreground">Mwanza</p>
                  </div>
                  <p className="text-center italic">
                    "The voice journaling feature has been transformative. Speaking my thoughts aloud and then reading
                    the transcripts later gives me new perspectives on my feelings and challenges."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* For Therapists Section */}
        <section className="container py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">For Mental Health Professionals</h2>
                <p className="text-lg text-muted-foreground">
                  Join our network of therapists and counselors to expand your reach and help more people in Tanzania.
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Expand Your Practice</h3>
                      <p className="text-muted-foreground">Connect with clients who might not otherwise seek help.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Flexible Scheduling</h3>
                      <p className="text-muted-foreground">
                        Offer both online and in-person sessions based on your availability.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Professional Community</h3>
                      <p className="text-muted-foreground">
                        Join a network of mental health professionals across Tanzania.
                      </p>
                    </div>
                  </li>
                </ul>

                <Link href="/therapist/register">
                  <Button size="lg" className="mt-4">
                    Register as a Therapist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div>
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Mental health professionals"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container py-12 md:py-24 lg:py-32 bg-primary/10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Start Your Mental Health Journey Today</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Take the first step toward better mental wellbeing with AfyaMind's anonymous, supportive resources.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AfyaMind</span>
              </div>
              <p className="text-sm text-muted-foreground">Anonymous mental health support for Tanzanians</p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard" className="hover:text-foreground">
                    Mood Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/chat" className="hover:text-foreground">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/journal" className="hover:text-foreground">
                    Voice Journaling
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/therapists" className="hover:text-foreground">
                    Find Therapists
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/resources/crisis" className="hover:text-foreground">
                    Crisis Support
                  </Link>
                </li>
                <li>
                  <Link href="/resources/articles" className="hover:text-foreground">
                    Mental Health Articles
                  </Link>
                </li>
                <li>
                  <Link href="/resources/faq" className="hover:text-foreground">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/therapist/register" className="hover:text-foreground">
                    For Therapists
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AfyaMind. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
