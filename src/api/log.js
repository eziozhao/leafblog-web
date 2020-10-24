import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/logs/list',
    method: 'get',
    params: data
  })
}

export function deleteLogs(data) {
  return request({
    url: '/logs/delete',
    method: 'delete',
    params: data
  })
}
