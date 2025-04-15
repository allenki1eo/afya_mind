"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Calendar, Zap, Trophy, Star, BookOpen, BarChart, MessageSquare, Users } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Achievement {
  id: string
  name: string
  description: string
  points: number
  iconName: string
  achieved: boolean
  achievedAt?: string
}

interface UserPoints {
  totalPoints: number
  level: number
  streakDays: number
  lastActivityDate: string
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userPoints, setUserPoints] = useState<UserPoints>({
    totalPoints: 0,
    level: 1,
    streakDays: 0,
    lastActivityDate: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("Error getting user:", userError)
        // Use mock data if there's an authentication error
        setMockData()
        return
      }

      if (userData.user) {
        // In a real app, you would fetch from the user_points, user_achievements, and achievements tables
        // This is mock data for demonstration
        setMockData()
      } else {
        // No authenticated user, use mock data
        setMockData()
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      // If there's an error, use mock data
      setMockData()
    } finally {
      setLoading(false)
    }
  }

  const setMockData = () => {
    // Mock user points
    setUserPoints({
      totalPoints: 320,
      level: 4,
      streakDays: 7,
      lastActivityDate: new Date().toISOString(),
    })

    // Mock achievements
    setAchievements([
      {
        id: "1",
        name: "First Steps",
        description: "Complete your profile and first mood entry",
        points: 50,
        iconName: "award",
        achieved: true,
        achievedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
      {
        id: "2",
        name: "Consistent Tracker",
        description: "Log your mood for 7 consecutive days",
        points: 100,
        iconName: "calendar",
        achieved: true,
        achievedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: "3",
        name: "Journal Master",
        description: "Create 10 journal entries",
        points: 150,
        iconName: "book",
        achieved: false,
      },
      {
        id: "4",
        name: "Mindfulness Explorer",
        description: "Complete 5 chat sessions with the AI assistant",
        points: 100,
        iconName: "brain",
        achieved: true,
        achievedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: "5",
        name: "Connection Seeker",
        description: "Book your first appointment with a therapist",
        points: 200,
        iconName: "users",
        achieved: false,
      },
      {
        id: "6",
        name: "Feedback Provider",
        description: "Leave a review for a therapist",
        points: 75,
        iconName: "message-square",
        achieved: false,
      },
      {
        id: "7",
        name: "Streak Champion",
        description: "Maintain a 30-day streak of app usage",
        points: 300,
        iconName: "zap",
        achieved: false,
      },
      {
        id: "8",
        name: "Reflection Pro",
        description: "Complete 30 journal entries",
        points: 250,
        iconName: "pen-tool",
        achieved: false,
      },
      {
        id: "9",
        name: "Mood Analyst",
        description: "Track your mood for 30 days total",
        points: 200,
        iconName: "bar-chart",
        achieved: false,
      },
    ])
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "award":
        return <Award className="h-6 w-6 text-primary" />
      case "calendar":
        return <Calendar className="h-6 w-6 text-primary" />
      case "book":
        return <BookOpen className="h-6 w-6 text-primary" />
      case "brain":
        return <MessageSquare className="h-6 w-6 text-primary" />
      case "users":
        return <Users className="h-6 w-6 text-primary" />
      case "message-square":
        return <MessageSquare className="h-6 w-6 text-primary" />
      case "zap":
        return <Zap className="h-6 w-6 text-primary" />
      case "pen-tool":
        return <BookOpen className="h-6 w-6 text-primary" />
      case "bar-chart":
        return <BarChart className="h-6 w-6 text-primary" />
      default:
        return <Star className="h-6 w-6 text-primary" />
    }
  }

  const achievedAchievements = achievements.filter((achievement) => achievement.achieved)
  const pendingAchievements = achievements.filter((achievement) => !achievement.achieved)

  if (loading) {
    return (
      <div className="container py-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements & Progress</h1>
          <p className="text-muted-foreground">Track your mental health journey and earn rewards</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Your mental health journey stats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Level {userPoints.level}</h3>
                <span className="text-sm text-muted-foreground">
                  {userPoints.totalPoints} / {userPoints.level * 100} points
                </span>
              </div>
              <Progress value={userPoints.totalPoints % 100} max={100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {100 - (userPoints.totalPoints % 100)} points until level {userPoints.level + 1}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Current Streak</h3>
                <Badge variant="secondary" className="font-normal">
                  <Zap className="h-3 w-3 mr-1" />
                  {userPoints.streakDays} days
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${i < userPoints.streakDays ? "bg-primary" : "bg-muted"}`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {userPoints.streakDays >= 7
                  ? "You've completed a full week streak!"
                  : `${7 - userPoints.streakDays} more days for a full week streak`}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Achievements Unlocked</h3>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm">
                      {achievedAchievements.length} / {achievements.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((achievedAchievements.length / achievements.length) * 100)}%
                    </span>
                  </div>
                  <Progress value={(achievedAchievements.length / achievements.length) * 100} className="h-2 mt-1" />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-medium flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" />
                Why Achievements Matter
              </h3>
              <p className="text-sm text-muted-foreground">
                Tracking your progress helps build consistency in your mental health journey. Regular engagement with
                mental health tools has been shown to improve outcomes and wellbeing.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Milestones in your mental health journey</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
                <TabsTrigger value="locked">Locked</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`overflow-hidden ${achievement.achieved ? "border-primary/50" : "opacity-70"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${achievement.achieved ? "bg-primary/10" : "bg-muted"}`}>
                          {getIconComponent(achievement.iconName)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{achievement.name}</h3>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                            <Badge variant={achievement.achieved ? "default" : "outline"}>
                              {achievement.achieved ? "Unlocked" : `+${achievement.points} pts`}
                            </Badge>
                          </div>
                          {achievement.achieved && achievement.achievedAt && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Achieved on {new Date(achievement.achievedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="unlocked" className="space-y-4">
                {achievedAchievements.length > 0 ? (
                  achievedAchievements.map((achievement) => (
                    <Card key={achievement.id} className="overflow-hidden border-primary/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-full bg-primary/10">{getIconComponent(achievement.iconName)}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{achievement.name}</h3>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              </div>
                              <Badge variant="default">Unlocked</Badge>
                            </div>
                            {achievement.achievedAt && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Achieved on {new Date(achievement.achievedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No achievements unlocked yet</h3>
                    <p className="text-sm text-muted-foreground">Keep using the app to earn your first achievement</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="locked" className="space-y-4">
                {pendingAchievements.length > 0 ? (
                  pendingAchievements.map((achievement) => (
                    <Card key={achievement.id} className="overflow-hidden opacity-70">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-full bg-muted">{getIconComponent(achievement.iconName)}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{achievement.name}</h3>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              </div>
                              <Badge variant="outline">+{achievement.points} pts</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">All achievements unlocked!</h3>
                    <p className="text-sm text-muted-foreground">
                      Congratulations! You've unlocked all available achievements
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
