import { onUnmounted, ref, watch } from 'vue'
import { useBrowserLocation, useMutationObserver } from '@vueuse/core'
import { disableExtension, metaNameStorage } from "~/logic";
import { onWebExtensionStoragesMounted } from "~/composables/useWebExtensionStorage";

export function useShikimoriMetaName() {
    const el = ref<HTMLDivElement | undefined>()
    const location = useBrowserLocation()

    watch(location, handleUrlChange, { deep: true })

    onWebExtensionStoragesMounted(() => {
        window.addEventListener('popstate', handleUrlChange)
        document.addEventListener('turbolinks:load', handleUrlChange)
        updateMetaInfo()
        useMutationObserver(document.body, mutationCallback, {
            childList: true,
            subtree: true,
        })
    })

    onUnmounted(() => {
        window.removeEventListener('popstate', handleUrlChange)
        document.removeEventListener('turbolinks:load', handleUrlChange)
    })


    function mutationCallback(mutations: MutationRecord[]) {
        if (disableExtension.value) {
            return
        }

        const relevantChanges = mutations.some(mutation =>
            Array.from(mutation.addedNodes).some(node =>
                node.nodeType === Node.ELEMENT_NODE &&
                (
                    (node as Element).matches('.block, header, meta[itemprop="name"]') ||
                    (node as Element).querySelector('.block, header, meta[itemprop="name"]')
                ),
            ),
        )

        if (relevantChanges) {
            updateMetaInfo()
        }
    }

    function handleUrlChange() {
        updateMetaInfo()
    }

    function updateMetaInfo() {
        if (disableExtension.value) {
            return
        }

        const targetEl = document.querySelector<HTMLDivElement>('.block:has(.b-external_link), .block.block-shiki-search-extension')
        if (!targetEl || targetEl.classList.contains('block-shiki-search-extension')) {
            el.value = targetEl ?? undefined
            return
        }

        targetEl.classList.add('block-shiki-search-extension')
        targetEl.parentNode?.prepend(targetEl)
        targetEl.querySelectorAll('.b-external_link').forEach(link => {


            console.log('removed', link.className)
            link.remove();
        })

        metaNameStorage.value = document.querySelector<HTMLMetaElement>("header > meta[itemprop=name]")?.content ?? ''
        el.value = targetEl ?? undefined
    }

    return { el, metaName: metaNameStorage }
}

