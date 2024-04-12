<script setup lang="ts">

</script>

<template>
    <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-gray-950">
        <div class="flex flex-col justify-center items-center gap-12 py-12">
            <img
                class="w-72"
                src="/assets/home-fusion.png"
                alt="Modern House"
            >
            <FormSignIn />
        </div>
        <div class="hidden bg-muted lg:block">
            <img
                class="h-screen w-full object-cover border-l"
                src="/assets/modern-house.jpeg"
                alt="Modern House"
            >
        </div>
    </div>
</template>
