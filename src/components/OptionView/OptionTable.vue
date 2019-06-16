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
      <span slot="codeLabel">名称</span>
      <span slot="codeValue">值</span>
      <span slot="codeListKVLinks">关联选项</span>
      <span slot="codeListKVLinks" slot-scope="record">
        <template v-if="record.codeListKVLinks && record.codeListKVLinks.length > 0">
          {{ record.codeListKVLinks[0].codeList.remark_ZH }}(
          <span
            v-for="(item,i) in record.codeListKVLinks"
            :key="i"
          >
            <template v-if="item.codeListKV.codeLabel">{{item.codeListKV.codeLabel}} =</template>
            <template v-if="item.codeListKV.codeValue">
              {{item.codeListKV.codeValue}}
              <template
                v-if="i != (record.codeListKVLinks.length - 1)"
              >,</template>
            </template>
          </span>)
          <!-- {{ record.parCodeLabel }}
          <template v-if="record.parCodeValue">({{ record.parCodeValue }})</template>-->
        </template>
      </span>
      <span slot="action" slot-scope="record">
        <a href="javascript:;" class="opeBtn" @click="assRun(record)">
          <i class="iconfont icon-guanlian"></i>
        </a>
        <!-- <a href="javascript:;" class="opeBtn" @click="editRun(record)">
          <i class="iconfont icon-bianji"></i>
        </a>-->
        <a href="javascript:;" class="opeBtn" @click="delRun(record)">
          <i class="iconfont icon-delete"></i>
        </a>
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
    <codeList-kVs ref="CodeListKVs"></codeList-kVs>
  </div>
</template>

<script lang="ts">
import CodeListKVs from "@/components/OptionView/CodeListKVs.vue";
const columns: any = [
  {
    dataIndex: "index",
    key: "index",
    width: 80,
    slots: { title: "index" }
  },
  {
    slots: { title: "codeLabel" },
    dataIndex: "codeLabel",
    width: 120,
    key: "codeLabel"
  },
  {
    slots: { title: "codeValue" },
    dataIndex: "codeValue",
    width: 80,
    key: "codeValue"
  },
  {
    slots: { title: "codeListKVLinks" },
    key: "codeListKVLinks",
    scopedSlots: { customRender: "codeListKVLinks" }
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
  props: ["kVsData"],
  provide(): any {
    return {
      ModuleTable: this
    };
  },
  data() {
    return {
      columns,
      visible: false,
      id: "",
      name: "",
      delId: "",
      record: {} as any,
      scrollY: {} as any
    };
  },
  components: {
    CodeListKVs
  },
  mounted() {
    this.resize();
    console.log(this)
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
      }
    },
    upData() {
      (this.$parent as any).getKvs();
    },
    handleOk() {
      this.delCodeListKV().then(() => {
        (this.$parent as any).getKvs();
      });
      // (this.$parent as any).delModuleField(this.id);
      this.visible = false;
    },
    editRun(record: any) {
      console.log(record);
      let id = record.id;
      (this.$parent as any).editOption();
    },
    delRun(record: any) {
      this.delId = record.id;
      this.name = record.codeLabel;
      this.visible = true;
    },
    delCodeListKV() {
      let id = this.delId;
      let params = {
        codelistkvId: id
      };
      const _then = this.$api.control.delCodeListKV(params);
      return _then;
    },
    assRun(record: any) {
      this.record = record;
      console.log(this.record);
      (this.$refs.CodeListKVs as any).rowId = record.id || "";
      (this.$refs.CodeListKVs as any).showModal(record.id);
    }
  },
  computed: {
    tableData() {
      let _json = JSON.parse(JSON.stringify(this.kVsData));
      _json.forEach((res: any, i: any) => {
        res.key = res.id;
        res.index = i + 1;
      });
      console.log(_json);
      return _json;
    }
  }
});
</script>

<style lang="scss">
</style>