// Sound の項目（いまはダミー。R2 の準備ができたら差し替える）。新しいものから順に並ぶ
const TITLES = [
  'Morning soil', 'Slow ferment', 'First frost', 'Rain on the roof', 'Tide', 'Kitchen hum',
  'Under the eaves', 'Koji room', 'Wind in the cedar', 'Night field', 'Clay pot', 'Steam',
  'Seedbed', 'Low river', 'Sawdust', 'Ember', 'Fog at dawn', 'Root cellar'
]

const SOUNDS = Array.from({ length: 72 }, (_, i) => {
  // 2026.04 から2か月ずつさかのぼる
  const monthIndex = 2026 * 12 + 3 - i * 2
  const year = Math.floor(monthIndex / 12)
  const month = String((monthIndex % 12) + 1).padStart(2, '0')
  return { date: `${year}.${month}`, title: TITLES[i % TITLES.length], to: '/building' }
})

export const useSounds = () => SOUNDS
