<template>
  <div class="field-table" ref="table">
    <template>
      <a-table class="optionDiaTabel" :pagination="false" :scroll="{y:450}" :columns="columns" :dataSource="tableData"
        :expandRowByClick="true" :rowSelection="rowSelection" :defaultExpandedRowKeys="defaultExpandedRowKeys"
        :rowClassName="setClass" bordered></a-table>
      <!-- <div class="pagination">
        <a-pagination v-model="current" :total="this.pageCount" />
      </div> -->
    </template>
  </div>
</template>

<script lang="ts">
  const columns: any = [{
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
    }
  ];

  import Vue from "vue";
  export default Vue.extend({
    name: "OptionDiaTable",
    watch: {
      current(v) {
        let _obj = {
          pageIndex: v,
          tagName: this.tagName,

        };
        (this as any).getCodeListPage(_obj);
      },
      tagName(v) {
        let _obj = {
          pageIndex: 1,
          tagName: this.tagName,
        } as any;
        (this as any).current = 1;
        (this as any).getCodeListPage(_obj);
      },

    },
    props: ["tagName"],
    inject: ["ModuleTable"],

    computed: {
      defaultExpandedRowKeys() {
        if ((this as any).ModuleTable) {
          let record = JSON.parse(
            JSON.stringify((this as any).ModuleTable.record)
          );
          if (!record || !record.codeListKVLinks || !record.codeListKVLinks[0]) {
            return [''];
          }
          let id = record.codeListKVLinks[0].codeList.id;
          (this as any).curParentId = id;
          return [id];
        }
      },
      rowSelection() {
        let {
          selectedRowKeys
        } = this as any;
        let keys = [] as any;
        let ModuleTable = (this as any).ModuleTable;
        // console.log(ModuleTable.record.codeListKVLinks)
        if ((this as any).record && ModuleTable && ModuleTable.record.codeListKVLinks) {
          (this as any).record = JSON.parse(
            JSON.stringify(ModuleTable.record)
          );
          let codeListKVLinks = (this as any).record.codeListKVLinks;
          codeListKVLinks.forEach((res: any) => {
            keys.push(res.codeListKV.id);
          });
          (this as any).record = "";
        }
        if (keys && keys.length > 0) {
          selectedRowKeys = keys;
          (this as any).selectedRowKeys = keys;
        }
        return {
          selectedRowKeys,
          onChange: (this as any).onSelectChange,
          getCheckboxProps: (this as any).onCheckboxProps
        };
      }
    },

    data() {
      return {
        columns,
        // rowSelection: {
        //   getCheckboxProps: (record: any) => ({
        //     props: {
        //       disabled: record.disabled
        //     }
        //   }),
        //   onChange: (selectedRowKeys: any, selectedRows: any) => {
        //     let $this: any = this;
        //     console.log(selectedRowKeys);
        //     if (selectedRows.length > 1) {
        //       let endParentId = selectedRows[selectedRows.length - 1].parentId;
        //       let beforeParentId = selectedRows[selectedRows.length - 2].parentId;
        //       if (beforeParentId != endParentId) {
        //         selectedRowKeys.splice(0, selectedRowKeys.length - 1);
        //       }
        //     }
        //     $this.selectedRowKeys = selectedRowKeys;
        //   }
        // },
        setClass(row: any) {
          if (row.disabled) {
            return "rowParent";
          }
        },
        visible: false,
        pageCount: 0,
        tableData: [] as any,
        current: 1,
        record: {} as any,
        selectedRowKeys: [] as any,
        curParentId: '',
        json: {} as any,
      };
    },

    created() {
      (this as any).getCodeListPage();
    },

    methods: {
      onSelectChange(selectedRowKeys: any, selectedRows: any) {
        let arr = [] as any;
        selectedRowKeys.forEach((res: any) => {
          var parentId = selectedRows.find((_row: any) => {
            return _row.key == res;
          }).parentId;
          if (arr.length == 0) {
            (this as any).json = Object.assign({
              ids: [res],
              parentId: parentId
            })
            arr.push((this as any).json)
          } else {
            let _json = arr.find((item: any) => {
              return item.parentId != parentId;
            })
            if (!_json) {
              (this as any).json.ids.push(res);
            } else {
              arr = [];
              selectedRowKeys.splice(0, selectedRowKeys.length - 1);
              (this as any).json = Object.assign({
                ids: [res],
                parentId: parentId
              })
              arr.push((this as any).json)
            }
          }
        });
        (this as any).selectedRowKeys = arr[0].ids;

        // if (selectedRows.length > 1) {
        //   let preId = selectedRowKeys[selectedRowKeys.length - 2];
        //   let nowId = selectedRowKeys[selectedRowKeys.length - 1];
        //   let nowParentId = selectedRows.find((res: any) => {
        //     return res.key == nowId;
        //   }).parentId;
        //   let preParentId = selectedRows.find((res: any) => {
        //     return res.key == preId;
        //   }).parentId;
        //   if (nowParentId != preParentId) {
        //     selectedRowKeys.splice(0, selectedRowKeys.length - 1);
        //   }
        // }
        // this.selectedRowKeys = selectedRowKeys;
      },
      onCheckboxProps(record: any) {
        return {
          props: {
            disabled: record.disabled
          }
        };
      },
      handleOk() {
        (this as any).visible = false;
      },
      editRun(id: any) {},
      delRun(id: any) {},
      getPostData() {
        let _data = JSON.parse(JSON.stringify((this as any).tableData));
        let _dataArr = [] as any;
        _data.forEach((res: any) => {
          if (res.children && res.children.length > 0) {
            _dataArr.push(...res.children);
          }
        });
        let returnData = [] as any;
        (this as any).selectedRowKeys.forEach((res: any) => {
          let id = res;
          let _obj = _dataArr.find((resNow: any) => {
            return resNow.key == id;
          });
          if (_obj) {
            let parent = (this as any).tableData.find((par: any) => {
              return _obj.parentId == par.key;
            });
            returnData.push({
              codeId: _obj.id || "",
              codeLabel: _obj.codeLabel || "",
              codeValue: _obj.codeValue || "",
              parentName: parent.remark_ZH || ""
              // linkCodelistKVs:[],
              // linkCodelistKVs: _obj.id || null
            });
          }
        });
        return returnData;
      },
      getCodeListPage(_obj ? : any) {
        let pageIndex = (this as any).current;
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
          remark_zh: tagName,
          // pageIndex: pageIndex,
          // pageSize: 10
        };
        (this as any).tableData = [] as any;
        this.$api.control.getCodeListPage(params).then((res: any) => {
          // console.log(res);
          let data = res.data;
          let _dataArr = [] as any;
          (this as any).pageCount = data.pageCount;
          data.codeLists.forEach((res: any, i: any) => {
            let json = {
              key: res.id,
              disabled: true,
              remark_ZH: res.remark_ZH,
              codelist_Name: res.codelist_Name,
              children: []
            };
            if (res.kVs && res.kVs.length > 0) {
              res.kVs.forEach((item: any, t: any) => {
                item.key = item.id;
                item.parentId = res.id;
                item.disabled = false;
              });
              json.children = res.kVs;
            }
            _dataArr.push(json);
          });
          // 选中放在第一个
          _dataArr.forEach((ele: any, i: number) => {
            if (ele.key == (this as any).curParentId) {
              _dataArr.splice(i, 1);
              _dataArr.unshift(ele)
            }
          });
          (this as any).tableData = _dataArr;
        });
      }
    }
  });
</script>

<style lang="scss">
</style>