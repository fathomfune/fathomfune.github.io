<script setup>
const route = useRoute()
const slug = route.params.slug
const config = useRuntimeConfig()

const { data: response, error } = await useFetch(
  `https://${config.public.microcmsServiceDomain}.microcms.io/api/v1/logs`,
  {
    params: {
      limit: 100
    },
    headers: {
      'X-MICROCMS-API-KEY': config.public.microcmsApiKey
    }
  }
)

const item = computed(() => response.value?.contents?.find(c => c.slug === slug))

// microCMSの改行を正規化して「行」配列にする（\r\n や <br> / <p> を反映）
const textLines = computed(() => {
  // フィールド名ゆれ対策（text/body/content など）
  const raw =
    item.value?.text ??
    item.value?.body ??
    item.value?.content ??
    ''

  const rawStr = typeof raw === 'string' ? raw : (raw?.html ?? raw?.text ?? '')

  const normalized = rawStr
    // 改行コード正規化
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // 文字列として "\n" が入ってるケースにも対応
    .replace(/\\n/g, '\n')
    // リッチ系の改行要素も吸収
    .replace(/<br\s*\/?>/gi, '\n')
    // 空段落（= 1行空け）を保持
    .replace(/<p[^>]*>\s*(?:<br\s*\/?>\s*)<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>\s*<\/p>/gi, '\n\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    // divベースのエディタにも対応（空divを空行扱い）
    .replace(/<div[^>]*>\s*(?:<br\s*\/?>\s*)<\/div>/gi, '\n\n')
    .replace(/<div[^>]*>\s*<\/div>/gi, '\n\n')
    .replace(/<\/div>\s*<div[^>]*>/gi, '\n')
    // li の改行も反映（リッチで箇条書きしてる場合）
    .replace(/<\/li>\s*<li[^>]*>/gi, '\n')
    // 残ったブロック終端は改行に寄せる
    .replace(/<\/(p|div|li)>/gi, '\n')
    // 残ったタグは除去（表示上のノイズ回避）
    .replace(/<[^>]+>/g, '')
    // 改行が多すぎる時は詰める（見た目の暴れ防止）
    .replace(/\n{3,}/g, '\n\n')
  return normalized.split('\n')
})

// --- inline anchors (marker方式) ---
// marker: [[note:kome]] → 本文中の「言葉」に紐づくanchorのslugとして使う
const NOTE_MARKER_RE = /\[\[note:([a-zA-Z0-9_-]+)\]\]/g

// 本文を「テキスト断片 + anchorマーカー」パーツに分割する
const numberedLines = computed(() => {
  return textLines.value.map(line => {
    const parts = []
    const noteEntries = []
    const s = String(line ?? '')
    let lastIndex = 0
    NOTE_MARKER_RE.lastIndex = 0

    let m
    while ((m = NOTE_MARKER_RE.exec(s)) !== null) {
      const start = m.index
      const end = start + m[0].length
      const slug = String(m[1])

      if (start > lastIndex) {
        parts.push({ type: 'text', value: s.slice(lastIndex, start) })
      }

      parts.push({ type: 'note', slug })
      noteEntries.push({ slug })
      lastIndex = end
    }

    if (lastIndex < s.length) {
      parts.push({ type: 'text', value: s.slice(lastIndex) })
    }

    // 末尾の空白だけ落とす（空行は維持）
    if (parts.length === 0) parts.push({ type: 'text', value: '' })
    if (parts[parts.length - 1].type === 'text') {
      parts[parts.length - 1].value = String(parts[parts.length - 1].value).trimEnd()
    }

    const textOnly = parts.filter(p => p.type === 'text').map(p => p.value).join('')
    const isBlank = textOnly.trim() === '' && noteEntries.length === 0

    return { parts, noteEntries, isBlank }
  })
})

const hasImage = computed(() => !!(item.value?.image && item.value.image.length > 0))

const { formatFuneDate } = useFuneDate()

const formattedDate = computed(() => {
  return formatFuneDate(item.value?.date ?? null)
})

// --- 注釈（inlineNotes）: microCMSに直接入力されたものをそのまま読む ---
// noteId（[[note:xxx]] のxxx）→ inlineNotesの該当要素
const notesBySlug = computed(() => {
  const map = new Map()
  for (const note of item.value?.inlineNotes ?? []) {
    if (note?.noteId) map.set(note.noteId, note)
  }
  return map
})

function noteFor(slug) {
  return notesBySlug.value.get(slug) ?? null
}

// HTMLタグを除いた中身が空かどうか（urlフィールドの空リッチテキスト対策）
function hasContent(html) {
  return !!html && html.replace(/<[^>]+>/g, '').trim() !== ''
}

// --- 注釈パネルの重なり回避（本文の行間は固定のまま、右カラム側だけずらす） ---
const NOTE_OVERLAP_GAP_PX = 16
const noteEls = ref([])
const noteOffsets = ref([])

const setNoteEl = (el, idx) => {
  noteEls.value[idx] = el
}

const layoutNoteOffsets = async () => {
  if (typeof window === 'undefined') return
  noteOffsets.value = []
  await nextTick()
  requestAnimationFrame(() => {
    const els = noteEls.value
    const indices = []
    for (let i = 0; i < els.length; i++) {
      if (els[i]) indices.push(i)
    }
    if (indices.length <= 1) return

    const offsets = Array(Math.max(numberedLines.value.length, els.length)).fill(0)
    let prevBottom = null

    for (const i of indices) {
      const rect = els[i].getBoundingClientRect()
      const top = rect.top + offsets[i]

      if (prevBottom != null && prevBottom + NOTE_OVERLAP_GAP_PX > top) {
        offsets[i] += prevBottom + NOTE_OVERLAP_GAP_PX - top
      }

      prevBottom = rect.top + offsets[i] + rect.height
    }

    noteOffsets.value = offsets
  })
}

onMounted(() => {
  layoutNoteOffsets()
  window.addEventListener('resize', layoutNoteOffsets, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', layoutNoteOffsets)
})

watch(
  () => numberedLines.value.length,
  async () => {
    noteEls.value = []
    await layoutNoteOffsets()
  }
)

watch(
  item,
  async () => {
    noteEls.value = []
    await layoutNoteOffsets()
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen relative">
    <div v-if="item" class="relative">
      <!-- スクロール可能なコンテンツエリア -->
      <div style="padding-top: 120px; padding-bottom: 120px;">
        <div class="logs-shell">
          <!-- タイトル -->
          <div class="logs-title-fixed">
            <h1 class="mb-4 text-gray-900 font-garamond min-w-0 whitespace-normal break-words [overflow-wrap:anywhere] leading-tight">
              {{ item.title }}
            </h1>
            <div class="text-[10px] text-gray-500">
              <ClientOnly>
                <time>{{ formattedDate }}</time>
              </ClientOnly>
            </div>
          </div>

          <div class="logs-grid">

          <!-- 画像行（あれば row=1 に置く） -->
          <div
            v-if="item.image && item.image.length > 0"
            class="min-w-0 "
            :style="{ gridColumn: '2', gridRow: '1' }"
          >
            <div class="overflow-hidden bg-gray-100">
              <img
                :src="item.image[0].url + '?fm=jpg'"
                class="object-cover"
                alt=""
              />
            </div>
          </div>

          <!-- 本文（行ごと） -->
          <div
            v-for="(line, index) in numberedLines"
            :key="`line-${index}`"
            :class="line.isBlank ? 'logs-row-blank' : 'logs-row-sep'"
            :style="{
              gridColumn: '2',
              gridRow: String((hasImage ? 2 : 1) + index)
            }"
          >
            <div class="logs-body-line text-gray-900">
              <template v-for="(part, pIndex) in line.parts" :key="pIndex">
                <span v-if="part.type === 'text'">{{ part.value }}</span>

                <!-- 注釈マーカー：数字は振らず点だけ。中身は右の注釈パネルに常に表示 -->
                <sup
                  v-else
                  class="align-super ml-1 text-[10px] leading-none text-gray-400"
                  :class="noteFor(part.slug) ? 'opacity-100' : 'opacity-30'"
                >˙</sup>
              </template>
            </div>
          </div>

          <!-- 右：行に紐づく注釈パネル（microCMSのinlineNotesをそのまま表示） -->
          <div
            v-for="(line, index) in numberedLines"
            :key="`note-row-${index}`"
            :class="[
              line.isBlank ? 'logs-row-blank' : 'logs-row-sep',
              'text-[11px] justify-self-end w-[220px] overflow-visible relative'
            ]"
            :style="{
              gridColumn: '4',
              gridRow: String((hasImage ? 2 : 1) + index)
            }"
          >
            <div
              v-if="line.noteEntries.length"
              :ref="el => setNoteEl(el, index)"
              class="px-6 absolute top-0 space-y-4 text-gray-700 leading-relaxed break-words whitespace-normal [overflow-wrap:anywhere]"
              :style="noteOffsets[index] ? { transform: `translateY(${noteOffsets[index]}px)` } : undefined"
            >
              <div
                v-for="entry in line.noteEntries"
                :key="`${index}-${entry.slug}`"
                class="flex flex-col space-y-2"
              >
                <template v-if="noteFor(entry.slug)">
                  <p class="whitespace-pre-wrap break-words">{{ noteFor(entry.slug).text }}</p>
                  <div
                    v-if="hasContent(noteFor(entry.slug).url)"
                    class="[&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline break-all"
                    v-html="noteFor(entry.slug).url"
                  />
                </template>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <div v-if="error" class="text-red-500">
        <p class="text-xl">データの読み込みに失敗しました。</p>
      </div>
      <div v-else>
        <p class="text-gray-400 animate-pulse">舟の詳細を読み込んでいます...</p>
      </div>
    </div>
  </div>
</template>
