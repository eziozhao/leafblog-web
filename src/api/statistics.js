import request from '@/utils/request'

export function fetchRecentDays() {
  return request({
    url: '/statistics/api',
    method: 'get'
  })
}
export function fetchNums() {
  return request({
    url: '/statistics/nums',
    method: 'get'
  })
}
