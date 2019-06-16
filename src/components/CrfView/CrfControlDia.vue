<template>
  <div class="module-modal-body">
    <a-modal
      class="field-modal module-modal"
      cancelText="取消"
      okText="确认"
      :maskClosable="false"
      :keyboard="false"
      :width="410"
      :title="title"
      centered
      v-model="visible"
      @ok="handleOk"
    >
      <div class="text">
        <p>{{txt}}<span class='version'> {{version}} </span>?</p>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CrfControlDia",
  data() {
    return {
      visible: false,
      txt:'',
      title:'',
      version:1.0,
    };
  },
  methods: {
    showModal(params:any) {
      this.title = params.title;
      this.txt = params.txt;
      this.version = params.version;
      this.visible = true;
    },
    handleOk(e: any) {
      console.log(e);
      (this.$parent as any).setVersion();
      this.visible = false;
    }
  }
});
</script>

<style lang="scss">
</style>