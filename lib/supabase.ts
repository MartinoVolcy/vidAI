import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mkkmivwxkteziudydygu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ra21pdnd4a3Rleml1ZHlkeWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NjEyNDcsImV4cCI6MjA1NTMzNzI0N30.VLsnYReCfgZ6k_opDLASuZe3MfDbz3_8XwVVTOGZZ0M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})