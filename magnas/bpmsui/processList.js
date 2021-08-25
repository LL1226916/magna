$(function () {
    var viewModel = new window.BPMS.ViewModels.ProcessListViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(viewModel.init.bind(viewModel));

    var links = [
        {
            "bgcolor": "#03A9F4",
            "icon": "<i class='fad fa-fw fa-bolt'></i>"


        },
/*         {
            "bind": "event:{mousedown:function(vm,e){ startSearch();}}",
            "title": "流程搜索",
            "bgcolor": "#00ACEE",
            "color": "#fffff",
            "icon": "<i class='fas fa-fw fa-search'></i>"
        }, */
        {
            "bind": "event:{mousedown:function(vm,e){$root.scan();}}",
            "title": "扫一扫",
            "bgcolor": "#3B5998",
            "color": "#fffff",
            "icon": "<i class='fas fa-fw fa-barcode-read'></i>"
        }
    ];
    $('.kc_fab_wrapper').kc_fab(links);
    ko.applyBindings(viewModel, $('.kc_fab_wrapper')[0]);

    BPMS.Services.Utils.switchLanguage();
});