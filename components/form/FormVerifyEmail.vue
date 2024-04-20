<script setup lang="ts">
import { BadgeCheck, LoaderCircle } from "lucide-vue-next"
import { z } from "zod"

const route = useRoute()
const messageError = computed(() => route.query["message-error"])

const { pending, refresh } = await useAsyncData("sendUserAttributeVerificationCode", async () => {
    try {
        await useNuxtApp().$Amplify.Auth.sendUserAttributeVerificationCode({ 
            userAttributeKey: "email",
        })
    } catch (error: any) {
        console.error(error)
        
        return navigateTo({
            replace: true,
            path: "/sign-in",
            query: { "message-error": error.message },
        })
    }
}, { lazy: true, server: false })

const schemaVerifyEmail = toTypedSchema(z.object({
    codeConfirmation: code,
}))

const { handleSubmit, isSubmitting, setValues } = useForm({ validationSchema: schemaVerifyEmail })

const onSubmit = handleSubmit(async ({ codeConfirmation }) => {
    try {
        await useNuxtApp().$Amplify.Auth.confirmUserAttribute({ 
            userAttributeKey: "email",
            confirmationCode: codeConfirmation.join(""),
        })
        
        return navigateTo({
            path: "/dashboard",
            query: { "message-success": "Email verified successfully" },
        })
    } catch (error: any) {
        console.error(error)

        switch (error.name) {
        case "CodeMismatchException": return navigateTo({ 
            replace: true, 
            query: { "message-error": error.message },
        })
        default: {
            await useNuxtApp().$Amplify.Auth.signOut()

            return navigateTo({ 
                replace: true, 
                path: "/sign-in", 
                query: { "message-error": error.message }, 
            })
        }
        }
    }
})
</script>

<template>
    <form @submit="onSubmit">
        <Card class="w-96">
            <CardHeader class="grid gap-2 text-center">
                <CardTitle class="text-3xl">
                    Verify email
                </CardTitle>
                <CardDescription class="text-balance text-muted-foreground">
                    Enter the code below that was sent to your email
                </CardDescription>
            </CardHeader>
            <CardContent v-auto-animate class="grid gap-4">
                <FormField v-slot="{ componentField, value }" name="codeConfirmation">
                    <FormItem>
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
                    </FormItem>
                </FormField>
                <p 
                    v-if="messageError"
                    class="w-full text-center text-balance font-medium text-destructive" 
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
                    <BadgeCheck v-if="!isSubmitting" class="size-5 gap-2 mr-2" />
                    <LoaderCircle v-else class="size-5 gap-2 mr-2 animate-spin" />
                    Verify email
                </Button>
                <p v-auto-animate class="w-full flex justify-end items-center gap-1 mt-4 text-sm">
                    <LoaderCircle v-if="pending" class="size-5 animate-spin" />
                    Didn't work?
                    <span 
                        class="underline transition-all hover:text-muted-foreground cursor-pointer" 
                        @click="() => refresh()"
                    >
                        Resend code
                    </span>
                </p>
            </CardFooter>
        </Card>
    </form>
</template>
