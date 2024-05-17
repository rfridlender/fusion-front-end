<script setup lang="ts">
import { Ban, LoaderCircle, ShieldCheck } from "lucide-vue-next"

const messageError = computed(() => useRoute().query["message-error"])

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schemaFormChangePassword })

const onSubmit = handleSubmit(async ({ passwordCurrent, passwordNew }) => {
    try {
        await useNuxtApp().$Amplify.Auth.updatePassword({
            oldPassword: passwordCurrent,
            newPassword: passwordNew,
        })

        return navigateTo({
            path: "/dashboard",
            query: { "message-success": "Password changed successfully" },
        })
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
                    Change password
                </CardTitle>

                <CardDescription class="text-balance text-muted-foreground">
                    Enter your current and new password
                </CardDescription>
            </CardHeader>

            <CardContent class="grid gap-4">
                <FormField v-slot="{ componentField }" name="passwordCurrent">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>Current Password</FormLabel>

                        <FormControl>
                            <FormFieldPassword :component-field="componentField" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="passwordNew">
                    <FormFieldItem v-auto-animate>
                        <FormLabel>New Password</FormLabel>

                        <FormControl>
                            <FormFieldPassword :component-field="componentField" />
                        </FormControl>

                        <FormMessage />
                    </FormFieldItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="passwordNewConfirmation">
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

            <CardFooter class="flex flex-col gap-4">
                <Button 
                    class="w-full" 
                    type="submit" 
                    :disabled="isSubmitting"
                >
                    <ShieldCheck v-if="!isSubmitting" class="size-5 gap-2 mr-2" />
                    <LoaderCircle v-else class="size-5 gap-2 mr-2 animate-spin" />
                    Change password
                </Button>

                <NuxtLink 
                    class="w-full" 
                    :class="{ 'pointer-events-none': isSubmitting }"
                    to="/dashboard"
                >
                    <Button 
                        class="w-full"
                        variant="outline"
                        type="button" 
                        :disabled="isSubmitting"
                    >
                        <Ban class="size-5 gap-2 mr-2" />
                        Cancel
                    </Button>
                </NuxtLink>
            </CardFooter>
        </Card>
    </form>
</template>
