ko.virtualElements.allowedBindings.jqmTemplate = true;
ko.virtualElements.allowedBindings.jqmRefreshList = true;
ko.bindingHandlers.jqmTemplate = {
    init: ko.bindingHandlers.template.init,
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        ko.bindingHandlers.template.update(element, valueAccessor,
            allBindingsAccessor, viewModel, context);
        try {
            var $ele = $(element);
            if (!$ele.prop("tagName")) {
                $ele = $ele.parent();
            }
            if ($ele.i18n) {
                $ele.i18n();
            }
            $ele.listview('refresh');
           
        } catch (e) {
            //$(element).listview();
        }
    }
};

ko.bindingHandlers.jqmRefreshList = {
    update: function (element, valueAccessor) {

        ko.utils.unwrapObservable(valueAccessor()); //just to create a dependency
        setTimeout(function () { //To make sure the refresh fires after the DOM is updated

            try {
                var $ele = $(element);
                if (!$ele.prop("tagName")) {
                    $ele = $ele.parent();
                }
                if ($ele.i18n) {
                    $ele.i18n();
                }
                $ele.listview();
                $ele.listview('refresh');
             
            } catch (e) {
                //$(element).listview();
            }

        }, 0);
    }
};

ko.bindingHandlers.jQueryButtonDisable = {
    update: function (element, valueAccessor) {
        //first call the real enable binding
        ko.bindingHandlers.disable.update(element, valueAccessor);

        //do our extra processing
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).button();
        $(element).button(value ? "disable" : "enable");
    }
};


infuser.defaults.templateUrl = "templates";
