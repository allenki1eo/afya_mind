"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, Users, MessageSquare, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Therapist } from "@/lib/supabase"

export default function TherapistDashboardPage() {
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingRequests: 0,
    upcomingSessions: 0,
  })

  useEffect(() => {
    async function loadTherapistProfile() {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) throw userError

        if (userData.user) {
          const { data, error } = await supabase.from("therapists").select("*").eq("user_id", userData.user.id).single()

          if (error) throw error

          setTherapist(data as Therapist)

          // In a real app, we would fetch these stats from the database
          setStats({
            totalClients: 12,
            pendingRequests: 3,
            upcomingSessions: 5,
          })
        }
      } catch (error) {
        console.error("Error loading therapist profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTherapistProfile()
  }, [])

  if (loading) {
    return (
      <div className="container py-6 flex items-center justify-center min-h-screen">
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  if (!therapist) {
    return (
      <div className="container py-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>We couldn't find your therapist profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please complete your registration to access the therapist dashboard.</p>
            <Button asChild>
              <a href="/therapist/onboarding">Complete Registration</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Therapist Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile, clients, and appointments</p>
        </div>
        <Badge variant={therapist.approved ? "default" : "outline"} className="px-3 py-1">
          {therapist.approved ? "Approved" : "Pending Approval"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Clients</CardTitle>
            <CardDescription>Active clients under your care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-4" />
              <span className="text-3xl font-bold">{stats.totalClients}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>Client requests awaiting response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-primary mr-4" />
              <span className="text-3xl font-bold">{stats.pendingRequests}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Sessions scheduled in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary mr-4" />
              <span className="text-3xl font-bold">{stats.upcomingSessions}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="requests">Client Requests</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled sessions for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {!therapist.approved ? (
                  <div className="flex items-center p-4 bg-muted rounded-lg">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mr-2" />
                    <p>Your profile is pending approval. You'll be able to schedule sessions once approved.</p>
                  </div>
                ) : stats.upcomingSessions === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No upcoming sessions</h3>
                    <p className="text-muted-foreground">You don't have any sessions scheduled for the next 7 days.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mock upcoming sessions */}
                    {[...Array(stats.upcomingSessions)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">Client {String.fromCharCode(65 + i)}</h4>
                                <p className="text-sm text-muted-foreground">Initial Consultation</p>
                                <div className="flex items-center mt-1 text-sm">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>
                                    {new Date(Date.now() + i * 86400000).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                  <Clock className="h-3 w-3 ml-3 mr-1" />
                                  <span>
                                    {new Date(new Date().setHours(9 + i, 0, 0, 0)).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Reschedule
                              </Button>
                              <Button size="sm">Join</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Client Requests</CardTitle>
                <CardDescription>Pending consultation requests from potential clients</CardDescription>
              </CardHeader>
              <CardContent>
                {!therapist.approved ? (
                  <div className="flex items-center p-4 bg-muted rounded-lg">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mr-2" />
                    <p>Your profile is pending approval. You'll receive client requests once approved.</p>
                  </div>
                ) : stats.pendingRequests === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No pending requests</h3>
                    <p className="text-muted-foreground">You don't have any client requests at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mock client requests */}
                    {[...Array(stats.pendingRequests)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback>{String.fromCharCode(75 + i)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">Client {String.fromCharCode(75 + i)}</h4>
                                <p className="text-sm text-muted-foreground">Requesting initial consultation</p>
                                <div className="flex items-center mt-1 text-sm">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {new Date(Date.now() - i * 3600000).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <XCircle className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                              <Button size="sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>View and edit your therapist profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarFallback className="text-2xl">{therapist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold text-center">{therapist.name}</h2>
                    <p className="text-muted-foreground text-center">{therapist.title}</p>
                    <Button variant="outline" className="mt-4 w-full">
                      Edit Profile
                    </Button>
                  </div>
                  <div className="md:w-2/3">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">About</h3>
                        <p className="text-muted-foreground">{therapist.bio}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {therapist.specialties.map((specialty) => (
                            <Badge key={specialty}>{specialty}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {therapist.languages.map((language) => (
                            <Badge key={language} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Education</h3>
                        <p className="text-muted-foreground">{therapist.education}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Session Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium">Price</h4>
                            <p className="text-muted-foreground">{therapist.price}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Session Types</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {therapist.online && <Badge variant="secondary">Online</Badge>}
                              {therapist.in_person && <Badge variant="secondary">In-Person</Badge>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
