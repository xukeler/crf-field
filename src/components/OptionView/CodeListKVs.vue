<template>
  <div class="option-modal-body">
    <a-modal
      v-if="visible"
      class="field-modal"
      cancelText="取消"
      okText="保存"
      :maskClosable="false"
      :keyboard="false"
      :maskStyle="maskStyle"
      :width="800"
      :title="'关联选项'"
      centered
      v-model="visible"
      @ok="handleOk"
    >
      <div class="option-search">
        <a-input v-model="searchVal" @pressEnter="search" placeholder="请输入您要查找的关键字">
          <span class="icon-body" slot="addonAfter" @click="search">
            <i class="iconfont icon-sousuo"></i>
          </span>
        </a-input>
      </div>
      <code-listKVs-table ref="CodeListKVsTable" :tagName="tagName"></code-listKVs-table>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CodeListKVsTable from "@/components/OptionView/CodeListKVsTable.vue";

export default Vue.extend({
  name: "CodeListKVs",
  data() {
    return {
      visible: false,
      tagName: "",
      maskStyle: {
        backgroundColor: "rgba(0,0,0,.01)"
      } as any,
      rowId: "",
      id: "",
      searchVal: ""
    };
  },
  components: {
    CodeListKVsTable
  },
  methods: {
    showModal(id?: any) {
      if (id) {
        this.id = id;
        this.maskStyle = {};
      } else {
        this.id = "";
      }
      this.visible = true;
    },
    handleOk(e: any) {
      if (this.id) {
        let selectedRowKeys = (this.$refs.CodeListKVsTable as any)
          .selectedRowKeys;
        let params = {
          codeListKVId: this.id,
          linkCodeListIds: selectedRowKeys
        };
        this.postLinkCodeListKV(params);
      } else {
        (this.$parent as any).kvsData = (this.$refs
          .CodeListKVsTable as any).getPostData();
      }
      this.visible = false;
      // (this.$refs.CodeListKVsTable as any).selectedRowKeys
    },
    postLinkCodeListKV(params: any) {
      this.$api.control.postLinkCodeListKV(params).then((res: any) => {
        (this.$parent as any).upData();
        console.log(res);
      });
    },
    search() {
      this.tagName = this.searchVal;
    }
  }
});
</script>

<style lang="scss">
</style>