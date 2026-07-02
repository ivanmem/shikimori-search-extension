import type { Storage } from "webextension-polyfill";
import { storage } from "webextension-polyfill";
import type { StorageDriver } from "~/platform/types";

export const storageDriver: StorageDriver = {
  removeItem(key: string) {
    return storage.local.remove(key);
  },

  setItem(key: string, value: string) {
    return storage.local.set({ [key]: value });
  },

  async getItem(key: string) {
    const storedData = await storage.local.get(key);

    return storedData[key] as string;
  },

  watchKey(key, cb) {
    const listener = (changes: Record<string, Storage.StorageChange>) => {
      const change = changes[key];
      if (!change) return;

      cb((change.newValue as string | null) ?? null);
    };

    storage.onChanged.addListener(listener);

    return () => storage.onChanged.removeListener(listener);
  },
};
