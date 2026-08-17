export default defineNuxtConfig({
  devtools: { enabled: false },
  
  // 1. デザイン部品（カードなど）を有効にする
  modules: ['@nuxt/ui', '@nuxt/eslint'],

  // 2. スタイル設定（既存のcss設定も残しています）
  css: ['@/assets/css/main.css'],

  // 3. おしゃれフォント（Monsieur La Doulaise）をGoogleから読み込む
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Coral+Pixels&display=swap'
        }
      ]
    }
  },

  // 4. microCMSの安全な設定
  runtimeConfig: {
    public: {
      // Nuxt 4では runtimeConfig にデフォルト空文字を入れると
      // `.env` の値で上書きされないケースがあるため明示的に読む
      microcmsServiceDomain: process.env.NUXT_PUBLIC_MICROCMS_SERVICE_DOMAIN || '',
      microcmsApiKey: process.env.NUXT_PUBLIC_MICROCMS_API_KEY || '',
      gaId: process.env.NUXT_PUBLIC_GA_ID || '',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
    }
  },

  // 5. 個別記事の取得が一時的に失敗しても、サイト全体のビルドは止めない。
  //    microCMSへの一時的な通信エラーに備えてリトライも強化する
  nitro: {
    prerender: {
      failOnError: false,
      retry: 5,
      retryDelay: 2000
    }
  }
})