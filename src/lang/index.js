import { createI18n } from 'vue-i18n'
import { useAppStoreHook } from '@/store/modules/app'
import { useLangStoreHook } from '@/store/modules/lang'
import zhCnLocale from './package/zh-cn.json'
import enLocale from './package/en.json'

const appStore = useAppStoreHook()

const messages = {
  'zh-cn': {
    ...zhCnLocale
  },
  en: {
    ...enLocale
  }
}

const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  messages: messages,
  globalInjection: true,
  missing: (locale, key) => {
    if (process.env.NODE_ENV === 'development') {
      const langStore = useLangStoreHook()
      langStore.addMissKey(key)
    }
    console.warn(`[intlify] Not found '${key}' key in '${locale}' locale messages.`)
    return key
  }
})

export default i18n
