<template>
    <main class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div class="flex flex-col justify-center items-center gap-12 py-12">
            <img
                class="w-72"
                src="/assets/home-fusion-logo.png"
                alt="Modern House"
            >
            <slot />
        </div>
        <div class="relative hidden lg:block bg-muted ">
            <img
                class="w-full h-screen object-cover border-l"
                src="/assets/modern-house.jpeg"
                alt="Modern House"
            >
            <div class="absolute start=0 top-0 w-full h-screen bg-background opacity-75" />
        </div>
    </main>
</template>
