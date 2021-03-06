(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.TaskDetailViewModel = function () {
        var self = this;
        this.historicDetails = [];
        this.operation = "";
        this.loaded = ko.observable(false);
        this.uploadUrl = BPMS.config.attachmentUrl + "upload";
        window.vm = this;
        this.tableIndex = ko.observable();
        this.canAddAttachment = ko.observable(false);
        self.people = ko.observableArray();
        self.keyword = ko.observable();
        self.priority = ko.observable();
        self.instanceStartTime = ko.observable();
        self.saving = ko.observable(false);
        self.instanceStartUserName = ko.observable();
        self.dueDate = ko.observable();
        self.taskDefinitionKey = ko.observable();
        self.draft = ko.observable();
        self.person = null;
        self.tab = ko.observable();
        self.actionName = ko.observable("");
        this.exampleTable = ko.observable();
        self.assignType = {
            id: "assignType",
            name: "加签类型",
            value: ko.observable(),
            controlType: "rbv",
            readable: true,
            writable: true,
            required: true,
            ignoreLabel: true,
            liveValidate: true,
            enumValues: [
                {
                    id: "assign",
                    name: "加签审核",
                    i18n: "assign-examine"
                },
                {
                    id: "review",
                    name: "加签审阅",
                    i18n: "assign-review"
                }
            ],
            seq: 1,
            "fieldType": "string"
        };

        this.subTable = {
            headers: ko.observableArray(),
            rows: ko.observableArray(),
            editable: true,
            editIndex: ko.observable(-1),
            uploadTableFlag: ko.observable(false),
            steps: ko.observableArray(),
            name: ko.observable("")
        };

        this.commentInfo = {
            message: ko.observable(""),
            to: ko.observable(),
            comments: ko.observableArray()
        };
        self.bot = {
            reports: ko.observableArray(),
            files: ko.observableArray(),
            orders: ko.observableArray()
        };
        self.remind = {
            title: ko.observable(""),
            date: ko.observable(),
            memo: ko.observable("")
        };
        var assignCallback = function (errorCode) {
            self.continuePopSuccess = !errorCode;
            self.continuePopFail = errorCode;
            self.loading(false);
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            } else {
                if (errorCode) {
                    self.pop("error", {
                        "title": self.operation + "失败",
                        "description": self.taskId() + " " + self.name(),
                        "detail": "该请求无法成功处理，请稍后重试。",
                        "code": self.continuePopFail
                    });
                } else {
                    self.pop("success", {
                        "title": self.operation + "成功",
                        "description": self.taskId() + " " + self.name(),
                        "callback": self.init
                    });
                }

            }
        };
        self.mapDraft = function (draft) {
            if (!draft) {
                return;
            }
            for (var i in self.forms()) {
                var form = self.forms()[i];
                for (var j in form) {
                    var field = form[j];
                    var mappedField = draft.forms[i][j];
                    field.value(draft.forms[i][j].value);
                }
            }

            self.table.write().forEach(function (table, index) {
                var draftTable = draft.tables && draft.tables[index];
                if (!draftTable) {
                    return;
                }
                var draftRows = draftTable.rows;
                table.rows(draftRows || []);
                for (var j in table.headers()) {
                    var header = table.headers()[j];
                    if (header.subTable) {
                        header.subTable.rows(draftTable.headers[j].subTable.rows);
                    }
                }
            });
            // for (var i in self.tables()) {
            //     var table = self.tables()[i];
            //     if (ko.isObservable(table.rows)) {
            //         table.rows(draft.tables[i].rows);
            //     } else {
            //         table.rows = draft.tables[i].rows;
            //     }

            // }
            var attachments = JSON.parse(JSON.stringify(draft.attachments)) || [];
            for (var i in attachments) {
                var attachment = attachments[i];
                attachment.items = ko.observableArray(attachment.items);
            }
            self.attachmentFields.write(attachments);
        };
        self.doAssign = function () {
            if (!self.person || !self.person.sn) {
                return;
            }
            self.operation = self.assignType.value() === "review" ? "加签审阅" : "加签审核";
            if (self.assignType.value() === "review") {
                var variables = [
                    {
                        name: "sourcepid",
                        type: "string",
                        value: self.processInstanceId()
                    },
                    {
                        name: "sourcetaskid",
                        type: "string",
                        value: self.taskId()
                    },
                    {
                        name: "sourcetaskname",
                        type: "string",
                        value: self.name()
                    },
                    {
                        name: "sourcetaskformid",
                        type: "string",
                        value: self.formKey || ""
                    },
                    {
                        name: "delegateduserid",
                        type: "string",
                        value: self.person.sn
                    },
                ].concat(self.taskVariables().filter(function(item){
                //过滤器filter
                    
                    return item.type !== "serializable"
                }));

                

                BPMS.Services.postProcessInstance(
                    {
                        processDefinitionKey: BPMS.config.countersignProcess,
                        businessKey: "加签审阅：" + self.processInstanceBusinessKey(),
                        variables: variables
                    }).then(function () {
                        assignCallback();
                    }, function (error) {
                        assignCallback("错误代码：" + error.status + " " + error.statusText);
                    });
                return;
            }
            BPMS.Services.postTasks(self.taskId(), {
                "action": "delegate",
                "assignee": self.person.sn
            }).then(function () { assignCallback(); }, function (error) {
                if (error && error.status >= 200 && error.status < 300) {
                    assignCallback();
                }
                else {
                    assignCallback("错误代码：" + error.status + " " + error.statusText);
                }
            });
        };
        self.accept = function () {
            if (self.delegationState() !== "pending") {
                return;
            }
            self.operation = "接受指派";
            BPMS.Services.putTasks(self.taskId(), {
                "delegationState": "resolved"
            }).then(function () { assignCallback(); }, function (error) {
                if (error && error.status >= 200 && error.status < 300) {
                    assignCallback();
                }
                else {
                    assignCallback("错误代码：" + error.status + " " + error.statusText);
                }
            });
        };
        self.getComments = function () {
            var dfd = $.Deferred();
            var root = this;
            root.loading(true);
            return BPMS.Services.getTaskComments(root.taskId()).then(function (result) {
                root.loading(false);
                root.commentInfo.comments(result);
                $('[data-toggle="tooltip"]').tooltip();
                dfd.resolve(result);
            });
        };
        this.doComment = function () {
            var root = this;
            if (!this.commentInfo.message()) {
                return;
            }
            var message = {
                to: this.commentInfo.to() || "",
                message: this.commentInfo.message()
            };
            var data = {
                "message": JSON.stringify(message),
                "saveProcessInstanceId": true
            };
            this.loading(true);
            BPMS.Services.postTaskComments(this.taskId(), data).then(function () {
                root.commentInfo.message("");
                root.commentInfo.to("");
                $("#to").val("");
                root.getComments();
            }, function () {
                root.loading(false);
                alert("error");
            });
        };
        this.startComments = function () {
            var root = this;
            root.getComments().then(function (result) {
                // if ($.mobile.popup && $.mobile.popup.active) {
                //     root.triggerDelay("Comments");
                // }
                // root.delayPop("Comments");
                if ($.mobile.popup && $.mobile.popup.active) {
                    root.triggerDelay("Comments");
                } else {
                    $("#popComments").popup("open");
                }
            });
        };
        self.reject = function () {
            if (self.delegationState() !== "pending") {
                return;
            }
            self.operation = "指派退回";
            BPMS.Services.postTasks(self.taskId(), {
                "action": "resolve"
            }).then(function () { assignCallback(); }, function (error) {
                if (error && error.status >= 200 && error.status < 300) {
                    assignCallback();
                }
                else {
                    assignCallback("错误代码：" + error.status + " " + error.statusText);
                }
            });
        };
        self.selectPerson = function (person) {
            self.person = person;
            self.keyword(person.name);
            self.people.removeAll();
        };

        self.searchPeople = BPMS.Services.Utils.debounce(function () {
            self.person = null;
            var keyword = $("#txtSearchPeople").val();
            self.keyword(keyword);
            keyword = keyword && keyword.trim();
            if (!keyword) {
                self.people.removeAll();
                return;
            }
            var me = BPMS.Services.Utils.getUser().userId;

            BPMS.Services.getSuggestion(keyword).then(function (result) {
                var items = result.filter(function (person) {
                    return person.sn !== me;
                }).slice(0, 5);
                self.people(items);
            }, function (result) {
                self.loading(false);
                var message = "由于网络问题，无法获取数据，请稍后重试。";
                if (result && result.responseJSON && result.responseJSON.cause) {
                    var cause = result.responseJSON.cause;
                    message = cause.substring(cause.indexOf(":") + 1).trim();
                }
                self.pop("error", {
                    "title": "获取人员列表失败",
                    "detail": message,
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
            });
            // self.people.push({
            //     "@id": "1", "name": "邵剑秋", "sn": "100000",
            //     "mail": "bladeshao@eorionsolution.com", "roles": null,
            //     "belongToDepartment": null, "businessBelongToDepartment": [],
            //     "chargeToCostCenter": null, "managers": [], "staffs": [],
            //     "businessManagers": [], "businessStaffs": [], "delegators": [],
            //     "delegatees": [], "id": 9
            // });
        });

        var _search = self.searchPeople;

        // Prevent form submission
        var _onKeyDown = function (event) {
            if (event.keyCode === $.ui.keyCode.ENTER) {
                event.preventDefault();
                this._preventKeyPress = true;
            }
        };

        // Prevent form submission
        var _onKeyPress = function (event) {
            if (this._preventKeyPress) {
                event.preventDefault();
                this._preventKeyPress = false;
            }
        };

        $("#txtSearchPeople").on("keydown", _onKeyDown)
            .on("keypress", _onKeyPress)
            .on("keyup", _search)
            //.on("change", _search)
            .on("input", _search);

        self.switchTab = function (vm, e) {
            var a = $(e.target).closest("a");
            var tabKey = a.attr("href").replace(/#/, "");
            if (tabKey !== "action" || self.started()) {
                a.tab("show");
                self.tab(tabKey);
            }
            return false;
        };
        this.getAction = function ($data, $index) {
            return BPMS.Services.Utils.getAction($data, $index, self.historicDetails);
        };

        var fnCheckPop = function () {
            if (self.continuePopAssign) {
                $("#popAssign").popup("open");
                self.continuePopAssign = false;
            }
            if (self.continuePopFail) {
                self.pop("error", {
                    "title": self.operation + "失败",
                    "description": self.taskId() + " " + self.name(),
                    "detail": "该请求无法成功处理，请稍后重试。",
                    "code": self.continuePopFail
                });
                self.loading(false);
                self.continuePopFail = false;
            }

            var isReload = self.operation === "设置提醒" || self.operation === "接受指派";
            if (self.continuePopSuccess) {
                self.pop("success", {
                    "title": self.operation + "成功",
                    "description": self.taskId() + " " + self.name(),
                    "callback": isReload ? self.init : self.finish
                });
                self.continuePopSuccess = false;
            }
        };
        self.popRemind = function (isContinue) {
            self.remind.title("");
            var now = Number(moment(moment().format("YYYY-MM-DD HH:mm")).format("x"));
            now += 1000 * 60 * 60 * 24;
            self.remind.date(now.toString());
            self.remind.memo("");
            if ($("#panelCalendar").length) {
                $("#panelCalendar").panel("open");
                return;
            }
            if (isContinue) {
                self.triggerDelay("Remind");
            } else {
                $("#popRemind").popup("open");
            }

            $("#popRemind").on("popupafterclose", fnCheckPop);
        };
        self.doRemind = function () {
            if (!(self.remind.title() && self.remind.date() && self.remind.memo())) {
                return;
            }

            self.operation = "设置提醒";
            var url = location.href;
            var index = url.lastIndexOf("/");
            url = url.substring(0, index + 1) + "task_detail.html";
            var param = $.param({
                taskId: self.taskId(),
                processInstanceId: self.processInstanceId(),
                processDefinitionId: self.processDefinitionId()
            });
            url += "?" + param;
            var dateValue = Number(self.remind.date());
            var fileName = (self.taskId() + " " + (self.description() || "")).trim();
            // var data = {
            //     "source": "bpms",
            //     "refNo": self.taskId(),
            //     "from": BPMS.config.email,
            //     "to": [self.user.email],
            //     "cc": [],
            //     "mailSubject": "BPMS任务提醒事件: " + self.taskId(),
            //     "mailData": {
            //         "startdate": dateValue,
            //         "summary": self.remind.title(),
            //         "description": self.remind.memo(),
            //         "url": url,
            //         "taskid": fileName
            //     },
            //     "mailTemplate": "mtp_ical",
            //     "iCalData": {
            //         "event": {
            //             "dtstart": dateValue,
            //             "summary": self.remind.title(),
            //             "description": self.remind.memo(),
            //             "url": url,

            //             "alarm": {

            //                 "dur": "-PT15M",
            //                 "description": self.remind.memo()
            //             }
            //         },
            //         "filename": fileName
            //     }
            // };


            var data = {
                "mail": {
                    "source": "bpms",
                    "refNo": self.taskId(),
                    "from": BPMS.config.email,
                    "to": [self.user.email],
                    "cc": [],
                    "subject": "BPMS任务提醒事件: " + self.taskId(),
                    "templateData": {
                        "startdate": dateValue,
                        "summary": self.remind.title(),
                        "description": self.remind.memo(),
                        "url": url,
                        "taskid": fileName
                    },
                    "templateName": "mtp_ical"
                },
                "iCalData": {
                    "event": {
                        "dtstart": dateValue,
                        "summary": self.remind.title(),
                        "description": self.remind.memo(),
                        "url": url,

                        "alarm": {

                            "dur": "-PT15M",
                            "description": self.remind.memo()
                        }
                    },
                    "filename": fileName
                }
            };

            self.loading(true);
            BPMS.Services.postIcsNotice(data).then(assignCallback, function (error) {
                if (error && error.status >= 200 && error.status < 300) {
                    assignCallback();
                }
                else {
                    assignCallback("错误代码：" + error.status + " " + error.statusText);
                }
            });
        };

        self.saveDraft = function () {
            var draft = self.draft();
            if (!draft) {
                draft = {
                    "_id": BPMS.Services.Utils.getCurrentTimeStamp().toString(),
                    "taskId": self.taskId(),
                    "type": "TaskDraft",
                    "userId": self.user.userId
                };
            }

            draft.forms = self.forms();
            draft.attachments = self.attachmentFields.write();
            draft.tables = self.table.write();
            draft = ko.toJS(draft);
            draft.tables.forEach(function (draftTable) {
                draftTable.headers.forEach(function (draftHeader) {
                    if (draftHeader.subTable) {
                        delete draftHeader.subTable.parentTable;
                        delete draftHeader.subTable.parentField;
                    }
                });
            });

            BPMS.Services.addDocument(draft).then(
                function () {
                    self.draft(draft);
                    self.triggerDelay({
                        "type": "success",
                        "title": "草稿保存成功",
                        "description": "已成功保存草稿。",
                    });
                }, function () {
                    self.triggerDelay({
                        "type": "error",
                        "title": "草稿保存失败",
                        "description": "草稿保存失败，请重试。",
                    });
                }
            );
        };

        self.deleteDraft = function () {
            if (self.draft()) {
                var key = self.draft()._id;
                BPMS.Services.deleteDocument(key).then(function () {
                    self.triggerDelay({
                        "type": "success",
                        "title": "草稿删除成功",
                        "description": "已成功删除草稿。"
                    });
                });
                self.draft(null);
            }

        };

        self.showMore = function (option) {
            self.continuePopSuccess = false;
            self.continuePopAssign = false;
            self.continuePopFail = false;
            var pop = $("#popMore");
            if (option) {
                pop.popup(option);
            }
            pop.popup("open");
            pop.on("popupafterclose", fnCheckPop);
        };
        self.showAssign = function () {
            self.keyword("");
            self.person = null;
            self.people.removeAll();

            var clearBtn = $("#txtSearchPeople").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
            if (clearBtn && clearBtn.length) {
                clearBtn.click();
            }

            if ($.mobile.popup && $.mobile.popup.active) {
                self.continuePopAssign = true;
                $.mobile.popup.active.close();
            } else {
                $("#popAssign").popup("open");
            }
            $("#popAssign").on("popupafterclose", fnCheckPop);
        };
        self.delegationState = ko.observable();
        self.userId = this.user && this.user.userId;
        self.taskId = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "taskId"));
        self.processInstanceId = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId"));
        self.processDefinitionId = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId"));
        self.processInstanceBusinessKey = ko.observable("");
        self.taskVariables = ko.observableArray([]);
        self.name = ko.observable("");
        self.processName = ko.observable("");

        self.assignee = ko.observable("");
        self.owner = ko.observable("");
        self.ownerName = ko.observable("");
        self.mappings = [];
        self.description = ko.observable("");
        self.definitionDescription = ko.observable("");
        self.started = ko.observable(false);
        self.submitted = ko.observable(false);
        self.forms = ko.observableArray();
        self.flows = ko.observableArray();
        self.fields = ko.observableArray();
        self.tables = ko.observableArray();
        self.table = {
            temp: ko.observableArray(),
            read: ko.observableArray(),
            write: ko.observableArray()
        };
        //self.attachments = ko.observableArray();

        self.attachmentFields = {
            totalCount: ko.observable(0),
            read: ko.observableArray(),
            write: ko.observableArray()
        };
        var callbackStarted = function () {
            var updateStatus = function () {
                self.assignee(self.userId);
                self.started(true);
                // $("#action-tab").click();
                scrollTo(0, 0);
            };
            self.loading(false);
            self.saving(false);
            self.pop("success", {
                "title": "任务签收成功",
                "description": self.taskId() + " " + self.name(),
                "callback": updateStatus
            });
        };

        self.start = function () {
            if (self.started() || self.saving()) {
                return;
            }
            self.loading(true);
            self.saving(true);
            var action = self.assignee() ? {
                action: "delegate",
                assignee: self.userId
            } : {
                    action: "claim",
                    assignee: self.userId
                };
            BPMS.Services.postTasks(self.taskId(), action).then(function () {
                callbackStarted();
            }, function (error) {
                if (error && error.status >= 200 && error.status < 300) {
                    callbackStarted();
                }
                else {
                    self.pop("error", {
                        "title": "任务签收失败",
                        "description": self.taskId() + " " + self.name(),
                        "detail": "该请求无法成功处理，请稍后重试。",
                        "code": "错误代码：" + error.status + " " + error.statusText
                    });
                    self.loading(false);
                }
            });
        };
        self.selectFile = function () {
            var value = $("#fileUploaded").val();
            this.canAddAttachment(!!value);
        };
        self.addAttachment = function () {
            if (!this.canAddAttachment()) {
                return false;
            }
            self.loading(true);
            $("#upload").ajaxSubmit({
                "success": function (data) {
                    self.loading(false);
                    self.attachmentFields.write()[0].items.push(data);
                    self.canAddAttachment(false);
                    $("#fileUploaded").val("");
                },
                "error": function (err) {
                    var code = "";
                    if (err && err.status && err.statusText){ code = "错误代码：" + err.status + " " + err.statusText; }
                    self.pop("error", {
                        "title": "上传附件失败",
                        "description": "",
                        "detail": "该请求无法成功处理，请稍后重试。",
                        "code": code
                    });
                    self.loading(false);
                }
            });
        };

        self.removeAttachment = function (data) {
            self.attachmentFields.write()[0].items.remove(data);
        };

        self.checkNext = function () {
            var tempFields = Array.prototype.concat.apply([], self.forms());
            if (!BPMS.Services.Utils.validateFields(tempFields, true)) {
                for (var i in tempFields) {
                    var field = tempFields[i];
                    if (field.invalid()) {
                        var id = field.id.replace(/\$\$/g, "").replace(/ /g, "");
                        var ele = $("[name='" + id + "']");
                        var container = ele.closest("form[data-bind]");
                        if (!container.length) {
                            container = ele.closest("div[data-bind]");
                        }
                        if (container.length) {
                            container[0].scrollIntoView();
                        }
                        break;
                    }
                }
            }
        };
        self.submit = function () {
            var forms = Array.prototype.concat.apply([], self.forms());
            if (self.submitted() || !self.started()){
                return;
            }
            if (self.tab() !== "home" && $("#home-tab").length) {
                $("#home-tab").click();
                return;
            }

            if (self.formKey) {
                self.currentForm.submit().then(function (result) {
                    self.pop("confirmTask", {
                        "title": self.taskId() + " " + self.name(),
                        "callback": self.doConfirm
                    });

                }, function (result) {

                });

                return;
            }
            if (!BPMS.Services.Utils.validateFields(forms)) {
                self.pop("error", {
                    "title": "输入错误",
                    "description": "您的输入有误，请重新输入。",
                    "callback": function () {
                        //$("#action-tab").click();
                    }
                });
                return;
            }

            var writableTable = self.table.write();
            for (var i = 0; i < self.table.write().length; i++) {
                var writableTable = self.table.write()[i];
                if (writableTable && writableTable.item && ko.unwrap(writableTable.item.required) &&
                    writableTable.rows().length == 0) {
                    self.pop("error", {
                        "title": "输入错误",
                        "description": "您的输入有误，请输入表格内容。",
                        "callback": function () {
                            // $("#action-tab").click();
                        }
                    });
                    break;
                }

            }


            var writeFields = self.attachmentFields.write();
            var writeField = writeFields && writeFields[0];
            if (writeField
                && writeField.field
                && ko.unwrap(writeField.field.required)) {
                if (writeField.items().length === 0) {
                    self.pop("error", {
                        "title": "输入错误",
                        "description": "您的输入有误，请输入附件。",
                        "callback": function () {
                            $("#attachment-tab").click();
                        }
                    });
                    return;
                }
            }

            var obj = {
                "title": self.taskId() + " " + self.name(),
                "callback": self.doConfirm
            };
            forms.forEach(function (item) {
                var fullId = item.id;
                var parts = fullId.split("_");
                var lastItem = parts[parts.length - 1];

                var controlType = lastItem.indexOf("$$") >= 0 ? parts[parts.length - 2] : lastItem;
                var value = item.value() || "";
                if (controlType === "t3" ||
                    controlType === "t4" ||
                    controlType === "t5") {
                    value = BPMS.Services.Utils.formatDateTime(value, controlType);
                } else if (controlType === "t11") {
                    if (typeof (value) === "string" && value || typeof (value) === "number") {
                        value = BPMS.Services.Utils.formatMoney(value);
                    } else {
                        value = "";
                    }
                }

                if (item.id.toLowerCase().indexOf("coreaction") === 0) {
                    obj.code = item.name + ":" + value;
                }
                if (item.id.toLowerCase().indexOf("corevalue") === 0) {
                    obj.detail = item.name + ":" + value;
                }
                if (item.id.toLowerCase().indexOf("corecomments") === 0) {
                    var longText = value;
                    longText = longText.trim().replace(/\r/g, "").replace(/\n/g, "<br/>");
                    obj.description = item.name + ":" + longText;
                }
            });
            self.pop("confirmTask", obj);
        };

        var buildTableValue = function (table) {
            var result = [];
            if (!table) {
                return result;
            }

            table.headers().forEach(
                function (headItem) {
                    var subResult = buildTableValue(headItem.subTable);
                    result = [].concat.apply(result, subResult);
                    var value = headItem.id;
                    if (headItem.type === "enum") {
                        value = headItem.enumValues[0].id;
                    }
                    result.push({
                        "id": headItem.id,
                        "value": value
                    });
                }
            );

            var rows = table.rows();

            var headers = table.headers().map(
                function (header) {
                    return {
                        block: header.block,
                        controlType: header.controlType,
                        datePattern: header.datePattern,
                        enumValues: header.enumValues,
                        fieldType: header.fieldType,
                        id: header.id,
                        name: header.name,
                        readable: header.readable,
                        seq: header.seq,
                        type: header.type,
                        writable: header.writable
                    };
                }
            );

            var tableValue = JSON.stringify({
                rows: rows,
                headers: headers,
                tableName: table.tableName,
                name: table.item.name || ""
            });


            var tableItem = {
                "id": table.item.id,
                "value": tableValue
            };
            var tableId = table.item.id.split("_")[0];
            var standardArray = [];
            for (var i in rows) {
                var obj = {};
                var row = rows[i];
                for (var j in row) {
                    var key = headers[j].id.split("_")[2];
                    //key = key + "_" + (parseInt(i, 10) + 1).toString()
                    //    + (parseInt(j, 10) + 1).toString();
                    var value = row[j];
                    obj[key] = value;
                }
                standardArray.push(obj);
            }
            result.push(tableItem);
            var tableItemStandard = {
                "id": table.item.id + "_std",
                "value": JSON.stringify(standardArray)
            };
            result.push(tableItemStandard);
            return result;
        };

        self.doConfirm = function () {

            var complete = function () {
                self.popTitle($.i18n("task-submitted"));
                self.popDescription($.i18n("task-submitted-with-id", self.taskId() + " " + self.name()));
                $("#popSuccess").popup("open");

                if (self.draft()) {
                    var key = self.draft()._id;
                    BPMS.Services.deleteDocument(key);
                    self.draft(null);
                }
                self.submitted(true);
                self.loading(false);
            };

            if (self.formKey) {
                var variables = BPMS.Services.Utils.buildVariables(self.formKey, self.currentForm);
                BPMS.Services.postTasks(self.taskId(), {
                    action: "complete",
                    variables: variables
                }).then(complete, function (error) {
                    if (error && error.status >= 200 && error.status < 300) {
                        complete();
                    } else {
                        var detailMessage = (error && error.responseJSON && error.responseJSON.exception) || "该请求无法成功处理，请稍后重试";
                        self.pop("error", {
                            "title": "任务提交失败",
                            "description": self.taskId() + " " + self.name(),
                            "detail": "错误信息：" + detailMessage,
                            "code": "错误代码：" + error.status + " " + error.statusText
                        });
                        self.loading(false);
                    }

                });
                return;
            }
            var forms = Array.prototype.concat.apply([], self.forms());
            var fields = Array.prototype.concat.apply([], self.fields());
            fields = fields.filter(function (f) {
                return f && f.block && f.block.indexOf("V") === 0;
            });
            forms = forms.concat(fields);

            self.tables().forEach(function (f) {
                if (f && f.item && f.item.block && f.item.block.indexOf("V") === 0) {
                    forms.push(f.item);
                }
            });

            var readFields = self.attachmentFields.read();
            for (var i in readFields) {
                var readField = readFields[i].field;
                var readValue = readFields[i].items;
                readField.value = JSON.stringify(readValue);
                forms.push(readField);
            }

            var writeFields = self.attachmentFields.write();
            for (var i in writeFields) {
                var writeField = writeFields[i].field;
                var writeValue = ko.unwrap(writeFields[i].items);
                writeField.value = JSON.stringify(writeValue);
                forms.push(writeField);
            }

            self.loading(true);
            var values = [];
            forms.forEach(
                function (item) {
                    var id = item.id;
                    var value = ko.unwrap(item.value);
                    if (value &&
                        ($.isArray(value) ||
                            item.controlType === "tree" ||
                            item.controlType === "relation" ||
                            item.controlType === "auto")) {
                        value = JSON.stringify(value);
                    }
                    values.push({
                        "id": id,
                        "value": value
                    });
                });
            if (self.tables().length) {
                self.tables()[0].headers.forEach(function (h) {
                    var value = h.id;
                    if (h.type === "enum") {
                        value = h.enumValues[0].id;
                    }
                    values.push({
                        "id": h.id,
                        "value": value
                    });
                });
            }

            self.table.write().forEach(function (table) {
                var tableValues = buildTableValue(table);
                values = [].concat.apply(values, tableValues);
            });


            BPMS.Services.postFormData({
                "taskId": self.taskId(),
                "properties": values
            }).then(complete, function (error) {
                if (error && error.status >= 200 && error.status < 300) {
                    complete();
                } else {
                    var detailMessage = (error && error.responseJSON && error.responseJSON.exception) || "该请求无法成功处理，请稍后重试";
                    self.pop("error", {
                        "title": "任务提交失败",
                        "description": self.taskId() + " " + self.name(),
                        "detail": "错误信息：" + detailMessage,
                        "code": "错误代码：" + error.status + " " + error.statusText
                    });
                    self.loading(false);
                }

            });
        };



        self.finish = function () {
            window.location.href = "task_list.html";
            return false;
        };

        self.flow = {
            "id": ko.observable(),
            "name": ko.observable(),
            "assignee": ko.observable(),
            "date": ko.observable(),
            "time": ko.observable(),
            "coreAction": ko.observable(["", ""]),
            "coreValue": ko.observable(["", ""]),
            "coreComments": ko.observable(["", ""])
        };
        self.selectFlow = function ($data) {
            if (!$data.id) {
                return;
            }
            self.flow.id("");
            self.flow.name("");
            self.flow.assignee("");
            self.flow.date("");
            self.flow.time("");
            self.flow.coreAction(["", ""]);
            self.flow.coreValue(["", ""]);
            self.flow.coreComments(["", ""]);
            var mapped = self.historicDetails.filter(function (h) {
                return h && h.taskId === $data.id &&
                    h.processInstanceId === $data.processInstanceId &&
                    h.propertyId.toLowerCase().indexOf("core") === 0;
            });
            self.flow.id($data.id || "");
            self.flow.name($data.name || "");
            self.flow.assignee($data.assignee || "");
            self.flow.date(BPMS.Services.Utils.formatDateTime($data.endTime, "t3"));
            self.flow.time(BPMS.Services.Utils.formatDateTime($data.endTime, "t4"));
            var coreInfo = BPMS.Services.Utils.getCoreInfo(mapped);

            for (var i in coreInfo) {
                if (i && coreInfo[i]) {
                    self.flow[i]([coreInfo[i].name, coreInfo[i].value]);
                }
            }


            $("#popFlow").popup("open");
        };

        self.viewImage = function (type) {
            self.loading(true);
            if (type === "flow") {
                BPMS.Services.getProcessDefinition(self.processDefinitionId()).then(function (res) {
                    return BPMS.Services.getDeployment(res.deploymentId);
                }).then(function (res2) {
                    var item = res2.filter(function (i) {
                        return i && i.type && i.type === "resource";
                    })[0];
                    return BPMS.Services.Utils.getImage(item.contentUrl);
                }).then(function (res3) {
                    var imageData = BPMS.Services.Utils.rebuildImage(res3);
                    self.loading(false);
                    self.pop("image", {
                        "src": imageData
                    });
                });
            } else if (type === "status") {
                var src = BPMS.config.serviceUrl + "runtime/process-instances/" + self.processInstanceId() + "/diagram";
                BPMS.Services.Utils.getImage(src).then(function (res) {
                    var imageData = BPMS.Services.Utils.rebuildImage(res);
                    self.loading(false);
                    self.pop("image", {
                        "src": imageData
                    });
                });
            }
        };
        this.getStep = function (index) {
            return this.table.write()[this.tableIndex()].getStep(index);
        };
        this.getActionName = function () {
            var actionField = Array.prototype.concat.apply([], ko.unwrap(this.forms)).filter(function (field) {
                return field.id.toLowerCase().indexOf("coreaction") === 0;
            })[0];
            //var name = actionField ? actionField.id.split("_")[1] : $.i18n("tsk-submit");
			var name = actionField ? actionField.id.split("_")[1] : "任务执行页";
            return name;
        };
        // this.editExtraRow = function (row, index) {
        //     return this.table.write().editExtraRow(this.table.temp(), row, index);
        // };
        self.init = function () {
            var root = this;
            self.wxConfig();
            self.loaded(false);
            BPMS.Services.Utils.loadAttachmentTemplate();
            self.flows.removeAll();
            self.people.removeAll();
            self.canAddAttachment(false);
            self.keyword();
            self.instanceStartTime(null);
            self.priority("");
            self.instanceStartUserName(null);
            self.dueDate(null);
            self.taskDefinitionKey("");
            self.person = null;
            self.processInstanceBusinessKey("");
            self.taskVariables.removeAll();
            self.name("");
            self.draft(null);
            self.processName("");
            self.saving(false);
            self.assignee("");
            self.tab("home");
            self.owner("");
            self.ownerName("");
            self.mappings = [];
            self.description("");
            self.definitionDescription("");
            self.started(false);
            self.submitted(false);
            self.forms.removeAll();
            self.fields.removeAll();
            self.tables.removeAll();
            self.bot.reports.removeAll();
            self.bot.files.removeAll();
            self.bot.orders.removeAll();
            self.attachmentFields.totalCount(0);
            self.attachmentFields.read.removeAll();
            self.attachmentFields.write.removeAll();
            self.formKey = "";
            Formio.createForm(document.getElementById("formData"), {
                components: []
            }).then(function (form) {
                self.currentForm = form;
                $(self.currentForm.getContainer()).hide();
            });
            self.loading(true);
            BPMS.Services.getTask(self.taskId()).then(
                function (data) {
                    self.delegationState(data.delegationState);
                    self.assignee(data.assignee);
                    self.owner(data.owner);
                    self.priority(data.priority);
                    self.dueDate(data.dueDate);
                    self.taskDefinitionKey(data.taskDefinitionKey);
                    //self.owner = "100000";
                    if (self.owner()) {
                        BPMS.Services.getUsers([self.owner()]).then(
                            function (tempUser) {
                                self.ownerName(tempUser.firstName + " " + tempUser.lastName);
                            });
                    }
                    if (!self.taskId() ||
                        !self.processInstanceId() ||
                        !data ||
                        !data.id ||
                        !data.processInstanceId ||
                        data.id !== self.taskId() ||
                        data.processInstanceId !== self.processInstanceId()) {
                        window.location.href = "index.html";
                    }

                    self.started(self.assignee().toLowerCase() === self.userId && self.delegationState() !== "pending");
                    self.name(data.name);
                    self.description(data.description || "");
                    //data.formKey = "1597031027590";
                    self.formKey = data.formKey;
                    if (data.formKey) {
                        return BPMS.Services.getForm(data.formKey);
                    } else {

                        var dfd = $.Deferred();

                        dfd.resolve();
                        return dfd.promise();
                    }

                }

            ).then(function (result) {
                if (result) {
                    Formio.createForm(document.getElementById("formData"), {
                        components: result.formData

                    }, { readOnly: false }).then(function (form) {
                        self.currentForm = form;
                        $(self.currentForm.getContainer()).show();
                    });

                }
                return BPMS.Services.getTaskVariables(self.taskId());
            })
                .then(function (variables) {
                    self.taskVariables(variables);
                    var reports = variables.filter(function (variable) {
                        return variable.name.indexOf("BBOT") === 0;
                    });
                    self.bot.reports(reports);
                    var currentData= self.currentForm.data;
                    if (self.formKey) {
                        //var dataVariable = variables.find(function (variable) {
                        //    return variable.name.length === 13 && parseInt(variable.name);
                        //    //return variable.name === self.formKey;
                        var dataVariable = {};
                        variables.forEach(function (variable) {
                          if(typeof(currentData[variable.name])!=="undefined"){
							  try {
							     dataVariable[variable.name] = JSON.parse(variable.value);	
							  }
							  catch(err){
							     dataVariable[variable.name] = variable.value.toString();	
							  }
                          }
                        });
                        //if (dataVariable) {
                        //    var data = JSON.parse(dataVariable.value).data;
                        //    self.currentForm.setSubmission({ data: data });
                        //}
						console.log(dataVariable)
						self.currentForm.setSubmission({ data: dataVariable });
                    }

                    return self.getComments();

                }).then(function () {
                    //return BPMS.Services.Utils.request(BPMS.config.fileDownloaderUrl);
                });

            //.then(function (response) {
            //     response.contents.forEach(function (file) {
            //         file.size = file.length + " bytes";
            //     });
            //     self.bot.files(response.contents);
            //     return BPMS.Services.getOrders();
            // }).then(function (orders) {
            //     self.bot.orders(orders);
            // });

            BPMS.Services.getProcessDefinition(self.processDefinitionId()).then(
                function (data) {
                    self.processName(data.name);
                    self.definitionDescription(data.description);
                });

            var flows = [];

            BPMS.Services.getFormData({
                "taskId": self.taskId()
            }).then(
                function (result) {
                    var formProperties = result.formProperties;
                    var datas = BPMS.Services.Utils.analyseFormData(formProperties, true, self);
                    var readable = [];
                    var writable = [];
                    datas.fields.forEach(function (arr) {
                        readable.push([]);
                        writable.push([]);
                        arr.forEach(function (field) {
                            if (field && field.readable && !field.writable ||
                                field && field.block && field.block.indexOf("V") === 0) {
                                readable[readable.length - 1].push(field);
                            }
                            else {
                                writable[writable.length - 1].push(field);
                            }
                        });
                        var notEmpty = function (r) {
                            return r.length;
                        };
                        readable = readable.filter(notEmpty);
                        writable = writable.filter(notEmpty);

                    });

                    self.fields.removeAll();
                    self.fields(readable);

                    self.forms.removeAll();
                    //writable = Array.prototype.concat.apply([], writable);
                    self.forms(writable);

                    var tables = datas.tables.filter(function (t) {
                        return t.editable;
                    });
                    self.table.write.removeAll();
                    self.table.read.removeAll();
                    self.table.temp.removeAll();

                    tables.forEach(function (table) {
                        var isSubTable = table.tableName.indexOf("-") >= 0;
                        if (!isSubTable) {
                            self.table.write.push(table);
                        }
                        table.headers().forEach(function (field) {
                            field.value(null);
                        });

                        var tbFields = formProperties.filter(function (f) {
                            return f.id.indexOf(table.tableName + "_") === 0;
                        }).map(function (prop) {
                            return {
                                block: prop.block,
                                controlType: prop.controlType,
                                datePattern: prop.datePattern,
                                enumValues: prop.enumValues,
                                fieldType: prop.fieldType,
                                id: prop.id,
                                invalid: prop.invalid,
                                name: prop.name,
                                readable: prop.readable,
                                required: prop.required,
                                seq: prop.seq,
                                type: prop.type,
                                value: prop.value,
                                writable: prop.writable
                            };
                        });
                        if (!isSubTable) {
                            var props = BPMS.Services.Utils.analyseFormData(JSON.parse(JSON.stringify(tbFields)));
                            self.table.temp.push(props.tables[0]);

                            props = BPMS.Services.Utils.analyseFormData(JSON.parse(JSON.stringify(tbFields)));
                            self.table.read.push(props.tables[0]);

                        }

                    });

                    self.tables(datas.tables.filter(function (t) {
                        return !t.editable;
                    }));
                    //self.attachments.removeAll();
                    // if (datas.attachments.length) {
                    //     self.attachments(datas.attachments[0].value);
                    //     self.attachmentField = datas.attachments[0];
                    // }

                    var total = 0;
                    datas.attachments.forEach(function (attach) {
                        if (attach.block && attach.block.indexOf("V") === 0) {
                            var count = attach.value && attach.value.length || 0;
                            total += count;
                            self.attachmentFields.read.push({
                                field: attach,
                                items: attach.value || []
                            });
                        } else {
                            self.attachmentFields.write.push({
                                field: attach,
                                items: ko.observableArray(attach.value || [])
                            });
                        }
                    });

                    self.attachmentFields.totalCount(total);

                    //return BPMS.Services.getVariableInstances({
                    //    "processInstanceId": self.processInstanceId()
                    //})
                    self.actionName(self.getActionName());
                    BPMS.Services.Utils.switchLanguage();
                }
            );

            /*
             .then(function(variables) {
             formProperties.forEach(
             function(item) {
             if (!item.writable) {
             for (var i = 0; i < variables.data.length; i++) {
             var variableInfo = variables.data[i];
             if (variableInfo.variable.name===item.id) {
             //item.value = variableInfo.variable.value;
             break;
             }
             }
             //self.tasks.push(item);
        
             } else
             writableFields.push(item);
             }
             );
             self.bindFormData();
             });
             */

            var instance;
            BPMS.Services.getHistoricDetail({
                // "taskId": self.taskId(),
                "processInstanceId": self.processInstanceId(),
                "size": 100000
            }).then(function (result) {
                self.historicDetails = result.data;

                return BPMS.Services.getTaskInstances({
                    "processInstanceId": self.processInstanceId(),
                    "sort": "startTime",
                    "order": "asc",
                    "size": 100000
                });
            }).then(function (result2) {
                flows = result2.data;
                return BPMS.Services.getHistoricProcessInstance(self.processInstanceId());
            }).then(function (result3) {
                instance = result3;
                self.processInstanceBusinessKey(instance.businessKey);
                return BPMS.Services.getDocuments(
                    {
                        filter: {
                            type: {
                                "$regex": "TaskDraft"
                            },
                            taskId: self.taskId()
                        }
                    }
                );
            }).then(function (drafts) {
                var draft = self.started() ? drafts._embedded[0] : null;
                self.draft(draft);
                self.mapDraft(self.draft());
                return BPMS.Services.getProcessDefinition(self.processDefinitionId());
            }).then(function (definition) {
                var defaultItem = {
                    "id": "",
                    "processDefinitionId": instance.processDefinitionId,
                    "processDefinitionUrl": instance.processDefinitionUrl,
                    "processInstanceId": instance.id,
                    "processInstanceBusinessKey": instance.businessKey,
                    "processInstanceUrl": "",
                    "name": definition.name,
                    "description": definition.description,
                    "owner": "",// instance.startUserId,
                    "assignee": instance.startUserId,
                    "startTime": instance.startTime,
                    "endTime": instance.endTime
                };

                flows.unshift(defaultItem);
                var users = [];
                flows.forEach(function (flow) {
                    if (flow && flow.assignee && users.indexOf(flow, flow.assignee) < 0) {
                        users.push(flow.assignee);
                    }
                    if (flow && flow.owner && users.indexOf(flow, flow.owner) < 0) {
                        users.push(flow.owner);
                    }
                    var mapped = self.historicDetails.filter(function (h) {
                        return h && h.taskId === flow.id &&
                            h.processInstanceId === flow.processInstanceId &&
                            h.propertyId.toLowerCase().indexOf("core") === 0;
                    });

                    var coreInfo = BPMS.Services.Utils.getCoreInfo(mapped);
                    flow.coreInfo = coreInfo;

                });
                return BPMS.Services.getUsers(users);

                //self.flows.removeAll();
                //self.flows(flows);

            }, function () {
                self.pop("error", {
                    "title": "获取流程历史失败",
                    "description": "由于网络原因，无法成功获取数据，请稍后重试。"
                });
            }).then(
                function (response) {
                    Array.prototype.forEach.call(arguments, function (item, index) {
                        if (!item || (!item.length && !item.id) || item.readyState) {
                            return;
                        }
                        var singleUser = item[0] || item;
                        flows.forEach(
                            function (flow) {
                                if (flow && flow.assignee && flow.assignee === singleUser.id) {
                                    flow.assignee = singleUser.firstName + " " + singleUser.lastName;
                                }
                                if (flow && flow.owner && flow.owner === singleUser.id) {
                                    flow.owner = singleUser.firstName + " " + singleUser.lastName;
                                }
                            }
                        );
                        self.instanceStartTime(flows[0].startTime);
                        self.instanceStartUserName(flows[0].assignee);

                    });
                    self.flows(flows);
                    self.loading(false);
                    self.loaded(true);

                },
                function () {
                    self.pop("error", {
                        "title": "获取流程历史失败",
                        "description": "由于网络原因，无法成功获取数据，请稍后重试。"
                    });
                }
            );
//初始化表格明细
if(BPMS.config.tableInitialDataSource.hasOwnProperty( self.processDefinitionId().split(":")[0] )) {
	var procDefId = self.processDefinitionId().split(":")[0];
	for (var i in BPMS.config.tableInitialDataSource[procDefId]) {
	     BPMS.Services.getAuto(BPMS.config.tableInitialDataSource[procDefId][i], "null", self.user.userId).then(function (data) {
			for (var x in self.table.write()) {
				if(self.table.write()[x].tableName == i) {
					var table = self.table.write()[x];
					console.log(jQuery.parseJSON(data[0].rows))
					console.log(ko.unwrap(table.rows))
					table.rows(ko.unwrap(table.rows).concat(jQuery.parseJSON(data[0].rows)));
				}
			}
		});
	}
}	


        };
    };

    BPMS.ViewModels.TaskDetailViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, jQuery, ko);