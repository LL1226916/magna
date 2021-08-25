
$(function () {

  var viewModel = new window.BPMS.ViewModels.FormBuilderViewModel();
  ko.applyBindings(viewModel);

  viewModel.adjustHeight();
  viewModel.ensureLogin().then(function () {
    viewModel.init();
  });
});

