import { isUrlEqual } from "~/utils/isUrlEqual";
import type { CheckTabService } from "~/platform/types";

declare const chrome: any;

export const checkTab: CheckTabService = {
  open(url: string) {
    window.open(url, "_blank");
  },

  async closeIfMatches(expectedUrl: string) {
    const api = browser || chrome;
    const [tab] = await api.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    if (!tab?.id) return;

    const { url, pendingUrl } = tab;

    if (
      (url && isUrlEqual(expectedUrl, url)) ||
      (pendingUrl && isUrlEqual(expectedUrl, pendingUrl)) ||
      (!pendingUrl && url === "about:blank")
    ) {
      await api.tabs.remove(tab.id);
    }
  },
};
