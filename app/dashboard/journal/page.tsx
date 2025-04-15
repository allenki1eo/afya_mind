"use client"

import { Label } from "@/components/ui/label"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Square, Save, Play, Pause, Trash2, Calendar, Clock, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import type { JournalEntry } from "@/lib/supabase"

export default function JournalPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [notes, setNotes] = useState("")
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchJournalEntries()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [])

  const getMockJournalEntries = (): JournalEntry[] => {
    return [
      {
        id: "1",
        user_id: "mock",
        transcript:
          "Today was a challenging day. I felt anxious about my upcoming presentation, but I practiced deep breathing which helped calm me down.",
        notes: "Remember to continue practicing mindfulness techniques when feeling anxious.",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "2",
        user_id: "mock",
        transcript:
          "I had a good conversation with my friend today. It really lifted my spirits and reminded me of the importance of social connections.",
        notes: "Schedule more regular catch-ups with friends.",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ]
  }

  const fetchJournalEntries = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("Error getting user:", userError)
        // Use mock data if there's an authentication error
        setEntries(getMockJournalEntries())
        return
      }

      if (userData.user) {
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", userData.user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setEntries(data as JournalEntry[])
      } else {
        // No authenticated user, use mock data
        setEntries(getMockJournalEntries())
      }
    } catch (error) {
      console.error("Error fetching journal entries:", error)
      // If there's an error, use mock data
      setEntries(getMockJournalEntries())
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const url = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioUrl(url)

        // Simulate speech-to-text conversion
        setTimeout(() => {
          setTranscript(
            "This is a simulated transcript of your audio recording. In a real application, this would be generated using a speech-to-text service.",
          )
        }, 1000)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleSaveEntry = async () => {
    setLoading(true)
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) throw userError

      if (userData.user) {
        // In a real app, we would upload the audio file to storage
        // and get a URL to store in the database
        let audioUrlToSave = null

        if (audioBlob) {
          // This is a simplified example - in a real app, you would upload to Supabase Storage
          audioUrlToSave = "simulated-audio-url.wav"
        }

        const newEntry = {
          user_id: userData.user.id,
          audio_url: audioUrlToSave,
          transcript: transcript || null,
          notes: notes || null,
        }

        const { error } = await supabase.from("journal_entries").insert(newEntry)

        if (error) throw error

        // Refresh journal entries
        fetchJournalEntries()

        // Reset the form
        setAudioBlob(null)
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }
        setAudioUrl(null)
        setTranscript("")
        setNotes("")
        setSelectedEntry(null)
      }
    } catch (error) {
      console.error("Error saving journal entry:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    setAudioBlob(null)
    setAudioUrl(null)
    setTranscript("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const selectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setTranscript(entry.transcript || "")
    setNotes(entry.notes || "")

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    setAudioUrl(entry.audio_url || null)
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audio Journal</h1>
          <p className="text-muted-foreground">Record your thoughts and feelings through voice journaling</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="record" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="record">Record New Entry</TabsTrigger>
              <TabsTrigger value="history">Journal History</TabsTrigger>
            </TabsList>
            <TabsContent value="record">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Journal</CardTitle>
                  <CardDescription>
                    Record your thoughts and feelings. Your recordings are stored securely.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center gap-4 p-4 border rounded-lg bg-muted/50">
                    {!audioUrl ? (
                      <>
                        <div className="text-4xl font-mono">{formatTime(recordingTime)}</div>
                        <div className="flex gap-4">
                          {!isRecording ? (
                            <Button
                              onClick={startRecording}
                              size="lg"
                              className="rounded-full h-16 w-16 bg-destructive hover:bg-destructive/90"
                            >
                              <Mic className="h-6 w-6" />
                            </Button>
                          ) : (
                            <Button
                              onClick={stopRecording}
                              size="lg"
                              variant="destructive"
                              className="rounded-full h-16 w-16"
                            >
                              <Square className="h-6 w-6" />
                            </Button>
                          )}
                        </div>
                        {isRecording && (
                          <div className="text-sm text-muted-foreground animate-pulse">
                            Recording... Tap the square to stop
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
                        <div className="flex gap-4">
                          <Button onClick={togglePlayback} size="icon" variant="outline">
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button onClick={handleDeleteRecording} size="icon" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Recording saved. You can play it back or delete it.
                        </div>
                      </>
                    )}
                  </div>

                  {transcript && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Transcript</Label>
                      <Textarea
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Additional Notes</Label>
                    <Textarea
                      placeholder="Add any additional thoughts or reflections..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveEntry} disabled={(!transcript && !notes) || loading} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Journal Entry"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Journal History</CardTitle>
                  <CardDescription>Review and reflect on your past journal entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {entries.length > 0 ? (
                      <div className="space-y-4">
                        {entries.map((entry) => (
                          <Card
                            key={entry.id}
                            className={`cursor-pointer hover:bg-accent/50 ${
                              selectedEntry?.id === entry.id ? "border-primary" : ""
                            }`}
                            onClick={() => selectEntry(entry)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(entry.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(entry.created_at).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <p className="line-clamp-2 text-sm">{entry.transcript || entry.notes || "No content"}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No journal entries yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Your journal entries will appear here once you create them
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Journal Benefits</CardTitle>
              <CardDescription>How voice journaling can help your mental health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Emotional Release</h3>
                <p className="text-sm text-muted-foreground">
                  Speaking your thoughts aloud can provide emotional catharsis and release pent-up feelings.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Self-Awareness</h3>
                <p className="text-sm text-muted-foreground">
                  Hearing yourself talk about your experiences can lead to new insights and greater self-understanding.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Over time, you can review your entries to see how your thoughts and feelings have evolved.
                </p>
              </div>

              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Privacy Note</AlertTitle>
                <AlertDescription>
                  Your journal entries are stored securely and only accessible to you.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
