$(function () {
    var viewModel = new window.BPMS.ViewModels.HistoryListViewModel();
    ko.applyBindings(viewModel);
      viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
      BPMS.Services.Utils.switchLanguage();
});