import { z } from "zod"

const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/

export function schemaSignIn() {
    return toTypedSchema(z.object({
        email: z.string().email(),
        password: z.string().regex(REGEX_PASSWORD),
    }))
}
