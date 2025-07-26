import request from '@/utils/request'
// 会员统计接口
const url = '/admin/member.Statistic/'

/**
 * 会员统计
 * @param {object} params 请求参数
 */
export function statisticApi(params) {
  return request({
    url: url + 'statistic',
    method: 'get',
    params: params
  })
}
