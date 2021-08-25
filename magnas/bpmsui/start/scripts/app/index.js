(function ($, ko, entrance) {
    var IndexViewModel = function () {
        this.keyword = ko.observable("");//13621980587
        this.tel = ko.observable("");
        this.name = ko.observable("");
        this.corp = ko.observable("");
        this.isEnterWorkshop = ko.observable("");
        this.carId = ko.observable("");
        this.editingName = ko.observable("");
        this.editingCorp = ko.observable("");
        this.interviewee = ko.observable();
        this.processInstanceId = ko.observable("");
        this.department = ko.observable("");
        this.read = {
            id: "read",
            name: "",
            disabled: ko.observable(true),
            value: ko.observable(),
            controlType: "cbv",
            readable: true,
            writable: true,
            required: false,
            enumValues: [{
                "id": "我已经阅读安全须知",
                "name": "我已经阅读安全须知"
            }],
            seq: 1,
            fieldType: "string",
        },
            this.options = [{
                id: "businessKey",
                name: "拜访事由",
                value: ko.observable(),
                controlType: "sbs",
                readable: true,
                writable: true,
                required: true,
                enumValues: [
                    {
                        "id": "访客管理：供应商拜访",
                        "name": "供应商拜访"
                    },
                    {
                        "id": "访客管理：仓库取送货",
                        "name": "仓库取送货"
                    },
                    {
                        "id": "访客管理：施工",
                        "name": "施工"
                    }, {
                        "id": "访客管理：面试",
                        "name": "面试"
                    },
                    {
                        "id": "访客管理：其它",
                        "name": "其它"
                    }
                ],
                seq: 1,
                fieldType: "string"
            }, {
                id: "interviewee",
                name: "受访人",
                placeholder: "搜索被访人...",
                value: ko.observable(),
                controlType: "psbn",
                readable: true,
                writable: true,
                required: true,
                enumValues: [],
                seq: 2,
                fieldType: "string"
            }, {
                id: "interviewerNumber",
                name: "访客人数",
                value: ko.observable(),
                controlType: "t6",
                readable: true,
                writable: true,
                required: true,
                enumValues: [],
                seq: 3,
                fieldType: "string"
            },
            {
                id: "carId",
                name: "车牌号",
                value: ko.observable(),
                controlType: "t1",
                readable: true,
                writable: true,
                required: false,
                enumValues: [],
                seq: 4,
                fieldType: "string"
            }, {
                id: "workshop",
                name: "是否需要进入车间施工?",
                value: ko.observable("是"),
                controlType: "rbv",
                readable: true,
                writable: true,
                required: true,
                enumValues: [
                    {
                        "id": "是",
                        "name": "是"
                    },
                    {
                        "id": "否",
                        "name": "否"
                    }
                ],
                seq: 5,
                fieldType: "string"
            },
            {
                id: "visitTime",
                name: "会见时间",
                value: ko.observable(),
                controlType: "t5",
                readable: true,
                writable: true,
                required: true,
                enumValues: [],
                seq: 6,
                fieldType: "string",
            },
            {
                id: "accompany",
                name: "携带物品",
                value: ko.observable("无"),
                controlType: "rbv",
                readable: true,
                writable: true,
                required: true,
                enumValues: [{
                    "id": "无",
                    "name": "无"
                },
                {
                    "id": "有",
                    "name": "有"
                }],
                seq: 7,
                fieldType: "string",
            },
            {
                id: "accompanyType",
                name: "",//物品选项
                //ignoreLabel: true,
                value: ko.observable(),
                controlType: "cbv",
                readable: true,
                writable: true,
                required: false,
                enumValues: [{
                    "id": "手提电脑",
                    "name": "手提电脑"
                },
                {
                    "id": "化学品",
                    "name": "化学品"
                }],
                seq: 8,
                fieldType: "string",
            },
            {
                id: "accompanyText",
                name: "",//其他物品
                placeholder: "其它携带物品...",
                // ignoreLabel: true,
                value: ko.observable(),
                controlType: "t2",
                readable: true,
                writable: true,
                required: false,
                enumValues: [],
                seq: 9,
                fieldType: "string",
            },

            {
                id: "remark",
                name: "其它备注",
                value: ko.observable(),
                controlType: "t2",
                readable: true,
                writable: true,
                required: false,
                enumValues: [],
                seq: 10,
                fieldType: "string"
            }];

        this.getPdfUrl = function () {
            var fileName = entrance.config.pdfs[this.options[4].value()];
            var baseUrl = location.href.substring(0, location.href.lastIndexOf("/") + 1);
            var url = baseUrl + "pdfjs-dist/web/viewer.html?" + $.param({
                file: baseUrl + "images/" + fileName
            });
            return url;
        };
        this.records = ko.observableArray([]);
        this.init = function () {
            if (location.hash) {
                window.location.href = window.location.href.replace(location.hash, "");
            }
        };

        this.nextOptions = function () {
            if (this.name()) {
                $.mobile.changePage("#options");
            } else {
                this.editProfile();
            }
        };
        this.nextTerms = function () {
            var that = this;
            if (!BPMS.Services.Utils.validateFields(this.options)) {
                that.show({
                    title: "输入错误",
                    message: "您的输入有误，请重新输入。"
                });
                return;
            }
            var hasHistory = this.records().length > 0;
            var hasEnter = this.isEnterWorkshop().toString() === true.toString();
            var chooseEnter = this.options[4].value() === "是";
            var needTerms = !hasHistory || !hasEnter && chooseEnter;
            if (needTerms) {
                $.mobile.changePage("#terms");
                if (that.timeoutHandler) {
                    clearTimeout(that.timeoutHandler);
                }
                that.timeoutHandler = setTimeout(function () {
                    that.read.disabled(false);
                }, chooseEnter ? 20 * 1000 : 15 * 1000);
            } else {
                this.save();
            }
        };
        this.editProfile = function () {
            this.editingName(this.name());
            this.editingCorp(this.corp());
            $("#popupEdit").popup("open");
        };
        this.confirmProfile = function () {
            var name = this.editingName().trim();
            var corp = this.editingCorp().trim();
            if (!name || !corp) {
                return;
            }
            this.name(name);
            this.corp(corp);
            $("#popupEdit").popup("close");
        };
        this.selectRecord = function (item) {
            $.mobile.changePage("#options");
            this.interviewee(null);
            var reasonItem = this.options[0].enumValues.filter(function (value) {
                return value.id === item.VISIT_REASON;
            });
            this.options[0].value(reasonItem.length ? item.VISIT_REASON : null);
            this.options[1].value(item.INTERVIEWEE_NAME);
            this.options[3].value(this.carId());

            $("#interviewee").trigger("input");
        }
        this.search = function () {
            var that = this;

            var keyword = (this.keyword() || "").trim();
            if (!keyword) {
                return;
            }
            that.loading();
            entrance.service.getInterviews(keyword).then(function (data) {
                that.loading(false);

                that.tel(data.INTERVIEWER_TEL);
                if (!that.tel()) {
                    that.tel(keyword);
                }
                that.name(data.INTERVIEWER_NAME);
                that.corp(data.INTERVIEWER_CORP);
                that.carId(data.CAR_ID);
                that.isEnterWorkshop(data.IS_ENTER_WORKSHOP);
                that.records(data.VISIT_RECORDS);
                that.keyword("");
                $.mobile.changePage("#profile");
            }, function () {
                that.loading(false);
                that.show({
                    title: "查询失败",
                    message: "接口调用错误。"
                });
            });
        };

        this.keydown = function (data, e) {
            var element = $(e.target);
            var value = element.val().trim();
            if ((!e.keyCode || e.keyCode === 13) && value) {
                this.tel(value);
                this.search();
            }
            return true;
        };
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
            var interviewee = that.interviewee();
            that.department(interviewee.intervieweeDpt);
            var accompany = that.options[6].value();
            if (accompany === "有") {
                var accompanyValues = [];
                var accompanyType = that.options[7].value();
                if (accompanyType) {
                    accompanyValues.push.apply(accompanyValues, accompanyType.split(","));
                }
                var accompanyText = (that.options[8].value() || "").trim();
                if (accompanyText) {
                    accompanyValues.push(accompanyText);
                }
                accompany = accompanyValues.length > 0 ? accompanyValues.join(",") : "无";
            }
            var url=window.location.href.replace(location.hash, "");
            var processDefinitionId = BPMS.Services.Utils.getUrlParam(url, "processDefinitionId") || entrance.config.processDefinitionId;
            var data = {
                businessKey: that.options[0].value(),
                processDefinitionId: processDefinitionId,
                properties: [
                    { id: "interviewertel_拜访者手机_1_string_t1_$$A", value: that.tel() },
                    { id: "interviewername_拜访者姓名_2_string_t1_$$A", value: that.name() },
                    { id: "interviewercorp_拜访者单位_3_string_t1_$$A", value: that.corp() },
                    { id: "visitTime_会见时间_4_string_t5_$$A", value: that.options[5].value() },
                    { id: "interviewernums_访客人数_5_string_t6_$$A", value: that.options[2].value() },
                    { id: "carId_车牌号_6_string_t1_$$A", value: that.options[3].value() },
                    { id: "enterworkshop_是否进入车间_7_enum_sbs_$$A", value: that.options[4].value() },
                    { id: "accompanyingarticle_携带物品_8_string_t1_$$A", value: accompany },
                    { id: "remark_备注_9_string_t1_$$A", value: that.options[9].value() },
                    { id: "intervieweename_受访人姓名_1_string_psbn_$$B", value: interviewee.intervieweeName },
                    { id: "intervieweeuid_受访人id_2_string_t1_$$B", value: interviewee.intervieweeUid },
                    { id: "intervieweeemail_受访人邮箱_3_string_t1_$$B", value: interviewee.intervieweeEmail },
                    { id: "intervieweetel_受访人手机_4_string_t1_$$B", value: interviewee.intervieweeTel },
                    { id: "intervieweedpt_受访人部门_5_string_t1_$$B", value: interviewee.intervieweeDpt }]
            };

            entrance.service.postFormData(data).then(function (result) {
                console.log(result);
                that.loading(false);
                that.processInstanceId(result.id);
                $.mobile.changePage("#success");
            }, function (err) {
                var detailMessage = (err && err.responseJSON && err.responseJSON.exception) || "该请求无法成功处理，请稍后重试";
                that.show({
                    "title": "流程启动失败",
                    "subTitle": "访客管理流程",
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