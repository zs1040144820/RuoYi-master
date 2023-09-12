import request from '@/utils/request'

// 查询种子文件采集历史记录列表
export function listCollect(query) {
  return request({
    url: '/addrgen/collect/list',
    method: 'get',
    params: query
  })
}

// 查询种子文件采集历史记录详细
export function getCollect(collectRecordId) {
  return request({
    url: '/addrgen/collect/' + collectRecordId,
    method: 'get'
  })
}

// 新增种子文件采集历史记录
export function addCollect(data) {
  return request({
    url: '/addrgen/collect',
    method: 'post',
    data: data
  })
}

// 修改种子文件采集历史记录
export function updateCollect(data) {
  return request({
    url: '/addrgen/collect',
    method: 'put',
    data: data
  })
}

// 删除种子文件采集历史记录
export function delCollect(collectRecordId) {
  return request({
    url: '/addrgen/collect/' + collectRecordId,
    method: 'delete'
  })
}
export function listJob(id) {
  return request({
    url: '/monitor/job/list/' + id,
    method: 'get',
  })
}
