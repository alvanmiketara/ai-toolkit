import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        primary: colors.violet,
        // Preserve yellow overrides if needed, but using standard palette is usually safer for consistency
        yellow: colors.yellow,
      },
    },
  },
  plugins: [],
};

export default config;
