<template>
    <div class="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <LayoutSidebar />
        
        <div class="w-screen md:w-[calc(100vw-280px)] flex flex-col">
            <LayoutNavbar />
            <slot />
        </div>
    </div>
</template>
