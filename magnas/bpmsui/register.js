$(function () {
    var viewModel = new window.BPMS.ViewModels.RegisterViewModel();
    ko.applyBindings(viewModel);
    document.onkeydown = viewModel.keyDownHandler;
});
