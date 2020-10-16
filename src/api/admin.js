import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/admin/userlist',
    method: 'get',
    params: data
  })
}
