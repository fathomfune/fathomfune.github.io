import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

// URL/KEYが未設定（Supabaseプロジェクト未接続）の間はnullを返し、
// 呼び出し側は「連想ゼロ」として静かに振る舞う。
export function useSupabase(): SupabaseClient | null {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const anonKey = config.public.supabaseAnonKey

  if (!url || !anonKey) return null

  if (!client) {
    client = createClient(url, anonKey)
  }
  return client
}
