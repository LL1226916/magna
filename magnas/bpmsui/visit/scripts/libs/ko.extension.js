ko.virtualElements.allowedBindings.jqmTemplate = true;

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
            $ele.listview('refresh');
        } catch (e) {
            //$(element).listview();
        }
    }
};

ko.virtualElements.allowedBindings.jqmRefreshList = true;
ko.bindingHandlers.jqmRefreshList = {
    update: function (element, valueAccessor) {

        ko.utils.unwrapObservable(valueAccessor()); //just to create a dependency
        setTimeout(function () { //To make sure the refresh fires after the DOM is updated

            try {
                var $ele = $(element);
                if (!$ele.prop("tagName")) {
                    $ele = $ele.parent();
                }
                $ele.listview();
                $ele.listview('refresh');
            } catch (e) {
                //$(element).listview();
            }

        }, 0);
    }
};


ko.virtualElements.allowedBindings.jqmCollapsibleSet = true;
ko.bindingHandlers.jqmCollapsibleSet = {
    update: function (element, valueAccessor) {

        ko.utils.unwrapObservable(valueAccessor()); //just to create a dependency
        setTimeout(function () { //To make sure the refresh fires after the DOM is updated
            $(element).trigger("create");
            // $('.collapsible').collapsible();


        }, 0);
    }
};



//infuser.defaults.templateUrl = "templates";
