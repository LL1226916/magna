// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("automulti")] = (function () {
    return {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            if (!$("#autoResultRow").length) {
                var template = "<script type=\"text/html\" id=\"autoResultRow\">" +
                    "<li data-icon=\"check\" class=\"ui-li-has-count ui-first-child ui-last-child\">" +
                    "<a href=\"javascript:void(0)\" data-bind=\"click:$parent.select.bind($parent);\"" +
                    "class=\"ui-btn ui-btn-icon-right ui-icon-check\">" +
                    "<span data-bind=\"text:name\"></span>" +
                    "<span class=\"ui-li-count ui-body-inherit\" data-bind=\"text:code\"></span>" +
                    "</a>" +
                    "</li>" +
                    "</script>";
                $("body").append(template);
            }
            if (!$("#autoSelectedRow").length) {
                var template = "<script type=\"text/html\" id=\"autoSelectedRow\">" +
                    "<li data-icon=\"delete\" \">" +
                    "<a href=\"javascript:void(0)\"  data-bind=\"click:$parent.unselect.bind($parent);\"" +
                    "class=\"\">" +
                    "<span data-bind=\"text:name\"></span>" +
                    "<span class=\"ui-li-count ui-body-inherit\" data-bind=\"text:code\"></span>" +
                    "</a>" +
                    "</li>" +
                    "</script>";
                $("body").append(template);
            }
            var dataSource;
            var root = ko.contextFor(element).$root;
            var modelValue = valueAccessor();
            var initValue = modelValue() || null;

            var format = function () {
                var value = modelValue();
                var items = (value ? JSON.parse(value) : []).map(function (item) {
                    return item.name;
                });

                if (!items.length) {
                    return "";
                }
                var text = "";
                text = items.slice(0, 4).join(",");
                if (items.length > 4) {
                    text += "...";
                }

                var result = "<span>" + text + "</span>";
                result += "<span class=\"ui-li-count ui-body-inherit\">" + items.length + "</span>"
                return result;
            }
            modelValue(initValue);
            $(element).html(format());
            for (var i in BPMS.config.autoDataSource) {
                var sourceName = i.toLowerCase().replace(/\$/g, "").replace(/ /g, "");
                var elementName = $(element).attr("name").toLowerCase().replace(/\$/g, "").replace(/ /g, "");
                if (elementName.indexOf(sourceName) >= 0) {
                    dataSource = BPMS.config.autoDataSource[i];
                }
            }

            var doSearch = function (model, event) {
                var text = $(event.target).val();
                if (!text) {
                    model.items.removeAll();
                    return;
                }
                var onError = function (result) {

                    root.loading(false);

                    var message = "由于网络问题，无法获取数据，请稍后重试。";
                    if (result && result.responseJSON && result.responseJSON.cause) {
                        var cause = result.responseJSON.cause;
                        message = cause.substring(cause.indexOf(":") + 1).trim();
                    }
                    root.pop("error", {
                        "title": "获取列表失败",
                        "detail": message,
                        "code": "错误代码：" + result.status + " " + result.statusText
                    });
                };
                if (dataSource) {
                    var fn = BPMS.Services.getAuto;
                    fn(dataSource, text.trim(), root.user.userId).then(function (result) {
                        // items = result.filter(function(person) {
                        //     return person.sn !== me;
                        // });
                        if (result._embedded) {
                            result = result._embedded;
                        }
                        model.items(result.slice(0, 5).map(function (item) {
                            return {
                                code: item.CODE,
                                name: item.NAME
                            };
                        }));
                    }, onError);
                }
            };
            var handler = function (e) {

                var template = "<div data-role=\"popup\" data-dismissible=\"false\" data-theme=\"a\" data-overlay-theme=\"a\" style=\"min-width:320px; max-width:320px; border:none;\">" +
                    "<ul data-role=\"listview\" data-inset=\"true\" style=\"border:none\">" +
                    "<li data-role=\"list-divider\" style=\"border:none; text-align: center; border-bottom-left-radius:0; border-bottom-right-radius:0; padding:14px 14px; background-color:#f7f7f7; text-shadow: none; font-weight:300; color:#000000; \"> <i class=\"far fa-fw fa-list-ul\"></i> <span data-bind=\"text:name\"></span></li>" +
                    "<ul data-role=\"listview\"  data-bind=\"jqmTemplate: { name: 'autoSelectedRow', foreach: selectedItems }, jqmRefreshList: selectedItems\" data-theme=\"b\" class=\"ui-mini ui-alt-icon ui-nodisc-icon\" data-inset=\"true\" style=\"padding: 6px 6px\">" +
                    "</ul>" +
                    "<form class=\"ui-filterable\" onsubmit=\"return false;\" novalidate data-theme=\"b\" style=\"padding: 12px 12px\">" +
                    "<input  data-bind=\"value:keyword,event:{keyup:search}\" data-type=\"search\" placeholder=\"\">" +
                    "</form>" +
                    "<ul data-role=\"listview\" data-inset=\"true\"  data-bind=\"jqmTemplate: { name: 'autoResultRow', foreach: items }, jqmRefreshList: items\"  data-theme=\"b\" class=\"ui-alt-icon ui-nodisc-icon\" style=\"padding: 12px 12px; padding-top: 0px; margin-bottom: 0px;\">" +

                    "</ul>" +
                    "<div class=\"ui-grid-a\" style=\"margin:12px 12px; padding-bottom:12px;\">" +
                    "<div class=\"ui-block-a\">" +
                    "<p align=\"center\" style=\"color:#4caf50; margin:0px 0px\"><a href=\"javascript:void(0)\" data-bind=\"click:confirm\" class=\"ui-btn ui-btn-a ui-corner-all\" style=\"color:#000000; background-color: #ffffff; margin: 4px 4px; font-weight:300;\"><i class=\"fad fa-fw fa-check\" style=\"color: #03a9f4;  margin-right: 12px\"></i><span data-i18n=\"ok\">确定</span></a></p>" +
                    "</div>" +
                    "<div class=\"ui-block-b\">" +
                    "<p align=\"center\" style=\"color:#78909c; margin:0px 0px\"><a href=\"javascript:void(0)\" data-bind=\"click:close\" class=\"ui-btn ui-btn-a ui-corner-all\"  style=\"color:#000000; margin: 4px 4px; font-weight:300;\"><i class=\"fal fa-fw fa-times\" style=\"margin-right: 12px\"></i><span data-i18n=\"cancel\">取消</span></a></p>" +
                    "</div>" +
                    "</div>" +
                    "</ul>" +
                    "</div>"

                var popElement = $(template);
                var value = modelValue();
                var initItems = value ? JSON.parse(value) : [];
                //alert($(e.target).attr("label"));
                var binding = {
                    onKeyDown: function (event) {
                        // if (event.keyCode === $.ui.keyCode.ENTER) {
                        //     event.preventDefault();
                        //     this._preventKeyPress = true;
                        // }
                    },

                    onKeyPress: function (event) {
                        // if (this._preventKeyPress) {
                        //     event.preventDefault();
                        //     this._preventKeyPress = false;
                        // }
                    },
                    search: BPMS.Services.Utils.debounce(doSearch),

                    close: function () {
                        $.mobile.popup.active.close();
                        if (popElement) {
                            popElement.remove();
                        }
                    },
                    keyword: ko.observable(""),
                    items: ko.observableArray([]),
                    selectedItems: ko.observableArray(initItems),
                    name: viewModel.name,
                    select: function (item) {
                        var found = this.selectedItems().filter(function (selectedItem) {
                            return selectedItem.code == item.code;
                        })[0];
                        if (!found) {
                            this.selectedItems.push(item);
                        }
                    },
                    unselect: function (item) {
                        var index = this.selectedItems.indexOf(item);
                        this.selectedItems.splice(index, 1);
                    },
                    confirm: function () {
                        var value = JSON.stringify(binding.selectedItems());
                        modelValue(value);
                        $(element).html(format());
                        this.close();
                    }
                };



                popElement.popup().popup("open");
                popElement.find("input").textinput();
                popElement.find("ul").listview();

                ko.applyBindings(binding, popElement[0]);
            };
            var $element = $(element).on("click", handler);

        },
        update: function (element, valueAccessor, allBindings) {

            var value = ko.unwrap(valueAccessor());

        }
    };
})();