<script lang="ts" setup>
import { disableExtension, sitesStorage } from "~/logic";
import { useShikimoriMetaName } from "~/composables/useShikimoriMetaName";
import { templateSearch } from "~/common/consts";
import { getFaviconUrl } from "~/utils/getFaviconUrl";
import { getUrlHost } from "~/utils/getUrlHost";

defineProps<{ showSettingsButton?: boolean }>();
defineEmits<{ openSettings: [] }>();

const { el, metaName } = useShikimoriMetaName();

const sites = computed(() => {
  return sitesStorage.value
    .filter((href) => href.length > 0)
    .map((href) => {
      const name = escape(metaName.value);
      if (href.includes(templateSearch)) {
        href = href.replace(templateSearch, name);
      } else {
        href += name;
      }

      return {
        href,
        host: getUrlHost(href),
        favicon: getFaviconUrl(href),
      };
    });
});
</script>

<template>
  <teleport v-if="!disableExtension && el" :to="el" defer>
    <div
      v-for="{ href, host, favicon } of sites"
      :key="href"
      class="b-external_link official_site b-menu-line shiki-search-extension"
    >
      <a
        :href="href"
        :style="{ '--b-link-icon': `url(${favicon})` }"
        class="b-link"
      >
        {{ host }}
      </a>
    </div>
    <div
      v-if="showSettingsButton"
      class="b-menu-line shiki-search-extension__settings"
    >
      <a href="#" class="b-link" @click.prevent="$emit('openSettings')">
        ⚙ Настройки поиска
      </a>
    </div>
  </teleport>
</template>

<style lang="scss">
.shiki-search-extension {
  .b-link {
    &::before {
      background: var(--b-link-icon) no-repeat !important;
      background-size: contain !important;
    }
  }
}
</style>
