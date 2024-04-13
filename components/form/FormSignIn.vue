<script setup lang="ts">
import { LoaderCircle, LogIn } from "lucide-vue-next"
import { z } from "zod"

const messageError = useState("error", () => "")

const schemaSignIn = toTypedSchema(z.object({
    email: schemas.email,
    password: schemas.password,
}))

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schemaSignIn })

const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
        const { isSignedIn, nextStep } = await useNuxtApp().$Amplify.Auth.signIn({ username: email, password: password })
        
        if (isSignedIn) {
            return navigateTo("/dashboard")
        }
        
        switch(nextStep.signInStep) {
        case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":  return navigateTo("/confirm-sign-in")
        default: throw new Error("Something went wrong")
        }
    } catch (error: Error) {
        console.log(error)

        messageError.value = error.message
    }
})
</script>

<template>
    <form @submit="onSubmit">
        <Card class="w-84">
            <CardHeader class="grid gap-2 text-center">
                <CardTitle class="text-3xl font-bold">
                    Sign in
                </CardTitle>
                <CardDescription class="text-balance text-muted-foreground">
                    Enter your email below to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent v-auto-animate class="grid gap-4">
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <FormFieldPassword :component-field="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <p 
                    v-if="messageError"
                    class="w-full text-balance font-medium text-destructive" 
                    role="alert"
                >
                    {{ messageError }}
                </p>
            </CardContent>
            <CardFooter class="flex flex-col">
                <Button 
                    class="w-full" 
                    type="submit" 
                    :disabled="isSubmitting"
                >
                    <LogIn v-if="!isSubmitting" class="size-5 gap-2 mr-2" />
                    <LoaderCircle v-else class="size-5 gap-2 mr-2 animate-spin" />
                    Sign in
                </Button>
                <a class="inline-block ml-auto mt-4  text-sm underline" href="/forgot-password">
                    Forgot your password?
                </a>
            </CardFooter>
        </Card>
    </form>
</template>
