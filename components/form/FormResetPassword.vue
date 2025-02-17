<script setup lang="ts">
import { MailPlus, LoaderCircle } from "lucide-vue-next"

const messageError = computed(() => useRoute().query["message-error"])

const cookieEmail = useCookie("email", { sameSite: true })

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schemaFormResetPassword })

const onSubmit = handleSubmit(async ({ email }) => {
    try {
        const { nextStep } = await useNuxtApp().$Amplify.Auth.resetPassword({ username: email })
        
        switch (nextStep.resetPasswordStep) {
        case "CONFIRM_RESET_PASSWORD_WITH_CODE": {
            cookieEmail.value = email

            return navigateTo("/confirm-reset-password")
        }
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
                    Reset password
                </CardTitle>

                <CardDescription class="text-balance text-muted-foreground">
                    Enter your email below to receive a verification code
                </CardDescription>
            </CardHeader>

            <CardContent class="grid gap-4">
                <FormField v-slot="{ componentField }" name="email">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Email</FormLabel>

                        <FormControl>
                            <Input 
                                v-bind="componentField" 
                                placeholder="john.doe@homefusioninstall.com" 
                            />
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
                    <MailPlus v-if="!isSubmitting" class="size-5 mr-2" />
                    <LoaderCircle v-else class="size-5 mr-2 animate-spin" />
                    Request reset link
                </Button>

                <NuxtLink 
                    class="inline-block ml-auto mt-4 text-sm underline 
                        transition-all hover:text-muted-foreground" 
                    to="/sign-in"
                >
                    Need to sign in?
                </NuxtLink>
            </CardFooter>
        </Card>
    </form>
</template>
