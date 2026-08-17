export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const gaId = String(config.public.gaId || '').trim()
  if (!gaId) return

  // gtag.js load
  useHead({
    script: [
      { src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, async: true },
      {
        innerHTML: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: false });
        `.trim()
      }
    ]
  })

  // SPA page_view on route change
  const router = useRouter()
  router.afterEach((to) => {
    if (typeof window === 'undefined') return
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (!gtag) return
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: to.fullPath
    })
  })
})

