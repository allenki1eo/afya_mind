"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, Smartphone, Download, Trash2, Shield, HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      moodReminders: true,
      journalReminders: false,
      therapistUpdates: true,
    },
    privacy: {
      saveDataLocally: true,
      anonymousAnalytics: false,
    },
    language: "english",
    themePreference: "system",
  })

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSettingChange = (category: string, setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  const handleLanguageChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      language: value,
    }))
  }

  const handleThemeChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      themePreference: value,
    }))
    setTheme(value)
  }

  // Avoid rendering with server-side theme to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Customize your AfyaMind experience</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how AfyaMind looks on your device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup
                  value={settings.themePreference}
                  onValueChange={handleThemeChange}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="h-4 w-4 mr-1" /> Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center">
                      <Moon className="h-4 w-4 mr-1" /> Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="swahili">Swahili</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>App Installation</CardTitle>
              <CardDescription>Install AfyaMind on your device for offline access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Install as App</p>
                    <p className="text-sm text-muted-foreground">Add AfyaMind to your home screen</p>
                  </div>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mood-reminders">Mood Tracking Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders to log your mood</p>
                </div>
                <Switch
                  id="mood-reminders"
                  checked={settings.notifications.moodReminders}
                  onCheckedChange={(checked) => handleSettingChange("notifications", "moodReminders", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="journal-reminders">Journal Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders to create journal entries</p>
                </div>
                <Switch
                  id="journal-reminders"
                  checked={settings.notifications.journalReminders}
                  onCheckedChange={(checked) => handleSettingChange("notifications", "journalReminders", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="therapist-updates">Therapist Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about new therapists in your area
                  </p>
                </div>
                <Switch
                  id="therapist-updates"
                  checked={settings.notifications.therapistUpdates}
                  onCheckedChange={(checked) => handleSettingChange("notifications", "therapistUpdates", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage how your data is stored and used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-locally">Save Data Locally</Label>
                  <p className="text-sm text-muted-foreground">Store your data on your device only</p>
                </div>
                <Switch
                  id="save-locally"
                  checked={settings.privacy.saveDataLocally}
                  onCheckedChange={(checked) => handleSettingChange("privacy", "saveDataLocally", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous-analytics">Anonymous Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve AfyaMind with anonymous usage data</p>
                </div>
                <Switch
                  id="anonymous-analytics"
                  checked={settings.privacy.anonymousAnalytics}
                  onCheckedChange={(checked) => handleSettingChange("privacy", "anonymousAnalytics", checked)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="rounded-lg bg-muted p-4 text-sm w-full">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <p className="font-medium">Privacy Commitment</p>
                </div>
                <p className="text-muted-foreground">
                  AfyaMind is committed to protecting your privacy. We don't collect personal information that could
                  identify you. Your preferences and data are stored locally on your device by default.
                </p>
              </div>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All My Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Get help with using AfyaMind</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Frequently Asked Questions</h3>
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Is my data private?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes, your data is stored locally on your device by default. We don't collect personal
                        information that could identify you.
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Can I use AfyaMind offline?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes, AfyaMind is a Progressive Web App (PWA) that can be installed on your device and used
                        offline.
                      </p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Is the AI chat confidential?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes, your conversations with the AI assistant are private and not stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Contact Support</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" />
                  </div>
                  <Button className="w-full">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
