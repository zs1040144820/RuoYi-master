<template>
  <table class="position">
    <tr height="150px"></tr>
    <tr>
      <td class="column">&nbsp;</td>

      <el-tooltip placement="bottom" effect="">
        <div slot="content" class="tooltip">
          <td>
            <img src="../assets/images/userManage.png" height="40px" width="40px" class="small-hand" @click="user">
            <br/>用户管理
          </td>
          <td width="20px">&nbsp;</td>
          <td>
            <img src="../assets/images/role.png" height="40px" width="40px" class="small-hand" @click="role">
            <br/>角色管理
          </td>
          <td width="20px">&nbsp;</td>
          <td>
            <img src="../assets/images/menu.png" height="40px" width="40px" class="small-hand" @click="menu0">
            <br/>菜单管理
          </td>
        </div>
        <td text-align="center" class="font"><img src="../assets/images/user.png" height="120px" width="160px" class="small-hand" ><br/>系统管理</td>
      </el-tooltip>

      <el-tooltip placement="bottom" effect="">
        <div slot="content" class="tooltip">
          <td>
         <img src="../assets/images/handleseedfile1.png" height="40px" width="40px" class="small-hand" @click="handleseedfile">
          <br/>种子地址处理
          </td>
          <td width="20px">&nbsp;</td>
          <td>
            <img src="../assets/images/addressExtend.png" height="40px" width="40px" class="small-hand" @click="generaterecord">
            <br/>地址扩展记录
          </td>
        </div>
        <td text-align="center" class="font"><img src="../assets/images/addressPre.png" height="120px" width="160px" class="small-hand"><br/>地址预测</td>
      </el-tooltip>

      <el-tooltip placement="bottom" effect="">
        <div slot="content" class="tooltip">
          <td>
            <img src="../assets/images/vulnScan.png" height="40px" width="40px" class="small-hand" @click="scan">
            <br/>漏洞扫描
          </td>
          <td width="20px">&nbsp;</td>
          <td>
            <img src="../assets/images/history.png" height="40px" width="40px" class="small-hand" @click="history">
            <br/>历史记录
          </td>
          <td width="20px">&nbsp;</td>
          <td>
            <img src="../assets/images/repository.png" height="40px" width="40px" class="small-hand" @click="repository">
            <br/>漏洞库
          </td>
          <td width="20px">&nbsp;</td>
          <td>
            <img src="../assets/images/cnnvd.png" height="40px" width="40px" class="small-hand" @click="cnnvd">
            <br/>漏洞特征库
          </td>
        </div>
        <td text-align="center" class="font"><img src="../assets/images/vuln.png" height="120px" width="160px" class="small-hand"><br/>漏洞扫描</td>
      </el-tooltip>

      <el-tooltip placement="bottom" effect="">
        <div slot="content" class="tooltip">
          <td>
            <img src="../assets/images/crack.png" height="40px" width="40px" class="small-hand" @click="crack">
            <br/>口令破解
          </td>
          <td width="20px">&nbsp;</td>
          <td>
            <img src="../assets/images/record.png" height="40px" width="40px" class="small-hand" @click="record">
            <br/>破解记录
          </td>
        </div>
        <td text-align="center" class="font"><img src="../assets/images/pwdCrack.png" height="120px" width="160px" class="small-hand" ><br/>口令破解</td>
      </el-tooltip>

      <el-tooltip placement="bottom" effect="">
        <div slot="content" class="tooltip">
          <td>
            <img src="../assets/images/outletFlow.png" height="40px" width="40px" class="small-hand" @click="outlet">
            <br/>出口流量
          </td>
          <td width="20px">&nbsp;</td>
          <td>
            <img src="../assets/images/existAssets.png" height="40px" width="40px" class="small-hand" @click="existassets">
            <br/>已有资产
          </td>
          <td width="20px">&nbsp;</td>
          <td>
            <img src="../assets/images/taskManager.png" height="40px" width="40px" class="small-hand" @click="taskmanager">
            <br/>任务管理
          </td>
        </div>
        <td text-align="center" class="font"><img src="../assets/images/collectIP.png" height="120px" width="160px" class="small-hand" ><br/>收集IP地址</td>
      </el-tooltip>

      <td class="column">&nbsp;</td>
    </tr>
    <tr height="300px"></tr>
  </table>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  methods:{
    handleseedfile(){
      this.$router.push("/addrgen/handleseedfile");
    },
    generaterecord(){
      this.$router.push("/addrgen/record");
    },
    repository(){
      this.$router.push("/vuln/repository");
    },
    history(){
      this.$router.push("/vuln/history");
    },
    scan(){
      this.$router.push("/vuln/scanvuln");
    },
    user(){
      this.$router.push("/system/user");
    },
    role(){
      this.$router.push("/system/role");
    },
    menu0(){
      this.$router.push("/system/menu");
    },
    crack(){
      this.$router.push("/pwdcrack/crackling");
    },
    record(){
      this.$router.push("/pwdcrack/record");
    },
    outlet(){
      this.$router.push("/collectip/collectipt1");
    },
    existassets(){
      this.$router.push("/collectip/collectip2");
    },
    taskmanager(){
      this.$router.push("/collectip/collectipta");
    },
    cnnvd(){
      this.$router.push("/vuln/cnnvd");
    },
  }
}
</script>

<style>
.position{
  width: 1336px;
  height: 669.6px;
  text-align: center;
}

.column{
  width:150px;
}

.small-hand{
  cursor: pointer;
}

.tooltip{
  text-align: center;
  background-color:#f8f8f9;
}

.font{
}

</style>
