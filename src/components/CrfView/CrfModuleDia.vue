<template>
  <div class="module-modal-body">
    <a-modal
      class="field-modal module-modal"
      cancelText="取消"
      okText="确认"
      :maskClosable="false"
      :keyboard="false"
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
import Vue from "vue";

export default Vue.extend({
  name: "CrfModuleDia",
  data() {
    return {
      visible: false,
      name: "",
      nowModuleId: ""
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e: any) {
      console.log(e);
      (this.$parent as any).delMenu(this.nowModuleId);
      this.visible = false;
    }
  }
});
</script>

<style lang="scss">
</style>