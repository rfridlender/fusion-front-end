import { z } from "zod"

const REGEX_FORBID_WHITESPACE = /^\S*$/
const REGEX_PHONE_NUMBER = /^\+1\d{10}$/
const REGEX_REQUIRE_LOWERCASE = /[a-z]+/
const REGEX_REQUIRE_UPPERCASE = /[A-Z]+/
const REGEX_REQUIRE_NUMBER = /[0-9]+/
const REGEX_REQUIRE_SYMBOL = /[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`]+/

export const address = z.object({
    addressId: z.string().uuid(),
    streetOne: z.string(),
    streetTwo: z.string().nullable(),
    city: z.string(),
    county: z.string().nullable(),
    state: z.string().length(2),
    postalCode: z.string().min(5).max(10).nullable(),
    country: z.string().length(2),
    addressCreatedBy: z.string().uuid(),
    addressCreatedAt: z.string().datetime(),
    addressUpdatedBy: z.string().uuid(),
    addressUpdatedAt: z.string().datetime(),
})

export type Address = z.infer<typeof address>

export const schemaFormAddress = toTypedSchema(z.object({
    streetOne: z.string(),
    streetTwo: z.string().optional(),
    city: z.string(),
    county: z.string().optional(),
    state: z.string().length(2),
    postalCode: z.string().min(5).max(10).optional(),
    country: z.string().length(2),
}))

export const code = z.array(z.coerce.string())
    .length(6)

export const email = z.string()
    .email()

export const nameFull = z.string()
    .min(8)
    .max(99)

export const password = z
    .string()
    .min(8)
    .max(99)
    .regex(REGEX_FORBID_WHITESPACE, "Must not contain whitespace")
    .regex(REGEX_REQUIRE_LOWERCASE, "Must contain at least (1) lowercase letter")
    .regex(REGEX_REQUIRE_UPPERCASE, "Must contain at least (1) uppercase letter")
    .regex(REGEX_REQUIRE_NUMBER, "Must contain at least (1) number")
    .regex(REGEX_REQUIRE_SYMBOL, "Must contain at least (1) symbol (ex. $!@#%&)")

export const phoneNumber = z.string()
    .regex(REGEX_PHONE_NUMBER, "Invalid format (ex. +12223334444)")
