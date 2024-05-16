<script setup lang="ts">
import { 
    Boxes,
    HardHat,
    Home,
    LayoutDashboard,
    Map,
    MapPin,
    SquareStack,
    Store,
    User,
    Warehouse,
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
        displayText: "Item",
        path: "/item",
        icon: Boxes,
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
        displayText: "Project",
        path: "/project",
        icon: Map,
    },
    {
        displayText: "Vendor",
        path: "/vendor",
        icon: Store,
    },
    {
        displayText: "Warehouse",
        path: "/warehouse",
        icon: Warehouse,
    },
]
</script>

<template>
    <NuxtLink 
        v-for="routeProtected in routesProtected" 
        :key="routeProtected.path" 
        class="flex items-center gap-3 rounded-lg px-3 py-2 
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
</template>