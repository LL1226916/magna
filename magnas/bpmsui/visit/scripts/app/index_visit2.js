(function ($, ko, entrance) {
    var IndexViewModel = function () {
        //this.keyword = ko.observable("");//13621980587
        //this.tel = ko.observable("");
        //this.name = ko.observable("");
        //this.corp = ko.observable("");
        //this.isEnterWorkshop = ko.observable("");
        //this.carId = ko.observable("");
        //this.editingName = ko.observable("");
        //this.editingCorp = ko.observable("");
        //this.interviewee = ko.observable();
        //this.processInstanceId = ko.observable("");
        //this.department = ko.observable("");
		//
		//
		//
        //this.read = {
        //    id: "read",
        //    name: "",
        //    disabled: ko.observable(true),
        //    value: ko.observable(),
        //    controlType: "cbv",
        //    readable: true,
        //    writable: true,
        //    required: false,
        //    enumValues: [{
        //        "id": "我已经阅读安全须知",
        //        "name": "我已经阅读安全须知"
        //    }],
        //    seq: 1,
        //    fieldType: "string",
        //};
        this.options = [{
            id: "corp",
            name: "1.您所在的公司名称",
            value: ko.observable(),
            controlType: "t1",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 1,
            fieldType: "string"
        }, 
		{
            id: "name",
            name: "2.您的姓名",
            value: ko.observable(),
            controlType: "t1",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 2,
            fieldType: "string"
        },
        {
            id: "idcard",
            name: "3.您的身份证号码",
            value: ko.observable(),
            controlType: "t1",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 3,
            fieldType: "string"
        },         
		{
            id: "tel",
            name: "4.您的手机号码",
            value: ko.observable(),
            controlType: "t10",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 4,
            fieldType: "string"
        },
		{
            id: "condep",
            name: "5.您需要拜访/联系的我司部门",
            value: ko.observable(),
            controlType: "t1",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 5,
            fieldType: "string"
        },
		{
            id: "conname",
            name: "6.您需要拜访/联系的我司接洽人姓名",
            value: ko.observable(),
            controlType: "t1",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 6,
            fieldType: "string"
        },
        {
            id: "intotime",
            name: "7.您进入我司的日期",
            value: ko.observable(),
            controlType: "t3",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 7,
            fieldType: "string",
        },
        {
            id: "stayfrom",
            name: "8.您预计在我司的停留时间 从",
            value: ko.observable(),
            controlType: "t5",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 8,
            fieldType: "string",
        },		
        {
            id: "stayto",
            name: "至",
            value: ko.observable(),
            controlType: "t5",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 9,
            fieldType: "string",
        },			
        {
            id: "tohubei",
            name: "9.自2020年1月起，您或您家人是否到过，或者途径"+
			"<font size='-1' color='red'>湖北全省各市/浙江省温州市、台州市、杭州市、宁波市/河南省信阳市、驻马店市/安徽省合肥市、阜阳市/江西省南昌市</font>"+
			"等重点疫区（疫区的变化将根据政府发布的信息及时更新）",
            value: ko.observable(""),
            controlType: "rbv",
            readable: true,
            writable: true,
            required: true,
            enumValues: [{
                "id": "是",
                "name": "是"
            },
            {
                "id": "否",
                "name": "否"
            }],
            seq: 10,
            fieldType: "string",
        },
        {
            id: "concathubei",
            name: "10.自2020年1月起，您或者您同住家人是否与来自"+
			"<font size='-1' color='red'>湖北全省各市/浙江省温州市、台州市、杭州市、宁波市/河南省信阳市、驻马店市/安徽省合肥市、阜阳市/江西省南昌市</font>"+
			"等重点疫区（疫区的变化将根据政府发布的信息及时更新）",
            value: ko.observable(""),
            controlType: "rbv",
            readable: true,
            writable: true,
            required: true,
            enumValues: [{
                "id": "是",
                "name": "是"
            },
            {
                "id": "否",
                "name": "否"
            }],
            seq: 11,
            fieldType: "string",
        },
        {
            id: "health",
            name: "11.您及与您同住的家人目前健康状况",
            value: ko.observable(""),
            controlType: "rbv",
            readable: true,
            writable: true,
            required: true,
            enumValues: [{
                "id": "正常，无任何疾病症状",
                "name": "正常，无任何疾病症状"
            },
            {
                "id": "有咳嗽或流涕或发烧症状",
                "name": "有咳嗽或流涕或发烧症状"
            },
            {
                "id": "家人有确诊为新冠状感染",
                "name": "家人有确诊为新冠状感染"
            },
            {
                "id": "居家隔离观察中",
                "name": "居家隔离观察中"
            },
            {
                "id": "当地医疗机构隔离观察中",
                "name": "当地医疗机构隔离观察中"
            }],
            seq: 12,
            fieldType: "string",
        },
        {
            id: "isolationfrom",
            name: "12.如果您曾经被隔离，请告知隔离开始的时间",
            value: ko.observable(),
            controlType: "t3",
            readable: true,
            writable: true,
            required: false,
            enumValues: [],
            seq: 13,
            fieldType: "string",
        },
        {
            id: "isolationto",
            name: "13.如果您曾经被隔离，请告知解除隔离的时间",
            value: ko.observable(),
            controlType: "t3",
            readable: true,
            writable: true,
            required: false,
            enumValues: [],
            seq: 14,
            fieldType: "string",
        },
        {
            id: "memo",
            name: "14.针对以上一系列问题，如有补充说明，请填写",
            value: ko.observable(),
            controlType: "t1",
            readable: true,
            writable: true,
            required: false,
            enumValues: [],
            seq: 15,
            fieldType: "string"
        },
        {
            id: "promise",
            name: "15.此项目的勾选，标识您承诺以上提供的信息均真实可靠，如有不实，您将承担由此而带来的一些后果及法律责任",
            value: ko.observable(""),
            controlType: "rbv",
            readable: true,
            writable: true,
            required: true,
            enumValues: [{
                "id": "本人已如实申报，请承诺信息真实",
                "name": "本人已如实申报，请承诺信息真实"
            }],
            seq: 16,
            fieldType: "string",
        },
        {
            id: "rule",
            name: "16.进入公司工作，您承诺遵守本公司制定的疫情防控的相关规定："+
			"\n1）进入工厂门卫处，需接受门卫体温检测；低于37.3°方可进入公司。"+
			"\n2)  进入厂区后，全程佩戴口罩和护目镜或眼镜，做好个人防护。"+
			"\n3)  业务人员将带领您进入指定会晤区域，严禁在无人陪同的情况下自行走动，如发现，将被立刻请离我司"+
			"\n4)  业务会晤结束后，由我司接洽业务人员将您送出厂区"+
			"\n5)  防疫特殊时期，我司不安排外来人员就餐\n",
            value: ko.observable(""),
            controlType: "rbv",
            readable: true,
            writable: true,
            required: true,
            enumValues: [{
                "id": "本人会积极配合贵司做到以上防控措施。",
                "name": "本人会积极配合贵司做到以上防控措施。"
            }],
            seq: 17,
            fieldType: "string",
        }
		];


        this.init = function () {
            if (location.hash) {
                window.location.href = window.location.href.replace(location.hash, "");
            }

        };

        //this.nextOptions = function () {
        //    if (this.name()) {
        //        $.mobile.changePage("#options");
        //    } else {
        //        this.editProfile();
        //    }
        //};
        //this.nextTerms = function () {
        //    var that = this;
        //    if (!BPMS.Services.Utils.validateFields(this.options)) {
        //        that.show({
        //            title: "输入错误",
        //            message: "您的输入有误，请重新输入。"
        //        });
        //        return;
        //    }
        //    var hasHistory = this.records().length > 0;
        //    var hasEnter = this.isEnterWorkshop().toString() === true.toString();
        //    var chooseEnter = this.options[4].value() === "是";
        //    var needTerms = !hasHistory || !hasEnter && chooseEnter;
        //    if (needTerms) {
        //        $.mobile.changePage("#terms");
        //        if (that.timeoutHandler) {
        //            clearTimeout(that.timeoutHandler);
        //        }
        //        that.timeoutHandler = setTimeout(function () {
        //            that.read.disabled(false);
        //        }, chooseEnter ? 20 * 1000 : 15 * 1000);
        //    } else {
        //        this.save();
        //    }
        //};
        //this.editProfile = function () {
        //    this.editingName(this.name());
        //    this.editingCorp(this.corp());
        //    $("#popupEdit").popup("open");
        //};
        //this.confirmProfile = function () {
        //    var name = this.editingName().trim();
        //    var corp = this.editingCorp().trim();
        //    if (!name || !corp) {
        //        return;
        //    }
        //    this.name(name);
        //    this.corp(corp);
        //    $("#popupEdit").popup("close");
        //};
        //this.selectRecord = function (item) {
        //    $.mobile.changePage("#options");
        //    this.interviewee(null);
        //    var reasonItem = this.options[0].enumValues.filter(function (value) {
        //        return value.id === item.VISIT_REASON;
        //    });
        //    this.options[0].value(reasonItem.length ? item.VISIT_REASON : null);
        //    this.options[1].value(item.INTERVIEWEE_NAME);
        //    this.options[3].value(this.carId());
        //
        //    $("#interviewee").trigger("input");
        //}
        //this.search = function () {
        //    var that = this;
        //
        //    var keyword = (this.keyword() || "").trim();
        //    if (!keyword) {
        //        return;
        //    }
        //    that.loading();
        //    entrance.service.getInterviews(keyword).then(function (data) {
        //        that.loading(false);
        //
        //        that.tel(data.INTERVIEWER_TEL);
        //        if (!that.tel()) {
        //            that.tel(keyword);
        //        }
        //        that.name(data.INTERVIEWER_NAME);
        //        that.corp(data.INTERVIEWER_CORP);
        //        that.carId(data.CAR_ID);
        //        that.isEnterWorkshop(data.IS_ENTER_WORKSHOP);
        //        that.records(data.VISIT_RECORDS);
        //        that.keyword("");
        //        $.mobile.changePage("#profile");
        //    }, function () {
        //        that.loading(false);
        //        that.show({
        //            title: "查询失败",
        //            message: "接口调用错误。"
        //        });
        //    });
        //};
        //
        //this.keydown = function (data, e) {
        //    var element = $(e.target);
        //    var value = element.val().trim();
        //    if ((!e.keyCode || e.keyCode === 13) && value) {
        //        this.tel(value);
        //        this.search();
        //    }
        //    return true;
        //};
        this.save = function () {
            var that = this;
            if (!BPMS.Services.Utils.validateFields(this.options)) {
                that.show({
                    title: "输入错误",
                    message: "您的输入有误，请重新输入。"
                });
                return;
            }
            this.loading();
           
            var url = window.location.href.replace(location.hash, "");
            //var processDefinitionId = BPMS.Services.Utils.getUrlParam(url, "processDefinitionId") || entrance.config.processDefinitionId;
			var processDefinitionId = BPMS.Services.Utils.getUrlParam(url, "surveyDefinitionId");
            var data = {
                businessKey: "疫情调查报告(访客)",
                processDefinitionId: processDefinitionId,
                properties: [
                    { id: "corp_公司_1_string_t1_$$A", value: that.options[0].value() },
                    { id: "name_姓名_2_string_t1_$$A",  value: that.options[1].value() },
					{ id: "idcard_身份证_3_string_t1_$$A", value: that.options[2].value() },
					{ id: "tel_手机号_4_string_t10_$$A", value: that.options[3].value() },
					{ id: "condep_拜访部门_5_string_t1_$$A", value: that.options[4].value() },
					{ id: "conname_接洽人姓名_6_string_t1_$$A", value: that.options[5].value() },
					{ id: "intotime_进入公司日期_7_string_t3_$$A", value: that.options[6].value() },
					{ id: "stayfrom_停留时间从_8_string_t5_$$A", value: that.options[7].value() },
					{ id: "stayto_停留时间至_9_string_t5_$$A", value: that.options[8].value() },
					{ id: "tohubei_是否去过湖北_10_enum_sbs_$$A", value: that.options[9].value() },
					{ id: "concathubei_是否接触过湖北_11_enum_sbs_$$A", value: that.options[10].value() },
					{ id: "health_健康状况_12_enum_sbs_$$A", value: that.options[11].value() },
					{ id: "isolationfrom_隔离开始时间_13_string_t3_$$A", value: that.options[12].value() },
					{ id: "isolationto_解除隔离时间_14_string_t3_$$A", value: that.options[13].value() },
					{ id: "memo_说明_15_string_t1_$$A", value: that.options[14].value() }
					]
            };



			entrance.service.postFormData(data).then(function (result) {
				if( that.options[11].value() != "正常，无任何疾病症状" || that.options[9].value() == "是" || that.options[10].value() == "是") {					var detailMessage = "禁止进入，马上隔离";
					that.show({
						"title": "",
						"subTitle": "",
						"message": "" + detailMessage,
						"code": ""
					});
				}else {
					
					window.location.href = 'index.html?processDefinitionId=' + BPMS.Services.Utils.getUrlParam(url, "processDefinitionId") + '&tel=' + that.options[3].value() ;
				}
				that.loading(false);
            }, function (err) {
                var detailMessage = (err && err.responseJSON && err.responseJSON.exception) || "该请求无法成功处理，请稍后重试";
                that.show({
                    "title": "流程启动失败",
                    "subTitle": "疫情问卷调查流程",
                    "message": "错误信息：" + detailMessage,
                    "code": "错误代码：" + err.status + " " + err.statusText
                });
                that.loading(false);

            });
			

        };
    };
    IndexViewModel.extend(entrance.BaseViewModel);

    $(function () {
        var viewModel = new IndexViewModel();
        viewModel.init();
        window.vm = viewModel;

        ko.applyBindings(viewModel);
        $("#popupError,#popupSuccess").enhanceWithin().popup();
        $(document).on("pageshow", "#profile,#terms,#options,#success", function () {
            if (!viewModel.tel()) {
                // $.mobile.changePage("#");
                viewModel.init();
            }
        });
        $("#interviewee").parent('.ui-input-has-clear').on("click", ".ui-input-clear", function (e) {
            viewModel.options[1].value("");
            viewModel.interviewee(null);
        });
    });
})($, ko, window.entrance = window.entrance || {});