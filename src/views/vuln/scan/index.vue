<template>
  <div class="app-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" :inline="true" label-width="100px">
      <el-form-item prop="scriptSelect">
        <span slot="label">
            脚本选择
            <el-tooltip content="勾选“全选”后，不需要单独勾选脚本" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
        <el-select v-model="formData.scriptSelect" placeholder="可多选"  multiple filterable clearable>
          <el-option v-for="item in scriptSelectOptions" :key="item" :label="item"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="formData.checked">全选</el-checkbox>
      </el-form-item>
      <br>
      <el-form-item>
        <span slot="label">
            指定端口
            <el-tooltip content="指定端口后，将只进行端口扫描。脚本扫描、数据库探测、操作系统探测都不会进行。" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
        <el-switch
          v-model="portSwitch">
        </el-switch>
        <el-input v-model="formData.startPort" placeholder="起始端口1-65535" :disabled="!portSwitch" style="width: 160px" clearable>
        </el-input>-
        <el-input v-model="formData.endPort" placeholder="结束端口1-65535" :disabled="!portSwitch" style="width: 160px" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="探测数据库型号" label-width="110px">
        <el-switch
          v-model="formData.databaseSwitch">
        </el-switch>
      </el-form-item>
      <el-form-item label="探测操作系统型号" label-width="130px">
        <el-switch
          v-model="formData.osSwitch">
        </el-switch>
      </el-form-item>
      <br>
      <el-form-item label="起始地址" prop="srcIP" >
        <el-input v-model="formData.srcIP" placeholder="" :disabled="srcIPFlag" style="width: 350px" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="结束地址" prop="desIP" >
        <el-input v-model="formData.desIP" placeholder="非必填项" :disabled="desIPFlag" style="width: 350px" clearable>
        </el-input>
      </el-form-item>
      <el-form-item size="medium">
        <el-button
          type="primary"
          @click="submitForm1"
          v-hasPermi="['vuln:scan:scanvuln']"
          style="background-color: orangered">
          扫描
        </el-button>
      </el-form-item>

      <el-upload
        style="padding-left: 30px"
        ref="upload"
        :limit="1"
        name="file"
        accept=".txt"
        :action="upload.url"
        :headers="upload.headers"
        :file-list="upload.fileList"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-change="handleChange"
        :before-remove="handleRemove"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取地址文件</el-button>
        <!--<el-button style="margin-left: 10px;" size="small" type="success" :loading="upload.isUploading" @click="submitUpload">上传到服务器</el-button>-->
        <div slot="tip" class="el-upload__tip" style="font-size: 14px;color: red">提示：此按钮可选择地址文件作为输入，只能上传txt文件，txt文件每行应只有一个IPv6地址。选择地址文件后，输入框中的“起始地址”和“结束地址”无效！</div>
      </el-upload>
    </el-form>
    <br>
    <div v-for="(cmd,index) in commandlist" :key="index">
      <el-card >
        <div slot="header" class="clearfix">
          <span>任务标识 {{cmd.uuid}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-caret-right" @click="stopThread(cmd)">
            {{cmd.status}} </el-button>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-delete-solid" @click="deleteRecord(cmd)">删除 </el-button>
        </div>
        <!--<div v-html="cmd.srcIP - cmd.desIP" v-loading="cmd.loading">
        </div>-->
        <div>
          起始地址：{{cmd.srcIP}}<br>
          结束地址：{{cmd.desIP}}<br>
          文件输入：{{cmd.useFile}}<br>
          端口号：{{cmd.startPort}}-{{cmd.endPort}}<br>
          数据库探测：{{cmd.databaseSwitch}}<br>
          服务探测：true<br>
          操作系统探测：{{cmd.osSwitch}}<br>
          探测结果：<br>
          <div v-html="cmd.output"/>
          <el-progress :text-inside="true" :stroke-width="26" :percentage=cmd.rate></el-progress>
        </div>
      </el-card>
      <br>
    </div>
  </div>
</template>
<script>
  import { initVulnScript, scanVuln,getOngoingC,getOngoingCom,stopThread,delCommand,reStart} from "@/api/vuln/scan";
  import { getToken } from "@/utils/auth";
  export default {
    name:"Scan",
    components: {},
    props: [],
    data() {
      return {
        formData: {
          uuid:"",
          scriptSelect: [],
          checked: true,
          srcIP: "",
          desIP: "",
          useFile: false,
          addrFileName: "",
          startPort:"",
          endPort:"",
          databaseSwitch:false,
          osSwitch:false,
        },
        portSwitch:false,

        // 上传参数
        upload: {
          // 是否禁用上传
          isUploading: false,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/vuln/scan/importAddr",
          // 上传的文件列表
          fileList: []
        },
        srcIPFlag: false,
        desIPFlag: false,
        scriptSelectRequiredFlag: true,
        rules: {
          scriptSelect: [{
            type: 'array',
            message: '请至少选择一个漏洞或者全选',
            trigger: 'change'
          }],
          /*srcIP: [{
            required: false,
            pattern: /^([0-9a-f]{0,4}:){7}[0-9a-f]{1,4}$/,
            message: '请输入正确的IPv6靶机地址',
            trigger: 'blur'
          }],*/
          desIP: [{
            required: false,
            pattern: /^([0-9a-f]{0,4}:){7}[0-9a-f]{1,4}$/,
            message: '请输入正确的IPv6靶机地址',
            trigger: 'blur'
          }],
        },
        scriptSelectOptions: [],
        commandlist: {
          uuid:"",
          output:"",
          scriptSelect: [],
          checked: true,
          srcIP: "",
          desIP: "",
          useFile: false,
          addrFileName: "",
          startPort:"",
          endPort:"",
          databaseSwitch:false,
          osSwitch:false,
          rate:"0",
        },
        timeout:null,
      }
    },
    computed: {},
    watch: {},
    created() {
      this.commandlist = {};
      initVulnScript().then(response => {
        this.scriptSelectOptions = response.data;
      });
      this.getCommands();
      this.timeout = setInterval(this.getCommands,3000);//注意this.getCommands不加括号
    },
    mounted() {},
    methods: {
      getCommands(){
        getOngoingC().then(response => {
          console.log(response);
          this.commandlist = response.data;
          getOngoingCom().then(response => {
            console.log("ongoing"+response.data);
            if(response.data === 0){
              clearInterval(this.timeout);
            }
          })
        });

      },
      submitForm(cmd) {
        this.$refs['elForm'].validate(valid => {
          if (!valid) return
          // TODO 提交表单
          if(this.formData.useFile){
            this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + "已选择种子文件作为输入"  + "</div>", "提示", { dangerouslyUseHTMLString: true });
          }
          var uuidx = this.uuid(8,10);
          this.commandlist.unshift({
            uuid: uuidx,
            srcIP: this.formData.srcIP,
            desIP: this.formData.desIP,
            startPort:this.formData.startPort,
            endPort:this.formData.endPort,
            databaseSwitch:this.formData.databaseSwitch,
            osSwitch:this.formData.osSwitch,
          })
          this.formData.uuid = uuidx;
          scanVuln(this.formData).then(response => {
            for(let item of this.commandlist){
              if(item.uuid == response.data.uuid){
                item.results = response.data.msg;
                item.loading = false;
              }
            }
          })
          this.timeout = setInterval(this.getCommands,3000);
        });
      },
      resetForm() {
        this.$refs['elForm'].resetFields()
      },
      deleteRecord(cmd) {
        delCommand(cmd.uuid).then(response =>{
        });
        this.getCommands();
      },
      // 文件提交处理
      submitUpload() {
        return new Promise((resolve)=>{
          resolve(
            this.$refs.upload.submit()
          );
        })
      },
      submitForm1(){
        this.submitUpload().then(()=>{
          this.submitForm();
        })
      },
      stopThread(cmd){
        if (cmd.status === "暂停"){
          stopThread(cmd.uuid).then(response => {
            console.log(response);
          });
        }else if (cmd.status === "继续"){
          reStart(cmd);
        }

      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.isUploading = false;
      },
      handleChange(file, fileList){
        this.srcIPFlag = true;
        this.desIPFlag = true;
        this.formData.useFile = true;
        this.formData.addrFileName = file.name;
        console.log(this.formData.addrFileName);
      },
      handleRemove(file, fileList){
        this.srcIPFlag = false;
        this.desIPFlag = false;
        this.formData.useFile = false;
      },

      uuid(len, radix){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
          // rfc4122, version 4 form
          var r;
          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
        return uuid.join('');
    },
  }

  }

</script>
<style>
  h3 {color: #157a0c}
</style>
