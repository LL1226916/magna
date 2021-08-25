ko.bindingHandlers[getBindingName("tree")] = (function () {
    return {
        init: function (element, valueAccessor, allBindings) {
            var modelValue = valueAccessor();
            var url = "";
            var fullData = [];
            var root = ko.contextFor(element).$root;
            var $element = $(element);
			
			var autoName = "";
            for (var i in BPMS.config.treeDataSource) {
                var sourceName = i.toLowerCase().replace(/\$/g, "").replace(/ /g, "");
                var elementName = $element.attr("name").toLowerCase().replace(/\$/g, "").replace(/ /g, "");
				autoName = elementName;
                if (elementName.indexOf(sourceName) >= 0) {
                    url = BPMS.config.treeDataSource[i];
                }
            }
            var addNode = function (node, source, desitnation) {
                var selectedCode = modelValue() && modelValue().code;
                var newNode = {
                    id: node.ID,
                    code: node.CODE,
                    text: node.NAME,
                    selectable: false,
                    state: {
                        selected: !!(selectedCode && selectedCode === node.CODE)
                    }
                };
                desitnation.push(newNode);
                var children = source.filter(function (tempNode) {
                    return tempNode.PID === node.ID;//node.ID === "~" && !tempNode.PID ||
                });
                if (children.length === 0) {
                    newNode.selectable = true;
                } else {
                    newNode.nodes = [];
                    children.forEach(function (child) {
                        addNode(child, source, newNode.nodes);
                    });
                }
            }
			
			
            var showTree = function (treeItems) {

                var data = JSON.parse(JSON.stringify(treeItems));
                data.unshift({
                    "CODE": "",
                    "NAME": $(element).closest("[data-bind]").find("label").text().trim(),
                    "ID": "~",
                    "PID": ""
                });


                var treeData = [];
                addNode(data[0], data, treeData);
                var template = "<div data-role=\"popup\" data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:340px; top:-150px; background-color:#ffffff\">" +
                    "<div data-role=\"content\" style=\"padding: 9px 9px;\">" +
                    "<p align=\"center\" style=\"margin:24px 8px;\"><font color=\"#000000\"><i class=\"far fa-2x fa-sitemap\"></i></font></p>" +
                    //todo
                    "<form style=\"margin:16px 0;\" onsubmit=\"return false;\">" +
                    "<input id=\"treeFilter\" type=\"text\" data-bind=\"value:keyword,event:{change:filter}\" data-theme=\"b\" placeholder=\"快速过滤...\" style=\"font-weight:300; height:39px; font-size:medium;\">" +
                    "</form>" +
                    "<div  style=\"max-height:360px; overflow: scroll; \" >" +
                    "<div id=\"jqmTree\"></div>" +
                    "</div>" +
                    "<div class=\"ui-grid-a\">" +
                    "<div class=\"ui-block-a\"><a href=\"javascript:void(0);\" data-bind=\"click:confirm\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b \"  style=\"background-color: #37474f; color:#fff; margin-left:2px\"><i class=\"fad fa-fw fa-check\" style=\"margin-right:9px\"></i>确认</a></div>" +
                    "<div class=\"ui-block-b\"><a href=\"javascript:void(0);\" data-bind=\"click:close\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b \"  style=\"margin-right:2px;\"><i class=\"far fa-fw fa-times\" style=\"margin-right:9px\"></i>取消</a></div>" +
                    "</div>" +
                    "</div>" +
                    "</div>";

                var popElement = $(template);

                var binding = {
                    close: function () {
                        $.mobile.popup.active.close();
                        if (popElement) {
                            popElement.remove();
                        }
                    },
                    keyword: ko.observable(""),
                    filter: function () {

                        var data = JSON.parse(JSON.stringify(fullData));
                        $('#jqmTree').treeview('collapseAll');
                        $('#jqmTree').treeview('search', [this.keyword(),
                        { ignoreCase: true, exactMatch: false }]);
                    },
                    confirm: function () {
                        var nodes = $('#jqmTree').treeview("getSelected");
                        if (nodes.length === 0) {
                            modelValue(null);
                        }
                        else {
                            var obj = {
                                code: nodes[0].code,
                                name: nodes[0].text
                            };
                            modelValue(obj);
                        }
                        this.close();
                    }
                };
                root.loading(false);

                popElement.popup().popup("open");
                $("#treeFilter").textinput().textinput("refresh");
                ko.applyBindings(binding, popElement[0]);
                fullData = JSON.parse(JSON.stringify(data));
                
                $('#jqmTree').treeview({
                    data: treeData,
                    levels: 1
                });

            };			
			
            var handler = function (e) {
                root.loading(true);
                BPMS.Services.getAuto(url, "null", root.user.userId).then(showTree, function (result){
                    root.loading(false);
                    root.pop("error", {
                        "title": "获取数据失败",
                        "detail": "由于数据源无效，无法获取数据，请检查配置。",
                        "code": "错误代码：" + result.status + " " + result.statusText
                    });
                });
            };
            $(element).on("click", handler);
		
			
			
        },
        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);
            if (value) {
                $element.val(value.name);
                $element.prev().html(value.name);

            } else {
                $element.prev().html("&nbsp;");
                $element.val("");



			    var modelValue = valueAccessor();
				var url = "";
				var autoName = "";
				for (var i in BPMS.config.treeDataSource) {
					var sourceName = i.toLowerCase().replace(/\$/g, "").replace(/ /g, "");
					var elementName = $element.attr("name").toLowerCase().replace(/\$/g, "").replace(/ /g, "");
					autoName = elementName;
					if (elementName.indexOf(sourceName) >= 0) {
						url = BPMS.config.treeDataSource[i];
					}
				}
				
				var root = ko.contextFor(element).$root;
				var bindCostcenter = function (treeItems) {
				var data = JSON.parse(JSON.stringify(treeItems));
				for (var i in data) {
					
					if(data[i].ID === "1"){
						var obj = {
							code: data[i].CODE,
							name: data[i].NAME
						};
						modelValue(obj);
						
						$element.val(data[i].NAME);
						$element.prev().html(data[i].NAME);

												
					}
				}

				};	
				if(autoName.indexOf("成本中心") >= 0) {
					
					BPMS.Services.getAuto(url, "null", root.user.userId).then(bindCostcenter, function (result){
						root.loading(false);
						root.pop("error", {
							"title": "获取成本中心失败",
							"detail": "由于数据源无效，无法获取数据，请检查配置。",
							"code": "错误代码：" + result.status + " " + result.statusText
						});
					});
				}
				
				
				
				
				
				

            }
        }
    };
})();
