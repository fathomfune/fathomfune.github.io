const TRACKING_PARAM_NAMES = new Set(['fbclid', 'gclid', 'igshid', 'mc_cid', 'mc_eid'])

function isTrackingParam(key: string) {
  return key.startsWith('utm_') || TRACKING_PARAM_NAMES.has(key)
}

function stripTrackingParams() {
  const url = new URL(window.location.href)
  let changed = false

  for (const key of Array.from(url.searchParams.keys())) {
    if (isTrackingParam(key)) {
      url.searchParams.delete(key)
      changed = true
    }
  }

  if (changed) {
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }
}

export default defineNuxtPlugin(() => {
  stripTrackingParams()

  const router = useRouter()
  router.afterEach(() => {
    nextTick(stripTrackingParams)
  })
})
