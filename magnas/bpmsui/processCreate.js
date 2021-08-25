$(function () {

    var viewModel = new window.BPMS.ViewModels.ProcessCreateViewModel();
    ko.applyBindings(viewModel);
    if (location.hash) {
        window.location.href = window.location.href.replace(location.hash, "");
        return;
    }
    viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
    var links = [
        {
            "bgcolor": "#03A9F4",
            "icon": "<i class='fad fa-fw fa-bolt'></i>"

        },
        {
            "bind": "event:{mousedown:function(vm,e){$(\"#popMore\").popup(\"open\");}}",
            "title": "保存...",
            "bgcolor": "#00ACEE",
            "color": "#fffff",
            "icon": "<i class='fas fa-fw fa-save'></i>"
        }
    ];
    $('.kc_fab_wrapper').kc_fab(links);
    ko.applyBindings(viewModel, $('.kc_fab_wrapper')[0]);
    $("#home").doubletap( function() {
        viewModel.checkNext();
    });
    BPMS.Services.Utils.switchLanguage();
});

    