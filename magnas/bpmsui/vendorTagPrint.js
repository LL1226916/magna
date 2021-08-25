$(function () {
  var viewModel = new window.BPMS.ViewModels.VendorTagPrintViewModel();
  ko.applyBindings(viewModel);
  viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
  $("[data-toggle='tooltip']").tooltip();
	$("#offineDate,#batch").datetimepicker({
		format: "YYYY-MM-DD"
	  });
});