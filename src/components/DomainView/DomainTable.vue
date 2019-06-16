<template>
  <div class="field-table option-table" ref="table">
    <a-table
      :scroll="scrollY"
      :columns="columns"
      :dataSource="tableData"
      bordered
      :pagination='false'
    >
      <span slot="index">序号</span>
      <span slot="description_EN">名称</span>
      <span slot="name">简称</span>
      <span slot="description">中文名</span>
      <span slot="name_Description">说明</span>
      <span slot="action" slot-scope="record">
        <a href="javascript:;" class="opeBtn" @click="editRun(record)">
          <i class="iconfont icon-bianji"></i>
        </a>
        <a href="javascript:;" class="opeBtn" @click="delRun(record)">
          <i class="iconfont icon-delete"></i>
        </a>
        <template v-if="!record.cflag">
          <a href="javascript:;" class="opeBtn" @click="addRun(record.id)">
            <i class="iconfont icon-add_xinzeng add"></i>
          </a>
        </template>
      </span>
    </a-table>
    <div class="pagination">
      <a-pagination v-model="current" :total="this.pageCount"  @change="onChange" :defaultPageSize='15'/>
    </div>
    <a-modal
      class="field-modal module-modal"
      cancelText="取消"
      okText="确认"
      :closable="false"
      :width="410"
      title="删除"
      centered
      v-model="delVisible"
      @ok="delHandleOk"
    >
      <div class="text">
        是否确认删除
        <span class="text-bold">{{ name }}</span>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
const columns: any = [
  {
    dataIndex: "index",
    key: "index",
    width: 80,
    slots: { title: "index" }
  },
  {
    slots: { title: "description_EN" },
    dataIndex: "description_EN",
    key: "description_EN"
  },
  {
    slots: { title: "name" },
    dataIndex: "name",
    key: "name"
  },
  {
    slots: { title: "description" },
    dataIndex: "description",
    key: "description"
  },
  {
    slots: { title: "name_Description" },
    dataIndex: "name_Description",
    key: "name_Description"
  },
  {
    title: "操作",
    key: "action",
    width: 200,
    scopedSlots: { customRender: "action" }
  }
];

import Vue from "vue";

export default Vue.extend({
  name: "ModuleTable",
  props: ["tableVal","pageIndex",'Id'],
  data() {
    return {
      columns,
      visible: false,
      current: 1,
      pageCount: null,
      parentId: null,
      delId: "",
      id: "",
      name: "",
      delVisible: false,
      scrollY: {} as any,
      pageSizeOptions:{
        pageSize:14
      }
    };
  },
  mounted() {
    this.resize();
  },
  updated() {
    this.resize();
  },
  methods: {
    resize() {
      let _dom = this.$refs.table as any; //table
      let _domPar = document.querySelector(".module-right") as any; //table 父级
      let _domHe = _dom.querySelector(".ant-table-thead");
      let _domSea = _domPar.querySelector(".search");
      if (_dom.offsetHeight > _domPar.offsetHeight) {
        let y =
          _domPar.offsetHeight - _domSea.offsetHeight - _domHe.offsetHeight - 2;
        this.scrollY = {
          y: y
        };
      } else {
      }
    },
    handleOk() {
      (this.$parent as any).delModuleField(this.id);
      this.visible = false;
    },
    editRun(record: any) {
      let id = record.id;
      let parentId = record.parentId;
      (this.$parent as any).addDomain(id, parentId);
    },
    delRun(record: any) {
      this.delId = record.id;
      this.name = record.description;
      this.delVisible = true;
    },
    addRun(id: any) {
      (this.$parent as any).addDomainChild(id);
    },
    delHandleOk() {
      let params = {
        domainId: this.delId
      };
      this.$api.control.delDomain(params).then((res: any) => {
        this.delVisible = false;
        (this.$parent as any).getDomainInfo();
      });
    },
    onChange(current:number){
       (this.$parent as any).getDomainInfo(null,current);
    }
  },
  computed: {
    tableData() {
      let _json = JSON.parse(JSON.stringify(this.tableVal));
      this.pageCount = _json.pageCount;
      let domains = _json.domains;
      this.current = this.pageIndex;
      domains.forEach((res: any, i: any) => {
        res.key = res.id;
        res.index = i + 1;
        let children = [] as any;
        let domainsArr = res.domains;
        if (domainsArr && domainsArr.length > 0) {
          domainsArr.forEach((cres: any, ci: any) => {
            cres.key = cres.id;
            cres.index = i + 1 + "." + (ci + 1);
            cres.cflag = true;
            children.push(cres);
          });
          res.children = children;
        }
      });
      return domains;
    }
  }
});
</script>

<style lang="scss">
</style>