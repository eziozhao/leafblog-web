import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/category/list',
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: '/category/add',
    method: 'post',
    params: data
  })
}

export function deleteCate(data) {
  return request({
    url: '/category/add',
    method: 'delete',
    data: data
  })
}
export function update(data) {
  return request({
    url: '/category/update',
    method: 'put',
    params: data
  })
}

