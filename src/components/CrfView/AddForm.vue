<template>
  <div class="field-add-inner minhei">
    <div class="add-form">
      <a-form :form="form">
        <div class="form-control flex-row">
          <div class="control-label">
            课题编号
            <em>*</em>
          </div>
          <div class="control">
            <a-form-item>
              <a-input v-decorator="['subjectCode',{rules: [{ required: true, message: '请输入课题编号' }]}]"
                placeholder="请输入" />
            </a-form-item>
          </div>
        </div>
        <div class="form-control flex-row">
          <div class="control-label">项目名称</div>
          <div class="control">
            <a-form-item>
              <a-input v-decorator="['projectName',{rules: [{ required: false, message: '请输入一级标题' }]}]"
                placeholder="请输入一级标题" />
            </a-form-item>
            <a-form-item>
              <a-input v-decorator="['projectDetailed',{rules: [{ required: false, message: '请输入二级标题' }]}]"
                placeholder="请输入二级标题" />
            </a-form-item>
          </div>
        </div>
        <!-- <div class="form-control flex-row">
          <div class="control-label">项目名称详情</div>
          <div class="control">
            <a-form-item>
              <a-input v-decorator="['projectDetailed',{rules: [{ required: true, message: '请输入项目名称详情' }]}]"
                placeholder="请输入" />
            </a-form-item>
          </div>
        </div>-->
        <div class="form-control flex-row">
          <div class="control-label">
            课题名称
            <em>*</em>
          </div>
          <div class="control">
            <a-form-item>
              <a-input v-decorator="['subjectNameOne',{rules: [{ required: true, message: '请输入一级标题' }]}]"
                placeholder="请输入一级标题" />
            </a-form-item>
            <a-form-item>
              <a-input v-decorator="['subjectNameTwo',{rules: [{ required: false, message: '请输入二级标题' }]}]"
                placeholder="请输入二级标题" />
            </a-form-item>
          </div>
        </div>
        <div class="form-control flex-row">
          <div class="control-label">
            课题牵头/承担单位
            <em>*</em>
          </div>
          <div class="control">
            <a-form-item>
              <a-input v-decorator="['subjectOrganize',{rules: [{ required: true, message: '课题牵头/承担单位' }]}]"
                placeholder="请输入" />
            </a-form-item>
          </div>
        </div>
        <div class="form-control-bet">
          <div class="form-control flex-row">
            <div class="control-label">
              课题负责人
              <em>*</em>
            </div>
            <div class="control">
              <a-form-item>
                <a-input v-decorator="['subjectPeople',{rules: [{ required: true, message: '请输入课题负责人' }]}]"
                  placeholder="请输入" />
              </a-form-item>
            </div>
          </div>
          <div class="form-control flex-row">
            <div class="control-label">课题执行年限</div>
            <div class="control">
              <a-form-item>
                <a-input v-decorator="['subjectYear',{rules: [{ required: false, message: '请输入课题执行年限' }]}]"
                  placeholder="请输入" />
              </a-form-item>
            </div>
          </div>
        </div>
        <!-- <div class="form-control flex-row">
          <div class="control-label">课题负责人<em>*</em></div>
          <div class="control">
            <a-form-item>
              <a-input v-decorator="['subjectPeople',{rules: [{ required: true, message: '请输入课题负责人' }]}]"
                placeholder="请输入" />
            </a-form-item>
          </div>
        </div>-->
        <div class="form-control-bet">
          <div class="form-control flex-row">
            <div class="control-label">
              版本号
              <em>*</em>
            </div>
            <div class="control">
              <a-form-item>
                <a-input v-decorator="['version',{rules: [{ required: false, message: '课题牵头/承担单位' }]}]"
                  :disabled="true" />
              </a-form-item>
            </div>
          </div>
          <div class="form-control flex-row">
            <div class="control-label">
              版本日期
              <em>*</em>
            </div>
            <div class="control">
              <a-form-item>
                <a-date-picker :disabled="true" :disabledDate="disDate"
                  v-decorator="['verTime',{rules: [{ required: true, message: '请输入版本日期' }]}]" placeholder="请输入" />
                <!-- <a-input v-decorator="['verTime',{rules: [{ required: true, message: '请输入版本日期' }]}]"
                placeholder="请输入" />-->
              </a-form-item>
            </div>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";

  export default Vue.extend({
    name: "AddForm",
    data() {
      return {
        form: this.$form.createForm(this),
        defData: {
          subjectCode: "", //课题编号
          projectName: "", //项目名称
          projectDetailed: "", //项目名称详情
          subjectNameOne: "", //请输入一级标题
          subjectNameTwo: "", //请输入二级标题
          subjectOrganize: "", //课题牵头单位
          subjectPeople: "", //课题负责人
          subjectYear: "",
          version: "", //版本
          verTime: "" //版本日期
        } as any,
      };
    },
    props: ["projectId"],
    created() {
      this.getDefVal();
    },
    methods: {
      disDate(current: any) {
        return current && current > this.$moment().endOf("day");
      },
      getDefVal() {
        this.$nextTick(() => {
          const {
            form: {
              setFieldsValue
            }
          } = this;
          if (this.projectId) {
            let params = {
              projectId: this.projectId
            };
            const _then = this.$api.control
              .getProjectInfo(params)
              .then((res: any) => {
                let data = res.data;
                console.log(data.version)
                let _data = {
                  subjectCode: data.subject_Code, //课题编号
                  projectName: data.project_Name, //项目名称
                  projectDetailed: data.project_Detailed, //项目名称详情
                  subjectNameOne: data.subject_NameOne, //请输入一级标题
                  subjectNameTwo: data.subject_NameTwo, //请输入二级标题
                  subjectOrganize: data.subject_Organize, //课题牵头单位
                  subjectPeople: data.subject_People, //课题负责人
                  subjectYear: data.subject_Year || "",
                  version: data.version, //版本
                  verTime: this.$moment(data.verTime.split("T")[0]) //版本日期
                };
                this.defData = _data;
                setFieldsValue(this.defData);
              });
          } else {
            let defData = {
              version: "初稿",
              verTime: this.$moment()
            }
            setFieldsValue(defData);
          }
        })
      },
      showForm() {
        const {
          form: {
            validateFields
          }
        } = this;
        return new Promise(resolve => {
          validateFields((errors: any, values: any) => {
            if (!errors) {
              let parmas: any = this.form.getFieldsValue();
              if (this.projectId) {
                parmas.id = this.projectId;
                this.upProject(parmas).then((res: any) => {
                  console.log(res);
                  resolve(res);
                });
              } else {
                this.postProject(parmas).then((res: any) => {
                  console.log(res);
                  resolve(res);
                });
              }
            } else {
              resolve(false);
            }
          });
        });
        // console.log(this.form.getFieldsValue())
      },
      postProject(params: any) {
        const _then = this.$api.control.postProject(params).then((res: any) => {
          return res;
        });
        return _then;
      },
      upProject(params: any) {
        const _then = this.$api.control.upProject(params).then((res: any) => {
          return res;
        });
        return _then;
      }
    }
  });
</script>

<style lang="scss">
</style>