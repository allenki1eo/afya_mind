"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Send, User, RefreshCw, ThumbsUp, ThumbsDown, Flag, Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface UserPoints {
  totalPoints: number
  level: number
  streakDays: number
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI mental health assistant. How are you feeling today? Remember, I'm here to listen and support you, but I'm not a replacement for professional help.",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [userPoints, setUserPoints] = useState<UserPoints>({ totalPoints: 0, level: 1, streakDays: 0 })
  const [showRules, setShowRules] = useState(false)
  const [flagDialogOpen, setFlagDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [flagReason, setFlagReason] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    fetchUserPoints()

    // Show chat rules on first visit
    const hasSeenRules = localStorage.getItem("hasSeenChatRules")
    if (!hasSeenRules) {
      setShowRules(true)
      localStorage.setItem("hasSeenChatRules", "true")
    }
  }, [])

  const fetchUserPoints = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("Error getting user:", userError)
        return
      }

      if (userData.user) {
        // In a real app, you would fetch from the user_points table
        // This is mock data for demonstration
        setUserPoints({
          totalPoints: 120,
          level: 2,
          streakDays: 3,
        })
      }
    } catch (error) {
      console.error("Error fetching user points:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Create the prompt with conversation history
      const conversationHistory = messages
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")

      const prompt = `${conversationHistory}\nUser: ${input}\nAssistant:`

      // Use Together AI's Llama 4 model
      const response = await fetch("https://api.together.xyz/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer a5a3e3fe469ea23c9ee61bd32a89a6eb6073f6d8bc1632d70cc3447c1b2754b9`,
        },
        body: JSON.stringify({
          model: "Llama-4-Maverick-Instruct-17B-128E",
          prompt,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          stop: ["User:", "\n\n"],
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.choices[0].text.trim()

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Award points for chat interaction
      updateUserPoints(10, "Engaged in a helpful conversation")
    } catch (error) {
      console.error("Error generating AI response:", error)

      // Add fallback message if AI fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const updateUserPoints = async (points: number, description: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("Error getting user:", userError)
        return
      }

      if (userData.user) {
        // In a real app, you would update the user_points table and create a point_activities record
        // This is simplified for demonstration
        setUserPoints((prev) => ({
          ...prev,
          totalPoints: prev.totalPoints + points,
        }))

        // Show toast notification
        toast({
          title: `+${points} points!`,
          description: description,
        })

        // Check for level up
        const newLevel = Math.floor((userPoints.totalPoints + points) / 100) + 1
        if (newLevel > userPoints.level) {
          toast({
            title: "Level Up!",
            description: `Congratulations! You've reached level ${newLevel}`,
            variant: "default",
          })

          setUserPoints((prev) => ({
            ...prev,
            level: newLevel,
          }))
        }
      }
    } catch (error) {
      console.error("Error updating user points:", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    // In a real app, you would store feedback in the database
    toast({
      title: "Feedback Received",
      description: `Thank you for your ${isPositive ? "positive" : "negative"} feedback!`,
    })

    // Award points for providing feedback
    if (isPositive) {
      updateUserPoints(5, "Provided helpful feedback")
    }
  }

  const handleFlagMessage = (message: Message) => {
    setSelectedMessage(message)
    setFlagDialogOpen(true)
  }

  const submitFlaggedMessage = async () => {
    if (!selectedMessage || !flagReason) return

    try {
      // In a real app, you would create a record in the flagged_messages table
      // This is simplified for demonstration

      toast({
        title: "Message Reported",
        description: "Thank you for helping keep our community safe. Our team will review this message.",
      })

      setFlagDialogOpen(false)
      setSelectedMessage(null)
      setFlagReason("")
    } catch (error) {
      console.error("Error flagging message:", error)
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Chat Assistant</h1>
          <p className="text-muted-foreground">Talk to our empathetic AI assistant about how you're feeling</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                Level {userPoints.level}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <Zap className="h-3 w-3 mr-1" />
                {userPoints.streakDays} day streak
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{userPoints.totalPoints} points</span>
              <Progress value={userPoints.totalPoints % 100} max={100} className="w-24 h-2" />
            </div>
          </div>
          <Button variant="outline" onClick={() => setMessages([messages[0]])}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>Your conversation is private and not stored on our servers</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowRules(true)}>
              Community Guidelines
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar>
                      {message.role === "assistant" ? (
                        <>
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        </>
                      ) : (
                        <AvatarFallback className="bg-muted">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <time className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                        {message.role === "assistant" && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleFeedback(message.id, true)}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="sr-only">Helpful</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleFeedback(message.id, false)}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              <span className="sr-only">Not helpful</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleFlagMessage(message)}
                            >
                              <Flag className="h-3 w-3" />
                              <span className="sr-only">Flag</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="flex gap-1">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                          ●
                        </span>
                        <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                          ●
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-10 flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Community Guidelines Dialog */}
      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Community Guidelines</DialogTitle>
            <DialogDescription>
              Please follow these guidelines to ensure a safe and supportive environment for everyone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Badge variant="outline">Rule 1</Badge>
                Respectful Communication
              </h3>
              <p className="text-sm text-muted-foreground">
                Always communicate respectfully with others. Avoid offensive language, personal attacks, or
                disrespectful behavior.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Badge variant="outline">Rule 2</Badge>
                No Harassment
              </h3>
              <p className="text-sm text-muted-foreground">
                Harassment of any kind is not tolerated. This includes threats, intimidation, or persistent unwanted
                contact.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Badge variant="outline">Rule 3</Badge>
                No Harmful Content
              </h3>
              <p className="text-sm text-muted-foreground">
                Do not share content that promotes self-harm, suicide, or harmful behaviors.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Badge variant="outline">Rule 4</Badge>
                Privacy Respect
              </h3>
              <p className="text-sm text-muted-foreground">
                Respect the privacy of others. Do not share personal information without consent.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Badge variant="outline">Rule 5</Badge>
                No Spam
              </h3>
              <p className="text-sm text-muted-foreground">
                Do not send spam messages or repeatedly post the same content.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md mt-4">
              <p className="text-sm font-medium">Violation Consequences</p>
              <p className="text-xs text-muted-foreground mt-1">
                Violations of these guidelines may result in warnings, temporary suspension, or permanent ban from the
                platform, depending on the severity and frequency of the violations.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowRules(false)}>I Understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Message Dialog */}
      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Message</DialogTitle>
            <DialogDescription>
              Help us maintain a safe environment by reporting inappropriate content
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedMessage && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{selectedMessage.content}</p>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="flag-reason">Reason for Reporting</Label>
              <Select value={flagReason} onValueChange={setFlagReason}>
                <SelectTrigger id="flag-reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                  <SelectItem value="harmful">Harmful Advice</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitFlaggedMessage} disabled={!flagReason}>
              Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Achievement Notification */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {/* Achievement notifications would appear here */}
      </div>
    </div>
  )
}
