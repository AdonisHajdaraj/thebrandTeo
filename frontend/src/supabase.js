// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Merr nga environment variables (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug (shiko në console në production)
console.log("SUPABASE URL:", supabaseUrl)
console.log("SUPABASE KEY:", supabaseAnonKey ? "EXISTS" : "MISSING")

// Krijo client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)