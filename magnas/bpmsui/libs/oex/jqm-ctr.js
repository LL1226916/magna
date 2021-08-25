ko.bindingHandlers.basicField = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        var controlHtml = {
            't1': '<input style="height:39px;" control-type="t1" data-clear-btn="true" type="text"/>',
            't2': '<textarea rows="4" maxlength="200" style="overflow-y: scroll;" control-type="t2"></textarea>',
            't3': '<input style="height:39px;" control-type="t3" data-clear-btn="true" type="text"/>',
            //time
            't4': '<input style="height:39px;" control-type="t4" data-clear-btn="true" type="text"/>',
            //datetime
            't5': '<input style="height:39px;" control-type="t5" data-clear-btn="true" type="text"/>',
            //number
            't6': '<input style="height:39px;" control-type="t6" data-clear-btn="true" type="number"/>',
            //email
            't7': '<input style="height:39px;" control-type="t7" class="email" data-clear-btn="true" type="email"/>',
            //password
            't8': '<input style="height:39px;" control-type="t8" data-clear-btn="true" type="password"/>',
            //file
            't9': '<input style="height:39px;" control-type="t9" data-clear-btn="true" type="file"/>',
            't9i': '<input style="font-weight:600; height: 39px;  font-size:medium;" data-inline="true" control-type="t9i" data-clear-btn="true" type="file"/>' +
                '<input type="hidden" name="user" data-bind="value:$root.userId">' +
                '<input type="hidden" name="id" data-bind="value:$root.id">' +
                '<div class="ui-nodisc-icon ui-alt-icon" >' +
                '<p align="center"><a href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext ui-btn-inline" ' +
                ' data-bind="click:addAttachment,css: { \'ui-disabled\': !canAddAttachment()}"' +
                ' style="margin-right: 0px;">grid</a></p>' +
                '</div>' +
                '<ul data-role="listview" data-inset="true" style="margin-top:0px; padding: 3px 3px" ' +
                '  data-bind="jqmTemplate: { name: \'uploadItemTemplate\', foreach: attachments },jqmRefreshList: attachments" ' +
                ' class="ui-nodisc-icon ui-alt-icon">' +
                '</ul>',
            //tel
            't10': '<input style="height:39px;" control-type="t10" data-clear-btn="true" type="tel"/>',
            //money
            't11': '<input style="height:39px;" control-type="t11" data-clear-btn="true" type="text"/>',
            'cbv': '' +
                '<form novalidate onsubmit="return false;">' +
                '<fieldset data-role="controlgroup">' +
                '</fieldset>' +
                '</form>',
            'cbh': '' +
                '<form novalidate onsubmit="return false;">' +
                '<fieldset data-role="controlgroup" data-type="horizontal">' +
                '</fieldset>' +
                '</form>',
            'rbv': '' +
                '<form novalidate onsubmit="return false;">' +
                '<fieldset data-role="controlgroup">' +
                '</fieldset>' +
                '</form>',
            'rbh': '' +
                '<form novalidate onsubmit="return false;">' +
                '<fieldset data-role="controlgroup" data-type="horizontal">' +
                '</fieldset>' +
                '</form>',
            'sbs': '<select data-native-menu="false" data-overlay-theme="a"></select>',
            'sbm': '<select data-native-menu="false" data-overlay-theme="a" multiple="multiple" data-icon="grid" data-iconpos="left"></select>',
            'sbft': '<select data-native-menu="false" data-overlay-theme="a"></select>',
            'fs': '<fieldset>' +
                '<div data-role="fieldcontain">' +
                '<select data-role="flipswitch">' +
                '</select>' +
                '</div>' +
                '</fieldset>',
            "psbi": '<form novalidate class="ui-filterable" autocomplete="off" onsubmit="return false;">' +
                '<input style="height:39px;" data-type="search">' +
                '</form>' +
                '<ul style="display:none;" data-role="listview" class="ui-nodisc-icon ui-alt-icon ui-listview ui-listview-inset ui-corner-all ui-shadow" ' +
                ' data-inset="true">' +
                '</ul>',
            "psbm": '<form novalidate class="ui-filterable" autocomplete="off" onsubmit="return false;">' +
                '<input style="height:39px;" data-type="search">' +
                '</form>' +
                '<ul style="display:none;" data-role="listview" class="ui-nodisc-icon ui-alt-icon ui-listview ui-listview-inset ui-corner-all ui-shadow" ' +
                ' data-inset="true">' +
                '</ul>',
            "psbn": '<form novalidate class="ui-filterable" autocomplete="off" onsubmit="return false;">' +
                '<input style="height:39px;" data-type="search">' +
                '</form>' +
                '<ul style="display:none;" data-role="listview" class="ui-nodisc-icon ui-alt-icon ui-listview ui-listview-inset ui-corner-all ui-shadow" ' +
                ' data-inset="true">' +
                '</ul>',
            "bpid": '<form novalidate class="ui-filterable" autocomplete="off" onsubmit="return false;">' +
                '<input style="height:39px;" data-type="search">' +
                '</form>' +
                '<ul style="display:none;" data-role="listview" class="ui-nodisc-icon ui-alt-icon ui-listview ui-listview-inset ui-corner-all ui-shadow" ' +
                ' data-inset="true">' +
                '</ul>',
            "tree":
                // '<a href="#" role="button" class="ui-btn ui-icon-edit ui-btn-icon-right ui-btn-b ui-corner-all ui-shadow"  style="height:39px;"><span>&nbsp;</span></a>',
                '<div class="ui-input-btn ui-btn ui-icon-edit ui-btn-icon-right ui-corner-all" style="margin-top: 7px; margin-bottom: 7px">' +
                '<span>&nbsp;</span><input type="button" style="height:39px;"  data-enhanced="true">' +
                '</div>',

            "cny": '<div class="ui-input-text ui-body-b ui-corner-all ui-shadow-inset ui-input-has-clear">' +
                '<input data-icon="arrow-r" data-enhanced="true" style="height:39px;" control-type="cny" data-clear-btn="false" type="text"/>' +
                '<a href="javascript:void(0);" tabindex="-1" aria-hidden="true" class="ui-input-clear ui-btn ui-icon-eye ui-btn-icon-notext ui-corner-all" title="Clear text">Clear text</a>' +
                '</div>' +
                '<textarea rows="4" data-bind="visible:false" maxlength="100" style="overflow-y: scroll;"></textarea>',
            "auto": '<div onsubmit="return false;" novalidate class="ui-filterable" autocomplete="off">' +
                '<input style="height:39px;" data-type="search">' +
                '</div>' +
                '<ul  data-role="listview" class="ui-nodisc-icon ui-alt-icon ui-listview ui-listview-inset ui-corner-all ui-shadow" ' +
                ' data-inset="true">' +
                '</ul>',
            "relation":
                // '<a href="#" role="button" class="ui-btn ui-icon-edit ui-btn-icon-right ui-btn-b ui-corner-all ui-shadow"  style="height:39px;"><span>&nbsp;</span></a>',
                '<div class="ui-input-btn ui-btn ui-icon-user ui-btn-icon-right ui-corner-all" style="margin-top: 7px; margin-bottom: 7px">' +
                '<span>&nbsp;</span><input type="button" style="height:39px;"  data-enhanced="true">' +
                '</div>',
            'join': '<a  style="height:39px;"  href="javascript:void(0);" class="ui-btn ui-corner-all" ></a>',
            'automulti': '<a style="height:39px;"  href="javascript:void(0);" class="ui-btn ui-corner-all" ></a>',
        };
        //ui-li-has-count ui-screen-hidden
        //ui-li-has-count ui-first-child ui-last-child
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);

        var controlType = valueUnwrapped.controlType.toLocaleLowerCase();
        //if (controlType === "fs") valueUnwrapped.required = true;

        var tempHtml = controlHtml[controlType];
        var label = '<label><font size="-1" color="#607d8b"></font></label>';
        if (!valueUnwrapped.ignoreLabel) {
            if (controlType === "fs") {
                tempHtml = tempHtml.replace('<div data-role="fieldcontain">',
                    '<div data-role="fieldcontain">' + label);
            } else if ($(element).children("label").length === 0) {
                tempHtml = label + tempHtml;
            }
        }
        var title = valueUnwrapped.name + (valueUnwrapped.required ? " <font data-bind=\"visible:required\" size=\"-1\" color=\"#f44336\"><i class=\"fad fa-asterisk\"></i></font>" : "");

        $(element).append(tempHtml);
        //$(element).append(tempHtml);
        $($(element).children("label")[0]).attr("for", (valueUnwrapped.name || "").replace(/ /g, ""));
        var $font = $($(element).children("label").children("font")[0]);
        $font.html(title);
        if (valueUnwrapped.i18n) {
            $font.attr("data-i18n", valueUnwrapped.i18n);
        }
        var tag;

        if (controlType === "fs") {
            tag = $($(element).find("select")[0]);
            $($(element).find("label").children("font")[0]).html(title);

            var key = valueUnwrapped.id.replace(/\$\$/g, "").replace(/ /g, "");
            $(element).find("label").attr("for", key);
            //$(element).find("select").attr("name", key).attr("id", key);
            $(element).find("select").attr("name", key);

            var options = (valueUnwrapped.type == "enum" &&
                valueUnwrapped.enumValues &&
                valueUnwrapped.enumValues.length) ? valueUnwrapped.enumValues : [
                    {
                        "id": "否",
                        "name": "否"
                    },
                    {
                        "id": "是",
                        "name": "是"
                    }
                ];

            $.each(options, function (index, item) {
                tag.append("<option value='" + item.id.trim() + "'>" + item.name.trim() + "</option>");
            });

        } else if (controlType === "auto") {
            tag = $(element).find("input").first();
            if (valueUnwrapped.placeholder)
                tag.attr("placeholder", valueUnwrapped.placeholder);

            if (valueUnwrapped.i18n) {
                tag.attr("data-i18n", valueUnwrapped.i18n);
            }
            var key = valueUnwrapped.id.replace(/\$\$/g, "").replace(/ /g, "");
            //$(element).find("ul").data("input", "#" + key).attr("data-input", "#" + key);
            // tag.attr("name", key).attr("id", key);
            tag.attr("name", key);
        } else if (controlType === "psbi" || controlType == "psbm" || controlType == "psbn" || controlType == "bpid") {
            tag = $(element).find("input").first();
            if (valueUnwrapped.placeholder)
                tag.attr("placeholder", valueUnwrapped.placeholder);
            if (valueUnwrapped.i18n) {
                tag.attr("data-i18n", valueUnwrapped.i18n);
            }
            var key = valueUnwrapped.id.replace(/\$\$/g, "").replace(/ /g, "");
            //$(element).find("ul").data("input", "#" + key).attr("data-input", "#" + key);
            // tag.attr("name", key).attr("id", key);
            tag.attr("name", key);
        } else if (controlType === "sbs" || controlType === "sbm" || controlType === "sbft") {
            //$.mobile.selectmenu.prototype.options.hidePlaceholderMenuItems = false;
            tag = $($(element).children("select")[0]);
            if ((controlType === "sbs" || controlType === "sbft") && !valueUnwrapped.required)
                tag.append("<option data-placeholder='false' value=' '>" + "&nbsp;" + "</option>");
            $.each(valueUnwrapped.enumValues, function (index, item) {
                var option = "<option" + (item.i18n ? (" data-i18n=\"" + item.i18n + "\"") : "") + " value='" + item.id + "'>" + item.name + "</option>";
                tag.append(option);
            });
            var key = valueUnwrapped.id.replace(/\$\$/g, "").replace(/ /g, "");
            $(element).find("label").attr("for", key);
            //$(element).find("select").attr("name", key).attr("id", key);
            $(element).find("select").attr("name", key);
        } else if (controlType === "rbv" || controlType === "rbh") {
            tag = $($(element).find("fieldset")[0]);
            $.each(valueUnwrapped.enumValues, function (index, item) {
                var name = valueUnwrapped.id.replace(/\$/g, "").replace(/ /g, "") + "_group";
                var key = name + "_option" + index;
                var row = '<input type="radio" name="' + name + '" id="' + key + '" value="' + item.id + '">' +
                    '<label' + (item.i18n ? (' data-i18n="' + item.i18n + '"') : '') + ' for="' + key + '">' + item.name + '</label>';

                tag.append(row);
            });
        } else if (controlType === "cbh" || controlType === "cbv") {
            tag = $($(element).find("fieldset")[0]);
            $.each(valueUnwrapped.enumValues, function (index, item) {
                var name = valueUnwrapped.id.replace(/\$/g, "").replace(/ /g, "") + "_group";
                var key = name + "_option" + index;
                var row = '<input type="checkbox" name="' + name + '" id="' + key + '" value="' + item.id + '">' +
                    '<label for="' + key + '">' + item.name + '</label>';
                tag.append(row);
            });
        } else if (controlType === "t2") {
            tag = $(element).find("textarea");
        } else if (controlType === "t3" || controlType === "t4" || controlType === "t5") {
            tag = $(element).find("input");

            var format;
            if (controlType === "t3")
                format = "YYYY-MM-DD";
            else if (controlType === "t4")
                format = "HH:mm";
            else
                format = "YYYY-MM-DD HH:mm";
            tag.datetimepicker({
                format: format
            });
            // format: 'MM/YYYY'
        } else if (controlType === "tree" || controlType === "cny" || controlType === "relation") {
            tag = $(element).find("input");
        } else if (controlType === "join" || controlType === "automulti") {
            tag = $(element).find("a");
            //  tag.attr("label",valueUnwrapped.name||"");
        } else {
            tag = $($(element).children("input")[0]);
        }

        if (!valueUnwrapped.writable)
            tag.prop("readonly", true);
        if (valueUnwrapped.required)
            tag.prop("required", true);
        tag.attr("controlType", controlType);


        var name = valueUnwrapped.id.replace(/\$/g, "").replace(/ /g, "");
        // if (controlType !== "t9i" && controlType !== "t9") {

        // }
        tag.attr("name", name);
        tag.attr("data-theme", "b");
        if (valueUnwrapped.required)
            tag.addClass("required");
        //var binding = "value:value";
        // if (controlType == "cbv" || controlType == "cbh" || controlType === "rbv" || controlType === "rbh")
        //     binding = "checked:value";
        // if (controlType == "sbs" || controlType == "sbm" || controlType == "sbft")
        //     binding = "selected:value";
        // if (controlType == "t3" || controlType == "t4" || controlType == "t5")
        //     binding = "datetime:value";
        // if (controlType == "t6")
        //     binding = "number:value";
        // if (controlType == "t7")
        //     binding = "email:value";
        // if (controlType == "t10")
        //     binding = "tel:value";
        // if (controlType === "fs")
        //     binding = "switch:value";
        // if (controlType === "psbi"||controlType === "psbm"||controlType === "psbn")
        //     binding = "psb:value";
        // if (valueUnwrapped.liveValidate)
        //     binding += ",invalid:invalid";
        // tag.attr("data-bind", binding);

        $(element).trigger('create');
        var binding = {
            "value": valueAccessor().value
        };

        if (controlType == "cbv" || controlType == "cbh" || controlType === "rbv" || controlType === "rbh")
            binding = {
                "checked": valueAccessor().value
            };
        if (controlType === "sbs" || controlType === "sbm" || controlType === "sbft")
            binding = {
                "selected": valueAccessor().value
            };
        if (controlType == "t3" || controlType == "t4" || controlType == "t5")
            binding = {
                "datetime": valueAccessor().value
            };
        if (controlType == "t6")
            binding = {
                "number": valueAccessor().value
            };
        if (controlType == "t7")
            binding = {
                "email": valueAccessor().value
            };
        if (controlType == "t9i")
            binding = {
                "upload": valueAccessor().value
            };
        if (controlType == "t10")
            binding = {
                "tel": valueAccessor().value
            };
        if (controlType == "t11")
            binding = {
                "money": valueAccessor().value
            };
        if (controlType === "fs")
            binding = {
                "switch": valueAccessor().value
            };
        if (controlType === "psbi" || controlType === "psbm" || controlType === "psbn")
            binding = {
                "psb": valueAccessor().value
            };
        if (controlType === "bpid")
            binding = {
                "id": valueAccessor().value
            };
        if (controlType === "tree")
            binding = {
                "tree": valueAccessor().value
            };
        if (controlType === "relation")
            binding = {
                "relation": valueAccessor().value
            };
        if (controlType === "cny")
            binding = {
                "cny": valueAccessor().value
            };
        if (controlType === "auto")
            binding = {
                "auto": valueAccessor().value
            };
        if (controlType === "join")
            binding = {
                "join": valueAccessor().value,

                click: function (data) {
                    // bindingContext.$root
                    data.subTable.editSubTable(data);
                }
            };
        if (controlType === "automulti")
            binding = {
                "automulti": valueAccessor().value
            };
        if (valueUnwrapped.liveValidate)
            binding.invalid = valueAccessor().invalid;

        if (allBindings().validator) {
            binding.validator = allBindings().validator;
        }

        ko.applyBindingsToNode(tag[0], binding, bindingContext);

        if (typeof (valueUnwrapped.disabled) !== "undefined") {
            var disableElement = controlType === "t2" ? tag[0] : tag.parent()[0];

            ko.applyBindingsToNode(disableElement, {
                css: {
                    "ui-disabled": valueUnwrapped.disabled
                }
            }, bindingContext);
        }
    },
    update: function (element, valueAccessor, allBindings) {


    }
};

ko.virtualElements.allowedBindings.basicField = false;


ko.bindingHandlers.basicForm = {
    init: function (element, valueAccessor, allBindings, vm, bindingContext) {
        if (!$("#basicField").length) {
            var template = "<script type=\"text/html\" id=\"basicField\">" +
                "<form novalidate class=\"col-lg-3 col-sm-6 col-xs-12 col-md-4\" style=\"padding:3px 3px;\" onsubmit=\"return false;\"" +
                "data-bind=\"visible:(typeof($data.visible)==='undefined'||$data.visible===true|| $data.visible()) && !BPMS.Services.Utils.isJoinKey($data),basicField: $data\">" +
                "<label><font color=\"#607d8b\" size=\"-1\"></font></label>" +
                "</form>" +
                "</script>";
            $("body").append(template);
        }
        $(element).removeAttr("data-bind");
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'basicField',
                "foreach": valueAccessor()
            }
        }, bindingContext);
        $(element).trigger('create');
        var result = {
            "controlsDescendantBindings": true
        };
        if (vm.initBpmn) {
            return result;
        }
        var isSubTable = element.textContent && element.textContent.indexOf("subTable") >= 0;
        var viewModel = bindingContext.$root.detail || bindingContext.$root;
        var fields = ko.unwrap(valueAccessor());
        var normalFields = Array.prototype.concat.apply([], ko.unwrap(viewModel.fields));
        var tableFields = Array.prototype.concat.apply([], ko.unwrap(viewModel.tables).map(function (table) {
            return ko.unwrap(table.headers);
        }));
        //var allFields = isSubTable ? fields : fields.concat(tableFields);
        var processDefinitionId = ko.unwrap(viewModel.processDefinition && viewModel.processDefinition.id
            || viewModel.processDefinitionId);

        var processDefinitionKey = processDefinitionId ? processDefinitionId.split(":")[0] : "";
        var taskDefinitionKey = ko.unwrap(viewModel.taskDefinitionKey);

        if (BPMS.formAdditional) {
            setTimeout(function () {
                BPMS.formAdditional.setRules(processDefinitionKey, taskDefinitionKey, fields);
            }, 0);
        }

        return result;
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    }

};

ko.virtualElements.allowedBindings.basicForm = true;



ko.bindingHandlers.basicTable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        //var editable = valueAccessor().editable;
        var header = "<script type=\"text/html\" id=\"tableHeader\">" +
            "<th style=\"word-break: keep-all; white-space:nowrap;\" data-bind=\"visible:showCell($index()),text: $data.name\"></th>" +
            "</script>";
        /*
         var cell = "<script type=\"text/html\" id=\"tableCell\">" +
         "<td>" +
         "<!-- ko if: getCellType($data)==='string' -->" +
         "<!-- ko text:$data -->" +
         "<!-- /ko -->" +
         "<!-- /ko -->" +

         "<!-- ko if: getCellType($data)==='multi-line' -->" +
         "<!-- ko text:formatCell($data) -->" +
         "<!-- /ko -->" +
         "<!-- /ko -->" +

         "<!-- ko if: getCellType($data)==='number' -->" +
         "<!-- ko html:formatCell($data,headers,$index) -->" +
         "<!-- /ko -->" +
         "<!-- /ko -->" +

         "</td>" +

         //"<td data-bind=\"html:formatSingleProperty($data,headers,$index)\"></td>" +
         "</script>";
         */

        var cell = "<script type=\"text/html\" id=\"tableCell\">" +
            "<td data-bind=\"visible:showCell($index())\">" +
            "<!-- ko text: formatCell($data,headers,$index) -->" +
            "<!-- /ko -->" +
            "<!-- ko if: isMultiText($data) -->" +
            "<!-- ko jqmTemplate: { name: 'showText'} -->" +
            "<!-- /ko -->" +
            "<!-- /ko -->" +

            "<!-- ko if: isAttachment($data,headers,$index) -->" +
            "<!-- ko jqmTemplate: { name: 'downloadLink'} -->" +
            "<!-- /ko -->" +
            "<!-- /ko -->" +



            "<!-- ko if: ko.unwrap(headers)[ko.unwrap($index)].controlType === 'cbv' -->" +
            // "<div data-bind=\"basicField:ko.unwrap(headers)[ko.unwrap($index)]\">"+
            // "</div>"+
            "<!-- ko jqmTemplate: { name: 'quickCheckbox',data:getQuickField($data,headers,$index, $parentContext.$index)} -->" +
            "<!-- /ko -->" +
            "<!-- /ko -->" +

            "<!-- ko if: isSubField($data,$index()) -->" +
            "<!-- ko jqmTemplate: { name: 'showSubTable'} -->" +
            "<!-- /ko -->" +
            "<!-- /ko -->" +

            "</td>" +
            "</script>";

        var showText = "<script type=\"text/html\" id=\"showText\">" +
            "<a data-position-to=\"origin\" href=\"javascript:void(0);\" " +
            "data-bind=\"attr:{id:'popLink_'+Math.floor(Math.random()*1000)+'_'+$index()},click:showFullText\">" +
            "<font color=\"#03a9f4\"><i class=\"fa-file-alt\">" +
            "</i></font></a>" +
            "</script>";

        var downloadLink = "<script type=\"text/html\" id=\"downloadLink\">" +
            "<a href=\"javascript:void(0);\" data-bind=\"click:function(){$root.pop('attachments',{attachments:typeof($data)==='string'?JSON.parse($data):$data});}\">" +
            "<i class=\"fad fa-fw fa-paperclip\"></i><font size=\"-1\" style=\"color:#000000\"><span style=\"display:none;\" data-bind=\"text:'下载'\"></span></font>" +
            "</a>" +
            "</script>";

        var quickCheckbox = "<script type=\"text/html\" id=\"quickCheckbox\">" +
            "<div  data-bind=\"basicField:$data\">" +
            "</div>" +
            "</script>";


        var showSubTable = "<script type=\"text/html\" id=\"showSubTable\">" +
            "<a href=\"javascript:void(0);\" " +
            "data-bind=\"click:function(){showSubTable($data,$root,$index())}\">" +
            "<font color=\"#03a9f4\" data-bind=\"text:$data&& $data.split(',').length||'0'\"><i class=\"fa fa-file-text-o\">" +
            "</i></font></a>" +
            "</script>";

        var row = "<script type=\"text/html\" id=\"tableRow\">" +
            "<tr data-bind=\"if:$parent.isOwnRow($data)\">" +
            "<td data-bind=\"visible:$parent.editable\" style=\"text-align: center; font-weight:300; word-break: keep-all; white-space:nowrap;\" >" +
            "<a href=\"javascript:void(0);\" style=\"color:#2196f3; margin-right:12px\" data-bind=\"css: { 'ui-disabled': $parent.item.block && $parent.item.block!=='1'},click: function () { $parent.copyRow($data,$index()); }\"><i class=\"far fa-fw fa-copy\"></i></a>&nbsp;&nbsp;" +
            "<a href=\"javascript:void(0);\" style=\"color:#2196f3; margin-right:12px\" data-bind=\"css: { 'ui-disabled': $parent.item.block && $parent.item.block==='3'},click: function () { if( $parent.steps().length){ $parent.editExtraRow($data, $index());}else{$parent.editRow($data,$index());} }\"><i class=\"far fa-fw fa-pen\"></i></a>&nbsp;&nbsp;" +
            "<a href=\"javascript:void(0);\" style=\"color:#e91e63; margin-right:0px\" data-bind=\"css: { 'ui-disabled': $parent.item.block && $parent.item.block==='2'},event:{click:function () { $parent.removeRow($data) }}\"><i class=\"far fa-fw fa-trash\"></i></a>" +
            "</td>" +
            "<th class=\"rowOrder\" data-bind=\"text: ($index()+1)\"></th>" +
            "<!-- ko jqmTemplate: { name: 'tableCell', foreach: $data } -->" +
            "<!-- /ko -->" +

            "</tr>" +
            "</script>";

        var tableSum = "<script type=\"text/html\" id=\"tableSum\">" +
            "<td style=\"word-break: keep-all; white-space:nowrap;font-weight:300; color:#90a4ae\" data-bind=\"css: { 'emptySum':getSum($index())===''}, visible:showCell($index()),text: getSum($index())\"></td>" +

            "</script>";
        var table = "<script type=\"text/html\" id=\"basicTable\">" +
            "<div class=\"basicTabWrap\">" +
            "<table data-role=\"table\" class=\"ui-body-d ui-shadow table-stripe ui-responsive movie-list table-stroke\" data-mode=\"reflow\" style=\"margin-bottom: 8px; margin-top: 8px\">" +
            "<thead>" +
            "<tr class=\"ui-bar-d\">" +
            "<th data-bind=\"visible:editable\" style=\"text-align: center;word-break: keep-all; white-space:nowrap;\">操作</th>" +

            "<th style=\"text-align: center;word-break: keep-all; white-space:nowrap;\">#</th>" +
            "<!-- ko jqmTemplate: { name: 'tableHeader', foreach:headers } -->" +
            "<!-- /ko -->" +
            "</tr>" +
            "</thead>" +
            // "<tbody data-bind=\"jqmTemplate: { name: 'tableRow', foreach:rows }\">"+

            // "</tbody>" +
            "<tbody>" +
            "<!-- ko jqmTemplate: { name: 'tableRow', foreach:rows  } -->" +
            "<!-- /ko -->" +
            "<tr data-bind=\"visible:rows().length>0\" style=\"background-color:#f9f9f9;\" class=\"ui-bar-d table-sum\">" +
            "<td data-bind=\"visible:editable\" style=\"text-align: left; color:#b0bec5; font-weight:300; word-break: keep-all; white-space:nowrap;\"></td>" +
            "<th style=\"text-align: center; word-break: keep-all; white-space:nowrap;\"><i class=\"fad fa-fw fa-sigma\"></i></th>" +
            "<!-- ko jqmTemplate: { name: 'tableSum', foreach:headers } -->" +
            "<!-- /ko -->" +

            "</tr>" +
            "</tbody>" +


            "</table>" +
            "</div>" +
            "</script>";
        if (!$("#tableHeader").length) {
            $("body").append(header);
        }

        if (!$("#showText").length) {
            $("body").append(showText);
        }

        if (!$("#downloadLink").length) {
            $("body").append(downloadLink);
        }
        if (!$("#quickCheckbox").length) {
            $("body").append(quickCheckbox);
        }

        if (!$("#showSubTable").length) {
            $("body").append(showSubTable);
        }

        if (!$("#tableCell").length) {
            $("body").append(cell);
        }

        if (!$("#tableRow").length) {
            $("body").append(row);
        }
        if (!$("#tableSum").length) {
            $("body").append(tableSum);
        }

        if (!$("#basicTable").length) {
            $("body").append(table);
        }

        $(element).removeAttr("data-bind");
        var childBindingContext = bindingContext.createChildContext(
            bindingContext.$rawData,
            null, // Optionally, pass a string here as an alias for the data item in descendant contexts
            function (context) {
                ko.utils.extend(context, valueAccessor());
            });
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'basicTable',
                "data": valueAccessor()
            }
        }, childBindingContext);
        var container = $(element);
        // if (!container.prop("tagName")) {
        //     container = container.parent();
        // }
        container.trigger('create');
        return {
            "controlsDescendantBindings": true
        };
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

ko.virtualElements.allowedBindings.basicTable = true;


ko.bindingHandlers.basicTables = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var collapsibleTable =
            "<script type=\"text/html\" id=\"collapsibleTable\">" +
            "<div data-bind=\"visible:typeof($data.parentTable)==='undefined'\" class=\"row\">" +
            "<legend style=\"margin-bottom: 12px;\">" +
            "<font color=\"#b0bec5\"><b data-bind=\"text:$data.item.name\"></b></font>" +
            "</legend>" +
            "<div data-role=\"collapsible\" class=\"ui-alt-icon ui-nodisc-icon\" data-collapsed=\"false\" data-collapsed-icon=\"carat-d\"" +
            "data-expanded-icon=\"carat-u\" style=\"margin-top:18px;\" data-iconpos=\"right\">" +
            "<h4><i class=\"fad fa-fw fa-sigma\"></i>&nbsp;<span data-bind=\"text:$data.rows().length\"></span></h4>" +
            "<!-- ko  basicTable: $data -->" +
            "<!-- /ko -->" +
            "</div>" +
            "</div>" +
            "</script>";
        if (!$("#collapsibleTable").length) {
            $("body").append(collapsibleTable);
        }
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'collapsibleTable',
                "foreach": valueAccessor()
            }
        }, bindingContext);
    },

    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
        // var $ele = $(element);
        // if (!$ele.prop("tagName")) {
        //     $ele = $ele.parent();
        // }
        // window.york = $ele;

        // setTimeout(function () {
        //     $ele.i18n();
        // }, 5);
    }
};

ko.virtualElements.allowedBindings.basicTables = true;


ko.bindingHandlers.previewTable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var previewTable =
            "<script type=\"text/html\" id=\"previewTable\">" +
            "<div class=\"row\">" +
            "<legend style=\"margin-bottom: 3px;\">" +
            "<font size=\"-1\" color=\"#b0bec5\"><i class=\"fad fa-fw fa-table\"></i>&nbsp;<b data-bind=\"text:item.name\"></b></font>" +
            "</legend>" +
            "<div data-role=\"collapsible\" class=\"ui-alt-icon ui-nodisc-icon\" data-collapsed=\"false\" data-collapsed-icon=\"carat-d\"" +
            "data-expanded-icon=\"carat-u\" style=\"margin-top:18px;\" data-iconpos=\"right\">" +
            "<h4><i class=\"fad fa-fw fa-sigma\"></i>&nbsp;<span data-bind=\"text:$data.rows().length\"></span></h4>" +
            "<!-- ko  basicTable: $data -->" +
            "<!-- /ko -->" +
            "</div>" +
            "</div>" +
            "</script>";


        if (!$("#previewTable").length) {
            $("body").append(previewTable);
        }
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'previewTable',
                "data": valueAccessor()
            }
        }, bindingContext);
        var $element = $(element);
        var node = $element.prop("tagName") ? $element : $element.parent();
        node.trigger('create');
        return {
            "controlsDescendantBindings": true
        };
    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

ko.virtualElements.allowedBindings.previewTable = true;



ko.bindingHandlers.stepFields = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (!$("#stepField").length) {
            var template = "<script type=\"text/html\" id=\"stepField\">" +
                "<form novalidate onsubmit=\"return false;\" class=\"col-lg-3 col-sm-6 col-xs-12 col-md-3\" style=\"padding:3px 3px;\"" +
                "data-bind=\"visible:visible,basicField: $data\">" +
                "<label><font color=\"#607d8b\" size=\"-1\"></font></label>" +
                "</form>" +
                "</script>";
            $("body").append(template);
        }
        $(element).removeAttr("data-bind");
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'stepField',
                "foreach": valueAccessor()
            }
        }, bindingContext);

        $(element).trigger('create');
        return {
            "controlsDescendantBindings": true
        };
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

ko.virtualElements.allowedBindings.stepFields = true;


ko.bindingHandlers.stepGroup = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (!$("#stepGroup").length) {
            var template = "<script type=\"text/html\" id=\"stepGroup\">" +
                "<div class=\"row\" style=\"margin: 6px 6px; margin-top: 16px;\">" +
                "<div class=\"col-lg-2 col-sm-3 col-xs-6 col-md-6\" style=\"padding:3px 3px;\">" +
                "<p style=\"font-size: large; font-weight:300; color: #546e7a;\"><span data-i18n=\"step\">Step</span><span data-bind=\"text:'...'+(($index&&$index()|| 0)+1 )\"></span></p>" +
                "</div>" +
                "<div class=\"col-lg-2 col-sm-3 col-xs-6 col-md-6\" style=\"padding:3px 3px;\">" +
                "<p align=\"left\" style=\"font-size: large; font-weight:300; color: #2196f3\"><span data-i18n=\"wizard\"></span>&nbsp;<i data-bind=\"css:{'fa-magic':!$data[$data.length-1].isEnd,'fa-stop-circle':$data[$data.length-1].isEnd},click:function(){($root.detail||$root).getStep($index());}\" class=\"fad fa-fw\"></i></p>" +
                "</div>" +
                "</div>" +
                "<div class=\"row\" style=\"margin: 6px 6px\">" +
                "<!-- ko stepFields: $data -->" +
                "<!-- /ko -->" +
                "</div>";
            "</script>";
            $("body").append(template);
        }
        $(element).removeAttr("data-bind");
        var childBindingContext = bindingContext.createChildContext(
            bindingContext.$rawData,
            null, // Optionally, pass a string here as an alias for the data item in descendant contexts
            function (context) {
                ko.utils.extend(context, valueAccessor());
            });
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'stepGroup',
                "foreach": valueAccessor()
            }
        }, childBindingContext);

        $(element).trigger('create');
        return {
            "controlsDescendantBindings": true
        };
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

ko.virtualElements.allowedBindings.stepGroup = true;


ko.bindingHandlers.stepForm = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        $(element).removeAttr("data-bind");
        var childBindingContext = bindingContext.createChildContext(
            bindingContext.$rawData,
            null, // Optionally, pass a string here as an alias for the data item in descendant contexts
            function (context) {
                ko.utils.extend(context, valueAccessor());
            });
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'stepGroup',
                "data": valueAccessor()
            }
        }, childBindingContext);
        return {
            "controlsDescendantBindings": true
        };
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

ko.virtualElements.allowedBindings.stepForm = true;



ko.virtualElements.allowedBindings.datatable = true;
ko.bindingHandlers.datatable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var data = valueAccessor()();
        // if (!data.formatCell) {
        //     data.formatCell = function () {
        //         return "ab";
        //     };
        // }
        console.log(viewModel);
        var datatable =
            "<script type=\"text/html\" id=\"datatable\">" +
            "<table data-bind=\"visible:headers && headers.length\" class=\"table table-striped table-bordered\" cellspacing=\"0\" width=\"100%\">" +
            "<thead>" +
            "<tr>" +
            "<!-- ko foreach: headers -->" +
            "<th data-bind=\"text: $data.name\"></th>" +
            "<!-- /ko -->" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            "<!-- ko foreach: rows -->" +
            "<tr>" +
            "<!-- ko foreach: $parent.headers -->" +
            "<td data-bind=\"text:$parents[1].formatCell($parent,$data.id)\"></td>" +
            "<!-- /ko -->" +
            "</tr>" +
            "<!-- /ko -->" +
            "</tbody>" +
            "</table>" +
            "</script>";

        if (!$("#datatable").length) {
            $("body").append(datatable);
        }
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'datatable',
                "data": valueAccessor()
            }
        }, bindingContext);
        return {
            "controlsDescendantBindings": true
        };
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var table = $(element).next();
        refresh = table.is("table.table") && valueAccessor()().headers.length;
        if (refresh) {
            table.DataTable(BPMS.Services.Utils.datatableOptions);
        }
        // setTimeout(function () {
        //     if (table.refresh) {
        //         table.DataTable(BPMS.Services.Utils.datatableOptions);
        //         table.refresh = false;
        //     }
        // }, 0);
    }
};

ko.bindingHandlers.dateTimeSpan = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var divClass = allBindings() && allBindings().styleClass || "col-lg-4 col-sm-6 col-xs-12 col-md-4"
        var dateTimeSpan =
            "<script type=\"text/html\" id=\"dateTimeSpan\">" +
            "<div class=\"" + divClass + "\"" +
            "data-bind=\"with:start,basicField: start,validator:$data\"" +
            "style=\"padding:3px 3px;\">" +
            "</div>" +
            "<div class=\"" + divClass + "\"" +
            "data-bind=\"with:end,basicField: end,validator:$data\"" +
            "style=\"padding:3px 3px;\">" +
            "</div>" +
            "</script>";
        if (!$("#dateTimeSpan").length) {
            $("body").append(dateTimeSpan);
        }
        var parent = valueAccessor();
        parent.validate = function () {
            var invalid = true;
            var value1 = parent.start.value();
            var value2 = parent.end.value();
            if (value1 && value2) {
                var allowEqual = (parent.start.controlType == "t3" && parent.end.controlType == "t3");
                if (allowEqual && value1 <= value2) {
                    invalid = false;
                } else if (value1 < value2) {
                    invalid = false;
                }
            } else {
                var startValid = !parent.start.required || !!value1;
                var endValid = !parent.end.required || !!value2;
                if (startValid && endValid) {
                    invalid = false;
                }
            }
            parent.start.invalid(invalid);
            parent.end.invalid(invalid);
        }
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'dateTimeSpan',
                "data": valueAccessor()
            }
        }, bindingContext);
        return {
            "controlsDescendantBindings": true
        };

    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

ko.virtualElements.allowedBindings.dateTimeSpan = true;

ko.bindingHandlers.attachmentGrop = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var attachmentList =
            "<script type=\"text/html\" id=\"attachmentList\">" +
            "<div class=\"row\">" +
            "<ul data-role=\"listview\"" +
            "	data-bind=\"jqmTemplate: { name: 'attachmentRead', foreach: items }, jqmRefreshList: items\"" +
            "	data-inset=\"true\" style=\"margin-top:0px;\">" +
            "</ul>" +
            "</div>" +
            "</script>";
        if (!$("#attachmentList").length) {
            $("body").append(attachmentList);
        }
        ko.applyBindingsToNode(element, {
            "jqmTemplate": {
                "name": 'attachmentList',
                "foreach": valueAccessor()
            }
        }, bindingContext);
        return {
            "controlsDescendantBindings": true
        };
    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

ko.virtualElements.allowedBindings.attachmentGrop = true;

if (!Math.sum) {
    Math.sum = function () {
        var result = 0;
        for (var i = 0; i < arguments.length; i++) {
            result += arguments[i];
        }
        return result;
    }
}
