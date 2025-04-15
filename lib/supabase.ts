import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Profile = {
  id: string
  nickname: string
  age_range: string
  primary_concerns: string[]
  preferred_therapist_gender: string
  preferred_language: string
  created_at: string
}

export type MoodEntry = {
  id: string
  user_id: string
  mood_value: number
  note: string
  created_at: string
}

export type JournalEntry = {
  id: string
  user_id: string
  audio_url?: string
  transcript?: string
  notes?: string
  created_at: string
}

export type Therapist = {
  id: string
  user_id: string
  name: string
  title: string
  specialties: string[]
  languages: string[]
  location: string
  bio: string
  education: string
  price: string
  online: boolean
  in_person: boolean
  rating: number
  reviews: number
  image_url?: string
  created_at: string
  approved: boolean
}
