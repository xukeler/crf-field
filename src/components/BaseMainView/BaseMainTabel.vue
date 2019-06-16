<template>
  <div class="field-table option-table" ref="table">
    <a-table
      :pagination="false"
      :scroll="scrollY"
      :columns="columns"
      :dataSource="tableData"
      bordered
    >
      <span slot="index">序号</span>
      <span slot="groupName">名称</span>
      <span slot="value">说明</span>
      <span slot="remark">备注</span>
      <span slot="action" slot-scope="record" v-if="countId!=3">
        <a href="javascript:;" class="opeBtn" @click="editRun(record)">
          <i class="iconfont icon-bianji"></i>
        </a>
        <a-popconfirm :title="'确定删除 '+record.name+' ?'" @confirm="() => delRun(record)">
          <a href="javascript:;" class="opeBtn">
            <i class="iconfont icon-delete"></i>
          </a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script lang="ts">
const columns: any = [
  {
    dataIndex: "index",
    key: "index",
    width: '6%',
    slots: { title: "index" },

  },
  {
    slots: { title: "groupName" },
    dataIndex: "name",
    key: "groupName",
    width: '20%',
  },
  {
    slots: { title: "value" },
    dataIndex: "description",
    key: "value",
    width:'30%'
  },
  {
    slots: { title: "remark" },
    key: "remark",
    dataIndex: "remark",
    width:'34%'

  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    width:'10%'

  }
];

import Vue from "vue";

export default Vue.extend({
  name: "BaseMainTable",
  props: ["groupData"],
  data() {
    return {
      columns,
      visible: false,
      scrollY: {} as any,
      countId:'',
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
    editRun(record: any) {
      (this.$parent as any).addRun(record);
    },
    delRun(record: any) {
      if (record.countId == 1) {
        let params = {
          diseaseId: record.id
        };
        this.$api.control.delDisease(params).then(() => {
          (this.$parent as any).backGetList(record.countId);
        });
      }else if(record.countId == 2){
         let params = {
          unitId: record.id
        };
        this.$api.control.delUnit(params).then(() => {
          (this.$parent as any).backGetList(record.countId);
        });
      }else if(record.countId == 4){
        let params = {
          widgetId: record.id
        };
        this.$api.control.delWidget(params).then(() => {
          (this.$parent as any).backGetList(record.countId);
        });
      }
    }
  },
  computed: {
    tableData() {
      let _json = JSON.parse(JSON.stringify(this.groupData));
      this.countId=this.groupData[0].countId;
      _json.forEach((res: any, i: any) => {
        res.key = res.id;
        res.index = i + 1;
        res.parCodeLabel = "";
        res.parCodeValue = "";
      });
      return _json;
    }
  }
});
</script>

<style lang="scss">
</style>