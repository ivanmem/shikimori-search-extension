<script setup lang="ts">

import { metaNameStorage } from "~/logic";

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>Popup</div>
    <SharedSubtitle />

    <button class="btn mt-2" @click="openOptionsPage">
      Открыть параметры
    </button>
    <div class="mt-2">
      <span class="opacity-50">Текущий поиск:</span> {{ metaNameStorage }}
    </div>
  </main>
</template>
