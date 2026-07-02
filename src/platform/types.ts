import type { StorageLikeAsync } from "@vueuse/core";

export interface StorageDriver extends StorageLikeAsync {
  /** Подписка на изменение ключа, пришедшее извне (другая вкладка/контекст) */
  watchKey: (key: string, cb: (newValue: string | null) => void) => () => void;
}

export interface CheckTabService {
  /** Открыть проверочную вкладку с URL-шаблоном */
  open: (url: string) => void;
  /** Закрыть ранее открытую проверочную вкладку */
  closeIfMatches: (expectedUrl: string) => Promise<void>;
}
