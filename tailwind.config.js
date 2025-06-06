/** @type {import('tailwindcss').Config} */
export default {
    // Aktifkan dark mode secara class-based
    darkMode: 'class',

    // Konten yang akan di-scan oleh Tailwind
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
    ],
    safelist: [
        'bg-mora-biru',
        'bg-mora-kuning',
        'bg-mora-biru-terang',
        'bg-mora-biru-gelap',
        'text-mora-biru',
        'text-mora-kuning',
        // Tambahkan semua yang kamu gunakan secara dinamis
    ],

    theme: {
        extend: {
            // Warna tema Mora
            colors: {
                'mora': {
                    'biru': '#1E3A8A',
                    'kuning': '#FBBF24',
                    'hitam': '#1F2937',
                    // Variasi warna tambahan
                    'biru-terang': '#3B82F6',
                    'biru-gelap': '#1E40AF',
                    'kuning-terang': '#FCD34D',
                    'kuning-gelap': '#D97706',
                },
            },

            // Font default
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },

            // Animasi kustom
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },

            // Keyframes untuk animasi
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },

            // Shadow kustom untuk komponen
            boxShadow: {
                'mora': '0 4px 6px -1px rgba(30, 58, 138, 0.1), 0 2px 4px -1px rgba(30, 58, 138, 0.06)',
                'mora-lg': '0 10px 15px -3px rgba(30, 58, 138, 0.1), 0 4px 6px -2px rgba(30, 58, 138, 0.05)',
            },
        },
    },

    // Variants tambahan
    variants: {
        extend: {
            backgroundColor: ['active'],
            textColor: ['active'],
            opacity: ['disabled'],
        },
    },

    plugins: [
        // Plugin tambahan
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
}