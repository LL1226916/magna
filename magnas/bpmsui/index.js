$(function () {
    var owl = $("#owl-demo");
    owl.owlCarousel({
        autoPlay: 5000,
        singleItem: true,
        autoHeight: true,
        pagination: false,
        transitionStyle: "fadeUp"
    });
    $('.sparkbullet').sparkline('html', {
        type: 'bullet',
        width: '90px',
        targetColor: '#ff0000',
        performanceColor: '#007fff'
    });
    if (location.hash) {
        window.location.href = window.location.href.replace(location.hash, "");
        return;
    }
    BPMS.Services.Utils.switchLanguage();
    var viewModel = new window.BPMS.ViewModels.IndexViewModel();
    ko.applyBindings(viewModel);
    viewModel.ensureLogin().then(viewModel.getSummary.bind(viewModel));
});