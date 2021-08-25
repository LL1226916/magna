$(function () {

    var viewModel = new window.BPMS.ViewModels.AssignViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
});