(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.InstanceDetailViewModel = function () {

        var that = this;
        window.vm = that;
        this.fields = ko.observableArray();
        this.tables = ko.observableArray();
        this.historicDetails = [];
        this.attachments = ko.observableArray();
        this.getAction = function ($data, $index) {
            return BPMS.Services.Utils.getAction($data, $index, that.historicDetails);
        };
        this.commentInfo = {
            message: ko.observable(""),
            to: ko.observable(),
            comments: ko.observableArray(),
            originalId: ko.observable("")
        };
        this.loaded = ko.observable(false);
        this.flows = ko.observableArray();
        this.subInstances = ko.observableArray();
        this.queryInfo = null;
        this.exampleTable = ko.observable();
        this.id = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId") || "");
        this.businessKey = ko.observable("");
        this.processDefinitionId = ko.observable("");
        this.processDefinitionUrl = ko.observable("");
        this.startTime = ko.observable(null);
        this.endTime = ko.observable(null);
        this.startUserId = ko.observable("");
        this.deleteReason = ko.observable("");
        this.variables = ko.observableArray([]);
        this.type = ko.observable();
        this.name = ko.observable(null);
        this.category = ko.observable("");
        this.involvedUser = ko.observable("");
        this.superProcessInstanceId = ko.observable("");
        this.processName = ko.observable("");
        this.processDescription = ko.observable("");
        this.printable = ko.observable();
        this.hasNext = ko.observable(false);
        this.hasPrev = ko.observable(false);
        this.canDelete = ko.observable(false);
        this.processInvalid = ko.observable(false);
        this.typeDesc = ko.computed(function () {
            var type = this.type();
            if (type === "InstanceDraft") {
                return "??????";
            } else if (type === "InstanceTemplate") {
                return "??????";
            }
            return "";
        }, this);
        this.startDelete = function () {
            this.deleteReason("");
            if ($.mobile.popup && $.mobile.popup.active) {
                this.triggerDelay("Delete");
            }
            this.delayPop("Delete");
        };
        this.getComments = function () {
            var dfd = $.Deferred();
            var root = this;
            root.loading(true);
            return BPMS.Services.getProcessInstanceComments(root.id()).then(function (result) {
                root.loading(false);
                root.commentInfo.comments(result);
                $('[data-toggle="tooltip"]').tooltip();
                dfd.resolve(result);
            });
        }
        this.doComment = function () {
            var root = this;
            if (!this.commentInfo.message()) {
                return;
            }
            var message = {
                to: this.commentInfo.to() || "",
                message: this.commentInfo.message()
            }
            var data = {
                "message": JSON.stringify(message)
                //"saveProcessInstanceId": true
            }
            this.loading(true);
            var result;
            var foundComment = root.commentInfo.comments().filter(function (comment) {
                return comment.id === root.commentInfo.originalId();
            })[0];

            var taskId = foundComment && foundComment.taskId;
            if (taskId) {
                data.saveProcessInstanceId = true;
                result = BPMS.Services.postTaskComments(taskId, data);
            } else {
                result = BPMS.Services.postProcessInstanceComments(this.id(), data);
            }

            result.then(function () {
                root.commentInfo.message("");
                root.commentInfo.to("");
                root.commentInfo.originalId("");
                $("#to").val("");
                root.getComments();
            }, function () {
                root.loading(false);
                alert("error");
            });
        }
        this.selectComment = function (comment) {
            this.commentInfo.originalId(comment.id);
        };
        this.startComments = function () {
            var root = this;
            root.getComments().then(function (result) {
                // if ($.mobile.popup && $.mobile.popup.active) {
                //     root.triggerDelay("Comments");
                // }
                // root.delayPop("Comments");
                if ($.mobile.popup && $.mobile.popup.active) {
                    root.triggerDelay("Comments");
                } else {
                    $("#popComments").popup("open");
                }
            });
        };
        this.delete = function () {
            var root = this;
            //if (!this.canDelete() || !this.deleteReason()) {
            if (!this.canDelete()) {
                return;
            }
            this.loading(true);
            return BPMS.Services.putProcessInstanceVariables(this.id(), [{
                name: "proins_deletereason",
                type: "string",
                value: this.deleteReason()
            }]).then(function () {
                return BPMS.Services.deleteProcessInstance(root.id());
            }, function () {
                root.loading(false);
                $.mobile.popup.active.close();
                root.delayObject = {
                    type: "error",
                    title: "??????????????????",
                    description: "???????????????????????????????????????"
                };
            }).then(function () {
                root.loading(false);
                $.mobile.popup.active.close();
                root.delayObject = {
                    type: "success",
                    title: "??????????????????",
                    description: "??????????????????",
                    // callback: function () {
                    //     window.location.href = "instance_list.html";
                    // }
                    callback: root.init.bind(root)
                };
            }, function () { });
        };
        var getData = function (index) {
            that.loading(true);
            var item = {};
            that.queryInfo.param.start = index;
            BPMS.Services.getHistoricProcessInstances(that.queryInfo.param)
                .then(function (result) {
                    item = result.data[0];
                    that.queryInfo.hasNext = index < result.total - 1;
                    that.queryInfo.hasPrev = index > 0;

                    return BPMS.Services.Utils.request(item.processDefinitionUrl, {});
                }).then(function (result2) {
                    item.processName = result2.name;
                    item.processDescription = item.description;
                    item.version = item.version;
                    item.queryInfo = that.queryInfo;
                    that.loading(false);
                    var param = {
                        "processInstanceId": item.id,
                        "processDefinitionId": item.processDefinitionId
                    };
                    sessionStorage.setItem("instance", JSON.stringify(item));
                    var url = "instance_detail.html?" + $.param(param);
                    window.location.href = url;
                });
        };

        this.getNext = function () {
            var index = that.queryInfo.param.start + 1;
            getData(index);
        };
        this.getPrev = function () {
            var index = that.queryInfo.param.start - 1;
            getData(index);
        };


        //this.flowDiagram = "";
        //this.historyDiagram = "";
        this.formatName = function (id, name) {
            id = id || "";
            name = name || "";
            return [id.trim(), name.trim()].join(": ");
        };
        this.switchTab = function (vm, e) {
            var a = $(e.target).closest("a");
            a.tab("show");
            e.preventDefault();
        };

        this.viewImage = function (type) {
            this.loading(true);
            var root = this;
            if (type === "flow") {
                BPMS.Services.getProcessDefinition(root.processDefinitionId()).then(function (res) {
                    return BPMS.Services.getDeployment(res.deploymentId);
                }).then(function (res2) {
                    var item = res2.filter(function (i) {
                        return i && i.type && i.type === "resource";
                    })[0];

                    return BPMS.Services.Utils.getImage(item.contentUrl);

                }).then(function (res3) {
                    var imageData = BPMS.Services.Utils.rebuildImage(res3);
                    that.loading(false);
                    that.pop("image", {
                        "src": imageData
                    });

                });

            } else if (type === "history") {
                var url = BPMS.config.serviceUrl + "runtime/process-instances/" + root.id() + "/diagram";
                BPMS.Services.Utils.getImage(url).then(function (res) {
                    var imageData = BPMS.Services.Utils.rebuildImage(res);
                    that.loading(false);
                    that.pop("image", {
                        "src": imageData
                    });
                });
            }
        };

        this.close = function () {
            $("#popFlow").popup("close");
        };

        this.flow = {
            "id": ko.observable(),
            "name": ko.observable(),
            "assignee": ko.observable(),
            "date": ko.observable(),
            "time": ko.observable(),
            "coreAction": ko.observable(["", ""]),
            "coreValue": ko.observable(["", ""]),
            "coreComments": ko.observable(["", ""])
        };
        this.selectFlow = function ($data) {
            if (!$data.id) {
                return;
            }
            that.flow.id("");
            that.flow.name("");
            that.flow.assignee("");
            that.flow.date("");
            that.flow.time("");
            that.flow.coreAction(["", ""]);
            that.flow.coreValue(["", ""]);
            that.flow.coreComments(["", ""]);

            //if (that.flows().indexOf($data) == 0)
            //    return false;
            //alert(JSON.stringify($data))processDefinitionId id processInstanceId
            var mapped = that.historicDetails.filter(function (h) {
                return h && h.taskId === $data.id &&
                    h.processInstanceId === $data.processInstanceId &&
                    h.propertyId.toLowerCase().indexOf("core") === 0;
            });
            that.flow.id($data.id || "");
            that.flow.name($data.name || "");
            that.flow.assignee($data.assignee || "");
            that.flow.date(BPMS.Services.Utils.formatDateTime($data.endTime, "t3"));
            that.flow.time(BPMS.Services.Utils.formatDateTime($data.endTime, "t4"));
            var coreInfo = BPMS.Services.Utils.getCoreInfo(mapped);

            for (var i in coreInfo) {
                that.flow[i]([coreInfo[i].name, coreInfo[i].value]);
            }
            $("#popFlow").popup("open");
        };
        this.goToEdit = function () {
            if (!this.type() || !this.id()) {
                return;
            }
            window.location.href = "process_create.html?" + $.param({
                draftId: this.id(),
                processDefinitionId: this.processDefinitionId()
            });
        };


        this.initDraft = function () {
            var root = this;
            var savedUserId = "";
            var request = BPMS.Services.getDocument(root.id()).then(
                function (item) {
                    root.id(item._id);
                    root.businessKey(item.businessKey);
                    savedUserId = item.involvedUser;
                    root.processDefinitionId(item.processDefinitionId);
                    root.processDefinitionUrl("");
                    root.startTime(BPMS.Services.Utils.formatDateTime(parseInt(item._id, 10), "t5"));
                    root.endTime(null);
                    root.startUserId(item.userId);
                    root.variables([]);
                    root.name("");
                    root.category(null);
                    root.superProcessInstanceId("");
                    root.processDescription(null);
                    root.canDelete(false);
                    root.printable(null);
                    root.tables.removeAll();
                    root.processInvalid(false);
                    item.tables.forEach(function (t) {
                        t.editable = false;
                    });
                    var newTables = BPMS.Services.Utils.buildTables(item.tables);
                    root.tables(newTables);
                    root.attachments.removeAll();
                    root.attachments(item.attachments);
                    root.fields.removeAll();
                    root.fields(item.fields);
                    that.flows.removeAll();
                    that.subInstances.removeAll();
                    return BPMS.Services.getProcessDefinition(item.processDefinitionId);
                }).then(function (process) {
                    root.processName(process.name);
                    root.processDescription(process.description);
                    that.loaded(true);
                    $("#home-tab").click();
                    that.loading(false);
                    if (savedUserId) {
                        BPMS.Services.Utils.request("identity/users/" + savedUserId).then(
                            function (singleUser) {
                                var fullName = (singleUser.firstName + " " + singleUser.lastName).trim();
                                root.involvedUser(fullName);
                            }
                        );
                    }
                }, function () {
                    that.loaded(true);
                    that.loading(false);
                    root.processName("");
                    root.processDescription("");
                    root.processInvalid(true);
                });



            return request;
        };
        this.print = function () {
            var root = this;
            root.loading(true);
            var showResult = function (obj) {
                if ($.mobile.popup.active) {
                    root.triggerDelay(obj);
                } else {
                    root.pop(obj.type, obj);
                }
            }
            return BPMS.Services.downloadPDF(root.printable(),
                "activitihelper/v1/pdf/download").then(
                    function () {
                        root.loading(false);
                        showResult({
                            "type": "success",
                            "title": "??????????????????",
                            "description": "????????????????????????",
                        });

                    }, function () {
                        root.loading(false);
                        showResult({
                            "type": "error",
                            "title": "??????????????????",
                            "description": "?????????????????????",
                        });
                    }
                );

        };
        this.toInstance = function (data) {
            location.href = "instance_detail.html?" + $.param({
                processInstanceId: data.id
            });
        };
        this.init = function () {
            var root = this;
            root.loaded(false);
            root.canDelete(false);
            root.printable(null);
            root.fields([]);
            root.tables([]);
            root.historicDetails = [];
            root.attachments([]);
            root.flows([]);
            root.subInstances([]);
            root.processInvalid(false);
            root.involvedUser("");
            BPMS.Services.Utils.loadAttachmentTemplate();
            var instance = sessionStorage.getItem("instance");
            instance = instance && JSON.parse(instance);
            this.queryInfo = instance && instance.queryInfo;
            if (this.queryInfo) {
                this.hasNext(this.queryInfo && this.queryInfo.hasNext);
                this.hasPrev(this.queryInfo && this.queryInfo.hasPrev);
            }

            that.loading(true);
            var flows = [];
            var subInstances = [];
            var users = [];
			
			
            self.formKey = "";
			self.dataVariable = {};
            Formio.createForm(document.getElementById('formData'), {
                components: []
            }).then(function (form) {
                self.currentForm = form;
                $(self.currentForm.getContainer()).hide();
            });


			
            if (this.type()) {
                return root.initDraft();
            }
            return BPMS.Services.getHistoricProcessInstance(root.id()).then(
                function (item) {
                    root.id(item.id);
                    root.businessKey(item.businessKey);
                    root.processDefinitionId(item.processDefinitionId);
                    root.processDefinitionUrl(item.processDefinitionUrl);
                    root.startTime(item.startTime);
                    root.endTime(item.endTime);
                    root.startUserId(item.startUserId);
                    //root.variables(item.variables);
                    root.name(item.name);
                    root.category(item.category);
                    root.superProcessInstanceId(item.superProcessInstanceId);
                    root.processDescription(item.processDescription);
                    root.deleteReason(item.deleteReason);
					
					
					
					return BPMS.Services.getFormData({"processDefinitionId": item.processDefinitionId})
                    //return BPMS.Services.Utils.request(item.processDefinitionUrl, {});
                }
			).then(function (response) {
				self.formKey = response.formKey;
				if(self.formKey){
					BPMS.Services.getForm(self.formKey).then(
						function (response2) {
							if (response2) {
								Formio.createForm(document.getElementById('formData'), {
									components: response2.formData
								}, { readOnly: false}).then(function (form) {
									self.currentForm = form;
									$(self.currentForm.getContainer()).show();
								});
							}
						}
					)
				}
				return BPMS.Services.Utils.request(that.processDefinitionUrl(), {});

			}).then(function (process) {
                // console.log(process);
				
                root.processName(process.name);
                root.processDescription(process.description);
                if (that.endTime()) {
                    var dfd = $.Deferred();
                    dfd.resolve([{ name: "proins_deletable", value: "no" }]);
                    return dfd.promise();
                }
                else {
                    return BPMS.Services.getProcessInstanceVariables(root.id());
                }
            }).then(
                function (variables) {
                    //variables.push({ "name": "bpms_printable", "type": "string", "value": "{\"processInstanceId\":\"10000\",\"templateName\":\"pur003av1.yml\",\"outputFileName\":\"test\"}", "scope": "local" })
                    root.variables(variables);
                    var canDelete = (variables.filter(function (v) {
                        return v.name === "proins_deletable" && v.value === "no";
                    })).length === 0;
                    root.canDelete(canDelete);

                    var involvedUser = variables.filter(function (v) {
                        return v.name === "involved_user";
                    })[0];

                    root.involvedUser(involvedUser ? involvedUser.value : "");
                    var printVar = variables.filter(function (v) {
                        return v.name === "bpms_printable";
                    })[0];
                    var printable = null;
                    if (printVar) {
                        printable = JSON.parse(printVar.value);
                    }
                    root.printable(printable);

					if(self.formKey && (!that.endTime()) ){

                        //var dataVariable = {};
                        variables.forEach(function (variable) {				
							try {
							   self.dataVariable[variable.name] = JSON.parse(variable.value);	
							}
							catch(err){
							   self.dataVariable[variable.name] = variable.value;	
							}
							
                          				
                        });
						self.currentForm.setSubmission({ data: self.dataVariable });						
					}
					
					if(self.formKey && that.endTime()){
						BPMS.Services.getVariableInstances({"processInstanceId": root.id(),"size": 100000}).then(function (response3) {
							//var dataVariable = {};
							response3.data.forEach(function (elem) {				
								try {
								   self.dataVariable[elem.variable.name] = JSON.parse(elem.variable.value);	
								}
								catch(err){
								   self.dataVariable[elem.variable.name] = elem.variable.value;	
								}
								
											
							});
							console.log(self.dataVariable)
							self.currentForm.setSubmission({ data: self.dataVariable });
						})
						
					}
					
                    return BPMS.Services.getHistoricDetail({
                        "processInstanceId": root.id(),
                        "size": 100000
                    });
                }
            ).then(function (result) {
                that.historicDetails = result.data;
                var properties = BPMS.Services.Utils.analyseProperties(result.data.filter(function (i) {
                    return i && !i.taskId;
                }));
                that.tables.removeAll();
                that.tables(properties.tables);
                that.attachments.removeAll();
                if (properties.attachments.length) {
                    that.attachments(properties.attachments[0].value);
                }
                that.fields.removeAll();
                that.fields(properties.fields);

                return BPMS.Services.queryHistoricProcessInstances({
                    superProcessInstanceId: root.id(),
                    size: 10000
                });
            }).then(function (result) {
                subInstances = result.data;

                subInstances.forEach(function (instance) {
                    if (instance && instance.startUserId && users.indexOf(instance.startUserId) < 0) {
                        users.push(instance.startUserId);
                    }
                });
	
                return BPMS.Services.getTaskInstances({
                    "processInstanceId": root.id(),
                    "sort": "startTime",
                    "order": "asc",
                    "size": 100000
                });
            }).then(function (result2) {
                that.flows.removeAll();

                flows = result2.data;

                var defaultItem = {
                    "id": "",
                    "processDefinitionId": that.id(),
                    "processDefinitionUrl": that.processDefinitionUrl(),
                    "processInstanceId": "",
                    "name": that.processName(),
                    "description": that.processDescription(),
                    "owner": "",
                    "assignee": that.startUserId(),
                    "startTime": that.startTime(),
                    //"endTime": that.endTime(),
                    "endTime": that.startTime(),
                    "variables": []
                };
                flows.unshift(defaultItem);


                flows.forEach(function (flow) {
                    if (flow && flow.assignee && users.indexOf(flow.assignee) < 0) {
                        users.push(flow.assignee);
                    }
                    if (flow && flow.owner && users.indexOf(flow.owner) < 0) {
                        users.push(flow.owner);
                    }
                    if (root.involvedUser() && users.indexOf(root.involvedUser()) < 0) {
                        users.push(root.involvedUser());
                    }

                    var mapped = that.historicDetails.filter(function (h) {
                        return h && h.taskId === flow.id &&
                            h.processInstanceId === flow.processInstanceId &&
                            h.propertyId.toLowerCase().indexOf("core") === 0;
                    });

                    var coreInfo = BPMS.Services.Utils.getCoreInfo(mapped);
                    flow.coreInfo = coreInfo;


                });
                return BPMS.Services.getUsers(users);
            }, function () {
                that.pop("error", {
                    "title": "????????????????????????",
                    "description": "??????????????????????????????????????????????????????????????????"
                });
                that.loading(false);
            }).then(function (response) {
                Array.prototype.forEach.call(arguments, function (item, index) {
                    if (!item || (!item.length && !item.id) || item.readyState) {
                        return;
                    }
                    var singleUser = item[0] || item;
                    flows.forEach(
                        function (flow) {
                            var fullName = (singleUser.firstName + " " + singleUser.lastName).trim();
                            if (flow && flow.assignee && flow.assignee === singleUser.id) {
                                flow.assignee = fullName;
                            }
                            if (flow && flow.owner && flow.owner === singleUser.id) {
                                flow.owner = fullName;
                            }
                            if (root.involvedUser() && root.involvedUser() === singleUser.id) {
                                root.involvedUser(fullName);
                            }
                        }
                    );
					flows.sort(function(a, b) {
					  return (b.endTime ? b.endTime : "2099-01-01T11:00:00.000+08:00") < (a.endTime ? a.endTime : "2099-01-01T11:00:00.000+08:00") ? 1 : -1
					})
                    subInstances.forEach(
                        function (instance) {
                            var fullName = (singleUser.firstName + " " + singleUser.lastName).trim();
                            if (instance && instance.startUserId && instance.startUserId === singleUser.id) {
                                instance.startUser = fullName;
                            }

                            /* ???????????? */
                            else {
                                instance.startUser = "N/A";
                            }
                            /* ???????????? */
                        }
                    );
                });
                that.loaded(true);
                that.flows.removeAll();
                that.flows(flows);
                that.subInstances(subInstances);
                return that.getComments();
            }, function () {
                that.pop("error", {
                    "title": "????????????????????????",
                    "description": "??????????????????????????????????????????????????????????????????"
                });
                $("#home-tab").click();
                that.loading(false);
            }).then(function (result) {
				self.currentForm.setSubmission({ data: self.dataVariable });	
                $("#home-tab").click();
                that.loading(false);
            });
			
        };
    };
    BPMS.ViewModels.InstanceDetailViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, jQuery, ko);