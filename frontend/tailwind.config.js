/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#8B5CF6',
                    DEFAULT: '#6366F1',
                    dark: '#4F46E5',
                },
                accent: {
                    DEFAULT: '#06B6D4',
                    glow: '#22D3EE',
                },
                dark: {
                    900: '#0F172A',
                    800: '#1E293B',
                    700: '#334155',
                }
            },
            backgroundImage: {
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
                'dark-glass': 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(15,23,42,0.4))'
            }
        },
    },
    plugins: [],
}
