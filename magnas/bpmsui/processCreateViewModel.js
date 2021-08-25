(function (BPMS, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.ProcessCreateViewModel = function () {
        this.switchTab = function (vm, e) {
            var a = $(e.target).closest("a");
            a.tab("show");
            e.preventDefault();
        };
        window.vm = this;
        var self = this;
        this.uploadUrl = BPMS.config.attachmentUrl + "upload";
        this.userId = this.user && this.user.userId;
        this.canAddAttachment = ko.observable(false);
        this.attachments = ko.observableArray();
        this.attachmentItem = ko.observable(null);
        this.instanceCount = ko.observable(0);
        this.exampleTable = ko.observable();
        this.tableIndex = ko.observable();
        this.subTable = {
            headers: ko.observableArray(),
            rows: ko.observableArray(),
            editable: true,
            editIndex: ko.observable(-1),
            uploadTableFlag: ko.observable(false),
            steps: ko.observableArray(),
            name: ko.observable("")
        };


        this.documents = ko.observableArray([]);
        this.pdfDocument = ko.observable();
        this.fields = ko.observableArray();
        this.saving = ko.observable(false);
        this.loaded = ko.observable(false);
        this.tables = ko.observableArray();
        this.startable = ko.observable(false);

        this.shouldShowBI = ko.observable(false);
        this.processCreateBIUrl = ko.observable();

        this.businessKeyDisabled = ko.observable(false);
        this.businessKey = ko.observable();

        //http://localhost:3000/pages/process/process_create.html?processDefinitionId=DPFN001:3:1125068

        self.mapDraft = function (draft) {
            self.type(draft.type);
            for (var i in self.fields()) {
                var fields = self.fields()[i];
                for (var j in fields) {
                    var field = fields[j];
                    field.value(draft.fields[i][j].value);
                }
            }
            for (var i in self.tables()) {
                var table = self.tables()[i];
                var draftTable = draft.tables[i];
                table.rows(draftTable.rows);
                for (var j in table.headers()) {
                    var header = table.headers()[j];
                    if (header.subTable) {
                        header.subTable.rows(draftTable.headers[j].subTable.rows);
                    }
                }
            }

            self.attachments(draft.attachments);
            self.businessKey(draft.businessKey);
            self.involvedUser.value(draft.involvedUser);
        };

        self.involvedUser = {
            id: "involvedUser",
            name: "受邀人",
            value: ko.observable(),
            controlType: "psbi",
            "readable": true,
            "writable": true,
            "required": false,
            "enumValues": [],
            "ignoreLabel": true,
            "seq": 1,
            "fieldType": "string",
            invalid: ko.observable(false),
            "liveValidate": true,
            "placeholder": "受邀人搜索..."
        };
        this.selectFile = function () {
            var value = $("#fileUploaded").val();
            this.canAddAttachment(!!value);
        };

        this.category = ko.observable("");
        this.addAttachment = function () {
            if (!this.canAddAttachment()) {
                return false;
            }
            self.loading(true);
            $("#upload").ajaxSubmit({
                "success": function (data) {
                    self.loading(false);
                    self.attachments.push(data);
                    self.canAddAttachment(false);
                    $("#fileUploaded").val("");
                },
                "error": function (err) {
                    var code = "";
                    if (err && err.status && err.statusText) {
                        code = "错误代码：" + err.status + " " + err.statusText;
                    }
                    self.pop("error", {
                        "title": "上传附件失败",
                        "description": "",
                        "detail": "该请求无法成功处理，请稍后重试。",
                        "code": code
                    });
                    self.loading(false);
                }
            });
        };
        this.removeAttachment = function (data) {
            self.attachments.remove(data);
        };


        // this.name = processDefinition.name;
        // this.id() = processDefinition.id;
        // this.description = processDefinition.description;
        self.imageUrl = ko.observable("");
        self.id = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId") || "");
        self.draftId = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "draftId") || "");
        self.type = ko.observable();
        this.name = ko.observable("");
        this.description = ko.observable("");
        this.getName = function (id, name) {
            return id.split(":")[0] + ": " + (name || "").trim();
        };
        self.viewImage = function () {
            self.loading(true);
            return BPMS.Services.getDeployment(self.processDefinition.deploymentId)
                .then(function (res) {
                    var item = res.filter(function (i) {
                        return (i && i.type && i.type === "resource");
                    })[0];
                    return BPMS.Services.Utils.getImage(item.contentUrl);

                }).then(function (res2) {
                    var imageData = BPMS.Services.Utils.rebuildImage(res2);
                    self.loading(false);
                    self.pop("image", {
                        "src": imageData
                    });

                });
        };

        this.init = function () {
            this.wxConfig();
            this.loaded(false);
            this.saving(false);
            this.canAddAttachment(false);
            this.attachments([]);
            this.attachmentItem(null);
            this.fields([]);
            this.tables([]);
            this.businessKey("");
            this.businessKeyDisabled(false);

            this.involvedUser.value(null);

            this.imageUrl("");
            this.name("");
            this.description("");
            this.documents.removeAll();
            this.pdfDocument("");
            this.startable(false);
            this.instanceCount(0);
            self.formKey = "";
            if (typeof (Formio) !== "undefined") {
                Formio.createForm(document.getElementById('formData'), {
                    components: []
                }).then(function (form) {
                    self.currentForm = form;
                });
            }
            var loadAdvanced = location.href.match(/^.+\/(\w+\.\w+)/i)[1].toLowerCase() === "process.html";
            if (!this.id()) {
                window.location.href = "process_list.html";
            }
            this.loading(true);
            var roles = this.user.Roles.split(",");
            var businessKeyTemplate = "";
            var popValue = function (obj, arr) {
                while (arr.length) {
                    obj = obj[arr.shift()];
                }
                return obj;
            }
            var baseRequest = BPMS.Services.Utils.request("repository/process-definitions/" + self.id() + "/identitylinks").then(function (identities) {
                if ($.isArray(identities)) {
                    identities.forEach(function (identity) {
                        var userRight = identity.type === "candidate" &&
                            identity.user &&
                            identity.user == self.user.userId;

                        var groupRight = identity.type === "candidate" &&
                            identity.group &&
                            roles.indexOf(identity.group) >= 0;
                        if (userRight || groupRight) {
                            self.startable(true);
                        }
                    });
                }

                return BPMS.Services.getProcessDefinition(self.id());
            }).then(
                function (data) {
                    self.loaded(true);
                    self.processDefinition = data;
                    self.name(data.name);
                    self.category(data.category);
                    //data.description = '{ "description": "流程说明",  "documents": [{ "name": "文档1.pdf", "path": "https://bpmswx.eorionsolution.com/bpms-upload/download/100000/RY_IT002d-1-292540/20180523082508/GM001RY.bpmn20.xml", "size": "93729 bytes" },  { "name": "文档2.pdf", "path": "https://bpmswx.eorionsolution.com/bpms-upload/download/100000/RY_IT002d-1-292540/20180523082508/GM001RY.bpmn20.xml", "size": "93729 bytes" }] }';
                    self.documents([]);
                    self.pdfDocument("");

                    try {
                        var value = JSON.parse(data.description);
                        if (typeof (value) === "object") {
                            console.log(value);
                            self.description(value.description);
                            self.documents(value.documents || []);
                            businessKeyTemplate = value.businessKey;
                            var pdf = (value.documents || []).filter(function (doc) {
                                return doc.name.toUpperCase() === "BPMFLOWCHART" && doc.size.toUpperCase() === "PDF";
                            })[0];
                            if (pdf) {
                                var url = location.href.substring(0, location.href.lastIndexOf("/") + 1) + "libs/pdfjs/viewer.html?" + $.param({
                                    file: pdf.path
                                });
                                self.pdfDocument(url);
                            }
                        }
                    }
                    catch (err) {
                        self.description(data.description);
                    }


                    return BPMS.Services.getFormData({
                        "processDefinitionId": data.id
                    });
                }, function () {
                    self.loading(false);
                    self.pop("error", {
                        "title": "获取流程信息失败",
                        "description": "由于网络原因，无法成功获取数据，请稍后重试。"
                    });
                }
            ).then(function (data) {
                //data.formKey = "1597031027590";
                self.formKey = data.formKey;
                if (data.formKey) {
                    $.get(BPMS.config.collectionUrl.trim() + data.formKey).then(function (response) {
                        if (typeof (Formio) !== "undefined") {
                            Formio.createForm(document.getElementById('formData'), {
                                components: response.formData
                            }).then(function (form) {
                                self.currentForm = form;
                                $(self.currentForm.getContainer()).show();
                            });
                        }

                    });

                }

                var datas = BPMS.Services.Utils.analyseFormData(data.formProperties, true, self);
                //self.businessKey(data.businessKey);
                self.businessKey(BPMS.Services.Utils.getUrlParam(window.location.href, "businessKey") || "");
                self.businessKeyDisabled(!!BPMS.Services.Utils.getUrlParam(window.location.href, "businessKeyDisabled"));

                if (businessKeyTemplate) {
                    var businessKey = businessKeyTemplate.replace(/\${([0-9a-zA-Z\.\-]*)}/gi, function (arguments) {
                        var express = arguments.replace(/[\${}]/ig, "");
                        var value = "";
                        if (express.indexOf("user") >= 0) {
                            value = popValue(self, express.split("."));
                        } else {
                            value = moment().format(express);
                        }
                        return value;
                    });
                    self.businessKey(businessKey);
                }

                self.fields.removeAll();
                self.fields(datas.fields);
                self.tables.removeAll();
                self.tables(datas.tables.filter(function (table) {
                    return table.tableName.indexOf("-") < 0;
                }));
                if (self.tables().length && self.tables()[0].steps().length) {
                    var tbFields = data.formProperties.filter(function (f) {
                        return f.id.indexOf("tb") == 0;
                    }).map(function (prop) {
                        return {
                            block: prop.block,
                            controlType: prop.controlType,
                            datePattern: prop.datePattern,
                            enumValues: prop.enumValues,
                            fieldType: prop.fieldType,
                            id: prop.id,
                            invalid: prop.invalid,
                            name: prop.name,
                            readable: prop.readable,
                            required: prop.required,
                            seq: prop.seq,
                            type: prop.type,
                            value: prop.value,
                            writable: prop.writable
                        };
                    });
                    var props = BPMS.Services.Utils.analyseFormData(JSON.parse(JSON.stringify(tbFields)));
                    self.exampleTable(props.tables[0]);
                };
                BPMS.Services.Utils.switchLanguage();
                if (datas.attachments[0]) {
                    self.attachmentItem(datas.attachments[0]);
                }
                if (!self.startable() && !loadAdvanced) {
                    self.pop("error", {
                        "title": "权限不足",
                        "description": "您没有权限启动该流程。",
                        "callback": function () {
                            window.location.href = "process_list.html";
                            return false;
                        }
                    });
                }
            });
            if (self.draftId()) {
                baseRequest = baseRequest.then(function () {
                    return BPMS.Services.getDocument(self.draftId());
                }).then(function (draft) {
                    self.mapDraft(draft);
                });
            }

//启动流程时初始化表格明细
if(BPMS.config.tableInitialDataSource.hasOwnProperty( (BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId") || "").split(":")[0] )) {
	var procDefId = (BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId") || "").split(":")[0];
	for (var i in BPMS.config.tableInitialDataSource[procDefId]) {
		console.log(i)
		baseRequest = baseRequest.then(function () {
			//return BPMS.Services.Utils.request(BPMS.config.tableInitialDataSource[procDefId][i])
			return BPMS.Services.getAuto(BPMS.config.tableInitialDataSource[procDefId][i], "null", self.user.userId)
		}).then(function (data) {	
			for (var x in self.tables()) {
				if(self.tables()[x].tableName == i) {
					var table = self.tables()[x];
					table.rows(jQuery.parseJSON(data[0].rows));
				}
			}
		});
	}
}


            //启动流程时初始化报表
            // self.processCreateBIUrl("");
            // function base64url(source) {
            //     // Encode in classical base64
            //     encodedSource = CryptoJS.enc.Base64.stringify(source);

            //     // Remove padding equal characters
            //     encodedSource = encodedSource.replace(/=+$/, '');

            //     // Replace characters according to base64url specifications
            //     encodedSource = encodedSource.replace(/\+/g, '-');
            //     encodedSource = encodedSource.replace(/\//g, '_');

            //     return encodedSource;
            // }

            // var header = {
            //     "alg": "HS256",
            //     "typ": "JWT"
            // };
            // var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
            // var encodedHeader = base64url(stringifiedHeader);
            // var METABASE_SITE_URL = BPMS.config.metabaseSite;
            // var secret = BPMS.config.metabaseKey;

            // if (BPMS.config.createProcessBiQuestionId.hasOwnProperty((BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId") || "").split(":")[0])) {
            //     self.shouldShowBI(true)

            //     var procDefId = (BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId") || "").split(":")[0];
            //     var questionId = BPMS.config.createProcessBiQuestionId[procDefId];
            //     var processCreateBIBody = { resource: { question: questionId }, params: { "userId": BPMS.Services.Utils.getUser().userId } };
            //     var processCreateBIEncodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(processCreateBIBody)));
            //     var processCreateBIJwt = encodedHeader + "." + processCreateBIEncodedData + "." + base64url(CryptoJS.HmacSHA256((encodedHeader + "." + processCreateBIEncodedData), secret))
            //     var processCreateBIIframeUrl = METABASE_SITE_URL + "embed/question/" + processCreateBIJwt + "#bordered=true&titled=true";
            //     self.processCreateBIUrl(processCreateBIIframeUrl);
            // }







            if (!loadAdvanced) {
                self.loading(false);

                return baseRequest;
            }
            return baseRequest.then(function () {
                var param = {
                    "start": 0,
                    "size": 1,
                    "order": "desc",
                    "sort": "startTime",
                    "startedBy": self.user.userId,
                    "finished": false,
                    "processDefinitionId": self.id()
                };
                return BPMS.Services.getHistoricProcessInstances(param);
            }).then(function (result) {
                self.instanceCount(result.total);
                return BPMS.Services.getDeployment(self.processDefinition.deploymentId);
            }).then(function (res) {
                var item = res.filter(function (i) {
                    return (i && i.type && i.type === "resource");
                })[0];
                return BPMS.Services.Utils.getImage(item.contentUrl);
            }).then(function (res3) {
                var imageData = BPMS.Services.Utils.rebuildImage(res3);
                self.loading(false);
                self.imageUrl(imageData);

            });
        };
        self.save = function (type) {
            var root = this;
            root.loading(true);
            var isNew = type;
            var operationDesc = isNew ? "创建" : "保存";
            type = type || root.type();
            var typeDescription = type === "InstanceTemplate" ? "模板" : "草稿";
            var key = isNew ? BPMS.Services.Utils.getCurrentTimeStamp().toString() : root.draftId();
            var data = ko.toJS({
                processDefinitionId: root.id(),
                type: type,
                userId: root.user.userId,
                _id: key,
                fields: root.fields(),
                attachments: root.attachments(),
                tables: root.tables(),
                businessKey: root.businessKey(),
                involvedUser: root.involvedUser.value() || ""
            });
            data.tables.forEach(function (draftTable) {
                draftTable.headers.forEach(function (draftHeader) {
                    if (draftHeader.subTable) {
                        delete draftHeader.subTable.parentTable;
                        delete draftHeader.subTable.parentField;
                    }
                });
            });
            //console.log(data);
            BPMS.Services.addDocument(data).then(function () {
                root.loading(false);
                if (!root.type()) {
                    root.type(type);
                }
                root.draftId(key);
                root.triggerDelay({
                    "type": "success",
                    "title": operationDesc + typeDescription + "成功",
                    "description": (isNew ? "已成功创建" : "已成功保存该") + typeDescription + ", 请到流程实例页面查看。"
                });
            }, function () {
                self.loading(false);
                root.triggerDelay({
                    "type": "error",
                    "title": operationDesc + typeDescription + "失败",
                    "description": operationDesc + typeDescription + "失败, 请重试。"
                });
            });
        };
        self.checkNext = function () {
            var tempFields = Array.prototype.concat.apply([], self.fields());
            if (!BPMS.Services.Utils.validateFields(tempFields, true)) {
                for (var i in tempFields) {
                    var field = tempFields[i];
                    if (field.invalid()) {
                        var id = field.id.replace(/\$\$/g, "").replace(/ /g, "");;
                        var ele = $("[name='" + id + "']");
                        var container = ele.closest("form[data-bind]");
                        if (!container.length) {
                            container = ele.closest("div[data-bind]");
                        }
                        if (container.length) {
                            container[0].scrollIntoView();
                        }
                        break;
                    }
                }
            }
        };
		var promise = null;
        self.submit = function () {
            if (self.saving()) {
                return;
            }


            var tempFields = Array.prototype.concat.apply([], self.fields());
            var businessKey = self.businessKey();

            if (!businessKey) {
                $("#businessKey").parent().addClass("ui-invalid");
            }
            else {
                $("#businessKey").parent().removeClass("ui-invalid");
            }

            if (!businessKey) {
                self.pop("error", {
                    "title": "输入错误",
                    "description": "您的输入有误，请重新输入。",
                    "callback": function () {
                        $("#home-tab").click();
                    }
                });
                return;
            }
            
            if (self.formKey) {
                promise = self.currentForm.submit();
            } else {
                var dfd = $.Deferred();
                dfd.resolve();
                promise = dfd.promise();
                if (!BPMS.Services.Utils.validateFields(tempFields)) {
                    self.pop("error", {
                        "title": "输入错误",
                        "description": "您的输入有误，请重新输入。",
                        "callback": function () {
                            $("#home-tab").click();
                        }
                    });
                    return;
                }

                if (self.tables && self.tables() && self.tables().length) {
                    for (var i in self.tables()) {
                        var tempTable = self.tables()[i];
                        if (tempTable.item &&
                            ko.unwrap(tempTable.item.required) &&
                            tempTable.rows().length == 0) {
                            self.pop("error", {
                                "title": "输入错误",
                                "description": "您的输入有误，请输入表格内容。",
                                "callback": function () {
                                    $("#profile-tab").click();
                                }
                            });
                            return;
                        }
                    }
                }

                if (self.attachmentItem() && ko.unwrap(self.attachmentItem().required)) {
                    if (self.attachments().length === 0) {
                        self.pop("error", {
                            "title": "输入错误",
                            "description": "您的输入有误，请输入附件。",
                            "callback": function () {
                                $("#attachment-tab").click();
                            }
                        });
                        return;
                    }
                }
			


            }
			var obj = {
                "title": "是否确认提交",
                "callback": self.doConfirm
            };

            self.pop("confirmTask", obj);
		};


		self.doConfirm = function () {
            var data = {
                "processDefinitionId": self.id(),
                "properties": [],
                businessKey: self.businessKey(),
                // involvedUser: self.involvedUser.value()
            };
            var tempFields = Array.prototype.concat.apply([], self.fields());
            if (!self.formKey) {
                ko.utils.arrayForEach(tempFields, function (item) {
                    var value = item.value();
                    if (item.controlType === "tree"
                        || item.controlType === "relation"
                        || item.controlType === "auto" && value) {
                        value = JSON.stringify(value);
                    }
                    var tempData = {
                        "id": item.id,
                        "value": value
                    };

                    data.properties.push(tempData);
                });



                self.tables().forEach(function (table) {



                    table.headers().forEach(
                        function (headItem) {
                            var value = headItem.id;
                            if (headItem.type === "enum") {
                                value = headItem.enumValues[0].id;
                            }
                            data.properties.push({
                                "id": headItem.id,
                                "value": value
                            });
                        }
                    );

                    var rows = table.rows();
                    var headers = table.headers().map(
                        function (header) {
                            return {
                                block: header.block,
                                controlType: header.controlType,
                                datePattern: header.datePattern,
                                enumValues: header.enumValues,
                                fieldType: header.fieldType,
                                id: header.id,
                                name: header.name,
                                readable: header.readable,
                                seq: header.seq,
                                type: header.type,
                                writable: header.writable
                            }
                        }
                    );

                    var tableValue = JSON.stringify({
                        rows: rows,
                        headers: headers,
                        tableName: table.tableName,
                        name: table.item.name || ""
                    });


                    var tableItem = {
                        "id": table.item.id,
                        "value": tableValue
                    };

                    var standardArray = [];
                    for (var i in rows) {
                        var obj = {};
                        var row = rows[i];
                        for (var j in row) {
                            var key = headers[j].id.split("_")[2];
                            //key = key + "_" + (parseInt(i, 10) + 1).toString()
                            //    + (parseInt(j, 10) + 1).toString();
                            var value = row[j];
                            obj[key] = value;
                        }
                        standardArray.push(obj);
                    }
                    data.properties.push(tableItem);
                    var tableItemStandard = {
                        "id": table.item.id + "_std",
                        "value": JSON.stringify(standardArray)
                    };
                    data.properties.push(tableItemStandard);
                });


                if (self.attachmentItem()) {
                    var attachmentValue = JSON.stringify(self.attachments());
                    data.properties.push({
                        "id": self.attachmentItem().id,
                        "value": attachmentValue
                    });
                }

                data.properties.forEach(
                    function (p) {
                        //console.log(p.type);
                    }
                );
            }


            promise.then(function () {
                self.saving(true);
                self.loading(true);
                //return BPMS.Services.postFormData(data);
				var involvedUserId = self.involvedUser.value();
                 if (self.formKey) {
                     var variables = BPMS.Services.Utils.buildVariables(self.formKey, self.currentForm);
                     if (involvedUserId) {
                         variables.push({
                             name: "involved_user",
                             type: "string",
                             value: involvedUserId
                         });
                     }
                     return BPMS.Services.postProcessInstance(
                         {
                             processDefinitionId: self.id(),
                             businessKey: self.businessKey(),
                             variables: variables
                         });
                 } else {
                     return BPMS.Services.postFormData(data);
                 }
            }, function () {
                self.pop("error", {
                    "title": "输入错误",
                    "description": "您的输入有误，请重新输入。",
                    "callback": function () {
                        $("#home-tab").click();
                    }
                });
            }).then(function (result) {
                if (!result) {
                    return;
                }
                var popOptions = {
                    "code": result.id,
                    "title": "流程实例创建成功",
                    "description": "流程实例" + result.id + " " + self.name() + "创建成功",
                };
                if (self.type() === "InstanceDraft") {
                    BPMS.Services.deleteDocument(self.draftId());
                }
                var involvedUserId = self.involvedUser.value();
                //if (self.formKey) {
                //    var variables = BPMS.Services.Utils.buildVariables(self.formKey, self.currentForm);
                //    if (involvedUserId) {
                //        variables.push({
                //            name: "involved_user",
                //            type: "string",
                //            value: involvedUserId
                //        });
                //    }
                //    BPMS.Services.putProcessInstanceVariables(result.id, variables).then(function () {
                //        self.showSuccess(popOptions);
                //    });
                //    return;
                //}

                 if (involvedUserId && self.formKey) {
                    //BPMS.Services.addInvolvedUser(result.id, involvedUserId)
                    BPMS.Services.putProcessInstanceVariables(result.id, [{
                        name: "involved_user",
                        type: "string",
                        value: involvedUserId
                    }]).then(function () {
                        popOptions.description += "，受邀人添加成功。";
                        self.showSuccess(popOptions);
                    }, function () {
                        popOptions.description += "，受邀人添加失败。";
                        self.showSuccess(popOptions);
                    });
                } else {
                    self.showSuccess(popOptions);
                }
            }, self.showError);
        };

        this.showSuccess = function (option) {

            this.popCode(option.code);
            this.popTitle(option.title);
            this.popDescription(option.description);
            this.saving(false);
            $("#popSuccess").popup("open");
            this.loading(false);
        };
        this.showError = function (err) {
            self.saving(false);
            var detailMessage = (err && err.responseJSON && err.responseJSON.exception) || "该请求无法成功处理，请稍后重试";
            self.pop("error", {
                "title": "流程实例创建失败",
                "description": self.name(),
				"detail": "错误信息：" + detailMessage.replace("problem evaluating script: javax.script.ScriptException: org.activiti.engine.ActivitiIllegalArgumentException:",""),
                "code": "错误代码：" + err.status + " " + err.statusText
            });
            self.loading(false);
        };
        // this.closeSuccess = function (related) {
        //     var url = related ? "task_list.html?" + $.param({

        //     }) : "process_list.html";
        //     window.location.href = url;
        //     return false;
        // };

        this.reset = function () {
            $("#businessKey").parent().removeClass("ui-invalid");
            $("#involvedUser").val("");
            $("#involvedUser,#businessKey").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden").click();

            this.canAddAttachment(false);
            this.attachments([]);
            this.init();
            scrollTo(0, 0);
            $("#home-tab").click();
        };

        this.getStep = function (index) {
            return this.tables()[this.tableIndex()].getStep(index);
        };

    };
    BPMS.ViewModels.ProcessCreateViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, ko);
