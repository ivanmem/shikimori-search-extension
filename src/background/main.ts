import {onMessage, sendMessage} from 'webext-bridge/background'
import type {Tabs} from 'webextension-polyfill'

const isFirefox = navigator.userAgent.includes('Firefox');

// only on dev mode
if (import.meta.hot) {
    // @ts-expect-error for background HMR
    import('/@vite/client')
    // load latest content script
    import('./contentScriptHMR')
}

if (isFirefox) {
// для переключения боковой панели с помощью кнопки действия в хроме:
    browser.action.onClicked.addListener(() => {
        browser.sidebarAction.toggle()
    })
}

browser.runtime.onInstalled.addListener((): void => {
    // eslint-disable-next-line no-console
    console.log('Extension installed')
})

let previousTabId = 0

// пример коммуникации: отправьте заголовок предыдущей вкладки с фоновой страницы
// смотрите shim.d.ts
browser.tabs.onActivated.addListener(async ({tabId}) => {
    if (!previousTabId) {
        previousTabId = tabId
        return
    }

    let tab: Tabs.Tab

    try {
        tab = await browser.tabs.get(previousTabId)
        previousTabId = tabId
    } catch {
        return
    }

    sendMessage('tab-prev', {title: tab.title}, {context: 'content-script', tabId})
})

onMessage('get-current-tab', async () => {
    try {
        const tab = await browser.tabs.get(previousTabId)
        return {
            title: tab?.title,
        }
    } catch {
        return {
            title: undefined,
        }
    }
})
