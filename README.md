# WebExtension Vite Стартер

A [Vite](https://vitejs.dev/) powered WebExtension ([Chrome](https://developer.chrome.com/docs/extensions/reference/), [FireFox](https://addons.mozilla.org/en-US/developers/), etc.) стартовый шаблон.

<p align="center">
<sub>Popup</sub><br/>
<img width="655" src="https://user-images.githubusercontent.com/11247099/126741643-813b3773-17ff-4281-9737-f319e00feddc.png"><br/>
<sub>Options Page</sub><br/>
<img width="655" src="https://user-images.githubusercontent.com/11247099/126741653-43125b62-6578-4452-83a7-bee19be2eaa2.png"><br/>
<sub>Inject Vue App into the Content Script</sub><br/>
<img src="https://user-images.githubusercontent.com/11247099/130695439-52418cf0-e186-4085-8e19-23fe808a274e.png">
</p>

## Функции

- ⚡️ **Instant HMR** - используйте **Vite** на dev (больше никаких обновлений!)
- 🥝 Vue 3 - API композиции, синтаксис [`<script setup>`](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md) и многое другое!
- 💬 Эффективные коммуникации - на базе [`webext-bridge`](https://github.com/antfu/webext-bridge) и хранилища [VueUse](https://github.com/antfu/vueuse)
- 🦾 [TypeScript](https://www.typescriptlang.org/) - безопасность типов
- 📦 [Автоматический импорт компонентов](./src/components)
- 🌟 [Icons](./src/components) - прямой доступ к иконкам из любого набора иконок
- 🖥 Скрипт контента - Используйте Vue даже в скрипте контента
- 🌍 WebExtension - изоморфное расширение для Chrome, Firefox и др.
- 📃 Динамический `manifest.json` с полной поддержкой типов

## Предварительно упакованный

### WebExtension Libraries

- [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) - API браузера WebExtension Polyfill с типами
- [`webext-bridge`](https://github.com/antfu/webext-bridge) - легкая связь между контекстами

### Vite Plugins

- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Используйте `browser` и Vue Composition API напрямую без импорта.
- [`unplugin-vue-components`](https://github.com/antfu/vite-plugin-components) - автоимпорт компонентов
- [`unplugin-icons`](https://github.com/antfu/unplugin-icons) - иконки как компоненты
  - [Iconify](https://iconify.design) - используйте иконки из любых наборов [🔍Icônes](https://icones.netlify.app/)

### Vue Plugins

- [VueUse](https://github.com/antfu/vueuse) - коллекция полезных API-интерфейсов композиции

### Coding Style

- Используйте API композиции с [`<script setup>` SFC синтаксисом](https://github.com/vuejs/rfcs/pull/227)
- [ESLint](https://eslint.org/) with [@antfu/eslint-config](https://github.com/antfu/eslint-config), single quotes, no semi

### Dev tools

- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.js.org/) - быстрый, экономящий место на диске менеджер пакетов
- [esno](https://github.com/antfu/esno) - Среда выполнения узла TypeScript/ESNext на базе esbuild
- [npm-run-all](https://github.com/mysticatea/npm-run-all) - Запуск нескольких npm-скриптов параллельно или последовательно
- [web-ext](https://github.com/mozilla/web-ext) - Оптимизированный опыт разработки веб-расширений

## Используйте шаблон

### Шаблон GitHub

[Создайте репозиторий из этого шаблона на GitHub](https://github.com/antfu/vitesse-webext/generate).

### Клонировать на локальную версию

Если вы предпочитаете делать это вручную с более чистой историей git

> Если у вас не установлен pnpm, выполните: npm install -g pnpm

```bash
npx degit antfu/vitesse-webext my-webext
cd my-webext
pnpm i
```

## Usage

### Folders

- `src` - основной источник.
  - `contentScript` — скрипты и компоненты, которые будут внедрены как `content_script`
  - `background` - скрипты для фона.
  - `компоненты` — автоматически импортированные компоненты Vue, которые доступны во всплывающем окне и на странице параметров.
  - `styles` - стили, используемые во всплывающем окне и на странице настроек.
  - `assets` — активы, используемые в компонентах Vue.
  - `manifest.ts` — манифест расширения.
- `extension` - корень пакета расширения.
  - `assets` — статические активы (в основном для `manifest.json`).
  - `dist` — встроенные файлы, также служат заглушкой для Vite при разработке.
- `scripts` - вспомогательные скрипты разработки и комплектации.

### Разработка

```bash
pnpm dev
```

Затем **загрузите расширение в браузер с папкой `extension/`**.

Разработчики Firefox могут вместо этого запустить следующую команду:

```bash
pnpm dev-firefox
```

`web-ext` автоматически перезагружает расширение при изменении файлов `extension/`.

> В то время как Vite в большинстве случаев обрабатывает HMR автоматически, [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) по-прежнему рекомендуется для более чистой жесткой перезагрузки.

## Использование Gitpod

Если у вас есть веб-браузер, вы можете получить полностью предварительно настроенную среду разработки одним щелчком мыши:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/antfu/vitesse-webext)

### Сборка

Чтобы собрать расширение, запустите

```bash
pnpm build
```

А затем упакуйте файлы в «расширение», вы можете загрузить `extension.crx` или `extension.xpi` в соответствующее хранилище расширений.

## Credits

[![Volta](https://user-images.githubusercontent.com/904724/195351818-9e826ea9-12a0-4b06-8274-352743cd2047.png)](https://volta.net)

This template is originally made for the [volta.net](https://volta.net) browser extension.

## Variations

This is a variant of [Vitesse](https://github.com/antfu/vitesse), check out the [full variations list](https://github.com/antfu/vitesse#variations).
