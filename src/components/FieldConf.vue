<template>
  <div class="field-config-body">
    <div class="field-top flex-row">
      <div class="title">字段配置</div>
      <div class="btn-group flex-row btn-group-block">
        <a-button class="btn-sty1 btn-active">Execl导入</a-button>
        <a-button class="btn-sty2" @click="showModal">
          <i class="iconfont icon-add"></i>新增
        </a-button>
      </div>
    </div>
    <div class="field-search flex-row field-search-block">
      <div class="search">
        <a-input v-model="questionText" @pressEnter="searchText" placeholder="请输入CRF问题描述">
          <span class="icon-body" slot="addonAfter" @click="searchText">
            <i class="iconfont icon-sousuo"></i>
          </span>
        </a-input>
      </div>
      <div class="search-dropdown-group flex-row" >
        <a-select
          showSearch
          placeholder="请选择Domain"
          notFoundContent="未找到内容"
          optionFilterProp="children"
          @change="searchSelect(arguments,'domainId')"
          :getPopupContainer="getPopupContainer"
        >
          <a-select-option value>请选择Domain</a-select-option>
          <a-select-option v-for="(item,i) in domainObj.domainList" :key="i" :value="item.id">
            {{ item.name }}
            <template v-if="item.description">{{ `-${item.description}` }}</template>
          </a-select-option>
        </a-select>
        <a-select
          showSearch
          placeholder="请选择Date Type"
          notFoundContent="未找到内容"
          optionFilterProp="children"
          @change="searchSelect(arguments,'dataType')"
           :getPopupContainer="getPopupContainer"
        >
          <a-select-option value>请选择Date Type</a-select-option>
          <a-select-option
            v-for="(item,i) in dataTypeObj.dataTypeList"
            :key="i"
            :value="item"
          >{{ item }}</a-select-option>
        </a-select>
        <a-select
          showSearch
          placeholder="请选择分类Type"
          notFoundContent="未找到内容"
          optionFilterProp="children"
          @change="searchSelect(arguments,'groupId')"
           :getPopupContainer="getPopupContainer"
        >
          <a-select-option value>请选择分类Classify</a-select-option>
          <a-select-option
            v-for="(item,i) in groupObj.groupList"
            :key="i"
            :value="item.id"
          >{{ item.name }}</a-select-option>
        </a-select>
      </div>
    </div>
    <FieldTable :tableVal="tableVal" :pageCount="pageCount" ref="fieldtable"></FieldTable>
    <FieldDia
      :groupList="groupObj.groupList"
      :domainList="domainObj.domainList"
      :dataTypeList="dataTypeObj.dataTypeList"
      ref="modal"
    ></FieldDia>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FieldTable from "@/components/FieldView/FieldTable.vue";
import FieldDia from "@/components/FieldView/FieldDia.vue";

export default Vue.extend({
  name: "FieldConf",
  components: {
    FieldTable,
    FieldDia
  },
  data() {
    return {
      tableVal: "" as any,
      pageCount: 0 as any,
      questionText: "",
      domainObj: {
        domainId: "" as any,
        domainList: "" as any
      } as any,
      groupObj: {
        groupId: "" as any,
        groupList: "" as any
      } as any,
      dataTypeObj: {
        dataType: "" as any,
        dataTypeList: "" as any,
        
      }
    };
  },
  created() {
    Promise.all([
      this.getGroupTypeInfo(),
      this.getDomain(),
      this.getDataType()
    ]).then((_: any) => {
      this.getField();
    });
  },
  methods: {
    getPopupContainer(triggerNode:any){
      return triggerNode
    },
    getField(_obj?: any) {
      let pageIndex = 1;
      let pageSize = 15;
      if (_obj) {
        if (_obj.pageIndex) {
          pageIndex = _obj.pageIndex;
          pageSize = _obj.pageSize;
        }
      }
      let Question_Text = this.questionText || "";
      let domainId = this.domainObj.domainId || "";
      let GroupId = this.groupObj.groupId || "";
      let DataType = this.dataTypeObj.dataType || "";
      let params = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        Question_Text: Question_Text,
        domainId: domainId,
        diseaseId: GroupId,
        DataType: DataType
      };
      const _then = this.$api.control.getField(params).then((res: any) => {
        this.tableVal = res.data.fields;
        this.pageCount = res.data.pageCount;
      });
      return _then;
    },
    searchSelect() {
      let val = arguments[0][0];
      let type = arguments[1];
      if (type == "groupId") {
        this.groupObj.groupId = val;
      } else if (type == "domainId") {
        this.domainObj.domainId = val;
      } else if (type == "dataType") {
        this.dataTypeObj.dataType = val;
      }
      this.getField();
    },
    searchText() {
      this.getField();
    },
    showModal() {
      (this.$refs.modal as any).visible = true;
    },
    getGroupTypeInfo() {
      // let params = {
      //   // groupDicVal: 1 //1疾病领域 2单位 3访视类型
      //   groupDicVal: '7db94e9a-2b61-4c9c-85e5-fe4d5153380b',
      // };
      const _then = this.$api.control
        .getDiseaseList()
        .then((res: any) => {
          this.groupObj.groupList = res.data;
        });
      return _then;
    },
    getDomain() {
      const _then = this.$api.control.getDomain().then((res: any) => {
        this.domainObj.domainList = res.data;
      });
      return _then;
    },
    getDataType() {
      const _then = this.$api.control.getDataType().then((res: any) => {
        this.dataTypeObj.dataTypeList = res.data;
      });
      return _then;
    },
    edit(row: any) {
      (this.$refs.modal as any).visible = true;
      this.$nextTick(() => {
        (this.$refs.modal as any).getDefVal(row);
      });
    },
    del(row: any) {
      let params = {
        fieldId: row.id
      };
      this.$api.control.delField(params).then((res: any) => {
        this.getField();
      });
    },
    correntChange(){
      console.log(this.$refs.fieldtable);
      (this.$refs.fieldtable as any).current=1
    }
  }
});
</script>

<style lang="scss">
</style>