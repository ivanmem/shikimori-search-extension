<script lang="ts" setup>


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
  </main>
</template>
