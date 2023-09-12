<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!--<el-form-item label="探测时长" prop="detectConsume">
        <el-input
          v-model="queryParams.detectConsume"
          placeholder="请输入探测时长"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="探测日期">
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
          v-hasPermi="['addrgen:detect:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['addrgen:detect:export']"
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
      <el-table-column label="文件名" align="center" prop="addrSeedfileName" />
      <el-table-column label="探测时长" align="center" prop="detectConsume" />
      <el-table-column label="探测日期" align="center" prop="detectTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.detectTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" align="center" prop="collectStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.detectStatus === '1'" type="success">完成</el-tag>
          <el-tag v-if="scope.row.detectStatus === '0'">正在进行</el-tag>
          <el-tag v-if="scope.row.detectStatus === '2'" type="warning">暂停</el-tag>
          <el-tag v-if="scope.row.detectStatus === '3'" type="info">本次完成</el-tag>
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="showJobOpen(scope.row)"
          >详细</el-button>-->
        </template>
      </el-table-column>
      <el-table-column label="详情" align="center" prop="collectStatus">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="showJobOpen(scope.row)"
          >详细</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['addrgen:detect:edit']"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['addrgen:detect:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 定时任务弹框 -->
    <el-dialog :title="title" :visible.sync="jobopen">
      <el-table
        :data="jobList"
        style="width: 100%">
        <el-table-column label="任务编号" width="100" align="center" prop="jobId" />
        <el-table-column label="任务名称" align="center" prop="jobName" />
        <el-table-column label="调用目标字符串" align="center" prop="invokeTarget"/>
        <el-table-column label="cron执行表达式" align="center" prop="cronExpression"/>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <pagination
      ref="page"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改种子文件存活性探测历史对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="外键" prop="addrSeedfileId">
          <el-input v-model="form.addrSeedfileId" placeholder="请输入外键" />
        </el-form-item>
        <el-form-item label="探测时长" prop="detectConsume">
          <el-input v-model="form.detectConsume" placeholder="请输入探测时长" />
        </el-form-item>
        <el-form-item label="探测日期" prop="detectTime">
          <el-date-picker clearable
            v-model="form.detectTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择探测日期">
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
import { listJob,listDetect, getDetect, delDetect, addDetect, updateDetect } from "@/api/addrgen/detect";

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
      // 种子文件存活性探测历史表格数据
      detectList: [],
      jobList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      jobopen:false,
      // 探测日期时间范围
      daterangeDetectTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        addrSeedfileId: this.$route.params.id,
        detectConsume: null,
        detectTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        addrSeedfileId: [
          { required: true, message: "外键不能为空", trigger: "blur" }
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
    /** 查询种子文件存活性探测历史列表 */
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
    showJobOpen(row){
      this.jobopen = true;
      listJob(row.addrSeedfileId).then(response => {
        console.log(response);
        this.jobList = response.data;
      });
      console.log(this.jobList);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        detectRecordId: null,
        addrSeedfileId: null,
        detectConsume: null,
        detectTime: null
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
      this.ids = selection.map(item => item.detectRecordId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加种子文件存活性探测历史";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const detectRecordId = row.detectRecordId || this.ids
      getDetect(detectRecordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改种子文件存活性探测历史";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.detectRecordId != null) {
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
      const detectRecordIds = row.detectRecordId || this.ids;
      this.$modal.confirm('是否确认删除种子文件存活性探测历史编号为"' + detectRecordIds + '"的数据项？').then(function() {
        return delDetect(detectRecordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('addrgen/detect/export', {
        ...this.queryParams
      }, `detect_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
