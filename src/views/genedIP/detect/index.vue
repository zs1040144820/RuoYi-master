<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="探测时间">
        <el-date-picker
          v-model="daterangeDetectTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="命中率" prop="hitRate">
        <el-input
          v-model="queryParams.hitRate"
          placeholder="请输入命中率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="命中地址数" prop="hitNum" label-width="100px">
        <el-input
          v-model="queryParams.hitNum"
          placeholder="请输入命中地址数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生成地址总数" prop="total" label-width="100px">
        <el-input
          v-model="queryParams.total"
          placeholder="请输入生成地址总数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="耗时" prop="consume">
        <el-input
          v-model="queryParams.consume"
          placeholder="请输入耗时"
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
          v-hasPermi="['genedIP:detect:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['genedIP:detect:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" >
        <template slot-scope="scope">
          {{ (scope.$index+1)+(updateCurrentPage()-1)*queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="输入文件名" align="center" prop="inputFile" />
      <el-table-column label="探测时间" align="center" prop="detectTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.detectTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="命中率" align="center" prop="hitRate" />
      <el-table-column label="命中地址数" align="center" prop="hitNum" />
      <el-table-column label="生成地址总数" align="center" prop="total" />
      <el-table-column label="耗时" align="center" prop="consume" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['genedIP:detect:remove']"
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
  </div>
</template>

<script>
import { listDetect, getDetect, delDetect, addDetect, updateDetect } from "@/api/genedIP/detect";

export default {
  name: "Detect",
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
      // 探测历史表格数据
      detectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 耗时时间范围
      daterangeDetectTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        recordId: this.$route.params.id,
        detectTime: null,
        hitRate: null,
        hitNum: null,
        total: null,
        inputFile: null,
        consume: null
      },
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
    /** 查询探测历史列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeDetectTime && '' != this.daterangeDetectTime) {
        this.queryParams.params["beginDetectTime"] = this.daterangeDetectTime[0];
        this.queryParams.params["endDetectTime"] = this.daterangeDetectTime[1];
      }
      listDetect(this.queryParams).then(response => {
        this.detectList = response.rows;
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
        detectId: null,
        recordId: null,
        detectTime: null,
        hitRate: null,
        hitNum: null,
        total: null,
        inputFile: null,
        consume: null
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
      this.daterangeDetectTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.detectId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加探测历史";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const detectId = row.detectId || this.ids
      getDetect(detectId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改探测历史";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.detectId != null) {
            updateDetect(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDetect(this.form).then(response => {
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
      const detectIds = row.detectId || this.ids;
      this.$modal.confirm('是否确认删除探测历史编号为"' + detectIds + '"的数据项？').then(function() {
        return delDetect(detectIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('genedIP/detect/export', {
        ...this.queryParams
      }, `detect_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
