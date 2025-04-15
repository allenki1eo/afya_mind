"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ArrowRight, ArrowLeft, Upload } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function TherapistOnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    specialties: [] as string[],
    languages: [] as string[],
    location: "",
    bio: "",
    education: "",
    price: "",
    online: true,
    inPerson: true,
    termsAccepted: false,
  })

  const handleChange = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setProfile((prev) => {
      const specialties = [...prev.specialties]
      if (specialties.includes(specialty)) {
        return { ...prev, specialties: specialties.filter((s) => s !== specialty) }
      } else {
        return { ...prev, specialties: [...specialties, specialty] }
      }
    })
  }

  const handleLanguageToggle = (language: string) => {
    setProfile((prev) => {
      const languages = [...prev.languages]
      if (languages.includes(language)) {
        return { ...prev, languages: languages.filter((l) => l !== language) }
      } else {
        return { ...prev, languages: [...languages, language] }
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
    setLoading(true)
    try {
      // Check if user is authenticated
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a therapist profile.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const { error: profileError } = await supabase.from("therapists").insert({
        user_id: user.id,
        name: profile.name,
        title: profile.title,
        specialties: profile.specialties,
        languages: profile.languages,
        location: profile.location,
        bio: profile.bio,
        education: profile.education,
        price: profile.price,
        online: profile.online,
        in_person: profile.inPerson,
        approved: false, // Requires admin approval
      })

      if (profileError) throw profileError

      toast({
        title: "Profile Created",
        description: "Your therapist profile has been submitted for review.",
      })

      router.push("/therapist/dashboard")
    } catch (error) {
      console.error("Error creating therapist profile:", error)
      toast({
        title: "Error",
        description: "Failed to create therapist profile. Please try again.",
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
            <span className="text-sm text-muted-foreground">Therapist Registration</span>
          </div>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Set up your therapist profile to connect with clients</CardDescription>
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Dr. Jane Smith"
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  placeholder="Clinical Psychologist"
                  value={profile.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={profile.location} onValueChange={(value) => handleChange("location", value)}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dar es Salaam">Dar es Salaam</SelectItem>
                    <SelectItem value="Arusha">Arusha</SelectItem>
                    <SelectItem value="Mwanza">Mwanza</SelectItem>
                    <SelectItem value="Dodoma">Dodoma</SelectItem>
                    <SelectItem value="Zanzibar">Zanzibar</SelectItem>
                    <SelectItem value="Mbeya">Mbeya</SelectItem>
                    <SelectItem value="Tanga">Tanga</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Specialties (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Anxiety",
                    "Depression",
                    "Trauma",
                    "PTSD",
                    "Relationships",
                    "Self-esteem",
                    "Grief",
                    "Stress",
                    "Addiction",
                    "Bipolar Disorder",
                    "Eating Disorders",
                    "OCD",
                  ].map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty}
                        checked={profile.specialties.includes(specialty)}
                        onCheckedChange={() => handleSpecialtyToggle(specialty)}
                      />
                      <Label htmlFor={specialty}>{specialty}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Languages</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["English", "Swahili", "Arabic", "French", "Other"].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${language}`}
                        checked={profile.languages.includes(language)}
                        onCheckedChange={() => handleLanguageToggle(language)}
                      />
                      <Label htmlFor={`lang-${language}`}>{language}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Share your approach to therapy and your professional experience..."
                  value={profile.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education & Credentials</Label>
                <Textarea
                  id="education"
                  placeholder="List your degrees, certifications, and professional affiliations..."
                  value={profile.education}
                  onChange={(e) => handleChange("education", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Session Price</Label>
                <Input
                  id="price"
                  placeholder="e.g., TSh 50,000 per session"
                  value={profile.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Session Types</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="online"
                      checked={profile.online}
                      onCheckedChange={(checked) => handleChange("online", checked)}
                    />
                    <Label htmlFor="online">Online Sessions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inPerson"
                      checked={profile.inPerson}
                      onCheckedChange={(checked) => handleChange("inPerson", checked)}
                    />
                    <Label htmlFor="inPerson">In-Person Sessions</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                  <Button variant="outline" size="sm">
                    Select File
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  A professional photo helps build trust with potential clients
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4 text-sm">
                <p className="font-medium mb-2">Verification Process</p>
                <p className="text-muted-foreground">
                  Your profile will be reviewed by our team to verify your credentials before being made visible to
                  users. This typically takes 1-3 business days.
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={profile.termsAccepted}
                  onCheckedChange={(checked) => handleChange("termsAccepted", checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms" className="text-sm font-medium leading-none">
                    I accept the terms and professional guidelines
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    You can read our{" "}
                    <a href="/terms" className="text-primary underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/therapist/guidelines" className="text-primary underline">
                      Professional Guidelines
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
              (step === 1 && (!profile.name || !profile.title || !profile.location)) ||
              (step === 2 && (profile.specialties.length === 0 || profile.languages.length === 0)) ||
              (step === 3 && (!profile.bio || !profile.education || !profile.price)) ||
              (step === 4 && !profile.termsAccepted) ||
              loading
            }
          >
            {step === 4 ? (loading ? "Submitting..." : "Complete Registration") : "Next"}
            {step !== 4 && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
