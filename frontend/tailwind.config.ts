import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#211C19',
        flour: '#F5EBDD',
        fire: '#C84F2F',
        caramel: '#8A5134',
        lake: '#315E68',
        charcoal: '#68615C',
      },
      fontFamily: {
        sans: ['"Source Han Sans SC"', '"Noto Sans CJK SC"', 'system-ui', 'sans-serif'],
        serif: ['"Source Han Serif SC"', '"Noto Serif CJK SC"', 'STSong', 'serif'],
      },
    },
  },
}
