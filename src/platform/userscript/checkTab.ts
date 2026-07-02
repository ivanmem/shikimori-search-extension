import { GM_openInTab } from "vite-plugin-monkey/dist/client";
import type { CheckTabService } from "~/platform/types";

let openedTab: ReturnType<typeof GM_openInTab> | undefined;

export const checkTab: CheckTabService = {
  open(url: string) {
    openedTab = GM_openInTab(url, { active: true, setParent: true });
  },

  async closeIfMatches() {
    openedTab?.close();
    openedTab = undefined;
  },
};
