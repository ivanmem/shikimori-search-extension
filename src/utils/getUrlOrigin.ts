export function getUrlOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch {
    const slash = url.indexOf("/");
    if (slash !== -1) {
      url = url.substring(0, slash);
    }

    return url;
  }
}
