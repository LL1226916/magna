// note: this does not rely on knockout's checked binding
ko.bindingHandlers[getBindingName("auto")] = (function () {

    return {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            if (!$("#autoRow").length) {
                var template = "<script type=\"text/html\" id=\"autoRow\">" +
                    "<li data-icon=\"check\" class=\"ui-li-has-count ui-first-child ui-last-child\">" +
                    "<a href=\"javascript:void(0)\" " +
                    "class=\"ui-btn ui-btn-icon-right ui-icon-check\">" +
                    "<span data-bind=\"text:$data[$parent.nameField]\"></span>" +
                    "<span class=\"ui-li-count ui-body-inherit\" data-bind=\"text:$data[$parent.keyField]\"></span>" +
                    "</a>" +
                    "</li>" +
                    "</script>";
                $("body").append(template);
            }
            var root = ko.contextFor(element).$root;
            var modelValue = valueAccessor();
            var initValue = modelValue() || null;
            modelValue(initValue);
            var $element = $(element);
            var dataSource = null;
            var meta = null;
            for (var i in BPMS.config.autoDataSource) {
                var sourceName = i.toLowerCase().replace(/\$/g, "").replace(/ /g, "");
                var elementName = $element.attr("name").toLowerCase().replace(/\$/g, "").replace(/ /g, "");
                if (elementName.indexOf(sourceName) >= 0) {
                    dataSource = BPMS.config.autoDataSource[i];
                }
            }
            if (root.getAuto) {
                viewModel.keyField = "_id";
                viewModel.nameField = "name";

            } else if (!dataSource) {
                var filter = {
                    "type": "form",
                    "formData.dataSource": { "$regex": ".*" },
                    "formData.name": { "$in": [$element.attr("name").split("_")[0]] }
                };
                BPMS.Services.getFormRules(filter).then(function (rules) {
                    var matchedRule = rules.filter(function (rule) {
                        return rule.dataSource;
                    })[0];

                    if (matchedRule) {
                        meta = matchedRule.dataSource;
                        viewModel.keyField = matchedRule.autoId;
                        viewModel.nameField = matchedRule.autoName;
                    }
                });
            }

            viewModel.keyField = viewModel.keyField || "CODE";
            viewModel.nameField = viewModel.nameField || "NAME";

            var fnInvalid = allBindings() && allBindings().invalid;

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

            var items = ko.observableArray();
            var container = $element.closest("form");

            var ul = container.find("ul")[0];
            // $element.removeAttr("data-bind");

            var childBindingContext = bindingContext.createChildContext(
                bindingContext.$rawData,
                null, // Optionally, pass a string here as an alias for the data item in descendant contexts
                function (context) {
                    ko.utils.extend(context, valueAccessor());
                });
            var selectItem = function (model, $e) {
                var tempItem = items()[$($e.target).closest("li").index()];
                modelValue({
                    code: tempItem[viewModel.keyField],
                    name: tempItem[viewModel.nameField]
                });
                items.removeAll();
                // $element.val(tempItem[viewModel.nameField]);
            };
            ko.applyBindingsToNode(element,
                {
                    event: {
                        change: function () {
                            modelValue(null);
                        }
                    }
                }, childBindingContext);


            ko.applyBindingsToNode(ul, {
                click: selectItem,
                jqmTemplate: { name: 'autoRow', foreach: items }, jqmRefreshList: items
            }, childBindingContext);

            var _onKeyUp = function (event) {

                if (fnInvalid) {
                    fnInvalid(true);
                }


                var text = $element.val();
                if (!text) {
                    items.removeAll();
                    modelValue(null);
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
                    modelValue(null);
                };
                if (dataSource || root.getAuto) {
                    var fn = root.getAuto || BPMS.Services.getAuto;
                    fn(dataSource, text.trim(), root.user.userId).then(function (result) {
                        // items = result.filter(function(person) {
                        //     return person.sn !== me;
                        // });
                        if (result._embedded) {
                            result = result._embedded;
                        }
                        items(result.slice(0, 5));
                        modelValue(null);
                    }, onError);
                } else {
                    BPMS.Services.getDependency(
                        {
                            collection: meta,
                            tenantId: "",
                            page: 1,
                            pageSize: 10000
                        }).then(function (result) {
                            var matchedItems = result.value.filter(function (item) {
                                var searchText = text.trim().toLowerCase();
                                var itemText = (item[viewModel.nameField] || "").toLowerCase();
                                return itemText.indexOf(searchText) >= 0;
                            }).slice(0, 5);
                            items(matchedItems);
                            modelValue(null);
                        }, onError);
                }
            };

            var _search = BPMS.Services.Utils.debounce(_onKeyUp);

            $element.on("keydown", _onKeyDown)
                .on("keypress", _onKeyPress)
                .on("keyup", _search)
                //.on("change", _search)
                .on("input", _search);

            return {
                "controlsDescendantBindings": true
            };

        },

        update: function (element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var fnInvalid = allBindings() && allBindings().invalid;
            var newValue = modelValue() && modelValue().name || "";
            // allBindings().value(newValue);
            $(element).val(newValue);

            if (fnInvalid) {
                fnInvalid(!newValue);
            }


        }
    };
})();