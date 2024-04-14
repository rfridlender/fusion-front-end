// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    colorMode: {
        classSuffix: "",
    },
    devtools: { enabled: true },
    eslint: {
        /* module options */
    },
    modules: [
        "@formkit/auto-animate/nuxt",
        "@nuxtjs/color-mode",
        "@nuxtjs/eslint-module",
        "@nuxtjs/tailwindcss",
        "shadcn-nuxt",
        "@vee-validate/nuxt",
    ],
    runtimeConfig: {
        public: {
            userPoolId: "",
            userPoolClientId: "",
        },
    },
    shadcn: {
        prefix: "",
        componentDir: "./components/ui",
    },
    veeValidate: {
        autoImports: true,
    },
})
