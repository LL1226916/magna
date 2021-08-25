ko.bindingHandlers[getBindingName("text")] = {
	init: function (element, valueAccessor, allBindings) {
		var modelValue = valueAccessor();
		var $element = $(element);
		$element.on("taphold", function (oEvent) {
			if (typeof (wx) === "undefined") {
				return;
			}
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
		return { controlsDescendantBindings: true };
	},

	update: function (element, valueAccessor) {
		var value = ko.unwrap(valueAccessor());
		var textElement = $(element).find(".ui-btn-text")[0] || element;

		$(textElement).text(value);
	}
};
