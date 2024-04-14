import { z } from "zod"

const REGEX_FORBID_WHITESPACE = /^\S*$/
const REGEX_PHONE_NUMBER = /^\+1\d{10}$/
const REGEX_REQUIRE_LOWERCASE = /[a-z]+/
const REGEX_REQUIRE_UPPERCASE = /[A-Z]+/
const REGEX_REQUIRE_NUMBER = /[0-9]+/
const REGEX_REQUIRE_SYMBOL = /[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`]+/

export default {
    code: z.array(z.coerce.string()).length(6),

    email: z.string().email(),
    
    name: z.string().min(8).max(99),

    password: z
        .string()
        .min(8)
        .max(99)
        .regex(REGEX_FORBID_WHITESPACE, "Must not contain whitespace")
        .regex(REGEX_REQUIRE_LOWERCASE, "Must contain at least (1) lowercase letter")
        .regex(REGEX_REQUIRE_UPPERCASE, "Must contain at least (1) uppercase letter")
        .regex(REGEX_REQUIRE_NUMBER, "Must contain at least (1) number")
        .regex(REGEX_REQUIRE_SYMBOL, "Must contain at least (1) symbol (ex. $!@#%&)"),

    phoneNumber: z.string().regex(REGEX_PHONE_NUMBER, "Invalid format (ex. +12223334444)"),
}
