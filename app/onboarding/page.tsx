"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, ArrowRight, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    nickname: "",
    ageRange: "",
    primaryConcerns: [] as string[],
    preferredTherapistGender: "",
    preferredLanguage: "Swahili",
    termsAccepted: false,
  })

  const handleChange = (field: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handleConcernToggle = (concern: string) => {
    setPreferences((prev) => {
      const concerns = [...prev.primaryConcerns]
      if (concerns.includes(concern)) {
        return { ...prev, primaryConcerns: concerns.filter((c) => c !== concern) }
      } else {
        return { ...prev, primaryConcerns: [...concerns, concern] }
      }
    })
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to complete onboarding",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Create user profile in Supabase
      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        nickname: preferences.nickname,
        age_range: preferences.ageRange,
        primary_concerns: preferences.primaryConcerns,
        preferred_therapist_gender: preferences.preferredTherapistGender,
        preferred_language: preferences.preferredLanguage,
      })

      if (error) throw error

      toast({
        title: "Profile created",
        description: "Your profile has been set up successfully",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error creating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create your profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Anonymous Onboarding</span>
          </div>
          <CardTitle className="text-2xl">Welcome to AfyaMind</CardTitle>
          <CardDescription>Set up your preferences to personalize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-1/4 h-1 rounded-full mx-1 ${i <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">Choose a Nickname</Label>
                <Input
                  id="nickname"
                  placeholder="Your anonymous nickname"
                  value={preferences.nickname}
                  onChange={(e) => handleChange("nickname", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will be used to address you in the app. No real names required.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Age Range</Label>
                <RadioGroup value={preferences.ageRange} onValueChange={(value) => handleChange("ageRange", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="under18" id="under18" />
                    <Label htmlFor="under18">Under 18</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="18-24" id="18-24" />
                    <Label htmlFor="18-24">18-24</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25-34" id="25-34" />
                    <Label htmlFor="25-34">25-34</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="35-44" id="35-44" />
                    <Label htmlFor="35-44">35-44</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="45+" id="45+" />
                    <Label htmlFor="45+">45+</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Concerns (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Anxiety",
                    "Depression",
                    "Stress",
                    "Sleep Issues",
                    "Relationships",
                    "Self-esteem",
                    "Trauma",
                    "Other",
                  ].map((concern) => (
                    <div key={concern} className="flex items-center space-x-2">
                      <Checkbox
                        id={concern}
                        checked={preferences.primaryConcerns.includes(concern)}
                        onCheckedChange={() => handleConcernToggle(concern)}
                      />
                      <Label htmlFor={concern}>{concern}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Therapist Gender (if matched with one)</Label>
                <RadioGroup
                  value={preferences.preferredTherapistGender}
                  onValueChange={(value) => handleChange("preferredTherapistGender", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-preference" id="no-preference" />
                    <Label htmlFor="no-preference">No Preference</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <RadioGroup
                  value={preferences.preferredLanguage}
                  onValueChange={(value) => handleChange("preferredLanguage", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Swahili" id="swahili" />
                    <Label htmlFor="swahili">Swahili</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="English" id="english" />
                    <Label htmlFor="english">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Both" id="both" />
                    <Label htmlFor="both">Both</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 text-sm">
                <p className="font-medium mb-2">Privacy Commitment</p>
                <p className="text-muted-foreground">
                  AfyaMind is committed to your privacy. We don't collect personal information that could identify you.
                  Your preferences are stored securely and used only to personalize your experience.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={preferences.termsAccepted}
                  onCheckedChange={(checked) => handleChange("termsAccepted", checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms" className="text-sm font-medium leading-none">
                    I accept the terms and privacy policy
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    You can read our{" "}
                    <a href="/terms" className="text-primary underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && (!preferences.nickname || !preferences.ageRange)) ||
              (step === 4 && !preferences.termsAccepted) ||
              loading
            }
          >
            {step === 4 ? (loading ? "Saving..." : "Complete") : "Next"}
            {step !== 4 && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
