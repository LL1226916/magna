(function (entrance) {
    entrance.config = {
        ldapUrl: "https://mttbpms.magna.cn/wso2esb/",
        dockUrl: "https://mttmb.magna.cn/public/question/9e9007c7-c463-4b84-8d0d-686059005992.json",
        dockHistoryUrl: "https://mttmb.magna.cn/public/question/d5dfb63f-7dbd-4bbc-9d7c-a4b4bf82ab17.json",
        bpmsServiceUrl: "https://mttbpms.magna.cn/",
		interviewsInfoUrl: "https://mttmb.magna.cn/public/question/36ec2e16-d24b-46c8-9683-719f9d2bb1ac.json",
        processDefinitionId: "MGVB001:1:332518",
        pdfs: {
            "是": "Magna-承包商进入公司培训.pdf",
            "否": "Magna-访客EHS培训.pdf"
        },
        oAuth2Keys: [
            "UBWw6W08KncRYuAfaNW3sWfVYQsa",//user name for base64 encoding
            "nnO3quzmLOXLlHqdaNVt_ckM1zQa"//password for base64 encoding
        ],
        oAuth2Url: "https://mttid.magna.cn/oauth2/",
        serviceUrl: "https://mttbpms.magna.cn/bpms-rest/service/",
        attachmentUrl: "https://mttbpms.magna.cn/bpms-upload/"
    };
})(window.entrance = window.entrance || {});