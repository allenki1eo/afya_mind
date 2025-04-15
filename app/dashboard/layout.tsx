"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart, MessageSquare, Mic, Users, Settings, Menu, Heart, LogOut, Calendar, Award } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Mood Tracker",
    href: "/dashboard",
    icon: BarChart,
  },
  {
    title: "AI Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Audio Journal",
    href: "/dashboard/journal",
    icon: Mic,
  },
  {
    title: "Find Therapists",
    href: "/dashboard/therapists",
    icon: Users,
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: Calendar,
  },
  {
    title: "Achievements",
    href: "/dashboard/achievements",
    icon: Award,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [nickname, setNickname] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  async function fetchUserProfile() {
    if (user) {
      try {
        const { data, error } = await supabase.from("profiles").select("nickname").eq("id", user.id).single()

        if (error) throw error

        if (data) {
          setNickname(data.nickname)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        // Don't set an error state, just use a default nickname
      }
    }
  }

  useEffect(() => {
    setIsMounted(true)

    // Only fetch profile if user exists
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
  }

  // Only render client-side to avoid hydration mismatch
  if (!isMounted) {
    return null
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
                  <Heart className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">AfyaMind</span>
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
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-bold">AfyaMind</span>
            </Link>
          </div>
          <div className="hidden md:flex">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-bold">AfyaMind</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              Hello, <span className="font-medium text-foreground">{nickname || "User"}</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {nickname ? nickname.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
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
