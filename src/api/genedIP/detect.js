import request from '@/utils/request'

// 查询探测历史列表
export function listDetect(query) {
  return request({
    url: '/genedIP/detect/list',
    method: 'get',
    params: query
  })
}

// 查询探测历史详细
export function getDetect(detectId) {
  return request({
    url: '/genedIP/detect/' + detectId,
    method: 'get'
  })
}

// 新增探测历史
export function addDetect(data) {
  return request({
    url: '/genedIP/detect',
    method: 'post',
    data: data
  })
}

// 修改探测历史
export function updateDetect(data) {
  return request({
    url: '/genedIP/detect',
    method: 'put',
    data: data
  })
}

// 删除探测历史
export function delDetect(detectId) {
  return request({
    url: '/genedIP/detect/' + detectId,
    method: 'delete'
  })
}
