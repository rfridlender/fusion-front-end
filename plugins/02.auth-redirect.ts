import { Amplify } from "aws-amplify"
import config from "@/amplifyconfiguration.json"

// Amplify.configure() only needs to be called on the client side
if (process.client) {
    Amplify.configure(config, { ssr: true })
}

export default defineNuxtPlugin({
    name: "AmplifyAuthRedirect",
    enforce: "pre",
    setup() {
        addRouteMiddleware(
            "AmplifyAuthMiddleware",
            defineNuxtRouteMiddleware(async (to) => {
                try {
                    const session = await useNuxtApp().$Amplify.Auth.fetchAuthSession()

                    // If the request is not associated with a valid user session
                    // redirect to the `/sign-in` route.
                    // You can also add route match rules against `to.path`
                    if (session.tokens === undefined && to.path !== "/sign-in") {
                        return navigateTo("/sign-in")
                    }

                    if (session.tokens !== undefined && to.path === "/sign-in") {
                        return navigateTo("/")
                    }
                } catch (_) {
                    if (to.path !== "/sign-in") {
                        return navigateTo("/sign-in")
                    }
                }
            }),
            { global: true },
        )
    },
})
