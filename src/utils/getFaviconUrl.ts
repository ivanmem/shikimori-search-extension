import { getUrlOrigin } from "~/utils/getUrlOrigin";

export function getFaviconUrl(site: string) {
  return `${getUrlOrigin(site)}/favicon.ico`;
}
