module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'backdrop': "url('/images/backdrop.jpeg')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
