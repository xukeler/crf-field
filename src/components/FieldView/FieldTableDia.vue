<template>
  <div class="field-table">
    <a-table :pagination="false" :columns="columns" :dataSource="tableData" bordered>
      <span slot="codeLabel">名称</span>
      <span slot="codeValue">值</span>
      <span slot="codeListKVLinks">关联项</span>
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
    </a-table>
  </div>
</template>

<script lang="ts">
const columns: any = [
  {
    dataIndex: "codeLabel",
    key: "codeLabel",
    slots: { title: "codeLabel" }
  },
  {
    dataIndex: "codeValue",
    key: "codeValue",
    slots: { title: "codeValue" }
  },
  {
    slots: { title: "codeListKVLinks" },
    key: "codeListKVLinks",
    scopedSlots: { customRender: "codeListKVLinks" }
  }
];

import Vue from "vue";

export default Vue.extend({
  name: "FieldAddTable",
  props: ["tableVal", "pageCount"],
  data() {
    return {
      columns,
      current: 1
    };
  },
  watch: {
    current(v) {
      let _obj = {
        pageIndex: v
      };
      (this.$parent as any).getField(_obj);
    }
  },
  computed: {
    tableData() {
      if (this.tableVal) {
        this.tableVal.forEach((res: any) => {
          res.key = this.$uuid();
        });
        let _data: any = this.tableVal;
        return _data;
      }
    }
  }
});
</script>

<style lang="scss">
.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
</style>