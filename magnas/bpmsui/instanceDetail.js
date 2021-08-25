$(function () {
    var viewModel = new window.BPMS.ViewModels.InstanceDetailViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(viewModel.init.bind(viewModel));

    var links = [
        {
            "bgcolor": "#03A9F4",
            "icon": "<i class='fad fa-fw fa-bolt'></i>"


        },
        {
            "bind": "css: { \"ui-disabled\":!$root.canDelete() },event:{mousedown:function(vm,e){$root.startDelete();}}",
            "title": "删除流程实例",
            "bgcolor": "#00ACEE",
            "color": "#fffff",
            "icon": "<i class='fas fa-fw fa-trash'></i>"
        },
        {
            "bind": "event:{mousedown:function(vm,e){$root.startComments();}}",
            "title": "协同消息",
            "bgcolor": "#00ACEE",
            "color": "#fffff",
            "icon": "<i class='fas fa-fw' data-bind='css: { \"fa-comment-alt\":commentInfo.comments().length===0,\"fa-comments-alt\":commentInfo.comments().length>0 }'></i>"
        }
    ];
    $('.kc_fab_wrapper').kc_fab(links);
    ko.applyBindings(viewModel, $('.kc_fab_wrapper')[0]);
    BPMS.Services.Utils.switchLanguage();
});