$(function () {
  $('[data-toggle="tooltip"]').tooltip();
  $("#remindDate").datetimepicker({
    format: "YYYY-MM-DD HH:mm"
  });
  if (location.hash) {
    window.location.href = window.location.href.replace(location.hash, "");
    return;
  }
  var viewModel = new window.BPMS.ViewModels.TaskViewModel();
  ko.applyBindings(viewModel);
  viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
  viewModel.adjustHeight();
  $(window).resize(viewModel.adjustHeight);
  BPMS.Services.Utils.switchLanguage();
});