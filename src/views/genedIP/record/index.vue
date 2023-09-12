<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="输入文件名" prop="inputFilename" label-width="90px">
        <el-input
          v-model="queryParams.inputFilename"
          placeholder="请输入输入文件名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="输出文件名" prop="outputFilename" label-width="90px">
        <el-input
          v-model="queryParams.outputFilename"
          placeholder="请输入输出文件名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="daterangeStartTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="daterangeEndTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="是否启用多层级分类" prop="ismul" label-width="140px">
        <el-input
          v-model="queryParams.ismul"
          placeholder="请输入是否启用多层级分类"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生成总地址数" prop="totalNums"label-width="120px">
        <el-input
          v-model="queryParams.totalNums"
          placeholder="请输入生成总地址数"
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
          v-hasPermi="['genedIP:record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['genedIP:record:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" >
        <template slot-scope="scope">
          {{ (scope.$index+1)+(updateCurrentPage()-1)*queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="输入文件名" align="center" prop="inputFilename" />
      <!--<el-table-column label="输出文件名" align="center" prop="outputFilename" />-->
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查看" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/genedIP/details/'+scope.row.recordId" style="color: #00afff;font-size: smaller">查看</router-link>
        </template>
      </el-table-column>
      <el-table-column label="是否启用多层级分类" align="center" >
        <template slot-scope="scope">
          <el-switch
            disabled
            v-model="scope.row.ismul"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="生成总地址数" align="center" prop="totalNums" />
      <el-table-column label="存活性探测" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="detectIP(scope.row)"
            v-hasPermi="['genedIP:record:detectisActive']"
          >存活探测</el-button>
          &nbsp&nbsp&nbsp
          <router-link :to="'/genedIP/detect/'+scope.row.recordId" style="color: #00afff;font-size: smaller">历史</router-link>
        </template>
      </el-table-column>
      <el-table-column label="别名区训练" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="aliasDetect(scope.row)"
            v-hasPermi="['genedIP:record:aliasDetect']"
          >训练</el-button>
          <el-button
            size="mini"
            type="text"
            @click="showaliasDetectResult(scope.row)"
          >结果</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['genedIP:record:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      ref="page"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!--别名区弹窗-->
    <el-dialog :title="title" :visible.sync="openAlias" width="500px" append-to-body>
      <el-card v-html="aliasResult"></el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { aliasDet, isactive, listRecord, getRecord, delRecord, addRecord, updateRecord } from "@/api/genedIP/record";

export default {
  name: "Record",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedAddrgenRecordDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生成记录表格数据
      recordList: [],
      // 生成文件详情表格数据
      addrgenRecordDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openAlias: false,
      // 主表id时间范围
      daterangeGenTime: [],
      // 主表id时间范围
      daterangeStartTime: [],
      // 主表id时间范围
      daterangeEndTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inputFilename: null,
        outputFilename: null,
        genTime: null,
        startTime: null,
        endTime: null,
        ismul: null,
        totalNums: null,
      },
      aliasResult:null,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    updateCurrentPage() {
      return this.$refs["page"].currentPage;
    },
    /** 查询生成记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeGenTime && '' != this.daterangeGenTime) {
        this.queryParams.params["beginGenTime"] = this.daterangeGenTime[0];
        this.queryParams.params["endGenTime"] = this.daterangeGenTime[1];
      }
      if (null != this.daterangeStartTime && '' != this.daterangeStartTime) {
        this.queryParams.params["beginStartTime"] = this.daterangeStartTime[0];
        this.queryParams.params["endStartTime"] = this.daterangeStartTime[1];
      }
      if (null != this.daterangeEndTime && '' != this.daterangeEndTime) {
        this.queryParams.params["beginEndTime"] = this.daterangeEndTime[0];
        this.queryParams.params["endEndTime"] = this.daterangeEndTime[1];
      }
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.openAlias = false;
    },
    // 表单重置
    reset() {
      this.form = {
        recordId: null,
        inputFilename: null,
        outputFilename: null,
        genTime: null,
        startTime: null,
        endTime: null,
        ismul: null,
        totalNums: null
      };
      this.addrgenRecordDetailsList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeGenTime = [];
      this.daterangeStartTime = [];
      this.daterangeEndTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.recordId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加生成记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId || this.ids
      getRecord(recordId).then(response => {
        this.form = response.data;
        this.addrgenRecordDetailsList = response.data.addrgenRecordDetailsList;
        this.open = true;
        this.title = "修改生成记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.addrgenRecordDetailsList = this.addrgenRecordDetailsList;
          if (this.form.recordId != null) {
            updateRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /* 探测存活性*/
    detectIP(row){
      isactive(row.recordId).then(reponse =>{
        console.log(reponse);
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.recordId || this.ids;
      this.$modal.confirm('是否确认删除生成记录编号为"' + recordIds + '"的数据项？').then(function() {
        return delRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /* 别名区训练*/
    aliasDetect(row) {
      aliasDet(row.recordId).then(reponse =>{
        console.log(reponse);
      });
    },
    /* 别名区训练结果*/
    showaliasDetectResult(row){
      console.log(row.alias);
      this.openAlias = true;
      this.aliasResult = row.alias;
    },
	/** 生成文件详情序号 */
    rowAddrgenRecordDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 生成文件详情添加按钮操作 */
    handleAddAddrgenRecordDetails() {
      let obj = {};
      obj.ipaddr = "";
      obj.isactive = "";
      this.addrgenRecordDetailsList.push(obj);
    },
    /** 生成文件详情删除按钮操作 */
    handleDeleteAddrgenRecordDetails() {
      if (this.checkedAddrgenRecordDetails.length == 0) {
        this.$modal.msgError("请先选择要删除的生成文件详情数据");
      } else {
        const addrgenRecordDetailsList = this.addrgenRecordDetailsList;
        const checkedAddrgenRecordDetails = this.checkedAddrgenRecordDetails;
        this.addrgenRecordDetailsList = addrgenRecordDetailsList.filter(function(item) {
          return checkedAddrgenRecordDetails.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleAddrgenRecordDetailsSelectionChange(selection) {
      this.checkedAddrgenRecordDetails = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('genedIP/record/export', {
        ...this.queryParams
      }, `record_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
