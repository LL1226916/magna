$(function () {
  var viewModel = new window.BPMS.ViewModels.TagPrintViewModel();
  ko.applyBindings(viewModel);
  viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
  $("[data-toggle='tooltip']").tooltip();
	$("#offineDate").datetimepicker({
		format: "YYYY-MM-DD"
	  });
});