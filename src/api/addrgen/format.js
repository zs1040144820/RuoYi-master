import request from '@/utils/request'

// 查询种子文件格式化记录列表
export function listFormat(query) {
  return request({
    url: '/addrgen/format/list',
    method: 'get',
    params: query
  })
}

// 查询种子文件格式化记录详细
export function getFormat(formatRecordId) {
  return request({
    url: '/addrgen/format/' + formatRecordId,
    method: 'get'
  })
}

// 新增种子文件格式化记录
export function addFormat(data) {
  return request({
    url: '/addrgen/format',
    method: 'post',
    data: data
  })
}

// 修改种子文件格式化记录
export function updateFormat(data) {
  return request({
    url: '/addrgen/format',
    method: 'put',
    data: data
  })
}

// 删除种子文件格式化记录
export function delFormat(formatRecordId) {
  return request({
    url: '/addrgen/format/' + formatRecordId,
    method: 'delete'
  })
}
