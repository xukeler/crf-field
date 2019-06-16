<template>
  <div class="field-control-inner minhei">
    
        <div class="btn-group-block" :style="{'justify-content':(hisVersion?'space-between':'center')}">
          <section class='version' v-if='hisVersion'>{{hisVersion}}</section>
          <section class='btn-group' :style="`width:${wLeft}px`">
            <section class='version'>{{version}}</section>
              <section>
                <a-button class="btn-sty1" @click="confirm">版本发布</a-button>
                <!-- <a-button class="btn-sty1" @click="downDoc">下载 CRF</a-button> -->
                <!-- <a-button class="btn-sty2">下载 aCRF</a-button> -->
                <a-select class='select-sty' placeholder="下载" style="width: 110px" @change="handleChange">
                  <a-select-option value="1">下载 CRF</a-select-option>
                  <a-select-option value="2">下载 aCRF</a-select-option>
                </a-select>
                <a-select placeholder="请选择历史版" style="width: 130px" @change="handleChangeHis">
                   <a-select-option value="">请选择
                  </a-select-option>
                  <a-select-option v-for='(item,index) in hisVerList' :key='index' :value="item.id">{{item.version}}
                  </a-select-option>
                </a-select>
              </section>
          </section>       
        </div>
        <section class='control-inner-block'>
          <section class="con-block con-block01 content" v-if="verVisits&&verVisits.length > 0">
            <template >
              <div class="each-dom" v-for="(item,i) in verVisits" :key="i">
                <template v-if="item.modules.length > 0">
                  <div class="inner-top">
                    <span class="h3">{{ item.name }}</span>
                  </div>
                  <div class="main">
                    <div class="list-row" v-for="(list,i2) in item.modules" :key="i2">
                      <div class="title">{{ list.moduleName }}</div>
                      <div class="item" v-for="(fieldItem,i3) in list.fields" :key="i3">
                        <div class="label">{{ fieldItem.question_Text }}</div>
                        <div class="control">
                          <div class="dateControl" v-if="fieldItem.dataType == 'Date'">
                            <a-input />
                            <a-input />
                            <a-input />
                            <a-input />
                            <span>年</span>
                            <a-input />
                            <a-input />
                            <span>月</span>
                            <a-input />
                            <a-input />
                            <span>日</span>
                          </div>
                          <div v-else-if="fieldItem.dataType == 'option'">
                            <a-radio-group class="check-group" v-if='fieldItem.codeList&&fieldItem.codeList.kVs'>
                             <a-radio v-for='(item,ind) in fieldItem.codeList.kVs' :key='ind' :value="ind">{{item.codeLabel}}</a-radio>
                            </a-radio-group>
                          </div>
                          <div v-else>
                            <a-input />
                            <span class="check-radio-block">
                             <a-radio-group class="check-group" v-if='fieldItem.field_Unit_Maps&&fieldItem.field_Unit_Maps.length>0'>
                              <a-radio v-for='(item,ind) in fieldItem.field_Unit_Maps' :key='ind' :value="ind">{{item.groupType}}</a-radio>
                             </a-radio-group>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </section>
          <section class="con-block content" ref='mian'>
            <template v-if="visits.length > 0">
              <div class="each-dom" v-for="(item,i) in visits" :key="i">
                <template v-if="item.modules.length > 0">
                  <div class="inner-top">
                    <span class="h3">{{ item.name }}</span>
                    <!-- <div class="btn-group" v-if="i == 0">
                <a-button class="btn-sty1" @click="downDoc">下载 CRF</a-button>
                <a-button class="btn-sty2">下载 aCRF</a-button>
              </div> -->
                  </div>
                  <div class="main">
                    <div class="list-row" v-for="(list,i2) in item.modules" :key="i2">
                      <div class="title">{{ list.moduleName }}</div>
                      <div class="item" v-for="(fieldItem,i3) in list.fields" :key="i3">
                        <div class="label">{{ fieldItem.question_Text }}</div>
                        <div class="control">
                          <div class="dateControl" v-if="fieldItem.dataType == 'Date'">
                            <a-input />
                            <a-input />
                            <a-input />
                            <a-input />
                            <span>年</span>
                            <a-input />
                            <a-input />
                            <span>月</span>
                            <a-input />
                            <a-input />
                            <span>日</span>
                          </div>
                          <!-- <div v-else-if="fieldItem.dataType == 'option'">{{ fieldItem.completion_Instructions }}</div> -->
                          <div v-else-if="fieldItem.dataType == 'option'">
                            <a-radio-group class="check-group" v-if='fieldItem.codeList&&fieldItem.codeList.kVs'>
                             <a-radio v-for='(item,ind) in fieldItem.codeList.kVs' :key='ind' :value="ind">{{item.codeLabel}}</a-radio>
                            </a-radio-group>
                          </div>
                          <div v-else>
                            <a-input />
                            <span class="check-radio-block">
                             <a-radio-group class="check-group" v-if='fieldItem.field_Unit_Maps&&fieldItem.field_Unit_Maps.length>0'>
                              <a-radio v-for='(item,ind) in fieldItem.field_Unit_Maps' :key='ind' :value="ind">{{item.groupType}}</a-radio>
                             </a-radio-group>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </section>
        </section>
    <CrfControlDia ref='controlDia'></CrfControlDia>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import NEnum from '@/cmmon/NEnum';
  import postUrlEnd from "@/api/interface";
  // import {
  //   setScroll
  // } from '@/assets/public.ts';
  import CrfControlDia from './CrfControlDia.vue';
  export default Vue.extend({
    name: "CrfControl",
    components: {
      CrfControlDia
    },
    data() {
      return {
        visits: [] as Array < any > ,
        scroll: null as any,
        version: '', // 版本號
        hisVerList: [],
        wLeft:850,
        verVisits:[] as any,
        hisVersion:null // 历史版本
      };
    },
    created() {
      this.getControl();
      this.getVersionList();
    },

    props: ["projectId"],
    methods: {
      getControl() {
        if (this.projectId) {
          let params = {
            projectId: this.projectId
          };
          const _then = this.$api.control
            .projectReport(params)
            .then((res: any) => {
              console.log(res)
              let data = res.data;
              this.version = data.version;
              this.visits = data.visits;
              this.getWidth();
              // this.$nextTick(() => {
              //   setScroll((this.$refs as any).wrapper);
              // })
            });
        }
      },
      /** 获取历史版本数据 */
      GetByVersion(versionId:string){
        if (this.projectId) {
          let params = {
            projectId: this.projectId,
            versionId:versionId,
          };
          const _then = this.$api.control
            .GetByVersion(params)
            .then((res: any) => {
              let data = res.data;
              if(data&&data.project){
                this.hisVersion = data.project.version;
                this.verVisits = data.project.visits;
              }else{
                this.hisVersion = null;
                this.verVisits = [];
              }
               this.getWidth();            
            
            });
        }
      },
      downDoc() {
        let dowUrl = postUrlEnd.projectDoc + "?projectId=" + this.projectId;
        window.location.href = dowUrl;
        // let params = {
        //   projectId: this.projectId
        // };
        // this.$api.control.getProjectDoc(params).then((res: any) => {
        //   console.log(res);
        // });
      },

      /** 确认发布版本 */
      setVersion() {
        let url = postUrlEnd.setVersion + '?projectId=' + this.projectId;
        this.$api.control.setVersion(url).then((res: any) => {
          this.getControl();
        })
      },

      confirm() {
        /** 获取下一版本号 */
        let params = {
          projectId: this.projectId
        }
        this.$api.control.getNextVersion(params).then((res: any) => {
          let obj = {
            title: '版本发布',
            txt: '确认正式发布版本,版本号',
            version: res.data,
          };
          (this.$refs.controlDia as any).showModal(obj);
        })
      },
      handleChange(type: NEnum.Emule) {
        if (type == NEnum.Emule.下载CRF) {
          this.downDoc();
        }
      },
      /** 获取历史版本 */
      getVersionList() {
        let params = {
          projectId: this.projectId
        }
        this.$api.control.getVersionList(params).then((res: any) => {
          this.hisVerList = res.data;
        })
      },

      /** 选择历史版本 */
      handleChangeHis(v: string) {
        this.GetByVersion(v);
      },
      getWidth(){
        let o = this.$refs.mian as any;
        this.$nextTick(()=>{
           this.wLeft = o.clientWidth || o.offsetWidth;
        })
      }
    }
  });
</script>

<style lang="scss">
</style>