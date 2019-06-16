<template>
  <div id="app">
    <a-spin class="loading" v-if="loading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin/>
    </a-spin>
    <a-locale-provider :locale="locale">
      <router-view/>
    </a-locale-provider>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { mapGetters } from "vuex";
export default {
  name: "app",
  data() {
    return {
      locale: zhCN
    };
  },
  computed: {
    ...mapGetters({
      loading: "getLoading"
    })
  },
  beforeCreate() {
    if (!window.localStorage["logintoken"]) {
      // console.log(1);
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss">
</style>