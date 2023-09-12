import request from '@/utils/request'

// 漏洞扫描
export function startCrack(data) {
  return request({
    url: '/crack/startCrack' ,
    method: 'post',
    data: data
  })
}
export function getWordList() {
  return request({
    url: '/crack/getWordList' ,
    method: 'get',
  })
}
export function getResults() {
  return request({
    url: '/crack/getResults' ,
    method: 'get',
  })
}
