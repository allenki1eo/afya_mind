"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Brain, MessageSquare, Calendar, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"

interface AnalyticsData {
  date: string
  totalUsers: number
  activeUsers: number
  newUsers: number
  moodEntries: number
  journalEntries: number
  chatMessages: number
  therapistAppointments: number
}

export default function AdminDashboardPage() {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("week")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTherapists: 0,
    pendingTherapists: 0,
    totalAppointments: 0,
    totalMoodEntries: 0,
    totalJournalEntries: 0,
    totalChatMessages: 0,
  })

  useEffect(() => {
    fetchAnalyticsData()
    fetchOverviewStats()
  }, [timeframe])

  const fetchAnalyticsData = async () => {
    try {
      // In a real app, you would fetch from the app_usage_stats table
      // This is mock data for demonstration
      const mockData: AnalyticsData[] = []
      const today = new Date()

      let daysToFetch = 7
      if (timeframe === "day") daysToFetch = 1
      if (timeframe === "month") daysToFetch = 30

      for (let i = 0; i < daysToFetch; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        mockData.unshift({
          date: date.toISOString().split("T")[0],
          totalUsers: 100 + Math.floor(Math.random() * 20) + i,
          activeUsers: 50 + Math.floor(Math.random() * 15),
          newUsers: Math.floor(Math.random() * 10),
          moodEntries: 30 + Math.floor(Math.random() * 20),
          journalEntries: 15 + Math.floor(Math.random() * 10),
          chatMessages: 80 + Math.floor(Math.random() * 40),
          therapistAppointments: 5 + Math.floor(Math.random() * 5),
        })
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOverviewStats = async () => {
    try {
      // In a real app, you would fetch actual stats from the database
      // This is mock data for demonstration
      setStats({
        totalUsers: 120,
        activeUsers: 65,
        totalTherapists: 12,
        pendingTherapists: 3,
        totalAppointments: 28,
        totalMoodEntries: 450,
        totalJournalEntries: 180,
        totalChatMessages: 890,
      })
    } catch (error) {
      console.error("Error fetching overview stats:", error)
    }
  }

  const userActivityData = [
    { name: "Mood Tracking", value: stats.totalMoodEntries },
    { name: "Journaling", value: stats.totalJournalEntries },
    { name: "Chat", value: stats.totalChatMessages },
    { name: "Appointments", value: stats.totalAppointments },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 100
    return Math.round(((current - previous) / previous) * 100)
  }

  // Calculate changes from "yesterday" (mock data)
  const changes = {
    users: calculateChange(stats.totalUsers, stats.totalUsers - 5),
    active: calculateChange(stats.activeUsers, stats.activeUsers - 8),
    therapists: calculateChange(stats.totalTherapists, stats.totalTherapists - 1),
    appointments: calculateChange(stats.totalAppointments, stats.totalAppointments - 3),
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time analytics and platform overview</p>
        </div>
        <Tabs defaultValue="week" value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-4" />
                <span className="text-3xl font-bold">{stats.totalUsers}</span>
              </div>
              <div className={`flex items-center ${changes.users >= 0 ? "text-green-500" : "text-red-500"}`}>
                {changes.users >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(changes.users)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Users active today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-primary mr-4" />
                <span className="text-3xl font-bold">{stats.activeUsers}</span>
              </div>
              <div className={`flex items-center ${changes.active >= 0 ? "text-green-500" : "text-red-500"}`}>
                {changes.active >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(changes.active)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Therapists</CardTitle>
            <CardDescription>Registered therapists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-4" />
                <div>
                  <span className="text-3xl font-bold">{stats.totalTherapists}</span>
                  <p className="text-xs text-muted-foreground">{stats.pendingTherapists} pending approval</p>
                </div>
              </div>
              <div className={`flex items-center ${changes.therapists >= 0 ? "text-green-500" : "text-red-500"}`}>
                {changes.therapists >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(changes.therapists)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Total scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary mr-4" />
                <span className="text-3xl font-bold">{stats.totalAppointments}</span>
              </div>
              <div className={`flex items-center ${changes.appointments >= 0 ? "text-green-500" : "text-red-500"}`}>
                {changes.appointments >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(changes.appointments)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Daily active users and new registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {!loading && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analyticsData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" name="Active Users" />
                    <Line type="monotone" dataKey="newUsers" stroke="#82ca9d" name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
            <CardDescription>Usage distribution across features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="moodEntries" fill="#8884d8" name="Mood Entries" />
                  <Bar dataKey="journalEntries" fill="#82ca9d" name="Journal Entries" />
                  <Bar dataKey="chatMessages" fill="#ffc658" name="Chat Messages" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
            <CardDescription>Breakdown of user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userActivityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New User Registration</p>
                  <p className="text-sm text-muted-foreground">User123 joined the platform</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New Appointment</p>
                  <p className="text-sm text-muted-foreground">Appointment scheduled with Dr. Sarah</p>
                  <p className="text-xs text-muted-foreground">25 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Flagged Message</p>
                  <p className="text-sm text-muted-foreground">Message flagged for review</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Therapist Application</p>
                  <p className="text-sm text-muted-foreground">New therapist application submitted</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Items requiring admin action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Therapist Applications</p>
                    <p className="text-sm text-muted-foreground">3 pending applications</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <MessageSquare className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Flagged Messages</p>
                    <p className="text-sm text-muted-foreground">5 messages to review</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Appointment Issues</p>
                    <p className="text-sm text-muted-foreground">2 reported issues</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">API Status</p>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Operational</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">Database</p>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Operational</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">AI Services</p>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Operational</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">Storage</p>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Operational</span>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">Last updated: Today at 12:45 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
