// postcss.config.mjs
export default {
  plugins: [
    require('postcss-import')(),
    require('tailwindcss')(),
    require('autoprefixer')(),
  ],
};
