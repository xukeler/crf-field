<template>
  <div class="module-body minhei">
    <div class="module-left">
      <div class="search">
        <!-- <a-input placeholder="请输入">
          <span slot="addonAfter">
            <i class="iconfont icon-sousuo"></i>
          </span>
        </a-input>-->
        <a-input v-model="searchVal" @pressEnter="search" class="search-input" placeholder="请输入模块名称">
          <span class="icon-body" slot="addonAfter" @click="search">
            <i class="iconfont icon-sousuo"></i>
          </span>
        </a-input>
      </div>
      <a-button class="btn-sty2" @click="addModule()">
        <i class="iconfont icon-add"></i>添加模块
      </a-button>
      <div class="module-items scroll-wrapper" ref='wrapper'>
        <div class="content">
          <div class="item" @click="getModuleFields(item.id,item.name)" :class="{'active':activeId == item.id}"
            v-for="(item,i) in moduleList" :key="i">
            <span class="text">{{ item.name }}</span>
            <a-dropdown @click.native.stop overlayClassName="module-dropdown" :trigger="['click']">
              <div class="ant-dropdown-link">
                <span class="iconfont icon-shezhi"></span>
              </div>
              <a-menu slot="overlay">
                <!-- <a-menu-item @click="editModule(item)">
                <span>编辑</span>
              </a-menu-item>-->
                <a-menu-item @click="delMenuShow(item.id,item.name)">
                  <span>删除</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
        <!-- <div class="item">
          <span class="text">既往病史</span>
        </div>-->
      </div>
    </div>
    <div class="module-right">
      <div class="module-info-body">
        <div class="search">
          <section>
            <a-input v-model="searchVal2" @pressEnter="search2" class="search-input" placeholder="请输入crf问题描述"
              v-if="isSearchTip||tableData.length > 0 && moduleList.length > 0">
              <span class="icon-body" slot="addonAfter" @click="search2">
                <i class="iconfont icon-sousuo"></i>
              </span>
            </a-input>
          </section>
          <a-button class="btn-sty2" @click="addModule('1')" v-show='moduleList && moduleList.length>0'>
            <i class="iconfont icon-add"></i>添加字段
          </a-button>
        </div>
        <div class="module-table" v-if="tableData.length > 0 && moduleList.length > 0">
          <module-table :activeId="activeId" :scroll="{ y: 600 }" :tableVal="tableData"></module-table>
        </div>
      </div>
      <div class="nothing-body" v-if="!tableData || tableData.length == 0">
        <div class="nothing">
          <template v-if='!moduleList || moduleList.length==0'>
            <span class="iconfont icon-zanwumokuai icon-kong-color" ></span>
            <span class="text">暂无模块,请先创建</span>
          </template>
          <template v-else>
            <span class="iconfont icon-kong icon-kong-color" ></span>
            <span v-if='isSearchTip' class="text">无相关内容</span>
            <span v-else class="text">该模块下无任何字段，请添加</span>
          </template>
        
        </div>
      </div>
    </div>
    <CrfModuleDia :projectId="projectId" ref="moduleDia"></CrfModuleDia>
    <CrfModuleAddDia v-if="clearFlag" :defModuleVal="defModuleVal" :projectId="projectId" :groupType="groupType"
      ref="moduleAddDia"></CrfModuleAddDia>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import ModuleTable from "@/components/CrfView/ModuleTable.vue";
  import CrfModuleDia from "@/components/CrfView/CrfModuleDia.vue";
  import CrfModuleAddDia from "@/components/CrfView/CrfModuleAddDia.vue";
  import {setScroll} from '@/assets/public.ts';

  export default Vue.extend({
    name: "CrfModule",
    data() {
      return {
        moduleList: [] as any,
        activeId: "",
        activeName: "",
        groupType: [],
        tableData: [],
        tableDataCopy: [],
        defModuleVal: "" as any,
        clearFlag: false,
        searchVal: "",
        searchVal2: "",
        scroll: null as any,
        isSearchTip:false,
      };
    },
    components: {
      ModuleTable,
      CrfModuleDia,
      CrfModuleAddDia
    },
    props: ["projectId"],
    created() {
      this.dataInit();
    },
    methods: {
      dataInit() {
        this.getModule().then((_: any) => {
          if (this.moduleList.length > 0) {
            let id = this.moduleList[0].id;
            let name = this.moduleList[0].name;
            this.getModuleFields(id, name);
          }
          this.getGroupTypeInfo();
        });
      },
      delModuleField(id: any) {
        let params = {
          moduleId: this.activeId,
          fieldIds: id.split(",")
        };
        this.$api.control.delModuleField(params).then((res: any) => {
          this.getModuleFields(this.activeId);
        });
      },
      search() {
        let name = this.searchVal;
        this.getModule(name);
      },
      search2() {
        let name = this.searchVal2;
        if (!name) {
          this.tableData = this.tableDataCopy;
          return false;
        }
        let _obj = this.tableDataCopy.filter((res: any) => {
          return res.question_Text.indexOf(name) != -1;
        });
        if (_obj) {
          console.log(_obj);
          this.tableData = _obj;
        } else {
          this.tableData = this.tableDataCopy;
        }
        this.isSearchTip = true;
        // question_Text
        //
      },
      getModuleGroupType() {
        this.$api.control.getModuleGroupType().then((res: any) => {
          this.groupType = res.data;
        });
      },
      getGroupTypeInfo() {
        // let params = {
        //   // groupDicVal: 1 //1疾病领域 2单位 3访视类型
        //   groupDicVal: '7db94e9a-2b61-4c9c-85e5-fe4d5153380b',
        // };
        const _then = this.$api.control
          .getDiseaseList()
          .then((res: any) => {
            this.groupType = res.data;
          });
        return _then;
      },

      /**
       * 获取数据
       * @params type 1表示点击搜索后点击上移下移后重新获取数据
       */
      getModuleFields(id: any, name ? : any,type?:number) {
        this.isSearchTip = false;
        if(!type){
         this.searchVal2 = ""; // 清空搜索值
        }
        if (!id) {
          id = this.activeId;
        } else {
          this.activeId = id;
        }
        if (name) {
          this.activeName = name;
        }
        let params = {
          moduleId: id
        };
        this.$api.control.getModuleGroupField(params).then((res: any) => {
          this.tableDataCopy = res.data;
          this.tableData = res.data;
          if(type){
            this.search2()
          }
        });
      },
      getModule(v ? : any) {
        let params = {
          projectId: this.projectId,
          moduleName: v || ""
        };
        const _then = this.$api.control.getModule(params).then((res: any) => {
          let data = res.data;
          let _dataArr: Array < any > = [];
          data.forEach((res: any) => {
            let _json = {
              name: res.moduleName,
              id: res.id
            };
            _dataArr.push(_json);
          });
          this.moduleList = _dataArr as any;
          this.$nextTick(() => {
            setScroll((this.$refs as any).wrapper)
          })
        });
        return _then;
      },
      delMenuShow(id: any, name: any) {
        (this.$refs.moduleDia as any).name = name;
        (this.$refs.moduleDia as any).nowModuleId = id;
        (this.$refs.moduleDia as any).visible = true;
      },
      delMenu(id: any): any {
        let params = {
          moduleId: id
        };
        const _then = this.$api.control.delModule(params).then((res: any) => {
          this.tableData = [];
          this.getModule();
          return res;
        });
        return _then;
      },
      editModule(item: any) {
        this.defModuleVal = item;
        this.clearFlag = true;
        this.$nextTick(() => {
          (this.$refs.moduleAddDia as any).visible = true;
        });
      },
      addModule(type ? : any) {
        this.clearFlag = true;
        this.$nextTick(() => {
          if (type == "1") {
            (this.$refs.moduleAddDia as any).moduleId = this.activeId;
            (this.$refs.moduleAddDia as any).moduleName = this.activeName;
          }
          console.log(this.activeId,this.activeName);
          (this.$refs.moduleAddDia as any).visible = true;
        });
      }
    }
  });
</script>

<style lang="scss">
</style>