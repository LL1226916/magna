(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.EmbedFormViewModel = function () {

        var formKey = BPMS.Services.Utils.getUrlParam(window.location.href, "formKey");
        if (formKey)
            $.get(BPMS.config.collectionUrl.trim() + formKey).then(function (response) {
                Formio.createForm(document.getElementById('form'), {
                    components: response.formData
                }).then(function (form) {
                     window.currentForm = form;
                });
            });
    };
})(window.BPMS = window.BPMS || {}, jQuery, ko);