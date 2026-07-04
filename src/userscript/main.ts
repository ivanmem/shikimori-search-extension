import { createApp } from "vue";
import { GM_registerMenuCommand } from "vite-plugin-monkey/dist/client";
import "@varlet/ui/es/style";
import App from "./App.vue";
import { setupApp } from "~/logic/common-setup";
import { showSettings } from "./state";

const root = document.createElement("div");
root.id = "shiki-search-userscript";
document.body.appendChild(root);

// Turbolinks при переходах заменяет <body> целиком — возвращаем корень на место
function reattachRoot() {
  if (!root.isConnected) {
    document.body.appendChild(root);
  }
}

window.addEventListener("popstate", reattachRoot);
document.addEventListener("turbolinks:load", reattachRoot);

const app = createApp(App);
setupApp(app, { context: "userscript" });
app.mount(root);

GM_registerMenuCommand("Настройки Shiki Search", () => {
  showSettings.value = true;
});
