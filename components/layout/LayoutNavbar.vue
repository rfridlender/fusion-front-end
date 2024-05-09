<script setup lang="ts">
import { 
    CircleUser, 
    HardHat, 
    Home, 
    KeyRound, 
    LayoutDashboard, 
    LogOut, 
    MapPin, 
    Menu, 
    SquareStack, 
    Store, 
    User,
} from "lucide-vue-next"

const route = useRoute()

const routesProtected = [
    {
        displayText: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        displayText: "Address",
        path: "/address",
        icon: MapPin,
    },
    {
        displayText: "Builder",
        path: "/builder",
        icon: HardHat,
    },
    {
        displayText: "Development",
        path: "/development",
        icon: SquareStack,
    },
    {
        displayText: "Lot",
        path: "/lot",
        icon: Home,
    },
    {
        displayText: "Person",
        path: "/person",
        icon: User,
    },
    {
        displayText: "Vendor",
        path: "/vendor",
        icon: Store,
    },
]

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
                <nav class="grid gap-2 text-lg font-medium">
                    <NuxtLink class="flex justify-center" to="https://www.homefusioninstall.com">
                        <img
                            class="w-1/2"
                            src="/assets/home-fusion-logo.png"
                            alt="Modern House"
                        >
                    </NuxtLink>

                    <Separator class="my-4" />

                    <NuxtLink 
                        v-for="routeProtected in routesProtected" 
                        :key="routeProtected.path" 
                        class="flex items-center gap-4 rounded-xl px-3 py-2 
                            transition-all hover:text-foreground"
                        :class="{ 
                            'bg-muted': routeProtected.path === route.path, 
                            'text-muted-foreground': routeProtected.path !== route.path 
                        }"
                        :to="routeProtected.path"
                    >
                        <component :is="routeProtected.icon" class="size-5" />
                        {{ routeProtected.displayText }}
                    </NuxtLink>
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
