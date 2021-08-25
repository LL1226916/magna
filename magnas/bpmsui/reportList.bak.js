BPMS.Services.Utils.checkLoginStatus();
$(function () {

    var viewModel = new window.BPMS.ViewModels.ReportListViewModel();
    ko.applyBindings(viewModel);
});

