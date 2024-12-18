import fs from "fs-extra";
import type { Manifest } from "webextension-polyfill";
import type PkgType from "../package.json";
import { isDev, isFirefox, port, r } from "../scripts/utils";

interface WebExtensionChrome {
  side_panel?: { default_path: string };
}

export async function getManifest() {
  const pkg = (await fs.readJSON(r("package.json"))) as typeof PkgType;
  const manifest: Manifest.WebExtensionManifest & WebExtensionChrome = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: "./assets/icon-512.png",
      // default_popup: './dist/popup/index.html',
    },
    // не работает для chromium
    sidebar_action: {
      default_panel: "dist/sidepanel/index.html",
      open_at_install: true,
    },
    side_panel: {
      default_path: "dist/sidepanel/index.html",
    },
    // options_ui: {
    //   page: "./dist/options/index.html",
    //   open_in_tab: true,
    // },
    background: isFirefox
      ? {
          scripts: ["dist/background/index.mjs"],
          type: "module",
        }
      : {
          service_worker: "./dist/background/index.mjs",
        },
    icons: {
      16: "./assets/icon-512.png",
      48: "./assets/icon-512.png",
      128: "./assets/icon-512.png",
    },
    permissions: ["tabs", "storage", "activeTab", "sidePanel"],
    host_permissions: ["*://*/*"],
    content_scripts: [
      {
        matches: ["https://*.shikimori.one/*"],
        js: ["dist/contentScripts/index.global.js"],
      },
    ],
    web_accessible_resources: [
      {
        resources: ["dist/contentScripts/style.css"],
        matches: ["<all_urls>"],
      },
    ],
    content_security_policy: {
      extension_pages: isDev
        ? // this is required on dev for Vite script to load
          `script-src \'self\' http://localhost:${port}; object-src \'self\'`
        : "script-src 'self'; object-src 'self'",
    },
    // не нужно для chromium
    browser_specific_settings: {
      gecko: {
        id: "shikimori-search-extension@example.com",
      },
    },
  };

  if (isFirefox) {
    delete manifest.side_panel;
  } else {
    delete manifest.sidebar_action;
    delete manifest.browser_specific_settings;
  }

  return manifest;
}
