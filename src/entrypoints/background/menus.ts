import { i18n } from '#imports'
import { debug } from '@/utils/logger.ts'

const config: chrome.contextMenus.CreateProperties[] = [
  { contexts: ['action', 'page'], id: 'openPopup' },
  { contexts: ['action', 'page'], id: 'openSidePanel' },
  { contexts: ['action', 'page'], id: 'openExtPanel' },
  { contexts: ['action', 'page'], id: 'separator' },
  { contexts: ['action', 'page'], id: 'openOptions' },
]

const contexts: chrome.contextMenus.CreateProperties[] = config.map((entry) => ({
  ...entry,
  ...(entry.id === 'separator'
    ? { type: 'separator', id: crypto.randomUUID() }
    : { title: i18n.t(`ctx.${entry.id}` as any) }),
}))

export async function updateContextMenus(enabled?: boolean) {
  debug('updateContextMenus - enabled:', enabled)
  if (!chrome.contextMenus) return console.log('Skipping: chrome.contextMenus')

  chrome.contextMenus.removeAll().then(() => {
    contexts.forEach((item) => {
      const entry = { ...item }
      const contexts = [...(entry.contexts ?? [])]
      // debug('contexts:', contexts)
      if (!enabled) {
        const idx = contexts?.indexOf('page')
        if (idx !== undefined && idx != -1) contexts?.splice(idx, 1)
      }
      entry.contexts = contexts as [chrome.contextMenus.ContextType]
      // debug(`entry: ${entry.id}`, entry.contexts)
      chrome.contextMenus.create(entry)
    })
  })
}
