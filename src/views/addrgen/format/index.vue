<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="输入文件" prop="inputFilename">
        <el-input
          v-model="queryParams.inputFilename"
          placeholder="请输入输入文件"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="输出文件" prop="outputFilename">
        <el-input
          v-model="queryParams.outputFilename"
          placeholder="请输入输出文件"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="格式化日期" prop="formatTime">
        <el-date-picker clearable
          v-model="queryParams.formatTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择格式化日期">
        </el-date-picker>
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
          v-hasPermi="['addrgen:format:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['addrgen:format:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="formatList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" >
        <template slot-scope="scope">
          {{ (scope.$index+1)+(updateCurrentPage()-1)*queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="输入文件" align="center" prop="inputFilename" />
      <el-table-column label="输出文件" align="center" prop="outputFilename" />
      <el-table-column label="格式化日期" align="center" prop="formatTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.formatTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['addrgen:format:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['addrgen:format:remove']"
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

    <!-- 添加或修改种子文件格式化记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="外键" prop="addrSeedfileId">
          <el-input v-model="form.addrSeedfileId" placeholder="请输入外键" />
        </el-form-item>
        <el-form-item label="输入文件" prop="inputFilename">
          <el-input v-model="form.inputFilename" placeholder="请输入输入文件" />
        </el-form-item>
        <el-form-item label="输出文件" prop="outputFilename">
          <el-input v-model="form.outputFilename" placeholder="请输入输出文件" />
        </el-form-item>
        <el-form-item label="格式化日期" prop="formatTime">
          <el-date-picker clearable
            v-model="form.formatTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择格式化日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFormat, getFormat, delFormat, addFormat, updateFormat } from "@/api/addrgen/format";

export default {
  name: "Format",
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
      // 种子文件格式化记录表格数据
      formatList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        addrSeedfileId: this.$route.params.id,
        inputFilename: null,
        outputFilename: null,
        formatTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        addrSeedfileId: [
          { required: true, message: "外键不能为空", trigger: "blur" }
        ],
        formatTime: [
          { required: true, message: "格式化日期不能为空", trigger: "blur" }
        ]
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
    /** 查询种子文件格式化记录列表 */
    getList() {
      this.loading = true;
      listFormat(this.queryParams).then(response => {
        this.formatList = response.rows;
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
        formatRecordId: null,
        addrSeedfileId: null,
        inputFilename: null,
        outputFilename: null,
        formatTime: null
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
      this.ids = selection.map(item => item.formatRecordId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加种子文件格式化记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const formatRecordId = row.formatRecordId || this.ids
      getFormat(formatRecordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改种子文件格式化记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.formatRecordId != null) {
            updateFormat(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFormat(this.form).then(response => {
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
      const formatRecordIds = row.formatRecordId || this.ids;
      this.$modal.confirm('是否确认删除种子文件格式化记录编号为"' + formatRecordIds + '"的数据项？').then(function() {
        return delFormat(formatRecordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('addrgen/format/export', {
        ...this.queryParams
      }, `format_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
