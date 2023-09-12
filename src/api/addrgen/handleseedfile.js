import request from '@/utils/request'

// 查询种子地址文件总览列表
export function listHandleseedfile(query) {
  return request({
    url: '/addrgen/handleseedfile/list',
    method: 'get',
    params: query
  })
}

// 查询种子地址文件总览详细
export function getHandleseedfile(addrSeedfileId) {
  return request({
    url: '/addrgen/handleseedfile/' + addrSeedfileId,
    method: 'get'
  })
}

// 新增种子地址文件总览
export function addHandleseedfile(data) {
  return request({
    url: '/addrgen/handleseedfile',
    method: 'post',
    data: data
  })
}

// 修改种子地址文件总览
export function updateHandleseedfile(data) {
  return request({
    url: '/addrgen/handleseedfile',
    method: 'put',
    data: data
  })
}
// 修改种子地址文件总览2
export function updateHandleseedfile2(data) {
  return request({
    url: '/addrgen/handleseedfile/up',
    method: 'put',
    data: data
  })
}

// 删除种子地址文件总览
export function delHandleseedfile(addrSeedfileId) {
  return request({
    url: '/addrgen/handleseedfile/' + addrSeedfileId,
    method: 'delete'
  })
}

// 格式化
export function formatIPv6(data) {
  return request({
    url: '/addrgen/handleseedfile/formatAddr',
    method: 'post',
    data:data
  })
}

// 定时任务立即执行一次
export function runJob(data) {
  return request({
    url: '/monitor/job/changeStatus',
    method: 'post',
    data: data
  })
}
export function runJobforDetect(data) {
  return request({
    url: '/monitor/job/changeStatusforDetect',
    method: 'post',
    data: data
  })
}
