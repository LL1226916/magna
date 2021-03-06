(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.HistoryDetailViewModel = function () {
        var self = this;
        window.vm = self;
        this.fields = ko.observableArray();
        this.tables = ko.observableArray();
        this.historicDetails = [];
        this.attachments = ko.observableArray();
        this.getAction = function ($data, $index) {
            return BPMS.Services.Utils.getAction($data, $index, self.historicDetails);
        };
        this.commentInfo = {
            message: ko.observable(""),
            to: ko.observable(),
            comments: ko.observableArray()
        };
        self.userId = this.user && this.user.userId;
        self.taskId = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "taskId") || "");
        self.processInstanceId = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId") || "");
        self.processDefinitionId = ko.observable(BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionId") || "");
        self.name = ko.observable("");
        self.processName = ko.observable("");
        self.processInstanceBusinessKey = ko.observable("");

        self.loaded = ko.observable(false);
        self.description = ko.observable("");
        self.definitionDescription = ko.observable("");
        self.startTime = ko.observable();
        self.endTime = ko.observable();
        self.assignee = ko.observable("");
        self.assigneeName = ko.observable("");
        self.startUserName = ko.observable();
        self.ownerName = ko.observable("");
        this.flows = ko.observableArray();
        var task = sessionStorage.getItem("task");
        task = task && JSON.parse(task);
        this.task = task;
        if (task) {
            this.hasNext = ko.observable(task.queryInfo.hasNext);
            this.hasPrev = ko.observable(task.queryInfo.hasPrev);
        }

        var getData = function (index) {
            self.loading(true);
            var item = {};
            var queryInfo = self.task.queryInfo;
            queryInfo.param.start = index;
            BPMS.Services.getTaskInstances(queryInfo.param)
                .then(function (result) {
                    item = result.data[0];
                    queryInfo.hasNext = index < result.total - 1;
                    queryInfo.hasPrev = index > 0;

                    return BPMS.Services.Utils.request(item.processDefinitionUrl, {});
                }).then(function (result2) {
                    item.processName = result2.name;
                    item.processDescription = item.description;
                    item.version = item.version;
                    item.queryInfo = queryInfo;
                    self.loading(false);
                    var param = {
                        "taskId": item.id,
                        "processInstanceId": item.processInstanceId,
                        "processDefinitionId": item.processDefinitionId
                    };

                    sessionStorage.setItem("task", JSON.stringify(item));
                    var url = "history_detail.html?" + $.param(param);
                    window.location.href = url;
                });
        };

        this.getNext = function () {
            var index = self.task.queryInfo.param.start + 1;
            getData(index);
        };
        this.getPrev = function () {
            var index = self.task.queryInfo.param.start - 1;
            getData(index);
        };

        this.formatName = function (id, name) {
            return [id.trim(), name.trim()].join(": ");
        };
        this.viewImage = function (type) {
            this.loading(true);
            if (type === "flow") {
                BPMS.Services.getProcessDefinition(self.processDefinitionId()).then(function (res) {
                    return BPMS.Services.getDeployment(res.deploymentId);
                }).then(function (res2) {
                    var item = res2.filter(function (i) {
                        return i && i.type && i.type === "resource";
                    })[0];
                    return BPMS.Services.Utils.getImage(item.contentUrl);

                }).then(function (res3) {
                    var imageData = BPMS.Services.Utils.rebuildImage(res3);
                    self.loading(false);
                    self.pop("image", {
                        "src": imageData
                    });

                });
            } else if (type === "history") {
                var url = BPMS.config.serviceUrl + "runtime/process-instances/" + self.processInstanceId() + "/diagram";
                BPMS.Services.Utils.getImage(url).then(function (res) {
                    var imageData = BPMS.Services.Utils.rebuildImage(res);
                    self.loading(false);
                    self.pop("image", {
                        "src": imageData
                    });

                });
            }
        };
        self.getComments = function () {
            var dfd = $.Deferred();
            var root = this;
            root.loading(true);
            return BPMS.Services.getTaskComments(root.taskId()).then(function (result) {
                root.loading(false);
                root.commentInfo.comments(result);
                $('[data-toggle="tooltip"]').tooltip();
                dfd.resolve(result);
            });
        };
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
                "message": JSON.stringify(message),
                "saveProcessInstanceId": true
            }
            this.loading(true);
            BPMS.Services.postTaskComments(this.taskId(), data).then(function () {
                root.commentInfo.message("");
                root.commentInfo.to("");
                $("#to").val("");
                root.getComments();
            }, function () {
                root.loading(false);
                alert("error");
            });
        }
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
        this.close = function () {
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
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
            self.flow.id("");
            self.flow.name("");
            self.flow.assignee("");
            self.flow.date("");
            self.flow.time("");
            self.flow.coreAction(["", ""]);
            self.flow.coreValue(["", ""]);
            self.flow.coreComments(["", ""]);

            var mapped = self.historicDetails.filter(function (h) {
                return h && h.taskId === $data.id &&
                    h.processInstanceId === $data.processInstanceId &&
                    h.propertyId.toLowerCase().indexOf("core") === 0;
            });
            self.flow.id($data.id || "");
            self.flow.name($data.name || "");
            self.flow.assignee($data.assignee || "");
            self.flow.date(BPMS.Services.Utils.formatDateTime($data.endTime, "t3"));
            self.flow.time(BPMS.Services.Utils.formatDateTime($data.endTime, "t4"));
            var coreInfo = BPMS.Services.Utils.getCoreInfo(mapped);

            for (var i in coreInfo) {
                if (i && coreInfo[i]) {
                    self.flow[i]([coreInfo[i].name, coreInfo[i].value]);
                }
            }
            $("#popFlow").popup("open");
        };
        this.init = function () {
            var self = this;
            BPMS.Services.Utils.loadAttachmentTemplate();
            self.loaded(false);
            self.loading(true);
            var assignee = "";
            var owner = "";
            var startUser = "";
            var userIds = [];
			var dataVariable = {};
            self.formKey = "";
            Formio.createForm(document.getElementById('formData'), {
                components: []
            }).then(function (form) {
                self.currentForm = form;
                $(self.currentForm.getContainer()).hide();
            });
            BPMS.Services.Utils.request("history/historic-task-instances/" + self.taskId()).then(
                function (result) {
                    self.name(result.name);
                    self.description(result.description);
                    self.startTime(result.startTime);
                    self.endTime(result.endTime);
                    self.formKey = result.formKey;
                    assignee = result.assignee;
                    if (assignee && userIds.indexOf(assignee) < 0) {
                        userIds.push(assignee);
                    }
                    owner = result.owner;
                    if (owner && userIds.indexOf(owner) < 0) {
                        userIds.push(owner);
                    }
                    if (self.formKey) {
                        return BPMS.Services.getForm(self.formKey);
                    } else {

                        var dfd = $.Deferred();

                        dfd.resolve();
                        return dfd.promise();
                    }


                }
            ).then(function (result) {
                if (result) {
                    Formio.createForm(document.getElementById('formData'), {
                        components: result.formData
                    //}, { readOnly: true }).then(function (form) {
                    }).then(function (form) {
                        self.currentForm = form;
                        $(self.currentForm.getContainer()).show();
                    });
                }
                return BPMS.Services.getProcessDefinition(self.processDefinitionId());
            }).then(
				
                function (data) {
                    self.processName(data.name);
                    self.definitionDescription(data.description);

                    return BPMS.Services.getVariableInstances({"processInstanceId": self.processInstanceId(),"size": 100000});
                 }).then(function (result) {
					var currentData= self.currentForm.data;
					
					result.data.forEach(function (variable) {
						//dataVariable[variable.variable.name] = variable.variable.value;
					  if(typeof(currentData[variable.variable.name])!=="undefined"){							
						try {
						   dataVariable[variable.variable.name] = JSON.parse(variable.variable.value);	
						}
						catch(err){
						   dataVariable[variable.variable.name] = variable.variable.value;	
						}
					  }					
					});


                    return BPMS.Services.getActivityInstances({
                         processInstanceId: self.processInstanceId(),
                         size: 10000
                     });
                 }).then(function (result) {

                     var activityInstance = result.data.filter(function (activity) {
                         return activity.taskId === self.taskId();
                     })[0];

                     return BPMS.Services.getHistoricDetail({
                         activityInstanceId: activityInstance.id,
                         size: 10000
                    });
                }).then(function (result) {
                    if (self.formKey) {
                        //var dataVariable = result.data.find(function (variable) {
                        //    return variable.variable.name.length === 13 && parseInt(variable.variable.name);
                        //    //return variable.variable && variable.variable.name === self.formKey;
                        var currentData= self.currentForm.data;
                        
                        result.data.forEach(function (variable) {
                            //dataVariable[variable.variable.name] = variable.variable.value;
                          if(typeof(currentData[variable.variable.name])!=="undefined"){							
							try {
							   dataVariable[variable.variable.name] = JSON.parse(variable.variable.value);	
							}
							catch(err){
							   dataVariable[variable.variable.name] = variable.variable.value;	
							}
                          }					
                        });

                        //if (dataVariable) {
                        //    var data = JSON.parse(dataVariable.variable.value).data;
                        //    self.currentForm.setSubmission({ data: data });
                        //}
						self.currentForm.setSubmission({ data: dataVariable });
                    }

                    return BPMS.Services.getHistoricDetail({
                        "taskId": self.taskId(),
                        "size": 100000
                    });
                }).then(function (result) {
                    self.historicDetails = result.data;
                    var arr = result.data.filter(function (i) {
                        return i && i.taskId && i.taskId === self.taskId();
                    });
                    var properties = BPMS.Services.Utils.analyseProperties(arr);
                    self.tables.removeAll();
                    self.tables(properties.tables);
                    self.attachments.removeAll();
                    if (properties.attachments.length) {
                        self.attachments(properties.attachments[0].value);
                    }

                    self.fields.removeAll();
                    self.fields(properties.fields);

                    return BPMS.Services.getHistoricProcessInstance(self.processInstanceId());


                }).then(function (result2) {

                    self.processInstanceBusinessKey(result2.businessKey);
                    startUser = result2.startUserId;
                    if (startUser && userIds.indexOf(startUser) < 0) {
                        userIds.push(startUser);
                    }
                    self.startTime(result2.startTime);
                    self.endTime(result2.endTime);


                    return BPMS.Services.getTaskInstances({
                        "processInstanceId": self.taskId(),
                        "sort": "startTime",
                        "order": "asc",
                        "size": 100000
                    });
                }).then(function (result3) {
                    var flows = result3.data;

                    var defaultItem = {
                        "id": "",
                        "processDefinitionId": self.taskId(),
                        "processInstanceId": "",
                        "processInstanceBusinessKey": "",
                        "name": self.processName(),
                        "description": self.description(),
                        "owner": "",
                        "assignee": self.startUserName(),
                        "startTime": self.startTime(),
                        "endTime": self.endTime(),
                        "taskDefinitionKey": "",
                        "formKey": null,
                        "parentTaskId": null,
                        "variables": [],
                        "tenantId": ""
                    };
                    flows.unshift(defaultItem);
                    flows.forEach(function (flow) {
                        var mapped = self.historicDetails.filter(function (h) {
                            return h && h.taskId === flow.id &&
                                h.processInstanceId === flow.processInstanceId &&
                                h.propertyId.toLowerCase().indexOf("core") === 0;
                        });

                        var coreInfo = BPMS.Services.Utils.getCoreInfo(mapped);
                        flow.coreInfo = coreInfo;

                    });

                    self.flows.removeAll();
                    self.flows(flows);

                    return BPMS.Services.getUsers(userIds);
                }).then(function () {
                    Array.prototype.forEach.call(arguments, function (tempUser, index) {
                        if (!tempUser || (!tempUser.length && !tempUser.id) || tempUser.readyState) {
                            return;
                        }
                        var singleUser = tempUser[0] || tempUser;
                        var fullName = (singleUser.firstName + " " + singleUser.lastName).trim();
                        if (singleUser.id === owner) {
                            self.ownerName(fullName);
                        }
                        if (singleUser.id === assignee) {
                            self.assignee(assignee);
                            self.assigneeName(fullName);
                        }
                        if (singleUser.id === startUser) {
                            self.startUserName(fullName);
                        }
                    });
                    return self.getComments();

                }).then(function () {
                    self.loaded(true);
                    self.loading(false);
                });
        };
    };
    BPMS.ViewModels.HistoryDetailViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, jQuery, ko);