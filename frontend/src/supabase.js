// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Kontrollo nëse jemi në production (Vercel) apo development (lokal)
const isProd = import.meta.env.PROD

const supabaseUrl = isProd 
  ? '/api/supabase'  // Në Vercel, përdor proxy-n
  : import.meta.env.VITE_SUPABASE_URL  // Lokalisht, përdor direkt

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl) // Për debugging

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})