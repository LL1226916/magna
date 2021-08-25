(function ($, ko, entrance) {
    var DockManagementViewModel = function () {

        this.records = ko.observableArray([]);
        this.historyRecords = ko.observableArray([]);
        this.user = BPMS.Services.Utils.getUser();

        this.startDate = {
            id: "startDate",
            name: "开始日期",
            value: ko.observable(),
            controlType: "t3",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 6,
            fieldType: "string",
        };
        this.endDate = {
            id: "endDate",
            name: "结束日期",
            value: ko.observable(),
            controlType: "t3",
            readable: true,
            writable: true,
            required: true,
            enumValues: [],
            seq: 6,
            fieldType: "string",
        };
        this.canAction = function (state, type) {
            var mappings = {
                "同意进厂": "in",
                "拒绝进厂": "forbidOut",
                "准备出厂": "normalOut"
            }
            for (var i in mappings) {
                if (state.indexOf(i) >= 0 && (!type || type === mappings[i])) {
                    return true;
                }
            }
            return false;
        };
        this.confirmSuccess = function () {
            this.closePop();
            this.search();
        };
        this.getStateColor = function (state) {
            var mappings = {
                "等待审批": "#ffc107",//no
                "同意进厂": "#009688",//进厂 in
                "拒绝进厂": "#dc3545",//拒绝后出厂 forbidOut
                "准备出厂": "#17a2b8",//进厂后出厂 normalOut
                "进厂": "#17a2b8",//no

                "拒绝后出厂": "#dc3545",//no
                "进厂后出厂": "#17a2b8"//no
            };
            for (var i in mappings) {
                if (state.indexOf(i) >= 0) {
                    return mappings[i];
                }
            }
            return "";
        };
        this.action = function (data, type) {
            var that = this;
            var request;
            var nowStamp = moment().format("x");
            var newState;
            that.loading();
            if (type === "in") {
                newState = "进厂";
                request = entrance.service.putProcessInstanceVariables(data.PROC_INST_ID_, [
                    {
                        "name": "intoTime",
                        "type": "string",
                        "value": nowStamp
                    },
                    {
                        "name": "visitState",
                        "type": "string",
                        "value": newState
                    }
                ]
                );
            } else if (type === "forbidOut") {
                newState = "拒绝后出厂";
                request = entrance.service.postTask(data.TASK_ID_, {
                    "action": "complete",
                    "variables": [
                        {
                            "name": "leaveTime",
                            "type": "string",
                            "value": nowStamp
                        }, {
                            "name": "visitState",
                            "type": "string",
                            "value": newState
                        }
                    ]
                }
                );
            } else {
                newState = "进厂后出厂";
                request = entrance.service.postTask(data.TASK_ID_, {
                    "action": "complete",
                    "variables": [
                        {
                            "name": "leaveTime",
                            "type": "string",
                            "value": nowStamp

                        },
                        {
                            "name": "visitState",
                            "type": "string",
                            "value": newState
                        }
                    ]
                }
                );
            }
            request.then(function () {
                that.loading(false);
                that.show({
                    title: "提交成功",
                    message: "流程状态已经更新为" + newState
                }, true);
                //that.search();
            }, function (err) {
                that.loading(false);
                if (err && err.status === 200) {
                    that.show({
                        title: "提交成功",
                        message: "流程状态已经更新为：" + newState
                    }, true);
                    return;
                }
                var detailMessage = (err && err.responseJSON && err.responseJSON.exception) || "该请求无法成功处理，请稍后重试";
                that.show({
                    "title": "提交失败",
                    "subTitle": "更改访客管理流程",
                    "message": "错误信息：" + detailMessage,
                    "code": "错误代码：" + err.status + " " + err.statusText
                });
            });
        };
        this.formatDateTime = function (dateTime) {
            if (!dateTime) {
                return "";
            }
            var format = "HH:mm YYYY-MM-DD";
            var value = moment(Number(dateTime)).format(format);
            return value;
        };
        this.init = function () {
            if (location.hash) {
                window.location.href = window.location.href.replace(location.hash, "");
                return;
            }
            this.tab("main");
            if (this.user) {
                this.search();
            }

        };

        this.search = function () {
            var that = this;
            var tab = that.tab();
            if (tab === "main") {
                that.searchRecords();
            } else {
                that.searchHistoryRecords();
            }
        };

        this.searchRecords = function () {
            var that = this;
            that.loading();
            entrance.service.getDockList().then(function (data) {
                console.log(data);
                that.records(data);
                that.loading(false);

            }, function () {
                that.loading(false);
                that.show({
                    title: "查询失败",
                    message: "接口调用错误。"
                });
            });
        };

        this.searchHistoryRecords = function () {
            //https://metabase.eorionsolution.com/public/question/0a4fe9fb-d624-42ea-b7f7-3dd5337801a8.json?parameters=[{"type":"category","target":["variable",["template-tag","start_time"]],"value":"1009238400000"},{"type":"category","target":["variable",["template-tag","end_time"]],"value":"1539940200595"}]
            var that = this;
            var start;
            var end;
            that.startDate.valid = !!that.startDate.value();
            that.endDate.valid = !!that.endDate.value();
            if (that.startDate.valid && that.endDate.valid) {
                start = moment(Number(that.startDate.value()));
                end = moment(Number(that.endDate.value()));
                if (start.isAfter(end)) {
                    that.startDate.valid = false;
                    that.endDate.valid = false;
                }
            }

            [that.startDate, that.endDate].forEach(function (date) {
                var ele = $("[name='" + date.id.replace(/\$/g, "") + "']").parent();
                if (date.valid) {
                    ele.removeClass("ui-invalid");

                } else {
                    ele.addClass("ui-invalid");
                }
            });
            if (!that.startDate.valid || !that.endDate.valid) {
                return;
            }
            start = Number(that.startDate.value());
            end = Number(that.endDate.value()) + 24 * 60 * 60 * 1000;
            that.loading();
            entrance.service.getDockHistory(start, end).then(function (data) {
                console.log(data);
                that.historyRecords(data);
                that.loading(false);

            }, function () {
                that.loading(false);
                that.show({
                    title: "查询失败",
                    message: "接口调用错误。"
                });
            });
        };
    };
    DockManagementViewModel.extend(entrance.BaseViewModel);

    $(function () {
        var viewModel = new DockManagementViewModel();
        viewModel.init();
        window.vm = viewModel;
        ko.applyBindings(viewModel);

    });

})($, ko, window.entrance = window.entrance || {});