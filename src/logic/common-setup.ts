import type { App } from 'vue'
import Varlet, { StyleProvider, Themes } from "@varlet/ui";

export interface SetupAppOptions {
  /** userscript применяет тему локально (var-style-provider вокруг модалки), чтобы не перекрашивать CSS-переменные страницы Shikimori */
  context?: 'userscript'
}

export function setupApp(app: App, options: SetupAppOptions = {}) {
  // Внедрить глобально доступный объект $app в шаблон.
  app.config.globalProperties.$app = {
    context: options.context ?? '',
  }

  // Предоставьте доступ к приложению в настройке скрипта с помощью `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  // Здесь вы сможете установить дополнительные плагины для всех контекстов: всплывающего окна, страницы параметров и контент-скрипта.
  // example: app.use(i18n)
  // example excluding content-script context: if (context !== 'content-script') app.use(i18n)
  app.use(Varlet)

  if (options.context !== 'userscript') {
    StyleProvider(Themes.dark)
  }
}
