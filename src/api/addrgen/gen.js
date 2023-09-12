import request from '@/utils/request'

export function generate(data) {
  return request({
    url: '/addrgen/handleseedfile/genAddr',
    method: "post",
    data:data
  })
}
