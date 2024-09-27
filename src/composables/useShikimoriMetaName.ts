import { onUnmounted, ref, watch } from "vue";
import { useBrowserLocation, useMutationObserver } from "@vueuse/core";
import { disableExtension } from "~/logic";
import { onWebExtensionStoragesMounted } from "~/composables/useWebExtensionStorage";

export function useShikimoriMetaName() {
  const el = ref<HTMLDivElement | undefined>();
  const location = useBrowserLocation();
  const metaName = ref<string>("");
  let init = false;

  watch(location, updateMetaInfo, { deep: true });

  onWebExtensionStoragesMounted(() => {
    window.addEventListener("popstate", updateMetaInfo);
    document.addEventListener("turbolinks:load", updateMetaInfo);
    updateMetaInfo();
    useMutationObserver(document.body, mutationCallback, {
      childList: true,
      subtree: true,
    });
  });

  onUnmounted(() => {
    window.removeEventListener("popstate", updateMetaInfo);
    document.removeEventListener("turbolinks:load", updateMetaInfo);
  });

  function mutationCallback(mutations: MutationRecord[]) {
    if (disableExtension.value) {
      return;
    }

    const relevantChanges = mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE &&
          ((node as Element).matches('.block, header, meta[itemprop="name"]') ||
            (node as Element).querySelector(
              '.block, header, meta[itemprop="name"]',
            )),
      ),
    );

    if (relevantChanges) {
      updateMetaInfo();
    }
  }

  function updateMetaInfo() {
    metaName.value =
      document.querySelector<HTMLMetaElement>("header > meta[itemprop=name]")
        ?.content ?? "";

    if (disableExtension.value) {
      return;
    }

    const targetEl = document.querySelector<HTMLDivElement>(
      ".block:has(.b-external_link), .block.block-shiki-search-extension",
    );
    const classContains = Boolean(
      targetEl?.classList.contains("block-shiki-search-extension"),
    );
    if (!targetEl || (init && classContains)) {
      el.value = targetEl ?? undefined;
      return;
    }

    if (!classContains) {
      targetEl.classList.add("block-shiki-search-extension");
    }

    targetEl.parentNode?.prepend(targetEl);
    targetEl.querySelectorAll(".b-external_link").forEach((link) => {
      link.remove();
    });
    el.value = targetEl ?? undefined;
    init = true;
  }

  return { el, metaName };
}
