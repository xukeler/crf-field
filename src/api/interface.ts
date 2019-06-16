let testBaseUrl = "//crf.ashermed.cn/api"; 
// let testBaseUrl = "//crf.91trialintern.com/api"; //正式

// let testLoginUrl = 'http://right.ashermed.cn'; //测试登录
let testLoginUrl = '//right.91trial.com'; //正式登录


let testTokenUrl = "https://token.91trial.com";

if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_BASEURL) { // npm run test
    testBaseUrl = process.env.VUE_APP_BASEURL //测试库
  } 
  else { // npm run build
    testBaseUrl = "//crf.ashermed.cn/api";  //开发库
    // testBaseUrl = "//crf.91trialintern.com/api";  
  }
  if(process.env.VUE_APP_PROURL){ //正式库 npm run pro
    testBaseUrl = process.env.VUE_APP_PROURL
  }
  if(process.env.VUE_APP_PROURLTWO){
    testLoginUrl = process.env.VUE_APP_PROURLTWO
  }

};
const postUrl = {
  test: {

    project: testBaseUrl + '/api/Project',
    projectReport: testBaseUrl + '/api/Project/Report',
    projectInfo: testBaseUrl + '/api/Project/Info',
    projectDoc: testBaseUrl + '/api/Project/DownloadDoc',
    module: testBaseUrl + '/api/Module',
    moduleInfo: testBaseUrl + '/api/Module/Info',
    moduleGroupType: testBaseUrl + '/api/Module/Group/Type',
    moduleGroupField: testBaseUrl + '/api/Module/FieldByModuleId',
    moduleOrder: testBaseUrl + "/api/Visit/ModuleOrder",
    moduleFieldOrder: testBaseUrl + "/api/Module/ModuleFieldOrder",
    delModuleField: testBaseUrl + "/api/Module/DelModuleField",
    postMapField: testBaseUrl + '/api/Module/MapField',
    delVisitModule: testBaseUrl + "/api/Visit/DelVisitModule",
    
    visit: testBaseUrl + '/api/Visit',
    visitOrder: testBaseUrl + '/api/Visit/Order',
    copyVisit: testBaseUrl + '/api/Visit/Copy',
    visitAddModule: testBaseUrl + '/api/Visit/Module',
    visitAddBatModule:testBaseUrl+'/api/Visit/BatchModule', // 组内添加模块
    delVisitBatModule :testBaseUrl+'/api/Visit/BatchModule', //删除访视组内的模块
    moveModulesOrder:testBaseUrl+'/api/Visit/ModulesOrder', //访视组内模块移动排序
    field: testBaseUrl + '/api/Field',  //字段相关接口
    fieldInfo: testBaseUrl + '/api/Field/Info',//字段信息
    domain: testBaseUrl + '/api/Domain',
    domainInfo: testBaseUrl + '/api/Domain/Info',
    domainPage: testBaseUrl + "/api/Domain/Page",
    domainTab: testBaseUrl + "/api/Domain/GroupTarname",
    dataType: testBaseUrl + "/api/DataType",
    groupType: testBaseUrl + "/api/GroupType",
    groupDic: testBaseUrl + "/api/GroupDic", // 获取基础维护类别
    groupInfo: testBaseUrl + "/api/GroupType/Info",
    groupTypeInfo: testBaseUrl + "/api/GroupType/Group",

    
    target: testBaseUrl + "/api/domaintype",
    targetInfo: testBaseUrl + "/api/DomainType/Info",
    code: testBaseUrl + "/api/CodeList",
    codePage: testBaseUrl + "/api/CodeList/Page",
    codeInfo: testBaseUrl + "/api/CodeList/Info",
    codeListKVs: testBaseUrl + "/api/CodeList/CodeListKVs",
    linkCodeListKV: testBaseUrl + "/api/CodeList/LinkCodeListKV",
    codeListKV: testBaseUrl + "/api/CodeListKV",
    login: testLoginUrl + '/api/Login/Go',
    GetWebMenu: testLoginUrl+'/api/User/GetWebMenu', // 获取用户Web系统菜单
    getCode: testTokenUrl + '/token/grant',
    getNextVersion: testBaseUrl + '/api/Project/NextVersion', // 获取下一版本号
    setVersion: testBaseUrl + '/api/Project/PublishVersion', // 发布版本
    saveVisitBatch:testBaseUrl+'/api/Visit/Batch', //访视新增
    getQueryAsGroup: testBaseUrl+'/api/Visit/QueryAsGroup', //根据项目Id获取项目及项目下的模块
    getVersionList: testBaseUrl+'/api/Project/VersionList', // 获取该项目的所有历史版本号
    GetByVersion:testBaseUrl+'/api/Project/GetByVersion', // 获取历史版本预览
    

    getFieldByDomain: testBaseUrl + '/api/Module/FieldByDomainIds',//
    moduleGroup: testBaseUrl + '/api/Module/Group',//获取模块列表

    getDiseaselist:testBaseUrl+'/api/Disease',//获取疾病列表
    addDisease:testBaseUrl+'/api/Disease',//保存疾病数据
    delDisease:testBaseUrl+'/api/Disease',//删除疾病数据
    editDisease:testBaseUrl+'/api/Disease',//修改疾病数据

    getUnitList:testBaseUrl+'/api/Unit',//获取单位列表
    addUnit:testBaseUrl+'/api/Unit',//添加单位
    delUnit:testBaseUrl+'/api/Unit',//删除单位
    editUnit:testBaseUrl+'/api/Unit',//修改单位

    getVisitList:testBaseUrl+'/api/Visit/VisitType',//获取访视
    getvisitListOnly:testBaseUrl+'/api/Visit/TypeByProject',//获取只出现一次的访视


    getWidget:testBaseUrl+'/api/Widget',//获取控件列表
    addWidget:testBaseUrl+'/api/Widget',//添加控件
    delWidget:testBaseUrl+"/api/Widget",//删除控件
    editWidget:testBaseUrl+'/api/Widget',//修改控件
    
  },
};
let postUrlEnd = postUrl.test;
export default postUrlEnd;