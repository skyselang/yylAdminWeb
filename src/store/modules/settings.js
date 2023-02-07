import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import {
  setSystemName,
  getSystemName,
  setFaviconUrl,
  getFaviconUrl,
  setPageTitle,
  getPageTitle,
  setLogoUrl,
  getLogoUrl,
  setTokenName,
  setTokenType
} from '@/utils/settings'

const {
  tagsView,
  fixedHeader,
  sidebarLogo,
  tokenName,
  tokenType
} = defaultSettings

const state = {
  systemName: getSystemName(),
  faviconUrl: getFaviconUrl(),
  pageTitle: getPageTitle(),
  logoUrl: getLogoUrl(),
  theme: variables.theme,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  tokenName: tokenName,
  tokenType: tokenType
}

const mutations = {
  CHANGE_SETTING: (state, {
    key,
    value
  }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
      if (key === 'systemName') {
        setSystemName(value)
      } else if (key === 'faviconUrl') {
        setFaviconUrl(value)
      } else if (key === 'pageTitle') {
        setPageTitle(value)
      } else if (key === 'logoUrl') {
        setLogoUrl(value)
      } else if (key === 'tokenName') {
        setTokenName(value)
      } else if (key === 'tokenType') {
        setTokenType(value)
      }
    }
  }
}

const actions = {
  changeSetting({
    commit
  }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
