// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Merr URL-në nga environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Kontrollo nëse ekzistojnë
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL mungon!')
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY mungon!')
}

// Krijo client-in
export const supabase = createClient(supabaseUrl, supabaseAnonKey)