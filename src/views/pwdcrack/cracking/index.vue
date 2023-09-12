<template>
  <div class="app-container">
    <div style="float: left">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" :inline="true" label-width="100px">
        <el-form-item label="目标地址">
          <el-input
            v-model="formData.ipAddress"
            placeholder="请输入目标地址"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <br>
        <el-form-item>
          <span slot="label">
            端口
            <el-tooltip content="不指定端口，则使用协议默认端口" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input
            v-model="formData.port"
            placeholder="请输入端口号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <br>
        <el-form-item label="用户名">
          <el-input
            v-model="formData.uname"
            placeholder="请输入用户名"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <br>
        <el-form-item label="协议/数据库">
          <el-select v-model="formData.protoc" filterable placeholder="请选择" clearable="true">
            <el-option
              v-for="item in protocolOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="系统字典">
          <el-select v-model="formData.dic"
                     @change="input1Disabled = formData.dic !== ''"
                     v-bind:disabled="formData.myDic !== '' || input2Disabled"
                     filterable placeholder="请选择" clearable="true">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="自定义字典">
          <el-select v-model="formData.myDic"
                     @change="input2Disabled = formData.myDic !== ''"
                     v-bind:disabled="formData.dic !== '' || input1Disabled"
                     filterable placeholder="请选择" clearable="true">
            <el-option v-for="item in myWordList" :key="item" :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="上传">
          <el-upload
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
            <el-button slot="trigger" size="small" type="primary">浏览</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" :loading="upload.isUploading" v-hasPermi="['crack:importData']" @click="submitUpload">上传</el-button>
            <div slot="tip" class="el-upload__tip" style="font-size: 14px;color: red">上传自定义字典到服务器</div>
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item style="padding-left: 100px">
          <el-button
            type="primary"
            @click="submitForm"
            style="background-color: orangered;width: 300%"
            v-hasPermi="['crack:startCrack']"
          >开始</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="float: left">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>破解结果</span>
          <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
        </div>
        <div class="scroll-container"
             v-loading="loading"
             element-loading-text="破解中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
          <div v-html="this.crackResult" class="scroll-content"

          >
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
  import { startCrack,getWordList,getResults} from "@/api/pwdcrack/crack";
  import { getToken } from "@/utils/auth";
  export default {
    name:"Cracking",
    components: {},
    props: [],
    data() {
      return {
        upload: {
          // 是否禁用上传
          isUploading: false,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/crack/importData",
          // 上传的文件列表
          fileList: []
        },
        input1Disabled:false,
        input2Disabled: false,
        //文件信息
        fileInfo: {},
        loading: false,
        formData: {
          ipAddress:null,
          uname:null,
          port:null,
          protoc:null,
          dic:'',
          myDic:'',
          crackResult:'',
        },
        myWordList:[],
        protocolOptions:[
          {
            value: 'pop3',
            label: 'POP3'
          }, {
            value: 'rdp',
            label: 'RDP'
          }, {
            value: 'ftp',
            label: 'FTP'
          }, {
            value: 'telnet',
            label: 'Telnet'
          }, {
            value: 'mysql',
            label: 'Mysql'
          },{
            value: 'oracle',
            label: 'Oracle'
          },
        ],
        options: [{
          value: 'big.txt',
          label: 'big.txt'
        }, {
          value: 'small.txt',
          label: 'small.txt'
        }, {
          value: 'catala.txt',
          label: 'catala.txt'
        }, {
          value: 'common.txt',
          label: 'common.txt'
        }, {
          value: 'euskera.txt',
          label: 'euskera.txt'
        },{
          value: 'extensions_common.txt',
          label: 'extensions_common.txt'
        },
          {
            value: 'indexes.txt',
            label: 'indexes.txt'
          },
          {
            value: 'mutations_common.txt',
            label: 'mutations_common.txt'
          },
          {
            value: 'spanish.txt',
            label: 'spanish.txt'
          },
        ],
        crackResult:"",
        timeout:null,
      }

    },
    computed: {},
    watch: {},
    created() {
      getWordList().then(response => {
        this.myWordList = response.data;
      });
      //this.timeout = setInterval(this.getCResult,2000);
    },
    mounted() {
    },
    methods: {
      submitForm(){
        this.crackResult = "";
        this.timeout = setInterval(this.getCResult,1000);
        //this.loading = true;
        startCrack(this.formData).then(response => {
          console.log(response);
          //this.loading = false;
        });
      },
      getCResult(){
        getResults().then(response => {
          console.log(response);
          this.crackResult = response.data.crackResult;
          this.$nextTick(() => {
            if (!response.data.flag) {
              const container = this.$el.querySelector('.scroll-container');
              container.scrollTop = container.scrollHeight;
              console.log(container.scrollHeight);
            }else {
              const container = this.$el.querySelector('.scroll-container');
              container.scrollTop = container.scrollHeight;
              console.log(container.scrollHeight);
              clearInterval(this.timeout);
            }
          });
        });
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "提示", { dangerouslyUseHTMLString: true });
        this.upload.isUploading = false;
        getWordList().then(response => {
          this.myWordList = response.data;
        });
      },
      handleChange(file, fileList){

      },
      handleRemove(file, fileList){

      },
      // 文件提交处理
      submitUpload() {
        this.$refs.upload.submit()
      },
  }
  }

</script>
<style>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 1000px;
    height: 600px;
  }
  .scroll-container {
    height: 500px;
    overflow-y: scroll;
  }

  .scroll-content {
    height: 500px;
  }
</style>
