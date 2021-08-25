(function (BPMS, $, ko, moment) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.HistoryViewModel = function () {
        var self = this;
        window.finalVM = self;
        this.detail = new BPMS.ViewModels.HistoryDetailViewModel();
        //$("#itemList").find("a").first().click();
    };
    BPMS.ViewModels.HistoryViewModel.extend(BPMS.ViewModels.HistoryListViewModel);
    BPMS.ViewModels.HistoryViewModel.prototype.pageSize = BPMS.config.largePageSize;
    BPMS.ViewModels.HistoryViewModel.prototype.search = function () {
        var result = this.constructor.prototype.search.apply(this, arguments);
        result.then(function () {
            $("#itemList").find("a").first().click();
        });
    };

    BPMS.ViewModels.HistoryViewModel.prototype.adjustHeight = function () {
        var screen = $.mobile.getScreenHeight();
        var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight();
        var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
        var $elements = $('.main-content');
        var contentCurrent = $elements.outerHeight() - $elements.height();
        var content = screen - (header || 0) - (footer || 0) - contentCurrent - 0;

        content = Math.max(content, 0);
        $elements.height(content);

        var overContent = Math.max(content, 750);
        var $overElements = $(".over-content");
        $overElements.height(overContent);

        var $innerElements = $('.inner-content');
        var innerContent = Math.max(content - 191, 0);//161
        //  alert(innerContent);
        $innerElements.css({
            minHeight: innerContent
        });
    };
    BPMS.ViewModels.HistoryViewModel.prototype.selectItem = function ($data) {
        var id = $data && $data.id;
        if (this.detail.taskId() === id) {
            return;
        }
        this.detail.taskId(id);
        this.detail.processInstanceId($data && $data.processInstanceId);
        this.detail.processDefinitionId($data && $data.processDefinitionId);
        if (this.detail.taskId()) {
            this.detail.init();
        }
    };
})(window.BPMS = window.BPMS || {}, jQuery, ko, moment);