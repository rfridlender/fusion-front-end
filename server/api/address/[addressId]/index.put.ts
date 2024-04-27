import { fetchAuthSession } from "aws-amplify/auth/server"
import { runAmplifyApi } from "@/server/utils/amplify-utils"
import type { Address } from "@/utils/schemas"

export default defineEventHandler(async (event) => {
    const addressId = getRouterParam(event, "addressId")

    const { httpApiInvokeUrl } = useRuntimeConfig(event)

    const session = await runAmplifyApi(event, (contextSpec) => fetchAuthSession(contextSpec))
    const idToken = session.tokens?.idToken?.toString()

    const body: FormAddress = await readBody(event)
    
    const address: Address = await $fetch(`/address/${addressId}`, {
        method: "PUT",
        baseURL: httpApiInvokeUrl,
        headers: { Authorization: `Bearer ${idToken}` },
        body: body,
    })

    return address
})
