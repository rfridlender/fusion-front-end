import { runAmplifyApi } from "@/server/utils/amplify-utils"
import type { Address } from "@/utils/schemas"
import { fetchAuthSession } from "aws-amplify/auth/server"

export default defineEventHandler(async (event) => {
    const { httpApiInvokeUrl } = useRuntimeConfig(event)

    const session = await runAmplifyApi(event, (contextSpec) => fetchAuthSession(contextSpec))
    const idToken = session.tokens?.idToken?.toString()

    const addresses: Address[] = await $fetch("/address", {
        baseURL: httpApiInvokeUrl,
        headers: { Authorization: `Bearer ${idToken}` },
    })
    
    return addresses
})
