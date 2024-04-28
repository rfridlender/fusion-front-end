import type { Updater } from "@tanstack/vue-table"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Ref } from "vue"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
    ref.value = typeof updaterOrValue === "function" ? updaterOrValue(ref.value) : updaterOrValue
}

export function titlize(str: string) {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
}
