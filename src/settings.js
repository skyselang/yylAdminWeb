module.exports = {
  /**
   * @type {string}
   * @description 默认页面标题
   */
  title: 'yylAdmin',

  /**
   * @type {boolean} true | false
   * @description 是否显示快捷导航栏
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否固定头部
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否在侧边栏中显示logo、系统简称
   */
  sidebarLogo: true,

  /**
   * @type {string} header、param
   * @description token方式
   */
  tokenType: 'param',

  /**
   * @type {string} 前后端必须一致
   * @description token名称
   */
  tokenName: 'AdminToken',

  /**
   * @type {string} default | medium | small | mini
   * @description element-ui 默认 size
   */
  elementSize: 'medium',

  /**
   * @type {number}
   * @description 分页每页默认数量
   */
  pageLimit: 12
}
