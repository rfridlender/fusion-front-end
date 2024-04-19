<template>
    <div class="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <Sidebar />
        <div class="w-screen md:w-[calc(100vw-280px)] flex flex-col">
            <Navbar />
            <slot />
        </div>
    </div>
</template>
