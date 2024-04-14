import type { CookieRef } from "nuxt/app"
import {
    createKeyValueStorageFromCookieStorageAdapter,
    createUserPoolsTokenProvider,
    createAWSCredentialsAndIdentityIdProvider,
    runWithAmplifyServerContext,
} from "aws-amplify/adapter-core"
import {
    fetchAuthSession,
    fetchUserAttributes,
    getCurrentUser,
} from "aws-amplify/auth/server"
import type {
    LibraryOptions,
    FetchAuthSessionOptions,
} from "@aws-amplify/core"

const getAmplifyAuthKeys = (userPoolClientId: string, lastAuthUser: string, lastAuthUserCookieName: string) =>
    ["idToken", "accessToken", "refreshToken", "clockDrift"].map((key) =>
        `CognitoIdentityServiceProvider.${userPoolClientId}.${lastAuthUser}.${key}`,
    ).concat(lastAuthUserCookieName)

// define the plugin
export default defineNuxtPlugin({
    name: "AmplifyAPIs",
    enforce: "pre",
    setup() {
        const runtimeConfig = useRuntimeConfig()
        const amplifyConfig = constructAmplifyConfig(runtimeConfig)

        // create the Amplify used token cookies names array
        const userPoolClientId = amplifyConfig.Auth!.Cognito.userPoolClientId ?? ""
        const lastAuthUserCookieName = `CognitoIdentityServiceProvider.${userPoolClientId}.LastAuthUser`
    
        // The Nuxt composable `useCookie` is capable of sending cookies to the
        // client via the `SetCookie` header. If the `expires` option is left empty,
        // it sets a cookie as a session cookie. If you need to persist the cookie
        // on the client side after your end user closes your Web app, you need to
        // specify an `expires` value.
        //
        // We use 30 days here as an example (the default Cognito refreshToken
        // expiration time).
        const expires = new Date()
        expires.setDate(expires.getDate() + 30)

        // Get the last auth user cookie value
        //
        // We use `sameSite: 'lax'` in this example, which allows the cookie to be
        // sent to your Nuxt server when your end user gets redirected to your Web
        // app from a different domain. You should choose an appropriate value for
        // your own use cases.
        const lastAuthUserCookie = useCookie(lastAuthUserCookieName, {
            sameSite: "lax",
            expires,
            secure: true,
        })

        // Get all Amplify auth token cookie names
        const authKeys = lastAuthUserCookie.value
            ? getAmplifyAuthKeys(userPoolClientId, lastAuthUserCookie.value, lastAuthUserCookieName)
            : []

        // Create a key-value map of cookie name => cookie ref
        //
        // Using the composable `useCookie` here in the plugin setup prevents
        // cross-request pollution.
        const amplifyCookies = authKeys
            .map((name) => ({
                name,
                cookieRef: useCookie(name, { sameSite: "lax", expires, secure: true }),
            }))
            .reduce<Record<string, CookieRef<string | null | undefined>>>(
                (result, current) => ({
                    ...result,
                    [current.name]: current.cookieRef,
                }),
                {},
            )

        // Create a key value storage based on the cookies
        //
        // This key value storage is responsible for providing Amplify Auth tokens to
        // the APIs that you are calling.
        //
        // If you implement the `set` method, when Amplify needed to refresh the Auth
        // tokens on the server side, the new tokens would be sent back to the client
        // side via `SetCookie` header in the response. Otherwise the refresh tokens
        // would not be propagate to the client side, and Amplify would refresh
        // the tokens when needed on the client side.
        //
        // In addition, if you decide not to implement the `set` method, you don't
        // need to pass any `CookieOptions` to the `useCookie` composable.
        const keyValueStorage = createKeyValueStorageFromCookieStorageAdapter({
            get(name) {
                const cookieRef = amplifyCookies[name]

                if (cookieRef && cookieRef.value) {
                    return { name, value: cookieRef.value }
                }

                return undefined
            },
            getAll() {
                return Object.entries(amplifyCookies).map(([name, cookieRef]) => {
                    return { name, value: cookieRef.value ?? undefined }
                })
            },
            set(name, value) {
                const cookieRef = amplifyCookies[name]
                if (cookieRef) {
                    cookieRef.value = value
                }
            },
            delete(name) {
                const cookieRef = amplifyCookies[name]

                if (cookieRef) {
                    cookieRef.value = null
                }
            },
        })

        // Create a token provider
        const tokenProvider = createUserPoolsTokenProvider(amplifyConfig.Auth!, keyValueStorage)

        // Create a credentials provider
        const credentialsProvider = createAWSCredentialsAndIdentityIdProvider(amplifyConfig.Auth!,keyValueStorage)

        // Create the libraryOptions object
        const libraryOptions: LibraryOptions = {
            Auth: {
                tokenProvider,
                credentialsProvider,
            },
        }

        return {
            provide: {
                // You can add the Amplify APIs that you will use on the server side of
                // your Nuxt app here. You must only use the APIs exported from the
                // `aws-amplify/<category>/server` subpaths.
                //
                // You can call the API by via the composable `useNuxtApp()`. For example:
                // `useNuxtApp().$Amplify.Auth.fetchAuthSession()`
                //
                // Recall that Amplify server APIs are required to be called in a isolated
                // server context that is created by the `runWithAmplifyServerContext`
                // function.
                Amplify: {
                    Auth: {
                        fetchAuthSession: (options: FetchAuthSessionOptions) =>
                            runWithAmplifyServerContext(
                                amplifyConfig,
                                libraryOptions,
                                (contextSpec) => fetchAuthSession(contextSpec, options),
                            ),
                        fetchUserAttributes: () =>
                            runWithAmplifyServerContext(
                                amplifyConfig,
                                libraryOptions,
                                (contextSpec) => fetchUserAttributes(contextSpec),
                            ),
                        getCurrentUser: () =>
                            runWithAmplifyServerContext(
                                amplifyConfig,
                                libraryOptions,
                                (contextSpec) => getCurrentUser(contextSpec),
                            ),
                    },
                },
            },
        }
    },
})
