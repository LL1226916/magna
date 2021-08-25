$(function () {
    var viewModel = new window.BPMS.ViewModels.InstanceListViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
    BPMS.Services.Utils.switchLanguage();
});

