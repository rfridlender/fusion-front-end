<script setup lang="ts">
import { CircleCheckBig, LoaderCircle } from "lucide-vue-next"

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schemaFormConfirmSignIn })

const onSubmit = handleSubmit(async ({ givenName, familyName, phoneNumber, password }) => {
    try {
        const { isSignedIn, nextStep } = await useNuxtApp().$Amplify.Auth.confirmSignIn({ 
            challengeResponse: password,
            options: { 
                userAttributes: {
                    given_name: givenName,
                    family_name: familyName,
                    phone_number: phoneNumber,
                },
            },
        })

        if (isSignedIn) {
            return navigateTo({
                path: "/verify-email",
                replace: true, 
            })
        }
        
        switch (nextStep.signInStep) {
        default: throw new Error("Something went wrong")
        }
    } catch (error: Error) {
        console.error(error)

        let messageError: string
        switch (error.name) {
        case "SignInException": messageError = "Your previous session has expired"; break
        default: messageError = error.message
        }
        
        return navigateTo({
            path: "/sign-in",
            query: { "message-error": messageError },
        })
    }
})
</script>

<template>
    <form @submit="onSubmit">
        <Card class="w-96">
            <CardHeader class="grid gap-2 text-center">
                <CardTitle class="text-3xl">
                    Confirm sign in
                </CardTitle>

                <CardDescription class="text-balance text-muted-foreground">
                    Complete the fields below to register your account
                </CardDescription>
            </CardHeader>

            <CardContent class="grid gap-4">
                <FormField v-slot="{ componentField }" name="givenName">
                    <FormItem v-auto-animate>
                        <FormLabel>Given Name</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="John" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="familyName">
                    <FormItem v-auto-animate>
                        <FormLabel>Family Name</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="Doe" />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="phoneNumber">
                    <FormItem v-auto-animate>
                        <FormLabel>Phone Number</FormLabel>

                        <FormControl>
                            <Input v-bind="componentField" placeholder="+12223334444" />
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
                <Button 
                    class="w-full" 
                    type="submit" 
                    :disabled="isSubmitting"
                >
                    <CircleCheckBig v-if="!isSubmitting" class="size-5 mr-2" />
                    <LoaderCircle v-else class="size-5 mr-2 animate-spin" />
                    Confirm sign in
                </Button>
            </CardFooter>
        </Card>
    </form>
</template>
