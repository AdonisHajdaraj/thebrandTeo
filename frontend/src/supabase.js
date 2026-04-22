// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Zëvendëso me vlerat e tua reale nga Supabase Dashboard
const supabaseUrl = 'https://abcdefghijklm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDE1NTc2MDAwfQ.abcdefghijklmnopqrstuvwxyz'

console.log('Supabase initialized with hardcoded URL')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)