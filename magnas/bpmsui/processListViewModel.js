(function (BPMS, $, ko) {

    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.ProcessListViewModel = function () {
        var self = this;
        window.vm = self;
        self.nameLike = ko.observable("");
        self.keyLike = ko.observable("");
        self.categoryLike = ko.observable();
        self.getCategory = function (url) {
            return BPMS.Services.Utils.getCategory(url);
        };
        self.allCount = ko.observable();
        self.draftCount = ko.observable();
        self.filters = {
            "all": {
                "sort": "id",
                "order": "desc",
                startableByUser: self.user.userId,
                suspended: false
            }, "draft": {
            }
        };
        self.type = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "type") || "all");
        self.startSearch = function () {
            $("#popSearch").popup("open");
        };
        ["all", "draft"].forEach(
            function (item) {
                self[item] = new BPMS.Services.Utils.CreateTypeData();
                self[item].pageIndex(1);
            }
        );
        var state = BPMS.Services.Utils.getUrlParams(window.location.href);
        if (state && state.nameLike) {
            self.nameLike(state.nameLike);
        }
        if (state && state.keyLike) {
            self.keyLike(state.keyLike);
        }
        if (state && state.categoryLike) {
            self.categoryLike(state.categoryLike);
        }
        if (state && state.pageIndex) {
            self[self.type()].pageIndex(parseInt(state.pageIndex, 10));
        }

        self.selectItem = function (data) {
            //sessionStorage.setItem('process', JSON.stringify(data));
            var param = {
                "type": self.type(),
                "pageIndex": self[self.type()].pageIndex()
            };
            if (self.nameLike()) {
                param.nameLike = self.nameLike();
            }
            if (self.keyLike()) {
                param.keyLike = self.keyLike();
            }
            if (self.categoryLike()) {
                param.categoryLike = self.categoryLike();
            }
            var url = window.location.href;
            var index = url.indexOf("?");
            if (index >= 0) {
                url = url.substr(0, index);
            }
            if (history.replaceState) {
                history.replaceState(param, document.title, url + "?" + $.param(param));
            }
            window.location.href = "process_create.html?" + $.param({
                "processDefinitionId": data.id
            });
        };

        self.getNext = function () {
            var currentType = self.type();
            if (self[currentType].hasNext()) {
                self[currentType].pageIndex(self[currentType].pageIndex() + 1);
                self.getData();
            }
        };

        self.getPrev = function () {
            var currentType = self.type();
            if (self[currentType].hasPrev()) {
                self[currentType].pageIndex(self[currentType].pageIndex() - 1);
                self.getData();
            }
        };
    };
    BPMS.ViewModels.ProcessListViewModel.extend(BPMS.ViewModels.BaseViewModel);
    BPMS.ViewModels.ProcessListViewModel.prototype.pageSize = BPMS.config.pageSize;
    
    BPMS.ViewModels.ProcessListViewModel.prototype.getData = function (type, index) {
        var self=this;
        self.loading(true);
        var currentType = type || self.type();
        var start = (self[currentType].pageIndex() - 1) * self.pageSize;
        var option = self.filters[currentType];
        option.size = self.pageSize;
        option.start = start;
        delete option.nameLike;
        delete option.keyLike;
        delete option.categoryLike;
        if (self.nameLike()) {
            option.nameLike = "%" + self.nameLike() + "%";
        }
        if (self.keyLike()) {
            option.keyLike = "%" + self.keyLike() + "%";
        }
        if (self.categoryLike()) {
            option.categoryLike = "%" + self.categoryLike() + "%";
        }

        self[currentType].items.removeAll();
        return BPMS.Services.getProcessDefinitions(option).then(function (result) {
            result.data.forEach(function (item) {
                self[currentType].items.push(item);
            });
            var pageCount = Math.floor((result.total - 1) / self.pageSize) + 1;
            self[currentType].pageCount(pageCount);
            self.loading(false);
        }, function () {
            self.pop("error", {
                "title": "获取任务列表失败",
                "description": "由于网络原因，无法成功获取数据，请稍后重试。"
            });
            self.loading(false);
        });
    };
    BPMS.ViewModels.ProcessListViewModel.prototype.init = function () {
        this.wxConfig();
        var currentType = this.type();
        this[currentType].items([]);
        this[currentType].pageCount(0);
        return this.getData();
    };
    BPMS.ViewModels.ProcessListViewModel.prototype.selectCategory = function (category) {
        var currentType = this.type();
        this.categoryLike(category);
        this[currentType].pageIndex(1);
        this.getData();
    };
    BPMS.ViewModels.ProcessListViewModel.prototype.doSearch = function () {
        var root = this;
        this.getData().then(function () {
            root.triggerDelay("");
        }, function () {
            root.triggerDelay({
                "type": "error",
                "title": "获取任务列表失败",
                "description": "由于网络原因，无法成功获取数据，请稍后重试。"
            });
        });
    };
    BPMS.ViewModels.ProcessListViewModel.prototype.switchTab = function (vm, e) {
        var a = $(e.target).closest("a");
        var tempType = a.attr("id").replace("-tab", "");
        this.type(tempType);
        this[tempType].pageIndex(1);
        this.getData();
        a.tab("show");
        e.preventDefault();
    };
})(window.BPMS = window.BPMS || {}, jQuery, ko);