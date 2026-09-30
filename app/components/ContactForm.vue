<template>
  <!-- フォームの文字はメニューと同じ DM Mono（入力欄やボタンも含む） -->
  <div class="font-dm-mono" style="font-size: 0.65625rem; letter-spacing: 0.05em;">
    <form v-if="status !== 'success'" class="space-y-4" novalidate @submit.prevent="handleSubmit">
      <div>
        <label for="contact-name" class="block mb-1 text-gray-500">Name</label>
        <input
          id="contact-name"
          v-model="name"
          type="text"
          required
          class="w-full bg-transparent border-0 border-b pb-1 text-gray-900 outline-none focus:border-[#0365a6] transition-colors"
          :class="fieldErrors.name ? 'border-rose-300' : 'border-gray-300'"
          @input="fieldErrors.name = ''"
        >
        <Transition name="field-error">
          <p v-if="fieldErrors.name" class="mt-1 text-[0.625rem] tracking-normal text-rose-400">{{ fieldErrors.name }}</p>
        </Transition>
      </div>

      <div>
        <label for="contact-email" class="block mb-1 text-gray-500">Email</label>
        <input
          id="contact-email"
          v-model="email"
          type="email"
          required
          class="w-full bg-transparent border-0 border-b pb-1 text-gray-900 outline-none focus:border-[#0365a6] transition-colors"
          :class="fieldErrors.email ? 'border-rose-300' : 'border-gray-300'"
          @input="fieldErrors.email = ''"
        >
        <Transition name="field-error">
          <p v-if="fieldErrors.email" class="mt-1 text-[0.625rem] tracking-normal text-rose-400">{{ fieldErrors.email }}</p>
        </Transition>
      </div>

      <div>
        <label for="contact-message" class="block mb-1 text-gray-500">Message</label>
        <textarea
          id="contact-message"
          v-model="message"
          required
          rows="4"
          class="w-full bg-transparent border-0 border-b pb-1 text-gray-900 outline-none focus:border-[#0365a6] transition-colors resize-none"
          :class="fieldErrors.message ? 'border-rose-300' : 'border-gray-300'"
          @input="fieldErrors.message = ''"
        />
        <Transition name="field-error">
          <p v-if="fieldErrors.message" class="mt-1 text-[0.625rem] tracking-normal text-rose-400">{{ fieldErrors.message }}</p>
        </Transition>
      </div>

      <p v-if="status === 'error'" class="text-red-500">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        :disabled="status === 'sending'"
        class="inline-flex items-center text-gray-400 hover:text-[#0365a6] transition-colors disabled:opacity-50"
      >
        {{ status === 'sending' ? 'Sending...' : 'Send' }}
      </button>
    </form>

    <div v-else>
      <p class="text-gray-600">
        Thank you. Your message has been sent.
      </p>
    </div>
  </div>
</template>

<script setup>
const name = ref('')
const email = ref('')
const message = ref('')
const status = ref('idle')
const errorMessage = ref('')
const fieldErrors = reactive({ name: '', email: '', message: '' })

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  fieldErrors.name = name.value.trim() ? '' : 'Please enter your name.'
  fieldErrors.email = !email.value.trim()
    ? 'Please enter your email.'
    : (EMAIL_RE.test(email.value.trim()) ? '' : 'Please enter a valid email address.')
  fieldErrors.message = message.value.trim() ? '' : 'Please enter a message.'

  return !fieldErrors.name && !fieldErrors.email && !fieldErrors.message
}

// FormSubmit.co: サーバーなしでフォーム送信をrforsidejob@gmail.com宛のメールに変換してくれるサービス
// 初回送信時、rforsidejob@gmail.com に届く確認メールのリンクをクリックするまで配信が有効化されない
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/rforsidejob@gmail.com'

async function handleSubmit() {
  if (!validate()) return

  status.value = 'sending'
  errorMessage.value = ''

  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        message: message.value,
        _subject: `New contact form message from ${name.value}`
      })
    })

    if (!res.ok) throw new Error(`FormSubmit responded with ${res.status}`)

    status.value = 'success'
  } catch {
    status.value = 'error'
    errorMessage.value = 'Something went wrong. Please try again later.'
  }
}
</script>

<style scoped>
.field-error-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.field-error-enter-from {
  opacity: 0;
  transform: translateY(-2px);
}
.field-error-leave-active {
  transition: opacity 0.15s ease;
}
.field-error-leave-to {
  opacity: 0;
}
</style>
