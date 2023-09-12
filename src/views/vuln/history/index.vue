<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="nmap命令" prop="command">
        <el-input
          v-model="queryParams.command"
          placeholder="请输入nmap命令"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="靶机地址" prop="targetRange">
        <el-input
          v-model="queryParams.targetRange"
          placeholder="请输入靶机地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扫描时间" prop="scanDatetime">
        <!--<el-date-picker clearable
          v-model="queryParams.scanDatetime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择扫描时间">
        </el-date-picker>-->
        <!--<el-date-picker clearable
          v-model="queryParams.scanDatetime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions">
        </el-date-picker>-->
        <el-date-picker clearable
          v-model="daterangeScanDatetime"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
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
          v-hasPermi="['vuln:history:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['vuln:history:export']"
        >导出</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-turn-off"
          size="mini"
          @click="clearTimer"
        >停止刷新</el-button>
      </el-col>-->
      <!--<router-link :to="'/scanvuln'" tag="span">
        <el-button
          type="warning"
          size="mini"
        >扫描漏洞</el-button>
      </router-link>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="historyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" >
        <template slot-scope="scope">
          {{ (scope.$index+1)+(updateCurrentPage()-1)*queryParams.pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="任务标识" align="center" prop="uuid" />
      <el-table-column label="目标地址" align="center" prop="targetRange" />
      <el-table-column label="开始时间" align="center" prop="scanDatetime" width="180">
        <template slot-scope="scope">
          <!--<span>{{ parseTime(scope.row.scanDatetime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
          <span>{{parseTime(scope.row.scanDatetime)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已扫描时间" align="center"width="180">
        <template slot-scope="scope">
          {{getScanTime(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="指定端口" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.startport === '' && scope.row.endport === ''" type="info">未指定</el-tag>
          <el-tag v-else>{{scope.row.startport}}-{{scope.row.endport}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作系统探测" align="center" prop="fos">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.fos === true" type="success">开启</el-tag>
          <el-tag v-if="scope.row.fos === false" type="info">未开启</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="端口服务探测" align="center" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.portService === true" type="success">开启</el-tag>
          <el-tag v-if="scope.row.portService === false" type="info">未开启</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="数据库探测" align="center" prop="databasetype">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.databasetype === true" type="success">开启</el-tag>
          <el-tag v-if="scope.row.databasetype === false" type="info">未开启</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center" prop="rate" >
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="26" :percentage=scope.row.rate></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="详细信息" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div>
            <router-link :to="'/vuln/singleDetails/'+scope.row.recordsId" style="color: #00afff;font-size: smaller">查看</router-link>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['vuln:history:remove']"
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

    <!-- 查看结果对弹框框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>扫描结果</span>
        </div>
        <div v-html="res">
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listHistory, getHistory, delHistory, addHistory, updateHistory, scanVuln } from "@/api/vuln/history";

export default {
  name: "History",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedVulnSingleAddrDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 漏洞扫描历史记录表格数据
      historyList: [{vulnTime:""}],
      // 单条地址扫描结果表格数据
      vulnSingleAddrDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        command: null,
        targetRange: null,
        scanDatetime: null,
        highriskRate: null,
        results:null,
        portService:null,

      },
      CVEList:{},
      timeout:null,
      // 扫描结果时间范围
      daterangeScanDatetime: [],
      // 表单参数
      form: {},
      //结果
      res:"",
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      // 表单校验
    };
  },
  created() {
    this.getList();
    //this.setTimer();
  },
  methods: {
    updateCurrentPage() {
      return this.$refs["page"].currentPage;
    },
    setTimer(){
      this.timeout = setInterval(this.getList,1000);
    },
    clearTimer(){
      clearInterval(this.timeout);
    },
    getScanTime(row){
      //this.getList();
      var date1=row.scanDatetime;
      console.log("emdtime"+row.scanedTime);
      if (row.scanedTime === null ){
        var date2 = new Date();
      }else {
        console.log("emdtime"+row.scanedTime);
        var date2 = row.scanedTime;
      }
      console.log(date1);
      console.log(date2);
      var date3 = new Date(date2).getTime() - new Date(date1).getTime();   //时间差的毫秒数
      var subMinutes = Math.floor( date3/(60*1000) ); //获取总共的分钟差
      //计算出相差天数
      var days=Math.floor(date3/(24*3600*1000));
      //计算出小时数

      var leave1=date3%(24*3600*1000) ;   //计算天数后剩余的毫秒数
      var hours=Math.floor(leave1/(3600*1000));
      //计算相差分钟数
      var leave2=leave1%(3600*1000)  ;      //计算小时数后剩余的毫秒数
      var minutes=Math.floor(leave2/(60*1000));
      //计算相差秒数
      var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
      var seconds=Math.round(leave3/1000);
      console.log(days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒");
      return days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒";
    },
    /** 查询漏洞扫描历史记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeScanDatetime && '' != this.daterangeScanDatetime) {
        this.queryParams.params["beginScanDatetime"] = this.daterangeScanDatetime[0];
        this.queryParams.params["endScanDatetime"] = this.daterangeScanDatetime[1];
      }
      listHistory(this.queryParams).then(response => {
        this.historyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        command: null,
        targetRange: null,
        scanDatetime: null,
        highriskRate: null,
        results:null,
      };
      this.daterangeScanDatetime = [];
      //this.vulnSingleAddrDetailsList = [];
      //this.reset("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.reset();
      //this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.recordsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加漏洞扫描历史记录";
    },
    /** 扫描漏洞 **/
    handleScanVuln(){
      scanVuln();
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.vulnSingleAddrDetailsList = this.vulnSingleAddrDetailsList;
          if (this.form.recordsId != null) {
            updateHistory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHistory(this.form).then(response => {
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
      const recordsIds = row.recordsId || this.ids;
      this.$modal.confirm('是否确认删除漏洞扫描历史记录编号为"' + recordsIds + '"的数据项？').then(function() {
        return delHistory(recordsIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

	/** 单条地址扫描结果序号 */
    rowVulnSingleAddrDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 单条地址扫描结果添加按钮操作 */
    handleAddVulnSingleAddrDetails() {
      let obj = {};
      obj.ipv6Addr = "";
      obj.resultDetails = "";
      this.vulnSingleAddrDetailsList.push(obj);
    },
    /** 单条地址扫描结果删除按钮操作 */
    handleDeleteVulnSingleAddrDetails() {
      if (this.checkedVulnSingleAddrDetails.length == 0) {
        this.$modal.msgError("请先选择要删除的单条地址扫描结果数据");
      } else {
        const vulnSingleAddrDetailsList = this.vulnSingleAddrDetailsList;
        const checkedVulnSingleAddrDetails = this.checkedVulnSingleAddrDetails;
        this.vulnSingleAddrDetailsList = vulnSingleAddrDetailsList.filter(function(item) {
          return checkedVulnSingleAddrDetails.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleVulnSingleAddrDetailsSelectionChange(selection) {
      this.checkedVulnSingleAddrDetails = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('vuln/history/export', {
        ...this.queryParams
      }, `history_${new Date().getTime()}.xlsx`)
    },

  }
};
</script>
