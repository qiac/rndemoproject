 /**
 * 生产环境
 * **/
//Domain_mps = 'http://gk.mlp5plus.gikoo.cn/', //MPS domain
//Domain_job = 'http://job.gikoo.cn/', //gikoo5 domain
//API_PREFIX = 'api/v1/';//目录

/**
 * 测试环境
 * **/
const Domain_mps = 'http://gk.mps5dev.gikoo.cn/',//MPS domain
    Domain_job = 'http://mps5job.gikoo.cn/', //gikoo5 domain
    API_PREFIX = 'api/v1/';//目录

module.exports = {

    //性别
    GENDER : ['男','女'],
    //密码常量
    ENCRYPT_MAGIC_CODE : 'gikoo@2013',

    //申请列表
    ApplyListURL : Domain_job + API_PREFIX + 'recruit/application/',

    //岗位列表/详情
    PositionListURL : Domain_job + API_PREFIX + 'recruit/position/',

    //岗位详情 - 用人需求列表
    PositionDetailURL : Domain_job + API_PREFIX + 'recruit/job/advanced/',
    //海报
    PositionReportURL : Domain_job + API_PREFIX + 'recruit/position/',

    //推荐人列表
    HandlerListURL : Domain_job + API_PREFIX + 'poster/fragment/?position=',

    //录用/拒绝/推荐
    OperateURL : Domain_job + API_PREFIX + 'recruit/operate/',

    //收藏
    FavorURL : Domain_job + API_PREFIX + 'recruit/favorites/op/',


    /******************************************/
    /********** Strict Interface URL **********/
    /******************************************/

    // 登录接口
    LOGIN_URL: Domain_mps + API_PREFIX + 'user/login/',

    // 登出接口
    LOGOUT_URL: Domain_mps + API_PREFIX + 'user/logout/',

    // 应聘申请 - 岗位
    JOB_LIST_URL: Domain_job + API_PREFIX + 'recruit/position/',

    // 应聘申请 - 门店
    STORE_LIST_URL: Domain_job + API_PREFIX + 'recruit/store/',

    // 账号详情
    ACCOUNT_INFO_URL: Domain_mps + API_PREFIX + 'user/myaccount-info/',

    // 我的员工列表
    MY_EMPLOYEE_URL: Domain_mps + API_PREFIX + 'user/account/?same_org=1',
};
