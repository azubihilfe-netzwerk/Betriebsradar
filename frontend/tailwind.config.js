/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Atkinson Hyperlegible Next"', 'sans-serif'],
      },
      colors: {
        // Semantic palette — change values here to restyle the whole app
        'brand':              '#242424', // primary brand / heading text
        'blackish':           '#242424',
        'brand-bg':           '#f2fff3', // page background
        'brand-surface':      '#e4fee7', // card / info-dialog background
        'brand-input':        '#f5f7fa', // input field background
        'brand-button':       '#e1e0f7', // primary button fill
        'brand-button-hover': '#c3c2ee', // primary button hover / nav link hover
        'brand-error':        '#e33581', // error borders and accents
        'brand-navbar' :      '#c3c2ee',
      },
    },
  },
  plugins: [],
}
