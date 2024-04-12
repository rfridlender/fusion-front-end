<script setup lang="ts">
import { LogIn } from "lucide-vue-next"
import { z } from "zod"

const REGEX_FORBID_WHITESPACE = /^\S*$/
const REGEX_REQUIRE_LOWERCASE = /[a-z]+/
const REGEX_REQUIRE_UPPERCASE = /[A-Z]+/
const REGEX_REQUIRE_NUMBER = /[0-9]+/
const REGEX_REQUIRE_SYMBOL = /[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`]+/

const schemaSignIn = toTypedSchema(z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8)
        .max(99)
        .regex(REGEX_FORBID_WHITESPACE, "Must not contain whitespace.")
        .regex(REGEX_REQUIRE_LOWERCASE, "Must contain at least (1) lowercase letter.")
        .regex(REGEX_REQUIRE_UPPERCASE, "Must contain at least (1) uppercase letter.")
        .regex(REGEX_REQUIRE_NUMBER, "Must contain at least (1) number.")
        .regex(REGEX_REQUIRE_SYMBOL, "Must contain at least (1) symbol (ex. $!@#%&)."),
}))


function onSubmit(values: any) {
    console.log("values ", values)
}
</script>

<template>
    <Form 
        class="mx-auto grid w-[350px] gap-6"
        :validation-schema="schemaSignIn" 
        @submit="onSubmit"
    >
        <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">
                Sign in
            </h1>
            <p class="text-balance text-muted-foreground">
                Enter your email below to sign in to your account
            </p>
        </div>
        <div class="grid gap-4">
            <FormField v-slot="{ componentField }" name="email">
                <FormItem v-auto-animate>
                    <div class="flex items-center">
                        <FormLabel>Email</FormLabel>
                    </div>
                    <FormControl>
                        <Input 
                            type="email" 
                            placeholder="john.doe@homefusioninstall.com" 
                            v-bind="componentField" 
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
                <FormItem v-auto-animate>
                    <div class="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <a class="ml-auto inline-block text-sm underline" href="/forgot-password">
                            Forgot your password?
                        </a>
                    </div>
                    <FormControl>
                        <Input 
                            type="password" 
                            placeholder="••••••••" 
                            v-bind="componentField" 
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Button class="w-full" type="submit">
                <LogIn class="h-5 w-5 gap-2 mr-2" />
                Sign in
            </Button>
        </div>
        <div class="mt-4 text-center text-sm">
            Don't have an account?
            <a class="underline" href="#">
                Sign up
            </a>
        </div>
    </Form>
</template>
