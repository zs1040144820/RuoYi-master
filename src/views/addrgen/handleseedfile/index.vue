<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名" prop="addrSeedfileName">
        <el-input
          v-model="queryParams.addrSeedfileName"
          placeholder="请输入文件名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传时间" prop="addrSeedfileUploadtime">
        <el-date-picker clearable
          v-model="queryParams.addrSeedfileUploadtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择上传时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="文件大小" prop="addrSeedfileSize">
        <el-input
          v-model="queryParams.addrSeedfileSize"
          placeholder="请输入文件大小"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['addrgen:handleseedfile:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['addrgen:handleseedfile:export']"
        >导出</el-button>
      </el-col>
      <el-upload
        v-hasPermi="['addrgen:handleseedfile:importSeedFile']"
        style="padding-left: 30px"
        ref="upload"
        :limit="1"
        name="file"
        :data="fileInfo"
        accept=".txt"
        :action="upload.url"
        :headers="upload.headers"
        :file-list="upload.fileList"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-change="handleChange"
        :before-remove="handleRemove"
        :before-upload="handleBeforeUpload"
        :auto-upload="false">
        <el-button slot="trigger" size="mini" type="primary">选择种子文件</el-button>
        <el-button style="margin-left: 10px;" size="mini" type="success" :loading="upload.isUploading" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip" style="font-size: 14px;color: red">提示：选择种子地址文件，只能上传txt文件！上传文件后，请先进行格式化再进行其他操作！</div>
      </el-upload>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="handleseedfileList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" >
        <template slot-scope="scope">
          {{ (scope.$index+1)+(updateCurrentPage()-1)*queryParams.pageSize }}
        </template>
      </el-table-column>
      <!--<el-table-column label="种子地址文件id" align="center" prop="addrSeedfileId" />-->
      <el-table-column label="文件名" align="center" prop="addrSeedfileName" />
      <el-table-column label="上传时间" align="center" prop="addrSeedfileUploadtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addrSeedfileUploadtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" align="center" prop="addrSeedfileSize" />
      <el-table-column label="详细信息" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div>
            <router-link :to="'/addrgen/details/'+scope.row.addrSeedfileId" style="color: #00afff;font-size: smaller">查看</router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="格式化" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div>
            <el-button
              size="mini"
              type="text"
              :icon="scope.row.formaticon"
              @click="formatAddr(scope.row)"
              v-hasPermi="['addrgen:handleseedfile:formatAddr']"
            >格式化</el-button>
            &nbsp&nbsp&nbsp
            <router-link :to="'/addrgen/format/'+scope.row.addrSeedfileId" style="color: #00afff;font-size: smaller">历史</router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="采集IPv6地址" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-alarm-clock"
            @click="collectStart(scope.row)"
            v-hasPermi="['addrgen:handleseedfile:setcollect']"
          >设置</el-button>
          &nbsp&nbsp&nbsp
          <router-link :to="'/addrgen/collect/'+scope.row.addrSeedfileId" style="color: #00afff;font-size: smaller">历史</router-link>
        </template>
      </el-table-column>
      <el-table-column label="存活性探测" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-alarm-clock"
            @click="detectStart(scope.row)"
            v-hasPermi="['addrgen:handleseedfile:setdetect']"
          >设置</el-button>
          &nbsp&nbsp&nbsp
          <router-link :to="'/addrgen/detect/'+scope.row.addrSeedfileId" style="color: #00afff;font-size: smaller">历史</router-link>
        </template>
      </el-table-column>
      <el-table-column label="处理" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['addrgen:handleseedfile:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="地址生成" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link v-hasPermi="['addrgen:handleseedfile:genAddr']" :to="'/addrgen/gen/'+scope.row.addrSeedfileId+'/'+scope.row.addrSeedfileName" tag="button" style="background-color: orangered;font-size: 12px;color: white;border: none">地址扩展</router-link>
        </template>
      </el-table-column>
      <!-- 打开采集弹框 -->
      <el-dialog title="对资产列表进行地址采集" :visible.sync="openCollect" width="500px" append-to-body>
        <el-form :model="collectStartForm">
          <el-form-item label="定时时间">
            <el-date-picker
              v-model="collectStartForm.startTime"
              value-format="yyyy:MM:dd:H:m:s"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="关闭/开启定时任务">
            <el-switch
              v-model="collectStartForm.status"
              active-value="0"
              inactive-value="1">
            </el-switch>
          </el-form-item>
          <el-form-item label="提示：">
            先点击表格右上角刷新按钮，刷新任务执行状态。采集地址任务每次设置后只会执行一次。设置任务时间时，点击此刻后，将时间设置的比此刻晚2-3分钟，以防止错过
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitCollectForm" style="background-color: red">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </el-table>
    <!-- 存活性探测弹框 -->
    <el-dialog title="存活性探测" :visible.sync="openActive" width="500px" append-to-body>
      <el-form :model="activeStartForm">
        <el-form-item label="定时时间">
          <el-date-picker
            v-model="activeStartForm.startTime"
            value-format="yyyy:MM:dd:H:m:s"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="探测天数">
          <el-input
            v-model="activeStartForm.collectDays"
            placeholder="输入0-30中某个数字"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="关闭/开启定时任务">
          <el-switch
            v-model="activeStartForm.status"
            active-value="0"
            inactive-value="1">
          </el-switch>
        </el-form-item>
        <el-form-item label="提示：">
          先点击表格右上角刷新按钮，刷新任务执行状态。设置任务时间时，点击此刻后，将时间设置的比此刻晚2-3分钟，以防止错过。点击确定后，会自动探测当前设置时间往后30天的地址活跃状态并保存在探测结果1-30中，同一文件同一时段只能开启一个探测任务
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitactiveStartForm" style="background-color: red">确 定</el-button>
        <el-button @click="cancelactiveStartForm">取 消</el-button>
      </div>
    </el-dialog>

    <pagination
      ref="page"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { updateHandleseedfile2,runJobforDetect, runJob, formatIPv6, listHandleseedfile, getHandleseedfile, delHandleseedfile, addHandleseedfile, updateHandleseedfile } from "@/api/addrgen/handleseedfile";
import { getToken } from "@/utils/auth";

export default {
  name: "Handleseedfile",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedAddrgenSeedfileDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 种子地址文件总览表格数据
      handleseedfileList: [],
      // 种子文件详情表格数据
      addrgenSeedfileDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openCollect: false,
      openActive: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        addrSeedfileName: null,
        addrSeedfileUploadtime: null,
        addrSeedfileSize: null
      },
      //文件信息
      fileInfo: {},
      // 上传参数
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/addrgen/handleseedfile/importSeedFile",
        // 上传的文件列表
        fileList: []
      },
      collectStartForm:{
        jobName:'种地地址采集',
        jobGroup: 'DEFAULT',
        invokeTarget:'',
        cronExpression:'',
        misfirePolicy:'1',
        concurrent:'0',
        status:'0',
        //加一个文件主键
        sfileID:'',
      },
      activeStartForm:{
        jobName:'地址存活性探测',
        jobGroup: 'DEFAULT',
        invokeTarget:'',
        cronExpression:'',
        misfirePolicy:'1',
        concurrent:'0',
        status:'0',
        //加一个文件主键
        sfileID:'',
        collectDays:'',
      },
      // 表单参数
      form: {},
      //更新任务状态
      updateform:[],
      // 表单校验
      rules: {
        addrSeedfileName: [
          { required: true, message: "文件名不能为空", trigger: "blur" }
        ],
        addrSeedfileUploadtime: [
          { required: true, message: "上传时间不能为空", trigger: "blur" }
        ],
        addrSeedfileSize: [
          { required: true, message: "文件大小不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.timeout = setInterval(this.getList,60000);//注意this.getCommands不加括号
  },
  methods: {
    updateCurrentPage() {
      return this.$refs["page"].currentPage;
    },
    /** 查询种子地址文件总览列表 */
    getList() {
      this.loading = true;
      listHandleseedfile(this.queryParams).then(response => {
        this.handleseedfileList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.openCollect = false;
    },
    cancelactiveStartForm() {
      this.openActive = false;
    },
    // 表单重置
    reset() {
      this.form = {
        addrSeedfileId: null,
        addrSeedfileName: null,
        addrSeedfileUploadtime: null,
        addrSeedfileSize: null
      };
      this.addrgenSeedfileDetailsList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.addrSeedfileId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加种子地址文件总览";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const addrSeedfileId = row.addrSeedfileId || this.ids
      getHandleseedfile(addrSeedfileId).then(response => {
        this.form = response.data;
        this.addrgenSeedfileDetailsList = response.data.addrgenSeedfileDetailsList;
        this.open = true;
        this.title = "修改种子地址文件总览";
      });
    },
    //提交采集表单
    submitCollectForm(){
      this.updateform.collect = this.collectStartForm.status //把记录中的采集状态设置为status的值
      updateHandleseedfile2(this.updateform);
      console.log(this.collectStartForm.startTime);
      this.collectStartForm.cronExpression = this.collectStartForm.startTime.toString();
      console.log(this.collectStartForm.cronExpression);
      runJob(this.collectStartForm).then(response => {
        console.log(response);
      });
      this.openCollect = false;
    },
    submitactiveStartForm(){
      this.updateform.detect = this.activeStartForm.status
      updateHandleseedfile2(this.updateform);
      this.activeStartForm.cronExpression = this.activeStartForm.startTime.toString();
      console.log(this.activeStartForm.cronExpression);
      runJobforDetect(this.activeStartForm).then(response => {
        console.log(response);
      });
      this.openActive = false;
    },
    /** 提交按钮 */
    /*submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.addrgenSeedfileDetailsList = this.addrgenSeedfileDetailsList;
          if (this.form.addrSeedfileId != null) {
            updateHandleseedfile(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHandleseedfile(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },*/

    /* 格式化 */
    formatAddr(row){
      formatIPv6(row).then(reponse => {
      });
    },
    collectStart(row){
      this.updateform = row;
      console.log(row.collect);
      this.collectStartForm.sfileID = row.addrSeedfileId;
      console.log("文件ID"+this.collectStartForm.sfileID);
      this.collectStartForm.invokeTarget = 'detectAddrTask.detectIP("'+row.addrSeedfileId+'");';//拼接
      //this.collectStartForm.cronExpression = '0 0/1 * * * ?';
      this.collectStartForm.status = row.collect;
      this.openCollect = true;
    },
    detectStart(row){
      this.updateform = row;
      console.log(row.detect);
      this.activeStartForm.sfileID = row.addrSeedfileId;
      this.activeStartForm.invokeTarget = 'activeDetectTask.detectIP("'+row.addrSeedfileId+'");';//拼接
      //this.collectStartForm.cronExpression = '0 0/1 * * * ?';
      this.activeStartForm.status = row.detect;
      this.openActive = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const addrSeedfileIds = row.addrSeedfileId || this.ids;
      this.$modal.confirm('是否确认删除种子地址文件总览编号为"' + addrSeedfileIds + '"的数据项？').then(function() {
        return delHandleseedfile(addrSeedfileIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 种子文件详情序号 */
    rowAddrgenSeedfileDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },

    /** 种子文件详情删除按钮操作 */
    handleDeleteAddrgenSeedfileDetails() {
      if (this.checkedAddrgenSeedfileDetails.length == 0) {
        this.$modal.msgError("请先选择要删除的种子文件详情数据");
      } else {
        const addrgenSeedfileDetailsList = this.addrgenSeedfileDetailsList;
        const checkedAddrgenSeedfileDetails = this.checkedAddrgenSeedfileDetails;
        this.addrgenSeedfileDetailsList = addrgenSeedfileDetailsList.filter(function(item) {
          return checkedAddrgenSeedfileDetails.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleAddrgenSeedfileDetailsSelectionChange(selection) {
      this.checkedAddrgenSeedfileDetails = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('addrgen/handleseedfile/export', {
        ...this.queryParams
      }, `handleseedfile_${new Date().getTime()}.xlsx`)
    },
    // 文件提交处理
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "提示", { dangerouslyUseHTMLString: true });
      this.upload.isUploading = false;
    },
    handleChange(file, fileList){

    },
    handleRemove(file, fileList){

    },
    handleBeforeUpload(file){
      console.log(file.name);
      console.log(file.size);
      this.fileInfo.addrSeedfileName = file.name;
      this.fileInfo.addrSeedfileSize = file.size;
    },
  }
};
</script>
<style>
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
