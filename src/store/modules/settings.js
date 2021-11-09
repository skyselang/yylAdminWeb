import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import {
  setSystemName,
  getSystemName,
  setPageTitle,
  getPageTitle,
  setLogoUrl,
  getLogoUrl
} from '@/utils/settings'

const {
  tagsView,
  fixedHeader,
  sidebarLogo
} = defaultSettings

const state = {
  theme: variables.theme,
  systemName: getSystemName(),
  pageTitle: getPageTitle(),
  logoUrl: getLogoUrl(),
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
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
      }
      if (key === 'pageTitle') {
        setPageTitle(value)
      }
      if (key === 'logoUrl') {
        setLogoUrl(value)
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
