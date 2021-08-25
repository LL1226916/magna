// note: this does not rely on knockout's number binding
ko.bindingHandlers[getBindingName("join")] = (function () {
    return {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var modelValue = valueAccessor();
            var $element = $(element);


            var count = ko.computed(function () {
                return modelValue() ? modelValue().split(",").length : "0"
            }, this);

            var binding = {
                text: count
            };


            ko.applyBindingsToNode(element, binding, bindingContext);

        },

        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);

        }
    };
})();