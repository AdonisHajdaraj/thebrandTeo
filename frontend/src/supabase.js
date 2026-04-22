// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const isProd = import.meta.env.PROD

// Në production përdor proxy-n e Vercel
const supabaseUrl = isProd 
  ? '/api/supabase'  // Proxy për të shmangur CORS
  : import.meta.env.VITE_SUPABASE_URL  // Direkt për development

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('📍 Mode:', isProd ? 'PRODUCTION (proxy)' : 'DEVELOPMENT (direct)')
console.log('🔗 URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)