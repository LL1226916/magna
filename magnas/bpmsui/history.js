$(function () {
  var viewModel = new window.BPMS.ViewModels.HistoryViewModel();
  ko.applyBindings(viewModel);
  viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
  BPMS.Services.Utils.switchLanguage();
  viewModel.adjustHeight();
  $(window).resize(viewModel.adjustHeight);
});