import request from '@/utils/request'

// 查询单条地址扫描结果列表
export function listSingleDetails(query) {
  return request({
    url: '/vuln/singleDetails/list',
    method: 'get',
    params: query
  })
}

// 查询单条地址扫描结果详细
export function getSingleDetails(ipaddrId) {
  return request({
    url: '/vuln/singleDetails/' + ipaddrId,
    method: 'get'
  })
}

// 新增单条地址扫描结果
export function addSingleDetails(data) {
  return request({
    url: '/vuln/singleDetails',
    method: 'post',
    data: data
  })
}

// 修改单条地址扫描结果
export function updateSingleDetails(data) {
  return request({
    url: '/vuln/singleDetails',
    method: 'put',
    data: data
  })
}

// 删除单条地址扫描结果
export function delSingleDetails(ipaddrId) {
  return request({
    url: '/vuln/singleDetails/' + ipaddrId,
    method: 'delete'
  })
}
