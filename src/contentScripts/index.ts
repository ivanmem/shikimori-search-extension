/* eslint-disable no-console */
import { onMessage } from 'webext-bridge/content-script'
import { createApp } from 'vue'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'

const styleEl = document.createElement('link')
styleEl.setAttribute('rel', 'stylesheet')
styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
const container = document.createElement('div')
container.id = __NAME__
const root = document.createElement('div')

function addAll() {
  document.body.appendChild(styleEl)
  document.body.appendChild(root)
  document.body.appendChild(container)
}

// Firefox `browser.tabs.executeScript()` требует, чтобы скрипты возвращали примитивное значение
(() => {
  console.info('[vitesse-webext] Hello world from content script')

  // пример коммуникации: отправьте заголовок предыдущей вкладки с фоновой страницы
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  })

  window.addEventListener('popstate', addAll)
  document.addEventListener('turbolinks:load', addAll)
  addAll()

  const app = createApp(App)
  setupApp(app)
  app.mount(root)
})()
