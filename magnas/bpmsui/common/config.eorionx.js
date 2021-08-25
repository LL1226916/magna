(function (BPMS) {
    //站点配置信息
    BPMS.config = {
        serviceUrl: "https://bpms.eorionsolution.com/bpms-rest/service/",
        attachmentUrl: "https://bpms.eorionsolution.com/bpms-upload/",
        oAuth2Url: "https://is.eorionsolution.com/oauth2/",
        hrUrl: "https://bpms.eorionsolution.com/neo-hr-api/",
        collectionUrl: "https://bpms.eorionsolution.com/mongo-rest/ux/ux/",
        draftUrl: "https://bpms.eorionsolution.com/mongo-rest/ux/draft/",
        ldapUrl: "https://bpms.eorionsolution.com/ldap-api/ldap/",
        icsUrl: "https://bpms.eorionsolution.com/ics-notice/",
        fileDownloaderUrl: "https://commonservices.eorionsolution.com/",
        sqlUrl: "https://pdatest.riyingcorp.com/sqlrest/_/sql",
        droolsUrl: "https://commonservices.eorionsolution.com/decisiontables/v1/fire/",
        sqlUserName: "riying",
        sqlPassword: "tiger",
        erpUrl: "https://pdatest.riyingcorp.com/erpapi/",
        oAuth2Keys: [
            "f6XEDUaGfod50E3TR5wc9Lx2fAYa",//user name for base64 encoding
            "OUFKbm2xYzRqAP5ef_pPS5X0HSwa"//password for base64 encoding
        ],
        httpsServers: [
            "bpms.eorionsolution.com",
            "bpms.eorionsolution.com",
            "web-test.riyingcorp.com",
            "apps.riyingcorp.com"
        ],
        icsHeader: {
            "expected-destination": "mailsender"
        },
        //登陆有效期，默认10分钟
        activeTime: 100000,
        pageSize: 10,
        largePageSize: 13,
        RolesMaxLength: 25,
        //auto complete控件的搜索延迟，默认为1000毫秒
        delaySearch: 1000,
        //该参数用以控制登录时用户名的大小写
        //1.保持原样，2.小写，3.大写
        userNameType: 1,
        corpId: "ww1d29f84c43b940b5",
        agentId: "1000005",
        defaultLogin: "eorion",
        email: "develop@eorionsolution.com",
		redirectList: [
            "https://bpms.eorionsolution.com",
            "http://bpms.eorionsolution.com"
        ],
        treeDataSource: {
            "corp_实体":"https://bpmmb.dipont.com/public/question/c6433432-bde4-42e8-a9b2-c92a65e01651.json",
            "实体_corp":"https://bpmmb.dipont.com/public/question/c6433432-bde4-42e8-a9b2-c92a65e01651.json",
	    "收支项目a_ioitem":"https://bpmmb.dipont.com/public/question/ceadd4c5-dc3b-4334-b54c-fdfa8ff0762e.json",
            "ioitem_收支项目a":"https://bpmmb.dipont.com/public/question/ceadd4c5-dc3b-4334-b54c-fdfa8ff0762e.json",
            "成本中心_costcenter":"https://metabase.eorionsolution.com/public/question/575db5b1-218a-452a-be1e-454c14f5ce68.json",
            "costcenter_成本中心":"https://metabase.eorionsolution.com/public/question/575db5b1-218a-452a-be1e-454c14f5ce68.json",
            "项目_project":"https://bpmmb.dipont.com/public/question/09ddb967-1106-46c3-a058-9f9dab5f04c8.json",
            "project_项目":"https://bpmmb.dipont.com/public/question/09ddb967-1106-46c3-a058-9f9dab5f04c8.json",
            "利润中心_profitacc":"https://bpmmb.dipont.com/public/question/e2a04727-3d84-4b13-af54-a7a3450e542f.json",
            "profitacc_利润中心":"https://bpmmb.dipont.com/public/question/e2a04727-3d84-4b13-af54-a7a3450e542f.json",
            "设备类别_category":"https://bpmmb.dipont.com/public/question/ea11ad88-8f51-482d-9973-cd14d1af31c6.json",
            "category_设备类别":"https://bpmmb.dipont.com/public/question/ea11ad88-8f51-482d-9973-cd14d1af31c6.json",
            "收支项目_ioitem":"https://bpmmb.dipont.com/public/question/d0146b7e-250c-4e47-8da5-0475764b51c2.json",
            "ioitem_收支项目":"https://bpmmb.dipont.com/public/question/d0146b7e-250c-4e47-8da5-0475764b51c2.json",
            "收支项目b_ioitem":"https://bpmmb.dipont.com/public/question/bdaf2f1f-a110-456f-b9b3-bac90d2bcc3c.json",
            "ioitem_收支项目b":"https://bpmmb.dipont.com/public/question/bdaf2f1f-a110-456f-b9b3-bac90d2bcc3c.json",
            "ioitem_收支项目b":"https://bpmmb.dipont.com/public/question/bdaf2f1f-a110-456f-b9b3-bac90d2bcc3c.json",
	    "收支项目c_ioitem":"https://bpmmb.dipont.com/public/question/c0a4230e-db6e-404f-9fa1-027819e21962.json",
            "ioitem_收支项目c":"https://bpmmb.dipont.com/public/question/c0a4230e-db6e-404f-9fa1-027819e21962.json",
	    "收支项目d_ioitem":"https://bpmmb.dipont.com/public/question/3fb3ebf1-f699-412d-b773-314af61ea0af.json",
            "ioitem_收支项目d":"https://bpmmb.dipont.com/public/question/3fb3ebf1-f699-412d-b773-314af61ea0af.json",
	    "收支项目a Payment item_ioitem":"https://bpmmb.dipont.com/public/question/ceadd4c5-dc3b-4334-b54c-fdfa8ff0762e.json",
	    "成本中心 Costcenter_costcenter":"https://metabase.eorionsolution.com/public/question/575db5b1-218a-452a-be1e-454c14f5ce68.json",
	    "项目 Project_project":"https://bpmmb.dipont.com/public/question/09ddb967-1106-46c3-a058-9f9dab5f04c8.json",
	    "设备类别 Equipment Type_category":"https://bpmmb.dipont.com/public/question/ea11ad88-8f51-482d-9973-cd14d1af31c6.json",
	    "收支项目b Payment Item_ioitem":"https://bpmmb.dipont.com/public/question/bdaf2f1f-a110-456f-b9b3-bac90d2bcc3c.json",
	    "电脑及配件型号_cpno":"https://bpmmb.dipont.com/public/question/87419c67-feac-4f5d-8b33-7447031c9fe9.json",
	    "sptype_供应商类别":"https://bpmmb.dipont.com/public/question/2bcc2703-5f7d-4af0-8f2f-8ea5300ea132.json",
	    "department_部门":"https://metabase.eorionsolution.com/public/question/5eb806ea-dd6b-46f5-b750-773530e07c04.json"

        },
        autoDataSource: {
			"差旅申请号_application":"https://bpmmb.dipont.com/public/question/9eb79586-6ff4-4b8b-be70-8bec390640b0.json",
			"application_差旅申请号":"https://bpmmb.dipont.com/public/question/9eb79586-6ff4-4b8b-be70-8bec390640b0.json",
			"contractno_合同编号":"https://bpmmb.dipont.com/public/question/230d2f67-edd7-46cf-86d5-3cba9c8a929b.json",
			"合同编号_contractno":"https://bpmmb.dipont.com/public/question/230d2f67-edd7-46cf-86d5-3cba9c8a929b.json",
			"vendor_供应商":"https://bpmmb.dipont.com/public/question/892f6b2e-2872-4a39-b63b-a1beb31926f9.json",
			"供应商_vendor":"https://bpmmb.dipont.com/public/question/892f6b2e-2872-4a39-b63b-a1beb31926f9.json",
			"借款余额_borrow":"http://192.168.50.238:3000/public/question/c7f2f7fb-09b9-495b-994c-0babd2b89393.json",
			"borrow_借款余额":"http://192.168.50.238:3000/public/question/c7f2f7fb-09b9-495b-994c-0babd2b89393.json",
			"差旅申请号 Travel Request No_application":"https://bpmmb.dipont.com/public/question/9eb79586-6ff4-4b8b-be70-8bec390640b0.json",
			"供应商 Vendor_vendor":"https://bpmmb.dipont.com/public/question/892f6b2e-2872-4a39-b63b-a1beb31926f9.json",
			"vendoraccount_供应商":"https://bpmmb.dipont.com/public/question/ae9b9d11-0320-477d-b5c2-e0e1225f067e.json"//供应商账户
			
        },        
	relationDataSource: "https://bpms.eorionsolution.com/neo-hr-api/v1/employee/fndeleagators/"
    };
})(window.BPMS = window.BPMS || {});
