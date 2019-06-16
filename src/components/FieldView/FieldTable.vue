<template>
  <div class="field-table">
    <a-table :pagination="false" :columns="columns" :dataSource="tableData" bordered>
      <span slot="domainName">
        域名
        <br>Domain
      </span>
      <!-- <span slot="orderNumber">
        序号
        <br>(Num)
      </span> -->
      <span slot="questionText">
        CRF问题描述
        <br>(Question text)
      </span>
      <span slot="completionInstructions">
        CRF 填写指南
        <br>(Completion Instructions)
      </span>
      <span slot="sdtmig">
        SDTM 变量
        <br>(SDTMIG variable)
      </span>
      <span slot="cdashig">
        CDASH 变量
        <br>(CDASHIG Variable)
      </span>
      <span slot="dataType">
        数据类型
        <br>(Data Type)
      </span>
       <span slot="UpdateTime">
        更新时间
        <br>(Update Time)
      </span>
      <span slot="groupName">疾病领域(Type)</span>
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="editRun(record)" style="padding-right:20px;">
          <i class="iconfont icon-bianji"></i>
        </a>
        <a href="javascript:;" @click="delRun(record)">
          <i class="iconfont icon-delete"></i>
        </a>
      </span>
    </a-table>
    <div class="pagination">
      <a-pagination v-model="current" :total="pageCount" :showTotal="total => `共 ${total} 条`" :pageSize="pageSize"
        showSizeChanger :pageSizeOptions="pageSizeOptions" @showSizeChange="onShowSizeChange" showQuickJumper >
        <template slot='buildOptionText' slot-scope='props'>
          <span>{{props.value}}条/页</span>
        </template>
      </a-pagination>
    </div>
    <a-modal class="field-modal module-modal" cancelText="取消" okText="确认" :closable="false" :width="410" title="删除"
      centered v-model="visibleTwo" @ok="delOk">
      <div class="text">
        是否确认删除
        <span class="text-bold">{{ thisRow.question_Text }}</span>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  const columns: any = [{
      dataIndex: "domainName",
      key: "domainName",
      width: 100,
      slots: {
        title: "domainName"
      }
    },
    // {
    //   dataIndex: "orderNumber",
    //   key: "orderNumber",
    //   width: 100,
    //   slots: { title: "orderNumber" }
    // },
    {
      dataIndex: "question_Text",
      key: "questionText",
      width: 300,
      slots: {
        title: "questionText"
      }
    },
    {
      slots: {
        title: "completionInstructions"
      },
      dataIndex: "completion_Instructions",
      width: 450,
      key: "completionInstructions"
    },
    {
      slots: {
        title: "sdtmig"
      },
      dataIndex: "sdtmig",
      width: "auto",
      key: "sdtmig"
    },
    {
      slots: {
        title: "cdashig"
      },
      dataIndex: "cdashig",
      width: "auto",
      key: "cdashig"
    },
    {
      slots: {
        title: "dataType"
      },
      dataIndex: "dataType",
      width: 120,
      key: "dataType"
    },

    {
      slots: {
        title: "groupName"
      },
      key: "groupName",
      width: 100,
      dataIndex: "diseaseName"
    },
       {
      slots: {
        title: "UpdateTime"
      },
      key: "update_Time",
      width: 120,
      dataIndex: "update_Time"
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      scopedSlots: {
        customRender: "action"
      }
    }
  ];

  import Vue from "vue";

  export default Vue.extend({
    name: "FieldTable",
    props: ["tableVal", "pageCount"],
    data() {
      return {
        columns,
        current: 1,
        thisRow: {},
        visibleTwo: false,
        pageSizeOptions: ['15', '30', '45', '60'],
        pageSize: 15,
      };
    },
    watch: {
      current(v) {
        let _obj = {
          pageIndex: v,
          pageSize: this.pageSize,
        };
        (this.$parent as any).getField(_obj);
      },
    },
    computed: {
      tableData() {
        if (this.tableVal) {
          this.tableVal.forEach((res: any) => {
            res.key = this.$uuid();
            res.update_Time = this.$moment(res.update_Time).format('YYYY-MM-DD')
          });
          let _data: any = this.tableVal;
          return _data;
        }
      }
    },
    methods: {
      editRun(row: any) {
        (this.$parent as any).edit(row);
      },
      delOk() {
        (this.$parent as any).del(this.thisRow);
        this.visibleTwo = false;
      },
      delRun(row: any) {
        this.visibleTwo = true;
        this.thisRow = row;
      },
      onShowSizeChange(current: number, pageSize: number) {
        this.pageSize = pageSize;
        let _obj = {
          pageIndex: current,
          pageSize: pageSize,
        };
        (this.$parent as any).getField(_obj);
      },
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