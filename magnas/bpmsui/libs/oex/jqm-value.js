// keep reference of original binding in case it gets overwritten
var defaultValueBinding = ko.bindingHandlers.value;

ko.bindingHandlers[getBindingName("value")] = {
	after: defaultValueBinding.after || [],

	init: function (element, valueAccessor) {
		var modelValue = valueAccessor();
		var $element = $(element);
		var controlType = $element.attr("controlType");
		if (controlType === "t1" && typeof (wx) !== "undefined") {
			$element.on("taphold", function (oEvent) {
				wx.scanQRCode({
					desc: "扫描",
					needResult: 1,
					scanType: ["qrCode", "barCode"],
					success: function (res) {
						modelValue(res.resultStr);
					},
					error: function () {
					}
				});
			});
		}

		return defaultValueBinding.init.apply(this, arguments);
	},

	update: function (element) {
		var output = defaultValueBinding.update.apply(this, arguments);
		refreshElement(element);
		return output;
	}
};