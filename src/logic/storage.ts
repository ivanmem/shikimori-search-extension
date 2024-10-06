import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const sitesStorage = useWebExtensionStorage<string[]>('sitesStorage', [])
export const metaNameStorage = useWebExtensionStorage<string>('metaNameStorage', '')
export const disableExtension = useWebExtensionStorage<boolean>('disableExtension', false)