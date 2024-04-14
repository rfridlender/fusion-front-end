import { Amplify } from "aws-amplify"
import {
    confirmResetPassword,
    confirmSignIn,
    confirmUserAttribute,
    fetchAuthSession,
    fetchUserAttributes,
    resetPassword,
    sendUserAttributeVerificationCode,
    signIn,
    signOut,
    updatePassword,
} from "aws-amplify/auth"

export default defineNuxtPlugin({
    name: "AmplifyAPIs",
    enforce: "pre",
    setup() {
        const runtimeConfig = useRuntimeConfig()

        console.log(runtimeConfig.public)
        const config = constructAmplifyConfig(runtimeConfig)
        console.log(config)
        
        // This configures Amplify on the client side of your Nuxt app
        Amplify.configure(config, { ssr: true })

        return {
            provide: {
                // You can add the Amplify APIs that you will use on the client side
                // of your Nuxt app here.
                //
                // You can call the API by via the composable `useNuxtApp()`. For example:
                // `useNuxtApp().$Amplify.Auth.fetchAuthSession()`
                Amplify: {
                    Auth: {
                        confirmResetPassword,
                        confirmSignIn,
                        confirmUserAttribute,
                        fetchAuthSession,
                        fetchUserAttributes,
                        resetPassword,
                        sendUserAttributeVerificationCode,
                        signIn,
                        signOut,
                        updatePassword,
                    },
                },
            },
        }
    },
})
