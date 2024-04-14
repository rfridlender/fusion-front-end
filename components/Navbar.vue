<script setup lang="ts">
import { signOut } from "aws-amplify/auth"
import { CircleUser, Home, LineChart, LogOut, Menu, Package, Package2, Search, ShoppingCart, Users } from "lucide-vue-next"

async function onClick() {
    await signOut()
    
    return navigateTo("/sign-in")
}
</script>

<template>
    <header class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
                    <a
                        class="flex items-center gap-2 text-lg font-semibold"
                        href="#"
                    >
                        <Package2 class="size-6" />
                        <span class="sr-only">Acme Inc</span>
                    </a>
                    <a
                        class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        href="#"
                    >
                        <Home class="size-5" />
                        Dashboard
                    </a>
                    <a
                        class="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                        href="#"
                    >
                        <ShoppingCart class="size-5" />
                        Orders
                        <Badge class="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full">
                            6
                        </Badge>
                    </a>
                    <a
                        class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        href="#"
                    >
                        <Package class="size-5" />
                        Products
                    </a>
                    <a
                        class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        href="#"
                    >
                        <Users class="size-5" />
                        Customers
                    </a>
                    <a
                        class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        href="#"
                    >
                        <LineChart class="size-5" />
                        Analytics
                    </a>
                </nav>
                <div class="mt-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upgrade to Pro</CardTitle>
                            <CardDescription>
                                Unlock all features and get unlimited access to our
                                support team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button class="w-full" size="sm">
                                Upgrade
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </SheetContent>
        </Sheet>
        <div class="w-full flex-1">
            <form>
                <div class="relative">
                    <Search class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        class="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                        type="search"
                        placeholder="Search products..."
                    />
                </div>
            </form>
        </div>
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
                <DropdownMenuItem class="cursor-pointer" disabled>
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem class="cursor-pointer" disabled>
                    Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="cursor-pointer" @click="onClick">
                    <LogOut class="size-5 mr-2" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
    </header>
</template>
