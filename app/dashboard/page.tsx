"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { BarChart, Calendar, Smile, Meh, Frown, ArrowRight, PlusCircle, Sun, Cloud, CloudRain } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { MoodEntry } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { toast } = useToast()
  const [moodValue, setMoodValue] = useState<number[]>([5])
  const [moodNote, setMoodNote] = useState("")
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [timeframe, setTimeframe] = useState("week")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMoodEntries()
  }, [timeframe])

  const fetchMoodEntries = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("Error getting user:", userError)
        // Use mock data if there's an authentication error
        setMoodHistory(getMockMoodData())
        return
      }

      if (userData.user) {
        // Calculate date range based on timeframe
        const now = new Date()
        const startDate = new Date()

        if (timeframe === "week") {
          startDate.setDate(now.getDate() - 7)
        } else if (timeframe === "month") {
          startDate.setMonth(now.getMonth() - 1)
        } else if (timeframe === "year") {
          startDate.setFullYear(now.getFullYear() - 1)
        }

        const { data, error } = await supabase
          .from("mood_entries")
          .select("*")
          .eq("user_id", userData.user.id)
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: false })

        if (error) throw error

        setMoodHistory(data as MoodEntry[])
      } else {
        // No authenticated user, use mock data
        setMoodHistory(getMockMoodData())
      }
    } catch (error) {
      console.error("Error fetching mood entries:", error)
      // If there's an error, use mock data
      setMoodHistory(getMockMoodData())
    }
  }

  const getMockMoodData = (): MoodEntry[] => {
    return [
      { id: "1", user_id: "mock", mood_value: 7, note: "Feeling good today!", created_at: new Date().toISOString() },
      {
        id: "2",
        user_id: "mock",
        mood_value: 5,
        note: "Neutral day",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "3",
        user_id: "mock",
        mood_value: 8,
        note: "Great progress at work",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "4",
        user_id: "mock",
        mood_value: 4,
        note: "Feeling a bit down",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: "5",
        user_id: "mock",
        mood_value: 6,
        note: "Better than yesterday",
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: "6",
        user_id: "mock",
        mood_value: 9,
        note: "Excellent day!",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "7",
        user_id: "mock",
        mood_value: 7,
        note: "Good overall",
        created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
      },
    ]
  }

  const getMoodIcon = (value: number) => {
    if (value >= 7) return <Smile className="h-8 w-8 text-healing-500" />
    if (value >= 4) return <Meh className="h-8 w-8 text-amber-500" />
    return <Frown className="h-8 w-8 text-red-500" />
  }

  const getMoodText = (value: number) => {
    if (value >= 7) return "Good"
    if (value >= 4) return "Neutral"
    return "Low"
  }

  const handleSubmitMood = async () => {
    setLoading(true)
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("Error getting user:", userError)
        toast({
          title: "Authentication Error",
          description: "Please log in to save your mood entry",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (userData.user) {
        const newMood = {
          user_id: userData.user.id,
          mood_value: moodValue[0],
          note: moodNote,
        }

        const { error } = await supabase.from("mood_entries").insert(newMood)

        if (error) throw error

        // Refresh mood entries
        fetchMoodEntries()

        // Reset form
        setMoodNote("")
        setMoodValue([5])

        toast({
          title: "Mood Saved",
          description: "Your mood entry has been recorded",
        })
      } else {
        // No authenticated user
        toast({
          title: "Authentication Required",
          description: "Please log in to save your mood entry",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting mood entry:", error)
      toast({
        title: "Error",
        description: "Failed to save your mood entry",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate average mood
  const averageMood =
    moodHistory.length > 0
      ? (moodHistory.reduce((sum, entry) => sum + entry.mood_value, 0) / moodHistory.length).toFixed(1)
      : "N/A"

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mood Tracker</h1>
          <p className="text-muted-foreground">Track and visualize your mood patterns over time</p>
        </div>
        <Button asChild>
          <a href="/dashboard/chat">
            Talk to AI Assistant
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Current Mood</CardTitle>
            <CardDescription>How are you feeling right now?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pt-2">
              <Frown className="h-5 w-5 text-muted-foreground" />
              <Meh className="h-5 w-5 text-muted-foreground" />
              <Smile className="h-5 w-5 text-muted-foreground" />
            </div>
            <Slider value={moodValue} min={1} max={10} step={1} onValueChange={setMoodValue} className="py-4" />
            <div className="flex items-center justify-center gap-2">
              {getMoodIcon(moodValue[0])}
              <span className="text-xl font-medium">{getMoodText(moodValue[0])}</span>
              <span className="text-muted-foreground">({moodValue[0]}/10)</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood-note">Add a note (optional)</Label>
              <Textarea
                id="mood-note"
                placeholder="What's contributing to your mood today?"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmitMood} className="w-full" disabled={loading}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Log Mood"}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mood History</CardTitle>
                <CardDescription>Track your mood over time</CardDescription>
              </div>
              <Tabs defaultValue="week" value={timeframe} onValueChange={setTimeframe}>
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2 pt-4">
              {moodHistory.slice(0, 7).map((entry, i) => (
                <div key={entry.id} className="flex flex-col items-center gap-2">
                  <div
                    className="bg-primary rounded-t-md w-12"
                    style={{
                      height: `${entry.mood_value * 10}%`,
                      backgroundColor:
                        entry.mood_value >= 7
                          ? "hsl(var(--healing-500))"
                          : entry.mood_value >= 4
                            ? "hsl(var(--amber-500))"
                            : "hsl(var(--destructive))",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mood Insights</CardTitle>
            <CardDescription>Based on your recent entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-healing-100 p-2 rounded-full">
                  <BarChart className="h-5 w-5 text-healing-500" />
                </div>
                <div>
                  <p className="font-medium">Average Mood</p>
                  <p className="text-sm text-muted-foreground">
                    {averageMood}/10 this {timeframe}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-calm-100 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-calm-500" />
                </div>
                <div>
                  <p className="font-medium">Consistency</p>
                  <p className="text-sm text-muted-foreground">
                    {moodHistory.length} entries this {timeframe}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mood Factors</CardTitle>
            <CardDescription>What affects your mood</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sleep</span>
                <div className="w-2/3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-healing-500 h-full rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Exercise</span>
                <div className="w-2/3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-healing-500 h-full rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Social</span>
                <div className="w-2/3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="bg-healing-500 h-full rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Weather Impact</CardTitle>
            <CardDescription>How weather affects your mood</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-amber-500" />
                  <span className="text-sm">Sunny</span>
                </div>
                <span className="text-sm font-medium">+15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-slate-400" />
                  <span className="text-sm">Cloudy</span>
                </div>
                <span className="text-sm font-medium">-5%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-blue-400" />
                  <span className="text-sm">Rainy</span>
                </div>
                <span className="text-sm font-medium">-10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Based on your mood patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-healing-100 p-1 mt-0.5">
                  <Smile className="h-3 w-3 text-healing-500" />
                </div>
                <span>Try a 5-minute mindfulness exercise</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-healing-100 p-1 mt-0.5">
                  <Smile className="h-3 w-3 text-healing-500" />
                </div>
                <span>Schedule a social activity this weekend</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-healing-100 p-1 mt-0.5">
                  <Smile className="h-3 w-3 text-healing-500" />
                </div>
                <span>Consider talking to our AI assistant</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
