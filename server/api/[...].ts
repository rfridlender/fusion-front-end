import { fetchAuthSession } from "aws-amplify/auth/server"
import { joinURL } from "ufo"

export default defineEventHandler(async (event) => {
    const { httpApiInvokeUrl } = useRuntimeConfig(event)

    const session = await runAmplifyApi(event, (contextSpec) => fetchAuthSession(contextSpec))
    const idToken = session.tokens?.idToken?.toString()

    const path = event.path.replace("/api", "")
    const target = joinURL(httpApiInvokeUrl, path)

    return proxyRequest(event, target, { 
        headers: { Authorization: `Bearer ${idToken}` },
    })
})
