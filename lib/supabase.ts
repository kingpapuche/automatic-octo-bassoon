import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
export const supabase = createClient(
  'https://yvkcledlmlkaxwacofkb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2a2NsZWRsbWxrYXh3YWNvZmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwODAyMDAsImV4cCI6MjA4MjY1NjIwMH0.ncUbpA_kDxHcr2ETErOLq5TqnS_FPOkfKPlzC36Bgtg'
)

// Server-side Supabase client
export const supabaseAdmin = createClient(
  'https://yvkcledlmlkaxwacofkb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2a2NsZWRsbWxrYXh3YWNvZmtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA4MDIwMCwiZXhwIjoyMDgyNjU2MjAwfQ.ooEQrF47GEtTP2trBay0EHjSQ7pMxDDXmpaBSiHbp5g',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)