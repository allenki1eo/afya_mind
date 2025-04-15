"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle } from "lucide-react"
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
  user_nickname: string
}

export default function AppointmentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"upcoming" | "pending" | "past">("upcoming")

  useEffect(() => {
    if (user) {
      fetchAppointments()
    }
  }, [user, activeTab])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      // First get the therapist ID for the current user
      const { data: therapistData, error: therapistError } = await supabase
        .from("therapists")
        .select("id")
        .eq("user_id", user?.id)
        .single()

      if (therapistError) throw therapistError

      if (!therapistData) {
        setLoading(false)
        return
      }

      // Now fetch appointments for this therapist
      let query = supabase
        .from("appointments")
        .select(`
          *,
          user_nickname:profiles(nickname)
        `)
        .eq("therapist_id", therapistData.id)

      // Filter based on active tab
      const now = new Date().toISOString()

      if (activeTab === "upcoming") {
        query = query
          .gte("appointment_date", now)
          .in("status", ["confirmed"])
          .order("appointment_date", { ascending: true })
      } else if (activeTab === "pending") {
        query = query.eq("status", "pending").order("created_at", { ascending: false })
      } else if (activeTab === "past") {
        query = query
          .or(`status.eq.completed,status.eq.cancelled,and(status.eq.confirmed,appointment_date.lt.${now})`)
          .order("appointment_date", { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      // Transform the data to get the nickname from the nested object
      const formattedAppointments = data.map((appointment) => ({
        ...appointment,
        user_nickname: appointment.user_nickname?.nickname || "Anonymous User",
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

  const updateAppointmentStatus = async (appointmentId: string, status: "confirmed" | "cancelled" | "completed") => {
    try {
      const { error } = await supabase.from("appointments").update({ status }).eq("id", appointmentId)

      if (error) throw error

      toast({
        title: "Status updated",
        description: `Appointment ${status} successfully`,
      })

      // Refresh appointments
      fetchAppointments()
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast({
        title: "Error",
        description: "Failed to update appointment status",
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
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage your client appointments</p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>

        {["upcoming", "pending", "past"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {tab === "upcoming"
                    ? "Upcoming Appointments"
                    : tab === "pending"
                      ? "Pending Appointment Requests"
                      : "Past Appointments"}
                </CardTitle>
                <CardDescription>
                  {tab === "upcoming"
                    ? "Your confirmed upcoming appointments"
                    : tab === "pending"
                      ? "Appointment requests awaiting your confirmation"
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarFallback>{appointment.user_nickname.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{appointment.user_nickname}</h4>
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
                              {appointment.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Decline
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Confirm
                                  </Button>
                                </div>
                              )}
                              {appointment.status === "confirmed" &&
                                new Date(appointment.appointment_date) < new Date() && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                                  >
                                    Mark as Completed
                                  </Button>
                                )}
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
