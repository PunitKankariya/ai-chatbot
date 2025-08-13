module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      config: './tailwind.config.cjs' // Points to your Tailwind config
    },
    autoprefixer: {} // Keep autoprefixer
  }
}