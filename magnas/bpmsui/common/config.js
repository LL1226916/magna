(function (BPMS) {
    //站点配置信息
    BPMS.config = {
        serviceUrl: "https://mttbpms.magna.cn/bpms-rest/service/",
        attachmentUrl: "https://mttbpms.magna.cn/bpms-upload/",
        oAuth2Url: "https://mttid.magna.cn/oauth2/",
        //hrUrl: "https://mttbpms.magna.cn/neo-hr-api/",
        hrUrl: "https://mttbpms.magna.cn/ldap-api/",
        //collectionUrl: "https://mttbpms.magna.cn/mongo-rest/ux/ux/",
		collectionUrl: "https://mttbpms.magna.cn/mongo-rest/ux/form/",
        dataServiceUrl: "https://my.zhizaozu.com/data/api/",
        accountServiceUrl: "https://my.zhizaozu.com/api/account/",
        draftUrl: "https://mttbpms.magna.cn/mongo-rest/ux/draft/",
		delegateUrl: "https://mttbpms.magna.cn/mongo-rest/ux/delegate/",
        ruleUrl: "https://mttbpms.magna.cn/mongo-rest/ux/rule/",
        ldapUrl: "https://mttbpms.magna.cn/ldap-api/ldap/",
        icsUrl: "https://mttbpms.magna.cn/ics-notice/",
        fileDownloaderUrl: "https://mttbpms.magna.cn/",
        sqlUrl: "https://pdatest.riyingcorp.com/sqlrest/_/sql",
        droolsUrl: "https://mttbpms.magna.cn/decisiontables/v1/fire/",
        sqlUserName: "riying",
        sqlPassword: "tiger",
        erpUrl: "https://pdatest.riyingcorp.com/erpapi/",
        oAuth2Keys: [
            "UBWw6W08KncRYuAfaNW3sWfVYQsa",//user name for base64 encoding
            "nnO3quzmLOXLlHqdaNVt_ckM1zQa"//password for base64 encoding
        ],
        httpsServers: [
            "mttbpms.magna.cn","mttid.magna.cn"
        ],
        icsHeader: {
            "expected-destination": "mailsender"
        },
        //登陆有效期，默认10分钟
        activeTime: 100000,
        pageSize: 10,
        largePageSize: 15,
        RolesMaxLength: 25,
        //auto complete控件的搜索延迟，默认为1000毫秒
        delaySearch: 1000,
        //该参数用以控制登录时用户名的大小写
        //1.保持原样，2.小写，3.大写
        userNameType: 2,
        corpId: "wxb253dae93f00f830",
        agentId: "1000022",
        defaultLogin: "Prt2013!",
        email: "Prt2013!",
		redirectList: [
		    "https://mttbpms.magna.cn",
		    "http://mttbpms.magna.cn"
		],
        treeDataSource: {
            "成本中心_costcenter":"https://mttmb.magna.cn/public/question/bec09445-866e-44ca-a813-4d631e38eb21.json", //成本中心
            "部门_department":"https://mttmb.magna.cn/public/question/bec09445-866e-44ca-a813-4d631e38eb21.json",
            "costcenter_成本中心":"https://mttmb.magna.cn/public/question/bec09445-866e-44ca-a813-4d631e38eb21.json",
            "department_部门":"https://mttmb.magna.cn/public/question/bec09445-866e-44ca-a813-4d631e38eb21.json",
            "equipNo_设备编号":"https://mttmb.magna.cn/public/question/889141fa-fd49-4384-b05b-bfbc70ffbf84.json",
            "area_访问区域": "https://mttmb.magna.cn/public/question/bcda9f7d-8658-460e-8153-318fc8ab58aa.json"


        },
        autoDataSource: {
            "co_加签人": "https://mttmb.magna.cn/public/question/775bf6a4-9ab8-4849-a8eb-81a14ba9adff.json",//magna人员auto
            "apply_申请人": "https://mttmb.magna.cn/public/question/775bf6a4-9ab8-4849-a8eb-81a14ba9adff.json",//magna人员auto
            "apply_实际报销人": "https://mttmb.magna.cn/public/question/775bf6a4-9ab8-4849-a8eb-81a14ba9adff.json",//magna人员auto
            "employeeName_实际申请人": "https://mttmb.magna.cn/public/question/775bf6a4-9ab8-4849-a8eb-81a14ba9adff.json",//magna人员auto
            "员工ID": "https://mttmb.magna.cn/public/question/1bdbbe59-f69e-493e-8f3e-c643b86d15c1.json",//
            "area_访问区域": "https://mttmb.magna.cn/public/question/bcda9f7d-8658-460e-8153-318fc8ab58aa.json"
        },
        tableInitialDataSource: {
            "MAGNA_PROJECT_UPDATE": {"tbhdproject":"https://mttmb.magna.cn/public/question/063c7b2d-a72b-4016-a18f-ee54708575d4.json"},
            "MAGNA_TRAVEL": {"tbhdtravelApply":"https://mttmb.magna.cn/public/question/ea9e9f17-55a5-4fb1-b32a-295d97cf4e9e.json"},
            "MAGNA_PUR": {"tbhdpurApply":"https://mttmb.magna.cn/public/question/84aaedbc-949a-48ff-8fee-8c575842f048.json"},
            "MAGNA_EXPENSE":{"tbhdexpenseApply":"https://mttmb.magna.cn/public/question/84d1fdba-233a-4e9a-b500-cf93978cd09e.json"}
        },
        //启动流程嵌入报表
        createProcessBiQuestionId: {
            "leave_process": 100
        },
        relationDataSource: "https://mttbpms.magna.cn/neo-hr-api/v1/employee/fndeleagators/",
        metabaseSite: "https://mttmb.magna.cn/",
        metabaseKey: "b6cb67669be3305682fa0f46a72d7d0fb75dcba732a88d7cf9b75c7eb3d89cd0",
        personBiQuestionId: 44,//个人流程报表id
        countersignProcess: "countersign"
    };
})(window.BPMS = window.BPMS || {});
