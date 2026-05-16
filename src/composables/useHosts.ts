import { type Ref, ref, onMounted, onUnmounted } from 'vue'
import { type HostsRecord, Hosts } from '@/utils/hosts.ts'

export function useHosts(): Ref<HostsRecord> {
  // console.debug('%cLOADED composables/useHosts.ts', 'color: Coral')

  const hosts = ref<HostsRecord>({})

  // NOTE: Consider improving listener to only trigger on hosts changes
  const onChanged = async (changes: any) => {
    // console.log('useHosts - onChanged:', changes)
    const keys = Object.keys(changes)
    // console.log('useHosts - keys:', keys)
    if (keys.some((key) => key.length === 1)) {
      // console.log('%c composables/useHosts.ts - hosts updated ', 'color: LightSkyBlue')
      hosts.value = await Hosts.all()
    }
  }

  if (!chrome.storage.sync.onChanged.hasListener(onChanged)) {
    // console.debug('%c useHosts - addListener', 'color: SpringGreen')
    chrome.storage.sync.onChanged.addListener(onChanged)
  }

  onMounted(() => Hosts.all().then((results) => (hosts.value = results)))
  onUnmounted(() => chrome.storage.sync.onChanged.removeListener(onChanged))

  return hosts
}
