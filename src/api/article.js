import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/article/list',
    method: 'get',
    params: data
  })
}

export function add(data) {
  return request({
    url: '/article/add',
    method: 'post',
    data: data
  })
}

export function deleteArticle(data) {
  return request({
    url: '/article/delete',
    method: 'post',
    data: data
  })
}
export function update(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data: data
  })
}

export function fetchById(id) {
  return request({
    url: '/article/' + id,
    method: 'get'
  })
}

