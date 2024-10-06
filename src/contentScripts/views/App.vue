<script lang="ts" setup>
import 'uno.css'
import { disableExtension, sitesStorage } from "~/logic";
import { useShikimoriMetaName } from "~/composables/useShikimoriMetaName";

const { el, metaName } = useShikimoriMetaName()

const sites = computed(() => sitesStorage.value.map(url => {
  try {
    return new URL(url + escape(metaName.value));
  } catch (e) {
    console.log({ e })
    return { host: 'error' }
  }
}))
</script>

<template>
  <teleport v-if="!disableExtension && el" :to="el" defer>
    <div v-for="site of sites" :key="site.toString()" class="b-external_link official_site b-menu-line shiki-search-extension">
      <a
          v-if="site"
          :href="site.toString()"
          class="b-link"
      >
        {{ site.host }}
      </a>
    </div>
  </teleport>
</template>
<style lang="scss">
</style>
