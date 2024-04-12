<template>
    <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div class="flex flex-col">
            <Navbar />
            <slot />
        </div>
    </div>
</template>
