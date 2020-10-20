import request from '@/utils/request'

export function fetchMenuTree() {
  return request({
    url: 'menu/tree',
    method: 'get'
  })
}

export function f() {

}
