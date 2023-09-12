import request from '@/utils/request'

// 查询生成文件详情列表
export function listDetails(query) {
  return request({
    url: '/genedIP/details/list',
    method: 'get',
    params: query
  })
}

// 查询生成文件详情详细
export function getDetails(detailsId) {
  return request({
    url: '/genedIP/details/' + detailsId,
    method: 'get'
  })
}

// 新增生成文件详情
export function addDetails(data) {
  return request({
    url: '/genedIP/details',
    method: 'post',
    data: data
  })
}

// 修改生成文件详情
export function updateDetails(data) {
  return request({
    url: '/genedIP/details',
    method: 'put',
    data: data
  })
}

// 删除生成文件详情
export function delDetails(detailsId) {
  return request({
    url: '/genedIP/details/' + detailsId,
    method: 'delete'
  })
}
