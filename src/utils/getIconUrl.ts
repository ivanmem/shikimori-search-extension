export function getIconUrl(site: string) {
    const url = new URL(site)
    return `${url.origin}/favicon.ico`
}