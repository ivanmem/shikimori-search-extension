<script lang="ts" setup>

import {metaNameStorage} from "~/logic";

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main style="padding: 1.25rem 1rem; text-align: center; color: #374151; width: 300px;">
    <Logo/>
    <div>Popup</div>
    <SharedSubtitle/>

    <VarButton style="margin-top: 0.5rem;" @click="openOptionsPage">
      Открыть параметры
    </VarButton>
    <div style="margin-top: 0.5rem;">
      <span style="opacity: 0.5;">Текущий поиск:</span> {{ metaNameStorage }}
    </div>
  </main>
</template>
