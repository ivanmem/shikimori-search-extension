import { fixUrlProtocol } from "~/utils/fixUrlProtocol";

export function isUrlEqual(url1: string, url2: string) {
  try {
    // Создаем URL объекты для парсинга
    const parsedUrl1 = new URL(url1);
    const parsedUrl2 = new URL(url2);

    // Приводим хосты к нижнему регистру и удаляем 'www.' если есть
    const host1 = parsedUrl1.hostname.toLowerCase().replace(/^www\./, "");
    const host2 = parsedUrl2.hostname.toLowerCase().replace(/^www\./, "");

    // Проверяем совпадение основных компонентов
    const hostsMatch = host1 === host2;
    const pathsMatch = parsedUrl1.pathname === parsedUrl2.pathname;
    const protocolsMatch = parsedUrl1.protocol === parsedUrl2.protocol;

    // Получаем и сортируем параметры запроса
    const params1 = new URLSearchParams(parsedUrl1.search);
    const params2 = new URLSearchParams(parsedUrl2.search);

    // Преобразуем параметры в отсортированные строки для сравнения
    const sortedSearch1 = Array.from(params1.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const sortedSearch2 = Array.from(params2.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const searchParamsMatch = sortedSearch1 === sortedSearch2;

    return hostsMatch && pathsMatch && protocolsMatch && searchParamsMatch;
  } catch {
    return fixUrlProtocol(url1) === fixUrlProtocol(url2);
  }
}
