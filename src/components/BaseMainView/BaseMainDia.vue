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
      :title="id ? '修改' : '新增'"
      centered
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :form="form">
        <div class="control-item flex-row">
          <div class="label">
            名称
            <em>*</em>
          </div>
          <div class="control control-long">
            <a-form-item>
              <a-input
                v-decorator="['groupName',{rules: [{required: true, message: '请输入名称' }]}]"
                placeholder="请输入"
              />
            </a-form-item>
          </div>
        </div>
        <div class="control-item flex-row">
          <div class="label">说明</div>
          <div class="control control-long">
            <a-form-item>
              <a-input
                v-decorator="['value',{rules: [{required: false, message: '请输入值' }]}]"
                placeholder="请输入"
              />
            </a-form-item>
          </div>
        </div>
        <div class="control-item flex-row">
          <div class="label">备注</div>
          <div class="control control-long">
            <a-form-item>
              <a-input
                v-decorator="['remark',{rules: [{required: false, message: '请输入备注' }]}]"
                placeholder="请输入"
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
  props: ["groupDicVal"],
  data() {
    return {
      id: "",
      form: this.$form.createForm(this),
      visible: false,
      record: null as any
    };
  },
  methods: {
    showModal(record?: any) {
      this.visible = true;
      this.record = record;
      if (record) {
        this.id = record.id;
        let _json = {
          groupName: record.name,
          value: record.description,
          remark: record.remark
        };
        const {
          form: { setFieldsValue }
        } = this;
        setTimeout(() => {
          setFieldsValue(_json);
        }, 0);
      } else {
        this.id = "";
      }
    },
    handleOk() {
      const {
        form: { validateFields }
      } = this;
      validateFields((errors: any, values: any) => {
        if (!errors) {
          this.visible = false;
          let params = {
            name: values.groupName || "",
            description: values.value || "",
            remark: values.remark || "",
            id: this.record.id || ""
          } as any;
          if (this.id) {
            if (this.record.countId == 1) {
              this.$api.control.editDisease(params).then((res: any) => {
                (this.$parent as any).backGetList(this.record.countId);
              });
            } else if (this.record.countId == 2) {
              this.$api.control.editUnit(params).then((res: any) => {
                (this.$parent as any).backGetList(this.record.countId);
              });
            } else if (this.record.countId == 4) {
              this.$api.control.editWidget(params).then((res: any) => {
                (this.$parent as any).backGetList(this.record.countId);
              });
            }
          } else {
            let _params = {
            name: values.groupName || "",
            description: values.value || "",
            remark: values.remark || "",
          } as any;
            let _num=this.$store.state.num
            if(_num==1){
                this.$api.control.addDisease(_params).then((res:any)=>{
                    (this.$parent as any).backGetList(1);
                })
            }else if(_num==2){
              this.$api.control.addUnit(_params).then((res:any)=>{
                    (this.$parent as any).backGetList(2);
                })
            }else if(_num==4){
              this.$api.control.addWidget(_params).then((res:any)=>{
                    (this.$parent as any).backGetList(4);
                })
            }
          }
        }
      });
    }
  }
});
</script>

<style lang="scss">
</style>