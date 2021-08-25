(function (BPMS, $, ko, moment) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.HistoryListViewModel = function () {

        var self = this;
        window.vm = self;
        var userId = this.user && this.user.userId;
        self.switchTab = function (vm, e) {
            var a = $(e.target).closest("a");
            var mode = a.attr("href").replace("#", "");
            self.mode(mode);
            a.tab("show");
            e.preventDefault();
        };

        self.results = ko.observableArray([]);
        self.pageIndex = ko.observable(1);
        self.pageCount = ko.observable(0);
        self.hasPrev = ko.computed(function () {
            return self.pageIndex() > 1;
        }, self);

        self.hasNext = ko.computed(function () {
            return self.pageIndex() < self.pageCount();
        }, self);
        // 我的任务 授权给我的任务 我授权给他人的任务
        self.criteria = {
            type: {
                "id": "type",
                name: "授权类型",
                value: ko.observable(),
                controlType: "rbv",
                "readable": true,
                "writable": true,
                "required": true,
                "ignoreLabel": true,
                "liveValidate": true,
                "enumValues": [
                    {
                        "id": "1",
                        "name": "我的任务",
                        "i18n":"my-tasks"
                    },
                    {
                        "id": "2",
                        "name": "授权给我的任务",
                        "i18n":"tasks-delegated-to-me"
                    },
                    {
                        "id": "3",
                        "name": "我授权给他人的任务",
                        "i18n":"tasks-delegated-to-others"
                    }
                ],
                "seq": 1,
                "fieldType": "string",
                invalid: ko.observable(true)
            },
            person: {
                "id": "person",
                name: "授权/执行人",
                value: ko.observable(),
                controlType: "psbi",
                "readable": true,
                "writable": true,
                "required": false,
                "enumValues": [],
                "ignoreLabel": true,
                "seq": 2,
                "fieldType": "string",
                invalid: ko.observable(false),
                "liveValidate": true,
                "placeholder": "授权/执行人员搜索...",
                "i18n":"[placeholder]search-for-person"
            },
            processInstanceId: {
                "id": "processInstanceId",
                name: "流程实例编号",
                value: ko.observable(),
                controlType: "t1",
                "readable": true,
                "writable": true,
                "required": false,
                "enumValues": [],
                "ignoreLabel": false,
                "seq": 3,
                "fieldType": "string",
                invalid: ko.observable(false),
                "liveValidate": false,
                "placeholder": "",
                "i18n":"process-instance-id"
            },
            processDefinitionNameLike: {
                "id": "processDefinitionNameLike",
                name: "流程实例名称",
                value: ko.observable(),
                controlType: "t1",
                "readable": true,
                "writable": true,
                "required": false,
                "enumValues": [],
                "ignoreLabel": false,
                "seq": 4,
                "fieldType": "string",
                invalid: ko.observable(false),
                "liveValidate": false,
                "placeholder": ""
            },
            processBusinessKeyLike: {
                "id": "processBusinessKeyLike",
                name: "流程实例主题",
                value: ko.observable(),
                controlType: "t1",
                "readable": true,
                "writable": true,
                "required": false,
                "enumValues": [],
                "ignoreLabel": false,
                "seq": 5,
                "fieldType": "string",
                invalid: ko.observable(false),
                "liveValidate": false,
                "placeholder": ""
            },
            initiator: {
                "id": "initiator",
                name: "流程创建人",
                value: ko.observable(),
                controlType: "psbi",
                "readable": true,
                "writable": true,
                "required": false,
                "enumValues": [],
                "ignoreLabel": false,
                "seq": 6,
                "fieldType": "string",
                invalid: ko.observable(false),
                "liveValidate": false,
                "placeholder": ""
            },
            taskId: {
                "id": "taskId",
                name: "任务编号",
                value: ko.observable(),
                controlType: "t1",
                "readable": true,
                "writable": true,
                "required": false,
                "enumValues": [],
                "ignoreLabel": false,
                "seq": 7,
                "fieldType": "string",
                invalid: ko.observable(false),
                "liveValidate": false,
                "placeholder": ""
            },
            taskNameLike: {
                "id": "taskNameLike",
                name: "任务名称",
                value: ko.observable(),
                controlType: "t1",
                "readable": true,
                "writable": true,
                "required": false,
                "enumValues": [],
                "ignoreLabel": false,
                "seq": 8,
                "fieldType": "string",
                invalid: ko.observable(false),
                "liveValidate": false,
                "placeholder": ""
            },
            start: {
                "id": "start",
                name: "任务完成日期-从",
                value: ko.observable(),
                controlType: "t3",
                "readable": true,
                "writable": true,
                "required": false,
                "enumValues": [],
                "seq": 9,
                "fieldType": "number",
                "liveValidate": true,
                invalid: ko.observable(false),
                "i18n":"tsk-duedatefrom"
            },
            end: {
                "id": "end",
                name: "任务完成日期-至",
                value: ko.observable(),
                controlType: "t3",
                "readable": true,
                "writable": true,
                "required": false,
                "enumValues": [],
                "seq": 10,
                "fieldType": "number",
                "liveValidate": true,
                invalid: ko.observable(false),
                "i18n":"tsk-duedateto"
            }
        };

        self.getPrev = function () {
            var index = self.pageIndex();
            if (self.hasPrev()) {
                self.pageIndex(index - 1);
                self.getData();
            }
        };

        self.getNext = function () {
            var index = self.pageIndex();
            if (self.hasNext()) {
                self.pageIndex(index + 1);
                self.getData();
            }
        };

        self.canSearch = ko.computed(function () {
            var needPerson = self.criteria.type.value() === "2";
            var valid = !self.criteria.type.invalid() &&
                //!this.criteria.processInstanceId.invalid() &&
                //!this.criteria.processDefinitionNameLike.invalid() &&
                //!this.criteria.taskId.invalid() &&
                //!this.criteria.taskNameLike.invalid() &&
                !self.criteria.start.invalid() && !self.criteria.end.invalid();
            if (needPerson) {
                valid = valid && !self.criteria.person.invalid();
            }
            return valid;
        }, self);
        self.mode = ko.observable("search");

        self.reset = function () {
            var defaultData = {
                type: {
                    value: undefined,
                    invalid: true
                },
                person: {
                    value: undefined,
                    invalid: false
                },
                processInstanceId: {
                    value: undefined,
                    invalid: false
                },
                processDefinitionNameLike: {
                    value: undefined,
                    invalid: false
                },
                processBusinessKeyLike: {
                    value: undefined,
                    invalid: false
                },
                initiator: {
                    value: undefined,
                    invalid: false
                },
                taskId: {
                    value: undefined,
                    invalid: false
                },
                taskNameLike: {
                    value: undefined,
                    invalid: false
                },
                start: {
                    value: undefined,
                    invalid: false
                },
                end: {
                    value: undefined,
                    invalid: false
                }
            };
            for (var p in defaultData) {
                self.criteria[p].value(defaultData[p].value);
                self.criteria[p].invalid(defaultData[p].invalid);
            }
            var clearBtn = $("input").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
            if (clearBtn && clearBtn.length) {
                clearBtn.click();
            }
            $("#search-tab").focus();

            var url = window.location.href;
            var index = url.indexOf("?");
            if (index >= 0)
                url = url.substr(0, index);
            if (history.replaceState)
                history.replaceState({}, document.title, url);


        };

        self.getData = function () {
            var self = this;
            self.loading(true);
            var param = {};
            var selectedPerson = self.criteria.person.value();
            if (self.criteria.type.value() === "2") {
                if (selectedPerson) {
                    param.taskOwner = selectedPerson;
                }
                param.taskAssignee = userId;
            } else if (self.criteria.type.value() === "3") {
                if (selectedPerson) {
                    param.taskAssignee = selectedPerson;
                }
                param.taskOwner = userId;
            }
            else {
                param.taskAssignee = userId;
            }
            ["processInstanceId", "processDefinitionNameLike", "processBusinessKeyLike", "taskId", "taskNameLike"].forEach(
                function (name) {
                    var value = self.criteria[name].value();
                    if (value) {
                        if (name.indexOf("Like") >= 0) {
                            value = "%" + value + "%";
                        }
                        param[name] = value;
                    }

                }
            );

            var start = self.criteria.start.value();
            var end = self.criteria.end.value();
            if (start) {
                param.taskCompletedAfter = moment(parseInt(start)).format();
            }
            if (end) {
                end = parseInt(end)+ 24 * 60 * 60 * 1000;
                param.taskCompletedBefore = moment(end).format();
            }
            var initiator = self.criteria.initiator.value();
            if (initiator) {
                param.processVariables = [{
                    "name": "initiator",
                    "value": initiator,
                    "operation": "equals",
                    "type": "string"
                }];
            }
            var size = this.pageSize;
            var page = self.pageIndex();

            $.extend(param, {
                //"active":true,
                "sort": "startTime",
                "order": "desc",
                "start": (page - 1) * size,
                "size": size
            });

            var items;
            var userIds;
            self.param = param;
            //return BPMS.Services.getTaskInstances(param).then(function (result) {
            return BPMS.Services.queryTaskInstances(param).then(function (result) {
                items = result.data;
                userIds = [];
                items.forEach(function (i) {
                    i.startUserId = "";
                    i.startUserName = "";
                    i.ownerName = "";
                    i.assigneeName = "";
                    //i.startUserId = singleItem.startUserId;
                    i.instanceStartTime = i.startTime || "";
                    i.instanceEndTime = i.endTime || "";
                    i.instanceBusinessKey = i.instanceBusinessKey || "";

                    if (i.owner && userIds.indexOf(i.owner) < 0) {
                        userIds.push(i.owner);
                    }
                    if (i.assignee && userIds.indexOf(i.assignee) < 0) {
                        userIds.push(i.assignee);
                    }
                });
                var pageCount = Math.floor((result.total - 1) / size) + 1;
                self.pageCount(pageCount);

                var instanceRequests = items.filter(function (item) {
                    return item && item.processInstanceId;
                }).map(function (item) {
                    return BPMS.Services.getHistoricProcessInstance(item.processInstanceId);
                });
                return $.when.apply(this, instanceRequests);

            }, function () {
                self.pop("error", {
                    "title": "获取任务列表失败",
                    "description": "由于网络原因，无法成功获取数据，请稍后重试。"
                });
                self.loading(false);
            }).then(
                function () {
                    Array.prototype.forEach.call(arguments, function (item, index) {
                        if (!item || (!item.length && !item.id) || item.readyState) {
                            return;
                        }
                        var singleItem = item[0] || item;
                        var tempItems = items.filter(function (tempItem) {
                            return tempItem.processInstanceId === singleItem.id;
                        });
                        tempItems.forEach(function (tempItem) {
                            tempItem.startUserId = singleItem.startUserId;
                            tempItem.instanceStartTime = singleItem.startTime;
                            tempItem.instanceEndTime = singleItem.endTime;
                            tempItem.instanceBusinessKey = singleItem.businessKey;
                            if (singleItem.startUserId && userIds.indexOf(singleItem.startUserId) < 0) {
                                userIds.push(singleItem.startUserId);
                            }
                        });
                    });

                    return BPMS.Services.getUsers(userIds);
                },
                function () {
                    self.pop("error", {
                        "title": "获取任务列表失败",
                        "description": "由于网络原因，无法成功获取数据，请稍后重试。"
                    });
                    self.loading(false);
                }
            ).then(function () {
                Array.prototype.forEach.call(arguments, function (tempUser, index) {
                    if (!tempUser || (!tempUser.length && !tempUser.id) || tempUser.readyState) {
                        return;
                    }
                    var singleUser = tempUser[0] || tempUser;
                    items.forEach(
                        function (item) {
                            var fullName = (singleUser.firstName + " " + singleUser.lastName).trim();
                            if (item && item.startUserId && item.startUserId === singleUser.id) {
                                item.startUserName = fullName;
                            }
                            if (item && item.owner && item.owner === singleUser.id && self.criteria.type.value() === "2") {
                                item.ownerName = fullName;
                            }

                            if (item && item.assignee && item.assignee === singleUser.id && self.criteria.type.value() === "3") {
                                item.assigneeName = fullName;
                            }
                        }
                    );

                });
                self.results(items);
                self.loading(false);
                if (self.mode() !== "result") {
                    $("#result-tab").click();
                }
            }, function () {
                self.pop("error", {
                    "title": "获取任务列表失败",
                    "description": "由于网络原因，无法成功获取数据，请稍后重试。"
                });
                self.loading(false);
            });
        };
    };
    BPMS.ViewModels.HistoryListViewModel.extend(BPMS.ViewModels.BaseViewModel);
    BPMS.ViewModels.HistoryListViewModel.prototype.pageSize = BPMS.config.pageSize;
    BPMS.ViewModels.HistoryListViewModel.prototype.search = function () {
        this.pageIndex(1);
        return this.getData();
    };
    BPMS.ViewModels.HistoryListViewModel.prototype.selectItem = function ($data, $index) {
        var self = this;
        var size = this.pageSize;
        var page = self.pageIndex();
        var start = (page - 1) * size + $index;

        $.extend(self.param, {
            "start": start,
            "size": 1
        });

        var queryInfo = {
            "param": self.param,
            "hasPrev": self.hasPrev() || $index > 0,
            "hasNext": self.hasNext() || $index < self.results().length - 1
        };

        $data.queryInfo = queryInfo;
        sessionStorage.setItem("task", JSON.stringify($data));
        var obj = {
            "taskId": $data.id,
            "processInstanceId": $data.processInstanceId,
            "processDefinitionId": $data.processDefinitionId
        };
        var state = {
            "pageIndex": self.pageIndex()
        };
        for (var i in self.criteria) {
            if (self.criteria[i] && self.criteria[i].value) {
                var value = self.criteria[i].value();
                if (typeof (value) === "undefined" || value === null) {
                    value = "";
                }
                state[i] = value;
            }
        }
        var url = window.location.href;
        var index = url.indexOf("?");
        if (index >= 0) {
            url = url.substr(0, index);
        }
        if (history.replaceState) {
            history.replaceState(state, document.title, url + "?" + $.param(state));
        }
        window.location.href = "history_detail.html?" + $.param(obj);
        return false;
    };
    BPMS.ViewModels.HistoryListViewModel.prototype.init = function () {
        var self = this;
        var handler = function () {
            var type = self.criteria.type.value();
            if (type === "1") {
                var clearBtn = $("#person").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                if (clearBtn && clearBtn.length) {
                    clearBtn.click();
                }
                self.criteria.person.value(undefined);
            }
            self.criteria.person.invalid(type === "2" && !self.criteria.person.value());
            $("#person").prop("disabled", type === "1");
        };
        $("input[type='radio']").first().closest("fieldset").on("change", handler);
        var state = BPMS.Services.Utils.getUrlParams(window.location.href);
        if (state && state.pageIndex && state.type) {
            ["type", "person", "processInstanceId",
                "processDefinitionNameLike", "processBusinessKeyLike", "taskId",
                "taskNameLike", "start", "end", "initiator"
            ].forEach(function (name) {
                var value = state[name];
                if (typeof (value) !== "undefined" || value !== null || value !== "") {
                    if (name === "start" || name === "end") {
                        value = parseInt(value, 10);
                    }
                    self.criteria[name].value(value);
                    if (name === "type") {
                        handler();
                    }
                }
            });
            self.pageIndex(parseInt(state.pageIndex, 10));
            self.getData();
        }
    };
})(window.BPMS = window.BPMS || {}, jQuery, ko, moment);


//{ "data": [{ "id": "797610", "processDefinitionId": "FIN001V9MULTIV2:1:795004", "processDefinitionUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/repository/process-definitions/FIN001V9MULTIV2:1:795004", "processInstanceId": "797501", "processInstanceUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-process-instances/797501", "executionId": "797598", "name": "FIN001-T01员工报销审核3:1", "description": null, "deleteReason": "completed", "owner": null, "assignee": "100000", "startTime": "2018-05-31T09:53:29.000+08:00", "endTime": "2018-05-31T09:53:53.000+08:00", "durationInMillis": 24896, "workTimeInMillis": null, "claimTime": null, "taskDefinitionKey": "T01", "formKey": null, "priority": 80, "dueDate": "2018-05-31T13:53:29.000+08:00", "parentTaskId": null, "url": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-task-instances/797610", "variables": [], "tenantId": "", "category": null }, { "id": "780050", "processDefinitionId": "RY_IT002d:1:292540", "processDefinitionUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/repository/process-definitions/RY_IT002d:1:292540", "processInstanceId": "780001", "processInstanceUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-process-instances/780001", "executionId": "780001", "name": "IT应用申请: 分管领导审批", "description": null, "deleteReason": null, "owner": null, "assignee": "100000", "startTime": "2018-05-23T08:26:00.000+08:00", "endTime": null, "durationInMillis": null, "workTimeInMillis": null, "claimTime": null, "taskDefinitionKey": "t01axcomvp", "formKey": null, "priority": 50, "dueDate": "2018-05-24T08:26:00.000+08:00", "parentTaskId": null, "url": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-task-instances/780050", "variables": [], "tenantId": "", "category": null }, { "id": "762577", "processDefinitionId": "multiinstancetest3:1:760065", "processDefinitionUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/repository/process-definitions/multiinstancetest3:1:760065", "processInstanceId": "762550", "processInstanceUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-process-instances/762550", "executionId": "762565", "name": "多实例任务3 / 1", "description": null, "deleteReason": "completed", "owner": null, "assignee": "100000", "startTime": "2018-05-18T10:42:10.000+08:00", "endTime": "2018-05-18T10:42:50.000+08:00", "durationInMillis": 40219, "workTimeInMillis": null, "claimTime": null, "taskDefinitionKey": "TM1", "formKey": null, "priority": 90, "dueDate": "2018-05-19T10:42:10.000+08:00", "parentTaskId": null, "url": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-task-instances/762577", "variables": [], "tenantId": "", "category": null }, { "id": "760022", "processDefinitionId": "masterdata:1:760007", "processDefinitionUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/repository/process-definitions/masterdata:1:760007", "processInstanceId": "760008", "processInstanceUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-process-instances/760008", "executionId": "760014", "name": "物流", "description": null, "deleteReason": "completed", "owner": null, "assignee": "100000", "startTime": "2018-05-18T09:33:53.000+08:00", "endTime": "2018-05-18T09:34:59.000+08:00", "durationInMillis": 66272, "workTimeInMillis": null, "claimTime": null, "taskDefinitionKey": "T3", "formKey": null, "priority": 50, "dueDate": "2018-05-19T09:33:53.000+08:00", "parentTaskId": null, "url": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-task-instances/760022", "variables": [], "tenantId": "", "category": null }, { "id": "757648", "processDefinitionId": "multiinstancetest2:2:757630", "processDefinitionUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/repository/process-definitions/multiinstancetest2:2:757630", "processInstanceId": "757631", "processInstanceUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-process-instances/757631", "executionId": "757641", "name": "多实例任务3 / 1", "description": null, "deleteReason": "completed", "owner": null, "assignee": "100000", "startTime": "2018-05-17T16:22:02.000+08:00", "endTime": "2018-05-17T16:22:23.000+08:00", "durationInMillis": 21154, "workTimeInMillis": null, "claimTime": null, "taskDefinitionKey": "TM1", "formKey": null, "priority": 90, "dueDate": "2018-05-18T16:22:02.000+08:00", "parentTaskId": null, "url": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-task-instances/757648", "variables": [], "tenantId": "", "category": null }, { "id": "757625", "processDefinitionId": "multiinstancetest2:1:757580", "processDefinitionUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/repository/process-definitions/multiinstancetest2:1:757580", "processInstanceId": "757608", "processInstanceUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-process-instances/757608", "executionId": "757618", "name": "多实例任务3 / 1", "description": null, "deleteReason": null, "owner": null, "assignee": "100000", "startTime": "2018-05-17T15:58:46.000+08:00", "endTime": null, "durationInMillis": null, "workTimeInMillis": null, "claimTime": null, "taskDefinitionKey": "TM1", "formKey": null, "priority": 90, "dueDate": "2018-05-18T15:58:46.000+08:00", "parentTaskId": null, "url": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-task-instances/757625", "variables": [], "tenantId": "", "category": null }, { "id": "757598", "processDefinitionId": "multiinstancetest2:1:757580", "processDefinitionUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/repository/process-definitions/multiinstancetest2:1:757580", "processInstanceId": "757581", "processInstanceUrl": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-process-instances/757581", "executionId": "757591", "name": "多实例任务3 / 1", "description": null, "deleteReason": "completed", "owner": null, "assignee": "100000", "startTime": "2018-05-17T15:53:43.000+08:00", "endTime": "2018-05-17T15:53:58.000+08:00", "durationInMillis": 15659, "workTimeInMillis": null, "claimTime": null, "taskDefinitionKey": "TM1", "formKey": null, "priority": 90, "dueDate": "2018-05-18T15:53:43.000+08:00", "parentTaskId": null, "url": "http://bpmswx.eorionsolution.com/bpms-rest/service/history/historic-task-instances/757598", "variables": [], "tenantId": "", "category": null }], "total": 158, "start": 0, "sort": "startTime", "order": "desc", "size": 7 }
