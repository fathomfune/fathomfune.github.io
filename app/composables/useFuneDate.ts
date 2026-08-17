export const useFuneDate = () => {
  const formatFuneDate = (input?: string | Date | null) => {
    const d =
      input instanceof Date
        ? input
        : input
          ? new Date(input)
          : null

    if (!d || Number.isNaN(d.getTime())) return ''

    // 例: "10 NOV 2025"
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
      .format(d)
      .toUpperCase()
  }

  return { formatFuneDate }
}

