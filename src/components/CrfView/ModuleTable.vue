<template>
  <div class="field-table" ref="table">
    <a-table
      :pagination="false"
      :scroll="scrollY"
      :columns="columns"
      :dataSource="tableData"
      bordered
    >
      <span slot="questionTitle">
        CRF 问题描述
        <br>(Question text)
      </span>
      <span slot="completionInstructions">
        CRF 填写指南
        <br>(CRF Completion Instructions)
      </span>
      <span slot="sdtmigTitle">
        SDTM 变量
        <br>(SDTMIG variable)
      </span>
      <span slot="cdashigTitle">
        CDASH 变量
        <br>(CDASHIG Variable)
      </span>
      <span slot="action" slot-scope="record">
        <a
          class="editBtn"
          href="javascript:;"
          v-if="record.index != 0"
          @click="upDown({
            id:record.id,
            type:'1',//1上移
        })"
        >上移</a>
        <a
          class="editBtn"
          href="javascript:;"
          v-if="record.index != tableData.length - 1"
          @click="upDown({
            id:record.id,
            type:'2',//2下移
        })"
        >下移</a>
        <a class="editBtn" href="javascript:;" @click="delField(record.id,record.question_Text)">删除</a>
      </span>
    </a-table>
    <a-modal
      class="field-modal module-modal"
      cancelText="取消"
      okText="确认"
      :closable="false"
      :width="410"
      title="删除"
      centered
      v-model="visible"
      @ok="handleOk"
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
    dataIndex: "question_Text",
    key: "question_Text",
    width: 200,
    slots: { title: "questionTitle" }
    // slots: { title: 'customTitle' },
    // scopedSlots: { customRender: 'name' },
  },
  {
    slots: { title: "completionInstructions" },
    dataIndex: "completion_Instructions",
    width: 400,
    key: "completionInstructions"
    // completion_Instructions
  },
  {
    slots: { title: "sdtmigTitle" },
    dataIndex: "sdtmig",
    width: 200,
    key: "sdtmig"
    // sdtmig
  },
  {
    slots: { title: "cdashigTitle" },
    key: "cdashig",
    width: 200,
    dataIndex: "cdashig"
    // cdashig
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
  props: ["tableVal", "activeId"],
  data() {
    return {
      columns,
      visible: false,
      id: "",
      name: "",
      scrollY: {} as any
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
    upDown(type: any) {
      let id = type.id;
      let _type = type.type;
      let _json = this.tableData.find((res: any) => {
        return res.id == id;
      });
      if (!_json) {
        return false;
      }
      let index = _json.index;
      let rIndex = index + 1;
      if (_type == "1") {
        //上移动
        rIndex = index - 1;
      }
      let preFieldId = this.tableData[rIndex].id;
      let params = {
        moveFieldId: id,
        preFieldId: preFieldId,
        moduleId: this.activeId
      };
      this.$api.control.moduleFieldOrder(params).then((res: any) => {
        (this.$parent as any).getModuleFields(null,null,1); // 1搜索后点击上移下移后重新获取数据
      });
    },
    handleOk() {
      (this.$parent as any).delModuleField(this.id);
      this.visible = false;
    },
    delField(id: any, name?: any) {
      this.id = id;
      this.name = name;
      this.visible = true;
    }
  },
  computed: {
    tableData() {
      this.tableVal.forEach((res: any, i: any) => {
        res.key = res.id;
        res.index = i;
      });
      let _data: any = this.tableVal;
      return _data;
    }
  }
});
</script>

<style lang="scss">
</style>