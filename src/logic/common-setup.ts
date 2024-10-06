import type { App } from 'vue'

export function setupApp(app: App) {
  // Внедрить глобально доступный объект $app в шаблон.
  app.config.globalProperties.$app = {
    context: '',
  }

  // Предоставьте доступ к приложению в настройке скрипта с помощью `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  // Здесь вы сможете установить дополнительные плагины для всех контекстов: всплывающего окна, страницы параметров и контент-скрипта.
  // example: app.use(i18n)
  // example excluding content-script context: if (context !== 'content-script') app.use(i18n)
}
