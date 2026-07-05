<script lang="ts" setup>
import { Themes } from "@varlet/ui";
import ContentApp from "~/contentScripts/views/App.vue";
import Sidepanel from "~/sidepanel/Sidepanel.vue";
import { showSettings } from "./state";
</script>

<template>
  <ContentApp show-settings-button @open-settings="showSettings = true" />
  <VarPopup v-model:show="showSettings" position="center" :teleport="false">
    <var-style-provider
      :style-vars="Themes.dark"
      class="shiki-search-extension-userscript-settings"
    >
      <Sidepanel />
    </var-style-provider>
  </VarPopup>
</template>

<style lang="scss">
// собственный светлый фон контейнера попапа просвечивает в углах под тёмной
// модалкой; переменные тёмной темы объявлены внутри var-style-provider и на
// этом уровне ещё недоступны, поэтому просто делаем контейнер прозрачным
.var-popup__content:has(> .shiki-search-extension-userscript-settings) {
  border-radius: 16px;
  background: transparent;
}

.shiki-search-extension-userscript-settings {
  // тема попапа всегда тёмная — рисуем и системные скроллбары тёмными
  color-scheme: dark;
  width: min(480px, 92vw);
  max-height: 85vh;
  overflow: auto;
  border-radius: 16px;
  background: var(--color-body);
}
</style>
