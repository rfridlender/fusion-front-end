import { Amplify } from "aws-amplify"

const routesUnprotected = [
    "/confirm-sign-in",
    "/sign-in",
]

export default defineNuxtPlugin({
    name: "AmplifyAuthRedirect",
    enforce: "pre",
    setup() {
        const runtimeConfig = useRuntimeConfig()
        
        // This configures Amplify on the client side of your Nuxt app
        Amplify.configure(constructAmplifyConfig(runtimeConfig), { ssr: true })

        addRouteMiddleware(
            "AmplifyAuthMiddleware",
            defineNuxtRouteMiddleware(async (to) => {
                try {
                    const session = await useNuxtApp().$Amplify.Auth.fetchAuthSession()

                    // If the request is not associated with a valid user session
                    // redirect to the `/sign-in` route.
                    // You can also add route match rules against `to.path`
                    if (session.tokens === undefined && !routesUnprotected.includes(to.path)) {
                        return navigateTo("/sign-in")
                    }

                    if (session.tokens !== undefined && to.path === "/sign-in") {
                        return navigateTo("/")
                    }
                } catch (_) {
                    if (!routesUnprotected.includes(to.path)) {
                        return navigateTo("/sign-in")
                    }
                }
            }),
            { global: true },
        )
    },
})
