<template>
  <UContainer class="py-20 max-w-2xl mx-0 px-3 sm:px-0 sm:pl-[10.5vw] lg:px-0 lg:pl-[10.5vw]">
    <div class="flex items-center gap-3 mb-10">
    </div>

    <div :class="[bodyFont, 'text-gray-900']" style="font-size: 0.75rem; letter-spacing: 0.03em; line-height: 1.6;">
      <h1 class="font-garamond mb-1" style="font-size: 0.8125rem;">{{ t.title }}</h1>
      <p :class="[bodyFont, 'text-gray-400 mb-10']">{{ t.lastUpdated }}</p>

      <section v-for="section in t.sections" :key="section.heading" class="mb-8">
        <h2 :class="[bodyFont, 'mb-2']" style="font-size: 0.75rem;">{{ section.heading }}</h2>
        <p v-for="(paragraph, i) in section.body" :key="i" :class="[bodyFont, 'mb-2']">{{ paragraph }}</p>
      </section>

      <p :class="bodyFont">
        {{ t.contactBefore }}<NuxtLink to="/contact" :class="bodyFont" class="underline underline-offset-2 hover:text-[#0365a6] transition-colors">{{ t.contactLink }}</NuxtLink>{{ t.contactAfter }}
      </p>
    </div>
  </UContainer>
</template>

<script setup>
useHead({ title: 'Privacy Policy — 舟' })

// メニューの ☄︎. EN / JP と共有する言語
const lang = useTextLang()

// 内容を変えたときは両方の日付を更新する
const content = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: September 30, 2026',
    contactBefore: 'If you have any questions about this policy, please reach out through the ',
    contactLink: 'contact page',
    contactAfter: '.',
    sections: [
      {
        heading: 'Overview',
        body: [
          'This policy explains what information Fune ("we", "us") collects when you visit this website, how it is used, and the choices you have.'
        ]
      },
      {
        heading: 'Information you give us',
        body: [
          'When you send a message through the contact form, we receive your name, email address, and the content of your message. We use this information only to read and reply to your message.',
          'The form is delivered by FormSubmit (formsubmit.co), which forwards your message to us by email. Your message is therefore also processed by FormSubmit and by our email provider.'
        ]
      },
      {
        heading: 'Analytics',
        body: [
          'We use Google Analytics to understand how visitors use this site, such as which pages are viewed. Google Analytics uses cookies and collects information like your approximate location, device, browser, and the pages you visit. This information is aggregated and is not used to identify you personally.',
          'You can block these cookies in your browser settings, or opt out with the Google Analytics Opt-out Browser Add-on (tools.google.com/dlpage/gaoptout). For more about how Google handles data, see policies.google.com/privacy.'
        ]
      },
      {
        heading: 'Third-party content and links',
        body: [
          'Images on this site are delivered through microCMS. This site also links to external services such as Instagram. When you follow those links, the privacy policy of that service applies.'
        ]
      },
      {
        heading: 'Sharing your information',
        body: [
          'We do not sell your personal information. We do not share it with others except with the services described above, or when required by law.'
        ]
      },
      {
        heading: 'Keeping and deleting your information',
        body: [
          'We keep contact messages only as long as needed to respond and follow up. You can ask us to see, correct, or delete the information you have sent us at any time.'
        ]
      },
      {
        heading: 'Changes to this policy',
        body: [
          'We may update this policy from time to time. When we do, we will change the date at the top of this page.'
        ]
      }
    ]
  },
  ja: {
    title: 'プライバシーポリシー',
    lastUpdated: '最終更新日：2026年9月30日',
    contactBefore: 'このポリシーについてのご質問は、',
    contactLink: 'お問い合わせページ',
    contactAfter: 'からご連絡ください。',
    sections: [
      {
        heading: 'はじめに',
        body: [
          'このポリシーでは、Fune（以下「私たち」）がこのウェブサイトで取得する情報、その使い方、そしてあなたが選べることについて説明します。'
        ]
      },
      {
        heading: 'お送りいただく情報',
        body: [
          'お問い合わせフォームからメッセージを送信いただくと、お名前、メールアドレス、メッセージの内容を受け取ります。これらの情報は、メッセージを読み、返信するためだけに使います。',
          'フォームの送信には FormSubmit（formsubmit.co）を利用しており、メッセージはメールで私たちに届きます。そのため、メッセージは FormSubmit と私たちが利用するメールサービスでも取り扱われます。'
        ]
      },
      {
        heading: 'アクセス解析',
        body: [
          'どのページが見られているかなど、サイトの利用状況を知るために Google アナリティクスを利用しています。Google アナリティクスは Cookie を使い、おおよその地域、端末、ブラウザ、閲覧したページなどの情報を収集します。これらの情報は集計して扱い、個人を特定するためには使いません。',
          'Cookie はブラウザの設定で無効にできます。また、Google アナリティクス オプトアウト アドオン（tools.google.com/dlpage/gaoptout）で収集を止めることもできます。Google によるデータの取り扱いについては policies.google.com/privacy をご覧ください。'
        ]
      },
      {
        heading: '外部のサービスとリンク',
        body: [
          'このサイトの画像は microCMS から配信しています。また、Instagram などの外部サービスへのリンクがあります。リンク先では、それぞれのサービスのプライバシーポリシーが適用されます。'
        ]
      },
      {
        heading: '情報の提供',
        body: [
          'お預かりした個人情報を販売することはありません。上に書いたサービスへの提供と、法令にもとづく場合を除き、第三者に提供することはありません。'
        ]
      },
      {
        heading: '情報の保存と削除',
        body: [
          'お問い合わせの内容は、返信とその後のやりとりに必要な間だけ保存します。お送りいただいた情報の確認、訂正、削除は、いつでもご依頼いただけます。'
        ]
      },
      {
        heading: 'このポリシーの変更',
        body: [
          'このポリシーは必要に応じて更新することがあります。更新したときは、このページ上部の日付を変更します。'
        ]
      }
    ]
  }
}

const t = computed(() => content[lang.value] || content.en)

// 日本語はテキストページの本文と同じ（游ゴシック）。タイトルだけテキストページと同じく明朝のまま
const bodyFont = computed(() => (lang.value === 'en' ? 'font-garamond' : ''))
</script>
