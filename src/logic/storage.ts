import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const sitesStorage = useWebExtensionStorage<string[]>('sitesStorage', [])
export const disableExtension = useWebExtensionStorage<boolean>('disableExtension', false)