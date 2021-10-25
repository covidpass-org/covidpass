module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',      // manual for now until layout fix
    // darkMode: 'media',

    theme: {
        extend: {
            outline: {
                apple: '0.05em solid #A6A6A6',
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
