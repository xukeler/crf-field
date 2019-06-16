<template>
  <div class="home-body">
    <div class="nav-body">
      <div class="nav">
        <div
          v-for="(item,index) in menuList"
          :key="index"
          class="nav-menu_item"
          @click="cgNav(item.Menu_Url)"
          :class="{active:$route.meta[0] == item.Menu_Url}"
        >
          <span :class="'iconfont'+' '+item.Icon"></span>
          <span class="text">{{item.Menu_Name}}</span>
        </div>
        <!-- <div
          class="nav-menu_item"
          @click="cgNav('project')"
          :class="{active:$route.meta[0] == 'crf'}"
        >
          <span class="iconfont icon-xiangmu"></span>
          <span class="text">项目CRF配置</span>
        </div>-->
        <!-- <div
          class="nav-menu_item"
          @click="cgNav('field')"
          :class="{active:$route.meta[0] == 'FieldConf'}"
        >
          <span class="iconfont icon-ziduanliebiao"></span>
          <span class="text">字段配置</span>
        </div>
        <div
          class="nav-menu_item"
          @click="cgNav('option')"
          :class="{active:$route.meta[0] == 'option'}"
        >
          <span class="iconfont icon-ziduanliebiao"></span>
          <span class="text">选项配置</span>
        </div>
        <div
          class="nav-menu_item"
          @click="cgNav('BaseMain')"
          :class="{active:$route.meta[0] == 'BaseMain'}"
        >
          <span class="iconfont icon-ziduanliebiao"></span>
          <span class="text">基础维护</span>
        </div>
        <div
          class="nav-menu_item"
          @click="cgNav('domain')"
          :class="{active:$route.meta[0] == 'domain'}"
        >
          <span class="iconfont icon-ziduanliebiao"></span>
          <span class="text">域名配置</span>
        </div>-->
      </div>
      <div class="nav-menu flex-row">
        <img src alt>
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" href="#">
            PM
            <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="logOff">退出</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <div class="main-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "home",
  components: {},
  data() {
    return {
      clickType: "project",
      menuList: []
    };
  },
  methods: {
    cgNav(v: string) {

      if (v != "/home/crf") {
        if (v == this.$route.path) {
          window.location.reload();
          return false;
        }
      }
      this.clickType = v;
      if (v == "/home/crf") {
        this.$router.push({
          name: "CrfHome"
        });
      } else if (v == "/home/field") {
        this.$router.push({
          name: "FieldConf"
        });
      } else if (v == "/home/option") {
        this.$router.push({
          name: "OptionHome"
        });
      } else if (v == "/home/basemain") {
        this.$router.push({
          name: "BaseMain"
        });
      } else if (v == "/home/domain") {
        this.$router.push({
          name: "DomainHome"
        });
      }
      // if (v == "project") {
      //   this.$router.push({
      //     name: "CrfHome"
      //   });
      // } else if (v == "field") {
      //   this.$router.push({
      //     name: "FieldConf"
      //   });
      // } else if (v == "option") {
      //   this.$router.push({
      //     name: "OptionHome"
      //   });
      // } else if (v == "BaseMain") {
      //   this.$router.push({
      //     name: "BaseMain"
      //   });
      // } else if (v == "domain") {
      //   this.$router.push({
      //     name: "DomainHome"
      //   });
      // }
    },
    logOff() {
      window.localStorage["logintoken"] = "";
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("menuList");
      location.reload();
      this.$router.push({
        name: "Login"
      });
    },
    getMenu() {
      let params = {
         userTokenId: window.localStorage.logintoken,

        sysId: "8"
      };
      this.$api.control.GetWebMenu(params).then((res: any) => {
        this.menuList = res.Data;
        localStorage['menuList']=JSON.stringify(res.Data[3].MenuList);
      });
    }
  },
  mounted() {
    this.getMenu();
  }
});
</script>