<script lang="ts" setup>
// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }

import { disableExtension, metaNameStorage, sitesStorage } from "~/logic";

const templateSearch = "gurren%20lagann"
const suggestions = [
  '/search?q=',
  '/search?query=',
  '/find?query=',
  '/lookup?search=',
  '/query?=',
]
const suggestionTemplates = [
  {
    test: (url: string) => url.includes('tracker.'),
    value: '/forum/tracker.php?nm=',
  },
]

const newSite = ref('')
const checkIndex = ref(0)
const checkSite = ref('')
const checkSuggestion = ref('')
const checkSiteAndSuggestion = computed(() => `${checkSite.value}${checkSuggestion.value}`)
const checkSuggestions = computed<string[]>(() => [...suggestionTemplates.filter(x => x.test(checkSite.value)).map(x => x.value), ...suggestions])

const tab = ref<any>()

const customSearchPath = ref('')


function getNextSuggestion() {
  const suggestion = checkSuggestions.value[checkIndex.value]
  checkIndex.value++
  return suggestion
}

function addSite() {
  let site = newSite.value
  if (!site) {
    return
  }

  if (!site.startsWith('http://') && !site.startsWith('https://')) {
    site = `https://${site}`
  }

  resetAdd()
  checkSite.value = site
  onCheckNext()
}

function resetAdd() {
  newSite.value = ''
  checkSite.value = ''
  checkIndex.value = 0
  checkSuggestion.value = ''
}

function onCheckNext() {
  checkSuggestion.value = getNextSuggestion()
  if (checkSuggestion.value) {
    window.open(checkSiteAndSuggestion.value + templateSearch, '_blank')
  }
}

function onSave() {
  sitesStorage.value.push(checkSiteAndSuggestion.value)
  resetAdd()
}

declare const chrome: any;

async function nextUrl() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (checkSiteAndSuggestion.value === tab.url || checkSiteAndSuggestion.value === tab.pendingUrl) {
    chrome.tabs.remove(tab.id);
  }

  onCheckNext()
}

function saveCustomUrl() {
  if (customSearchPath.value) {
    sitesStorage.value.push(customSearchPath.value)
    customSearchPath.value = ''
  }
}

// chrome.storage.sync.get('sites', (result) => {
//   if (result.sites) {
//     sites.value = result.sites
//   }
// })
</script>

<template>
  <main class="w-full px-4 py-5 text-gray-700">
    <Logo/>
    <h3 class="text-center">Поисковое Расширение для Shikimori</h3>
    <div class="popup">
      <div class="form-group">
        <div class="flex gap-2 mb-1">
          <label class="flex m-0!" for="disable">Отключить расширение</label>
          <input id="disable" v-model="disableExtension" type="checkbox">
        </div>

        <label for="new-site">Введите URL сайта</label>
        <input id="new-site" v-model="newSite" placeholder="https://example.com" type="text">
        <button @click="addSite">
          Добавить
        </button>
      </div>

      <div v-if="sitesStorage.length">
        <h3>Список сайтов:</h3>
        <ul>
          <li v-for="(site, index) in sitesStorage" :key="index">
            {{ site }}
            <button @click="sitesStorage = sitesStorage.filter(x => x !== site)">
              Удалить
            </button>
          </li>
        </ul>
      </div>

      <div v-if="checkSuggestion" class="flex self-start justify-self-start flex-col gap-col-1">
        <h3>Попытка поиска:<br/> {{ checkSiteAndSuggestion + templateSearch }} <br> Хотите сохранить этот вариант?</h3>
        <div class="flex gap-col-2">
          <button @click="onSave">
            Cохранить
          </button>
          <button @click="nextUrl">
            Нет
          </button>
        </div>
      </div>

      <div v-if="checkIndex > checkSuggestions.length">
        <h3>Все предсказанные варианты не сработали :(</h3>
        <p>Пожалуйста, введите полную ссылку. Пример: <code>https://example.com/search?q={{ templateSearch }}</code>
        </p>
        <input v-model="customSearchPath" placeholder="Полный путь" type="text">
        <button @click="saveCustomUrl">
          Сохранить
        </button>
      </div>

      <div>
        tab: {{ tab }}
        <br>
        checkSiteAndSuggestion: {{ checkSiteAndSuggestion }}
        <br>
        metaNameStorage: {{ metaNameStorage }}
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.popup {
  padding: 20px;
  font-family: Arial, sans-serif;

  .form-group {
    margin-bottom: 10px;

    label {
      display: block;
      margin-bottom: 5px;
    }

    input[type="text"] {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }

  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin-bottom: 10px;
    }
  }

  code {
    background-color: #f1f1f1;
    padding: 2px 4px;
    border-radius: 4px;
  }
}
</style>
