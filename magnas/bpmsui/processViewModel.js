(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.ProcessViewModel = function () {
        var root = this;
        window.finalVM = root;
        root.detail = new BPMS.ViewModels.ProcessCreateViewModel();
        root.loadItem = function (data) {
            root.detail.id(data.id);
            root.detail.init();
        };
    };
    BPMS.ViewModels.ProcessViewModel.extend(BPMS.ViewModels.ProcessListViewModel);
    BPMS.ViewModels.ProcessViewModel.prototype.adjustHeight = function () {
        var screen = $.mobile.getScreenHeight();
        var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight();
        var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
        var $elements = $('.main-content');
        var contentCurrent = $elements.outerHeight() - $elements.height();
        var content = screen - (header || 0) - (footer || 0) - contentCurrent - 0;

        content = Math.max(content, 0);
        $elements.height(content);


    };
    BPMS.ViewModels.ProcessViewModel.prototype.pageSize = BPMS.config.largePageSize;
    BPMS.ViewModels.ProcessViewModel.prototype.init = function () {
        var root = this;
        var baseResult = this.constructor.prototype.init.apply(this, arguments);
        baseResult.then(function () {
            var item = root[root.type()].items()[0];
            if (item) {
                root.detail.id(item.id);
                root.detail.init();
            }
        });

        //     return BPMS.Services.getProcessDefinitions(root.filters.all);
        // }).then(function (result) {
        //     root.allCount(result.total);
        //     return BPMS.Services.getProcessDefinitions(root.filters.draft);
        // }).then(function (result) {
        //     root.draftCount(result.total);
        // });
    };

    BPMS.ViewModels.ProcessViewModel.prototype.refresh = function () {
        var root = this;
        this.getData().then(function () {
            if (root.detail.id()) {
                root.detail.init();
            }
        });
    };


    BPMS.ViewModels.ProcessViewModel.prototype.getData = function () {
        var root = this;
        //var firstLoad = this.firstLoad;
        var result = this.constructor.prototype.getData.apply(this, arguments);
        return result.then(function () {
            // if (firstLoad) {
            //     $("#itemList").find("a").first().click();
            // }
        });
    };


})(window.BPMS = window.BPMS || {}, jQuery, ko);