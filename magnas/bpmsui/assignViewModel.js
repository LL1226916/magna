(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.AssignViewModel = function () {
        //delegatee 受委托人
        //delegator 委托人
        window.vm = this;
        var self = this;
        this.binded = false;
        this.selectItem = function ($data) {
            this.selected = $data;
            var currentPop = $("#popSelect");
            setTimeout(function () {
                currentPop.popup("open");
                if (!self.binded) {
                    currentPop.on("popupafterclose", function () {
                        if (self.selected && self.operation) {
                            self[self.operation]();
                        }
                    });
                }
            }, 0);
        };
        this.perform = function (operation) {
            this.operation = operation;
            $("#popSelect").popup("close");
        }
        this.delete = function () {
            self.loading(true);
            var tempItem = this.selected;
            self.selected = null;
            BPMS.Services.deleteDelegate(tempItem._id).then(
                function () {
                    self.loading(false);
                    self.pop("success", {
                        "title": "删除授权成功",
                        "description": "向" + tempItem.toName + "授权记录删除成功。",
                        "callback": function () {
                            self.refresh();
                        },
                        "history": false
                    });
                },
                function (result) {
                    self.loading(false);
                    var message = "由于网络原因，无法删除数据，请稍后重试。";
                    if (result && result.responseJSON && result.responseJSON.message) {
                        message = result.responseJSON.message;
                    }
                    if (result && result.responseJSON && result.responseJSON.cause) {
                        var cause = result.responseJSON.cause;
                        message = cause.substring(cause.indexOf(":") + 1).trim();
                    }
                    console.log(result);
                    self.pop("error", {
                        "title": "删除授权失败",
                        "detail": message,
                        "code": "错误代码：" + result.status + " " + result.statusText,
                        "history": false
                    });
                }
            );
        };
        this.edit = function () {
            // BPMS.Services.deleteDelegateInfo(this.selected.id).then(
            //     function () {
            //         self.loading(false);
            //     },
            //     function () {
            //         self.loading(false);
            //
            //     }
            // );

            this.criteria.id.value(self.selected._id);
            this.criteria.start.value(self.selected.start);
            this.criteria.end.value(self.selected.end);
            this.criteria.person.value(self.selected.to);
            //$("#person").val(self.selected.delegatee.name);

            this.criteria.start.invalid(false);
            this.criteria.end.invalid(false);
            this.criteria.person.invalid(false);

        };
        this.init = function () {
            setTimeout(this.refresh.bind(this), 0);
        }
        this.items = ko.observableArray([]);
        this.refresh = function () {
            self.loading(true);
            self.selected = null;
            var data = {
                filter: {
                    from: self.user.userId,
                    tenantId: self.user.tenantId || ""
                    // start: {$gte: '1586334840000'}
                }
            };

            BPMS.Services.getDelegates(data).then(function (result) {
                self.items(result);
                self.loading(false);
            }, function (result) {
                self.loading(false);

                var message = "由于网络原因，无法获取数据，请稍后重试。";
                if (result && result.responseJSON && result.responseJSON.cause) {
                    var cause = result.responseJSON.cause;
                    message = cause.substring(cause.indexOf(":") + 1).trim();
                }
                console.log(result);
                self.pop("error", {
                    "title": "获取数据失败",
                    "detail": message,
                    "code": "错误代码：" + result.status + " " + result.statusText
                });
            }
            );
            for (var i in self.criteria) {
                var prop = self.criteria[i];
                if (prop) {
                    if (prop.value) {
                        prop.value(null);
                    }
                    if (prop.invalid) {
                        prop.invalid(true);
                    }
                }
            }


            // $("#person").val("");
            var clearBtn = $("input").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
            if (clearBtn && clearBtn.length) {
                clearBtn.click();
            }
            $("#home-tab").focus();
            self.criteria.person.value("100012");

        };


        this.criteria = {
            id: {
                "id": "id",
                name: "Id",
                value: ko.observable(""),
                controlType: "t1",
                "readable": true,
                "writable": true,
                "required": true,
                "enumValues": [],
                "seq": 0,
                "fieldType": "string"
            },
            start: {
                "id": "start",
                name: "开始时间",
                value: ko.observable(),
                controlType: "t5",
                "readable": true,
                "writable": true,
                "required": true,
                "enumValues": [],
                "seq": 1,
                "fieldType": "number",
                "liveValidate": true,
                "invalid": ko.observable(true)
            },
            end: {
                "id": "end",
                name: "结束时间",
                value: ko.observable(),
                controlType: "t5",
                "readable": true,
                "writable": true,
                "required": true,
                "enumValues": [],
                "seq": 2,
                "fieldType": "number",
                "liveValidate": true,
                "invalid": ko.observable(true)
            },
            // scope: {
            //     "id": "scope",
            //     name: "授权范围",
            //     value: ko.observable(),
            //     controlType: "rbv",
            //     "readable": true,
            //     "writable": true,
            //     "required": true,
            //     "ignoreLabel": true,
            //     "liveValidate": true,
            //     "enumValues": this.user.Roles.split(",").map(function (role) {
            //         return {"id": role, "name": role};
            //     }),
            //     "seq": 3,
            //     "fieldType": "string",
            //     "invalid": ko.observable(true)
            // },
            person: {
                "id": "person",
                name: "授权代理人",
                value: ko.observable(),
                controlType: "psbi",
                "readable": true,
                "writable": true,
                "required": true,
                "enumValues": [],
                "ignoreLabel": true,
                "seq": 3,
                "fieldType": "string",
                "invalid": ko.observable(true),
                "liveValidate": true,
                "placeholder": "人员搜索..."
            }
        };

        this.assignments = ko.observableArray([]);
        this.canSave = ko.computed(function () {
            return true;
            return !this.criteria.start.invalid() && !this.criteria.end.invalid() && !this.criteria.person.invalid();
        }, this);

        this.save = function () {

            var showError = function (result) {
                self.loading(false);
                self.pop("error", {
                    "title": "修改授权记录失败",
                    "description": result.message,
                    //"code": "错误代码：" + result.status + " " + result.statusText,
                    "history": false
                });
            };

            var item = {
                _id: this.criteria.id.value(),
                tenantId: this.user.tenantId || "",
                from: this.user.userId,
                to: this.criteria.person.value(),
                // start: new Date(Number(this.criteria.start.value())),
                // end: new Date(Number(this.criteria.end.value()))
                start: this.criteria.start.value(),
                end: this.criteria.end.value()
            };
            var isEdit = item._id;
            var operation = "";
            if (isEdit) {
                operation = "修改";
            } else {
                operation = "添加";
                item._id = moment().format("x");
            }

            var conflictItems = this.items().filter(function (tempItem) {
                return tempItem._id !== item._id &&
                    (tempItem.start > item.start && tempItem.start < item.end ||
                        tempItem.end > item.start && tempItem.end < item.end);
            });

            if (conflictItems.length) {
                showError({
                    message: "时间范围与现有记录冲突。"
                });
                return;
            }

            self.loading(true);
            BPMS.Services.saveDelegate(item).then(function () {
                self.loading(false);
                self.pop("success", {
                    "title": operation + "授权成功",
                    "description": "向" + item.to + "的授权记录" + operation + "成功。",
                    "callback": self.refresh.bind(self),
                    "history": false
                });
            }, showError);

        };
        // this.add = function () {
        //     self.loading(true);
        //     var item = {
        //         "from": this.user.userId,
        //         "to": this.criteria.person.value(),
        //         "start": this.criteria.start.value(),
        //         "end": this.criteria.end.value()
        //     };

        //     return BPMS.Services.delegate(item).then(
        //         function (result) {
        //             //console.log(result);
        //             self.loading(false);
        //             self.pop("success", {
        //                 "title": "授权成功",
        //                 "description": "向" + $("#person").val().trim() + "授权成功",
        //                 "callback": self.actionCallback
        //             });
        //         }, function (result) {
        //             self.loading(false);

        //             var message = "由于网络原因，无法成功提交数据，请稍后重试。";
        //             if (result && result.responseJSON && result.responseJSON.cause) {
        //                 var cause = result.responseJSON.cause;
        //                 message = cause.substring(cause.indexOf(":") + 1).trim();


        //             }
        //             //console.log(result);
        //             self.pop("error", {
        //                 "title": "授权失败",
        //                 "description": "向" + $("#person").val().trim() + "授权失败",
        //                 "detail": message,
        //                 "code": "错误代码：" + result.status + " " + result.statusText
        //             });
        //         }
        //     )

        // };
        this.getAvailableAssignments = function () {

        };
        this.getAssignments = function () {

        };

    };
    BPMS.ViewModels.AssignViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, jQuery, ko);