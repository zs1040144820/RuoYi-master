<!-- 出口流量和交换机的地址收集 -->
<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="填写任务名称" label-width="120px">
        <el-input v-model="collectip.filename" placeholder="请输入任务名" :style="{ width: '300px' }" />
        <span slot="label">
            填写任务名称
            <el-tooltip content="用于分辨任务，可重复" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
        </span>
      </el-form-item>
          <el-form-item label="设定收集时长" label-width="120px">
            <el-input v-model="collectip.collectime" :value="defaultCollectTime" placeholder="30" :style="{ width: '300px' }" />
            <span slot="label">
            设定收集时长
            <el-tooltip content="系统监测出口流量的持续时长" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            </span>
          </el-form-item>
          <el-form-item label="设定时间类型" label-width="120px">
            <el-select v-model="collectip.timetype" :value="defaultTimeType" placeholder="秒" :style="{ width: '300px' }">
              <el-option label="时" value="hour"></el-option>
              <el-option label="分" value="min"></el-option>
              <el-option label="秒" value="sec"></el-option>
            </el-select>
            <span slot="label">
            设定时间类型
            <el-tooltip content="选择时间单位" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            </span>
          </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small"
                 type="primary"
                 @click="startcollect"
                 v-hasPermi="['CollectIP:start']"
      >开始收集</el-button>
    </div>
    <div slot="tip" class="el-upload__tip" style="font-size: 14px;color: red">提示：系统在定长时间内从出口流量和交换机收集IPv6地址，不可同时运行多个任务</div>
    <br>
    <br>
    <el-card class="box-card" style="width:1200px" >
      <div slot="header" class="clearfix">
        <span style="color: white; background-color: dodgerblue; border-radius: 4px; padding: 5px 10px;">
          <template>
            <span1><i class="el-icon-collection"></i> 任务中已经收集到的IPv6地址</span1>
          </template>
        </span>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-download" @click="extractIP">一键提取</el-button>
      </div>
      <el-scrollbar style="height: 150px;">
      <div v-for="(item, index) in ipaddrs" :key="index" class="text item">
        {{ item }}
      </div>
      </el-scrollbar>
    </el-card>
    <br>
    <br>
    <el-card v-for="item in reverseCollectIPList" :key="item.uniqueID" style="width:1200px" class="card">
      <div slot="header" class="clearfix">
        <span>
            <template v-if="item.tasksituation === '运行中'">
              <span1><i class="el-icon-loading"></i> 运行中</span1>
            </template>
            <template v-else-if="item.tasksituation === '运行完毕'">
              <span2><i class="el-icon-finished"></i> 运行完毕</span2>
            </template>
            <template v-else-if="item.tasksituation === '被终止'">
              <span3><i class="el-icon-close"></i> 已终止</span3>
            </template>
          {{item.filename}}({{item.startime}})
        </span>
        <el-button
          style="float: right;
          padding: 3px 0"
          type="text"
          icon="el-icon-caret-right"
          :disabled="item.tasksituation === '运行完毕' || item.tasksituation === '被终止'"
          @click="terminateTask(item)">终止</el-button>
        <el-button
          style="float: right;
          padding: 3px 0"
          type="text"
          icon="el-icon-delete-solid"
          :disabled="item.tasksituation === '运行中'"
          @click="handleDelete(item)">删除</el-button>
      </div>
      <template>
        <el-scrollbar style="height: 200px;">
        任务名称：{{item.filename}}<br>
        收集时长：{{item.collectime}}{{item.timetype}}<br>
        唯一标识：{{item.uniqueID}}<br>
        地址来源：{{item.source}}<br>
        任务状态：{{ item.tasksituation }}<br>
        回显情况：<br>
        <div v-html="item.commandresponse"/>
        </el-scrollbar>
        <el-progress style="width: 1000px" :text-inside="true" :stroke-width="26" :percentage=item.rate></el-progress>
      </template>
    </el-card>
    <br>
  </div>
</template>
<script>
import {
  inserTask,
  startCollect,
  showCollectList1,
  delTaskInfo,
  findTask,
  getCmd,
  showCommand2,
  terminateTask,
  terminateTask2,
  showAllRecord2,
  showIPAddrs2
} from "@/api/addrcollect/addrcollect";

export default {
  name: "CollectIPAddr",

  data() {
    return {
      showCard:true,
      showNotReady1: false,
      showNotReady2: false,
      ipaddrs: [],
      detail2DataList: [],
      detail2DataListTemp: {
        uid:"",
        detail:"",
        command:"",
      },
      tempCmd: "",
      timerId: null, //定时器ID
      // 遮罩层
      loading: true,
      // 收集IP地址情况总览表格数据
      collectIPList: [],
      // 查询参数
      queryParams: {
        filename: null,
        startime: null,
        tasksituation: null,
        source: null,
      },
      // 创建Collectip表单——胡雨丰23.4.6
      collectip: {
        filename: "",
        collectime: "",
        timetype: "",
      },
      defaultCollectTime: '30',
      defaultTimeType: 'sec',
      //计时器
      interval2:null,
      interval3:null,
    };
  },
  computed: {
    reverseCollectIPList(){
      return this.collectIPList.reverse();
    }
  },
  created() {
    this.detail2DataListTemp = {};
    this.showAllRecord();
    this.getList();
    this.interval2 = setInterval(this.showAllRecord,2000);
    this.interval3 = setInterval(this.getList,2000);
  },
  beforeDestroy() {
    // 销毁定时器
    clearInterval(this.timerId);
    clearInterval(this.interval2);
    clearInterval(this.interval3);
  },

  methods: {
    /** 文件名为空错误 */
    showMessageName() {
      //this.showmessageName = true;
      //setTimeout(() => {
      //this.showmessageName = false;
      //}, 1700);
      this.$message.error('操作失败，任务名不能为空');
    },
    /** 搜集时间不为整数错误 */
    showMessageTime() {
      //this.showmessageTime = true;
      //setTimeout(() => {
      //  this.showmessageTime = false;
      //}, 1700);
      this.$message.error('操作失败，收集时间必须为整数');
    },
    updateCurrentPage() {
      return this.$refs["page"].currentPage;
    },
    /** 查询种子地址文件总览列表 */
    getList() {
      this.loading = true;
      showCollectList1(this.queryParams).then(response => {
        this.collectIPList = response.rows;
        this.loading = false;
      });
      showIPAddrs2().then(response => {
        this.ipaddrs = response.rows;
        this.loading = false;
      });
    },
    /** 从出口流量和交换机批量收集IP地址 */
    startcollect() {
      if (!this.collectip.filename) {
        this.showMessageName();
        return;
      }
      if (!this.collectip.collectime) {
        this.collectip.collectime = '30';
      }
      if(!Number.isInteger(Number(this.collectip.collectime))){
        this.showMessageTime();
        return;
      }
      if (!this.collectip.timetype) {
        this.collectip.timetype = 'sec';
      }
      this.dialogVisible=false;
      inserTask(this.collectip).then( response => {
        console.log(response);
        this.getList();
        startCollect(this.collectip).then( response => {
          console.log(response);
          this.getList();
        });
      });
    },
    taskNotReady(row) {
      if(row.source == "出口流量和交换机"){
        this.timerId = setInterval(() => {
          this.getCmd(row.uniqueID);
        }, 1000);
        this.showNotReady1 = true;
      }
      if(row.source == "已有资产"){
        this.timerId = setInterval(() => {
          this.getCmd2(row.uniqueID);
        }, 1000);
        this.showNotReady2 = true;
      }
    },
    showAllRecord(){
      showAllRecord2().then(response => {
        this.detail2DataListTemp = response.rows;
      });
    },
    closeNotReady() {
      clearInterval(this.timerId);
    },
    getCmd(taskId){
      getCmd(taskId).then(response => {
        this.tempCmd = response.msg;
        console.log(response);
      });
    },
    getCmd2(taskId){
      showCommand2(taskId).then(response => {
        this.detail2DataList = response.rows;
        console.log(response);
      });
    },
    findTask(row){
      const taskId = row.uniqueID;
      findTask(taskId).then(response => {
        console.log(response.msg)
        if (response.msg == "运行中") {
          this.taskNotReady(row);
          return;
        } else if(response.msg == "运行完毕") {
          this.$router.push('/collectipde');
        } else if(response.msg == "被终止") {
          this.taskNotReady(row);
          return;
        }
      }).catch(error => {
        console.error(error);
      });
    },
    terminateTask(row){
      this.$modal.confirm('是否确认终止该任务？').then(() => {
        const taskId = row.uniqueID;
        if(row.source == "出口流量和交换机") {
          terminateTask(taskId).then(response => {
            this.getList();
            this.$modal.msgSuccess("终止成功");
          });
        }
        if(row.source == "已有资产") {
          terminateTask2(taskId).then(response => {
            this.getList();
            this.$modal.msgSuccess("终止成功");
          });
        }
      }).catch(() => {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const taskId = row.uniqueID || this.ids;
      this.$modal.confirm('是否确认删除任务信息？').then(() => {
        if (Array.isArray(taskId)) {
          // 如果taskId是一个数组，则遍历这个数组，对每个元素执行删除操作
          taskId.forEach(id => {
            delTaskInfo(id).then(() => {
              this.getList();
              this.$modal.msgSuccess("删除成功");
              this.getList();
            }).catch(() => {});
            this.getList();
          });
        } else {
          // 如果taskId不是一个数组，则直接执行删除操作
          delTaskInfo(taskId).then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
            this.getList();
          }).catch(() => {});
          this.getList();
        }
      }).catch(() => {});
    },
    /** 导出已经收集到的IP地址*/
    extractIP(){
      const addrs = this.ipaddrs;
      const addrstr = addrs.join('\n');  // 将元素连接成一个字符串，并在元素之间使用换行符连接
      const blob = new Blob([addrstr], { type: 'text/plain' });  // 创建一个 Blob 对象
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'IPv6Addrs.txt';  // 指定下载文件的文件名为 data.txt
      link.click();  // 触发链接点击事件来下载文件
      URL.revokeObjectURL(link.href);  // 释放 URL 对象
    }
  }
};
</script>
<style>
  h3 {color: #157a0c}
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .card span > span1 {
    background-color: orange;
    border-radius: 4px;
    padding: 2px 5px;
    color: antiquewhite;
  }
  .card span > span2 {
    background-color: mediumseagreen;
    border-radius: 4px;
    padding: 2px 5px;
    color: antiquewhite;
  }
  .card span > span3 {
    background-color: red;
    border-radius: 4px;
    padding: 2px 5px;
    color: antiquewhite;
  }
  /* 调整 Element UI 滚动条宽度 */
  .el-scrollbar__wrap::-webkit-scrollbar {
    width: 5px;
  }

  .el-scrollbar__wrap::-webkit-scrollbar-thumb {
    border-radius: 0;
  }

  .el-scrollbar__wrap::-webkit-scrollbar-track {
    border-radius: 0;
  }
</style>
