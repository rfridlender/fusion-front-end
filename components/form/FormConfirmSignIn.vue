<script setup lang="ts">
import { LogIn } from "lucide-vue-next"
import { z } from "zod"

const schemaConfirmSignIn = toTypedSchema(z
    .object({
        name: schemas.name,
        phoneNumber: schemas.phoneNumber,
        password: schemas.password,
        passwordConfirmation: z.string(),
    }).refine((data) => data.password === data.passwordConfirmation, {
        path: ["passwordConfirmation"],
        message: "Passwords must match",
    }),
)

async function onSubmit({ name, phoneNumber, password, passwordConfirmation }: any) {
    try {
        const { isSignedIn, nextStep } = await useNuxtApp().$Amplify.Auth.confirmSignIn({ challengeResponse: password })
        
        console.log("isSignedIn ", isSignedIn)
        console.log("nextStep ", nextStep)
        
        // if (isSignedIn) return navigateTo("/dashboard")
        
        // if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") return navigateTo("/confirm-sign-in")
        
        // throw new Error("Something went wrong.")
    } catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <Form :validation-schema="schemaConfirmSignIn" @submit="onSubmit">
        <Card class="w-84">
            <CardHeader class="grid gap-2 text-center">
                <CardTitle class="text-3xl font-bold">
                    Confirm sign in
                </CardTitle>
                <CardDescription class="text-balance text-muted-foreground">
                    Enter your email below to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent class="grid gap-4">
                <FormField v-slot="{ componentField }" name="name">
                    <FormItem v-auto-animate>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="John Doe" 
                                v-bind="componentField" 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="phoneNumber">
                    <FormItem v-auto-animate>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="+12223334444" 
                                v-bind="componentField" 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="password">
                    <FormItem v-auto-animate>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <FormFieldPassword :component-field="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="passwordConfirmation">
                    <FormItem v-auto-animate>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <FormFieldPassword :component-field="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </CardContent>
            <CardFooter>
                <Button class="w-full" type="submit">
                    <LogIn class="h-5 w-5 gap-2 mr-2" />
                    Sign in
                </Button>
            </CardFooter>
        </Card>
    </Form>
</template>
