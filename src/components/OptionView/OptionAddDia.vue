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
      :title="id ? '修改选项' : '新增选项'"
      :maskStyle="maskStyle"
      centered
      v-model="visible"
      @ok="handleOk"
    >
      <a-form class="option-form" :form="form">
        <div class="control-item_flex no-bet">
          <div class="control-item flex-row">
            <div class="label">
              代码
              <em>*</em>
            </div>
            <div class="control">
              <a-form-item>
                <a-input
                  v-decorator="['name',{rules: [{ required: true, message: '请输入code' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </div>
          </div>
          <div class="control-item flex-row">
            <div class="label">
              名称
              <em>*</em>
            </div>
            <div class="control">
              <a-form-item>
                <a-input
                  v-decorator="['remark_ZH',{rules: [{ required: true, message: '请输入名称' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </div>
          </div>
        </div>
      </a-form>
      <add-dia-table ref="AddDiaTable"></add-dia-table>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AddDiaTable from "@/components/OptionView/AddDiaTable.vue";

export default Vue.extend({
  name: "OptionAddDia",

  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      id: "",
      searchVal: "",
      maskStyle: {
        // backgroundColor: "rgba(0,0,0,.01)"
      },
    };
  },
  components: {
    AddDiaTable
  },
  methods: {
    showModal(id: any) {
      if (id) {
        this.id = id;
        this.getKvs();
      } else {
        this.id = "";
      }
      this.visible = true;
    },
    getKvs() {
      let codeId = this.id;
      let params = {
        codeListId: codeId
      };
      this.$api.control.getCodeInfo(params).then((res: any) => {
        let data = res.data;
        // console.log(res);
        let params = {
          name: data.codelist_Name,
          remark_ZH: data.remark_ZH
        };
        const {
          form: { setFieldsValue }
        } = this;
        setFieldsValue(params);
        let kvs = data.kVs;
        // console.log(kvs)
        if (kvs && kvs.length > 0) {
          let kvsArr = [] as any;
          kvs.forEach((item: any, i: any) => {
            let _json = {
              id: item.id,
              codeLabel: item.codeLabel,
              codeValue: item.codeValue,
              index: i + 1,
              key: i + 1,
              linkCodelistKVs: [] as any,
              codeListKVLinks: item,
            };
            let codeList = [] as any;
            let codeListKVLinks = item.codeListKVLinks;
            codeListKVLinks.forEach((item2: any, i2: any) => {
              let _cjson = {
                codeId: item2.codeListKV.id,
                codeLabel: item2.codeListKV.codeLabel,
                codeValue: item2.codeListKV.codeValue,
                parentName: item2.codeList.remark_ZH,
              };
              codeList.push(_cjson);
            });
            _json.linkCodelistKVs = codeList;
            kvsArr.push(_json);
          });
         
          (this.$refs.AddDiaTable as any).tableData = kvsArr;
        }
      });
    },
    handleOk(e: any) {
      let addCodeListKVInputModels = (this.$refs.AddDiaTable as any).tableData;
      console.log(addCodeListKVInputModels);
      let addCodeListArr = [] as any;
      addCodeListKVInputModels.forEach((res: any) => {
        let params = {
          id: res.id || "",
          codeLabel: res.codeLabel,
          codeValue: res.codeValue,
          linkCodelistKVs: []
        };
        let codeIfArr = [] as any;
        if (res.linkCodelistKVs && res.linkCodelistKVs.length > 0) {
          res.linkCodelistKVs.forEach((code: any) => {
            codeIfArr.push(code.codeId);
          });
        }
        params.linkCodelistKVs = codeIfArr;
        addCodeListArr.push(params);
      });
      const {
        form: { validateFields }
      } = this;
      validateFields((errors: any, values: any) => {
        if (!errors) {
          if (this.id) { // 修改
            let params = {
              id: this.id || "",
              name: values.name,
              remark_ZH: values.remark_ZH,
              editCodeListKVInputModels: addCodeListArr
            };
            this.patchCodeList(params);
          } else { // 保存
            let params = {
              // id: this.id || "",
              name: values.name,
              remark_ZH: values.remark_ZH,
              addCodeListKVInputModels: addCodeListArr
            };
            this.postCodeList(params).then((res: any) => {
              if ((this.$parent as any).getTableVal) {
                (this.$parent as any).getTableVal(res);
              }
            });
          }
          this.visible = false;
        }
      });
    },
    postCodeList(params: any) {
      const _then = this.$api.control.postCodeList(params).then((res: any) => {
        if ((this.$parent as any).getKvs) {
          (this.$parent as any).getCodeList(1); // 1添加
          // (this.$parent as any).getKvs();
        }
        return res.data;
      });
      return _then;
    },
    patchCodeList(params: any) {
      this.$api.control.patchCodeList(params).then((res: any) => {
          (this.$parent as any).getCodeList(2); // 2 修改
        // (this.$parent as any).getKvs();
      });
    }
  }
});
</script>

<style lang="scss"></style>