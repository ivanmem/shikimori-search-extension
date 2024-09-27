import {ref} from "vue";
import {useEventListener} from "@vueuse/core";

export function useActiveTab() {
    const activeTab = ref(true)

    useEventListener('visibilitychange' as any, (event) => {
        activeTab.value = document.visibilityState === 'visible'
    })

    return activeTab
}