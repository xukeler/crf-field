<template>
  <div class="option-modal-body">
    <a-modal
      v-if="visible"
      class="field-modal"
      cancelText="取消"
      okText="保存"
      :maskClosable="false"
      :keyboard="false"
      :width="800"
      :title="'添加选项'"
      centered
      v-model="visible"
      @ok="handleOk"
    >
      <!-- <a-button class="btn-sty2 option-modal-btn" @click="addOption">
        <i class="iconfont icon-add"></i>新增选项
      </a-button>-->
      <div class="option-search">
        <a-input v-model="searchVal" @pressEnter="search" placeholder="请输入您要查找的关键字">
          <span class="icon-body" slot="addonAfter" @click="search">
            <i class="iconfont icon-sousuo"></i>
          </span>
        </a-input>
      </div>
      <option-dia-table ref="OptionDiaTable" :tagName = 'tagName'></option-dia-table>
    </a-modal>
    <!-- <OptionAddDia ref="optionAddDia"></OptionAddDia> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OptionDiaTable from "@/components/OptionView/OptionDiaTable.vue";
// import OptionAddDia from "@/components/OptionView/OptionAddDia.vue";

export default Vue.extend({
  name: "OptionDia",
  data() {
    return {
      visible: false,
      searchVal: "",
      tagName:"",
    };
  },
  components: {
    OptionDiaTable
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e: any) {
      let tableData = (this.$refs.OptionDiaTable as any).getFieldDiaData();
      if ((this.$parent as any).getTableVal) {
        (this.$parent as any).getTableVal(tableData);
      }
      this.visible = false;
    },
    search() {
      // let val = this.searchVal;
      // let _obj = {
      //   tagName: val
      // };
      // (this.$refs.OptionDiaTable as any).getCodeListPage(_obj);
      this.tagName = this.searchVal;
    }
    // addOption() {
    //   (this.$refs.optionAddDia as any).showModal();
    // }
  }
});
</script>

<style lang="scss">
</style>