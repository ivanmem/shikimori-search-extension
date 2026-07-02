import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import monkey from "vite-plugin-monkey";
import { isDev, r } from "./scripts/utils";
import packageJson from "./package.json";
import { shikimoriMatches } from "./src/common/matches";

const repoUrl = "https://github.com/ivanmem/shikimori-search-extension";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${r("src")}/`,
      "#platform/": `${r("src/platform/userscript")}/`,
    },
  },
  define: {
    __DEV__: isDev,
    __NAME__: JSON.stringify(packageJson.name),
    "process.env.NODE_ENV": JSON.stringify(isDev ? "development" : "production"),
  },
  plugins: [
    Vue(),

    AutoImport({
      imports: ["vue"],
      dts: false,
    }),

    Components({
      dirs: [r("src/components")],
      dts: false,
      resolvers: [
        IconsResolver({
          prefix: "",
        }),
      ],
    }),

    Icons(),

    monkey({
      entry: r("src/userscript/main.ts"),
      userscript: {
        name: packageJson.displayName,
        namespace: repoUrl,
        version: packageJson.version,
        description: packageJson.description,
        icon: "https://shikimori.one/favicon.ico",
        match: shikimoriMatches,
        noframes: true,
        "run-at": "document-end",
        updateURL: `${repoUrl}/releases/latest/download/shiki-search.meta.js`,
        downloadURL: `${repoUrl}/releases/latest/download/shiki-search.user.js`,
      },
      build: {
        fileName: "shiki-search.user.js",
        metaFileName: "shiki-search.meta.js",
      },
    }),
  ],
  build: {
    outDir: r("dist-userscript"),
    emptyOutDir: true,
  },
});
