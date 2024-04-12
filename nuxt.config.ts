// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        "@formkit/auto-animate/nuxt",
        "@nuxtjs/color-mode",
        "@nuxtjs/eslint-module",
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
        "@vee-validate/nuxt",
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
    veeValidate: {
        autoImports: true,
    },
})
