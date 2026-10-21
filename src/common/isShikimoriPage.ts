// Шикимори постоянно меняет домены, поэтому узнаём сайт по разметке, а не по адресу
const shikimoriSelector = "body[data-faye_url][data-camo_url] .l-top_menu-v2";

export function isShikimoriPage() {
  const result = document.querySelector(shikimoriSelector) !== null;
  // Логируем только на Шикимори, чтобы не мусорить в консоли чужих сайтов
  if (result) {
    console.debug("[shiki-search] страница Шикимори:", location.host);
  }

  return result;
}
