$(function () {
   
    var viewModel = new window.BPMS.ViewModels.LoginViewModel();
    ko.applyBindings(viewModel);
    BPMS.Services.Utils.switchLanguage();
    document.onkeydown = viewModel.keyDownHandler;
    BPMS.Services.Utils.switchLanguage();
});
