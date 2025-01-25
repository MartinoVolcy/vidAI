import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://daahfumzmdnfxbahesie.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhYWhmdW16bWRuZnhiYWhlc2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MTMyMzcsImV4cCI6MjA1MTE4OTIzN30.1bq78hujxhYkqbRbF8W4H-lC4ju4Lo9z7igrElAq4f8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})