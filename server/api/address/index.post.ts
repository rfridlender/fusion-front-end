import { runAmplifyApi } from "@/server/utils/amplify-utils"
import { fetchAuthSession } from "aws-amplify/auth/server"

export default defineEventHandler(async (event) => {
    const { httpApiInvokeUrl } = useRuntimeConfig(event)

    const session = await runAmplifyApi(event, (contextSpec) => fetchAuthSession(contextSpec))
    const idToken = session.tokens?.idToken?.toString()

    const body: FormAddress = await readBody(event)
    
    const address: Address = await $fetch("/address", {
        method: "POST",
        baseURL: httpApiInvokeUrl,
        headers: { Authorization: `Bearer ${idToken}` },
        body: body,
    })

    return address
})
