<template>
  <div class="option-config-body">
    <div class="module-body">
      <div class="module-left">
        <div class="title">选项名称</div>
        <div class="search">
          <a-input v-model="searchVal" @pressEnter="search" class="search-input" placeholder="请输入">
            <span class="icon-body" slot="addonAfter" @click="search">
              <i class="iconfont icon-sousuo"></i>
            </span>
          </a-input>
        </div>
        <div class="module-items module-items2 scroll-wrapper" ref='wrapper'>
          <div class="content" ref='content'>
            <div class="item" @click="getKvs(item.id)" :class="{'active':codeId == item.id}"
              v-for="(item,i) in codeList" :key="i" :style="{'display':(item.hideFlag ? 'none' : '')}">
              <span class="text" :class="{'flex':item.remark_ZH && item.codelist_Name}">
                <span>{{ item.remark_ZH }}</span>
                <!-- <template v-if="item.remark_ZH && item.codelist_Name">
                  <span class="spec">|</span>
                </template>
                <span>{{ item.codelist_Name }}</span> -->
              </span>
              <a-dropdown @click.native.stop overlayClassName="module-dropdown" :trigger="['click']">
                <div class="ant-dropdown-link">
                  <span class="iconfont icon-shezhi"></span>
                </div>
                <a-menu slot="overlay">
                  <a-menu-item @click="delRun(item.id,item.remark_ZH)">
                    <span>删除</span>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="module-right">
        <div class="module-info-body">
          <div class="search">
            <div></div>
            <section class='module-btn-block'>
              <a-button class="btn-sty1" @click="editOption">
                <i class="iconfont icon-bianji"></i> &nbsp;修改选项
              </a-button>
              <a-button class="btn-sty2" @click="addOption">
                <i class="iconfont icon-add"></i>新增选项
              </a-button>
            </section>

          </div>
        </div>
        <div class="module-info-body" v-if="kVsData && kVsData.length > 0">
          <!-- <div class="search">
            <div></div>
            <a-button class="btn-sty2" @click="addOption">
              <i class="iconfont icon-add"></i>新增选项
            </a-button>
          </div> -->
          <div class="module-table">
            <option-table :kVsData="kVsData"></option-table>
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
    <option-add-dia ref="OptionAddDia"></option-add-dia>
    <a-modal class="field-modal module-modal" cancelText="取消" okText="确认" :closable="false" :width="410" title="删除"
      centered v-model="visible" @ok="handleOk">
      <div class="text">
        是否确认删除
        <span class="text-bold">{{ name }}</span>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import OptionAddDia from "@/components/OptionView/OptionAddDia.vue";
  import OptionTable from "@/components/OptionView/OptionTable.vue";
  import BScroll from 'better-scroll';
  import {
    setScroll
  } from '@/assets/public.ts';

  export default Vue.extend({
    name: "OptionHome",
    data() {
      return {
        searchVal: "",
        codeList: [] as any,
        visible: false,
        name: "",
        codeId: "",
        kVsData: [] as any,
        scroll: null as any,
      };
    },
    components: {
      OptionAddDia,
      OptionTable
    },
    created() {
      this.getCodeList();
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
        // console.log(this.codeList)
        var name = this.searchVal;
        var _groupList = this.codeList;

        //初始化值
        this.codeId = "";
        this.kVsData = [];

        _groupList.forEach((res: any) => {
          res.hideFlag = false;
        });

        if (!name) {
          this.getKvs(_groupList[0].id); 
          return false;
        }
        let _obj = _groupList.filter((res: any) => {
          return res.remark_ZH.indexOf(name) == -1; 
        });
        if (_obj) {
          _obj.forEach((_obj: any) => {
            _obj.hideFlag = true;
          });
          let showObjFirst = _groupList.find((res: any) => {
            return res.hideFlag == false;
          })
          if (showObjFirst) {
            this.getKvs(showObjFirst.id);
          }
        }
      },
      addOption() {
        (this.$refs.OptionAddDia as any).showModal();
      },
      editOption() {
        (this.$refs.OptionAddDia as any).showModal(this.codeId);
      },
      getCodeList(type ? : number) { // 1添加完成 2 修改
        this.$api.control.getCodeList().then((res: any) => {
          this.codeList = res.data;
          if (type == 1) {
            this.codeId = this.codeList[this.codeList.length - 1].id;
            this.getKvs(this.codeId);

          } else if (type == 2) {
            this.getKvs(this.codeId);
          } else {
            if (res.data && res.data.length > 0) {
              this.getKvs(res.data[0].id);
            }
          }
          this.$nextTick(() => {
            if (type == 1) {
              this.scroll.refresh();
              let doc = (this.$refs.content as any).scrollHeight;
              this.scroll.scrollTo(0, -doc, 0);
            }
          })
        });
      },
      handleOk() {
        let params = {
          codeListId: this.codeId
        };
        this.$api.control.delCode(params).then((res: any) => {
          this.kVsData = [];
          this.getCodeList();
        });
        this.visible = false;
      },
      getKvs(id ? : any) {
        console.log(id)
        if (id) {
          this.codeId = id;
        }
        let params = {
          codeListId: this.codeId
        };
        this.$api.control.getCodeInfo(params).then((res: any) => {
          this.kVsData = res.data.kVs;
        });
      },
      delRun(id: any, name: any) {
        this.name = name;
        this.visible = true;
      }
    }
  });
</script>

<style lang="scss">
</style>