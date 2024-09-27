export function fixUrlProtocol(url: string) {
  for (const protocol of ["http", "https"]) {
    if (url.startsWith(`${protocol}://`)) {
      return url;
    }
  }

  return `https://${url}`;
}
