$(function () {
    var viewModel = new window.BPMS.ViewModels.ReportListViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(function () {
        viewModel.init();
      });
});

