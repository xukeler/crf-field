<template>
  <div class="field-table option-add-table" ref="table">
    <a-table :pagination="false" :scroll="scrollY" :columns="columns" :dataSource="tableData">
      <span slot="index">序号</span>
      <span slot="codeLabel">名称</span>
      <span slot="codeValue">值</span>
      <span slot="linkCodelistKVs">关联项</span>
      <span slot="linkCodelistKVs" slot-scope="text, record">
        <template v-if="record.linkCodelistKVs.length > 0">
          {{ record.linkCodelistKVs[0].parentName }}(
          <span v-for="(item,i) in record.linkCodelistKVs" :key="i">
            <template v-if="item.codeLabel">{{item.codeLabel}} =</template>
            <template v-if="item.codeValue">
              {{item.codeValue}}
              <template v-if="i != (record.linkCodelistKVs.length - 1)">,</template>
            </template>
          </span>)
        </template>
      </span>
      <template v-for="col in ['codeLabel', 'codeValue']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <template v-if="col == 'linkCodelistKVs'">
            <a-select showSearch notFoundContent="未找到内容" optionFilterProp="children" placeholder="请选择"
              @change="e => record.id = handleChange(e, record.key, col)" :defaultValue="record.id">
              <a-select-option v-for="(item,i) in codeListKVs" :key="i" :value="item.id" :title="item.codeLabel"
                class="groupType">{{ item.codeLabel }}</a-select-option>
            </a-select>
          </template>
          <template v-else>
            <a-input :value="text" placeholder="请输入"
              @change="e => text = handleChange(e.target.value, record.key, col)" />
          </template>
        </div>
      </template>
      <span slot="action" slot-scope="record">
        <a href="javascript:;" class="opeBtn" @click="assRun(record)">
          <i class="iconfont icon-guanlian"></i>
        </a>
        <a href="javascript:;" class="opeBtn" @click="addRun(record)">
          <i class="iconfont icon-add_xinzeng"></i>
        </a>
        <template v-if="tableData.length != 1">
          <a href="javascript:;" class="opeBtn" @click="delRun(record)">
            <i class="iconfont icon-jian1"></i>
          </a>
        </template>
      </span>
    </a-table>
    <a-modal class="field-modal module-modal" cancelText="取消" okText="确认" :closable="false" :width="410" title="删除"
      centered v-model="visible" @ok="handleOk">
      <div class="text">
        是否确认删除
        <template v-if="name">
          <span class="text-bold">{{ name }} ?</span>
        </template>
      </div>
    </a-modal>
    <code-listKVs ref="CodeListKVs"></code-listKVs>
  </div>
</template>

<script lang="ts">
  const columns: any = [{
      dataIndex: "index",
      key: "index",
      width: 80,
      slots: {
        title: "index"
      }
    },
    {
      slots: {
        title: "codeLabel"
      },
      scopedSlots: {
        customRender: "codeLabel"
      },
      dataIndex: "codeLabel",
      width: 200,
      key: "codeLabel"
    },
    {
      slots: {
        title: "codeValue"
      },
      scopedSlots: {
        customRender: "codeValue"
      },
      dataIndex: "codeValue",
      width: 200,
      key: "codeValue"
    },
    {
      slots: {
        title: "linkCodelistKVs"
      },
      scopedSlots: {
        customRender: "linkCodelistKVs"
      },
      key: "linkCodelistKVs",
      width: 400
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      scopedSlots: {
        customRender: "action"
      }
    }
  ];

  import Vue from "vue";
  import CodeListKVs from "@/components/OptionView/CodeListKVs.vue";

  export default Vue.extend({
    name: "AddDiaTable",
    provide(): any {
      return {
        setTabSelect: this
      };
    },
    data() {
      return {
        columns,
        codeListKVs: [],
        kvsData: [] as any,
        activeIndex: "",
        delIndex: "",
        tableDataClone: {
          key: 1,
          index: 1,
          id: "",
          codeLabel: "",
          codeValue: "",
          linkCodelistKVs: []
        },
        tableData: [{
          key: 1,
          index: 1,
          id: "",
          codeLabel: "",
          codeValue: "",
          linkCodelistKVs: []
        }] as any,
        scrollY: {} as any,
        visible: false,
        id: "",
        name: "",
        record: {} as any,
      };
    },
    components: {
      CodeListKVs
    },
    created() {
      // this.getCodeListKVs();
    },
    watch: {
      kvsData(v) {
        let _obj = this.tableData.find((res: any) => {
          return res.index == this.activeIndex;
        });
        if (_obj) {
          _obj.linkCodelistKVs = v;
        }
        console.log(this.tableData);
      }
    },
    methods: {
      handleOk() {
        let index = this.delIndex;
        this.tableData.splice(
          this.tableData.findIndex((item: any) => item.index === index),
          1
        );
        this.tableData.forEach((res: any, i: any) => {
          res.index = i + 1;
          res.key = i + 1;
        });
        this.visible = false;
      },
      handleChange(value: any, key: any, column: any) {
        const newData = [...this.tableData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.tableData = newData;
        }
      },
      assRun(row: any, name ? : any) {
        this.record = row.codeListKVLinks || {};
        // console.log(this.tableData);
        this.activeIndex = row.index;
        (this.$refs.CodeListKVs as any).rowId = row.id || "";
        (this.$refs.CodeListKVs as any).showModal();
      },
      addRun(row: any) {
        let _obj = JSON.parse(JSON.stringify(this.tableDataClone));
        let length = this.tableData.length;
        _obj.key = length + 1;
        _obj.index = length + 1;
        this.tableData.push(_obj);
      },
      editRun(id: any, name ? : any) {},
      delRun(record: any) {
        this.name = record.codeLabel;
        this.delIndex = record.index;
        this.handleOk();
        // this.visible = true;
      },
      getCodeListKVs() {
        this.$api.control.getCodeListKVs().then((res: any) => {
          this.codeListKVs = res.data;
        });
      }
    }
  });
</script>

<style lang="scss">
</style>