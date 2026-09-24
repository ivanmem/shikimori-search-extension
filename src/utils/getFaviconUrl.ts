import { shallowReactive } from "vue";
import { getUrlHost } from "~/utils/getUrlHost";
import { fixUrlProtocol } from "~/utils/fixUrlProtocol";

// Загруженные иконки по хосту. Пока иконка не загрузилась - значения нет
const favicons = shallowReactive(new Map<string, string>());
const loadingHosts = new Set<string>();

// Возвращает первую загрузившуюся иконку сайта (реактивно, значение появится после загрузки)
export function getFaviconUrl(site: string) {
  const host = getUrlHost(fixUrlProtocol(site));
  if (!loadingHosts.has(host)) {
    loadingHosts.add(host);
    loadFavicon(host);
  }

  return favicons.get(host);
}

// Несколько источников: прямой /favicon.ico блокируется на сайтах за Cloudflare (например, katcr.to)
function getFaviconSources(host: string) {
  return [
    `https://${host}/favicon.ico`,
    `https://www.google.com/s2/favicons?sz=32&domain=${host}`,
    `https://icons.duckduckgo.com/ip3/${host}.ico`,
  ];
}

async function loadFavicon(host: string) {
  try {
    favicons.set(host, await Promise.any(getFaviconSources(host).map(loadImage)));
  } catch (error) {
    console.debug("[shiki-search] не удалось загрузить иконку", host, error);
  }
}

function loadImage(src: string) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = reject;
    image.src = src;
  });
}
