import request from '@/utils/request'

export function fetchByUserId(data) {
  return request({
    url: '/role/fetchByUserId',
    method: 'get',
    params: data
  })
}

export function fetchRoleList() {
  return request({
    url: '/role/all',
    method: 'get'
  })
}

