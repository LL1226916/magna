$(function () {
    var viewModel = new window.BPMS.ViewModels.OrganizationViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
});

