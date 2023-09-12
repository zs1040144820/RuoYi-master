<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="漏洞名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入漏洞名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="vuln-id" prop="vulnId">
        <el-input
          v-model="queryParams.vulnId"
          placeholder="请输入vuln-id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布时间" prop="published">
        <el-date-picker clearable
          v-model="queryParams.published"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择发布时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="调整时间" prop="modified">
        <el-date-picker clearable
          v-model="queryParams.modified"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择调整时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-input
          v-model="queryParams.source"
          placeholder="请输入来源"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="严重等级" prop="severity">
        <el-input
          v-model="queryParams.severity"
          placeholder="请输入严重等级"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="漏洞描述" prop="vulnDescript">
        <el-input
          v-model="queryParams.vulnDescript"
          placeholder="请输入漏洞描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="cve-id" prop="cveId">
        <el-input
          v-model="queryParams.cveId"
          placeholder="请输入cve-id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label-width="100px" label="漏洞解决方法" prop="vulnSolution">
        <el-input
          v-model="queryParams.vulnSolution"
          placeholder="请输入漏洞解决方法"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label-width="100px" label="文件所属年份" prop="fileYear">
        <el-input
          v-model="queryParams.fileYear"
          placeholder="请输入年份(格式yyyy-MM)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label-width="100px" label="所属文件年份" prop="fileYear">
        <el-date-picker clearable
          v-model="queryParams.fileYear"
          type="date"
          value-format="yyyy-MM"
          placeholder="请选择所属文件年份">
        </el-date-picker>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
     <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['vuln:cnnvd:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['vuln:cnnvd:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['vuln:cnnvd:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['vuln:cnnvd:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="down(url)"
        >下载漏洞特征文件</el-button>
      </el-col>
      <el-upload
        v-hasPermi="['addrgen:handleseedfile:importSeedFile']"
        style="padding-left: 30px"
        ref="upload"
        :limit="1"
        name="file"
        :data="fileInfo"
        accept=".xml"
        :action="upload.url"
        :headers="upload.headers"
        :file-list="upload.fileList"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-change="handleChange"
        :before-remove="handleRemove"
        :before-upload="handleBeforeUpload"
        :auto-upload="false">
        <el-button slot="trigger" size="mini" type="primary">选择漏洞特征文件</el-button>
        <el-button style="margin-left: 10px;" size="mini"
                   v-hasPermi="['vuln:cnnvd:importFile']"
                   type="success" :loading="upload.isUploading" @click="submitUpload">导入</el-button>

        <div slot="tip" class="el-upload__tip" style="font-size: 14px;color: red">提示：选择漏洞特征文件，只能上传xml文件!</div>
      </el-upload><br/>
      <el-progress :text-inside="true" :stroke-width="26" :percentage=rate ></el-progress>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cnnvdList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="漏洞名称" align="center" prop="name" />
      <el-table-column label="vuln-id" align="center" prop="vulnId" />
      <el-table-column label="发布时间" align="center" prop="published" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.published, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整时间" align="center" prop="modified" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modified, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center" prop="source" />
      <el-table-column label="严重等级" align="center" prop="severity" />
      <el-table-column label="漏洞类型" align="center" prop="vulnType" />
      <el-table-column label="漏洞描述" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="showDescription(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
     <!-- <el-table-column label="漏洞描述" align="center" prop="vulnDescript" />-->
      <el-table-column label="cve-id" align="center" prop="cveId" />
      <el-table-column label="漏洞解决方法" align="center" prop="vulnSolution" />
      <el-table-column label="所属文件年份" align="center" prop="fileYear" width="180">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['vuln:cnnvd:edit']"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['vuln:cnnvd:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改漏洞特征对话框 -->
   <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="漏洞名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入漏洞名称" />
        </el-form-item>
        <el-form-item label="vuln-id" prop="vulnId">
          <el-input v-model="form.vulnId" placeholder="请输入vuln-id" />
        </el-form-item>
        <el-form-item label="发布时间" prop="published">
          <el-date-picker clearable
            v-model="form.published"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="调整时间" prop="modified">
          <el-date-picker clearable
            v-model="form.modified"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择调整时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="form.source" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="严重等级" prop="severity">
          <el-input v-model="form.severity" placeholder="请输入严重等级" />
        </el-form-item>
        <el-form-item label="漏洞描述" prop="vulnDescript">
          <el-input v-model="form.vulnDescript" placeholder="请输入漏洞描述" />
        </el-form-item>
        <el-form-item label="cve-id" prop="cveId">
          <el-input v-model="form.cveId" placeholder="请输入cve-id" />
        </el-form-item>
        <el-form-item label="漏洞解决方法" prop="vulnSolution">
          <el-input v-model="form.vulnSolution" placeholder="请输入漏洞解决方法" />
        </el-form-item>
        <el-form-item label="所属文件年份" prop="fileYear">
          <el-date-picker clearable
            v-model="form.fileYear"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择所属文件年份">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->

    <!-- 查看描述弹框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>漏洞描述</span>
        </div>
        <div v-html="des" style="white-space:pre-wrap">
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCnnvd, getCnnvd, delCnnvd, addCnnvd, updateCnnvd ,backRate} from "@/api/vuln/cnnvd";
import {getToken} from "@/utils/auth";

export default {
  name: "Cnnvd",
  data() {
    return {
      //文件信息
      fileInfo: {},
      upload: {
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/vuln/cnnvd/importFile",
        // 上传的文件列表
        fileList: []
      },

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 漏洞特征表格数据
      cnnvdList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      rate:0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        vulnId: null,
        published: null,
        modified: null,
        source: null,
        severity: null,
        vulnType: null,
        vulnDescript: null,
        cveId: this.$route.params.id,
        vulnSolution: null,
        fileYear: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      url:"https://www.cnnvd.org.cn/home/dataDownLoad"
    };
  },
  created() {
    this.getList();
    this.timeout = setInterval(this.aa,1000);//注意this.getCommands不加括号
  },
  methods: {
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    aa(){
      backRate().then(response => {
        this.rate=response.msg;
        console.log(response);
      });
    },
    // 文件提交处理
    submitUpload() {
      this.$refs.upload.submit()
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
    /** 查询漏洞特征列表 */
    getList() {
      this.loading = true;
      listCnnvd(this.queryParams).then(response => {
        this.cnnvdList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        name: null,
        vulnId: null,
        published: null,
        modified: null,
        source: null,
        severity: null,
        vulnType: null,
        vulnDescript: null,
        cveId: null,
        vulnSolution: null,
        fileYear: null,
        cnnvdId: null
      };
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
      this.ids = selection.map(item => item.cnnvdId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    /*handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加漏洞特征";
    },*/
    /** 修改按钮操作 */
    /*handleUpdate(row) {
      this.reset();
      const cnnvdId = row.cnnvdId || this.ids
      getCnnvd(cnnvdId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改漏洞特征";
      });
    },*/
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.cnnvdId != null) {
            updateCnnvd(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCnnvd(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const cnnvdIds = row.cnnvdId || this.ids;
      this.$modal.confirm('是否确认删除漏洞特征编号为"' + cnnvdIds + '"的数据项？').then(function() {
        return delCnnvd(cnnvdIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('vuln/cnnvd/export', {
        ...this.queryParams
      }, `cnnvd_${new Date().getTime()}.xlsx`)
    },
    /*下载漏洞特征文件*/
    down(e){
    window.open(e,"_blank")
    },

    /* 展示描述 */
    showDescription(row){
      console.log(row.vulnDescript);
      this.des = row.vulnDescript;
      this.open = true;
      this.title = row.name;
    },

  }
};
</script>
