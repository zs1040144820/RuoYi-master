<template>
  <div>
    <el-container>
      <el-header class="el-header" height=100px>IPv6地址扩展</el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="3">
            <div class="el-col" style="padding-top: 8px;color: #157a0c">
              {{$route.params.name}}
            </div>
          </el-col>

          <el-col :span="2">
            <div class="el-col">
              <img src="./1.png">
            </div>
          </el-col>

          <el-col :span="4.5">
            <div class="el-col" style="padding-top: 2px">
              <el-button
                @click="openMLC"
              >
                参数设定
              </el-button>
            </div>
          </el-col>

          <el-col :span="2">
            <div class="el-col">
              <img src="./1.png">
            </div>
          </el-col>

          <el-col :span="6">
            <div class="el-col">
              <el-button
                type="danger"
                @click="submitForm"
              >生 成</el-button>
            </div>
          </el-col>
        </el-row>
      </el-main>

    </el-container>

    <el-dialog title="多层级分类参数设定" :visible.sync="openMULDia" width="500px" append-to-body>
      <el-form>
        <el-form-item label="预设生成地址数" label-width="110px">
          <el-input v-model="form.genNum" placeholder="请输入数字" />
        </el-form-item>
        <el-form-item label="开启多层级分类">
          <el-switch
            active-value="1"
            inactive-value="0"
            v-model="form.ismul"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked1" disabled>自治号ASN</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked1" disabled>BGP前缀</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.activity">地址响应类型activity</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.stability">地址稳定性</el-checkbox>
          <br>
          (选择地址稳定性需要先执行完存活性探测任务)
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked1" disabled>地址接口标识符IID</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="okbutton" style="background-color: red">确 定</el-button>
        <!--<el-button @click="cancel">取 消</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {generate} from "@/api/addrgen/gen";
  export default{
    name:'MyStudent',
    data(){
      return {
        form: {
          fileID: this.$route.params.id,
          fileName: this.$route.params.name,
          ismul: "",
          activity:false,
          stability:false,
          genNum:"",
        },
        openMULDia:false,
        value:'',
        dialogVisible: false,
        checked1: true,
      }
    },

    methods: {
      submitForm(){
        console.log(this.form.fileID);
        generate(this.form).then(reponse =>{
          console.log(reponse)
        });
      },
      openMLC(){
        this.openMULDia = true;
      },
      okbutton(){
        console.log(this.form.activity);
        this.openMULDia = false;
      },
      cancel(){
        this.openMULDia = false;
      }
    }
  }
</script>

<style>
  .el-header{
    font-size: 25px;
  }

  .el-col{
    align-items: center;
    margin:0 auto;
  }

  .el-footer-button{
    text-decoration:underline;
    height: 150px;
  }

</style>
