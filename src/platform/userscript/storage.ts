import {
  GM_addValueChangeListener,
  GM_deleteValue,
  GM_getValue,
  GM_removeValueChangeListener,
  GM_setValue,
} from "vite-plugin-monkey/dist/client";
import type { StorageDriver } from "~/platform/types";

export const storageDriver: StorageDriver = {
  async getItem(key: string) {
    return GM_getValue<string | null>(key, null);
  },

  async setItem(key: string, value: string) {
    GM_setValue(key, value);
  },

  async removeItem(key: string) {
    GM_deleteValue(key);
  },

  watchKey(key, cb) {
    // Событие приходит и на собственные изменения (remote=false) — это нужно:
    // именно так data.init выставляется в true при первой записи значения по умолчанию
    // (как storage.onChanged в browser.storage, который тоже эхо-репортит свои же записи).
    // От зацикливания защищает pauseWatch/resumeWatch в useWebExtensionStorage.
    const listenerId = GM_addValueChangeListener(
      key,
      (_name, _oldValue, newValue) => {
        cb((newValue as string | null) ?? null);
      },
    );

    return () => GM_removeValueChangeListener(listenerId);
  },
};
