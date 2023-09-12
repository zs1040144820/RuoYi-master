<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="ipv6地址" prop="ipv6Addr" label-width="80px">
        <el-input
          v-model="queryParams.ipv6Addr"
          placeholder="请输入ipv6地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="指纹信息" prop="resultDetails">
        <el-input
          v-model="queryParams.resultDetails"
          placeholder="请输入指纹信息"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="nmap命令" prop="command" label-width="80px">
        <el-input
          v-model="queryParams.command"
          placeholder="请输入nmap命令"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扫描时间">
        <el-date-picker
          v-model="daterangeScanTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="cve-id" prop="cve">
        <el-input
          v-model="queryParams.cve"
          placeholder="请输入cve-id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="cnv-did" prop="cnnd">
        <el-input
          v-model="queryParams.cnnd"
          placeholder="请输入cnv-did"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作系统" prop="os">
        <el-input
          v-model="queryParams.os"
          placeholder="请输入操作系统"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务" prop="services">
        <el-input
          v-model="queryParams.services"
          placeholder="请输入服务"
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
          v-hasPermi="['vuln:singleDetails:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['vuln:singleDetails:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="singleDetailsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="ipv6地址主键id" align="center" prop="ipaddrId" />-->
      <!--<el-table-column label="探测历史主键id" align="center" prop="recordsId" />-->
      <el-table-column label="ipv6地址" align="center" prop="ipv6Addr" />
      <el-table-column label="nmap命令" align="center" prop="command" />
      <el-table-column label="扫描时间" align="center" prop="scanTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.scanTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cve-id" align="center" prop="cve">
      </el-table-column>
      <el-table-column label="cnnvd-id" align="center" prop="cnnd" >
        <template slot-scope="scope">
          <div>
            <router-link :to="'/vuln/cnnvd/'+scope.row.cve" style="color: #00afff;">查看</router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作系统" align="center" prop="os" />
      <el-table-column label="服务" align="center" prop="services">
        <template slot-scope="scope">
          <div v-for="item in scope.row.services.split(',')">
            {{item}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="指纹信息" align="center" prop="resultDetails">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="showResult(scope.row)"
            v-hasPermi="['vuln:singleDetails:remove']"
          >查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['vuln:singleDetails:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-card class="box-card">
        <div v-html="this.results">

        </div>
      </el-card>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { listSingleDetails, getSingleDetails, delSingleDetails, addSingleDetails, updateSingleDetails } from "@/api/vuln/singleDetails";

export default {
  name: "SingleDetails",
  data() {
    return {
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
      // 单条地址扫描结果表格数据
      singleDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 服务时间范围
      daterangeScanTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        recordsId: this.$route.params.id,
        ipv6Addr: null,
        resultDetails: null,
        command: null,
        scanTime: null,
        cve: null,
        cnnd: null,
        os: null,
        services: null
      },
      // 表单参数
      results:"",
      form: {},
      // 表单校验
      rules: {
        recordsId: [
          { required: true, message: "探测历史主键id不能为空", trigger: "blur" }
        ],
        ipv6Addr: [
          { required: true, message: "ipv6地址不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单条地址扫描结果列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeScanTime && '' != this.daterangeScanTime) {
        this.queryParams.params["beginScanTime"] = this.daterangeScanTime[0];
        this.queryParams.params["endScanTime"] = this.daterangeScanTime[1];
      }
      listSingleDetails(this.queryParams).then(response => {
        this.singleDetailsList = response.rows;
        console.log(response);
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
        ipaddrId: null,
        recordsId: null,
        ipv6Addr: null,
        resultDetails: null,
        command: null,
        scanTime: null,
        cve: null,
        cnnd: null,
        os: null,
        services: null
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
      this.daterangeScanTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.ipaddrId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加单条地址扫描结果";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ipaddrId = row.ipaddrId || this.ids
      getSingleDetails(ipaddrId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改单条地址扫描结果";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.ipaddrId != null) {
            updateSingleDetails(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSingleDetails(this.form).then(response => {
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
      const ipaddrIds = row.ipaddrId || this.ids;
      this.$modal.confirm('是否确认删除单条地址扫描结果编号为"' + ipaddrIds + '"的数据项？').then(function() {
        return delSingleDetails(ipaddrIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    showResult(row){
      this.open = true;
      this.results = row.resultDetails;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('vuln/singleDetails/export', {
        ...this.queryParams
      }, `singleDetails_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
