<template>
    <div class="module-modal-body">
        <a-modal class="field-modal" cancelText="取消" okText="确定" :maskClosable="false" :keyboard="false" :width="700"
            :title="title" centered v-model="visible" @ok="handleOk" @cancel="cancel">
            <div class="control same-control-block">
                <section class='form-block'>
                    <span class='form-label'>访视类型 <em>*</em></span>
                    <a-select placeholder='请选择' v-model="typeId">
                        <a-select-option v-for='item in visitList' :key='item.id' :value="item.id">{{item.name}}
                        </a-select-option>
                    </a-select>
                </section>
                <section class='field-table'>
                    <a-table :pagination="false" :dataSource="tableData" :columns="columns">
                        <template v-for="col in ['name', 'rank']" :slot="col" slot-scope="text, record">
                            <div :key="col" class='required-input-block'>
                                <em class='requires-star' v-if='record.index<3'>*</em>
                                <em class='requires-star' v-else>&nbsp;</em>
                                <a-input :value="text" placeholder='请输入' :type='col=="rank"?"number":"text"'
                                    @change="e => handleChange(e.target.value, record.key, col)" />
                            </div>
                        </template>
                        <template slot='action' slot-scope="record">
                            <section>
                                <a href="javascript:;" class="opeBtn" @click="addRun(record)">
                                    <i class="iconfont icon-add_xinzeng"></i>
                                </a>
                                <a href="javascript:;" class="opeBtn opeBtnVisit" @click="delRun(record)"
                                    v-if='record.index>2'>
                                    <i class="iconfont icon-delete"></i>
                                </a>
                            </section>
                        </template>
                    </a-table>
                </section>
            </div>
        </a-modal>
        <a-modal class="field-modal module-modal" cancelText="取消" okText="确认" :closable="false" :width="410" title="删除"
            centered v-model="visibleDel" @ok="handleOkDel">
            <div class="text">
                是否确认删除
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "CrfSameVisitDia",
        props: ['params'],
        data() {
            return {
                visitList:[],
                tableDataClone: {
                    key: 1,
                    index: 1,
                    name: "",
                    rank: "",
                },
                tableData: [{
                    key: 1,
                    index: 1,
                    name: "",
                    rank: "",
                }, {
                    key: 2,
                    index: 2,
                    name: "",
                    rank: "",
                }] as any,
                columns: [{
                    title: '访视名称',
                    slots: {
                        title: "name"
                    },
                    scopedSlots: {
                        customRender: "name"
                    },
                    dataIndex: "name",
                    width: 200,
                    key: "name"
                }, {
                    title: "排序",
                    slots: {
                        title: "rank"
                    },
                    dataIndex: "rank",
                    key: "rank",
                    width: 100,
                    scopedSlots: {
                        customRender: "rank"
                    },

                }, {
                    title: "",
                    key: "action",
                    width: 50,
                    align: 'left',
                    scopedSlots: {
                        customRender: "action"
                    }
                }],

                visible: false,
                visibleDel: false,
                val: "",
                typeId: undefined,
                title: '',
                delIndex: 0,
                flag:true
            };
        },
        created(){
            this.getVisitList()
        },
        watch:{
              visible(){
        if(!this. visible){
          let par=this.$parent
          console.log(par)
        }
      }
        },
        methods: {
            cancel(){
                this.flag=true
            },
            getVisitList(){
                let _params={
                    showAll:false
                }
                this.$api.control.getVisitList(_params).then((res:any)=>{
                    this.visitList=res.data;
                })
            },
            showModal(varType: any) {
                this.title = varType.title;
                this.typeId = undefined;
                this.tableData = [{
                        key: 1,
                        index: 1,
                        name: "",
                        rank: "",
                    }, {
                        key: 2,
                        index: 2,
                        name: "",
                        rank: "",
                    }] as any,
                    this.visible = true;
            },
            handleOk(e: any) {
                // this.visible = false;
                let isTrue = this.tableData && this.tableData[0].name && this.tableData[0].rank && this
                    .tableData[1].name && this.tableData[1].rank;
                if (this.typeId && isTrue) {
                    let visitsInfo = [] as any;
                    this.tableData.forEach((ele: any) => {
                        if (ele.name != '') {
                            let obj = {
                                visitName: ele.name,
                                sort: ele.rank,
                            };
                            visitsInfo.push(obj)
                        }
                    });
                    let Batch = {
                        visitType: this.typeId,
                        visitsInfo: visitsInfo,
                    };
                    (this.$parent as any).saveVisitBatch(Batch);
                    this.visible = false;
                } else {
                    let isShowErr = this.typeId == null || !this.tableData[0].name || !this.tableData[0].rank ||
                        !this.tableData[1].name || !this.tableData[1].rank;
                    if ((this.typeId == null && !isTrue) || isShowErr) {
                        if(this.flag){
                            this.$message.warning('请填写必填项');
                            this.flag=false;
                        }
                        
                    }
                    // else if (this.typeId == null) {
                    //     this.$message.warning('请选择访视类型');
                    // } else if (!this.tableData[0].name) {
                    //     this.$message.warning('请输入访视名称');
                    // } else if (!this.tableData[0].rank) {
                    //     this.$message.warning('请输入排序号');
                    // } else if (!this.tableData[1].name) {
                    //     this.$message.warning('请输入访视名称');
                    // } else if (!this.tableData[1].rank) {
                    //     this.$message.warning('请输入排序号');
                    // }
                }
            },
            handleChange(value: any, key: any, column: any) {
                const newData = [...this.tableData]
                const target = newData.filter(item => key === item.key)[0]
                if (target) {
                    target[column] = value
                    this.tableData = newData
                }
            },
            addRun(row: any) {
                let _obj = JSON.parse(JSON.stringify(this.tableDataClone));
                let length = this.tableData.length;
                _obj.key = length + 1;
                _obj.index = length + 1;
                this.tableData.push(_obj);
            },
            delRun(record: any) {
                this.delIndex = record.index;
                this.visibleDel = true;
            },
            handleOkDel() {
                let index = this.delIndex;
                this.tableData.splice(
                    this.tableData.findIndex((item: any) => item.index === index),
                    1
                );
                this.visibleDel = false;
            },

        }
    });
</script>

<style lang="scss">
</style>