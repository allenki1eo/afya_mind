"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, MapPin, Phone, Mail, Star, Filter, Languages } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Therapist } from "@/lib/supabase"
import { BookAppointment } from "@/components/therapists/book-appointment"

export default function TherapistsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [sessionType, setSessionType] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTherapists()
  }, [])

  useEffect(() => {
    filterTherapists()
  }, [searchTerm, selectedSpecialties, selectedLanguages, sessionType, therapists])

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase.from("therapists").select("*").eq("approved", true)

      if (error) throw error

      setTherapists(data as Therapist[])
    } catch (error) {
      console.error("Error fetching therapists:", error)
      // If there's an error, use mock data
      setTherapists([
        {
          id: "1",
          user_id: "mock1",
          name: "Dr. Sarah Mwangi",
          title: "Clinical Psychologist",
          specialties: ["Anxiety", "Depression", "Trauma"],
          languages: ["English", "Swahili"],
          location: "Dar es Salaam",
          bio: "Dr. Mwangi specializes in cognitive behavioral therapy with over 10 years of experience helping clients overcome anxiety and depression.",
          education: "Ph.D. in Clinical Psychology, University of Nairobi",
          price: "TSh 50,000 per session",
          online: true,
          in_person: true,
          rating: 4.8,
          reviews: 24,
          created_at: new Date().toISOString(),
          approved: true,
        },
        {
          id: "2",
          user_id: "mock2",
          name: "Dr. James Omondi",
          title: "Psychiatrist",
          specialties: ["Bipolar Disorder", "Anxiety", "PTSD"],
          languages: ["English", "Swahili"],
          location: "Arusha",
          bio: "Dr. Omondi is a board-certified psychiatrist who combines medication management with therapeutic approaches for comprehensive care.",
          education: "M.D., Muhimbili University of Health and Allied Sciences",
          price: "TSh 65,000 per session",
          online: true,
          in_person: true,
          rating: 4.6,
          reviews: 18,
          created_at: new Date().toISOString(),
          approved: true,
        },
        {
          id: "3",
          user_id: "mock3",
          name: "Fatima Hassan",
          title: "Licensed Counselor",
          specialties: ["Relationships", "Self-esteem", "Stress"],
          languages: ["Swahili", "English", "Arabic"],
          location: "Mwanza",
          bio: "Fatima creates a warm, supportive environment where clients can explore their challenges and develop practical coping strategies.",
          education: "M.A. in Counseling Psychology, University of Dar es Salaam",
          price: "TSh 40,000 per session",
          online: true,
          in_person: false,
          rating: 4.9,
          reviews: 32,
          created_at: new Date().toISOString(),
          approved: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filterTherapists = () => {
    let filtered = [...therapists]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (therapist) =>
          therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          therapist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          therapist.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          therapist.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by specialties
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter((therapist) =>
        therapist.specialties.some((specialty) => selectedSpecialties.includes(specialty)),
      )
    }

    // Filter by languages
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter((therapist) =>
        therapist.languages.some((language) => selectedLanguages.includes(language)),
      )
    }

    // Filter by session type
    if (sessionType === "online") {
      filtered = filtered.filter((therapist) => therapist.online)
    } else if (sessionType === "inPerson") {
      filtered = filtered.filter((therapist) => therapist.in_person)
    }

    setFilteredTherapists(filtered)
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    )
  }

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const allSpecialties = Array.from(new Set(therapists.flatMap((therapist) => therapist.specialties)))

  const allLanguages = Array.from(new Set(therapists.flatMap((therapist) => therapist.languages)))

  if (loading) {
    return (
      <div className="container py-6 flex items-center justify-center">
        <p>Loading therapists...</p>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find a Therapist</h1>
          <p className="text-muted-foreground">Connect with mental health professionals in Tanzania</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find the right therapist for your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, specialty, or location"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </span>
                {(selectedSpecialties.length > 0 || selectedLanguages.length > 0 || sessionType !== "all") && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedSpecialties.length + selectedLanguages.length + (sessionType !== "all" ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              {showFilters && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Session Type</Label>
                    <Select value={sessionType} onValueChange={setSessionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All session types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All session types</SelectItem>
                        <SelectItem value="online">Online only</SelectItem>
                        <SelectItem value="inPerson">In-person only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Specialties</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {allSpecialties.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox
                            id={`specialty-${specialty}`}
                            checked={selectedSpecialties.includes(specialty)}
                            onCheckedChange={() => handleSpecialtyToggle(specialty)}
                          />
                          <Label htmlFor={`specialty-${specialty}`} className="text-sm">
                            {specialty}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Languages</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {allLanguages.map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={`language-${language}`}
                            checked={selectedLanguages.includes(language)}
                            onCheckedChange={() => handleLanguageToggle(language)}
                          />
                          <Label htmlFor={`language-${language}`} className="text-sm">
                            {language}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedSpecialties([])
                      setSelectedLanguages([])
                      setSessionType("all")
                      setSearchTerm("")
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>Guidance on finding the right therapist</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">How to Choose</h3>
                <p className="text-sm text-muted-foreground">
                  Look for therapists who specialize in your specific concerns and with whom you feel comfortable.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Questions to Ask</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                  <li>What approach do you use in therapy?</li>
                  <li>How many sessions might I need?</li>
                  <li>What are your payment options?</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="/dashboard/chat">Get Personalized Recommendations</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="list">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="details" disabled={!selectedTherapist}>
                Therapist Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="space-y-4">
                {filteredTherapists.length > 0 ? (
                  filteredTherapists.map((therapist) => (
                    <Card key={therapist.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/3 p-4 flex flex-col items-center justify-center bg-muted/30">
                            <Avatar className="h-24 w-24 mb-2">
                              <AvatarImage src={therapist.image_url || "/placeholder.svg"} alt={therapist.name} />
                              <AvatarFallback>{therapist.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                              <h3 className="font-bold">{therapist.name}</h3>
                              <p className="text-sm text-muted-foreground">{therapist.title}</p>
                              <div className="flex items-center justify-center mt-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm ml-1">{therapist.rating}</span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({therapist.reviews} reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="sm:w-2/3 p-4">
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-1">
                                {therapist.specialties.map((specialty) => (
                                  <Badge key={specialty} variant="outline">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{therapist.location}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Languages className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{therapist.languages.join(", ")}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {therapist.online && <Badge variant="secondary">Online Sessions</Badge>}
                                {therapist.in_person && <Badge variant="secondary">In-Person</Badge>}
                              </div>
                              <div className="pt-2">
                                <Button
                                  onClick={() => setSelectedTherapist(therapist)}
                                  variant="outline"
                                  className="mr-2"
                                >
                                  View Profile
                                </Button>
                                <BookAppointment
                                  therapistId={therapist.id}
                                  therapistName={therapist.name}
                                  offersOnline={therapist.online}
                                  offersInPerson={therapist.in_person}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Search className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No therapists found</h3>
                      <p className="text-sm text-muted-foreground text-center mt-1">
                        Try adjusting your filters or search terms
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSelectedSpecialties([])
                          setSelectedLanguages([])
                          setSessionType("all")
                          setSearchTerm("")
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            <TabsContent value="details">
              {selectedTherapist && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 flex flex-col items-center">
                        <Avatar className="h-32 w-32 mb-4">
                          <AvatarImage
                            src={selectedTherapist.image_url || "/placeholder.svg"}
                            alt={selectedTherapist.name}
                          />
                          <AvatarFallback>{selectedTherapist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-bold text-center">{selectedTherapist.name}</h2>
                        <p className="text-muted-foreground text-center">{selectedTherapist.title}</p>
                        <div className="flex items-center justify-center mt-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1">{selectedTherapist.rating}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({selectedTherapist.reviews} reviews)
                          </span>
                        </div>
                        <div className="w-full mt-6 space-y-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{selectedTherapist.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>+255 123 456 789</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{selectedTherapist.name.toLowerCase().replace(" ", ".")}@example.com</span>
                          </div>
                        </div>
                        <div className="w-full mt-6">
                          <Button className="w-full">Book Consultation</Button>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">About</h3>
                            <p className="text-muted-foreground">{selectedTherapist.bio}</p>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-medium mb-2">Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedTherapist.specialties.map((specialty) => (
                                <Badge key={specialty}>{specialty}</Badge>
                              ))}
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-medium mb-2">Education</h3>
                            <p className="text-muted-foreground">{selectedTherapist.education}</p>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-medium mb-2">Languages</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedTherapist.languages.map((language) => (
                                <Badge key={language} variant="outline">
                                  {language}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="text-lg font-medium mb-2">Session Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium">Price</h4>
                                <p className="text-muted-foreground">{selectedTherapist.price}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Session Types</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {selectedTherapist.online && <Badge variant="secondary">Online</Badge>}
                                  {selectedTherapist.in_person && <Badge variant="secondary">In-Person</Badge>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setSelectedTherapist(null)}>
                      Back to List
                    </Button>
                    <BookAppointment
                      therapistId={selectedTherapist.id}
                      therapistName={selectedTherapist.name}
                      offersOnline={selectedTherapist.online}
                      offersInPerson={selectedTherapist.in_person}
                    />
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
