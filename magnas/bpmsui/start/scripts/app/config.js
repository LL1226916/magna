(function (entrance) {
    entrance.config = {
        ldapUrl: "https://bpms.mc88vsg6215400.top/ldap-api/",
        dockUrl: "https://dashboard.mc88vsg6215400.top/public/question/3fb001b9-8e01-4771-8bd9-57b88be22adf.json",
        dockHistoryUrl: "https://dashboard.mc88vsg6215400.top/public/question/4a0de9ed-883d-472d-8742-69e0c9a45802.json",
        bpmsServiceUrl: "https://visit.mc88vsg6215400.top/",
        processDefinitionId: "",
        pdfs: {
            "是": "Magna-承包商进入公司培训.pdf",
            "否": "Magna-访客EHS培训.pdf"
        },
        oAuth2Keys: [
            "eqr9y7H5dygXrkaZCZtU__6o_A8a",//user name for base64 encoding
            "OjHaBxlUs7ovoUsXtMprqyHmWRsa"//password for base64 encoding
        ],
        oAuth2Url: "https://identity.mc88vsg6215400.top/oauth2/",
        serviceUrl: "https://bpms.mc88vsg6215400.top/bpms-rest/service/"
    };
})(window.entrance = window.entrance || {});