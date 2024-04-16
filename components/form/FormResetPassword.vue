<script setup lang="ts">
import { MailPlus, LoaderCircle } from "lucide-vue-next"
import { z } from "zod"

const route = useRoute()
const messageError = computed(() => route.query["message-error"])

const cookieEmail = useCookie("email", { sameSite: true })

const schemaResetPassword = toTypedSchema(z.object({
    email: schemas.email,
}))

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schemaResetPassword })

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
    } catch (error: Error) {
        console.log(error)

        return navigateTo({ replace: true, query: { "message-error": error.message }})
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
                    <FormItem v-auto-animate>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" placeholder="john.doe@homefusioninstall.com" />
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
                    <MailPlus v-if="!isSubmitting" class="size-5 gap-2 mr-2" />
                    <LoaderCircle v-else class="size-5 gap-2 mr-2 animate-spin" />
                    Request reset link
                </Button>
                <NuxtLink 
                    class="inline-block ml-auto mt-4 text-sm underline transition-all hover:text-muted-foreground cursor-pointer" 
                    to="/sign-in"
                >
                    Need to sign in?
                </NuxtLink>
            </CardFooter>
        </Card>
    </form>
</template>
