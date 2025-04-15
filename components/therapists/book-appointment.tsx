"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface BookAppointmentProps {
  therapistId: string
  therapistName: string
  offersOnline: boolean
  offersInPerson: boolean
}

export function BookAppointment({ therapistId, therapistName, offersOnline, offersInPerson }: BookAppointmentProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("")
  const [type, setType] = useState<"online" | "in_person">(offersOnline ? "online" : "in_person")
  const [notes, setNotes] = useState("")

  const availableTimes = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to book an appointment",
        variant: "destructive",
      })
      return
    }

    if (!date || !time) {
      toast({
        title: "Error",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Combine date and time
      const [hours, minutes] = time.split(":").map(Number)
      const appointmentDate = new Date(date)
      appointmentDate.setHours(hours, minutes)

      const { error } = await supabase.from("appointments").insert({
        therapist_id: therapistId,
        user_id: user.id,
        appointment_date: appointmentDate.toISOString(),
        status: "pending",
        type,
        notes,
      })

      if (error) throw error

      toast({
        title: "Appointment requested",
        description: `Your appointment request with ${therapistName} has been sent. You'll be notified when it's confirmed.`,
      })

      setOpen(false)
      // Reset form
      setDate(undefined)
      setTime("")
      setNotes("")
    } catch (error: any) {
      console.error("Error booking appointment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Book Consultation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Schedule a consultation with {therapistName}. You'll receive a confirmation once the therapist accepts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Appointment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Appointment Time</Label>
            <div className="grid grid-cols-4 gap-2">
              {availableTimes.map((t) => (
                <Button
                  key={t}
                  variant={time === t ? "default" : "outline"}
                  className="text-center"
                  onClick={() => setTime(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {offersOnline && offersInPerson && (
            <div className="grid gap-2">
              <Label>Appointment Type</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as "online" | "in_person")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online Session</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in_person" id="in_person" />
                  <Label htmlFor="in_person">In-Person Session</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Briefly describe what you'd like to discuss in your session"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
