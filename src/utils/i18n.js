import i18n from '@/lang/index'

// 路由国际化
export function translateRouteTitle(title) {
  const hasKey = i18n.global.te('route.' + title)
  if (hasKey) {
    const translatedTitle = i18n.global.t('route.' + title)
    return translatedTitle
  }
  return title
}
