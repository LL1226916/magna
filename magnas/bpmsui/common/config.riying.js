(function (BPMS) {
    //站点配置信息
    BPMS.config = {
        serviceUrl: "https://bpmsui.riyingcorp.com/bpms-rest/service/",
        attachmentUrl: "https://bpms.eorionsolution.com/bpms-upload/",
        oAuth2Url: "https://identity.riyingcorp.com/oauth2/",
        hrUrl: "https://bpmsui.riyingcorp.com/hr-rest/",
        collectionUrl: "https://bpms.eorionsolution.com/mongo-rest/ux/york/",
        draftUrl: "https://bpms.eorionsolution.com/mongo-rest/ux/draft/",
        ldapUrl: "https://bpmsui.riyingcorp.com/ldap-api/ldap/",
        icsUrl: "https://bpms.eorionsolution.com/ics-notice/",
        fileDownloaderUrl: "https://web-test.riyingcorp.com/file-downloader/v1",
        sqlUrl: "https://pdatest.riyingcorp.com/sqlrest/_/sql",
        droolsUrl: "https://commonservices.riyingcorp.com/decisiontables/v1/fire/",
        sqlUserName: "riying",
        sqlPassword: "tiger",
        erpUrl: "https://pdatest.riyingcorp.com/erpapi/",
        oAuth2Keys: [
            "s3_X8Y3ovwpqbtnZDBtvRAEZRfka",//user name for base64 encoding
            "fpRATsacVwlmN3fU8Zea4uu84eEa"//password for base64 encoding
        ],
        httpsServers: [
            "bpmsui.riyingcorp.com",
            "bpmswx.riyingcorp.com",
            "web-test.riyingcorp.com",
            "apps.riyingcorp.com"
        ],
        icsHeader: {
            "expected-destination": "mailsender"
        },
        //登陆有效期，默认10分钟
        activeTime: 100000,
        pageSize: 5,
        largePageSize: 10,
        RolesMaxLength: 15,
        //auto complete控件的搜索延迟，默认为1000毫秒
        delaySearch: 1000,
        //该参数用以控制登录时用户名的大小写
        //1.保持原样，2.小写，3.大写
        userNameType: 2,
        corpId: "wx264e6e1c363c395f",
        agentId: "1000002",
        defaultLogin: "eorion",
        email: "no-reply@riyingcorp.com",
        treeDataSource: {

        },
        autoDataSource: {

        },
        relationDataSource: "https://bpmsui.riyingcorp.com/neo-hr-api/v1/employee/fndeleagators/"
    };
})(window.BPMS = window.BPMS || {});