<script setup lang="ts">
import { LogIn } from "lucide-vue-next"
</script>

<template>
    <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-gray-950">
        <div class="flex items-center justify-center py-12">
            <div class="mx-auto grid w-[350px] gap-6">
                <div class="grid gap-2 text-center">
                    <h1 class="text-3xl font-bold">
                        Sign in
                    </h1>
                    <p class="text-balance text-muted-foreground">
                        Enter your email below to sign in to your account
                    </p>
                </div>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="username@example.com"
                            required
                        />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                            <a
                                href="/forgot-password"
                                class="ml-auto inline-block text-sm underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="password"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        class="w-full"
                        @click="$router.push('/dashboard')"
                    >
                        <LogIn class="h-5 w-5 mr-2" />
                        Sign in
                    </Button>
                    <Button
                        variant="outline"
                        class="w-full"
                    >
                        Sigin in with Google
                    </Button>
                </div>
                <div class="mt-4 text-center text-sm">
                    Don't have an account?
                    <a
                        href="#"
                        class="underline"
                    >
                        Sign up
                    </a>
                </div>
            </div>
        </div>
        <div class="hidden bg-muted lg:block">
            <img
                src="/assets/modern-house.jpeg"
                alt="Modern House"
                class="h-screen w-full object-cover blur-[1.5px]"
            >
        </div>
    </div>
</template>