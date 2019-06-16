<template>
  <div class="module-body minhei">
    <div class="module-left">
      <div class="search">
        <!-- <a-input placeholder="请输入">
          <span slot="addonAfter">
            <i class="iconfont icon-sousuo"></i>
          </span>
        </a-input>-->
        <a-input v-model="searchVal" @pressEnter="search" class="search-input" placeholder="请输入">
          <span class="icon-body" slot="addonAfter" @click="search">
            <i class="iconfont icon-sousuo"></i>
          </span>
        </a-input>
      </div>
      <div class="module-list-body">
        <draggable tag="ul" :list="moduleList" :sort="false" :group="{ name: 'module-rs', pull: 'clone', put: false }"
          :clone="cloneDog" :disabled="activeType==1">
          <li v-for="(item,i) in moduleList" :key="i">
            <span>{{item.name}}</span>
          </li>
        </draggable>
      </div>
    </div>
    <div class="module-right">
      <div class="visit-main visit-block">
        <div class="btn-group">
          <section>
            <a-button class="btn-sty2" @click="showVisit">
              <i class="iconfont icon-add"></i>添加访视
            </a-button>
            <a-button class="btn-sty1" @click="showSameVisit">
              <i class="iconfont icon-add"></i>相同访视内容
            </a-button>
          </section>
          <section class='putOn-block'>
             <span class='fold' :class='{"active":activeType==2}' @click='fold(2)'><i
                class="iconfont icon-icon-copy-copy-copy-copy"></i>&nbsp;&nbsp;收起</span>
            <span class='fold' :class='{"active":activeType==1}' @click='fold(1)'><i
                class="iconfont icon-down-arrow"></i>&nbsp;&nbsp;展开</span>
           
          </section>
        </div>
        <div class="module-clone-body" ref='moduleBody'>
          <draggable tag="div" ghost-class="ghost" :list="projectList" @end="projectCheckMove"
            :disabled="activeType==2">
            <template v-if="projectList && projectList.length > 0">
              <div class="module-clone" v-for="(item,i) in projectList" :key="i">
                <div class="top flex-row">
                  <h3 class="title" v-if='activeType==1'>{{ item.name }}</h3>
                  <section class='nameGroup' v-else>
                    <h3 class='title' >{{item.name}}</h3>
                  </section>
                  <div class="edit-group flex-row" v-if='activeType==1'>
                    <span class="edit-item" @click="showVisit({
                    stype:'修改',
                    oldVisitId:item.id,
                    name:item.name,
                    visitType:item.typeId
                  },i)">
                      <i class="iconfont icon-bianji"></i>编辑
                    </span>
                    <span class="edit-item" @click="showVisit({
                    stype:'复制',
                    oldVisitId:item.id,
                    name:item.name,
                  },$event)">
                      <i class="iconfont icon-fuzhi"></i>复制
                    </span>
                    <span class="edit-item" @click="showVisit({
                    stype:'删除',
                    oldVisitId:item.id,
                    name:item.name
                  },$event)">
                      <i class="iconfont icon-delete"></i>删除
                    </span>
                  </div>
                </div>
                <draggable @add="cloneModule(item.groupId,$event)" @end="checkMove(item.groupId,item.modules,$event)"
                  tag="ul" class="module-list-clone" ghost-class="ghost" :list="item.modules" :group="{ name: 'module-rs', pull: false, put: true }"
                  :disabled="activeType==1">
                  <template v-if="item.modules && item.modules.length > 0">
                    <li class="list-item" v-for="(itemChild,i) in item.modules" :key="i">
                      <span v-if="itemChild">{{itemChild.moduleName}}</span>
                      <a-icon @click="showVisit({
                    stype:'删除模块',
                    visitId:item.groupId,
                    moduleId:itemChild.id,
                    name:itemChild.moduleName,
                  },$event)" :class="{'close-btn':true,'close-btn1':(activeType == 1)}" type="close" />
                    </li>
                  </template>
                </draggable>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <CrfVisitDia ref="visitDiavisitDia"  :projectId='projectId'></CrfVisitDia>
    <CrfSameVisitDia ref="visitSameDia" ></CrfSameVisitDia>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import draggable from "vuedraggable";
  import CrfVisitDia from "@/components/CrfView/CrfVisitDia.vue";
  import CrfSameVisitDia from "@/components/CrfView/CrfSameVisitDia.vue";
  export default Vue.extend({
    name: "CrfVisit",
    data() {
      return {
        activeType: 2, // 当前是1展开或2收起
        enabled: true,
        projectList: [] as Array < any > ,
        moduleList: [] as Array < any > ,
        list2: [] as Array < any > ,
        searchVal: "",
        groupType: [],
        nowModule: {
          id: "",
          name: ""
        },
        val:'',
      };
    },
    created() {
      this.dataInit();
      // this.getGroupTypeInfo();
    },
    props: ["projectId"],
    components: {
      draggable,
      CrfVisitDia,
      CrfSameVisitDia
    },
    methods: {
      dataInit() {
        //初始化
        this.getModule().then((_: any) => {
          // this.getVisit(2);
          this.getQueryAsGroup(2);
        });
      },
      search() {
        let name = this.searchVal;
        this.getModule(name);
      },
      projectCheckMove(_event: any) {
        let order = _event.newIndex;
        let oldOrder = _event.oldIndex;
        let _nowProjectList = this.projectList;
        if (_nowProjectList.length == 1 || order == oldOrder) {
          return false;
        }
        // let moveVisitId = _nowProjectList[order - 1].id;
        // let preVisitId = _nowProjectList[order].id;
        // if (oldOrder > order) {
        //   moveVisitId = _nowProjectList[order].id;
        //   preVisitId = _nowProjectList[order + 1].id;
        // }
        let moveVisitId = "";
        let preVisitId = "";
        if (oldOrder > order) {
          moveVisitId = _nowProjectList[order].id;
          preVisitId = _nowProjectList[order + 1].id;
        } else {
          moveVisitId = _nowProjectList[order].id;
          preVisitId = _nowProjectList[order - 1].id;
        }
        let params = {
          moveVisitId: moveVisitId,
          preVisitId: preVisitId
        };
        this.$api.control.visitOrder(params).then((res: any) => {
          this.getVisit(2);
        });
     
      },
      checkMove(visitId: any, modules: any, _event: any) {
        let order = _event.newIndex;
        let oldOrder = _event.oldIndex;
        let _nowModule = modules;
        if (_nowModule.length == 1 || order == oldOrder) {
          return false;
        }
        let moveModuleId = "";
        let preModuleId = "";
        if (oldOrder > order) {
          moveModuleId = _nowModule[order].id;
          preModuleId = _nowModule[order + 1].id;
        } else {
          moveModuleId = _nowModule[order].id;
          preModuleId = _nowModule[order - 1].id;
        }
        let params = {
          // visitId: visitId,
          visitGroupId:visitId,
          moveModuleId: moveModuleId,
          preModuleId: preModuleId
        };
        // this.$api.control.moduleOrder(params).then((res: any) => {
        //   this.getVisit(2);
        // });
        this.$api.control.moveModulesOrder(params).then((res: any) => {
          this.getQueryAsGroup(2);
        });
      },
      cloneModule(e: any, _e: any) {
        // console.log(e, _e)
        let _ind = _e.newIndex; //获取复制过来的dom 下标
        let _json = this.projectList.find(res => {
          // return res.id == e; //访视
          return res.groupId == e; //组内
        });
        if (_json.modules.length > 0) {
          // 获取已存在modules
          // let _id = _json.id; // 访视
          let _id = _json.groupId; //组内
          let modules = _json.modules;
          let cloneModule = modules[_ind];
          let nameNum = modules.filter((res: any) => {
            return res.id == cloneModule.id;
          });
          if (nameNum.length == 1) {
            let params = {
              // visitId: _id,
              // moduleId: this.nowModule.id
              projectId: this.projectId,
              moduleId: this.nowModule.id,
              visitGroupId: _id,
            };
            this.addMoudle(params).then((res: any) => {});
          } else {
            modules.splice(_ind, 1);
          }
        }
      },
      showVisit(type: any,i:any) {
        // //显示访视添加 modle
        this.val=this.projectList[i].visit_Type;
        (this.$refs.visitDiavisitDia as any).showModal(type,this.val);
      },
      addMoudle(params: any) {
        //添加 module
        // const _then = this.$api.control.postModule(params).then((res: any) => {
        //   console.log(res);
        // });
        //添加组内模块
        const _then = this.$api.control.visitAddBatModule(params).then((res: any) => {
          console.log(res);
        });
        return _then;
      },

      /** 展开 */
      getVisit(type: number) {
        //获取 访视
        let params = {
          projectId: this.projectId
        };
        this.$api.control.getVisit(params).then((res: any) => {
          let data = res.data;
          this.projectList = data;
          if (type == 1) {
            this.$nextTick(() => {
              this.setScroll();
            })
          }
        });
      },
      postVisit(v: string, typeId: string) {
        //提交访视
        let params = {
          projectId: this.projectId,
          visitName: v,
          visitType: typeId,
        };
        this.$api.control.postVisit(params).then((res: any) => {
          console.log(res)
          this.activeType = 2;
          this.getQueryAsGroup(1);
        });
      },
      copyVisit(params: any) {
        this.$api.control.copyVisit(params).then((res: any) => {
          this.getVisit(2);
        });
      },
      delVisit(params: any) {
        // let params = {
        //   visitId: id
        // };
        this.$api.control.delVisit(params).then((res: any) => {
          this.getVisit(2);
        });
      },
      delVisitModule(params: any) {
        // this.$api.control.delVisitModule(params).then((res: any) => {
        //   this.getVisit(2);
        // });
        //删除组内模块
        this.$api.control.delVisitBatModule(params).then((res: any) => {
          this.getQueryAsGroup(2);
        });
      },
      cloneDog({
        id,
        name
      }: any) {
        this.nowModule.id = id;
        this.nowModule.name = name;
        return {
          id: id,
          moduleName: name
        };
      },
      getModule(name ? : any) {
        let params = {
          projectId: this.projectId,
          moduleName: name || ""
        };
        const _then = this.$api.control.getModule(params).then((res: any) => {
          let data = res.data;
          let _dataArr: Array < any > = [];
          data.forEach((res: any) => {
            let _json = {
              name: res.moduleName,
              id: res.id
            };
            _dataArr.push(_json);
          });
          this.moduleList = _dataArr as any;
        });
        return _then;
      },
      cgName(params: any) {
        this.$api.control.upVisit(params).then((res: any) => {
          this.getVisit(2);
        });
      },
      // getGroupTypeInfo() {
      //   let params = {
      //     groupDicVal: '39891ac5-5e00-431f-ac83-b75ef21e16b0' //1疾病领域 2单位 3访视类型
      //   };
      //   const _then = this.$api.control
      //     .getvisitListOnly(params)
      //     .then((res: any) => {
      //       this.groupType = res.data;
      //     });
      //   return _then;
      // },
      setScroll() {
        let doc = this.$refs.moduleBody as any;
        doc.scrollTop = doc.scrollHeight;
      },
      showSameVisit() {
        let type = {
          title: '相同访视内容',
        };
        (this.$refs.visitSameDia as any).showModal(type);
      },
      saveVisitBatch(Batch: any) {
        let params = {
          projectId: this.projectId,
          visitType: Batch.visitType,
          visitsInfo: Batch.visitsInfo,
        };
        this.$api.control.saveVisitBatch(params).then((res: any) => {
          this.activeType =2;
          this.getQueryAsGroup(1);
        })
      },

      /** 获取 访视组 */
      getQueryAsGroup(type: number) {
        let params = {
          projectId: this.projectId
        };
        this.$api.control.getQueryAsGroup(params).then((res: any) => {
          let data = res.data;
          // console.log(data)

          data.forEach((ele: any) => {
            if (ele.visits && ele.visits[0]) {
              this.$set(ele, 'modules', ele.visits[0].modules);
            }
            let nameList = [] as any;
            ele.visits.forEach((el: any) => {
              nameList.push(el.name)
            });
            this.$set(ele, 'name', nameList);
          });
          this.projectList = data;
           this.projectList.forEach((item)=>{
             item.name=item.name[0].replace(/ \[\]/g,"")
        })
          if (type == 1) {
            this.$nextTick(() => {
              this.setScroll();
            })
          }
        });
      },

      /** 1展开 2收起 */
      fold(type: number) {
        if (type == 1) {
          this.getVisit(2);
        } else {
          this.getQueryAsGroup(2);
        }
        this.activeType = type;
      }
    }
  });
</script>

<style lang="scss" scoped>
  .module-left {
    .search {
      margin-bottom: 10px;
    }
  }
</style>