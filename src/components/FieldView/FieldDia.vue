<template>
  <div class="field-modal-body">
    <a-modal
      v-if="visible"
      class="field-modal"
      cancelText="取消"
      okText="保存"
      :maskClosable="false"
      :keyboard="false"
      :width="700"
      :title="id ? '修改' : '新增'"
      centered
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :form="form">
        <div class="control-item_flex">
          <div class="control-item flex-row">
            <div class="label">
              疾病领域
              <br>(Type)
              <em>*</em>
            </div>
            <div class="control">
              <a-form-item>
                <a-select
                  v-decorator="['diseaseId',{rules: [{ required: true, message: '请选择疾病领域' }]}]"
                  showSearch
                  placeholder="请选择"
                  notFoundContent="未找到内容"
                  optionFilterProp="children"
                >
                  <a-select-option
                    v-for="(item,i) in groupList"
                    :key="i"
                    :value="item.id"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>
          <div class="control-item flex-row">
            <div class="label">
              域名
              <br>(Domain)
              <em>*</em>
            </div>
            <div class="control">
              <a-form-item>
                <a-select
                  showSearch
                  v-decorator="['domainId',{rules: [{ required: true, message: '请选择域名' }]}]"
                  placeholder="请选择"
                  notFoundContent="未找到内容"
                  optionFilterProp="children"
                >
                  <a-select-option v-for="(item,i) in domainList" :key="i" :value="item.id">
                    {{ item.name }}
                    <template v-if="item.description">{{ `(${item.description})` }}</template>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>
        </div>
        <div class="control-item flex-row">
          <div class="label">
            CRF 问题描述
            <br>(Question Text)
            <em>*</em>
          </div>
          <div class="control control-long">
            <a-form-item>
              <a-input
                v-decorator="['questionText',{rules: [{ required: true, message: '请输入问题描述' }]}]"
                placeholder="请输入"
              />
            </a-form-item>
          </div>
        </div>
        <div class="control-item flex-row no-align">
          <div class="label">
            CRF 填写指南
            <br>(Completion instructions)
          </div>
          <div class="control control-long">
            <a-form-item>
              <a-textarea
                v-decorator="['completionInstructions',{rules: [{ required: false, message: '请输入填写指南' }]}]"
                placeholder="请输入"
                autosize
              />
            </a-form-item>
            <!-- <div class="remind">NA-不适用</div> -->
            <!-- <a-input placeholder="请输入" /> -->
          </div>
        </div>
        <!-- <div class="control-item flex-row">
          <div class="label">
            单位
            <br>(unit)
          </div>
          <div class="control control-long">
            <a-form-item>
              <a-select
                mode="multiple"
                v-decorator="['unitIds',{rules: [{ required: false, message: '请选择单位' }]}]"
                placeholder="请选择"
                notFoundContent="未找到内容"
                optionFilterProp="children"
              >
                <a-select-option
                  v-for="(item,i) in unitList"
                  :key="i"
                  :value="item.id"
                >{{ item.groupName }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div> -->
        <div class="control-item_flex">
          <div class="control-item flex-row">
            <div class="label">
              SDTM 变量
              <br>(SDTMIG Variable)
            </div>
            <div class="control">
              <a-form-item>
                <a-input
                  v-decorator="['sdtmig',{rules: [{ required: false, message: '请输入SDTM变量' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </div>
          </div>
          <div class="control-item flex-row">
            <div class="label">
              CDASHIG 变量
              <br>(CDASHIG Variable)
            </div>
            <div class="control">
              <a-form-item>
                <a-input
                  v-decorator="['cdashig',{rules: [{ required: false, message: '请输入CDASHIG变量' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </div>
          </div>
        </div>
        <div class="control-item_flex">
          <div class="control-item flex-row no-align">
            <div class="label">
              数据类型
              <br>(Data Type)
              <em>*</em>
            </div>
            <div class="control">
              <a-form-item>
                <a-select
                  showSearch
                  v-decorator="['dataType',{rules: [{ required: true, message: '请选择数据类型' }]}]"
                  placeholder="请选择"
                  @change="cgDataType"
                  notFoundContent="未找到内容"
                  optionFilterProp="children"
                >
                  <a-select-option
                    v-for="(item,i) in dataTypeList"
                    :key="i"
                    :value="item"
                  >{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
              <div class="btn-flex" v-if="form.getFieldValue('dataType') == 'option'">
                <span class="add-btn" @click="addOption">新增选项</span>
                <span class="add-btn" @click="selectOption">选择选项</span>
              </div>
            </div>
          </div>
          <div class="control-item flex-row">
            <div class="label">
              数据长度
              <br>(Data Length)
              <em>*</em>
            </div>
            <div class="control">
              <a-form-item>
                <a-input
                  v-decorator="['dataLength',{rules: [{required: true, message: '请输入数据长度' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </div>
          </div>
        </div>
          <div class="control-item flex-row" v-show="form.getFieldValue('dataType') == 'Num' || form.getFieldValue('dataType') == 'text'">
          <div class="label">
            单位
            <br>(unit)
          </div>
          <div class="control control-long">
            <a-form-item>
              <a-select
                mode="multiple"
                v-decorator="['unitIds',{rules: [{ required: false, message: '请选择单位' }]}]"
                placeholder="请选择"
                notFoundContent="未找到内容"
                optionFilterProp="children"
              >
                <a-select-option
                  v-for="(item,i) in unitList"
                  :key="i"
                  :value="item.id"
                >{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
        </div>
        <div
          class="control-item flex-row"
          v-if="form.getFieldValue('dataType') == 'option' && tableVal"
        >
          <div class="label"></div>
          <div class="control control-long flex-row">
            <FieldTableDia :tableVal="tableVal"></FieldTableDia>
          </div>
        </div>
        <div class="control-item flex-row">
          <div class="label">
            备注
            <br>(remark)
          </div>
          <div class="control control-long">
            <a-form-item>
              <a-textarea
                v-decorator="['remark',{rules: [{ required: false, message: '请输入备注' }]}]"
                placeholder="请输入"
                autosize
              />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </a-modal>
    <option-dia ref="OptionDia" v-if="form.getFieldValue('dataType') == 'option'"></option-dia>
    <option-add-dia ref="OptionAddDia" v-if="form.getFieldValue('dataType') == 'option'"></option-add-dia>
  </div>
</template>

<script lang="ts">
import FieldTableDia from "@/components/FieldView/FieldTableDia.vue";
import OptionDia from "@/components/OptionView/OptionDia.vue";
import OptionAddDia from "@/components/OptionView/OptionAddDia.vue";
import Vue from "vue";

export default Vue.extend({
  name: "FieldDia",
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      tableVal: "",
      id: "",
      unitList: [],
      postData: {
        cdashig: "",
        cdashigLable: null,
        codelistName: null,
        completionInstructions: null,
        dataLength: "",
        dataType: "",
        decimalPosition: null,
        domainId: "",
        diseaseId: "",
        maxNum: null,
        minNum: null,
        orderNumber: null,
        prompt: null,
        questionText: "",
        questionTextEN: null,
        remark: "",
        sdtmig: "",
        unitIds: [],
        // codeListId: ""
      } as any
    };
  },
  props: ["dataTypeList", "domainList", "groupList"],
  components: {
    FieldTableDia,
    OptionDia,
    OptionAddDia
  },
  watch: {
    visible(v) {
      if (v) {
        this.getUnit();
      } else {
        this.postData.codelistName = "";
        this.tableVal = "";
        this.id = "";
      }
      if(!this.visible){
        (this.$parent  as any).correntChange()
      }
    }
  },
  methods: {
    cgDataType(v: any) {
      if (v != "option") {
        this.postData.codelistName = "";
      }
    },
    addOption() {
      (this.$refs.OptionAddDia as any).showModal();
    },
    getTableVal(res: any) {
      this.postData.codelistName = res.id;
      this.tableVal = res.kvs || res.kVs;
    },
    selectOption() {
      (this.$refs.OptionDia as any).showModal();
    },
    showModal() {
      this.visible = true;
    },
    getUnit() {
      // let params = {
      //   // groupDicVal: 2 //1疾病领域 2单位 3访视类型
      //   groupDicVal: '9ef7347f-2751-44ca-9ede-4660037c15d7',

      // };
      const _then = this.$api.control
        .getUnitList()
        .then((res: any) => {
          this.unitList = res.data;
        });
      return _then;
    },
    handleOk(e: any) {
      const {
        form: { validateFields }
      } = this;
      validateFields((errors: any, values: any) => {
        if (!errors) {
          for (let key in values) {
            if (key == "dataLength") {
              values[key] = values[key] * 1;
            }
            this.postData[key] = values[key];
          }
          if (this.id) {
            this.updateField().then(() => {
              this.visible = false;
            });
          } else {
            this.postField().then(() => {
              this.visible = false;
            });
          }
        }
      });
    },
    getDefVal(record: any) {
      let params = {
        fieldId: record.id
      };
      this.$api.control.getFieldInfo(params).then((res: any) => {
        console.log(res)
        let data = res.data;
        this.id = data.id;
        let unitIdsArr = [] as any;
        let codeList = data.codeList;
        if (data.field_Unit_Maps.length > 0) {
          data.field_Unit_Maps.forEach((res: any) => {
            if (res.unit) {
              unitIdsArr.push(res.unit.id);
            }
          });
        }
        if (codeList) {
          this.getTableVal(codeList);
        }
        let _json = {
          diseaseId: data.diseaseId || "",
          domainId: data.domainId || "",
          questionText: data.question_Text || "",
          completionInstructions: data.completion_Instructions || "",
          sdtmig: data.sdtmig || "",
          cdashig: data.cdashig || "",
          dataType: data.dataType || "",
          dataLength: data.dataLength || "",
          unitIds: unitIdsArr || [],
          remark: data.remark || ""
        };
        const {
          form: { setFieldsValue }
        } = this;
        setFieldsValue(_json);
      });
    },
    postField() {
      let params = this.postData;
      const _then = this.$api.control.postField(params).then((res: any) => {
        (this.$parent as any).getField();
      });
      return _then;
    },
    updateField() {
      let params = this.postData;
      params.id = this.id;
      const _then = this.$api.control.updateField(params).then((res: any) => {
        (this.$parent as any).getField();
      });
      return _then;
    }
  }
});
</script>

<style lang="scss">
</style>