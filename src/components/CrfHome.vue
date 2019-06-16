<template>
  <div class="field-config-body">
    <a-modal
      class="field-modal visit-modal"
      cancelText="取消"
      okText="确定"
      :maskClosable="false"
      :keyboard="false"
      :width="410"
      title="删除"
      centered
      v-model="mainVisible"
      @ok="setOk"
    >
      <div class="text">
        是否确认删除
        <span class="text-bold">{{ nowName }}</span>
      </div>
    </a-modal>
    <div class="crf-body">
      <div class="field-top flex-row">
        <div class="title">项目CRF配置</div>
      </div>
      <div class="field-search flex-row">
        <div class="search">
          <a-input v-model="searchVal" @pressEnter="search" placeholder="请输入您要查找的关键字">
            <span class="icon-body" slot="addonAfter" @click="search">
              <i class="iconfont icon-sousuo"></i>
            </span>
          </a-input>
        </div>
      </div>
      <div class="field-search flex-row">
        <div class="btn-group">
          <a-button class="btn-sty2" @click="addProject()">
            <i class="iconfont icon-add"></i>添加项目
          </a-button>
        </div>
      </div>
      <div class="crf-home">
        <template v-if="projectData && projectData.length > 0">
          <a-row :gutter="30">
            <a-col
              v-for="(item,i) in projectData"
              @click="addProject(item.id)"
              :key="i"
              class="gutter-row"
              :span="6"
            >
              <div class="crf-config-item flex-row">
                <div class="inner">
                  <div class="inner-top flex-row">
                    <div class="title" :title='item.subject_NameOne'>{{ item.subject_NameOne }}</div>
                    <!-- <p class="info">研究基本信息：{{ item.project_Name }}</p> -->
                    <p class="info">课题牵头/承担单位：{{ item.subject_People }}</p>

                    <div class="p-flex">
                      <!-- <p class="info">研究发起人：{{ item.subject_People }}</p>
                      <p class="info">版本号：{{ item.version }}</p> -->
                      <p class="info" >版本号：<span style='color:#548FF3'>{{ item.version }}</span></p>
                       <p class="info">{{ item.verTime.split(' ')[0] }}</p>
                    </div>
                    <div class="del" @click.stop="delProject(item.id,item.subject_NameOne)">
                      <span class="iconfont icon-delete"></span>
                    </div>
                  </div>
                  <div class="inner-footer flex-row">
                    <span class="text name">创建者：{{ item.create_User }}</span>
                    <span class="text time">{{ item.create_Time.split(' ')[0] }}</span>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CrfHome",
  data() {
    return {
      projectData: [],
      mainVisible: false,
      searchVal: "",
      nowName: "",
      nowProject: ""
    };
  },
  created() {
    this.getProject();
  },
  methods: {
    setOk() {
      let params = {
        projectId: this.nowProject
      };
      this.$api.control.delProject(params).then((res: any) => {
        if (res.result == 1) {
          this.getProject();
        }
      });
      this.mainVisible = false;
    },
    getProject(params?: any) {
      this.$api.control.getProject(params).then((res: any) => {
        this.projectData = res.data;
      });
    },
    search(e: any) {
      let params: any = {
        projectName: this.searchVal
      };
      this.getProject(params);
    },
    addProject(e: any) {
      this.$router.push({
        path: "/home/crfadd",
        query: {
          projectId: e
        }
      });
    },
    delProject(id: any, name: any) {
      this.nowProject = id;
      this.nowName = name;
      this.mainVisible = true;
    }
  }
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1366px) {
  .crf-body {
    width: 900px;

    .ant-col-6 {
      width: 33%;
    }
  }
}
</style>