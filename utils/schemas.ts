import { z } from "zod"

const REGEX_FORBID_WHITESPACE = /^\S*$/
const REGEX_PHONE_NUMBER = /^\+1\d{10}$/
const REGEX_REQUIRE_LOWERCASE = /[a-z]+/
const REGEX_REQUIRE_UPPERCASE = /[A-Z]+/
const REGEX_REQUIRE_NUMBER = /[0-9]+/
const REGEX_REQUIRE_SYMBOL = /[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`]+/

const code = z.array(z.coerce.string())
    .length(6)

const email = z.string()
    .email()

const nameFull = z.string()
    .min(8)
    .max(99)

const password = z
    .string()
    .min(8)
    .max(99)
    .regex(REGEX_FORBID_WHITESPACE, "Must not contain whitespace")
    .regex(REGEX_REQUIRE_LOWERCASE, "Must contain at least (1) lowercase letter")
    .regex(REGEX_REQUIRE_UPPERCASE, "Must contain at least (1) uppercase letter")
    .regex(REGEX_REQUIRE_NUMBER, "Must contain at least (1) number")
    .regex(REGEX_REQUIRE_SYMBOL, "Must contain at least (1) symbol (ex. $!@#%&)")

const phoneNumber = z.string()
    .regex(REGEX_PHONE_NUMBER, "Invalid format (ex. +12223334444)")

const objectAddress = z.object({
    addressId: z.string().uuid(),
    streetOne: z.string(),
    streetTwo: z.string().nullish(),
    city: z.string(),
    county: z.string().nullish(),
    state: z.string().length(2),
    postalCode: z.string().min(5).max(10).nullish(),
    country: z.string().length(2),
    addressUpdatedBy: z.string().uuid(),
    addressUpdatedAt: z.string().datetime(),
})
export type Address = z.infer<typeof objectAddress>
export const schemaAddress = toTypedSchema(objectAddress)

const objectPerson = z.object({
    personId: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string()
        .regex(REGEX_PHONE_NUMBER, "Invalid format (ex. +12223334444)")
        .nullish(),
    email: z.string().email().nullish(),
    personUpdatedBy: z.string().uuid(),
    personUpdatedAt: z.string().datetime(),
})
export type Person = z.infer<typeof objectPerson>
export const schemaPerson = toTypedSchema(objectPerson)

const objectVendor = z.object({
    vendorId: z.string().uuid(),
    vendorName: z.string(),
    contact: objectPerson,
    address: objectAddress,
    vendorUpdatedBy: z.string().uuid(),
    vendorUpdatedAt: z.string().datetime(),
})
export type Vendor = z.infer<typeof objectVendor>
export const schemaVendor = toTypedSchema(objectVendor)

const objectFormAddress = z.object({
    streetOne: z.string(),
    streetTwo: z.string().nullish(),
    city: z.string(),
    county: z.string().nullish(),
    state: z.string().length(2),
    postalCode: z.string().min(5).max(10).nullish(),
    country: z.string().length(2),
})
export type FormAddress = z.infer<typeof objectFormAddress>
export const schemaFormAddress = toTypedSchema(objectFormAddress)

const objectFormChangePassword = z.object({
    passwordCurrent: password,
    passwordNew: password,
    passwordNewConfirmation: z.string(),
}).refine((data) => data.passwordNew === data.passwordNewConfirmation, {
    path: ["passwordNewConfirmation"],
    message: "Passwords must match",
})
export type FormChangePassword = z.infer<typeof objectFormChangePassword>
export const schemaFormChangePassword = toTypedSchema(objectFormChangePassword)

const objectFormConfirmResetPassword = z.object({
    codeConfirmation: code,
    password: password,
    passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords must match",
})
export type FormConfirmResetPassword = z.infer<typeof objectFormConfirmResetPassword>
export const schemaFormConfirmResetPassword = toTypedSchema(objectFormConfirmResetPassword)

const objectFormConfirmSignIn = z.object({
    name: nameFull,
    phoneNumber: phoneNumber,
    password: password,
    passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords must match",
})
export type FormConfirmSignIn = z.infer<typeof objectFormConfirmSignIn>
export const schemaFormConfirmSignIn = toTypedSchema(objectFormConfirmSignIn)

const objectFormPerson = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string()
        .regex(REGEX_PHONE_NUMBER, "Invalid format (ex. +12223334444)")
        .nullish(),
    email: z.string().email().nullish(),
})
export type FormPerson = z.infer<typeof objectFormPerson>
export const schemaFormPerson = toTypedSchema(objectFormPerson)

const objectFormVendor = z.object({
    vendorName: z.string(),
    contactId: z.string().uuid(),
    addressId: z.string().uuid(),
})
export type FormVendor = z.infer<typeof objectFormVendor>
export const schemaFormVendor = toTypedSchema(objectFormVendor)

const objectFormResetPassword = z.object({ email: email })
export type FormResetPassword = z.infer<typeof objectFormResetPassword>
export const schemaFormResetPassword = toTypedSchema(objectFormResetPassword)

const objectFormSignIn = z.object({ email: email, password: password })
export type FormSignIn = z.infer<typeof objectFormSignIn>
export const schemaFormSignIn = toTypedSchema(objectFormSignIn)

const objectFormVerifyEmail = z.object({ codeConfirmation: code })
export type FormVerifyEmail = z.infer<typeof objectFormVerifyEmail>
export const schemaFormVerifyEmail = toTypedSchema(objectFormVerifyEmail)
