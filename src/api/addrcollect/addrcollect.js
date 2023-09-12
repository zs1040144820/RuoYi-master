import request from '@/utils/request'

//将任务插入数据库
export function inserTask(data) {
  return request({
    url: '/CollectIP/insertask',
    method: 'post',
    data: data
  })
}

//开始从出口流量和交换机收集IP地址
export function startCollect(data) {
  return request({
    url: '/CollectIP/start',
    method: 'post',
    data: data
  })
}

//显示收集IP地址的list
export function showCollectList(query) {
  return request({
    url: '/CollectIP/showlist',
    method: 'get',
    params: query
  })
}
export function showCollectList1(query) {
  return request({
    url: '/CollectIP/showlist1',
    method: 'get',
    params: query
  })
}
export function showCollectList2(query) {
  return request({
    url: '/CollectIP/showlist2',
    method: 'get',
    params: query
  })
}

//显示IP地址详情Tade list
export function showTadeList(query) {
  return request({
    url: '/CollectIP/showtadelist',
    method: 'get',
    params: query
  })
}

//删除一条任务信息Task
export function delTaskInfo(taskId) {
    return request({
    url: '/CollectIP/deltask/' + taskId,
    method: 'delete'
    })
}

//显示任务对应的控制台信息
export function showCommand(uid) {
  return request({
    url: '/CollectIP/showcmd/' + uid,
    method: 'get'
  })
}
export function showCommand2(uid) {
  return request({
    url: '/CollectIP/showcmd2/' + uid,
    method: 'get'
  })
}

export function selectDetail(uid) {
  return request({
    url: '/CollectIP/showdetail/' + uid,
    method: 'get'
  })
}

export function selectDetail2(uid) {
  return request({
    url: '/CollectIP/showdetail2/' + uid,
    method: 'get'
  })
}

export function delDetail(uid){
  return request({
    url: '/CollectIP/deldetail/' + uid,
    method: 'delete'
  })
}

export function findTask(uid){
  return request({
    url: '/CollectIP/showtask/' + uid,
    method: 'get'
  })
}

export function getCmd(uid){
  return request({
    url: '/CollectIP/getcmd/' + uid,
    method: 'get'
  })
}

//从已有资产收集ip地址-插入任务
export function inserTask2(data) {
  return request({
    url: '/CollectIP/insertask2',
    method: 'post',
    data: data
  })
}

//从已有资产收集ip地址-开始收集
export function startCollect2(data) {
  return request({
    url: '/CollectIP/start2',
    method: 'post',
    data: data
  })
}

//终止任务运行
export function terminateTask(uid){
  return request({
    url: '/CollectIP/tmntask/' + uid,
    method: 'get'
  })
}

export function terminateTask2(uid) {
  return request({
    url: '/CollectIP/tmntask2/' + uid,
    method: 'get'
  })
}

export function showAllRecord2(query){
  return request({
    url: '/CollectIP/showall2',
    method: 'get',
    params: query
  })
}

export function showIPAddrs(query) {
  return request({
    url: '/CollectIP/showips',
    method: 'get',
    params: query
  })
}

export function showIPAddrs2(query) {
  return request({
    url: '/CollectIP/showips2',
    method: 'get',
    params: query
  })
}

