import request from '@/utils/request'

// 查询漏洞特征列表
export function listCnnvd(query) {
  return request({
    url: '/vuln/cnnvd/list',
    method: 'get',
    params: query
  })
}

// 查询漏洞特征详细
export function getCnnvd(cnnvdId) {
  return request({
    url: '/vuln/cnnvd/' + cnnvdId,
    method: 'get'
  })
}

// 新增漏洞特征
export function addCnnvd(data) {
  return request({
    url: '/vuln/cnnvd',
    method: 'post',
    data: data
  })
}

// 修改漏洞特征
export function updateCnnvd(data) {
  return request({
    url: '/vuln/cnnvd',
    method: 'put',
    data: data
  })
}

// 删除漏洞特征
export function delCnnvd(cnnvdId) {
  return request({
    url: '/vuln/cnnvd/' + cnnvdId,
    method: 'delete'
  })
}
//rate
export function backRate(){
  return request({
    url:'/vuln/cnnvd/backRate',
    method:'get'
  })
}
