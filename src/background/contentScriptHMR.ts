import { isFirefox, isForbiddenUrl } from '~/env'

// Firefox извлекает файлы из кеша вместо перезагрузки изменений с диска,
// hmr не будет работать как браузер на основе Chromium.
browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
  // Filter out non main window events.
  if (frameId !== 0)
    return

  if (isForbiddenUrl(url))
    return

  // inject the latest scripts
  browser.tabs.executeScript(tabId, {
    file: `${isFirefox ? '' : '.'}/dist/contentScripts/index.global.js`,
    runAt: 'document_end',
  }).catch(error => console.error(error))
})
