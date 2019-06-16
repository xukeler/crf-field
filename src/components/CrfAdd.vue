<template>
  <div class="field-add-body">
    <div class="step-body">
      <a-steps :current="current" size="small">
        <a-step title="填写项目信息"/>
        <a-step title="创建模块"/>
        <a-step title="创建访视"/>
        <a-step title="预览CRF"/>
      </a-steps>
    </div>
    <AddForm :projectId="projectId" v-if="current == 0" ref="addForm"></AddForm>
    <CrfModule :projectId="projectId" v-else-if="current == 1"></CrfModule>
    <CrfVisit :projectId="projectId" v-else-if="current == 2"></CrfVisit>
    <CrfControl :projectId="projectId" v-else-if="current == 3"></CrfControl>
    <!-- <CrfModule :projectId="projectId"></CrfModule> -->
    <div class="field-add-footer">
      <a-button ghost @click="to" v-if="current != 0">上一步</a-button>
      <a-button ghost @click="back" v-if="current == 0">返回项目</a-button>
      <a-button ghost @click="back" v-if="current == 3">完成项目</a-button>
      <a-button ghost @click="go" v-if="current != 3">下一步</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AddForm from "@/components/CrfView/AddForm.vue";
import CrfModule from "@/components/CrfView/CrfModule.vue";
import CrfVisit from "@/components/CrfView/CrfVisit.vue";
import CrfControl from "@/components/CrfView/CrfControl.vue";

export default Vue.extend({
  name: "CrfAdd",
  data() {
    return {};
  },
  components: {
    AddForm,
    CrfModule,
    CrfVisit,
    CrfControl
  },
  // mounted() {
  //   console.log(this.projectId);
  // },
  computed: {
    projectId(): any {
      if (this.$route.query.projectId) {
        let projectId = this.$route.query.projectId;
        return projectId;
      }
    },
    current(): number {
      if (this.$route.query.current) {
        let current = this.$route.query.current as any;
        return current * 1;
      } else {
        return 0;
      }
    }
  },
  methods: {
    back(e: any) {
      this.$router.push({
        name: "CrfHome"
      });
    },
    to(e: any) {
      let current = this.current - 1;
      this.goRoute(current);
    },
    go(e: any) {
      let cur = this.current;
      if (cur == 0) {
        (this.$refs.addForm as any).showForm().then((res: any) => {
          if (res) {
            let projectId = "";
            if (res.data) {
              let id = res.data.id;
              console.log(res);
              projectId = id;
            }
            let current = this.current + 1;
            this.goRoute(current, projectId);
          }
        });
      } else {
        let current = this.current + 1;
        this.goRoute(current);
      }
    },
    goRoute(current: any, projectId?: any) {
      this.$router.push({
        path: "/home/crfadd",
        query: {
          projectId: projectId || this.projectId,
          current: current
        }
      });
    }
  }
});
</script>

<style lang="scss">
</style>