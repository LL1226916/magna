$(function () {
    var viewModel = new window.BPMS.ViewModels.LoginViewModel();
    ko.applyBindings(viewModel);
    document.onkeydown = viewModel.keyDownHandler;
});
