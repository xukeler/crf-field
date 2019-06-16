<template>
  <div class="field-modal-body">
    <a-modal
      v-if="visible"
      class="field-modal"
      cancelText="取消"
      okText="保存"
      :maskClosable="false"
      :keyboard="false"
      :width="800"
      :title="id ? '修改' : (parentId ? '新增子集' : '新增')"
      centered
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :form="form">
        <div class="control-item flex-row">
          <div class="label">
            分类
            <em>*</em>
          </div>
          <div class="control control-long">
            <a-form-item>
              <a-input
                v-decorator="['name',{rules: [{required: true, message: '请输入名称' }]}]"
                placeholder="请输入"
              />
            </a-form-item>
          </div>
        </div>
        <div class="control-item flex-row">
          <div class="label">说明</div>
          <div class="control control-long">
            <a-form-item>
              <a-textarea
                v-decorator="['description',{rules: [{required: false, message: '请输入说明' }]}]"
                placeholder="请输入"
                autosize
              />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "DomainOptDia",
  props: ["targetName"],
  data() {
    return {
      id: "",
      form: this.$form.createForm(this),
      visible: false,
      parentId: null as any
    };
  },
  methods: {
    showModal(id?: any) {
      console.log(id)
      if (id) {
        this.id = id;
        this.getTargetInfo();
      } else {
        this.id = "";
      }
      this.visible = true;
    },
    postTarget(params: any): any {
      const _then = this.$api.control.postTarget(params).then((res: any) => {
        return res;
      });
      return _then;
    },
    patchTarget(params: any): any {
      const _then = this.$api.control.patchTarget(params).then((res: any) => {
        return res;
      });
      return _then;
    },
    getTargetInfo() {
      let params = {
        domainTypeId: this.id
      };
      this.$api.control.getTargetInfo(params).then((res: any) => {
        let data = res.data;
        let _json = {
          name: data.name || "",
          description: data.description || ""
        };
        const {
          form: { setFieldsValue }
        } = this;
        setFieldsValue(_json);
      });
    },
    handleOk() {
      const {
        form: { validateFields }
      } = this;
      validateFields((errors: any, values: any) => {
        if (!errors) {
          console.log(this.id);
          let params = {
            name: values.name || "",
            description: values.description || ""
          } as any;
          if (this.id) {
            params.id = this.id;
            this.patchTarget(params).then(() => {
              (this.$parent as any).getDomainTab(2);
              (this.$parent as any).getTargetInfo();
              this.visible = false;
            });
          } else {
            console.log(params);
            this.postTarget(params).then(() => {
              (this.$parent as any).getDomainTab(1);
              this.visible = false;
            });
          }
        }
      });
    }
  }
});
</script>

<style lang="scss">
</style>