<template>
  <div class="field-table">
    <a-table
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :pagination="false"
      :scroll="{ y: 400 }"
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
    </a-table>
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
    width: 200,
    key: "completionInstructions"
    // completion_Instructions
  },
  {
    slots: { title: "sdtmigTitle" },
    width: 200,
    dataIndex: "sdtmig"
    // sdtmig
  },
  {
    slots: { title: "cdashigTitle" },
    key: "cdashig",
    width: 200,
    dataIndex: "cdashig"
    // cdashig
  }
];

import Vue from "vue";

export default Vue.extend({
  name: "ModuleTable",
  props: ["tableVal", "domainId", "selectedDomainIds", "labelText"],
  inject: ['setTabSelect'],
  data() {
    return {
      columns,
      selectedRowKeys: []
    };
  },
  computed: {
    tableData() {
      this.tableVal.forEach((res: any) => {
        res.key = res.id;
      });
      let _data: any = this.tableVal;
      return _data;
    }
  },
  methods: {
    onSelectChange(selectedRowKeys: any, selectedRows: any) {
      let selectedDomainIds = this.selectedDomainIds;
      let _labelText = this.labelText;
      _labelText = "";

      let labelText = [] as any;
      selectedRows.forEach((res: any) => {
        labelText.push(res.question_Text);
      });

      _labelText = labelText;

      let obj = selectedDomainIds.find((res: any) => {
        return res.domainId == this.domainId;
      });
      if (obj) {
        obj.value = selectedRowKeys;
        obj.labelText = labelText;
      } else {
        let _json = {
          domainId: this.domainId,
          labelText: labelText,
          value: selectedRowKeys
        };
        selectedDomainIds.push(_json);
      }
      console.log(selectedDomainIds)
      this.setSelected(selectedDomainIds)
      this.selectedRowKeys = selectedRowKeys;
    },
    setSelected(selectedDomainIds:any){
        selectedDomainIds.forEach((ele:any) => {
         (this as any).setTabSelect.setTabSelect(ele)          
        });
    }
  }

});
</script>

<style lang="scss">
</style>