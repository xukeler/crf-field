
<template>
  <div class="field-table" ref="table">
    <template>
      <a-table
        class="optionDiaTabel"
        :pagination="false"
        :scroll="{y:450}"
        :columns="columns"
        :dataSource="tableData"
        :expandRowByClick="true"
        :rowSelection="rowSelection"
        :rowClassName="setClass"
        @expandedRowsChange="expandedRowsChange"
        bordered
      ></a-table>
      <!-- <div class="pagination">
        <a-pagination v-model="current" :total="this.pageCount"/>
      </div>-->
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
    </template>
  </div>
</template>

<script lang="ts">
const columns: any = [
  {
    title: "选项名称",
    dataIndex: "remark_ZH",
    width: 100,
    key: "remark_ZH"
  },
  {
    title: "名称",
    dataIndex: "codeLabel",
    width: 100,
    key: "codeLabel"
  },
  {
    title: "值",
    dataIndex: "codeValue",
    width: 100,
    key: "codeValue"
  },
  {
    title: "关联项",
    dataIndex: "parent",
    width: 100,
    key: "parent"
  }
];

import Vue from "vue";

export default Vue.extend({
  name: "OptionDiaTable",
  props: ["tagName"],
  watch: {
    current(v) {
      let _obj = {
        pageIndex: v,
        tagName: this.tagName
      };
      this.getCodeListPage(_obj);
    },
    tagName(v) {
      let _obj = {
        pageIndex: 1,
        tagName: this.tagName
      };
      this.current = 1;
      this.getCodeListPage(_obj);
    }
  },
  data() {
    return {
      columns,
      rowSelection: {
        type: "radio",
        getCheckboxProps: (record: any) => ({
          props: {
            disabled: record.disabled
          }
        }),
        onChange: (selectedRowKeys: any, selectedRows: any) => {
          console.log(12222)
          let $this: any = this;
          $this.selectedRowKeys = selectedRowKeys;
        }
      },
      setClass(row: any) {
        if (!row.disabled) {
          return "rowParent";
        }
      },
      visible: false,
      pageCount: 0,
      tableData: [] as any,
      current: 1,
      name: "",
      selectedRowKeys: [] as any
    };
  },
  created() {
    this.getCodeListPage();
  },
  methods: {
    expandedRowsChange(ws:any){
      console.log(ws)
    },
    handleOk() {
      this.visible = false;
    },
    editRun(id: any) {},
    delRun(id: any) {},
    getPostData() {
      let id = this.selectedRowKeys[0];
      let _data = this.tableData;
      let _obj = _data.find((res: any) => {
        return res.key == id;
      });
      let returnData = "" as any;
      if (_obj) {
        returnData = {
          id: _obj.key,
          name: _obj.codelist_Name,
          remark_ZH: _obj.remark_ZH,
          kvs: _obj.children
        };
      }
      return returnData;
    },
    getFieldDiaData() {
      //获取添加字段 表格数据
      let id = this.selectedRowKeys[0];
      let _data = this.tableData;
      let _obj = _data.find((res: any) => {
        return res.key == id;
      });
      let returnData = "" as any;
      if (_obj) {
        returnData = {
          id: _obj.key,
          name: _obj.codelist_Name,
          remark_ZH: _obj.remark_ZH,
          kvs: _obj.children
        };
      }
      return returnData;
    },
    getCodeListPage(_obj?: any) {
      let pageIndex = this.current;
      let tagName = "";
      if (_obj) {
        if (_obj.pageIndex) {
          pageIndex = _obj.pageIndex;
        }
        if (_obj.tagName) {
          tagName = _obj.tagName;
        }
      }
      let params = {
        // tagName: tagName,
        remark_zh: tagName
        // pageIndex: pageIndex,
        // pageSize: 10
      };
      this.tableData = [] as any;
      this.$api.control.getCodeListPage(params).then((res: any) => {
        let data = res.data;
        let _dataArr = [] as any;
        this.pageCount = data.pageCount;
        data.codeLists.forEach((res: any, i: any) => {
          let arr = [] as any;
          let json = {
            key: res.id,
            remark_ZH: res.remark_ZH,
            codelist_Name: res.codelist_Name,
            children: [],
            parent:[]
          };
          if (res.kVs && res.kVs.length > 0) {
            res.kVs.forEach((item: any, t: any) => {
              item.key = item.id;
              item.disabled = true;
              if (item.codeLabel && item.codeValue) {
                arr.push(item.codeLabel + "=" + item.codeValue);
              }
            });
            let linkArr=arr.join(',')
            json.children = res.kVs;
            json.parent=linkArr;
          }
          _dataArr.push(json);
        });
        this.tableData = _dataArr;
      });
    }
  }
});
</script>

<style lang="scss">
</style>