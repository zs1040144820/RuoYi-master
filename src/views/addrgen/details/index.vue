<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="资产分类" prop="addrseedCategory">
        <el-cascader
          v-model="seedcategory"
          placeholder="请选择资产分类"
          clearable
          :options = "options"
          :props = "propsc"
          @keyup.enter.native="handleQuery" >
        </el-cascader>
      </el-form-item>
      <el-form-item label="IPv6地址" prop="ipaddress" label-width="80px">
        <el-input
          v-model="queryParams.ipaddress"
          placeholder="请输入IPv6地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采集时间" prop="collectTime">
        <el-date-picker clearable
          v-model="queryParams.collectTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择采集时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="标准IPv6地址" prop="standardIpaddress" label-width="100px">
        <el-input
          v-model="queryParams.standardIpaddress"
          placeholder="请输入标准IPv6地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ASN" prop="asn">
        <el-input
          v-model="queryParams.asn"
          placeholder="请输入ASN"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="BGP前缀" prop="bgpPrefix" label-width="80px">
        <el-input
          v-model="queryParams.bgpPrefix"
          placeholder="请输入BGP前缀"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="InterfaceID" prop="interfaceId" label-width="80px">
        <el-input
          v-model="queryParams.interfaceId"
          placeholder="请输入InterfaceID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="稳定性" prop="stability">
        <el-input
          v-model="queryParams.stability"
          placeholder="请输入稳定性"
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
          v-hasPermi="['addrgen:details:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['addrgen:details:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detailsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="50" >
        <template slot-scope="scope">
          {{ (scope.$index+1)+(updateCurrentPage()-1)*queryParams.pageSize }}
        </template>
      </el-table-column>
      <!--<el-table-column label="资产名称" align="center" prop="addrseedName" />-->
      <el-table-column label="资产分类" align="center" prop="addrseedCategory" />
      <el-table-column label="IPv6地址" align="center" prop="ipaddress" />
      <el-table-column label="采集时间" align="center" prop="collectTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.collectTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准IPv6地址" align="center" prop="standardIpaddress" />
      <el-table-column label="ASN" align="center" prop="asn" />
      <el-table-column label="BGP前缀" align="center" prop="bgpPrefix" />
      <el-table-column label="InterfaceID" align="center" prop="interfaceId" />
      <!--<el-table-column label="响应类型" align="center" prop="responseType" />-->
      <el-table-column label="响应类型" align="center" width="200px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.responseType === '1'" type="success">存在端口开放并且响应ICMPv6</el-tag>
          <el-tag v-if="scope.row.responseType === '2'">存在端口开放但不响应ICMPv6</el-tag>
          <el-tag v-if="scope.row.responseType === '3'" type="warning">仅响应ICMPv6</el-tag>
          <el-tag v-if="scope.row.responseType === '4'" type="danger">没有任何响应ICMPv6</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="稳定性" align="center" prop="stability" />
      <el-table-column label="采集结果" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.collectis === '1'" type="success">活跃</el-tag>
          <el-tag v-if="scope.row.collectis === '0'" type="danger">不活跃</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="探测结果" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="showDetDetails(scope.row)"
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
            v-hasPermi="['addrgen:details:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="showDialog(scope.row)"
            v-hasPermi="['addrgen:details:remove']"
          >资产分类</el-button>
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

    <!-- 探测详情弹框 -->
    <el-dialog :title="title" :visible.sync="openDetectDetails" width="1000px" append-to-body>
      <el-table v-loading="loading" :data="detectRow">
        <el-table-column label="探测结果1" align="center" prop="detect0">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect0 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect0 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect0 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果2" align="center" prop="detect1" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect1 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect1 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect1 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果3" align="center" prop="detect2" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect2 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect2 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect2 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果4" align="center" prop="detect3" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect3 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect3 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect3 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果5" align="center" prop="detect4" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect4 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect4 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect4 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果6" align="center" prop="detect5" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect5 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect5 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect5 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果7" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect6 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect6 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect6 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果8" align="center" prop="detect7" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect7 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect7 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect7 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果9" align="center" prop="detect8" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect8 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect8 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect8 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果10" align="center" prop="detect9" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect9 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect9 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect9 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果11" align="center" prop="detect10" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect10 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect10 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect10 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果12" align="center" prop="detect11" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect11 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect11 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect11 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果13" align="center" prop="detect12" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect12 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect12 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect12 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果14" align="center" prop="detect13" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect13 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect13 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect13 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果15" align="center" prop="detect14" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect14 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect14 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect14 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果16" align="center" prop="detect15" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect15 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect15 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect15 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果17" align="center" prop="detect16" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect16 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect16 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect16 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果18" align="center" prop="detect17" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect17 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect17 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect17 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果19" align="center" prop="detect18" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect18 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect18 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect18 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果20" align="center" prop="detect19" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect19 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect19 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect19 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果21" align="center" prop="detect20" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect20 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect20 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect20 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果22" align="center" prop="detect21" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect21 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect21 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect21 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果23" align="center" prop="detect22" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect22 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect22 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect22 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果24" align="center" prop="detect23" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect23 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect23 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect23 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果25" align="center" prop="detect24" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect24 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect24 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect24 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果26" align="center" prop="detect25" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect25 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect25 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect25 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果27" align="center" prop="detect26" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect26 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect26 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect26 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果28" align="center" prop="detect27" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect27 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect27 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect27 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果29" align="center" prop="detect28" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect28 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect28 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect28 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="探测结果30" align="center" prop="detect29" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.detect29 === '2'" type="success">活跃</el-tag>
            <el-tag v-if="scope.row.detect29 === '1'" type="danger">不活跃</el-tag>
            <el-tag v-if="scope.row.detect29 === '0'" type="info">未探测</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改资产分类" :visible.sync="dialogVisible" width="500px" append-to-body>
      <el-form>
        <el-form-item label="填写资产分类" label-width="110px">
          <el-cascader
            v-model="ucategory"
            placeholder="请选择资产分类情况"
            :options = "options"
            :props = "propsc">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateCategory" style="background-color: #ff0000">确认更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDetails, getDetails, delDetails, addDetails, updateDetails, updateCategory } from "@/api/addrgen/details";

export default {
  name: "Details",
  data() {
    return {
      // 遮罩层
      loading: true,
      dialogVisible: false,
      category: {},
      ucategory: [],
      seedcategory: [],
      options: [
        {
          value: '网络资产分类',
          label: '网络资产分类',
          children: [
            {
              value: '路由器',
              label: '路由器',
            },
            {
              value: '交换机',
              label: '交换机',
            },
            {
              value: '防火墙',
              label: '防火墙',
            },
            {
              value: '负载均衡器',
              label: '负载均衡器',
            },
          ],
        },
        {
          value: '安全重要性',
          label: '安全重要性',
          children: [
            {
              value: '核心资产',
              label: '核心资产',
            },
            {
              value: '重要资产',
              label: '重要资产',
            },
            {
              value: '普通资产',
              label: '普通资产',
            },
          ],
        },
        {
          value: '网络位置分类',
          label: '网络位置分类',
          children: [
            {
              value: '外部资产',
              label: '外部资产',
            },
            {
              value: '内部资产',
              label: '内部资产',
            },
            {
              value: '边界资产',
              label: '边界资产',
            },
          ],
        },
      ],
      propsc: {
        expandTrigger: 'hover',
        value: 'value',
        label: 'label',
        children: 'children',
      },
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
      // 种子文件详情表格数据
      detailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openDetectDetails: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        addrSeedfileId: this.$route.params.id,
        addrseedName: null,
        addrseedCategory: null,
        ipaddress: null,
        collectTime: null,
        standardIpaddress: null,
        asn: null,
        bgpPrefix: null,
        interfaceId: null,
        responseType: null,
        stability: null,
        detect0: null,
        detect1: null,
        detect2: null,
        detect3: null,
        detect4: null,
        detect5: null,
        detect6: null,
        detect7: null,
        detect8: null,
        detect9: null,
        detect10: null,
        detect11: null,
        detect12: null,
        detect13: null,
        detect14: null,
        detect15: null,
        detect16: null,
        detect17: null,
        detect18: null,
        detect19: null,
        detect20: null,
        detect21: null,
        detect22: null,
        detect23: null,
        detect24: null,
        detect25: null,
        detect26: null,
        detect27: null,
        detect28: null,
        detect29: null
      },
      detectRow:[],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        addrSeedfileId: [
          { required: true, message: "所属文件的id，此字段为外键不能为空", trigger: "blur" }
        ],
        ipaddress: [
          { required: true, message: "IPv6地址不能为空", trigger: "blur" }
        ],
        collectTime: [
          { required: true, message: "采集时间不能为空", trigger: "blur" }
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
    /** 查询种子文件详情列表 */
    getList() {
      this.loading = true;
      listDetails(this.queryParams).then(response => {
        this.detailsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.openDetectDetails = false;
    },
    // 表单重置
    reset() {
      this.form = {
        addrseedId: null,
        addrSeedfileId: null,
        addrseedName: null,
        addrseedCategory: null,
        ipaddress: null,
        collectTime: null,
        standardIpaddress: null,
        asn: null,
        bgpPrefix: null,
        interfaceId: null,
        responseType: null,
        stability: null,
        detect0: null,
        detect1: null,
        detect2: null,
        detect3: null,
        detect4: null,
        detect5: null,
        detect6: null,
        detect7: null,
        detect8: null,
        detect9: null,
        detect10: null,
        detect11: null,
        detect12: null,
        detect13: null,
        detect14: null,
        detect15: null,
        detect16: null,
        detect17: null,
        detect18: null,
        detect19: null,
        detect20: null,
        detect21: null,
        detect22: null,
        detect23: null,
        detect24: null,
        detect25: null,
        detect26: null,
        detect27: null,
        detect28: null,
        detect29: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.addrseedCategory = this.seedcategory.join('/');
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.seedcategory = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.addrseedId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加种子文件详情";
    },
    showDetDetails(row){
      this.detectRow[0] = row;
      console.log(this.detectRow);
      this.openDetectDetails = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const addrseedId = row.addrseedId || this.ids
      getDetails(addrseedId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改种子文件详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.addrseedId != null) {
            updateDetails(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDetails(this.form).then(response => {
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
      const addrseedIds = row.addrseedId || this.ids;
      this.$modal.confirm('是否确认删除种子文件详情编号为"' + addrseedIds + '"的数据项？').then(function() {
        return delDetails(addrseedIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 更新资产分类 */
    showDialog(row){
      this.dialogVisible = true;
      this.category = row;
    },
    updateCategory(){
      const data = {
        seedId: this.category.addrseedId,
        category: this.ucategory.join('/'),
      };
      console.log(data.seedId);
      console.log(data.category);
      updateCategory(data).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.dialogVisible = false;
        this.getList();
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('addrgen/details/export', {
        ...this.queryParams
      }, `details_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
