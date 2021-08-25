(function (BPMS) {
    //站点配置信息
    BPMS.config = {
        serviceUrl: "https://bpms.mc88vsg6215400.top/bpms-rest/service/",
        attachmentUrl: "https://bpms.mc88vsg6215400.top/bpms-upload/",
        oAuth2Url: "https://identity.mc88vsg6215400.top/oauth2/",
        hrUrl: "https://bpms.mc88vsg6215400.top/hr-rest/",
        collectionUrl: "https://bpms.mc88vsg6215400.top/mongo-rest/ux/ux/",
        draftUrl: "https://bpms.mc88vsg6215400.top/mongo-rest/ux/draft/",
        ldapUrl: "https://bpms.mc88vsg6215400.top/ldap-api/ldap/",
        icsUrl: "https://bpms.mc88vsg6215400.top/ics-notice/",
        oAuth2Keys: [
            "eqr9y7H5dygXrkaZCZtU__6o_A8a",//user name for base64 encoding
            "OjHaBxlUs7ovoUsXtMprqyHmWRsa"//password for base64 encoding
        ],
        httpsServers: [
            "bpms.mc88vsg6215400.top"
        ],
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
        corpId: "wxb253dae93f00f830",
        agentId: "1000011",
        defaultLogin: "eorion",
        email: "develop@mc88vsg6215400.top"
    };
})(window.BPMS = window.BPMS || {});