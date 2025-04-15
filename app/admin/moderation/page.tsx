"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flag, MessageSquare, AlertTriangle, XCircle, Search } from "lucide-react"

interface FlaggedMessage {
  id: string
  messageId: string
  userId: string
  userName: string
  content: string
  reason: string
  status: "pending" | "reviewed" | "dismissed"
  createdAt: string
}

interface ChatRule {
  id: string
  title: string
  description: string
  severity: number
}

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<"flagged" | "rules" | "violations">("flagged")
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([])
  const [chatRules, setChatRules] = useState<ChatRule[]>([])
  const [selectedMessage, setSelectedMessage] = useState<FlaggedMessage | null>(null)
  const [selectedRule, setSelectedRule] = useState<string>("")
  const [actionReason, setActionReason] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (activeTab === "flagged") {
      fetchFlaggedMessages()
    } else if (activeTab === "rules") {
      fetchChatRules()
    }
  }, [activeTab])

  const fetchFlaggedMessages = async () => {
    try {
      // In a real app, you would fetch from the flagged_messages table
      // This is mock data for demonstration
      const mockMessages: FlaggedMessage[] = [
        {
          id: "1",
          messageId: "msg1",
          userId: "user1",
          userName: "Anonymous User",
          content: "This message contains inappropriate content that was flagged by another user.",
          reason: "Inappropriate content",
          status: "pending",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "2",
          messageId: "msg2",
          userId: "user2",
          userName: "User123",
          content: "This message contains potentially harmful advice about mental health treatments.",
          reason: "Harmful advice",
          status: "pending",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "3",
          messageId: "msg3",
          userId: "user3",
          userName: "HealthSeeker",
          content: "This message contains spam or promotional content unrelated to mental health.",
          reason: "Spam",
          status: "pending",
          createdAt: new Date(Date.now() - 10800000).toISOString(),
        },
      ]

      setFlaggedMessages(mockMessages)
    } catch (error) {
      console.error("Error fetching flagged messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChatRules = async () => {
    try {
      // In a real app, you would fetch from the chat_rules table
      // This is mock data for demonstration
      const mockRules: ChatRule[] = [
        {
          id: "1",
          title: "Respectful Communication",
          description:
            "Always communicate respectfully with others. Avoid offensive language, personal attacks, or disrespectful behavior.",
          severity: 1,
        },
        {
          id: "2",
          title: "No Harassment",
          description:
            "Harassment of any kind is not tolerated. This includes threats, intimidation, or persistent unwanted contact.",
          severity: 3,
        },
        {
          id: "3",
          title: "No Harmful Content",
          description: "Do not share content that promotes self-harm, suicide, or harmful behaviors.",
          severity: 3,
        },
        {
          id: "4",
          title: "Privacy Respect",
          description: "Respect the privacy of others. Do not share personal information without consent.",
          severity: 2,
        },
        {
          id: "5",
          title: "No Spam",
          description: "Do not send spam messages or repeatedly post the same content.",
          severity: 1,
        },
      ]

      setChatRules(mockRules)
    } catch (error) {
      console.error("Error fetching chat rules:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewMessage = (message: FlaggedMessage) => {
    setSelectedMessage(message)
    setSelectedRule("")
    setActionReason("")
  }

  const handleTakeAction = async () => {
    if (!selectedMessage || !selectedRule || !actionReason) return

    try {
      // In a real app, you would update the flagged_message status and create a user_violation
      // This is simplified for demonstration

      // Update the flagged message status
      const updatedMessages = flaggedMessages.map((msg) =>
        msg.id === selectedMessage.id ? { ...msg, status: "reviewed" as const } : msg,
      )

      setFlaggedMessages(updatedMessages)
      setSelectedMessage(null)
      setSelectedRule("")
      setActionReason("")

      // Show success message or notification
    } catch (error) {
      console.error("Error taking action:", error)
    }
  }

  const handleDismissMessage = async (message: FlaggedMessage) => {
    try {
      // In a real app, you would update the flagged_message status to dismissed
      // This is simplified for demonstration

      // Update the flagged message status
      const updatedMessages = flaggedMessages.map((msg) =>
        msg.id === message.id ? { ...msg, status: "dismissed" as const } : msg,
      )

      setFlaggedMessages(updatedMessages)

      // Show success message or notification
    } catch (error) {
      console.error("Error dismissing message:", error)
    }
  }

  const filteredMessages = flaggedMessages.filter(
    (message) =>
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
          <p className="text-muted-foreground">Manage flagged content and community guidelines</p>
        </div>
      </div>

      <Tabs defaultValue="flagged" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="flagged">Flagged Messages</TabsTrigger>
          <TabsTrigger value="rules">Community Guidelines</TabsTrigger>
          <TabsTrigger value="violations">User Violations</TabsTrigger>
        </TabsList>

        <TabsContent value="flagged">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Flagged Messages</CardTitle>
                  <CardDescription>Review and take action on reported content</CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search flagged messages..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-8">
                  <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No flagged messages</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? "No messages match your search" : "All messages have been reviewed"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <Card key={message.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback>{message.userName.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{message.userName}</h4>
                                <Badge
                                  variant={
                                    message.status === "pending"
                                      ? "outline"
                                      : message.status === "reviewed"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {message.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">Reason: {message.reason}</p>
                              <div className="mt-2 p-3 bg-muted rounded-md">
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Reported: {new Date(message.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {message.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleDismissMessage(message)}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Dismiss
                              </Button>
                              <Button size="sm" onClick={() => handleReviewMessage(message)}>
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
              <CardDescription>Manage rules and guidelines for the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : chatRules.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No rules defined</h3>
                  <p className="text-sm text-muted-foreground">
                    Create community guidelines to maintain a safe environment
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatRules.map((rule) => (
                    <Card key={rule.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{rule.title}</h4>
                              <Badge
                                variant={
                                  rule.severity === 1 ? "outline" : rule.severity === 2 ? "secondary" : "destructive"
                                }
                              >
                                {rule.severity === 1 ? "Warning" : rule.severity === 2 ? "Suspension" : "Ban"}
                              </Badge>
                            </div>
                            <p className="text-sm mt-2">{rule.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button>Add New Rule</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="violations">
          <Card>
            <CardHeader>
              <CardTitle>User Violations</CardTitle>
              <CardDescription>History of rule violations and actions taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No violations recorded</h3>
                <p className="text-sm text-muted-foreground">
                  Violations will appear here when actions are taken against users
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Flagged Message</DialogTitle>
            <DialogDescription>Take action on this reported content</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">{selectedMessage?.content}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule">Select Violated Rule</Label>
              <Select value={selectedRule} onValueChange={setSelectedRule}>
                <SelectTrigger id="rule">
                  <SelectValue placeholder="Select a rule" />
                </SelectTrigger>
                <SelectContent>
                  {chatRules.map((rule) => (
                    <SelectItem key={rule.id} value={rule.id}>
                      {rule.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="action-reason">Reason for Action</Label>
              <Textarea
                id="action-reason"
                placeholder="Explain why this content violates the selected rule..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMessage(null)}>
              Cancel
            </Button>
            <Button onClick={handleTakeAction} disabled={!selectedRule || !actionReason}>
              Take Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
