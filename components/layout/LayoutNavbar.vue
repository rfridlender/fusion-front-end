<script setup lang="ts">
import { CircleUser, KeyRound, LogOut, Menu } from "lucide-vue-next"

async function onSignOut() {
    try {
        await useNuxtApp().$Amplify.Auth.signOut()

        return navigateTo("/sign-in")
    } catch (error: any) {
        console.error(error)

        return navigateTo({
            path: "/sign-in",
            query: { "message-error": error.message},
        })
    }
}
</script>

<template>
    <header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4">
        <Sheet>
            <SheetTrigger as-child>
                <Button
                    class="shrink-0 md:hidden"
                    size="icon"
                    variant="outline"
                >
                    <Menu class="size-5" />
                    <span class="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent class="flex flex-col" side="left">
                <nav class="grid gap-2 text-md font-medium">
                    <NuxtLink class="flex justify-center" to="https://www.homefusioninstall.com">
                        <img
                            class="w-1/2"
                            src="/assets/home-fusion-logo.png"
                            alt="Modern House"
                        >
                    </NuxtLink>

                    <Separator class="my-4" />

                    <LayoutNavigationList />
                </nav>
            </SheetContent>
        </Sheet>

        <div class="w-full flex-1" />

        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button
                    class="rounded-full"
                    size="icon"
                    variant="secondary"
                >
                    <CircleUser class="size-5" />
                    <span class="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem disabled>
                    Settings
                </DropdownMenuItem>

                <DropdownMenuItem disabled>
                    Support
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <NuxtLink to="/change-password">
                    <DropdownMenuItem>
                        <KeyRound class="size-5 mr-2" />
                        Change password
                    </DropdownMenuItem>
                </NuxtLink>

                <DropdownMenuItem @click="onSignOut">
                    <LogOut class="size-5 mr-2" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
    </header>
</template>
