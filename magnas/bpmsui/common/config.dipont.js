(function (BPMS) {
    //站点配置信息
    BPMS.config = {
        serviceUrl: "https://bpm.dipont.com/bpms-rest/service/",
        attachmentUrl: "https://bpm.dipont.com/bpms-upload/",
        oAuth2Url: "https://bpmis.dipont.com/oauth2/",
        hrUrl: "https://bpm.dipont.com/hr-rest/",
        collectionUrl: "https://bpm.dipont.com/mongo-rest/ux/ux/",
        draftUrl: "https://bpm.dipont.com/mongo-rest/ux/draft/",
        ldapUrl: "https://bpm.dipont.com/ldap-api/ldap/",
        icsUrl: "https://bpm.dipont.com/ics-notice/",
        fileDownloaderUrl: "https://bpmcs.dipont.com/",
        droolsUrl: "https://bpmcs.dipont.com/decisiontables/v1/fire/",
        oAuth2Keys: [
            "rssmvGW23R7vFsmASOgXRJQMk3Ea",//user name for base64 encoding
            "QWWRNdHNo3uK1ABWRQ_w9sXcBg0a"//password for base64 encoding
        ],
        httpsServers: [
            "bpm.dipont.com"
        ],
        icsHeader: {
            "expected-destination": "mailsender"
        },
        //登陆有效期，默认10分钟
        activeTime: 100000,
        pageSize: 5,
        largePageSize: 7,
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
        treeDataSource: {
            "ioitem_收支项目": "https://bpmmb.dipont.com/public/question/04a6a563-0c98-4f16-be13-8c5a5cdb34a9.json",
            "costcenter_成本中心": "https://bpmmb.dipont.com/public/question/aa598c0c-3d7b-46a1-a807-30a1354b0053.json",
            "project_项目": "https://bpmmb.dipont.com/public/question/04a6a563-0c98-4f16-be13-8c5a5cdb34a9.json",
            "成本中心_costcenter": "https://bpmmb.dipont.com/public/question/aa598c0c-3d7b-46a1-a807-30a1354b0053.json",
            "项目_project": "https://bpmmb.dipont.com/public/question/04a6a563-0c98-4f16-be13-8c5a5cdb34a9.json",
            "实体_corp": "https://bpmmb.dipont.com/public/question/34405697-7069-4548-b1df-8ede6a2487bd.json",
            "收支项目_ioitem": "https://bpmmb.dipont.com/public/question/2d3c89ff-6ff5-4d68-a84f-4edf35d0999d.json",
            "设备类别_category": "https://bpmmb.dipont.com/public/question/4f46434c-d19f-4546-9285-0939bb0ffe5f.json"
        },
        autoDataSource: {
            "costcenter_成本中心": "https://bpmmb.dipont.com/public/question/c2ec69a9-71bc-4a50-9e00-526ee3806ce5.json",
            "contractno_合同编号": "https://bpmmb.dipont.com/public/question/1dea475f-82ca-4882-b931-30e09f8fece0.json",
            "vendor_供应商": "https://bpmmb.dipont.com/public/question/97107a1b-4415-43f2-a412-3cc0a901d338.json"
        },
        relationDataSource: "https://bpm.dipont.com/hr-dp-api/v1/employee/fndeleagators/"

    };
})(window.BPMS = window.BPMS || {});