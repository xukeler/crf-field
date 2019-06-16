import postUrlEnd from './interface';
import {
  get,
  post,
  del,
  patch,
  delData
} from '../axiosConfig';
export default {
  getProject(params: any) {
    return get(postUrlEnd.project, params);
  },
  getProjectDoc(params: any) {
    return get(postUrlEnd.projectDoc, params);
  },
  upProject(params: any) {
    return patch(postUrlEnd.project, params);
  },
  postProject(params: any) {
    return post(postUrlEnd.project, params);
  },
  delProject(params: any) {
    return del(postUrlEnd.project, params);
  },
  projectReport(params: any) {
    return get(postUrlEnd.projectReport, params);
  },
  getProjectInfo(params: any) {
    return get(postUrlEnd.projectInfo, params);
  },
  getModule(params: any) {
    return get(postUrlEnd.module, params);
  },
  postModuleDia(params: any) {
    return post(postUrlEnd.module, params);
  },
  delModule(params: any) {
    return del(postUrlEnd.module, params);
  },
  postMapField(params: any) {
    return post(postUrlEnd.postMapField, params);
  },
  getModuleInfo(params: any) {
    return get(postUrlEnd.moduleInfo, params);
  },
  getModuleGroupType(params: any) {
    return get(postUrlEnd.moduleGroupType, params);
  },
  getModuleGroup(params: any) {
    return get(postUrlEnd.moduleGroup, params);
  },
  getModuleGroupField(params: any) {
    return get(postUrlEnd.moduleGroupField, params);
  },
  getFieldByDomain(params: any) {
    return post(postUrlEnd.getFieldByDomain, params);
  },
  postModule(params: any) {
    return post(postUrlEnd.visitAddModule, params);
  },
  delModuleField(params: any) {
    return post(postUrlEnd.delModuleField, params);
  },
  moduleOrder(params: any) {
    return post(postUrlEnd.moduleOrder, params);
  },
  moduleFieldOrder(params: any) {
    return post(postUrlEnd.moduleFieldOrder, params);
  },
  visitOrder(params: any) {
    return post(postUrlEnd.visitOrder, params);
  },
  postVisit(params: any) {
    return post(postUrlEnd.visit, params);
  },
  getVisit(params: any) {
    return get(postUrlEnd.visit, params);
  },
  upVisit(params: any) {
    return patch(postUrlEnd.visit, params);
  },
  copyVisit(params: any) {
    return post(postUrlEnd.copyVisit, params);
  },
  delVisit(params: any) {
    return del(postUrlEnd.visit, params);
  },
  delVisitModule(params: any) {
    return post(postUrlEnd.delVisitModule, params);
  },
  getField(params: any) {
    return get(postUrlEnd.field, params);
  },
  postField(params: any) {
    return post(postUrlEnd.field, params);
  },
  updateField(params: any) {
    return patch(postUrlEnd.field, params);
  },
  delField(params: any) {
    return del(postUrlEnd.field, params);
  },
  getFieldInfo(params: any) {
    return get(postUrlEnd.fieldInfo, params);
  },
  getDomain(params: any) {
    return get(postUrlEnd.domain, params);
  },
  getDomainInfo(params: any) {
    return get(postUrlEnd.domainInfo, params);
  },
  postDomain(params: any) {
    return post(postUrlEnd.domain, params);
  },
  delDomain(params: any) {
    return del(postUrlEnd.domain, params);
  },
  patchDomain(params: any) {
    return patch(postUrlEnd.domain, params);
  },
  getDomainPage(params: any) {
    return get(postUrlEnd.domainPage, params);
  },
  getDomainTab(params: any) {
    return get(postUrlEnd.domainTab, params);
  },
  getDataType(params: any) {
    return get(postUrlEnd.dataType, params);
  },
  getGroupType(params: any) {
    return get(postUrlEnd.groupType, params);
  },
  getGroupDic(params: any) {
    return get(postUrlEnd.groupDic, params);
  },
  getGroupInfo(params: any) {
    return get(postUrlEnd.groupInfo, params);
  },
  postGroupType(params: any) {
    return post(postUrlEnd.groupType, params);
  },
  delGroupType(params: any) {
    return del(postUrlEnd.groupType, params);
  },
  patchGroupType(params: any) {
    return patch(postUrlEnd.groupType, params);
  },
  getGroupTypeInfo(params: any) {
    return get(postUrlEnd.groupTypeInfo, params);
  },
  getCodeList(params: any) {
    return get(postUrlEnd.code, params);
  },
  postCodeList(params: any) {
    return post(postUrlEnd.code, params);
  },
  patchCodeList(params: any) {
    return patch(postUrlEnd.code, params);
  },
  getCodeListPage(params: any) {
    return get(postUrlEnd.codePage, params);
  },
  getCodeInfo(params: any) {
    return get(postUrlEnd.codeInfo, params);
  },
  patchCode(params: any) {
    return patch(postUrlEnd.code, params);
  },
  delCode(params: any) {
    return del(postUrlEnd.code, params);
  },
  getCodeListKVs(params: any) {
    return get(postUrlEnd.codeListKVs, params);
  },
  getTarget(params: any) {
    return get(postUrlEnd.target, params);
  },
  postTarget(params: any) {
    return post(postUrlEnd.target, params);
  },
  delTarget(params: any) {
    return del(postUrlEnd.target, params);
  },
  patchTarget(params: any) {
    return patch(postUrlEnd.target, params);
  },
  getTargetInfo(params: any) {
    return get(postUrlEnd.targetInfo, params);
  },
  postLinkCodeListKV(params: any) {
    return post(postUrlEnd.linkCodeListKV, params);
  },
  delCodeListKV(params: any) {
    return del(postUrlEnd.codeListKV, params);
  },
  getNextVersion(params: any) {
    return get(postUrlEnd.getNextVersion, params);
  },
  setVersion(url: any) {
    return post(url,null);
  },
  saveVisitBatch(params:any){
    return post(postUrlEnd.saveVisitBatch, params);
  },
  getQueryAsGroup(params:any){
    return get(postUrlEnd.getQueryAsGroup, params);
  },
  visitAddBatModule(params: any) {
    return post(postUrlEnd.visitAddBatModule, params);
  },
  delVisitBatModule(params: any) {
    return delData(postUrlEnd.delVisitBatModule, params);
  },
  moveModulesOrder(params: any) {
    return post(postUrlEnd.moveModulesOrder, params);
  },
  GetWebMenu(params:any){
    return get(postUrlEnd.GetWebMenu, params);
  },
  getVersionList(params:any){
    return get(postUrlEnd.getVersionList, params);
  },
  GetByVersion(params:any){
    return get(postUrlEnd.GetByVersion, params);
  },



  getDiseaseList(params:any){
    return get(postUrlEnd.getDiseaselist,params)
  },
  addDisease(params:any){
    return post(postUrlEnd.addDisease,params)
  },
  delDisease(params:any){
    return del(postUrlEnd.delDisease,params)
  },
  editDisease(params:any){
    return patch(postUrlEnd.editDisease,params)
  },

  getUnitList(params:any){
    return get(postUrlEnd.getUnitList,params)
  },
  addUnit(params:any){
    return post(postUrlEnd.addUnit,params)
  },
  delUnit(params:any){
    return del(postUrlEnd.delUnit,params)
  },
  editUnit(params:any){
    return patch(postUrlEnd.editUnit,params)
  },


  getVisitList(params:any){
    return get(postUrlEnd.getVisitList,params)
  },
  getvisitListOnly(params:any){
    return get(postUrlEnd.getvisitListOnly,params)
  },

  getWidget(params:any){
    return get(postUrlEnd.getWidget,params)
  },
  addWidget(params:any){
    return post(postUrlEnd.addWidget,params)
  },
  delWidget(params:any){
    return del(postUrlEnd.delWidget,params)
  },
  editWidget(params:any){
    return patch(postUrlEnd.editWidget,params)
  }
};