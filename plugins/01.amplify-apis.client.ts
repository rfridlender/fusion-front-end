import { Amplify } from "aws-amplify"
import {
    confirmSignIn,
    fetchAuthSession,
    fetchUserAttributes,
    signIn,
    signOut,
} from "aws-amplify/auth"

export default defineNuxtPlugin({
    name: "AmplifyAPIs",
    enforce: "pre",
    setup() {
        const runtimeConfig = useRuntimeConfig()
        
        // This configures Amplify on the client side of your Nuxt app
        Amplify.configure(constructAmplifyConfig(runtimeConfig), { ssr: true })

        return {
            provide: {
                // You can add the Amplify APIs that you will use on the client side
                // of your Nuxt app here.
                //
                // You can call the API by via the composable `useNuxtApp()`. For example:
                // `useNuxtApp().$Amplify.Auth.fetchAuthSession()`
                Amplify: {
                    Auth: {
                        confirmSignIn,
                        fetchAuthSession,
                        fetchUserAttributes,
                        signIn,
                        signOut,
                    },
                },
            },
        }
    },
})
