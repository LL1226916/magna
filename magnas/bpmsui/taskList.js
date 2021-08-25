$(function () {
  var viewModel = new window.BPMS.ViewModels.TaskListViewModel();
  ko.applyBindings(viewModel);
  if (location.hash) {
    window.location.href = window.location.href.replace(location.hash, "");
    return;
  }
  viewModel.ensureLogin().then(viewModel.init.bind(viewModel));
  var links = [
    {
      "bgcolor": "#e91e63",
      "icon": "<i class='fad fa-fw fa-bolt'></i>"


    },
/*     {
      "bind": "event:{mousedown:function(vm,e){startSearch();}}",
      "title": "流程搜索",
      "bgcolor": "#455a64",
      "color": "#fffff",
      "icon": "<i class='far fa-fw fa-search-plus'></i>"
    }, */
    {
      "bind": "event:{mousedown:function(vm,e){scan();}}",
      "title": "扫一扫",
      "bgcolor": "#455a64",
      "color": "#fffff",
      "icon": "<i class='far fa-fw fa-barcode-read'></i>"
    }
  ];
  $('.kc_fab_wrapper').kc_fab(links);
  ko.applyBindings(viewModel, $('.kc_fab_wrapper')[0]);
  BPMS.Services.Utils.switchLanguage();
});