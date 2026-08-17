export const useLogs = async () => {
    const config = useRuntimeConfig()
  
    const { data, error } = await useFetch(
      `https://${config.public.microcmsServiceDomain}.microcms.io/api/v1/logs`,
      {
        headers: {
          'X-MICROCMS-API-KEY': config.public.microcmsApiKey
        }
      }
    )
  
    // レイアウトの揺らぎ
    const layouts = ['s', 'm', 'l']
  
    const contents = computed(() => {
      if (!data.value?.contents) return []
  
      return data.value.contents.map(item => ({
        ...item,
        layout: layouts[Math.floor(Math.random() * layouts.length)]
      }))
    })
  
    return {
      contents,
      error
    }
  }
