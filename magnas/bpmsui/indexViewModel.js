(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.IndexViewModel = function () {
        var self = this;
        window.vm = this;
        this.needRelogin = false;
        this.switchUser = function () {
            this.needRelogin = true;
            var ele = $("#popupMenu");
            if (ele && ele.length)
                ele.popup("close");
        };
        this.processes = ko.observableArray([]);
        this.showUserDetail = function () {
            var rolesText = "";
            var roles = self.user.Roles.split(",");
            var curLength = 0;
            for (var i = 0; i < roles.length; i++) {
                var role = roles[i];
                rolesText += role + ",";
                curLength += role.length + 1;
                if (curLength > 25) {
                    rolesText += "<br/>";
                    curLength = 0;
                }
            }
            if (rolesText.endsWith(",")) {
                rolesText = rolesText.substring(0, rolesText.length - 1);
            }
            self.pop("info", {
                "title": $.i18n("name") + ": " + self.user.name,
                "detail": $.i18n("roles") + ": " + rolesText,
                "description": $.i18n("email-address") + ": " + self.user.email
            });
        };
        this.formatLongText = function (text) {
            text = text || "";
            var length = BPMS.config.RolesMaxLength;
            if (text.length > length)
                text = text.substring(0, length - 3) + "...";
            return text;
        };
        this.goTaskPage = function (data, e) {
            var url = "task_list.html";
            var type = $(e.target).data("type");
            if (type)
                url += "?type=" + type;
            window.location.href = url;
        };


        this.popMenu = function () {
            $("#popupMenu").popup("open");
            $("#popupMenu").on("popupafterclose", function () {
                if (self.needRelogin)
                    self.pop('login', {});
                self.needRelogin = false;

            });
        };
        this.now = moment().format("YYYY-MM-DD HH:mm");
        this.processNumber = ko.observable("...");
        this.allTaskNumber = ko.observable();
        this.delayTaskNumber = ko.observable();
        this.unfinishedTaskNumber = ko.observable();
        var userId = this.user && this.user.userId;
        this.userId = userId;
        this.go = BPMS.Services.Utils.go;
        this.wxConfig();
        this.getSummary = function () {
            this.loading(true);
            var task1 = BPMS.Services.getTasks({
                "candidateUser": userId,
                "active": true
            });

            var task2 = task1.then(function (result) {
                self.allTaskNumber(result.total);
				
				BPMS.Services.getTasks({
					"candidateUser": userId,
					"active": true,
					"nameLike":"%lpa%"
                }).then(function (response) {
					self.allTaskNumber(result.total - response.total);
				});

                return BPMS.Services.getTasks({
                    "assignee": userId,
                    "active": true,
                    "dueBefore": moment().format()
                });
            });

            var task3 = task2.then(function (result) {
                self.delayTaskNumber(result.total);
				
				BPMS.Services.getTasks({
                    "assignee": userId,
                    "active": true,
                    "dueBefore": moment().format(),
					"nameLike":"%lpa%"
                }).then(function (response) {
					self.delayTaskNumber(result.total - response.total);
				});
				
                return BPMS.Services.getTasks({
                    "assignee": userId,
                    "active": true
                });
            });

            var instance = task3.then(function (result) {
                self.unfinishedTaskNumber(result.total);
				
				BPMS.Services.getTasks({
                    "assignee": userId,
                    "active": true,
					"nameLike":"%lpa%"
                }).then(function (response) {
					self.unfinishedTaskNumber(result.total - response.total);
				});
				
				
                return BPMS.Services.getHistoricProcessInstances({
                    "startedBy": userId,
                    "finished": false
                });
            });

            instance.then(function (result) {
                self.processNumber(result.total);
                self.loading(false);
            }, function () {
                self.loading(false);
                self.pop("error", {
                    "title": "??????????????????",
                    "description": "????????????????????????????????????????????????"
                });
            });

        };

        this.idField = {
            id: "processSearch",
            name: "??????????????????",
            value: ko.observable(),
            controlType: "bpid",
            readable: true,
            writable: true,
            required: false,
            ignoreLabel: true,
            seq: 1,
            fieldType: "string",
            invalid: ko.observable(false),
            liveValidate: false,
            placeholder: "??????????????????"
        };
        this.deleting = {
            id: ko.observable(""),
            processId: ko.observable(""),
            name: ko.observable("")
        };
        this.onDeleteShortcut = function (data) {
            this.deleting.id(data.id);
            this.deleting.processId(data.processId);
            this.deleting.name(data.name);
            return true;
        };
        this.deleteShortcut = function () {
            var root = this;

            var id = this.deleting.id();
            if (!id) {
                return;
            }
            this.loading(true);
            BPMS.Services.deleteForm(id).then(function () {
                $.mobile.popup.active.close();
                root.loading(false);
                root.getShortcuts();
            });
        };
        this.onAddShortcut = function () {
            $("#processSearch").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden").click();
            $("#popupShortcut").popup("open");
        };
        this.getShortcuts = function () {
            var root = this;
            root.loading(true);
            root.processes.removeAll();
            var size = 1000;
            var page = 1;
            var ids = [];
            var items = [];
            var failCallback = function () {
                root.pop("error", {
                    "title": "????????????????????????",
                    "description": "??????????????????????????????????????????????????????????????????"
                });
                root.loading(false);
            };
            var filter = { type: "processShortcut", createdBy: this.user.userId };

            baseRequest = BPMS.Services.getForms({
                pagesize: size,
                page: page,
                filter: filter,
                sort: { _id: 1 }
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
                root.processes(items);
            }, failCallback);
            return baseRequest;
        };
        this.getShortcuts();

        this.addShortcut = function () {
            var root = this;
            var id = this.idField.value();
            //var name = $("#processSearch").val();
var name = $("input[name='processSearch']") .val();
            $("#processSearch").parent().removeClass("ui-invalid");
            if (!id) {
                $("#processSearch").parent().addClass("ui-invalid");
                return;
            }
            var stamp = BPMS.Services.Utils.getCurrentTimeStamp().toString();
            var item = {
                _id: stamp,
                processId: id,
                name: name,
                createdBy: this.user.userId,
                createdAt: stamp,
                updatedBy: null,
                updatedAt: null,
                type: "processShortcut",
            };
            root.loading(true);

            BPMS.Services.addUniqueForm(item).then(
                function (res) {
                    root.loading(false);
                    root.getShortcuts();
                    $.mobile.popup.active.close();
                }, function (res) {
                    root.loading(false);

                    if (res && res.errorType &&
                        res.errorType === "FileAlreadyExist") {
                        $("#processSearch").parent().addClass("ui-invalid");
                        return;
                    }

                    $.mobile.popup.active.close();
                    // root.triggerDelay({
                    //     type: "error",
                    //     title: "????????????????????????",
                    //     description: "????????????????????????, ????????????"
                    // });
                }
            );
        };

		window.detail = this;
		self.personBiUrl = ko.observable();
		
		function base64url(source) {
		  // Encode in classical base64
		  encodedSource = CryptoJS.enc.Base64.stringify(source);
		  
		  // Remove padding equal characters
		  encodedSource = encodedSource.replace(/=+$/, '');
		  
		  // Replace characters according to base64url specifications
		  encodedSource = encodedSource.replace(/\+/g, '-');
		  encodedSource = encodedSource.replace(/\//g, '_');
		  
		  return encodedSource;
		}
			
		var header = {
		  "alg": "HS256",
		  "typ": "JWT"
		};
		var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
		var encodedHeader = base64url(stringifiedHeader);
		var METABASE_SITE_URL = BPMS.config.metabaseSite;
		var secret = BPMS.config.metabaseKey;

		//??????????????????
		var personBiBody = {resource: { question: BPMS.config.personBiQuestionId },params: {"userId": BPMS.Services.Utils.getUser().userId}};
		var personBiEncodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(personBiBody)));
		var personBiJwt = encodedHeader + "." + personBiEncodedData + "." + base64url(CryptoJS.HmacSHA256((encodedHeader + "." + personBiEncodedData) , secret))
		var personBiIframeUrl = METABASE_SITE_URL + "embed/question/" + personBiJwt + "#bordered=true&titled=true";
		self.personBiUrl(personBiIframeUrl);
        // this.setDragable = function (element) {
        //     element = $(element).closest("div[chart]")[0];
        //     if (!element) {
        //         return;
        //     }
        //     var scrollElement = $(element).closest("div.charts");
        //     element.draggable = true;

        //     element.ondragstart = function (e) {
        //         e.dataTransfer.effectAllowed = 'move';
        //         e.dataTransfer.setData("index", $(element).index());
        //         e.dataTransfer.setDragImage(e.target, 0, 0);
        //         return true;
        //     };
        //     element.ondragenter = function (e) {
        //         $(element).css('opacity', '0.3');
        //     };
        //     element.ondragleave = function (e) {
        //         $(element).css('opacity', '1');
        //     };

        //     element.ondragover = function (e) {
        //         $(element).css('opacity', '0.3');
        //         e.preventDefault();
        //     };
        //     element.ondrop = function (e) {
        //         var fromIndex = e.dataTransfer.getData("index");
        //         if (!fromIndex) {
        //             return;
        //         }
        //         fromIndex = Number(fromIndex);
        //         var toIndex = $(element).index();
        //         console.log(fromIndex + " " + toIndex);
        //         $(element).css('opacity', '1');
        //         if (fromIndex === toIndex) {
        //             return;
        //         }
        //         scope.config.swap(fromIndex, toIndex);
        //     };
        //     $(element).addClass("draggable");

        //     var stop = true;
        //     $(element).on("drag", function (e) {

        //         stop = true;

        //         if (e.originalEvent.clientY < 150) {
        //             stop = false;
        //             scroll(-1)
        //         }

        //         if (e.originalEvent.clientY > ($(window).height() - 150)) {
        //             stop = false;
        //             scroll(1)
        //         }

        //     });

        //     $(".draggable").on("dragend", function (e) {
        //         stop = true;
        //     });

        //     var scroll = function (step) {
        //         var scrollY = $(scrollElement).scrollTop();
        //         $(scrollElement).scrollTop(scrollY + step);
        //         if (!stop) {
        //             setTimeout(function () { scroll(step) }, 20);
        //         }
        //     }
        // };
    };
    BPMS.ViewModels.IndexViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, jQuery, ko);