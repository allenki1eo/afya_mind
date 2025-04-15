"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart, Users, Settings, Menu, LogOut, Shield, Flag, Award, Database, Home } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Therapists",
    href: "/admin/therapists",
    icon: Shield,
  },
  {
    title: "Moderation",
    href: "/admin/moderation",
    icon: Flag,
  },
  {
    title: "Gamification",
    href: "/admin/gamification",
    icon: Award,
  },
  {
    title: "Database",
    href: "/admin/database",
    icon: Database,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // In a real app, you would check admin authentication properly
        // This is a simplified version for demonstration
        const { data: session, error } = await supabase.auth.getSession()

        if (error || !session.session) {
          router.push("/admin/login")
          return
        }

        // Check if user has admin role (simplified)
        const { data: userData } = await supabase.auth.getUser()
        const isAdmin = userData?.user?.email === "allenkileo7@gmail.com"

        if (!isAdmin) {
          router.push("/admin/login")
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error checking admin auth:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAuth()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not authenticated, don't render the layout
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  // Don't apply layout to login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <div className="flex items-center gap-2 mb-8">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">AfyaMind Admin</span>
                </div>
                <nav className="grid gap-2 text-lg font-medium">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent ${
                        pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  ))}
                  <Separator className="my-2" />
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-muted-foreground"
                  >
                    <Home className="h-5 w-5" />
                    View Site
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold">AfyaMind Admin</span>
            </Link>
          </div>
          <div className="hidden md:flex">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold">AfyaMind Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">Admin</div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex-1 flex">
        <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40">
          <nav className="grid gap-2 p-4 text-sm font-medium">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent ${
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
            <Separator className="my-2" />
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-muted-foreground"
            >
              <Home className="h-5 w-5" />
              View Site
            </Link>
            <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 justify-start" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
