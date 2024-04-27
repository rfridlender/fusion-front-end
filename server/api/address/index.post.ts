import { runAmplifyApi } from "@/server/utils/amplify-utils"
import { fetchAuthSession } from "aws-amplify/auth/server"
import axios from "axios"

export default defineEventHandler(async (event) => {
    try {
        const { httpApiInvokeUrl } = useRuntimeConfig(event)
    
        const session = await runAmplifyApi(event, (contextSpec) => fetchAuthSession(contextSpec))
        const idToken = session.tokens?.idToken?.toString()
    
        const body = await readBody(event)
    
        const { data } = await axios({
            method: "POST",
            baseURL: httpApiInvokeUrl,
            url: "/address",
            headers: { Authorization: `Bearer ${idToken}` },
            data: body,
        })
    
        return data
    } catch (error: any) {
        console.error(error)

        switch (error.name) {
        case "AxiosError": {
            throw createError({
                statusCode: error.response.status,
                statusMessage: error.response.data.message,
            })
        }
        default: {
            throw createError({
                statusCode: 400,
                statusMessage: error.message,
            })
        }
        }
    }
})
