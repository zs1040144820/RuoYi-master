<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="目标地址" prop="desIp" >
        <el-input
          v-model="queryParams.desIp"
          placeholder="请输入目标地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="协议/数据库" prop="cProcotol" label-width="100px">
        <el-input
          v-model="queryParams.cProcotol"
          placeholder="请输入协议/数据库"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="密码字典" prop="pwdDic">
        <el-input
          v-model="queryParams.pwdDic"
          placeholder="请输入密码字典"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="获取的密码" prop="pwdResult" label-width="100px">
        <el-input
          v-model="queryParams.pwdResult"
          placeholder="请输入获取的密码"
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
          v-hasPermi="['pwdcrack:record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pwdcrack:record:export']"
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
      <el-table-column label="开始时间" align="center" prop="cTime" width="180">
        <template slot-scope="scope">
          <!--<span>{{ parseTime(scope.row.scanDatetime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
          <span>{{parseTime(scope.row.cTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="目标地址" align="center" prop="desIp" />
      <el-table-column label="协议/数据库" align="center" prop="cProcotol" />
      <el-table-column label="用户名" align="center" prop="username" />
      <el-table-column label="密码字典" align="center" prop="pwdDic" />
      <el-table-column label="结果" align="center" prop="result">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="showResult(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="获取的密码" align="center" prop="pwdResult" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pwdcrack:record:remove']"
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

    <!-- 结果 -->
    <el-dialog :title="title" :visible.sync="open">
      <div v-html="this.finalResult">

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRecord, getRecord, delRecord, addRecord, updateRecord } from "@/api/pwdcrack/record";

export default {
  name: "Record",
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
      // 口令破解表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        desIp: null,
        cProcotol: null,
        username: null,
        pwdDic: null,
        result: null,
        pwdResult: null
      },
      finalResult:"",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        desIp: [
          { required: true, message: "目标地址不能为空", trigger: "blur" }
        ],
        cProcotol: [
          { required: true, message: "协议/数据库不能为空", trigger: "blur" }
        ],
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
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
    /** 查询口令破解列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
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
        crackId: null,
        desIp: null,
        cProcotol: null,
        username: null,
        pwdDic: null,
        result: null,
        pwdResult: null
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
      this.ids = selection.map(item => item.crackId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    showResult(row){
      this.open = true;
      this.finalResult = row.result;
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.crackId != null) {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const crackIds = row.crackId || this.ids;
      this.$modal.confirm('是否确认删除口令破解编号为"' + crackIds + '"的数据项？').then(function() {
        return delRecord(crackIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pwdcrack/record/export', {
        ...this.queryParams
      }, `record_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
