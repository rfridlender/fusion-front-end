<script setup lang="ts">
import { Icon } from "@iconify/vue"

const counter = useState("counter", () => 0)
const message = useState("message", () => "")

function decrement() {
    if (counter.value === 0) return

    if (counter.value - 1 === 0) message.value = "You're at the bottom of the barrel."

    counter.value = counter.value - 1
}

function increment() {
    if (message.value) message.value = ""

    counter.value = counter.value + 1
}
</script>

<template>
    <div class="w-full h-screen flex flex-col justify-center items-center">
        <Card class="w-[350px]">
            <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div class="grid items-center w-full gap-4">
                        <div class="flex flex-col space-y-1.5">
                            The current count is: {{ counter }}
                        </div>
                        <div class="flex flex-col space-y-1.5 text-red-900">
                            {{ message }}
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter class="flex justify-between px-6 pb-6">
                <Button
                    variant="outline"
                    :disabled="counter === 0"
                    @click="decrement"
                >
                    <Icon icon="ic:baseline-minus" />
                </Button>
                <Button @click="increment">
                    <Icon icon="ic:twotone-plus" />
                </Button>
            </CardFooter>
        </Card>
        <ThemeToggle />
    </div>
</template>
