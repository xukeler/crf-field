<template>
  <div class="module-modal-body">
    <a-modal class="field-modal visit-modal" cancelText="取消" okText="确定" :maskClosable="false" :keyboard="false"
      :width="410" :title="varType.stype ? varType.stype : '新增'" centered v-model="visible" @ok="handleOk"
      :class='{"visit-modal2": varType.stype!="复制"}'>
      <div class="text" v-if="varType.stype=='删除' || varType.stype=='删除模块'">
        是否确认删除
        <span class="text-bold">{{ varType.name }}</span>
      </div>
      <div class="control" v-else>
        <a-form :form="form">
          <section class='form-block'>
            <div class="label form-label">
              访视名称
              <em>*</em>
            </div>
            <a-form-item class='form-input'>
              <a-input v-decorator="['val',{rules: [{ required: true, message: '请输入名称!' }]}]" placeholder="请输入" />
            </a-form-item>
          </section>

          <section class='form-block' v-show='varType.stype!="复制"'>
            <div class="label form-label">
              访视类型
              <em>*</em>
            </div>
            <a-form-item class='form-input'>
              <a-select v-decorator="['typeId',{rules: [{ required: true, message: '请选择类型!' }]}]" placeholder="请选择">
                <a-select-option v-for='(item,i) in visitList' :key='i' :value="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </section>

        </a-form>
        <!-- <section class='form-block'>
          <span class='form-label'>访视名称:</span>
          <a-input v-model="val" placeholder="请输入名称" />
        </section>
        <section class='form-block' v-if='varType.stype!="复制"'>
          <span class='form-label'>访视类型:</span>
          <a-select placeholder='请选择' v-model="typeId">
            <a-select-option v-for='(item,index) in params' :key='index' :value="item.id">{{item.groupName}}
            </a-select-option>
          </a-select>
        </section> -->
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    name: "CrfVisitDia",
    props: ['projectId'],
    data() {
      return {
        visible: false,
        varType: {} as any,
        val: "",
        typeId: '',
        form: this.$form.createForm(this),
        visitList:[],
      };
    },
    created(){
      this.getVisitListOnly()
    },
    methods: {
      //获取访视列表过滤
      getVisitListOnly(){
        let _params={
         projectId:this.projectId
        }
        this.$api.control.getvisitListOnly(_params)
          .then((res: any) => {
            this.visitList = res.data;
          });
      },
      showModal(varType: any,val:any) {
        this.visible = true;
         this.$nextTick(() => {
        const {
          form: {
            setFieldsValue
          }
        } = this;
        let defData = {
          val: '',
          typeId: ''
        }
        if (varType.stype) {
          this.varType = varType;
          // this.val = varType.name;
          // this.typeId = varType.visitType;
          defData = {
            val: varType.name,
            typeId: val ||''
          }
         setFieldsValue(defData);
        } else {
          this.varType = "新增";
          this.form.resetFields()
        }

         })
      },
      handleOk(e: any) {
        this.form.validateFields((err: any, values: any) => {
          if (!err) {
            // if (this.val) {
              if (this.varType.stype) {
                let type = this.varType.stype;
                if (type == "复制") {
                  let oldVisitId = this.varType.oldVisitId;
                  let params = {
                    visitId: oldVisitId,
                    visitName: values.val,
                  };
                  (this.$parent as any).copyVisit(params);
                } else if (type == "修改") {
                  let oldVisitId = this.varType.oldVisitId;
                  let params = {
                    visitId: oldVisitId,
                    visitName: values.val,
                    visitType: values.typeId, //
                  };
                  (this.$parent as any).cgName(params);
                } else if (type == "删除") {
                  let oldVisitId = this.varType.oldVisitId;
                  let params = {
                    visitId: oldVisitId
                  };
                  (this.$parent as any).delVisit(params);
                } else if (type == "删除模块") {
                  let moduleId = this.varType.moduleId;
                  let visitId = this.varType.visitId;
                  let params = {
                    moduleId: moduleId,
                    visitGroupId: visitId,
                    // visitId: visitId,
                  };
                  (this.$parent as any).delVisitModule(params);
                }
              } else {
                (this.$parent as any).postVisit(values.val, values.typeId);
              }
              this.visible = false;
            }

          // }
        });
      },
    }
  });
</script>

<style lang="scss">
</style>