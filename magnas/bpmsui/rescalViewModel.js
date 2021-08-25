(function (BPMS, $, ko, moment) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.TaskViewModel = function () {
        window.finalVM = this;
        this.popType = "";
        this.detail = new BPMS.ViewModels.TaskDetailViewModel();
        this.goDetail = function () {
            BPMS.ViewModels.TaskListViewModel.prototype.selectItem.apply(this, [{
                "id": this.detail.taskId(),
                "processInstanceId": this.detail.processInstanceId(),
                "processDefinitionId": this.detail.processDefinitionId()
            }]);
        };
        this.popupMoreMenu = function () {
            this.detail.delayPop("MoreMenu",{positionTo:'#btnMoreMenu'});
        };

    };
    BPMS.ViewModels.TaskViewModel.extend(BPMS.ViewModels.TaskListViewModel);
    BPMS.ViewModels.TaskViewModel.prototype.pageSize = BPMS.config.largePageSize;
    BPMS.ViewModels.TaskViewModel.prototype.init = function () {
        var root = this;
        var result = this.constructor.prototype.init.apply(this, arguments);
    };
    BPMS.ViewModels.TaskViewModel.prototype.switchTab = function (vm, e) {
        var root = this;
        root.detail.taskId("");
        root.detail.processInstanceId("");
        root.detail.processDefinitionId("");
        root.detail.loaded(false);
        var result = this.constructor.prototype.switchTab.apply(this, arguments);
        return result.then(function () {
            $("#itemList").find("a").first().click();
        });
    };
    BPMS.ViewModels.TaskViewModel.prototype.getData = function (type, index) {
        
        return this.constructor.prototype.getData.apply(this, arguments);
       
    };


    BPMS.ViewModels.TaskViewModel.prototype.adjustHeight = function () {
        var screen = $.mobile.getScreenHeight();
        var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight();
        var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
        var $elements = $('.main-content');
        var contentCurrent = $elements.outerHeight() - $elements.height();
        var content = screen - (header || 0) - (footer || 0) - contentCurrent - 41;

        content = Math.max(content, 0);
        $elements.height(content);

        var $innerElements = $('.inner-content');
        var innerContent = Math.max(content - 23, 0);
        $innerElements.css({
            minHeight: innerContent
        });
    };
    BPMS.ViewModels.TaskViewModel.prototype.refresh = function () {
        var root = this;
        this.getData().then(function () {
            if (root.detail.taskId()) {
                root.detail.init();
            }
        });
    };
    BPMS.ViewModels.TaskViewModel.prototype.selectItem = function ($data) {
        var id = $data && $data.id;
        this.detail.taskId(id);
        this.detail.processInstanceId($data && $data.processInstanceId);
        this.detail.processDefinitionId($data && $data.processDefinitionId);
        if (this.detail.taskId()) {
            this.detail.init();
        }
    };

})(window.BPMS = window.BPMS || {}, jQuery, ko, moment);