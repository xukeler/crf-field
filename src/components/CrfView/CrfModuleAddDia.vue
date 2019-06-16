<template>
  <div class="module-modal-body" v-if="visible">
    <a-modal class="field-modal module-add-modal" cancelText="取消" okText="保存" :maskClosable="false" :keyboard="false"
      :width="1200" centered v-model="visible" @ok="handleOk">
      <div class="title-top">
        <div class="search-top">
          <div class="control-item flex-row">
            <div class="label">
              模块名称
              <em style="color:red;">*</em>
            </div>
            <div class="control">
              <a-form-item :validate-status="errFlag" :help="errFlag == 'error' ? '请输入模块名称' :'' ">
                <a-input v-model="moduleName" placeholder="请输入模块名称" />
              </a-form-item>
            </div>
          </div>
        </div>
        <div class="disease-type-block">
          <div class="left-block">疾病类型选择</div>
          <div class="right-block">
            <div :class="{'itemtoggle':flag}">
            <a-carousel arrows :dots='false' :afterChange="onChange" :beforeChange='next'>
              <div slot="prevArrow" slot-scope="props" class='custom-slick-arrow' style="left: 10px;zIndex: 1" v-if='prevArrow'>
                <i class='iconfont icon-left-line icon'></i>
              </div>
              <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px" v-if='nextArrow'>
                <i class='iconfont icon-you icon'></i>
              </div>
              <div v-for='(item,index) in filterGroupType' :key='index' class='type-page'>
                <div class="item-contral" :style='{"width":(filterGroupType.length>1?"94%":"100%")}'>
                  <div v-for='(type,ind) in item' :key='ind' class='type-item' @click='getInfo(type.id)'>
                    <span :class="{'type-active':type.isActive}">{{type.name}}</span>
                  </div>
                </div>
            </div>
              
            </a-carousel>
          </div>
          </div>
        </div>
      </div>
      <div class="add-inner">
        <div class="inner-left">
          <div class="select-top">
            <div class="search">
              <div class="search-input" v-if='options.length!=0'>
                <a-input v-model="searchDoMin" @pressEnter="searchDoMind" placeholder="请输入域名">
                  <span class="icon-body" slot="addonAfter" @click="searchDoMind">
                    <i class="iconfont icon-sousuo"></i>
                  </span>
                </a-input>
              </div>
            </div>
            <!-- <a-select @change="getInfo" placeholder="请选择" :defaultValue="groupVal" v-if="groupType.length>0">
              <a-select-option value class="groupType">请选择</a-select-option>
              <a-select-option v-for="(item,i) in groupType" :key="i" :value="item.id" :title="item.groupName"
                class="groupType">{{ item.groupName }}</a-select-option>
            </a-select> -->
          </div>
          <!-- <a-radio-group class="check-group" v-model="domainIds" @change="cgShowTable" :options="options">
          </a-radio-group> -->
          <!-- <a-checkbox-group
            ref='checkbox'
            class="check-group"
            v-model="domainIds"
            @change="cgShowTable"
            :options="options"
          /> -->
          <section class='check-group'>
            <div class="check-item" v-for='(item,index) in options' :key='index' @click='cgShowTable(item.value)'
              :class="{'check-active':item.isActive,'check-selected':item.isSelected}"
              :style="{'display':(item.hideFlag ? 'none' : '')}">
              {{item.label}}
            </div>
            <!-- <div class="check-item">暂无相关数据</div> -->
          </section>
        </div>
        <div class="inner-right">
          <div class="inner-table">
            <!-- <div class="sel-title" v-if="labelText">
              <span class="text">{{ labelText.join('，') }}</span>
            </div> -->
            <div class="search" v-if="domainIds && (hasSearch || tableVal&&tableVal.length>0)">
              <div class="search-input">
                <a-input v-model="searchVal" @pressEnter="search" placeholder="请输入CRF问题描述">
                  <span class="icon-body" slot="addonAfter" @click="search">
                    <i class="iconfont icon-sousuo"></i>
                  </span>
                </a-input>
              </div>
            </div>
            <div class="module-table" v-if="tableVal && tableVal.length > 0">
              <module-add-table :selectedDomainIds="selectedDomainIds" :domainId="nowDomainId" :tableVal="tableVal"
                :labelText="labelText" ref="moduleTable"></module-add-table>
            </div>
            <div class="nothing-body" v-if="!tableVal || tableVal.length == 0">
              <div class="nothing">
                <span class="iconfont icon-kong icon-kong-color"></span>
                <span v-if='hasSearch' class="text">无相关内容</span>
                <span v-else class="text">该域名下的字段已选完</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import ModuleAddTable from "@/components/CrfView/ModuleAddTable.vue";

  export default Vue.extend({
    name: "CrfModuleAddDia",
    data() {
      return {
        visible: false,
        searchVal: '',
        hasSearch: false,
        options: [] as Array < any > ,
        nowDomainId: "",
        domainIds: [] as Array < any > ,
        labelText: [] as Array < any > ,
        tableVal: [] as Array < any > ,
        tableValCopy: [] as Array < any > ,
        selectedDomainIds: [] as Array < any > ,
        moduleId: "",
        moduleName: "",
        groupVal: this.groupType[0].id,
        errFlag: "" as any,
        defVal: [] as Array < any > ,
        searchDoMin: '',
        disTypeId: '',
        typeLiParent:[],
        prevArrow:false,
        nextArrow:true,
        flag:true,
      };
    },
    props: ["groupType", "projectId", "defModuleVal"],
    provide(): any {
      return {
        setTabSelect: this
      };
    },
    components: {
      ModuleAddTable
    },
    created(){
      console.log(this.groupType)
    },
    watch: {
      visible(v) {
        if (!v) {
          (this.$parent as any).clearFlag = false;
          (this.$parent as any).defModuleVal = "";
        } else {
          this.getInfo(this.groupType[0].id);
        }
      },
      moduleName(v) {
        if (v) {
          this.errFlag = "";
        }
      },
    },
    computed: {
      filterGroupType() { // 构造轮播数据
        let group = this.groupType;
        let typeListParent: any = [];
        let typelistChild: any = [];
        const MAX_LENGTH = 11;
        this.$set(group[0], 'isActive', true);
        group.forEach((ele: any, i: number) => {
          if (i != 0) {
            this.$set(ele, 'isActive', false)
          }
          if (typelistChild.length === MAX_LENGTH) {
            typeListParent.push(typelistChild);
            typelistChild = [];
          }
          typelistChild.push(ele);
          if (i === group.length - 1) {
            typeListParent.push(typelistChild);
          }
        });
        this.typeLiParent = typeListParent;
        return typeListParent;
      },
    },
    mounted() {
      if (this.defModuleVal) {
        this.moduleName = this.defModuleVal.name;
        this.getModuleInfo(this.defModuleVal.id).then((res: any) => {
          if (this.defVal.length == 0) {
            return false;
          }
          this.groupVal = this.defVal[0].groupType.id;
          let groupTypeViews = this.defVal[0].groupTypeViews;
          this.getInfo(this.defVal[0].groupType.id).then((_res: any) => {
            let domainIds = [] as Array < any > ;
            groupTypeViews.forEach((el: any) => {
              domainIds.push(el.parent.id);
            });
            this.domainIds = domainIds;
            if (domainIds.length == 0) {
              return false;
            }
            this.cgShowTable(domainIds).then((_now: any) => {
              let selectedRowKeys = [] as Array < any > ;
              groupTypeViews[domainIds.length - 1].child.forEach((el: any) => {
                selectedRowKeys.push(el.id);
              });
              (this.$refs.moduleTable as any).selectedRowKeys = selectedRowKeys;
            });
          });
        });
      }
    },
    methods: {
      next(from:any,to:any){
        console.log(from,to)
        if(to==0){
          this.flag=true
        }else{
          this.flag=false
        }
      },
      showModal() {
        this.visible = true;
      },
      setLabelText(v: any) {
        this.labelText = v;
      },
      searchDoMind() {
        let nameMin = this.searchDoMin;
        let _options = this.options;
        this.hasSearch = true;
        _options.forEach((res: any) => {
          res.hideFlag = false;
        });
        if (!nameMin) {
          this.cgShowTable(_options[0].value);
          return false;
        }
        let _obj = _options.filter((res: any) => {
          return res.label.indexOf(nameMin) == -1;
        });
        if (_obj) {
          _obj.forEach((_obj: any) => {
            _obj.hideFlag = true;
          });
          let showObjFirst = _options.find((res: any) => {
            return res.hideFlag == false;
          })
          let valueID = showObjFirst ? (showObjFirst as any).value : '';
          this.cgShowTable(valueID);
        }

      },
      search() {
        let name = this.searchVal;
        if (!name) {
          this.tableVal = this.tableValCopy;
          return false;
        }
        let _obj = this.tableValCopy.filter((res: any) => {
          return res.question_Text.indexOf(name) != -1;
        });
        if (_obj) {
          this.tableVal = _obj;
        } else {
          this.tableVal = this.tableValCopy;
        }
        this.hasSearch = true;
        // let params: any = {
        //   projectName: this.searchVal
        // };
        // this.getProject(params);
      },

      getModuleInfo(id: any) {
        let params = {
          moduleId: id
        };
        const _then = this.$api.control.getModuleInfo(params).then((res: any) => {
          let data = res.data;
          this.defVal = res.data;
          return res;
        });
        return _then;
      },
      handleOk(e: any) {
        if (!this.moduleName) {
          this.errFlag = "error";
        } else {
          let ids = [] as Array < any > ;
          this.selectedDomainIds.forEach((_obj: any) => {
            ids.push(..._obj.value);
          });
          if (this.moduleId) {
            this.postMapField(this.moduleId, ids).then((_now: any) => {
              (this.$parent as any).getModuleFields(
                (this.$parent as any).activeId
              );
              this.visible = false;
            });
          } else {
            this.postModule(this.moduleName).then((res: any) => {
              // console.log(res.data)
              let moduleId = res.data.id;
              let moduleName = res.data.moduleName;
              this.postMapField(moduleId, ids).then((_now: any) => {
                (this.$parent as any).getModule().then(() => {
                  (this.$parent as any).getModuleFields(moduleId,moduleName);
                });
                this.visible = false;
              });
            });
          }
        }
      },
      postModule(v: string) {
        let params = {
          projectId: this.projectId,
          moduleName: v
        };
        const _then = this.$api.control.postModuleDia(params).then((res: any) => {
          return res;
        });
        return _then;
      },
      postMapField(v: string, ids: any) {
        let params = {
          fieldIds: ids,
          moduleId: v
        };
        const _then = this.$api.control.postMapField(params).then((res: any) => {
          console.log(res);
        });
        return _then;
      },
      /** 设置疾病类型选中状态 */
      setSelect(id: string) {
        this.groupType.map((el: any) => {
          el.isActive = false
        });
        let isActiveObj = this.groupType.find((el: any) => {
          return id === el.id
        });
        this.$set(isActiveObj, 'isActive', true);
      },
      /** 根据疾病类型获取域名 */
      getInfo(id: string) {
        console.log(id)
        if (!id) {
          this.options = [];
          return false;
        }
        this.searchDoMin = '';
        this.disTypeId = id;
        this.setSelect(id);
        let params = {
          diseaseId: id
        };
        const _then = this.$api.control
          .getModuleGroup(params)
          .then((res: any) => {
            let _options = [] as Array < any > ;
            res.data.forEach((res: any) => {
              let name = `${res.parent.name}(${res.parent.description})`;
              let json = {
                label: name,
                value: res.parent.id,
                isActive: false,
                isSelected: false,
                hideFlag: false,
              };
              _options.push(json);
            });
            this.options = _options;
            this.hasSearch = this.options[0]? false:true;
            let value = this.options[0] ? this.options[0].value : '';
            this.cgShowTable(value)

          });
        return _then;
      },

      /** 设置选中状态 */
      setTabActive(value: any) {
        if (this.options[0]) {
          this.options.map((el: any) => {
            el.isActive = false
          });
          let isActiveObj = this.options.find((el: any) => {
            return value === el.value
          });
          this.$set(isActiveObj, 'isActive', true);
        }
      },
      /** 设置已选中状态 */
      setTabSelect(value: any) {
        // console.log(value)
        if (this.options[0]) {
          let isActiveObj = this.options.find((el: any) => {
            return value.domainId === el.value
          });
          if (isActiveObj) {
            if (value.labelText.length == 0) {
              this.$set(isActiveObj, 'isSelected', false);

            } else {
              this.$set(isActiveObj, 'isSelected', true);
            }
          }

        }
      },

      /** 根据域名获取表格数据 */
      cgShowTable(v: any) {
        this.tableVal = [];
        this.labelText = [];
        this.searchVal = "";
        this.domainIds = v;
        if (v) {
          this.hasSearch = false;
          this.setTabActive(v)
        }
        if (this.domainIds) {
          let textArr = [] as Array < any > ;
          let nowDomainId = this.domainIds as any;
          let params = {
            moduleId: this.moduleId,
            domainIds: nowDomainId.split(",")
          };
          this.nowDomainId = nowDomainId;
          const _then = this.$api.control
            .getFieldByDomain(params)
            .then((res: any) => {
              this.tableVal = res.data;
              this.tableValCopy = res.data;
              this.$nextTick(() => {
                if (this.selectedDomainIds.length > 0) {
                  let _now = this.selectedDomainIds.find((res: any) => {
                    return res.domainId == nowDomainId;
                  });
                  if (_now) {
                    (this.$refs.moduleTable as any).selectedRowKeys = _now.value;
                    this.labelText = _now.labelText;
                  }
                  this.selectedDomainIds.forEach((res: any) => {
                      this.setTabSelect(res)
                  });
                }
              });
              return res;
            });
          return _then;
        }
      },
      onChange (current:any) {
       console.log(current)
      this.prevArrow=current==0?false:true;
       let LENGTH = this.typeLiParent.length-1;
       this.nextArrow = current==LENGTH?false:true;
    },
    }
  });
</script>

<style  scoped>
  /* For demo */
  .disease-type-block  .type-item{
      width: auto !important;
      margin-right: 20px;
  }
  .ant-carousel>>>.slick-slide {
    text-align: center;
    overflow: hidden;
  }

  .ant-carousel>>>.custom-slick-arrow {
    width: 16px;
    height: 16px;
    line-height: 18px;
    font-size: 16px;
    color: #808897;
    background-color: rgba(31, 45, 61, .11);
    background: #fff;
  }

  .ant-carousel>>>.custom-slick-arrow:before {
    display: none;
  }

  .ant-carousel .slick-prev:hover,
  .ant-carousel .slick-next:hover,
  .ant-carousel .slick-prev:focus,
  .ant-carousel .slick-next:focus {
    color: #808897;
  }
  .itemtoggle .item-contral {
    /* padding-left: 30px !important; */
    /* margin-left: 0; */
    width: 100% !important;
  }
  .item-contral {
    /* width:100% !important; */
    margin: 0 auto;
    /* margin-left: 12px; */
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* padding-left: 12px; */
  }
.type-page{
  /* width: 97.5% !important; */
  padding-left: 12px;
}
  .ant-carousel>>>.slick-slide .type-item {
    width: 8%;
    line-height: 24px;
    color: #7E828A;
    font-size: 14px;
    cursor: pointer;
  }

  .ant-carousel>>>.slick-slide .type-active {
    color: #548FF3;
    padding-bottom: 2px;
    border-bottom: 1px solid #548FF3;
  }
</style>