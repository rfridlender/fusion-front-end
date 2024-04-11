// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/color-mode",
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
    ],
    colorMode: {
        classSuffix: "",
    },
    shadcn: {
        prefix: "",
        componentDir: "./components/ui",
    },
})
