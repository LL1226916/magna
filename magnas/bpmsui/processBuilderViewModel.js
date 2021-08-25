(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.ProcessBuilderViewModel = function () {
        var root = this;
        window.vm = root;
        this.deployments = ko.observableArray([]);
        this.settingTab = ko.observable("");
        this.sourceForm = ko.observable();
        this.deployDetail = {
            category: ko.observable(),
            deploymentTime: ko.observable(),
            id: ko.observable(""),
            name: ko.observable(""),
            tenantId: ko.observable(""),
            url: ko.observable(""),
            xml: {
                "id": ko.observable(""),
                "url": ko.observable(""),
                "contentUrl": ko.observable(""),
                "mediaType": ko.observable(""),
                "type": ko.observable(""),
                "xmlData": ko.observable("")
            },
            image: {
                "id": ko.observable(""),
                "url": ko.observable(""),
                "contentUrl": ko.observable(""),
                "mediaType": ko.observable(""),
                "type": ko.observable(""),
                "imageData": ko.observable("")
            }
        };
        this.deployName = ko.observable("");
        this.resetDeployDetail = function (obj) {
            for (var i in obj) {
                if (ko.isObservable(obj[i])) {
                    obj[i]("");
                }
                else if (obj[i]) {
                    this.resetDeployDetail(obj[i]);
                }
            }
        };
        this.formula = {
            id: "",
            calculate: ko.observable(""),
            operations: [
                { id: "", name: "" },
                { id: "+", name: "+" },
                { id: "-", name: "-" },
                { id: "*", name: "*" },
                { id: "/", name: "/" },
                { id: "Math.sin()", name: "sin" },
                { id: "Math.cos()", name: "cos" },
                { id: "Math.max()", name: "max" },
                { id: "Math.min()", name: "min" },
                { id: "Math.sum()", name: "sum" }],
            fields: ko.observableArray([])
        };

        this.insertFormulaText = function (item) {
            var element = $("#editCalculate");
            var text = item.id;
            var startIndex = element.prop("selectionStart");
            var endIndex = element.prop("selectionEnd");

            var currentText = this.formula.calculate();
            var head = currentText.substring(0, startIndex).trim();
            var tail = currentText.substring(endIndex).trim();
            var addition = " " + text + " ";
            var newText = (head + addition + tail).trim();
            var newIndex = head.length + addition.length - 1;
            this.formula.calculate(newText);
            setTimeout(function () {
                element.prop("selectionStart", newIndex);
                element.prop("selectionEnd", newIndex);
            }, 0);
            console.log(newIndex);
        };

        this.getAuto = function (url, keyword, userId) {
            var filter = { type: "form" };
            filter.name = {
                "$regex": ".*" + keyword.trim() + ".*"
            };
            return BPMS.Services.getForms({
                filter: filter
            });
        };

        // this.selectOperation = function (operation) {
        //     var text = this.formula.calculate() + " " + operation;
        //     this.formula.calculate(text.trim());
        // };
        // this.selectField = function (field) {
        //     var text = this.formula.calculate() + " " + field.id;
        //     this.formula.calculate(text.trim());
        // };
        this.setFormula = function () {
            var expression = this.formula.calculate();
            $("#" + this.formula.id).val(expression);
            this.cancel();
        };

        this.deployDetail.image.contentUrl.subscribe(function (value) {
            if (value) {
                BPMS.Services.Utils.getImage(value).then(function (res) {
                    var imageData = BPMS.Services.Utils.rebuildImage(res);
                    root.deployDetail.image.imageData(imageData);
                });
            } else {
                root.deployDetail.image.imageData("");
            }
        });

        this.deployDetail.xml.contentUrl.subscribe(function (value) {
            if (value) {
                BPMS.Services.Utils.request(value, null, { dataType: "text" }).then(function (xmlData) {
                    root.deployDetail.xml.xmlData(xmlData);
                }, function (error) {
                    console.log(error);
                });
            } else {
                root.deployDetail.xml.xmlData("");
            }
        });

        this.settingTab.subscribe(function (newType) {
            if (!newType) {
                return;
            }
            var target = $("#" + newType + "-tab");
            if (target.closest("li").hasClass("active")) {
                return;
            }
            target.click();
        }, null, "change");
        this.switchSettingTab = function (vm, e) {
            var a = $(e.target).closest("a");
            var tempType = a.attr("id").replace("-tab", "");
            vm.settingTab(tempType);
        };
        this.convertToDesign = function () {
            this.sourceForm(null);
            this.ensureSelect = $.Deferred();
            $("#popConvertForm").popup("open");
            //popConvertForm
            this.ensureSelect.promise().then(function (item) {
                root.initBpmn(root.deployDetail.xml.xmlData());
                root.templateForm = item;
                root.cancel();
            });
        };

        this.confirmConvert = function () {
            var selectedItem = root.sourceForm();
            if (!selectedItem) {
                root.ensureSelect.resolve(null);
                return;
            }
            BPMS.Services.Utils.request(BPMS.config.collectionUrl.trim() + selectedItem.code).then(function (item) {
                root.ensureSelect.resolve(item);
            });
        };

        this.init = function () {
            var tab = BPMS.Services.Utils.getUrlParam(window.location.href, "tab") || "form";
            this.tab(tab);
            this.settingTab("processsetting");
            this.refresh();
            this.getDeployData();
            BPMS.Services.getMetaList().then(function (result) {
                var metas = result._embedded;
                root.initFormBuilder(metas);
            });
        };
        this.adjustHeight = function () {
            var screen = $.mobile.getScreenHeight();
            var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight();
            var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
            var $elements = $('.main-content');
            var contentCurrent = $elements.outerHeight() - $elements.height();
            var content = screen - (header || 0) - (footer || 0) - contentCurrent - 101;
            content = Math.max(content, 0);
            $elements.height(content);
        };
        root.formData = ko.observableArray();
        root.editingForm = {
            name: ko.observable(""),
            id: ko.observable(""),
            remark: ko.observable(""),
            accessibility: ko.observable("read"),
            createdBy: ko.observable(""),
            createdAt: ko.observable(""),
            updatedBy: ko.observable(""),
            updatedAt: ko.observable("")
        };
        root.displayingForm = {
            name: ko.observable(""),
            id: ko.observable(""),
            remark: ko.observable(""),
            accessibility: ko.observable("read"),
            createdBy: ko.observable(""),
            createdName: ko.observable(""),
            createdAt: ko.observable(""),
            updatedBy: ko.observable(""),
            updatedName: ko.observable(""),
            updatedAt: ko.observable(""),
        };

        root.displayingProcess = {
            name: ko.observable(""),
            id: ko.observable(""),
            remark: ko.observable(""),
            createdBy: ko.observable(""),
            createdName: ko.observable(""),
            createdAt: ko.observable(""),
            updatedBy: ko.observable(""),
            updatedName: ko.observable(""),
            updatedAt: ko.observable(""),
        };
        root.editingProcess = {
            properties: ko.observableArray([]),
            form: ko.observableArray([]),
            type: "",
            id: ""
        }
        root.getPrev = function () {
            var type = root.tab();
            var index = root[type].pageIndex();
            if (root[type].hasPrev()) {
                root[type].pageIndex(index - 1);
                root["get" + type.substring(0, 1).toUpperCase() + type.substring(1) + "Data"]();
            }
        };

        root.getNext = function () {
            var type = root.tab();
            var index = root[type].pageIndex();
            if (root[type].hasNext()) {
                root[type].pageIndex(index + 1);
                root["get" + type.substring(0, 1).toUpperCase() + type.substring(1) + "Data"]();
            }
        };
        root.criteria = {
            id: ko.observable(""),
            name: ko.observable(""),
            remark: ko.observable("")
        };
        root.refresh = function () {
            var filter = { type: "form" };
            if (root.criteria.id()) {
                filter._id = {
                    "$regex": ".*" + root.criteria.id() + ".*"
                }
            }
            if (root.criteria.name()) {
                filter.name = {
                    "$regex": ".*" + root.criteria.name() + ".*"
                }
            }
            if (root.criteria.remark()) {
                filter.remark = {
                    "$regex": ".*" + root.criteria.remark() + ".*"
                }
            }
            root.loading(true);
            return BPMS.Services.getForms({ count: "", pagesize: 0, filter: filter }).then(function (result) {
                root.formCount(result._size);
            }).then(root.getFormData);
        };
        root.pageSize = BPMS.config.pageSize;
        root.formCount = ko.observable();
        root.deployCount = ko.observable();

        root.form = new BPMS.Services.Utils.CreateTypeData();
        root.form.pageIndex(1);
        root.deploy = new BPMS.Services.Utils.CreateTypeData();
        root.deploy.pageIndex(1);
        root.startSave = function () {
            // $("#formId").parent().removeClass("ui-invalid");
            $("#formName").parent().removeClass("ui-invalid");
            // ["formId", "formName", "formRemark"].forEach(function (property) {
            //     var clearBtn = $("#" + property).parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
            //     if (clearBtn && clearBtn.length) {
            //         clearBtn.click();
            //     }
            // });
            var key = root.displayingForm.id();
            if (!key) {
                root.editingForm.id(BPMS.Services.Utils.getCurrentTimeStamp().toString());
            }
            else {
                root.editingForm.id(key);
            }
            root.editingForm.createdBy(root.displayingForm.createdBy());
            root.editingForm.createdAt(root.displayingForm.createdAt());
            root.editingForm.name(root.displayingForm.name());
            root.editingForm.remark(root.displayingForm.remark());
            root.editingForm.accessibility(root.displayingForm.accessibility() || "read");
            root.delayPop("Save");
        };
        root.isField = function (data) {
            var id = data.id;
            if (id.indexOf("tb") === 0) {
                if (id.split("_")[1] === "item") {
                    return false;
                }
            }
            return true;
        };
        root.updateEditing = function () {
            ["id", "name", "remark", "accessibility", "createdBy", "createdAt", "updatedBy", "updatedAt"].forEach(function (fieldName) {
                var sourceField = root.editingForm[fieldName];
                var targetField = root.displayingForm[fieldName];
                targetField(sourceField());
            });
        };
        root.doSave = function () {
            $("#formName").parent().removeClass("ui-invalid");
            if (!root.editingForm.name()) {
                $("#formName").parent().addClass("ui-invalid");
                return;
            }
            root.loading(true);
            var isUpdate = root.displayingForm.id();
            var stamp = BPMS.Services.Utils.getCurrentTimeStamp().toString();
            if (isUpdate) {
                root.editingForm.updatedBy(root.user.userId);
                root.editingForm.updatedAt(stamp);
            } else {
                root.editingForm.createdBy(root.user.userId);
                root.editingForm.createdAt(stamp);
            }
            var item = ko.toJS(root.displayingForm);
            var newItem = ko.toJS(root.editingForm);
            $.extend(item, newItem);
            item._id = item.id;
            item.type = "form";
            delete item.id;
            delete item.updatedName;
            delete item.createdName;

            item.formData = root.formBuilder.actions.getData();
            if (isUpdate) {
                return BPMS.Services.updateForm(item).then(
                    function () {
                        // var fields = vm.formData().filter(function (field) {
                        //     return field.dataset;
                        // }).map(function (field) {
                        //     return {
                        //         _id: field.name, //.split("$$")[0].replace(/^_+|_+$/g, '')
                        //         dataset: field.dataset,
                        //         listen: field.listen,
                        //         source: field.source,
                        //         target: field.target
                        //     }
                        // });

                        // BPMS.Services.addRule(fields);

                        root.loading(false);
                        root.updateEditing();

                        root.triggerDelay({
                            "type": "success",
                            "title": "保存表单成功",
                            "description": "已成功保存该表单。",
                            callback: function () {
                                root.refresh();
                            }
                        });

                    }, function () {
                        root.loading(false);

                        root.triggerDelay({
                            "type": "error",
                            "title": "保存表单失败",
                            "description": "保存表单失败, 请重试。"
                        });
                    }
                );
            }
            else {
                BPMS.Services.addUniqueForm(item).then(
                    function (res) {
                        root.loading(false);
                        root.updateEditing();
                        root.refresh();
                        root.triggerDelay({
                            "type": "success",
                            "title": "创建表单成功",
                            "description": "已成功创建该表单, 可使用预览功能查看效果。",
                            callback: function () {
                                root.refresh();
                            }
                        });
                    }, function (res) {
                        root.loading(false);
                        if (res && res.errorType &&
                            res.errorType === "FileAlreadyExist") {
                            $("#formName").parent().addClass("ui-invalid");
                            root.loading(false);
                            return;
                        }
                        root.triggerDelay({
                            "type": "error",
                            "title": "创建表单失败",
                            "description": "创建表单失败, 请重试。"
                        });
                    }
                );
            }
        };

        // root.exportItem = function () {
        //     var content = BPMS.Services.Utils.buildXML(root.detail.formProperties);
        //     BPMS.Services.Utils.download(content, root.detail.name().trim() + ".xml");
        // };
        root.deleteForm = function () {
            if ($.mobile.popup && $.mobile.popup.active) {
                root.triggerDelay("Delete");
                //$.mobile.popup.active.close();
            }
            root.delayPop("Delete");
        };

        root.doDeleteForm = function () {
            var id = root.displayingForm.id();
            if (!id) {
                return;
            }
            root.loading(true);

            BPMS.Services.deleteForm(id).then(function () {
                root.loading(false);

                root.triggerDelay({
                    "type": "success",
                    "title": "删除表单成功",
                    "description": "已成功删除该表单。",
                    callback: function () {
                        root.refresh();
                        if (root.displayingForm.id() === id) {
                            root.resetForm();
                        }
                    }
                });
            }, function () {
                root.loading(false);
                root.triggerDelay({
                    "type": "error",
                    "title": "删除表单失败",
                    "description": "删除表单失败，请重试。"
                });
            });
        };
        root.resetForm = function () {
            ["id", "accessibility", "createdAt", "createdBy",
                "name", "remark", "updatedAt", "updatedBy"].forEach(function (p) {
                    root.displayingForm[p]("");
                });
            root.formBuilder.actions.setData(JSON.stringify([]));
        };
        root.copyItem = function () {
            var data = root.formBuilder.actions.getData();
            root.resetForm();
            root.formBuilder.actions.setData(JSON.stringify(data));

        }
        root.getFormData = function () {
            root.loading(true);
            root.form.items.removeAll();
            var size = root.pageSize;
            var page = root.form.pageIndex();
            var ids = [];
            var items = [];
            var failCallback = function () {
                root.pop("error", {
                    "title": "获取Form列表失败",
                    "description": "由于网络原因，无法成功获取数据，请稍后重试。"
                });
                root.loading(false);
            };
            var filter = { type: "form" };
            if (root.criteria.id()) {
                filter._id = {
                    "$regex": ".*" + root.criteria.id() + ".*"
                }
            }
            if (root.criteria.name()) {
                filter.name = {
                    "$regex": ".*" + root.criteria.name() + ".*"
                }
            }
            if (root.criteria.remark()) {
                filter.remark = {
                    "$regex": ".*" + root.criteria.remark() + ".*"
                }
            }
            baseRequest = BPMS.Services.getForms({
                pagesize: size,
                page: page,
                filter: filter
            }).then(function (result) {
                items = result._embedded;
                items.forEach(function (item) {
                    item.id = item._id;
                    delete item._id;
                    item.createdBy = item.createdBy || "";
                    item.createdAt = item.createdAt || "";
                    item.createdName = "";
                    item.updatedBy = item.updatedBy || "";
                    item.updatedAt = item.updatedAt || "";
                    item.updatedName = "";
                    if (item.createdBy && ids.indexOf(item.createdBy) < 0) {
                        ids.push(item.createdBy);
                    }
                    if (item.updatedBy && ids.indexOf(item.updatedBy) < 0) {
                        ids.push(item.updatedBy);
                    }
                });
                return BPMS.Services.getUsers(ids);
            }, failCallback).then(function () {
                root.loading(false);
                Array.prototype.forEach.call(arguments, function (tempUser) {
                    if (!tempUser || (!tempUser.length && !tempUser.id) || tempUser.readyState) {
                        return;
                    }
                    var singleUser = tempUser[0] || tempUser;
                    items.forEach(
                        function (item) {

                            var fullName = (singleUser.firstName + " " + singleUser.lastName).trim();
                            if (item && item.createdBy && item.createdBy === singleUser.id) {
                                item.createdName = fullName;
                            }
                            if (item && item.updatedBy && item.updatedBy === singleUser.id) {
                                item.updatedName = fullName;
                            }
                        }
                    );

                });
                var pageCount = Math.floor((root.formCount() - 1) / size) + 1;
                root.form.pageCount(pageCount);
                root.form.items(items);
            }, failCallback);
            return baseRequest;
        };
        root.nextToProcess = function () {
            root.formData(vm.formBuilder.actions.getData())
            var diagramUrl = 'libs/bpmn-js/assets/activiti.bpmn';
            $.get(diagramUrl, root.initBpmn.bind(root), 'text');

        };
        root.nextToDeploy = function () {

        };

        root.selectFormItem = function (data) {
            //root.formData([]);
            ["id", "accessibility", "createdAt", "createdBy",
                "name", "remark", "updatedAt", "updatedBy"].forEach(function (p) {
                    var value = data[p] || "";
                    root.displayingForm[p](value);
                });
            root.formData(data.formData || []);
            root.formBuilder.actions.setData(JSON.stringify(root.formData()));


        };
        root.selectDeployItem = function (data) {

            root.loading(true);

            for (var i in data) {
                root.deployDetail[i](data[i]);
            }
            var mapResource = function (source, target) {
                var data = source || {
                    "id": "",
                    "url": "",
                    "dataUrl": "",
                    "mediaType": "",
                    "type": ""
                };
                for (var i in data) {
                    target[i](data[i]);
                }
            };
            BPMS.Services.getDeployment(data.id).then(
                function (result) {
                    var xml = (result || []).filter(function (resource) {
                        return resource.type === "processDefinition";
                    })[0];
                    var image = (result || []).filter(function (resource) {
                        return resource.type === "resource";
                    })[0];
                    mapResource(xml, root.deployDetail.xml);
                    mapResource(image, root.deployDetail.image);
                    root.loading(false);

                }
            );
            //repository/deployments/{deploymentId}/resources
        };



        root.cancel = function () {
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
        };
        this.exportDiagram = function (model, $event) {
            bpmnModeler.saveXML({ format: true }, function (err, xml) {
                //setEncoded($("#downloadLink"), 'diagram.bpmn', err ? null : xml);
                var pom = document.createElement('a');

                var name = moment().format("x") + ".bpmn20.xml"; //"diagram.bpmn";
                var pom = document.createElement('a');
                var bb = new Blob([xml], { type: 'text/xml' });

                pom.setAttribute('href', window.URL.createObjectURL(bb));
                pom.setAttribute('download', name);

                pom.dataset.downloadurl = ['text/xml', pom.download, pom.href].join(':');
                pom.draggable = true;
                pom.classList.add('dragout');

                pom.click();
            });
        };
        function ElementTemplates() {

            this._templates = {};

            /**
             * Sets the known element templates.
             *
             * @param {Array<TemplateDescriptor>} descriptors
             *
             * @return {ElementTemplates}
             */
            this.set = function (descriptors) {

                var templates = this._templates = {};

                descriptors.forEach(function (descriptor) {
                    templates[descriptor.id] = descriptor;
                });

                return this;
            };

            /**
             * Get template descriptor with given id.
             *
             * @param {String} id
             *
             * @return {TemplateDescriptor}
             */
            this.get = function (id) {
                return this._templates[id];
            };

            /**
             * Return all known template descriptors.
             *
             * @return {Array<TemplateDescriptor>}
             */
            this.getAll = function () {
                return values(this._templates);
            };

        };
        this.deployProcess = function () {
            this.deployName("");
            this.delayPop("SaveProcess");

            // root.triggerDelay({
            //     "type": "error",
            //     "title": "保存表单失败",
            //     "description": "保存表单失败, 请重试。"
            // });

        };
        this.doDeployProcess = function () {
            var name = (root.deployName() || "").trim();
            if (!name) {
                return;
            }
            bpmnModeler.saveXML({ format: true }, function (err, xml) {
                var blob = new Blob([xml], { type: 'text/xml' });
                var file = new File([xml], name + ".bpmn20.xml", { type: 'text/xml' });

                var formData = new FormData();
                formData.append(file.name, file);
                //formData.append("tenantId", root.user.userId);

                token = sessionStorage.getItem("bpms_token");
                var ajaxFormOption = {
                    type: "post",
                    formData: formData,
                    headers: {
                        Authorization: token
                    },
                    url: BPMS.config.serviceUrl + "repository/deployments",
                    success: root.afterDeploy
                };
                $("#upload").ajaxSubmit(ajaxFormOption);

            });
        };

        this.afterDeploy = function (deployment) {
            var processDefinition = root.bpmnModeler.getDefinitions().rootElements[0];
            var fields = BPMS.Services.Utils.formatFormData(root.formData()).filter(function (field) {
                return field.variable
            }).map(function (field) {
                return {
                    id: field.variable,
                    name: field.name,
                };
            });
            var metadata = {
                collection: processDefinition.id,
                fields: fields,
                name: processDefinition.name || "",
                tenantId: ""
            };
            var callback = function () {
                root.tab("deploy");
            };
           

            root.triggerDelay({
                type: "success",
                title: "流程部署成功。",
                description: "",
                callback: callback
            });

        }

        this.getDeployData = function () {
            root.deploy.items([]);
            var start = (root.deploy.pageIndex() - 1) * root.pageSize;
            var option = {
                size: root.pageSize, start: start,
                sort: "deployTime",
                order: "desc"
                //tenantId: root.user.userId
            };
            root.loading(true);

            BPMS.Services.getDeployments(option).then(
                function (result) {
                    root.deploy.items(result.data);

                    root.deployCount(result.total);

                    var pageCount = Math.floor((root.deployCount() - 1) / root.pageSize) + 1;
                    root.deploy.pageCount(pageCount);
                    if (root.deploy.items().length > 0 && !root.deployDetail.id()) {
                        root.selectDeployItem(root.deploy.items()[0]);
                    } else {
                        root.loading(false);
                    }



                }
            );
        };
        this.deleteDeploy = function () {
            var detail = root.deployDetail;
            var settings = {
                title: detail.id() + ": " + detail.name(),
                code: "",
                description: "确认删除" + "\"" + detail.id() + " " + detail.name() + "\"?",
                callback: root.doDeleteDeploy
            };
            root.delayPop("confirm", settings);
        };
        this.doDeleteDeploy = function () {
            var detail = root.deployDetail;
            var id = detail.id();
            var desc = detail.id() + " " + detail.name();
            root.resetDeployDetail(detail);

            BPMS.Services.deleteDeployment(id).then(function () {
                root.triggerDelay({
                    type: "success",
                    title: "删除部署成功",
                    description: "部署\"" + desc + "\"删除成功。",
                    callback: root.getDeployData
                });
            });


        };

        this.initBpmn = function (xml) {
            var root = this;
            root.templateForm=null;
            // var propertiesPanelModule = require('bpmn-js-properties-panel'),
            //   propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda'),
            //   camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda');
            if (this.bpmnModeler) {
                this.bpmnModeler.detach();
            }
            bpmnModeler = new BpmnJS({
                container: '.canvas',
                keyboard: {
                    bindTo: window
                },
                // propertiesPanel: {
                //   parent: '#js-properties-panel'
                // },
                // additionalModules: [
                //   PropertiesPanel,
                //   propertiesProvider
                // ]
            });

            var elementTemplates = new ElementTemplates();

            var propertiesProvider = new PropertiesProvider(window.eventBus, window.bpmnFactory,
                window.elementRegistry, elementTemplates, window.translate);
            var propertiesPanel = new PropertiesPanel(
                {
                    parent: '#js-properties-panel'
                }, window.eventBus, window.modeling, propertiesProvider, null, window.canvas
            );
            vm.propertiesPanel = propertiesPanel;
            this.bpmnModeler = bpmnModeler;


            bpmnModeler.importXML(xml, function () {
                root.tab("process");
            });


        }

        root.initFormBuilder = function (dataset) {
            if (root.formBuilder) {
                return;
            }
            var replaceFields = [
                {
                    type: 'header',
                    subtype: 'h3',
                    label: '表头'

                },
                {
                    type: 'join',
                    subtype: 'h5',
                    label: '表关联',
                    icon: '🔀'

                },
                {
                    type: 'split',
                    subtype: 'h3',
                    label: '分块',
                    icon: '↪'
                },
                {
                    type: 'remotecomplete',
                    subtype: 'psbi',
                    label: '查找',
                    icon: '🔍'
                },
                {
                    type: 'auto',
                    subtype: 'auto',
                    label: '自动完成',
                    icon: '✔️'
                },

                {
                    type: 'checkbox-group',
                    subtype: 'vertical',
                    label: '复选框',
                },
                {
                    type: 'radio-group',
                    subtype: 'vertical',
                    label: '单选框',
                },
                {
                    type: 'select',
                    subtype: 'single',
                    label: '下拉框',
                }
            ];

            var actionButtons = [];

            var typeUserDisabledAttrs = {
                autocomplete: ['access'],
                file: ['multiple'],
                'checkbox-group': ['toggle', 'inline'],
                'radio-group': ['inline'],
                remotecomplete: ['options'],
                number: ['step'],
                textarea: ['subtype', 'rows'],
                auto: ['subtype', 'options'],
                select: ['multiple']
            };
            var attrs = {
                variable: {
                    label: '变量'
                }
            };
            var typeUserAttrs = {
                text: attrs,
                file: attrs,
                'checkbox-group': attrs,
                'radio-group': attrs,
                remotecomplete: attrs,
                auto: attrs,
                number: attrs,
                textarea: attrs,
                select: attrs,
                date: attrs,
                flipswitch: attrs,
                header: attrs,
                join: attrs
            };

            // test disabledAttrs
            var disabledAttrs = ['access',
                'placeholder', 'max', 'maxlength', 'min', 'value', 'description', 'other',];//'className',

            var fbOptions = {
                subtypes: {
                    //text: ['datetime-local']
                },
                dataset: dataset,
                onSave: function (e, formData) {
                    toggleEdit();
                    $('.render-wrap').formRender({
                        formData: formData,
                        templates: {}
                    });
                    window.sessionStorage.setItem('formData', JSON.stringify(formData));
                },
                stickyControls: {
                    enable: false
                },
                sortableControls: true,
                fields: [],
                templates: [], // templates,
                inputSets: [], // inputSets,
                typeUserDisabledAttrs: typeUserDisabledAttrs,
                typeUserAttrs: typeUserAttrs,
                disableInjectedStyle: false,
                actionButtons: actionButtons,
                disableFields: ['button', 'hidden', 'paragraph', 'split', 'header', 'join', 'autocomplete', 'remotecomplete', 'auto', 'checkbox', 'checkbox-group', 'radio-group'], //['autocomplete'], , 'header'
                replaceFields: replaceFields,
                disabledActionButtons: ['save'],
                disabledFieldButtons: {
                    split: ['edit']
                },
                controlPosition: 'left',
                disabledAttrs: disabledAttrs,
                locale: 'zh-CN',
                controlOrder: [
                    'text',
                    'textarea',
                    'date',
                    'file',
                    'number',
                    'autocomplete',
                    'remotecomplete',
                    'auto',
                    'button',
                    'checkbox',
                    'checkbox-group',
                    'radio-group',
                    'select',
                    'flipswitch',
                    'header',
                    'join',
                    'hidden',
                    'paragraph',
                    'split'
                ],
            };
            var formData = window.sessionStorage.getItem('formData');
            var editing = true;

            if (formData) {
                fbOptions.formData = JSON.parse(formData);
            }

            function toggleEdit() {
                document.body.classList.toggle('form-rendered', editing);
                return editing = !editing;
            }

            var setFormData = '[{"type":"text","label":"Full Name","subtype":"text","className":"form-control","name":"text-1476748004559"},{"type":"select","label":"Occupation","className":"form-control","name":"select-1476748006618","values":[{"label":"Street Sweeper","value":"option-1","selected":true},{"label":"Moth Man","value":"option-2"},{"label":"Chemist","value":"option-3"}]},{"type":"textarea","label":"Short Bio","rows":"5","className":"form-control","name":"textarea-1476748007461"}]';


            var formBuilder = $('.build-wrap').formBuilder(fbOptions);
            root.formBuilder = formBuilder;
            var fbPromise = formBuilder.promise;

            fbPromise.then(function (fb) {
                var apiBtns = {
                    showData: fb.actions.showData,
                    clearFields: fb.actions.clearFields,
                    getData: function () {
                        //console.log(fb.actions.getData());
                    },
                    setData: function () {
                        fb.actions.setData(setFormData);
                    },
                    addField: function () {
                        var field = {
                            type: 'text',
                            class: 'form-control',
                            label: 'Text Field added at: ' + new Date().getTime()
                        };
                        fb.actions.addField(field);
                    },
                    removeField: function () {
                        fb.actions.removeField();
                    },
                    testSubmit: function () {
                        var formData = new FormData(document.forms[0]);
                        // console.log('Can submit: ', document.forms[0].checkValidity());
                        // Display the key/value pairs
                        // console.log('FormData:', formData);
                        for (var pair in formData.entries()) {
                            //   console.log(pair[0] + ': ' + pair[1]);
                        }
                    },
                    resetDemo: function () {
                        window.sessionStorage.removeItem('formData');
                        location.reload();
                    }
                };

                Object.keys(apiBtns).forEach(function (action) {
                    document.getElementById(action)
                        .addEventListener('click', function (e) {
                            apiBtns[action]();
                        });
                });
                //fb.actions.setLang('zh-CN');
                document.getElementById('setLanguage')
                    .addEventListener('change', function (e) {
                        fb.actions.setLang(e.target.value);
                    });

                document.getElementById('getXML').addEventListener('click', function () {
                    alert(formBuilder.actions.getData('xml'));
                });
                document.getElementById('getJSON').addEventListener('click', function () {
                    alert(formBuilder.actions.getData('json', true));
                });
                document.getElementById('getJS').addEventListener('click', function () {
                    alert('check console');
                    //  console.log(formBuilder.actions.getData());
                });
                document.getElementById('edit-form').onclick = function () {
                    toggleEdit();
                };
            });
        };


    };
    BPMS.ViewModels.ProcessBuilderViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, jQuery, ko);