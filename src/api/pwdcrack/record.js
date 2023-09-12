import request from '@/utils/request'

// 查询口令破解列表
export function listRecord(query) {
  return request({
    url: '/pwdcrack/record/list',
    method: 'get',
    params: query
  })
}

// 查询口令破解详细
export function getRecord(crackId) {
  return request({
    url: '/pwdcrack/record/' + crackId,
    method: 'get'
  })
}

// 新增口令破解
export function addRecord(data) {
  return request({
    url: '/pwdcrack/record',
    method: 'post',
    data: data
  })
}

// 修改口令破解
export function updateRecord(data) {
  return request({
    url: '/pwdcrack/record',
    method: 'put',
    data: data
  })
}

// 删除口令破解
export function delRecord(crackId) {
  return request({
    url: '/pwdcrack/record/' + crackId,
    method: 'delete'
  })
}
