<template>
  <div class="option-config-body">
    <div class="module-body">
      <div class="module-left">
        <div class="title hasBtn">
          分类
          <a-button class="btn-sty2" @click="addDomainClass()">添加分类</a-button>
        </div>
        <div class="samll-title">
          <span>版本V1.0</span>
          <i class="iconfont icon-add_xinzeng add"></i>
        </div>
        <div class="search">
          <a-input v-model="searchVal" @pressEnter="search" class="search-input" placeholder="请输入">
            <span class="icon-body" slot="addonAfter" @click="search">
              <i class="iconfont icon-sousuo"></i>
            </span>
          </a-input>
        </div>
        <div class="module-items module-items2 scroll-wrapper" ref='wrapper'>
          <div class="content">
            <div class="item" @click="getDomainInfo(item.id)" :class="{'active':targetName == item.id}"
              v-for="(item,i) in domainTabList" :key="i" :style="{'display':(item.hideFlag ? 'none' : '')}">
              <span class="text">
                <span>{{ item.name }}</span>
              </span>
              <a-dropdown @click.native.stop overlayClassName="module-dropdown" :trigger="['click']">
                <div class="ant-dropdown-link">
                  <span class="iconfont icon-shezhi"></span>
                </div>
                <a-menu slot="overlay">
                  <a-menu-item @click="delRun(item.id,item.name)">
                    <span>删除</span>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="module-right">
        <div class="module-info-body" v-if="tableVal">
          <div class="class-body">
            <p class="class-info">
              分类:
              <span>{{ targetInfo.name }}</span>
            </p>
            <p class="class-info">
              说明:
              <span>{{ targetInfo.description }}</span>
            </p>
            <span class="edit">
              <i class="iconfont icon-bianji" @click="editDomainClass"></i>
            </span>
          </div>
          <div class="search">
            <div class="title_big">域名(Domain)列表</div>
            <a-button class="btn-sty2" @click="addDomain()">
              <i class="iconfont icon-add"></i>新增域名
            </a-button>
          </div>
          <div class="module-table">
            <domain-table :tableVal="tableVal" :pageIndex='pageIndex'></domain-table>
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
    <DomainDia ref="DomainDia" :targetName="targetName"></DomainDia>
    <DomainOptDia ref="DomainOptDia"></DomainOptDia>
    <a-modal class="field-modal module-modal" cancelText="取消" okText="确认" :closable="false" :width="410" title="删除"
      centered v-model="delVisible" @ok="delHandleOk">
      <div class="text">
        是否确认删除
        <span class="text-bold">{{ delName }}</span>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import DomainTable from "@/components/DomainView/DomainTable.vue";
  import DomainDia from "@/components/DomainView/DomainDia.vue";
  import DomainOptDia from "@/components/DomainView/DomainOptDia.vue";
  import BScroll from 'better-scroll';

  // import {
  //   setScroll
  // } from '@/assets/public.ts';


  export default Vue.extend({
    name: "OptionHome",
    data() {
      return {
        delVisible: false,
        delName: "",
        searchVal: "",
        domainTabList: [],
        tableVal: null,
        targetName: "",
        targetInfo: {},
        scroll: null as any,
        pageIndex: 1,
      };
    },
    components: {
      DomainTable,
      DomainDia,
      DomainOptDia
    },
    created() {
      this.getDomainTab();
    },
    mounted() {
      this.scroll = new BScroll((this.$refs as any).wrapper, {
        scrollbar: {
          fade: false
        },
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        }
      });
    },
    methods: {
      search() {
        // console.log(this.tableVal)
        var name = this.searchVal;
        var _groupList = this.domainTabList;

        //初始化值
        this.targetName = "";
        this.tableVal = null;

        _groupList.forEach((res: any) => {
          res.hideFlag = false;
        });

        if (!name) {
          this.getDomainInfo((_groupList[0] as any).id);
          return false;
        }
        let _obj = _groupList.filter((res: any) => {
          return res.name.indexOf(name) == -1;
        });
        if (_obj) {
          _obj.forEach((_obj: any) => {
            _obj.hideFlag = true;
          });
          let showObjFirst = _groupList.find((res: any) => {
            return res.hideFlag == false;
          })
          if (showObjFirst) {
            this.getDomainInfo((showObjFirst as any).id);
          }
        }
      },
      addDomainClass() {
        (this.$refs.DomainOptDia as any).showModal();
      },
      editDomainClass() {
        (this.$refs.DomainOptDia as any).showModal(this.targetName);
      },
      addDomain(id ? : any, parentId ? : any) {
        (this.$refs.DomainDia as any).showModal(id, parentId);
      },
      addDomainChild(id ? : any) {
        (this.$refs.DomainDia as any).showModalTwo(id);
      },
      getDomainTab(type ? : number) { // type=1 是添加时候 2 修改
        this.$api.control.getTarget().then((res: any) => {
          this.domainTabList = res.data;
          if (type == 1) {
            this.getDomainInfo(res.data[res.data.length - 1].id);
          } else if (type == 2) {
            this.getDomainInfo(this.targetName);
          } else {
            if (res.data && res.data.length > 0) {
              this.getDomainInfo(res.data[0].id);
            }
          }
          this.$nextTick(() => {
            if (type == 1) {
              this.scroll.refresh();
              let doc = (this.$refs.content as any);
              if (doc && doc.scrollHeight) {
                this.scroll.scrollTo(0, -doc.scrollHeight, 0);
              }
            }
          })
          // this.$nextTick(() => {
          //   setScroll((this.$refs as any).wrapper)
          // })
        });
      },
      getTargetInfo() {
        let params = {
          domainTypeId: this.targetName
        };
        this.$api.control.getTargetInfo(params).then((res: any) => {
          this.targetInfo = res.data;
        });
      },
      getDomainInfo(name ? : any, pageIndex: number = 1) {
        if (name) {
          this.targetName = name;
        }
        let params = {
          domainTypeId: this.targetName,
          pageIndex: pageIndex,
          pageSize: 15
        };
        this.pageIndex = pageIndex;
        this.$api.control.getDomainPage(params).then((res: any) => {
          let data = res.data;
          this.tableVal = data;
        });
        this.getTargetInfo();
      },
      delRun(id: any, name: any) {
        this.delName = name;
        this.delVisible = true;
      },
      delHandleOk() {
        let params = {
          domainTypeId: this.targetName
        };
        this.$api.control.delTarget(params).then((res: any) => {
          this.tableVal = null;
          this.getDomainTab();
          this.delVisible = false;
        });
      }
    }
  });
</script>

<style lang="scss">
</style>