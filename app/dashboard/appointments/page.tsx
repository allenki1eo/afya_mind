"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MapPin, Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: string
  user_id: string
  therapist_id: string
  appointment_date: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  type: "online" | "in_person"
  notes?: string
  created_at: string
  therapist_name: string
}

export default function UserAppointmentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")

  useEffect(() => {
    if (user) {
      fetchAppointments()
    }
  }, [user, activeTab])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      // Fetch appointments for this user
      let query = supabase
        .from("appointments")
        .select(`
          *,
          therapist_name:therapists(name)
        `)
        .eq("user_id", user?.id)

      // Filter based on active tab
      const now = new Date().toISOString()

      if (activeTab === "upcoming") {
        query = query
          .or(`status.eq.pending,and(status.eq.confirmed,appointment_date.gte.${now})`)
          .order("appointment_date", { ascending: true })
      } else if (activeTab === "past") {
        query = query
          .or(`status.eq.completed,status.eq.cancelled,and(status.eq.confirmed,appointment_date.lt.${now})`)
          .order("appointment_date", { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      // Transform the data to get the therapist name from the nested object
      const formattedAppointments = data.map((appointment) => ({
        ...appointment,
        therapist_name: appointment.therapist_name?.name || "Unknown Therapist",
      }))

      setAppointments(formattedAppointments)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", appointmentId)

      if (error) throw error

      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully",
      })

      // Refresh appointments
      fetchAppointments()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-muted-foreground">View and manage your therapy appointments</p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>

        {["upcoming", "past"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>{tab === "upcoming" ? "Upcoming Appointments" : "Past Appointments"}</CardTitle>
                <CardDescription>
                  {tab === "upcoming"
                    ? "Your scheduled and pending appointments"
                    : "Your past and completed appointments"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No appointments found</p>
                    {tab === "upcoming" && (
                      <Button className="mt-4" asChild>
                        <a href="/dashboard/therapists">Find a Therapist</a>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback>{appointment.therapist_name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{appointment.therapist_name}</h4>
                                <div className="flex items-center mt-1 text-sm">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>
                                    {new Date(appointment.appointment_date).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                  <Clock className="h-3 w-3 ml-3 mr-1" />
                                  <span>
                                    {new Date(appointment.appointment_date).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center mt-1 text-sm">
                                  {appointment.type === "online" ? (
                                    <>
                                      <Video className="h-3 w-3 mr-1" />
                                      <span>Online Session</span>
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span>In-Person Session</span>
                                    </>
                                  )}
                                </div>
                                {appointment.notes && (
                                  <p className="text-sm text-muted-foreground mt-2">{appointment.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-end">{getStatusBadge(appointment.status)}</div>
                              {appointment.status === "pending" || appointment.status === "confirmed" ? (
                                <Button size="sm" variant="outline" onClick={() => cancelAppointment(appointment.id)}>
                                  Cancel Appointment
                                </Button>
                              ) : appointment.status === "completed" ? (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={`/dashboard/reviews/new?therapistId=${appointment.therapist_id}`}>
                                    <Star className="h-4 w-4 mr-1" />
                                    Leave Review
                                  </a>
                                </Button>
                              ) : null}
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
        ))}
      </Tabs>
    </div>
  )
}
