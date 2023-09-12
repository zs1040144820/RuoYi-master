import request from '@/utils/request'

// 查询种子文件详情列表
export function listDetails(query) {
  return request({
    url: '/addrgen/details/list',
    method: 'get',
    params: query
  })
}

// 查询种子文件详情详细
export function getDetails(addrseedId) {
  return request({
    url: '/addrgen/details/' + addrseedId,
    method: 'get'
  })
}

// 新增种子文件详情
export function addDetails(data) {
  return request({
    url: '/addrgen/details',
    method: 'post',
    data: data
  })
}

// 修改种子文件详情
export function updateDetails(data) {
  return request({
    url: '/addrgen/details',
    method: 'put',
    data: data
  })
}

// 删除种子文件详情
export function delDetails(addrseedId) {
  return request({
    url: '/addrgen/details/' + addrseedId,
    method: 'delete'
  })
}
export function listJob(id) {
  return request({
    url: '/monitor/job/list/' + id,
    method: 'get',
  })
}
export function updateCategory(data) {
  return request({
    url: '/addrgen/details/updateca',
    method: 'put',
    data: data
  })
}
