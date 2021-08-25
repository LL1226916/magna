$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    var viewModel = new window.BPMS.ViewModels.ProcessViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
    viewModel.adjustHeight();
    $(window).resize(viewModel.adjustHeight);
    BPMS.Services.Utils.switchLanguage();
});