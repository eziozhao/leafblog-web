import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/admin/userlist',
    method: 'get',
    params: data
  })
}
export function changeStatus(data) {
  return request({
    url: '/admin/disable',
    method: 'put',
    params: data
  })
}
export function deleteUser(data) {
  return request({
    url: '/admin/delete',
    method: 'delete',
    params: data
  })
}
export function allocRole(data) {
  return request({
    url: '/admin/user/allocRole',
    method: 'post',
    params: data
  })
}
export function allocMenu(data) {
  return request({
    url: '/admin/role/allocMenu',
    method: 'post',
    params: data
  })
}

export function allocResource(data) {
  return request({
    url: '/admin/role/allocResource',
    method: 'post',
    params: data
  })
}
export function updateUser(data) {
  return request({
    url: '/admin/update',
    method: 'put',
    data: data
  })
}
