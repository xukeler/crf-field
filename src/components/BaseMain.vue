<template>
  <div class="option-config-body">
    <div class="module-body">
      <div class="module-left">
        <div class="title">基础维护</div>
        <div class="search">
          <a-input v-model="searchVal" @pressEnter="search" class="search-input" placeholder="请输入">
            <span class="icon-body" slot="addonAfter" @click="search">
              <i class="iconfont icon-sousuo"></i>
            </span>
          </a-input>
        </div>
        <div class="module-items module-items2 scroll-wrapper" ref="wrapper">
          <section class="content">
            <div
              class="item"
              v-for="(item,i) in groupList"
              @click="getGroupTypeInfo(item,i)"
              :class="{'active':groupName == item.Menu_Name}"
              :style="{'display':(item.hideFlag ? 'none' : '')}"
              :key="i"
            >
              <span class="text">{{item.Menu_Name}}</span>
            </div>
          </section>
        </div>
      </div>
      <div class="module-right">
        <div class="module-info-body">
          <div class="search">
            <div></div>
            <a-button class="btn-sty2" @click="addRun()" v-show="countId!=3">
              <i class="iconfont icon-add"></i>新增
            </a-button>
          </div>
        </div>

        <div class="module-info-body" v-if="groupData && groupData.length > 0">
          <!-- <div class="search">
            <div></div>
            <a-button class="btn-sty2" @click="addRun()">
              <i class="iconfont icon-add"></i>新增
            </a-button>
          </div>-->
          <div class="module-table">
            <base-main-tabel :groupData="groupData"></base-main-tabel>
          </div>
        </div>
        <div class="nothing-body" v-else>
          <div class="nothing">
            <span class="iconfont icon-zanwumokuai"></span>
            <span class="text">暂无模块，请先创建</span>
          </div>
        </div>
      </div>
    </div>
    <base-main-dia :groupDicVal="groupDicVal" ref="BaseMainDia"></base-main-dia>
    <!-- <option-add-dia ref="OptionAddDia"></option-add-dia> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BaseMainTabel from "@/components/BaseMainView/BaseMainTabel.vue";
import BaseMainDia from "@/components/BaseMainView/BaseMainDia.vue";
import NEnum from "@/cmmon/NEnum";
import { setScroll } from "@/assets/public.ts";

export default Vue.extend({
  name: "OptionHome",
  data() {
    return {
      searchVal: "",
      groupName: "",
      groupDicVal: "",
      groupData: [],
      groupList: [] as any,
      scroll: null as any,
      countId: null as any
    };
  },
  components: {
    BaseMainTabel,
    BaseMainDia
  },
  created() {
    this.getDiseaseList();
    this.groupList = JSON.parse(localStorage.getItem("menuList") as any);
    this.groupName = this.groupList[0].Menu_Name;
    console.log(this.$uuid());
  },
  watch: {
    searchVal() {
      if (!this.searchVal) {
        this.getDiseaseList();
        this.groupList = JSON.parse(localStorage.getItem("menuList") as any);
        this.groupName = this.groupList[0].Menu_Name;
      }
    }
  },
  methods: {
    //获取疾病列表
    getDiseaseList() {
      this.$store.state.num = 1;
      this.$api.control.getDiseaseList().then((res: any) => {
        this.groupData = res.data;
        this.countId = 1;
        this.groupData.forEach((item: any, index: any) => {
          item.countId = 1;
        });
      });
    },
    //获取单位列表
    getUnitList() {
      this.$api.control.getUnitList().then((res: any) => {
        this.groupData = res.data;
        this.$store.state.num = 2;
        this.countId = 2;
        this.groupData.forEach((item: any, index: any) => {
          item.countId = 2;
        });
      });
    },
    //获取访视列表
    getVisitList() {
      let _params = {
        showAll: true
      };
      this.$api.control.getVisitList(_params).then((res: any) => {
        this.groupData = res.data;
        this.countId = 3;
        this.$store.state.num = 3;
        this.groupData.forEach((item: any, index: any) => {
          item.countId = 3;
        });
      });
    },
    //获取控件列表
    getWidget() {
      this.$api.control.getWidget().then((res: any) => {
        this.groupData = res.data;
        this.countId = 4;
        this.$store.state.num = 4;
        this.groupData.forEach((item: any, index: any) => {
          item.countId = 4;
        });
      });
    },
    search() {
      if (this.searchVal) {
        var name = this.searchVal;
        var _groupList = this.groupList;
        //初始化值
        this.groupName = "";
        this.groupData = [];
        this.groupList = [];
        _groupList.forEach((item: any, index: any) => {
          if (item.Menu_Name.indexOf(this.searchVal) != -1 && this.searchVal) {
            this.groupList.push(item);
            if (this.groupList[0].Menu_Name == "疾病领域") {
              this.getDiseaseList();
            } else if (this.groupList[0].Menu_Name == "单位") {
              this.getUnitList();
            } else if (this.groupList[0].Menu_Name == "访视类型") {
              this.getVisitList();
            } else if (this.groupList[0].Menu_Name == "控件类型") {
              this.getWidget();
            }
          }
        });
        this.groupName = this.groupList[0].Menu_Name;
      }
    },
    addRun(record?: any) {
      (this.$refs.BaseMainDia as any).showModal(record || "");
    },
    //回调
    backGetList(count: any) {
      if (count == 1) {
        this.getDiseaseList();
      } else if (count == 2) {
        this.getUnitList();
      } else if (count == 3) {
        this.getVisitList();
      } else if (count == 4) {
        this.getWidget();
      }
    },
    getGroupTypeInfo(item: any, i: any) {
      this.groupName = item.Menu_Name;
      if (item.Menu_Name == "疾病领域") {
        this.backGetList(1);
      } else if (item.Menu_Name == "单位") {
        this.backGetList(2);
      } else if (item.Menu_Name == "访视类型") {
        this.backGetList(3);
      } else if (item.Menu_Name == "控件类型") {
        this.backGetList(4);
      }
    }
  }
});
</script>

<style lang="scss">
</style>