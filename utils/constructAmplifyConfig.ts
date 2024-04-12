import type { ResourcesConfig } from "aws-amplify"
import type { RuntimeConfig } from "nuxt/schema"

export function constructAmplifyConfig(runtimeConfig: RuntimeConfig): ResourcesConfig {
    return {
        Auth: {
            Cognito: {
                userPoolId: runtimeConfig.public.USER_POOL_ID,
                userPoolClientId: runtimeConfig.public.USER_POOL_CLIENT_ID,
            },
        },
    }
}
