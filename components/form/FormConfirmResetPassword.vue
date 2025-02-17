<script setup lang="ts">
import { LockKeyholeOpen, LoaderCircle } from "lucide-vue-next"

const messageError = computed(() => useRoute().query["message-error"])

const cookieEmail = useCookie("email")

const { handleSubmit, isSubmitting, setValues } = useForm({ 
    validationSchema: schemaFormConfirmResetPassword,
})

const onSubmit = handleSubmit(async ({ codeConfirmation, password }) => {
    try {
        if (!cookieEmail.value) {return navigateTo({
            path: "/sign-in",
            query: { "message-error": "Your previous session has expired" },
        })}

        await useNuxtApp().$Amplify.Auth.confirmResetPassword({
            username: cookieEmail.value,
            confirmationCode: codeConfirmation.join(""),
            newPassword: password,
        })

        cookieEmail.value = null

        return navigateTo({
            path: "/sign-in",
            query: { "message-success": "Reset password successfully" },
        })
    } catch (error: any) {
        console.error(error)

        let isAbleToRetry: boolean
        switch (error.name) {
        case "CodeMismatchException": isAbleToRetry = true; break
        case "ExpiredCodeException": isAbleToRetry = true; break
        default: isAbleToRetry = false
        }

        if (isAbleToRetry) {
            return navigateTo({ 
                query: { "message-error": error.message },
                replace: true, 
            })
        } else {
            cookieEmail.value = null

            return navigateTo({ 
                path: "/sign-in",
                query: { "message-error": error.message },
                replace: true, 
            })
        }
    }
})
</script>

<template>
    <form @submit="onSubmit">
        <Card class="w-96">
            <CardHeader class="grid gap-2 text-center">
                <CardTitle class="text-3xl">
                    Confirm reset password
                </CardTitle>

                <CardDescription class="text-balance text-muted-foreground">
                    Enter the code below that was sent to your email
                </CardDescription>
            </CardHeader>

            <CardContent class="grid gap-4">
                <FormField v-slot="{ componentField, value }" name="codeConfirmation">
                    <FormFieldItem v-auto-animate>
                        <FormControl>
                            <PinInput
                                id="codeConfirmation"
                                v-model="value!"
                                placeholder="○"
                                class="flex gap-2 justify-center items-center mt-1"
                                otp
                                type="number"
                                :name="componentField.name"
                                @update:model-value="(arrStr) => 
                                    setValues({ codeConfirmation: arrStr.filter(Boolean) })"
                            >
                                <PinInputGroup>
                                    <PinInputInput
                                        v-for="(id, index) in 6"
                                        :key="id"
                                        :index="index"
                                        class="bg-background"
                                    />
                                </PinInputGroup>
                            </PinInput>
                        </FormControl>

                        <FormMessage class="text-center" />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="password">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>New Password</FormLabel>

                        <FormControl>
                            <FormFieldPassword :component-field="componentField" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="passwordConfirmation">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Confirm New Password</FormLabel>

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
                    <LockKeyholeOpen v-if="!isSubmitting" class="size-5 mr-2" />
                    <LoaderCircle v-else class="size-5 mr-2 animate-spin" />
                    Reset password
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
