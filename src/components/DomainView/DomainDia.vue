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
        <div class="control-item_flex">
          <div class="control-item flex-row">
            <div class="label">
              名称
              <em>*</em>
            </div>
            <div class="control control-long">
              <a-form-item>
                <a-input
                  v-decorator="['description_EN',{rules: [{required: true, message: '请输入名称' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </div>
          </div>
          <div class="control-item flex-row">
            <div class="label">
              简称
              <em>*</em>
            </div>
            <div class="control control-long">
              <a-form-item>
                <a-input
                  v-decorator="['name',{rules: [{required: true, message: '请输入简称' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </div>
          </div>
        </div>
        <div class="control-item flex-row">
          <div class="label">中文名</div>
          <div class="control control-long">
            <a-form-item>
              <a-input
                v-decorator="['description',{rules: [{required: false, message: '请输入中文名' }]}]"
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
                v-decorator="['name_Description',{rules: [{required: false, message: '请输入说明' }]}]"
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
  name: "FieldDia",
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
    showModal(id?: any, parentId?: any) {
      if (parentId) {
        this.parentId = parentId;
      } else {
        this.parentId = null;
      }
      if (id) {
        this.id = id;
        this.getDomainInfo();
      } else {
        this.id = "";
      }
      this.visible = true;
    },
    showModalTwo(id?: any) {
      this.id = "";
      if (id) {
        this.parentId = id;
      } else {
        this.parentId = null;
      }
      this.visible = true;
    },
    postDomain(params: any): any {
      const _then = this.$api.control.postDomain(params).then((res: any) => {
        return res;
      });
      return _then;
    },
    patchDomain(params: any): any {
      const _then = this.$api.control.patchDomain(params).then((res: any) => {
        return res;
      });
      return _then;
    },
    getDomainInfo() {
      let params = {
        domainId: this.id
      };
      this.$api.control.getDomainInfo(params).then((res: any) => {
        let data = res.data;
        let _json = {
          description_EN: data.description_EN,
          name: data.name || "",
          description: data.description || "",
          name_Description: data.name_Description || ""
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
          console.log(values);
          let params = {
            name: values.name || "",
            description: values.description || "",
            name_Description: values.name_Description || "",
            description_EN: values.description_EN || "",
            target_Name: this.targetName || "",
            parentId: this.parentId,
            domainTypeId:this.targetName||''
          } as any;
          if (this.id) {
            params.id = this.id;
            this.patchDomain(params).then(() => {
              (this.$parent as any).getDomainInfo();
              this.visible = false;
            });
          } else {
            console.log(params);
            this.postDomain(params).then(() => {
              (this.$parent as any).getDomainInfo();
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