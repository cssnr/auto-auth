import { type Ref, onMounted, onUnmounted, ref } from 'vue'
import { type Options, getOptions } from '@/utils/options.ts'

export function useOptions(): Ref<Options> {
  // console.debug('%cLOADED useOptions.ts', 'color: Coral')
  const options = ref<Options>({} as Options)

  const onChanged = async (changes: Record<string, any>) => {
    // console.log('useOptions - onChanged:', changes)
    if (!changes?.options?.newValue) return
    // console.log('%c useOptions.ts - options updated ', 'color: MediumSpringGreen')
    options.value = changes.options.newValue as Options
  }

  if (!chrome.storage.sync.onChanged.hasListener(onChanged)) {
    // console.debug('%c useOptions - addListener', 'color: SpringGreen')
    chrome.storage.sync.onChanged.addListener(onChanged)
  }

  onMounted(() => getOptions().then((results) => (options.value = results)))
  onUnmounted(() => chrome.storage.sync.onChanged.removeListener(onChanged))

  return options
}
