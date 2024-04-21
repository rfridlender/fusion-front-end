import type { ResourcesConfig } from "aws-amplify"
import type { RuntimeConfig } from "nuxt/schema"

export function constructAmplifyConfig(runtimeConfig: RuntimeConfig): ResourcesConfig {
    return {
        Auth: {
            Cognito: {
                userPoolId: runtimeConfig.public.userPoolId,
                userPoolClientId: runtimeConfig.public.userPoolClientId,
            },
        },
    }
}
