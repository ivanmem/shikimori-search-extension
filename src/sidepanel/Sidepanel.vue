<script lang="ts" setup>
import { useArrayUnique } from "@vueuse/core";
import {
  disableExtension,
  hideOriginalLinks,
  pinSearchBlock,
  sitesStorage,
} from "~/logic";
import { templateSearch } from "~/common/consts";
import { getFaviconUrl } from "~/utils/getFaviconUrl";
import { getUrlHost } from "~/utils/getUrlHost";
import { fixUrlProtocol } from "~/utils/fixUrlProtocol";
import { checkTab } from "#platform/checkTab";

const templateSearchValue = "gurren%20lagann";
const templateSearchValueRaw = "gurren lagann";

const suggestions = [
  "/search?query=",
  "/search?q=",
  "/?q=",
  "/query?=",
  "/search/",
  "/search/?text=",
  "/find?query=",
  "/lookup?search=",
  "/forum/tracker.php?nm=",
  "/browse.php?s=",
] as const;

const suggestionTemplates: {
  test: (url: string) => boolean;
  value: (typeof suggestions)[number];
}[] = [
  {
    test: (url: string) => url.includes("yandex."),
    value: "/search/?text=",
  },
  {
    test: (url: string) => url.includes("nyaa."),
    value: "/?q=",
  },
  {
    test: (url: string) => url.includes("tracker.") || url.includes("lab."),
    value: "/forum/tracker.php?nm=",
  },
  {
    test: (url: string) => url.includes("zal."),
    value: "/browse.php?s=",
  },
  {
    test: (url: string) => url.includes("ben."),
    value: "/search/",
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
    checkTab.open(checkSiteAndSuggestionAndTemplate.value);
  }
}

function onSave(site: string) {
  sitesStorage.value.push(site);
  resetAdd();
}

async function nextUrl() {
  try {
    await checkTab.closeIfMatches(checkSiteAndSuggestionAndTemplate.value);
    onCheckNext();
  } catch (error: any) {
    console.error("Error in nextUrl:", error);
  }
}

async function saveCustomUrl() {
  if (customSearchPath.value) {
    sitesStorage.value.push(fixUrlProtocol(customSearchPath.value));
    await checkTab.closeIfMatches(checkSiteAndSuggestionAndTemplate.value);
    resetAdd();
  }
}

const editingSite = ref<string | null>(null);
const editingValue = ref("");
const isEditValid = computed(() => {
  const updated = fixUrlProtocol(editingValue.value);
  if (!updated.includes(templateSearch)) {
    return false;
  }

  return !sitesStorage.value.some(
    (x) => x !== editingSite.value && x === updated,
  );
});

function startEdit(site: string) {
  editingSite.value = site;
  editingValue.value = site;
}

function cancelEdit() {
  editingSite.value = null;
  editingValue.value = "";
}

function saveEdit() {
  if (!isEditValid.value) {
    return;
  }

  const updated = fixUrlProtocol(editingValue.value);
  sitesStorage.value = sitesStorage.value.map((x) =>
    x === editingSite.value ? updated : x,
  );
  cancelEdit();
}

function onDelete() {
  if (!editingSite.value || !confirm(`Удалить ${editingSite.value}?`)) return;

  sitesStorage.value = sitesStorage.value.filter(
    (x) => x !== editingSite.value,
  );
  cancelEdit();
}

function getTemplateUrl(site: string) {
  return site.replace(templateSearch, templateSearchValue);
}
</script>

<template>
  <div class="shiki-search-extension-side-panel">
    <div class="shiki-search-extension-side-panel__form">
      <h1 class="panel-title">Настройки поиска</h1>

      <section class="panel-card">
        <h2 class="panel-card__title">Добавление сайта</h2>
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
      </section>

      <section v-if="sitesStorage.length" class="panel-card save-sites">
        <h2 class="panel-card__title">Сохранённые сайты</h2>
        <div class="save-sites__items">
          <template v-for="site in sitesStorage" :key="site">
            <div class="save-sites__item">
              <VarIcon :name="getFaviconUrl(site)" />
              <VarLink :href="getTemplateUrl(site)" class="site-link">
                {{ getUrlHost(site) }}
              </VarLink>
              <VarButton
                icon-container
                round
                type="primary"
                @click="startEdit(site)"
              >
                <svg
                  class="edit-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"
                  />
                </svg>
              </VarButton>
            </div>
            <Transition>
              <div
                v-if="editingSite === site"
                class="save-sites__edit-wrapper"
              >
                <div class="save-sites__edit">
                  <label :for="`edit-site-${site}`">
                    Полный URL с {{ templateSearch }}
                  </label>
                  <VarInput
                    :id="`edit-site-${site}`"
                    v-model="editingValue"
                    :placeholder="`google.com/search?q=${templateSearch}`"
                    clearable
                    type="text"
                  />
                  <div class="url-row">
                    <VarButton
                      :disabled="!isEditValid"
                      type="success"
                      @click="saveEdit"
                    >
                      Сохранить
                    </VarButton>
                    <VarButton type="danger" @click="onDelete">
                      Удалить
                    </VarButton>
                    <VarButton type="warning" @click="cancelEdit">
                      Отмена
                    </VarButton>
                  </div>
                </div>
              </div>
            </Transition>
          </template>
        </div>
      </section>

      <section class="panel-card">
        <h2 class="panel-card__title">Поведение</h2>
        <div class="behavior-row">
          <div class="behavior-row__text">
            <span class="behavior-row__label">
              Закреплять раздел ссылок вверху страницы
            </span>
            <span class="behavior-row__note">
              Блок со ссылками поиска поднимается в начало колонки
            </span>
          </div>
          <VarSwitch v-model="pinSearchBlock" />
        </div>
        <div class="behavior-row">
          <div class="behavior-row__text">
            <span class="behavior-row__label">
              Скрывать стандартные ссылки Шикимори
            </span>
            <span class="behavior-row__note">
              Убирает встроенные внешние ссылки из блока
            </span>
          </div>
          <VarSwitch v-model="hideOriginalLinks" />
        </div>
        <div class="behavior-row">
          <div class="behavior-row__text">
            <span class="behavior-row__label">Отключить расширение</span>
            <span class="behavior-row__note">
              Полностью останавливает работу на страницах сайта
            </span>
          </div>
          <VarSwitch v-model="disableExtension" />
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.shiki-search-extension-side-panel {
  color-scheme: dark light;
  display: flex;
  overflow: auto;
  flex-direction: column;
  color: var(--color-text) !important;

  * {
    box-sizing: border-box;
  }

  // модалка внедряется прямо в разметку Shikimori, а не в Shadow DOM,
  // поэтому глобальные стили сайта (приглушённый цвет для h3/p) могут
  // просвечивать через каскад — фиксируем цвет текста явно
  h1,
  h2,
  h3,
  h4,
  p,
  label {
    color: inherit !important;
  }

  &__form {
    display: flex;
    overflow: auto;
    padding: 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }

  .panel-title {
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
  }

  .panel-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 12px;
    background: var(--color-surface-container-high);

    &__title {
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 700;
    }
  }

  .behavior-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 0.375rem;

    &__text {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    &__label {
      font-weight: 500;
    }

    &__note {
      font-size: 0.8125rem;
      color: var(--color-text-secondary, #999);
    }
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
    overflow: auto;

    &__items {
      display: flex;
      overflow-y: scroll;
      flex-direction: column;
      scrollbar-gutter: stable both-edges;
      max-height: 320px;
    }

    &__item {
      display: flex;
      overflow: hidden;
      flex-shrink: 0;
      gap: 1rem;
      align-items: center;
      padding-block: 24px;
      padding-right: 18px;
      height: 48px;
    }

    &__edit-wrapper {
      display: grid;
      overflow: hidden;
      flex-shrink: 0;
      grid-template-rows: 1fr;
      opacity: 1;
      transition:
        grid-template-rows 0.25s ease,
        opacity 0.25s ease;

      &.v-enter-from,
      &.v-leave-to {
        grid-template-rows: 0fr;
        opacity: 0;
      }
    }

    &__edit {
      display: flex;
      overflow: hidden;
      min-height: 0;
      flex-direction: column;
      gap: 0.5rem;
      padding-bottom: 1rem;
      padding-right: 18px;

      .url-row {
        gap: 0.5rem;
      }
    }

    .edit-icon {
      width: 1em;
      height: 1em;
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
