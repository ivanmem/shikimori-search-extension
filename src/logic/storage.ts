import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const sitesStorage = useWebExtensionStorage<string[]>('sitesStorage', [])
export const disableExtension = useWebExtensionStorage<boolean>('disableExtension', false)
export const pinSearchBlock = useWebExtensionStorage<boolean>('pinSearchBlock', true)
export const hideOriginalLinks = useWebExtensionStorage<boolean>('hideOriginalLinks', true)