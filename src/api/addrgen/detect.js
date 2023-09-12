import request from '@/utils/request'

// 查询种子文件存活性探测历史列表
export function listDetect(query) {
  return request({
    url: '/addrgen/detect/list',
    method: 'get',
    params: query
  })
}

// 查询种子文件存活性探测历史详细
export function getDetect(detectRecordId) {
  return request({
    url: '/addrgen/detect/' + detectRecordId,
    method: 'get'
  })
}

// 新增种子文件存活性探测历史
export function addDetect(data) {
  return request({
    url: '/addrgen/detect',
    method: 'post',
    data: data
  })
}

// 修改种子文件存活性探测历史
export function updateDetect(data) {
  return request({
    url: '/addrgen/detect',
    method: 'put',
    data: data
  })
}

// 删除种子文件存活性探测历史
export function delDetect(detectRecordId) {
  return request({
    url: '/addrgen/detect/' + detectRecordId,
    method: 'delete'
  })
}
export function listJob(id) {
  return request({
    url: '/monitor/job/list/' + id,
    method: 'get',
  })
}
