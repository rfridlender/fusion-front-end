<script setup lang="ts">
import { LockKeyholeOpen, LoaderCircle } from "lucide-vue-next"
import { z } from "zod"

const route = useRoute()

const messageError = computed(() => route.query["message-error"])

const schemaConfirmResetPassword = toTypedSchema(z.object({
    email: schemas.email,
    codeConfirmation: schemas.code,
    password: schemas.password,
    passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords must match",
}),
)
const { handleSubmit, isSubmitting, setValues } = useForm({ validationSchema: schemaConfirmResetPassword })

const onSubmit = handleSubmit(async ({ email, codeConfirmation, password }) => {
    try {
        await useNuxtApp().$Amplify.Auth.confirmResetPassword({
            username: email,
            confirmationCode: codeConfirmation.join(""),
            newPassword: password,
        })

        return navigateTo({
            path: "/sign-in",
            query: { "message-success": "Reset password successfully" },
        })
    } catch (error: any) {
        console.log(error)

        switch (error.name) {
        case "CodeMismatchException": return navigateTo({ 
            replace: true, 
            query: { "message-error": error.message },
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
                    Enter a new password for your account
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
                <FormField v-slot="{ componentField, value }" name="codeConfirmation">
                    <FormItem v-auto-animate>
                        <FormLabel>Confirmation Code</FormLabel>
                        <FormControl>
                            <PinInput
                                id="codeConfirmation"
                                v-model="value!"
                                placeholder="○"
                                class="flex gap-2 justify-center items-center mt-1"
                                otp
                                type="number"
                                :name="componentField.name"
                                @update:model-value="(arrStr) => setValues({ codeConfirmation: arrStr.filter(Boolean) })"
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
                <FormField v-slot="{ componentField }" name="password">
                    <FormItem v-auto-animate>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                            <FormFieldPassword :component-field="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="passwordConfirmation">
                    <FormItem v-auto-animate>
                        <FormLabel>Confirm New Password</FormLabel>
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
                    <LockKeyholeOpen v-if="!isSubmitting" class="size-5 gap-2 mr-2" />
                    <LoaderCircle v-else class="size-5 gap-2 mr-2 animate-spin" />
                    Reset password
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
