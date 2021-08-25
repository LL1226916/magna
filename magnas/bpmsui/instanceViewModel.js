(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.InstanceViewModel = function () {
        var root = this;
        window.finalVM = root;
        root.detail = new BPMS.ViewModels.InstanceDetailViewModel();
        this.startDeleteDraft = function () {
            var detail = root.detail;
            if (!detail.type()) {
                return;
            }
            var settings = {
                title: detail.typeDesc() + ": " + detail.id(),
                code: "",
                detail: "确认删除" + detail.typeDesc() + "\"" + detail.processName() + "\"?",
                description: "",
                callback: root.deleteDraft
            };
            root.delayPop("confirm", settings);
        };
        this.deleteInstance = function () {
            var result = root.detail.delete();
            if (result) {
                result.then(function () {
                    root.updateTotalCount();
                });
            }
        };
        this.goToSuperInstance = function () {
            this.triggerDelay();
            this.inputProcessInstanceId(this.detail.superProcessInstanceId());
            this.inputBusinessKey("");
            this.init();
        };

        this.deleteDraft = function () {
            var detail = root.detail;
            if (!detail.type()) {
                return;
            }
            var baseViewModel = this;
            baseViewModel.loading(true);
            var settings = {
                type: "success",
                title: "删除" + detail.typeDesc() + "成功",
                description: "删除" + detail.typeDesc() + "成功, 数据将刷新。",
                callback: function () {
                    detail.loaded(false);
                    detail.id(null);
                    detail.type(null);

                    // return BPMS.Services.getDocuments({ count: "", pagesize: 0 }).then(function (result) {
                    //     root.draftCount(result._size);
                    //     $("#draft-tab").click();
                    // });
                    return root.updateTotalCount();
                }
            };
            return BPMS.Services.deleteDocument(detail.id()).then(function (result) {
                baseViewModel.delayObject = settings;
                //root.triggerDelay(settings);
                baseViewModel.loading(false);
            });
        };
    };
    BPMS.ViewModels.InstanceViewModel.extend(BPMS.ViewModels.InstanceListViewModel);
    BPMS.ViewModels.InstanceViewModel.prototype.pageSize = BPMS.config.largePageSize;
    BPMS.ViewModels.InstanceViewModel.prototype.init = function () {
        var root = this;
        var result = this.constructor.prototype.init.apply(this, arguments);
        return result;
    };

    BPMS.ViewModels.InstanceViewModel.prototype.getData = function () {
        var root = this;
        //var firstLoad = this.firstLoad;
        var result = this.constructor.prototype.getData.apply(this, arguments);
        return result.then(function () {
            // if (firstLoad) {
            //     $("#itemList").find("a").first().click();
            // }
        });
    };
    BPMS.ViewModels.InstanceViewModel.prototype.refresh = function () {
        var root = this;
        this.getData().then(function () {
            if (root.detail.id()) {
                root.detail.init();
            }
        });
    };


    BPMS.ViewModels.InstanceViewModel.prototype.adjustHeight = function () {
        var screen = $.mobile.getScreenHeight();
        var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight();
        var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
        var $elements = $('.main-content');
        var contentCurrent = $elements.outerHeight() - $elements.height();
        var content = screen - (header || 0) - (footer || 0) - contentCurrent - 40;

        content = Math.max(content, 0);
        $elements.height(content);

        var $innerElements = $('.inner-content');
        var innerContent = Math.max(content - 161, 0);
        $innerElements.css({
            minHeight: innerContent
        });
    };
    BPMS.ViewModels.InstanceViewModel.prototype.switchTab = function (vm, e) {
        var root = this;
        root.detail.loaded(false);
        root.detail.id(null);
        root.detail.type(null);
        var result = this.constructor.prototype.switchTab.apply(this, arguments);
        return result.then(function () {
            $("#itemList").find("a").first().click();
        });
    };
    BPMS.ViewModels.InstanceViewModel.prototype.selectItem = function ($data) {
        var id = $data && $data.id;
        if (this.detail.id() === id) {
            return;
        }
        this.detail.id(id);
        this.detail.type($data.type);
        if (this.detail.id()) {
            this.detail.init();
        }
    };

})(window.BPMS = window.BPMS || {}, jQuery, ko);
