import type { H3Event, EventHandlerRequest } from "h3"
import {
    createKeyValueStorageFromCookieStorageAdapter,
    createUserPoolsTokenProvider,
    createAWSCredentialsAndIdentityIdProvider,
    runWithAmplifyServerContext,
    type CookieStorage,
} from "aws-amplify/adapter-core"
import type { LibraryOptions } from "@aws-amplify/core"
import { constructAmplifyConfig } from "@/utils/construct-amplify-config"

const runtimeConfig = useRuntimeConfig()
const amplifyConfig = constructAmplifyConfig(runtimeConfig)

const createCookieStorageAdapter = (
    event: H3Event<EventHandlerRequest>,
): CookieStorage.Adapter => {
    // `parseCookies`, `setCookie` and `deleteCookie` are Nuxt provided functions
    const readOnlyCookies = parseCookies(event)

    return {
        get(name) {
            if (readOnlyCookies[name]) {
                return { name, value: readOnlyCookies[name] }
            }
        },
        set(name, value, options) {
            setCookie(event, name, value, options)
        },
        delete(name) {
            deleteCookie(event, name)
        },
        getAll() {
            return Object.entries(readOnlyCookies).map(([name, value]) => {
                return { name, value }
            })
        },
    }
}

const createLibraryOptions = (
    event: H3Event<EventHandlerRequest>,
): LibraryOptions => {
    const cookieStorage = createCookieStorageAdapter(event)
    const keyValueStorage =
    createKeyValueStorageFromCookieStorageAdapter(cookieStorage)
    const tokenProvider = createUserPoolsTokenProvider(
    amplifyConfig.Auth!,
    keyValueStorage,
    )
    const credentialsProvider = createAWSCredentialsAndIdentityIdProvider(
    amplifyConfig.Auth!,
    keyValueStorage,
    )

    return {
        Auth: {
            tokenProvider,
            credentialsProvider,
        },
    }
}

export const runAmplifyApi = <Result>(
    // we need the event object to create a context accordingly
    event: H3Event<EventHandlerRequest>,
    operation: (
    _: any
  ) => Result | Promise<Result>,
) => {
    return runWithAmplifyServerContext<Result>(
        amplifyConfig,
        createLibraryOptions(event),
        operation,
    )
}