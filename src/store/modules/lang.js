import { defineStore } from 'pinia'
import { store } from '@/store'

export const useLangStore = defineStore('lang', () => {
  const missKeys = ref({})

  function addMissKey(key) {
    if (!(key in missKeys.value)) {
      missKeys.value[key] = key
    }
  }

  return {
    missKeys,
    addMissKey
  }
})

// 非setup
export function useLangStoreHook() {
  return useLangStore(store)
}
