/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette nationale du Cameroun — couleurs officielles du Mouvement Kamerun
        kgreen: '#0B6B43', // vert profond : navigation, actions principales
        kred: '#CE1126', // rouge : accents, actions secondaires
        kgold: '#FCD116', // jaune/or : touches, soulignages
        knavy: '#11203F', // bleu marine : grands titres, barres
        klight: '#F4F6F9', // gris très clair : fonds
        // Nuances de support reprises des maquettes
        kink: '#26324a', // texte de navigation
        kmuted: '#9aa6bf', // texte secondaire sur fond marine
        kfaint: '#7c879c', // texte discret
        kline: '#eceef2', // séparateurs clairs
      },
      fontFamily: {
        heading: ["'Barlow Condensed'", 'sans-serif'],
        sans: ["'Source Sans 3'", 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '1200px',
      },
    },
  },
  plugins: [],
}
