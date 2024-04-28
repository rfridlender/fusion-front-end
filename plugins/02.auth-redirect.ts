import { Amplify } from "aws-amplify"

export const routesProtected = [
    "/address",
    "/change-password",
    "/dashboard",
    "/person",
    "/verify-email",
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
                    if (
                        session.tokens === undefined && 
                        (routesProtected.includes(to.path) || to.path === "/")
                    ) {
                        return navigateTo("/sign-in")
                    }

                    if (
                        session.tokens !== undefined && 
                        (!routesProtected.includes(to.path) || to.path === "/")
                    ) {
                        return navigateTo("/dashboard")
                    }
                } catch (_) {
                    if (routesProtected.includes(to.path)) {
                        return navigateTo("/sign-in")
                    }
                }
            }),
            { global: true },
        )
    },
})
