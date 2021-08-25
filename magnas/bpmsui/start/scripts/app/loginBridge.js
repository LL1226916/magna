$(function () {
    var viewModel = new window.BPMS.ViewModels.LoginBridgeViewModel();
    ko.applyBindings(viewModel);
    document.onkeydown = viewModel.keyDownHandler;
});
