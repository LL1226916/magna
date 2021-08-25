// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("auto")] = (function () {

    return {
        init: function (element, valueAccessor, allBindings) {
            var index = 0;
            var modelValue = valueAccessor();
            var $element = $(element);
            var prevent = false;
            var fnInvalid = allBindings() && allBindings().invalid;
            var controlType = $element.attr("controlType") || "psbi";
            var vm =  ko.contextFor(element).$root;
            // Prevent form submission
            var _onKeyDown = function (event) {
                if (event.keyCode === $.ui.keyCode.ENTER) {
                    event.preventDefault();
                    this._preventKeyPress = true;
                }
            };

            // Prevent form submission
            var _onKeyPress = function (event) {
                if (this._preventKeyPress) {
                    event.preventDefault();
                    this._preventKeyPress = false;
                }
            };

            var items = [];
            var updateList = function () {
                var container = $element.closest("form[data-bind]");
                if (!container.length) {
                    container = $element.closest("div[data-bind]");
                }
                var ul = container.find("ul");
                var lis = "";
                var selectItem = function (selectedItem) {

                    var name = selectedItem.intervieweeName;
                    var email = selectedItem.intervieweeEmail;
                    var key = selectedItem.intervieweeUid;
                    var selectedText = "";
                    var selectedValue = "";
                    if (controlType === "psbm") {
                        selectedText = email;
                        selectedValue = email;
                    } else if (controlType === "psbn") {
                        selectedText = name;
                        selectedValue = name;
                    } else {
                        selectedText = key;
                        selectedValue = key;
                    }
                    vm.interviewee(selectedItem);
                    modelValue(selectedValue);
                    if (fnInvalid) {
                        fnInvalid(false);
                    }
                    $element.val(selectedText);
                    ul.html("");
                    ul.hide();
                };
                if (items.length === 0) {
                    ul.html("");
                    ul.hide();
                } else if (items.length === 1) {
                    selectItem(items[0]);
                } else {

                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var showEmail = controlType === "psbm";
                        var hideStyle = "style=\"display:none;\"";
                        var li = "<li data-icon=\"check\" class=\"ui-li-has-count ui-first-child ui-last-child\">" +
                            "<a href=\"javascript:void(0)\" " +
                            "class=\"ui-btn ui-btn-icon-right ui-icon-check\">" +
                            "<span>" + item.intervieweeName + "</span>" +
                            //      "<span class=\"ui-li-count ui-body-inherit\" " + (showEmail ? "" : hideStyle) + ">" + item.intervieweeEmail + "</span>" +
                            "<span class=\"ui-li-count ui-body-inherit\" " + ((showEmail || !item.intervieweeDpt) ? hideStyle : "") + ">" + item.intervieweeDpt + "</span>";
                        li += "</a></li>";
                        lis += li;
                    }
                    ul.html(lis);
                    ul.find("li").first().addClass("ui-first-child");
                    ul.find("li").last().addClass("ui-last-child");
                    ul.find("li").click(function (e) {
                        var li = $(e.target);

                        if (li[0].tagName.toLowerCase() !== "li") {
                            li = li.closest("li");
                        }
                        var selectedItem = items[li.index()];
                        selectItem(selectedItem);
                    });
                    ul.show();
                }
            };

            var _onKeyUp = function (event) {

                if (fnInvalid) {
                    fnInvalid(true);
                }

                vm.interviewee(null);
                modelValue(null);

                var text = $element.val().trim();
                if (text) {
                    entrance.service.getSuggestion(text).then(function (result) {
                        // items = result.filter(function(person) {
                        //     return person.sn !== me;
                        // });
                        items = $.isArray(result) ? result : [result];
                        items = items.filter(function (item) {
                            return item && item.intervieweeUid;
                        });
                        updateList();
                    }, function (result) {
                        if (!vm)
                            return;

                        vm.loading(false);

                        var message = "由于网络问题，无法获取数据，请稍后重试。";
                        if (result && result.responseJSON && result.responseJSON.cause) {
                            var cause = result.responseJSON.cause;
                            message = cause.substring(cause.indexOf(":") + 1).trim();
                        }
                        vm.show( {
                            "title": "获取人员列表失败",
                            "detail": message,
                            "code": "错误代码：" + result.status + " " + result.statusText
                        });
                    });
                } else {
                    items = [];
                    updateList();
                }
            };

            var _search = BPMS.Services.Utils.debounce(_onKeyUp);

            $element.on("keydown", _onKeyDown)
                .on("keypress", _onKeyPress)
                .on("keyup", _search)
                //.on("change", _search)
                .on("input", _search);

        },

        update: function (element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var fnInvalid = allBindings() && allBindings().invalid;
            var newValue = modelValue();
            var $element = $(element);
            if (newValue) {
                $element.val(newValue);
                if (fnInvalid) {
                    fnInvalid(false);
                }
            }

        }
    };
})();