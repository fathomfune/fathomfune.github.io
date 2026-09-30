// スマホのメニューバーと、トップページに散らばったスマホ用メニューで共有する状態
// stuck: 左上のバーに着いた（積み重なった）メニューのラベル → true
// barHeight: バーの高さ（px）。散らばったメニューがこの高さまで上がってきたらバーに着いたとみなす
export const useMobileMenu = () => ({
  stuck: useState('mobile-menu-stuck', () => ({})),
  barHeight: useState('mobile-menu-bar-height', () => 0)
})
