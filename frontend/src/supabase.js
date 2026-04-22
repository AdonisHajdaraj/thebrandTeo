// src/supabase.js
import { createClient } from '@supabase/supabase-js'

// Zëvendëso me vlerat e tua reale nga Supabase Dashboard
const supabaseUrl = 'https://jscyzysifxtsrhvsapao.supabase.co'
const supabaseAnonKey = 'sb_publishable_nuYKr0Oa32fwnHNO_U13kQ_bt1CMh6f'

console.log('Supabase initialized with hardcoded URL')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)