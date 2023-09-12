import request from '@/utils/request'

// 查询生成记录列表
export function listRecord(query) {
  return request({
    url: '/genedIP/record/list',
    method: 'get',
    params: query
  })
}

// 查询生成记录详细
export function getRecord(recordId) {
  return request({
    url: '/genedIP/record/' + recordId,
    method: 'get'
  })
}

// 新增生成记录
export function addRecord(data) {
  return request({
    url: '/genedIP/record',
    method: 'post',
    data: data
  })
}

// 修改生成记录
export function updateRecord(data) {
  return request({
    url: '/genedIP/record',
    method: 'put',
    data: data
  })
}

// 删除生成记录
export function delRecord(recordId) {
  return request({
    url: '/genedIP/record/' + recordId,
    method: 'delete'
  })
}
//探测存活性
export function isactive(recordId) {
  return request({
    url: '/genedIP/record/detect/' + recordId,
    method: 'get'
  })
}
//别名区训练
export function aliasDet(recordId) {
  return request({
    url: '/genedIP/record/aliasDetect/' + recordId,
    method: 'get'
  })
}
