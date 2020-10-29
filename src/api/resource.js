import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/resource/listAll',
    method: 'get'
  })
}

export function fetchPage(data) {
  return request({
    url: '/resource/list',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: '/resource/add',
    method: 'post',
    data: data
  })
}

export function deleteResource(data) {
  return request({
    url: '/resource/delete',
    method: 'delete',
    params: data
  })
}
export function update(data) {
  return request({
    url: '/resource/update',
    method: 'put',
    data: data
  })
}
