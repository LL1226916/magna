(function (entrance) {
    entrance.config = {
        ldapUrl: "https://bpms.eorionsolution.com/ldap-api/",
        dockUrl: "",
        dockHistoryUrl: "",
        bpmsServiceUrl: "https://bpms.eorionsolution.com/",
        processDefinitionId: "MGVB001:2:270822",
        pdfs: {
            "是": "Magna-承包商进入公司培训.pdf",
            "否": "Magna-访客EHS培训.pdf"
        },
        oAuth2Keys: [
            "rssmvGW23R7vFsmASOgXRJQMk3Ea",//user name for base64 encoding
            "QWWRNdHNo3uK1ABWRQ_w9sXcBg0a"//password for base64 encoding
        ],
        oAuth2Url: "https://is.eorionsolution.com/oauth2/",
        serviceUrl: "https://bpms.eorionsolution.com/bpms-rest/service/",
        attachmentUrl: "https://bpms.eorionsolution.com/bpms-upload/"
    };
})(window.entrance = window.entrance || {});