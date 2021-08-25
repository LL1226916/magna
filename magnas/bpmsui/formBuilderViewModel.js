(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.FormBuilderViewModel = function () {

        this.editingForm = {
            name: ko.observable(""),
            id: ko.observable(""),
            createdBy: ko.observable(""),
            createdAt: ko.observable(""),
            updatedBy: ko.observable(""),
            updatedAt: ko.observable("")
        };
        window.vm = this;
        this.form = new BPMS.Services.Utils.CreateTypeData();
        this.criteria = {
            id: ko.observable(""),
            name: ko.observable(""),
        };
        this.formCount = ko.observable(0);
        this.displayingForm = {
            name: ko.observable(""),
            id: ko.observable(""),
            createdBy: ko.observable(""),
            createdName: ko.observable(""),
            createdAt: ko.observable(""),
            updatedBy: ko.observable(""),
            updatedName: ko.observable(""),
            updatedAt: ko.observable(""),
        };
        this.startSaveForm = function () {
            $("#formName").parent().removeClass("ui-invalid");
            var key = this.displayingForm.id();
            if (!key) {
                this.editingForm.id(BPMS.Services.Utils.getCurrentTimeStamp().toString());
            } else {
                this.editingForm.id(key);
            }
            this.editingForm.createdBy(this.displayingForm.createdBy());
            this.editingForm.createdAt(this.displayingForm.createdAt());
            this.editingForm.name(this.displayingForm.name());
            this.delayPop("Save");
        };

        this.updateEditing = function () {
            var root = this;
            ["id", "name", "createdBy", "createdAt", "updatedBy", "updatedAt"].forEach(function (fieldName) {
                var sourceField = root.editingForm[fieldName];
                var targetField = root.displayingForm[fieldName];
                targetField(sourceField());
            });
        };
        this.selectFormItem = function (data) {
            var root = this;
            ["id", "name", "createdAt", "createdBy", "updatedAt", "updatedBy"].forEach(function (p) {
                var value = data[p] || "";
                root.displayingForm[p](value);
            });
            this.builder.webform.setForm({ components: data.formData });
        };
        this.doSaveForm = function () {
            var root = this;
            $("#formName").parent().removeClass("ui-invalid");
            if (!this.editingForm.name()) {
                $("#formName").parent().addClass("ui-invalid");
                return;
            }
            this.loading(true);
            var isUpdate = this.displayingForm.id();
            var stamp = BPMS.Services.Utils.getCurrentTimeStamp().toString();
            if (isUpdate) {
                this.editingForm.updatedBy(this.user.userId);
                this.editingForm.updatedAt(stamp);
            } else {
                this.editingForm.createdBy(this.user.userId);
                this.editingForm.createdAt(stamp);
            }
            var item = ko.toJS(this.displayingForm);
            var newItem = ko.toJS(this.editingForm);
            $.extend(item, newItem);
            item._id = item.id;
            item.type = "form";
            delete item.id;
            delete item.updatedName;
            delete item.createdName;

            item.formData = this.builder.form.components;
            if (isUpdate) {
                return BPMS.Services.updateForm(item).then(
                    function () {
                        root.loading(false);
                        root.updateEditing();
                        root.triggerDelay({
                            "type": "success",
                            "title": "保存表单成功",
                            "description": "已成功保存该表单。",
                            callback: function () {
                                root.refresh();
                            }
                        });

                    }, function () {
                        root.loading(false);
                        root.triggerDelay({
                            "type": "error",
                            "title": "保存表单失败",
                            "description": "保存表单失败, 请重试。"
                        });
                    }
                );
            } else {
                BPMS.Services.addUniqueForm(item).then(
                    function (res) {
                        root.loading(false);
                        root.updateEditing();
                        root.triggerDelay({
                            "type": "success",
                            "title": "创建表单成功",
                            "description": "已成功创建该表单。",
                            callback: function () {
                                root.getFormData();
                            }
                        });
                    }, function (res) {
                        root.loading(false);
                        if (res && res.errorType &&
                            res.errorType === "FileAlreadyExist") {
                            $("#formName").parent().addClass("ui-invalid");
                            root.loading(false);
                            return;
                        }
                        root.triggerDelay({
                            "type": "error",
                            "title": "创建表单失败",
                            "description": "创建表单失败, 请重试。"
                        });
                    }
                );
            }
        };
        this.cancel = function () {
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
        };

        this.deleteForm = function () {

        };
        this.doDeleteForm = function () {

        };
        this.getPrev = function () {
            var type = this.tab();
            var index = this[type].pageIndex();
            if (this[type].hasPrev()) {
                this[type].pageIndex(index - 1);
                this["get" + type.substring(0, 1).toUpperCase() + type.substring(1) + "Data"]();
            }
        };

        this.getFormData = function () {
            this.loading(true);
            this.form.items.removeAll();
            var size = this.pageSize;
            var page = this.form.pageIndex();
            var ids = [];
            var items = [];
            var root = this;
            var failCallback = function () {
                root.pop("error", {
                    "title": "获取Form列表失败",
                    "description": "由于网络原因，无法成功获取数据，请稍后重试。"
                });
                root.loading(false);
            };
            var filter = { type: "form" };
            if (this.criteria.id()) {
                filter._id = {
                    "$regex": ".*" + root.criteria.id() + ".*"
                }
            }
            if (this.criteria.name()) {
                filter.name = {
                    "$regex": ".*" + root.criteria.name() + ".*"
                }
            }

            return BPMS.Services.getForms({ count: "", pagesize: 0, filter: filter }).then(function (result) {
                root.formCount(result._size);
                return BPMS.Services.getForms({
                    pagesize: size,
                    page: page,
                    filter: filter
                });
            }).then(function (result) {
                items = result._embedded;
                items.forEach(function (item) {
                    item.id = item._id;
                    delete item._id;
                    item.createdBy = item.createdBy || "";
                    item.createdAt = item.createdAt || "";
                    item.createdName = "";
                    item.updatedBy = item.updatedBy || "";
                    item.updatedAt = item.updatedAt || "";
                    item.updatedName = "";
                    if (item.createdBy && ids.indexOf(item.createdBy) < 0) {
                        ids.push(item.createdBy);
                    }
                    if (item.updatedBy && ids.indexOf(item.updatedBy) < 0) {
                        ids.push(item.updatedBy);
                    }
                });
                return BPMS.Services.getUsers(ids);
            }, failCallback).then(function () {
                root.loading(false);
                Array.prototype.forEach.call(arguments, function (tempUser) {
                    if (!tempUser || (!tempUser.length && !tempUser.id) || tempUser.readyState) {
                        return;
                    }
                    var singleUser = tempUser[0] || tempUser;
                    items.forEach(
                        function (item) {

                            var fullName = (singleUser.firstName + " " + singleUser.lastName).trim();
                            if (item && item.createdBy && item.createdBy === singleUser.id) {
                                item.createdName = fullName;
                            }
                            if (item && item.updatedBy && item.updatedBy === singleUser.id) {
                                item.updatedName = fullName;
                            }
                        }
                    );

                });
                var pageCount = Math.floor((root.formCount() - 1) / size) + 1;
                root.form.pageCount(pageCount);
                root.form.items(items);
            }, failCallback);
        };

        this.getNext = function () {
            var type = this.tab();
            var index = this[type].pageIndex();
            if (this[type].hasNext()) {
                this[type].pageIndex(index + 1);
                this["get" + type.substring(0, 1).toUpperCase() + type.substring(1) + "Data"]();
            }
        };
        this.deleteForm = function () {
            this.delayPop("Delete");
        };

        this.doDeleteForm = function () {
            var root=this;
            var id = this.displayingForm.id();
            if (!id) {
                return;
            }
            this.loading(true);
            BPMS.Services.deleteForm(id).then(function () {
                root.loading(false);
                root.triggerDelay({
                    "type": "success",
                    "title": "删除表单成功",
                    "description": "已成功删除该表单。",
                    callback: function () {
                        root.refresh();
                        if (root.displayingForm.id() === id) {
                            root.resetForm();
                        }
                    }
                });
            }, function () {
                root.loading(false);
                root.triggerDelay({
                    "type": "error",
                    "title": "删除表单失败",
                    "description": "删除表单失败，请重试。"
                });
            });
        };
        this.resetForm = function () {
            var root = this;
            ["id", "createdAt", "createdBy", "name", "updatedAt", "updatedBy"].forEach(function (p) {
                root.displayingForm[p]("");
            });
            this.builder.webform.setForm({ components: [] });
        };
        this.adjustHeight = function () {
            var screen = $.mobile.getScreenHeight();
            var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight();
            var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
            var $elements = $('.main-content');
            var contentCurrent = $elements.outerHeight() - $elements.height();
            var content = screen - (header || 0) - (footer || 0) - contentCurrent - 101;
            content = Math.max(content, 0);
            $elements.height(content);
        };
        this.init = function () {
            this.tab("form");
            this.form.pageIndex(1);
            this.getFormData();
            var root = this;
            Formio.builder(document.getElementById('builder'), {}, {}).then(function (formBuilder) {
                root.builder = formBuilder;
            });
        };


    };
    BPMS.ViewModels.FormBuilderViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, jQuery, ko);