
$(function () {
  var viewModel = new window.BPMS.ViewModels.ProcessBuilderViewModel();
  ko.applyBindings(viewModel);
  viewModel.ensureLogin().then(function () {
    viewModel.init();
  });
  viewModel.adjustHeight();
  $(window).resize(viewModel.adjustHeight);
  $("[data-toggle='tooltip']").tooltip();

//eventBus.on('selection.changed',
// eventBus.on('selection.changed', function(e) {  28864
//ContextPad.prototype._updateAndOpen 28988
});

// {
//   name: "ExtensionElements",
//   properties: [
//     {
//       name: "valueRef",
//       isAttr: true,
//       isReference: true,
//       type: "Element"
//     },
//     {
//       name: "values",
//       type: "Element",
//       isMany: true
//     },
//     {
//       name: "extensionAttributeDefinition",
//       type: "ExtensionAttributeDefinition",
//       isAttr: true,
//       isReference: true
//     }
//   ]
// },