import request from '@/utils/request'

//初始化脚本
export function initVulnScript() {
  return request({
    url: '/vuln/scan/initscript',
    method: 'get'
  })
}
// 漏洞扫描
export function scanVuln(data) {
  return request({
    url: '/vuln/scan/scanvuln' ,
    method: 'post',
    data: data
  })
}
//获取正在执行的命令
export function getOngoingC() {
  return request({
    url: '/vuln/scan/getOngoingC',
    method: 'get'
  })
}
//获取正在执行的命令
export function getOngoingCom() {
  return request({
    url: '/vuln/scan/getOngoingCom',
    method: 'get'
  })
}
//暂停任务
export function stopThread(uuid) {
  return request({
    url: '/vuln/scan/stopThread/' + uuid,
    method: 'get'
  })
}
//删除任务显示
export function delCommand(uuid) {
  return request({
    url: '/vuln/scan/del/' + uuid,
    method: 'delete'
  })
}
//恢复任务
export function reStart(data) {
  return request({
    url: '/vuln/scan/resumeTask' ,
    method: 'post',
    data: data
  })
}
