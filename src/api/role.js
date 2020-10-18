import request from '@/utils/request'

export function fetchByUserId(data) {
  return request({
    url: '/role/fetchByUserId',
    method: 'get',
    params: data
  })
}

export function fetchRoleList(data) {
  return request({
    url: '/role/all',
    method: 'get',
    params: data
  })
}

export function updateRole(data) {
  return request({
    url: 'role/update',
    method: 'put',
    data: data
  })
}
export function addRole(data) {
  return request({
    url: 'role/add',
    method: 'post',
    data: data
  })
}

export function deleteRole(data) {
  return request({
    url: 'role/delete',
    method: 'delete',
    params: data
  })
}

