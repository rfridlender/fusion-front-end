<script setup lang="ts">
import { LogIn } from "lucide-vue-next"
import { z } from "zod"

const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/

const schemaSignIn = toTypedSchema(z.object({
    email: z.string().email(),
    password: z.string().regex(REGEX_PASSWORD),
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
                            placeholder="username@example.com" 
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
