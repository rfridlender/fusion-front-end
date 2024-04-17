import { fetchAuthSession } from "aws-amplify/auth/server"
import { runAmplifyApi } from "@/server/utils/amplifyUtils"

export type Address = {
    addressId: string
    streetOne: string
    streetTwo: string | null
    city: string
    county: string | null
    state: string
    postalCode: string | null
    country: string
    addressCreatedBy: string
    addressCreatedAt: string
    addressUpdatedBy: string | null
    addressUpdatedAt: string | null
}

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
