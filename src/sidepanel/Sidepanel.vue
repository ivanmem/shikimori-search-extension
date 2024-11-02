<script lang="ts" setup>
import { useArrayUnique } from "@vueuse/core";
import { disableExtension, sitesStorage } from "~/logic";
import { templateSearch } from "~/common/consts";
import { getFaviconUrl } from "~/utils/getFaviconUrl";
import { isUrlEqual } from "~/utils/isUrlEqual";
import { getUrlHost } from "~/utils/getUrlHost";
import { fixUrlProtocol } from "~/utils/fixUrlProtocol";

const templateSearchValue = "gurren%20lagann";
const templateSearchValueRaw = "gurren lagann";
const suggestions = [
  "/search?q=",
  "/search?query=",
  "/find?query=",
  "/lookup?search=",
  "/query?=",
  "/forum/tracker.php?nm=",
];
const suggestionTemplates = [
  {
    test: (url: string) => url.includes("tracker.") || url.includes("lab."),
    value: "/forum/tracker.php?nm=",
  },
];

const newSite = ref("");
const checkIndex = ref(0);
const checkSite = ref("");
const checkSuggestion = ref("");
const checkSiteAndSuggestion = computed(
  () => `${checkSite.value}${checkSuggestion.value}`,
);
const checkSiteAndSuggestionAndTemplate = computed(
  () => checkSiteAndSuggestion.value + templateSearchValue,
);
const checkSuggestions = useArrayUnique(() => [
  ...suggestionTemplates
    .filter((x) => x.test(checkSite.value))
    .map((x) => x.value),
  ...suggestions,
]);
const customSearchPath = ref("");

function getNextSuggestion() {
  const suggestion = checkSuggestions.value[checkIndex.value];
  checkIndex.value++;
  return suggestion;
}

function addSite() {
  let site = newSite.value;
  if (!site) {
    return;
  }

  resetAdd();
  site = fixUrlProtocol(site);

  if (site.includes(templateSearch)) {
    onSave(site);
    return;
  }

  checkSite.value = site;
  onCheckNext();
}

function resetAdd() {
  newSite.value = "";
  checkSite.value = "";
  checkIndex.value = 0;
  checkSuggestion.value = "";
  customSearchPath.value = "";
}

function onCheckNext() {
  checkSuggestion.value = getNextSuggestion();
  if (checkSuggestion.value) {
    window.open(checkSiteAndSuggestionAndTemplate.value, "_blank");
  }
}

function onSave(site: string) {
  sitesStorage.value.push(site);
  resetAdd();
}

declare const chrome: any;

async function removeTab() {
  const api = browser || chrome;
  const [tab] = await api.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  if (!tab?.id) return;

  const { url, pendingUrl } = tab;

  if (
    (url && isUrlEqual(checkSiteAndSuggestionAndTemplate.value, url)) ||
    (pendingUrl &&
      isUrlEqual(checkSiteAndSuggestionAndTemplate.value, pendingUrl)) ||
    (!pendingUrl && url === "about:blank")
  ) {
    await api.tabs.remove(tab.id);
  }
}

async function nextUrl() {
  try {
    await removeTab();
    onCheckNext();
  } catch (error: any) {
    console.error("Error in nextUrl:", error);
  }
}

async function saveCustomUrl() {
  if (customSearchPath.value) {
    sitesStorage.value.push(fixUrlProtocol(customSearchPath.value));
    await removeTab();
    resetAdd();
  }
}

function onDelete(site: string) {
  if (!confirm(`Удалить ${site}?`)) return;

  sitesStorage.value = sitesStorage.value.filter((x) => x !== site);
}

function getTemplateUrl(site: string) {
  return site.replace(templateSearch, templateSearchValue);
}
</script>

<template>
  <div class="shiki-search-extension-side-panel">
    <div class="shiki-search-extension-side-panel__form">
      <div class="form-group">
        <h1 class="header-1">Введите URL сайта</h1>
        <label for="new-site">
          Например: google.com/search?q={{ templateSearch }}
        </label>
        <div class="url-row">
          <VarInput
            id="new-site"
            v-model="newSite"
            :placeholder="`google.com/search?q=${templateSearch}`"
            clearable
            type="text"
          />
          <VarButton
            :disabled="!newSite.length"
            type="success"
            @click="addSite"
          >
            Добавить
          </VarButton>
        </div>
      </div>
      <VarDivider />
      <div v-if="checkSuggestion" class="url-suggestion">
        <h3>
          Ваша ссылка не содержит {{ templateSearch }}, поэтому попробуем
          подобрать ссылку автоматически. Попытка поиска:<br />
          {{ checkSiteAndSuggestion + templateSearch }} <br />
          Нашёлся ли {{ templateSearchValueRaw }}?
        </h3>

        <div style="display: flex; gap: 0.5rem">
          <VarButton type="primary" @click="onSave(checkSiteAndSuggestion)">
            Да
          </VarButton>
          <VarButton type="warning" @click="nextUrl"> Нет</VarButton>
          <VarButton type="danger" @click="resetAdd()"> Отмена</VarButton>
        </div>
      </div>
      <div
        v-if="checkIndex > checkSuggestions.length"
        style="padding-top: 0.5rem"
      >
        <h3>Все предсказанные варианты не сработали :(</h3>
        <p>
          Пожалуйста, введите полную ссылку (без текста или с таким же как в
          примере). Пример:
          <code> google.com/search?q={{ templateSearch }} </code>
        </p>

        <div class="url-row">
          <VarInput
            v-model="customSearchPath"
            placeholder="Полный путь"
            type="text"
          />
          <VarButton type="primary" @click="saveCustomUrl">
            Сохранить
          </VarButton>
        </div>
      </div>
      <div v-if="sitesStorage.length" class="save-sites">
        <h2 class="header-2">Сохранённые сайты</h2>
        <div class="save-sites__items">
          <template v-for="site in sitesStorage" :key="site">
            <div class="save-sites__item">
              <VarIcon :name="getFaviconUrl(site)" />
              <VarLink :href="getTemplateUrl(site)" class="site-link">
                {{ getUrlHost(site) }}
              </VarLink>
              <VarButton icon-container round type="danger">
                <VarIcon name="close-circle" @click="onDelete(site)"></VarIcon>
              </VarButton>
            </div>
          </template>
        </div>
      </div>

      <VarCheckbox v-model="disableExtension" style="padding-top: 0.5rem">
        Отключить расширение
      </VarCheckbox>
    </div>
  </div>
</template>

<style lang="scss">
.shiki-search-extension-side-panel {
  color-scheme: dark light;
  display: flex;
  overflow: auto;
  flex-direction: column;

  * {
    box-sizing: border-box;
  }

  &__form {
    display: flex;
    overflow: auto;
    padding: 1rem;
    flex-direction: column;
  }

  .header-1 {
    font-size: 1.125rem;
    font-weight: 700;
    text-align: center;
  }

  .header-2 {
    padding-top: 1.25rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 700;
    text-align: center;
  }

  .url-row {
    display: flex;
    padding-top: 0.5rem;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    .var-input {
      width: 100%;
    }
  }

  .save-sites {
    display: flex;
    overflow: auto;
    flex-direction: column;
    gap: 0.75rem;

    &__items {
      display: flex;
      overflow-y: scroll;
      flex-direction: column;
      scrollbar-gutter: stable both-edges;
      height: 200px;
    }

    &__item {
      display: flex;
      overflow: hidden;
      gap: 1rem;
      align-items: center;
      padding-block: 24px;
      padding-right: 18px;
      height: 48px;
    }

    .site-link {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-grow: 1;
      justify-content: flex-start;
      font-weight: 700;
    }
  }

  .url-suggestion {
    display: flex;
    flex-direction: column;
    justify-self: start;
    align-self: flex-start;
  }
}
</style>
