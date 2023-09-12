<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="任务名" prop="filename">
        <el-input
          v-model="queryParams.filename"
          placeholder="请输入任务名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startime">
        <el-date-picker clearable
          v-model="queryParams.startime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择任务开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务状态" prop="tasksituation">
        <el-input
          v-model="queryParams.tasksituation"
          placeholder="请输入任务状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地址来源" prop="source">
        <el-select v-model="queryParams.source"
        placeholder="请选择地址来源"
        clearable
        @keyup.enter.native="handleQuery">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="reverseCollectIPList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" >
        <template slot-scope="scope">
          {{ (scope.$index+1)+(updateCurrentPage()-1)*queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="任务名" align="center" prop="filename" />
      <el-table-column label="开启时间" align="center" prop="startime" width="180">
      </el-table-column>
      <el-table-column label="地址来源" align="center" prop="source" />
      <el-table-column label="任务状态" align="center" prop="tasksituation">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="selectCommand(scope.row)">
            <template v-if="scope.row.tasksituation == '运行中'">
              <i class="el-icon-loading"></i> 运行中
            </template>
            <template v-else-if="scope.row.tasksituation == '运行完毕'">
              <i class="el-icon-finished"></i> 运行完毕
            </template>
            <template v-else-if="scope.row.tasksituation == '被终止'">
              <i class="el-icon-close"></i> 已终止
            </template>
            <template v-else>
              {{ scope.row.tasksituation }}
            </template>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="任务进度" align="center" prop="rate">
        <template slot-scope="scope">
          <el-progress style="width: 230px" :text-inside="true" :stroke-width="20" :percentage="scope.row.rate" />
        </template>
      </el-table-column>
      <el-table-column label="处理" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-monitor"
            @click="selectDetail(scope.row)"
          >查看收集的地址</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['CollectIP:deltask']"
          >删除收集的地址</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="exportAddrs(scope.row)"
          >提取收集的地址</el-button>
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
    <br>
    <el-dialog title="任务收集到的地址内容" :visible.sync="openDetail" width="500px" append-to-body>
      <pre>{{ ipAddrs }}</pre>
    </el-dialog>
    <el-dialog title="控制台输出" :visible.sync="cmdDialogVisible"  width="1000px" :max-height="600" append-to-body>
      <el-scrollbar style="height: 100%; width: 100%;">
        <el-table :data="detail2DataList"  :max-height="400">
          <el-table-column property="detail" label="IP地址"></el-table-column>
          <el-table-column property="command" label="控制台详情"></el-table-column>
        </el-table>
      </el-scrollbar>
    </el-dialog>
    <el-dialog title="控制台回显内容" :visible.sync="openCommand" width="800px" append-to-body>
        <div v-html="commandResult"/>
    </el-dialog>
  </div>
</template>

<script>
import {
  delTaskInfo, selectDetail, selectDetail2,
  showCollectList, showCommand, showCommand2, showTadeList,
} from "@/api/addrcollect/addrcollect";
import { getToken } from "@/utils/auth";
import 'element-ui/lib/theme-chalk/index.css';

export default {
  name: "CollectIPAddr",

  data() {
    return {
      options: [
        { value: '出口流量和交换机', label: '出口流量和交换机' },
        { value: '已有资产', label: '已有资产' },
      ],
      ipAddrs: "",
      openDetail: false,
      openCommand: false,
      commandResult: {},
      detail2DataList: [],
      cmdDialogVisible: false,
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
      // 收集IP地址情况总览表格数据
      collectIPList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openCollect: false,
      openActive: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        filename: null,
        startime: null,
        tasksituation: null,
        source: null,
      },
      // 表单参数
      form: {},
    };
  },
  computed: {
    reverseCollectIPList(){
      return this.collectIPList.reverse();
    }
  },
  created() {
    this.getList();
  },
  beforeDestroy() {

  },

  methods: {
    updateCurrentPage() {
      return this.$refs["page"].currentPage;
    },
    /** 查询种子地址文件总览列表 */
    getList() {
      this.loading = true;
      showCollectList(this.queryParams).then(response => {
        this.collectIPList = response.rows;
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
      this.ids = selection.map(item => item.uniqueID)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 复选框选中数据 */
    handleAddrgenSeedfileDetailsSelectionChange(selection) {
      this.checkedAddrgenSeedfileDetails = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('CollectIP/exportask', {
        ...this.queryParams
      }, `collectTask_${new Date().getTime()}.xlsx`)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const taskId = row.uniqueID || this.ids;
      this.$modal.confirm('是否确认删除任务信息？').then(() => {
        if (Array.isArray(taskId)) {
          // 如果taskId是一个数组，则遍历这个数组，对每个元素执行删除操作
          taskId.forEach(id => {
            delTaskInfo(id).then(() => {
              this.getList();
              this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
            this.getList();
          });
        } else {
          // 如果taskId不是一个数组，则直接执行删除操作
          delTaskInfo(taskId).then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          }).catch(() => {});
          this.getList();
        }
      }).catch(() => {});
    },
    //查看任务对应的地址
    selectDetail(row){
      const uid = row.uniqueID;
      const source = row.source;
      if(source === "出口流量和交换机"){
        selectDetail(uid).then(response => {
          console.log(response);
          const addrs = response.rows;
          this.ipAddrs = addrs.join("\n");
          this.openDetail = true;
        })
      }
      if(source === "已有资产"){
        selectDetail2(uid).then(response => {
          console.log(response);
          const addrs = response.rows;
          this.ipAddrs = addrs.join("\n");
          this.openDetail = true;
        })
      }
    },
    //导出收集到的地址文件
    exportAddrs(row) {
      const uid = row.uniqueID;
      const source = row.source;
      if(source == "出口流量和交换机"){
        selectDetail(uid).then(response => {
          const addrs = response.rows;
          const addrstr = addrs.join('\n');  // 将元素连接成一个字符串，并在元素之间使用换行符连接
          const blob = new Blob([addrstr], { type: 'text/plain' });  // 创建一个 Blob 对象
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'data.txt';  // 指定下载文件的文件名为 data.txt
          link.click();  // 触发链接点击事件来下载文件
          URL.revokeObjectURL(link.href);  // 释放 URL 对象
        }).catch(error => {
          console.error(error);
        });
      }
      if(source == "已有资产"){
        selectDetail2(uid).then(response => {
          const addrs = response.rows;
          const addrstr = addrs.join('\n');  // 将元素连接成一个字符串，并在元素之间使用换行符连接
          const blob = new Blob([addrstr], { type: 'text/plain' });  // 创建一个 Blob 对象
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'data.txt';  // 指定下载文件的文件名为 data.txt
          link.click();  // 触发链接点击事件来下载文件
          URL.revokeObjectURL(link.href);  // 释放 URL 对象
        }).catch(error => {
          console.error(error);
        });
      }
    },
    //查看控制台输出
    selectCommand(row){
      const uid = row.uniqueID;
      const source = row.source;
      if(source == "出口流量和交换机"){
        showCommand(uid).then(response => {
          console.log(response);
          this.commandResult = response.msg;
          this.openCommand = true;
        });
      }
      if(source == "已有资产") {
        showCommand2(uid).then(response => {
          console.log(response);
          this.detail2DataList = response.rows;
          this.cmdDialogVisible = true;
        });
      }
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
