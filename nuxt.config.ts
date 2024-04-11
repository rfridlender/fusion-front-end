// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/color-mode",
        "@nuxtjs/eslint-module",
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
    ],
    colorMode: {
        classSuffix: "",
    },
    eslint: {
        /* module options */
    },
    shadcn: {
        prefix: "",
        componentDir: "./components/ui",
    },
})
