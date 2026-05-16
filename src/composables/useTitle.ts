import { useAppConfig } from '#imports'

export function useTitle(title?: string) {
  const config = useAppConfig()
  if (title) {
    document.title = `${config.name} ${title}`
  } else {
    document.title = `${config.name}`
  }
}
