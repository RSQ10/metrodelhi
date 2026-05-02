import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL     = 'https://icovnritdodgaytnxqly.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb3Zucml0ZG9kZ2F5dG54cWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTg3MzEsImV4cCI6MjA5MjU3NDczMX0.1gjR7e1r16e86BShxt-jtlOJ6CuitouAH1NAkRrrMts'

export const supabase     = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`
