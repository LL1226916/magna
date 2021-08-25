
ko.bindingHandlers[getBindingName("cny")] = (function () {

    return {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var modelValue = valueAccessor();
            var root = ko.contextFor(element).$root;
            var editing = ko.observable(true);
            var bigText = ko.observable("");
            var displaying = ko.computed(function () {
                return !editing();
            }, this);
            window.editing = editing;
            var displayField = $(element).closest("[data-bind]").find("textarea");
            var editField = $(element).parent();
            editIcon = $(element).next();
            var toggle = function () {
                var newValue = !editing();
                editing(newValue);
            };
            var handler = function (vm, e) {
                var text = $(e.target).val().trim();
                text = text.replace(/\,/g, "");
                var number = Number(text);
                var isValid = !isNaN(number) && text != "";

                text = isValid ? BPMS.Services.Utils.formatMoney(text) : "";
                var value = isValid ? (Number(text.trim().replace(/\,/g, ""))).toString() : null;
                $(e.target).val(text);
                modelValue(value);
                var newBigText = BPMS.Services.Utils.moneyToBig(value);
                bigText(newBigText);
            };


            ko.applyBindingsToNode(editIcon[0], {
                click: toggle
            }, bindingContext);

            ko.applyBindingsToNode(editField[0], {
                visible: editing
            }, bindingContext);

            ko.applyBindingsToNode(element, {
                event: {
                    change: handler
                }
            }, bindingContext);

            ko.applyBindingsToNode(displayField[0], {
                visible: displaying,
                value: bigText,
                click: toggle
            }, bindingContext);

            // var eidt = function (e) {
            //     $(element).parent().hide();
            // };
            // var display = function () {
            //     $(element).closest("[data-bind]").find("textarea").show();
            // };
            // $(element).next().on("click", display);
            // $(element).closest("[data-bind]").find("textarea").on("click", eidt);
        },
        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);

            if (value == null || typeof (value) == "undefined"
                || typeof (value) == "string" && value.trim() == "") {
                value = "";

            }
            $element.val(value.toString());
            $element.trigger("change");

            var $textArea = $element.closest("form").find("textarea");
            if ($textArea.is(":visible")) {
                $textArea.click();
            }
        }
    };
})();