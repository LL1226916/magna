$(function () {
    var viewModel = new window.BPMS.ViewModels.TaskDetailViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
    if (location.hash) {
        window.location.href = window.location.href.replace(location.hash, "");
        return;
    }
    $("[data-toggle='tooltip']").tooltip();
    $("#remindDate").datetimepicker({
        format: "YYYY-MM-DD HH:mm"
    });
    $("#action").doubletap(function () {
        viewModel.checkNext();
    });
    //$("table.table").DataTable(BPMS.Services.Utils.datatableOptions);
    var links = [
/*       {
            "bgcolor": "#e91e63",
            "icon": "<i class='fad fa-fw fa-bolt'></i>"


        },
        {
            "bind": "event:{mousedown:function(vm,e){$(\"#popDraft\").popup(\"open\");}}",
            "title": "保存...",
            "bgcolor": "#607d8b",
            "color": "#fffff",
            "icon": "<i class='fas fa-fw fas fa-fw fa-save'></i>"
        },
        {
            "bind": "event:{mousedown:function(vm,e){$root.startComments();}}",
            "title": "协同消息",
            "bgcolor": "#607d8b",
            "color": "#fffff",
            "icon": "<i class='fas fa-fw' data-bind='css: { \"fa-comment-alt\":commentInfo.comments().length===0,\"fa-envelope-open-text\":commentInfo.comments().length>0 }'></i>"

        },
        {
            "bind": "event:{mousedown:function(vm,e){$root.popRemind();}}",
            "title": "日历提醒",
            "bgcolor": "#607d8b",
            "color": "#fffff",
            "icon": "<i class='fas fa-fw fa-calendar'></i>"
        }
*/
    ];
    $('.kc_fab_wrapper').kc_fab(links);
    ko.applyBindings(viewModel, $('.kc_fab_wrapper')[0]);
    BPMS.Services.Utils.switchLanguage();
});