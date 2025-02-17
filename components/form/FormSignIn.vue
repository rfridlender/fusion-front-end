<script setup lang="ts">
import { LoaderCircle, LogIn } from "lucide-vue-next"

const messageError = computed(() => useRoute().query["message-error"])

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schemaFormSignIn })

const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
        const { isSignedIn, nextStep } = await useNuxtApp().$Amplify.Auth.signIn({ 
            username: email, 
            password: password,
        })
        
        if (isSignedIn) {
            return navigateTo("/dashboard")
        }
        
        switch (nextStep.signInStep) {
        case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED": return navigateTo("/confirm-sign-in")
        default: throw new Error("Something went wrong")
        }
    } catch (error: any) {
        console.error(error)

        return navigateTo({ 
            query: { "message-error": error.message },
            replace: true, 
        })
    }
})
</script>

<template>
    <form @submit="onSubmit">
        <Card class="w-96">
            <CardHeader class="grid gap-2 text-center">
                <CardTitle class="text-3xl">
                    Sign in
                </CardTitle>

                <CardDescription class="text-balance text-muted-foreground">
                    Enter your email below to sign in to your account
                </CardDescription>
            </CardHeader>

            <CardContent v-auto-animate class="grid gap-4">
                <FormField v-slot="{ componentField }" name="email">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Email</FormLabel>

                        <FormControl>
                            <Input 
                                v-bind="componentField" 
                                type="email" 
                                placeholder="john.doe@homefusioninstall.com" 
                            />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="password">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Password</FormLabel>
                        
                        <FormControl>
                            <FormFieldPassword :component-field="componentField" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
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
                    <LogIn v-if="!isSubmitting" class="size-5 mr-2" />
                    <LoaderCircle v-else class="size-5 mr-2 animate-spin" />
                    Sign in
                </Button>
                
                <NuxtLink 
                    class="inline-block ml-auto mt-4 text-sm underline 
                        transition-all hover:text-muted-foreground" 
                    to="/reset-password"
                >
                    Forgot your password?
                </NuxtLink>
            </CardFooter>
        </Card>
    </form>
</template>
