(function (BPMS, $, ko, moment) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.InstanceListViewModel = function () {
        var userId = this.user && this.user.userId;
        var self = this;
        window.vm = this;
        self.inputBusinessKey = ko.observable("");
        self.inputProcessId = ko.observable("");
        self.getFilters = function () {
            var tempFilters = JSON.parse(JSON.stringify(this.filters));
            var instanceId = this.inputProcessId();
            var businessKey = this.inputBusinessKey();
            for (var i in tempFilters) {
                var filter = tempFilters[i];
                if (businessKey) {
                    filter.processBusinessKey = businessKey;
                }
                if (instanceId) {
                    filter.processInstanceId = instanceId;
                }
            }
            return tempFilters;
        };
        self.filters = {
            "unfinished": {
                "startedBy": userId,
                "finished": false
            },
            "due": {
                "startedBy": userId,
                "dueBefore": moment().format("YYYY-MM-DDTHH:mm:ssZ")
            },
            "finished": {
                "startedBy": userId,
                "finished": true
            },
            "involved": {
                "finished": false,
                "variables": [
                    {
                        "name": "involved_user",
                        "value": userId,
                        "operation": "equals",
                        "type": "string"
                    }
                ]
            }
        };
        var type = BPMS.Services.Utils.getUrlParam(window.location.href, "type") || "unfinished";
        this.type = ko.observable(type);
        self.invalidFileName = ko.observable(false);

        var businessKey = BPMS.Services.Utils.getUrlParam(window.location.href, "businessKey");
        self.inputBusinessKey(businessKey);

        var processInstanceId = BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId");
        var processDefinitionId = BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId");
        self.inputProcessId(processInstanceId || processDefinitionId);

        ["unfinished", "finished", "involved", "draft"].forEach(
            function (item) {
                self[item] = new BPMS.Services.Utils.CreateTypeData();
            }
        );
        this.formatName = function (id, name) {
            if (!id)
                return name;
            if (!name)
                return id;
            return [id.trim(), name.trim()].join(": ");
        };

        this.unfinishedCount = ko.observable();
        this.dueCount = ko.observable();
        this.finishedCount = ko.observable();
        this.involvedCount = ko.observable();
        this.draftCount = ko.observable();

        self.getPrev = function () {
            var currentType = self.type();
            var index = self[currentType].pageIndex();
            if (self[currentType].hasPrev()) {
                self[currentType].pageIndex(index - 1);
                self.getData();
            }
        };
        self.getNext = function () {
            var currentType = self.type();
            var index = self[currentType].pageIndex();
            if (self[currentType].hasNext()) {
                self[currentType].pageIndex(index + 1);
                self.getData();
            }
        };
    };
    BPMS.ViewModels.InstanceListViewModel.extend(BPMS.ViewModels.BaseViewModel);
    BPMS.ViewModels.InstanceListViewModel.prototype.pageSize = BPMS.config.pageSize;
    BPMS.ViewModels.InstanceListViewModel.prototype.init = function () {
        var root = this;
        //root.firstLoad = true;
        var state = BPMS.Services.Utils.getUrlParams(window.location.href);
        if (state && state.type) {
            root.type(state.type);
            root[state.type].pageIndex(parseInt(state.pageIndex, 10));
        }
        root.updateTotalCount();
       // $("a[id='" + root.type() + "-tab']").click();
    };
    BPMS.ViewModels.InstanceListViewModel.prototype.updateTotalCount = function () {
        var root = this;
        root.loading(true);
        var filters = root.getFilters();
        var task1 = BPMS.Services.queryHistoricProcessInstances(filters.unfinished);
        var task2 = task1.then(function (result) {
            root.unfinishedCount(result.total);
            return BPMS.Services.queryHistoricProcessInstances(filters.finished);
        });
        var task3 = task2.then(function (result) {
            root.finishedCount(result.total);
            return BPMS.Services.queryHistoricProcessInstances(filters.involved);
        });
        var task4 = task3.then(function (result) {
            root.involvedCount(result.total);
            var param = { count: "", pagesize: 0, filter: {} };
            if (root.inputProcessId()) {
                param.filter.processDefinitionId = root.inputProcessId();
            }
            return BPMS.Services.getDocuments(param);
        });
        task4.then(function (result) {
            root.draftCount(result._size);
            root.loading(false);
        });
        $("a[id='" + root.type() + "-tab']").click();
    };

    BPMS.ViewModels.InstanceListViewModel.prototype.switchTab = function (vm, e) {
        var a = $(e.target).closest("a");
        var tempType = a.attr("id").replace("-tab", "");
        this.type(tempType);
        this[tempType].pageIndex(1);
        return this.getData().then(function () {
            a.tab("show");
            e.preventDefault();
        });
    };

    BPMS.ViewModels.InstanceListViewModel.prototype.getData = function () {

        var root = this;

        root.loading(true);
        var currentType = root.type();
        root[currentType].items.removeAll();
        var size = this.pageSize;
        var page = root[currentType].pageIndex();
        var start = (page - 1) * size;
        var filters = root.getFilters();
        var param = {
            "start": start,
            "size": size,
            "order": "desc",
            "sort": "startTime"
        };

        $.extend(param, filters[currentType]);

        var now = moment().format("YYYY-MM-DDTHH:mm:ssZ");
        if (param.dueBefore) {
            param.dueBefore = now;
        }

        var items;
        var baseRequest;
        if (root.type() === "draft") {
            var draftParam = {
                pagesize: size,
                page: page, filter: {}
            };
            if (root.inputProcessId()) {
                draftParam.filter.processDefinitionId = root.inputProcessId();
            }

            baseRequest = BPMS.Services.getDocuments(draftParam).then(function (result) {
                items = result._embedded.map(function (item) {
                    return {
                        "id": item._id,
                        "type": item.type,
                        "businessKey": item.businessKey,
                        "involvedUser": item.involvedUser,
                        "processDefinitionId": item.processDefinitionId,
                        "startTime": BPMS.Services.Utils.formatDateTime(parseInt(item._id, 10), "t5"),
                        "startUserId": item.userId,
                        "variables": [],
                    };
                });
                var pageCount = Math.floor((root.draftCount() - 1) / size) + 1;
                root[currentType].pageCount(pageCount);
                var requests = result._embedded.map(function (item) {
                    var deferred = $.Deferred();
                    BPMS.Services.getProcessDefinition(item.processDefinitionId).complete(deferred.resolve);
                    return deferred;
                });
                root[currentType].items.removeAll();
                return $.when.apply(this, requests);
            });
        } else {
            baseRequest = BPMS.Services.queryHistoricProcessInstances(param)
                .then(function (result) {
                    items = result.data;
                    var pageCount = Math.floor((result.total - 1) / size) + 1;
                    root[currentType].pageCount(pageCount);
                    var requests = result.data.map(function (item) {
                        return BPMS.Services.Utils.request(item.processDefinitionUrl, {});
                    });
                    root[currentType].items.removeAll();
                    //root[currentType + "Count"](result.total);
                    return $.when.apply(this, requests);
                });
        }
        return baseRequest.then(function () {
            var hasDeleted = false;
            var results = arguments;
            if (results.length > 1 && typeof (results[1]) === "string") {
                results = [results[0]];
            }
            Array.prototype.forEach.call(results, function (responseItem, index) {
                var item = responseItem.length ? responseItem[0] : responseItem;
                if (item.responseJSON) {
                    item = item.responseJSON;
                }
                if (typeof (item) !== "object" || !item.id) {
                    hasDeleted = true;
                    items[index].type = items[index].type || "";
                    items[index].category = "";
                    items[index].processName = "";
                    items[index].processDescription = "";
                    items[index].version = "";
                    items[index].processDefinitionId = "";

                } else {
                    items[index].type = items[index].type || "";
                    items[index].category = BPMS.Services.Utils.getCategory(item.category);
                    items[index].processName = item.name || "";
                    items[index].processDefinitionId = item.id || "";
                    items[index].processDescription = item.description || "";
                    items[index].version = item.version;
                }
                root[currentType].items.push(items[index]);
            });
            console.log(root[currentType].items());
            if (hasDeleted) {
                root.pop("error", {
                    "title": $.i18n("error-draft-title"), //含有失效的草稿
                    "description": $.i18n("error-draft-description")//部分草稿已失效（流程被删除），请手动删除草稿。
                });
            }
            //root.firstLoad = false;
            root.loading(false);
        }, function () {
            root.pop("error", {
                "title": "获取流程实例列表失败",
                "description": "由于网络原因，无法成功获取数据，请稍后重试。"
            });
            root.loading(false);
        });
    };
    BPMS.ViewModels.InstanceListViewModel.prototype.doSearch = function () {
        var root = this;
        root.updateTotalCount();
        $.mobile.popup.active.close();
        // root.getData().then(function () {
        //     root.triggerDelay("");
        // }, function () {
        //     root.triggerDelay({
        //         "type": "error",
        //         "title": "获取流程实例列表失败",
        //         "description": "由于网络原因，无法成功获取数据，请稍后重试。"
        //     });
        // });
    };
    BPMS.ViewModels.InstanceListViewModel.prototype.selectItem = function ($data, $index) {
        var root = this;
        var currentType = root.type();
        var size = BPMS.config.pageSize;
        var state = {
            "type": currentType,
            "pageIndex": root[currentType].pageIndex()
        };
        var url = window.location.href;
        var index = url.indexOf("?");
        if (index >= 0)
            url = url.substr(0, index);
        if (history.replaceState)
            history.replaceState(state, document.title, url + "?" + $.param(state));


        var page = root[currentType].pageIndex();
        var start = (page - 1) * size + $index;

        var param = {
            "start": start,
            "size": 1,
            "order": "desc",
            "sort": "startTime"
        };
        $.extend(param, root.filters[currentType]);
        var now = moment().format("YYYY-MM-DDTHH:mm:ssZ");
        if (param.dueBefore) {
            param.dueBefore = now;
        }

        var queryInfo = {
            "param": param,
            "hasPrev": root[currentType].hasPrev() || $index > 0,
            "hasNext": root[currentType].hasNext() || $index < root[currentType].items().length - 1
        };

        $data.queryInfo = queryInfo;
        sessionStorage.setItem("instance", JSON.stringify($data));
        if ($data.type) {
            param = {
                draftId: $data.id,
                processDefinitionId: $data.processDefinitionId
            };
            window.location.href = "process_create.html?" + $.param(param);
        }
        else {
            param = {
                "processInstanceId": $data.id,
                "processDefinitionId": $data.processDefinitionId
            };
            window.location.href = "instance_detail.html?" + $.param(param);
        }


        return false;
    };
})(window.BPMS = window.BPMS || {}, jQuery, ko, moment);