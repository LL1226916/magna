(function (BPMS, $, ko, moment) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.TaskListViewModel = function () {
        var root = this;
        root.continuePop = false;
        window.vm = root;
        root.person = ko.observable("");
        root.people = ko.observableArray([]);
        root.type = ko.observable();
        root.nameLike = ko.observable("");
        root.processInstanceId = ko.observable("");
        root.owner = ko.observable("");
        root.ownerName = ko.observable("");
        root.ownerRole = ko.observable("");
        root.processDefinitionNameLike = ko.observable("");
        root.processInstanceBusinessKeyLike = ko.observable("");
        var type = BPMS.Services.Utils.getUrlParam(window.location.href, "type") || "unfinished";
        var nameLike = BPMS.Services.Utils.getUrlParam(window.location.href, "nameLike") || "";
        var processDefinitionNameLike = BPMS.Services.Utils.getUrlParam(window.location.href, "processDefinitionNameLike") || "";
        var processInstanceBusinessKeyLike = BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceBusinessKeyLike") || "";
        var processInstanceId = BPMS.Services.Utils.getUrlParam(window.location.href, "processInstanceId") || "";

        var owner = BPMS.Services.Utils.getUrlParam(window.location.href, "owner") || "";
        root.owner(owner);
        var ownerName = BPMS.Services.Utils.getUrlParam(window.location.href, "ownerName") || "";
        root.ownerName(ownerName);
        var ownerRole = BPMS.Services.Utils.getUrlParam(window.location.href, "ownerRole") || "";
        root.ownerRole(ownerRole);
        root.type(type);
        root.nameLike(nameLike);
        root.processInstanceId(processInstanceId);
        root.processDefinitionNameLike(processDefinitionNameLike);
        root.processInstanceBusinessKeyLike(processInstanceBusinessKeyLike);
        // root.selectPerson = function (person) {
        //     root.owner(person.delegator.sn || "");
        //     root.ownerName(person.delegator.name || "");
        //     root.ownerRole(person.role || "");
        //     $("#popupPeople").popup("close");
        //     root.processInstanceId("");
        //     root.nameLike("");
        //     root.processDefinitionNameLike("");
        //     root.processInstanceBusinessKeyLike("");
        //     var currentType = root.type();
        //     root[currentType].pageIndex(1);
        //     root.getData();
        //     ["all", "delay", "unfinished", "assigned"].filter(function (t) {
        //         return t !== currentType;
        //     }).forEach(
        //         function (t) {
        //             root[t].pageIndex(1);
        //             root.getData(t, 1);
        //         }
        //     );
        // };

        ["all", "delay", "unfinished", "assigned"].forEach(
            function (item) {
                root[item] = new BPMS.Services.Utils.CreateTypeData();
            }
        );

        root.startSearch = function () {
            $("#popupSearch").popup("open");
        };
        root.showMore = function () {
            $("#popMore").popup("open");
            $("#popMore").on("popupafterclose", function () {
                if (root.continuePop) {
                    $("#popupSearch").popup("open");
                    root.continuePop = false;
                }
            });
        };
        root.showAdvancedSearch = function () {
            root.continuePop = true;
            $("#popMore").popup("close");
        };
        root.allCount = ko.observable();
        root.delayCount = ko.observable();
        root.unfinishedCount = ko.observable();
        root.assignedCount = ko.observable();
        root.hasFilter = ko.computed(function () {
            return !!(this.nameLike() ||
                this.processInstanceId() ||
                this.processDefinitionNameLike() ||
                this.processInstanceBusinessKeyLike());
        }, root);

        root.getPrev = function () {
            var currentType = root.type();
            var index = root[currentType].pageIndex();
            if (root[currentType].hasPrev()) {
                root[currentType].pageIndex(index - 1);
                root.getData();
            }
        };
        root.getNext = function () {
            var currentType = root.type();
            var index = root[currentType].pageIndex();
            if (root[currentType].hasNext()) {
                root[currentType].pageIndex(index + 1);
                root.getData();
            }

        };
        root.clearAdvancedSearch = function () {
            root.processInstanceId("");
            root.nameLike("");
            root.processDefinitionNameLike("");
            root.processInstanceBusinessKeyLike("");
            $("#processInstanceId,#taskName,#processName,#processInstanceBusinessKey").
                parent().find("a.ui-input-clear").not(".ui-input-clear-hidden").click();

            root.advancedSearch();
        };
        root.advancedSearch = function () {
            var currentType = root.type();
            root[currentType].pageIndex(1);
            root.getData();
            ["all", "delay", "unfinished", "assigned"].filter(function (t) {
                return t !== currentType;
            }).forEach(
                function (t) {
                    root.getData(t, 1);
                }
            );
            if ($.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
        };

        root.getDelegators = function () {
            var dfd = $.Deferred();
            var people = [];
            root.people.removeAll();
            BPMS.Services.getDelegators(root.user).then(function (result) {
                people = result;
                var requests = people.map(function (person) {
                    var param = {
                        "assignee": person.userId,
                        "active": true
                    }

                    if (root.nameLike()) {
                        param.nameLike = "%" + root.nameLike() + "%";
                    }
                    if (root.processInstanceId()) {
                        param.processInstanceId = root.processInstanceId();
                    }

                    if (root.processDefinitionNameLike()) {
                        param.processDefinitionNameLike = "%" + root.processDefinitionNameLike() + "%";
                    }

                    if (root.processInstanceBusinessKeyLike()) {
                        param.processInstanceBusinessKeyLike = "%" + root.processInstanceBusinessKeyLike() + "%";
                    }

                    return BPMS.Services.getTasks(param);
                });
                return $.when.apply(this, requests);
            }).then(function () {
                Array.prototype.forEach.call(arguments, function (item, index) {
                    if (!item || typeof (item) !== "object" || item.readyState) {
                        return;
                    }
                    var singleItem = item[0] || item;
                    people[index].count = ko.observable(singleItem.total);
                });
                root.people(people);
                dfd.resolve(people);

            });
            return dfd.promise();
        }
    };

    BPMS.ViewModels.TaskListViewModel.extend(BPMS.ViewModels.BaseViewModel);
    BPMS.ViewModels.TaskListViewModel.prototype.pageSize = BPMS.config.pageSize;
    BPMS.ViewModels.TaskListViewModel.prototype.selectItem = function ($data) {
        var root = this;

        var state = {
            "type": root.type(),
            "pageIndex": root[root.type()].pageIndex()
        };
        if (root.nameLike()) {
            state.nameLike = "%" + root.nameLike() + "%";
        }
        if (root.processInstanceId()) {
            state.processInstanceId = root.processInstanceId();
        }

        if (root.processDefinitionNameLike()) {
            state.processDefinitionNameLike = "%" + root.processDefinitionNameLike() + "%";
        }

        if (root.processInstanceBusinessKeyLike()) {
            state.processInstanceBusinessKeyLike = "%" + root.processInstanceBusinessKeyLike() + "%";
        }
        if (root.owner() && root.owner() !== root.user.userId) {
            state.owner = root.owner();
            state.ownerName = root.ownerName();
            state.ownerRole = root.ownerRole();
        }

        var url = window.location.href;
        var index = url.indexOf("?");
        if (index >= 0) {
            url = url.substr(0, index);
        }
        if (history.replaceState) {
            history.replaceState(state, document.title, url + "?" + $.param(state));
        }

        var obj = {
            "taskId": $data.id,
            "processInstanceId": $data.processInstanceId,
            "processDefinitionId": $data.processDefinitionId
        };
        var url = this.detail ? "task_detail_normal.html" : "task_detail.html";
        window.location.href = url + "?" + $.param(obj);

		
        return false;
    };

    BPMS.ViewModels.TaskListViewModel.prototype.init = function () {
        var root = this;
        var userId = this.user && this.user.userId;
        root.wxConfig();
        var state = BPMS.Services.Utils.getUrlParams(window.location.href);
        if (state && state.type) {
            root.type(state.type);
            root[state.type].pageIndex(parseInt(state.pageIndex, 10));
        }



        var sNameLike = root.nameLike();
        var sProcessDefinitionNameLike = root.processDefinitionNameLike();
        var sProcessInstanceBusinessKeyLike = root.processInstanceBusinessKeyLike();
        var sProcessInstanceId = root.processInstanceId();
        var selectedOwner = root.owner();
        var isOthers = (selectedOwner && selectedOwner !== root.user.userId);
        var tempUserId = isOthers ? selectedOwner : root.user.userId;

        var params = {
            "all": {
                "candidateUser": tempUserId,
                "active": true
            }, "delay": {
                "assignee": tempUserId,
                "active": true,
                "dueBefore": moment().format()
            }, "unfinished": {
                "assignee": tempUserId,
                "active": true
            }, "assigned": {
                "owner": tempUserId,
                "delegationState": "pending",
                "active": true
            }
        };

        ["all", "delay", "unfinished", "assigned"].forEach(function (tempType) {
            var tempParam = params[tempType];
            if (sNameLike) {
                tempParam.nameLike = "%" + sNameLike + "%";
            }
            if (sProcessInstanceId) {
                tempParam.processInstanceId = sProcessInstanceId;
            }

            if (sProcessDefinitionNameLike) {
                tempParam.processDefinitionNameLike = "%" + sProcessDefinitionNameLike + "%";
            }
            if (sProcessInstanceBusinessKeyLike) {
                tempParam.processInstanceBusinessKeyLike = "%" + sProcessInstanceBusinessKeyLike + "%";
            }
            if (isOthers) {
                tempParam.taskDefinitionKeyLike = "%" + root.ownerRole() + "%";
            }
        });

        root.loading(true);
        var hasError = false;
        //var task0 = BPMS.Services.getDelegators(userId);
        var failCallback = function (error) {
            if (hasError) {
                return;
            }
            root.pop("error", {
                "title": "????????????????????????",
                "description": "??????????????????????????????????????????????????????????????????"
            });
            root.loading(false);
            hasError = true;
        };


        var task1 = BPMS.Services.getTasks(params.all);
        var task2 = task1.then(function (result) {
			root.allCount(result.total);
			
			var withOutLpaParam = params.all;
			withOutLpaParam.nameLike = "%lpa%";
			BPMS.Services.getTasks(withOutLpaParam).then(function (response) {
				root.allCount(result.total - response.total);
			}, failCallback);
            
           
            return BPMS.Services.getTasks(params.delay);
        }, failCallback);
        var task3 = task2.then(function (result) {
			root.delayCount(result.total);
			
			var withOutLpaParam = params.delay;
			withOutLpaParam.nameLike = "%lpa%";
			BPMS.Services.getTasks(withOutLpaParam).then(function (response) {
				root.delayCount(result.total - response.total);
			}, failCallback);
            
            return BPMS.Services.getTasks(params.unfinished);
        }, failCallback);
        var task4 = task3.then(function (result) {
			root.unfinishedCount(result.total);
			
			var withOutLpaParam = params.unfinished;
			withOutLpaParam.nameLike = "%lpa%";
			BPMS.Services.getTasks(withOutLpaParam).then(function (response) {
				root.unfinishedCount(result.total - response.total);
			}, failCallback);
            
            return BPMS.Services.getTasks(params.assigned);
        }, failCallback);
        var task5 = task4.then(function (result) {
			root.assignedCount(result.total);
			
			var withOutLpaParam = params.assigned;
			withOutLpaParam.nameLike = "%lpa%";
			BPMS.Services.getTasks(withOutLpaParam).then(function (response) {
				root.assignedCount(result.total - response.total);
			}, failCallback);
            
            return root.getDelegators();
        }, failCallback).then(function () {
            root.loading(false);
            $("a[id='" + root.type() + "-tab']").click();
        });
        return task5;
    };
    BPMS.ViewModels.TaskListViewModel.prototype.switchTab = function (data, e) {
        this.person("");
        var a = $(e.target).closest("a");
        var id = a.attr("id");
        var parts = id.split("-");
        if (parts.length > 2) {
            this.person(data.userId);
        }

        var tempType = parts[0];
        this.type(tempType);
        this[tempType].pageIndex(1);
        return this.getData().then(function () {
            a.tab("show");
            e.preventDefault();
        });
    };
    BPMS.ViewModels.TaskListViewModel.prototype.getData = function (type, index) {
        var userId = this.user && this.user.userId;
        var root = this;
        root.loading(true);
        var currentType = type || root.type();
        root[currentType].items.removeAll();
        var size = this.pageSize;
        var page = index || root[currentType].pageIndex();
        var start = (page - 1) * size;

        var now = moment().format("YYYY-MM-DDTHH:mm:ssZ");
        var isOthers = (root.owner() && root.owner() !== userId);
        var tempUserId = isOthers ? root.owner() : userId;

        var filters = {
            "all": {
                "candidateUser": tempUserId
            },
            "delay": {
                "assignee": tempUserId,
                "dueBefore": now
            },
            "unfinished": {
                "assignee": tempUserId
            }, "assigned": {
                "owner": tempUserId,
                "delegationState": "pending"
            }
        };

        var currentFilter = filters[currentType];
        if (currentType === "assigned" && root.person()) {
            currentFilter = {
                assignee: root.person()
            };
        }
        // delete currentFilter.taskDefinitionKeyLike;
        // delete currentFilter.nameLike;
        // delete currentFilter.processDefinitionNameLike;
        // delete currentFilter.processInstanceBusinessKeyLike;

        var param = {
            "active": true,
            "start": start,
            "sort": "createTime",
            "order": "desc",
            "size": size
        };
        $.extend(param, currentFilter);

        if (isOthers) {
            param.taskDefinitionKeyLike = "%" + root.ownerRole() + "%";
        }

        if (root.nameLike()) {
            param.nameLike = "%" + root.nameLike() + "%";
        }

        if (root.processInstanceId()) {
            param.processInstanceId = root.processInstanceId();
        }
        if (root.processDefinitionNameLike()) {
            param.processDefinitionNameLike = "%" + root.processDefinitionNameLike() + "%";
        }
        if (root.processInstanceBusinessKeyLike()) {
            param.processInstanceBusinessKeyLike = "%" + root.processInstanceBusinessKeyLike() + "%";
        }


        var items;
        var userIds;
        root[currentType].items.removeAll();
        var promise = BPMS.Services.getTasks(param)
            .then(function (result) {

                if (!root.person()) {

                    //root[currentType + "Count"](result.total);
                } else {
                    root.people().filter(function (person) {
                        return person.userId === root.person();
                    })[0].count(result.total);
                }

                items = result.data;
                userIds = [];
                var pageCount = Math.floor((result.total - 1) / size) + 1;
                root[currentType].pageCount(pageCount);
                items.forEach(function (i) {
                    i.startUserId = "";
                    i.startUserName = "";
                    i.ownerName = "";
                    i.assigneeName = "";
                    if (i.owner && userIds.indexOf(i.owner) < 0) {
                        userIds.push(i.owner);
                    }
                    if (i.assignee && userIds.indexOf(i.assignee) < 0) {
                        userIds.push(i.assignee);
                    }
                });

                var instanceRequests = items.map(function (item) {
                    return BPMS.Services.getHistoricProcessInstance(item.processInstanceId);
                });
                return $.when.apply(this, instanceRequests);

            }, function () {
                root.pop("error", {
                    "title": "????????????????????????",
                    "description": "??????????????????????????????????????????????????????????????????"
                });
                root.loading(false);
            }).then(
                function () {
                    Array.prototype.forEach.call(arguments, function (item) {

                        if (!item || (!item.length && !item.id) || item.readyState) {
                            return;
                        }
                        var singleItem = item[0] || item;

                        var tempItems = items.filter(function (tempItem) {
                            return tempItem.processInstanceId === singleItem.id;
                        });

                        tempItems.forEach(function (tempItem) {
                            tempItem.startUserId = singleItem.startUserId;
                            tempItem.instanceStartTime = singleItem.startTime;
                            tempItem.businessKey = singleItem.businessKey;
                            if (singleItem.startUserId && userIds.indexOf(singleItem.startUserId) < 0) {
                                userIds.push(singleItem.startUserId);
                            }
                        });


                    });

                    return BPMS.Services.getUsers(userIds);
                },
                function () {
                    root.pop("error", {
                        "title": "????????????????????????",
                        "description": "??????????????????????????????????????????????????????????????????"
                    });
                    root.loading(false);
                }
            ).then(function (response) {
                Array.prototype.forEach.call(arguments, function (tempUser) {

                    if (!tempUser || (!tempUser.length && !tempUser.id) || tempUser.readyState) {
                        return;
                    }
                    var singleUser = tempUser[0] || tempUser;
					
                    items.forEach(
                        function (item) {
                            item.draft = "";
                            var fullName = (singleUser.firstName + " " + singleUser.lastName).trim();
                            if (item && item.startUserId && item.startUserId === singleUser.id) {
                                item.startUserName = fullName;
                            }
                            if (item && item.owner && item.owner === singleUser.id && currentType !== "assigned") {
                                item.ownerName = fullName;
                            }
                            if (item && item.assignee && item.assignee === singleUser.id && currentType === "assigned") {
                                item.assigneeName = fullName;
                            }
							if(item.name.indexOf("lpa")>1){
								item.businessKey = "?????????LPA???????????????" ;
								item.id = "LPA";
							}
							

                        }
                    );
					

                });
                var keys = items.map(function (item) {
                    return item.id;
                });
                return BPMS.Services.getDocuments({
                    filter: {
                        taskId: {
                            $in: keys
                        },
                        type: "TaskDraft"
                    }
                });
            }, function () {
                root.pop("error", {
                    "title": "????????????????????????",
                    "description": "??????????????????????????????????????????????????????????????????"
                });
                root.loading(false);
            }).then(function (draftRes) {
                var drafts = draftRes._embedded || [];
                drafts.forEach(function (draft) {
                    var findItem = function (item) {
                        return draft && draft.taskId && draft.taskId === item.id;
                    };
                    var item = items.filter(findItem)[0];
                    if (item) {
                        item.draft = draft._id;
                    }
                });

				var itemsWithoutLpa = items.filter(function (tempItem) {
                  return tempItem.name.indexOf("lpa") < 1;
                });
				var itemsWithLpa = items.filter(function (tempItem) {
                  return tempItem.name.indexOf("lpa") > 1;
                });				
				//root[currentType + "Count"](items.length - itemsWithLpa.length);
                root[currentType].items(itemsWithoutLpa);
                root.loading(false);
            });
        return promise;
    };

})(window.BPMS = window.BPMS || {}, jQuery, ko, moment);