<script lang="ts" setup>
import { Themes } from "@varlet/ui";
import ContentApp from "~/contentScripts/views/App.vue";
import Sidepanel from "~/sidepanel/Sidepanel.vue";
import { showSettings } from "./state";
</script>

<template>
  <ContentApp show-settings-button @open-settings="showSettings = true" />
  <VarPopup v-model:show="showSettings" position="center" teleport="body">
    <var-style-provider
      :style-vars="Themes.dark"
      class="shiki-search-extension-userscript-settings"
    >
      <Sidepanel />
    </var-style-provider>
  </VarPopup>
</template>

<style lang="scss">
.shiki-search-extension-userscript-settings {
  width: min(480px, 92vw);
  max-height: 85vh;
  overflow: auto;
  background: var(--color-body);
}
</style>
