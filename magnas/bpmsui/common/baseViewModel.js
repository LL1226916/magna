(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.Services.Utils.adjustDevice();
    if ($.mobile) {
        $.mobile.popup.prototype.options.history = false;

    }
    BPMS.ViewModels.BaseViewModel = function () {
        this.user = BPMS.Services.Utils.getUser();
        var that = this;
        this.isCordova = typeof (cordova) !== "undefined";
        this.language = ko.observable(localStorage.getItem("bpms_language") || "zh");
        this.selectLanguage = function (language) {
            this.language(language);
            localStorage.setItem("bpms_language", language);
            BPMS.Services.Utils.switchLanguage();
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
        };
        this.tab = ko.observable("");
        this.tab.subscribe(function (newType) {
            if (!newType) {
                return;
            }
            var target = $("#" + newType + "-tab");
            if (target.closest("li").hasClass("active")) {
                return;
            }
            target.click();
        }, null, "change");
        this.switchTab = function (vm, e) {
            var a = $(e.target).closest("a");
            var tempType = a.attr("id").replace("-tab", "");
            vm.tab(tempType);
        };

        this.ensureLogin = function () {
            that._dfd = $.Deferred();

            var valid = false;
            this.user = BPMS.Services.Utils.getUser();
            that.origionalUser = this.user && this.user.userId;
            if (this.user && this.user.lastLogin) {
                var duration = +moment() - this.user.lastLogin;
                var activeDuration = BPMS.config.activeTime * 1000 * 60;
                if (duration < activeDuration) {
                    valid = true;
                }
            }
            if (valid) {
                that.updateLastLogin();
                that._dfd.resolve();
            } else {
                that.timeoutKey = setTimeout(function () {
                    if (that.timeoutKey) {
                        clearTimeout(that.timeoutKey);
                    }
                    that.switchUserName(that.user.userId);
                    that.pop("login", {});
                }, 0);
            }
            return that._dfd.promise();
        };
        this.secureExecute = function () {
            var action = this[arguments[0]];
            var root = this;
            var params = Array.prototype.splice.call(arguments, 1);
            var method = function () {
                action.apply(root, params);
            };
            this.ensureLogin().then(method);
        };

        this.checkTimeout = function () {
            var valid = false;
            this.user = BPMS.Services.Utils.getUser();
            if (this.user && this.user.lastLogin) {
                var duration = +moment() - this.user.lastLogin;
                var activeDuration = BPMS.config.activeTime * 1000 * 60;
                if (duration < activeDuration) {
                    valid = true;
                }
            }
            if (!valid) {
                that.pop("login", {});
            }

            return valid;
        };
        this.updateLastLogin = function () {
            var user = BPMS.Services.Utils.getUser();
            if (user) {
                user.lastLogin = +moment();
                sessionStorage.setItem("bpms_user", JSON.stringify(user));
            }
        };

        this.popAttachments = ko.observableArray();
        this.popTitle = ko.observable("");
        this.popDescription = ko.observable("");
        this.popDetail = ko.observable("");
        this.popCode = ko.observable("");
        this.switchUserName = ko.observable("");
        this.switchPassword = ko.observable("");
        this.switchUserNameInvalid = ko.observable(false);
        this.switchPasswordInvalid = ko.observable(false);
        var loader = $.mobile.loading();

        this.logout = function () {
            sessionStorage.removeItem("bpms_token");
            sessionStorage.removeItem("bpms_user");
            sessionStorage.removeItem("Bearer");
            window.location.href = "login.html";
        };
        this.loading = function (isLoading) {
            if (isLoading) {
                loader.show();
            }
            else {
                loader.hide();
            }
        };
        var dialogs = {
            "error": "<div data-role=\"popup\" data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:300px; max-width:300px; background-color:#ffffff\">" +
                "<div data-role=\"content\" style=\"padding: 9px 9px;\">" +
                "<p align=\"center\" style=\"margin:8px 8px; margin-bottom:24px;\"><font color=\"#C62828\"><i class=\"fad fa-3x fa-times-circle\"></i></font></p>" +

                "<p align=\"left\" data-bind=\"visible:!!popTitle()\" style=\"padding: 0px 3px; margin-bottom: 3px;\">" +
                "<b data-bind=\"text:popTitle\"></b></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popDescription()\" style=\"padding: 0px 3px; margin-bottom: 24px;\">" +
                "<font color=\"#000000\" size=\"-1\" data-bind=\"text:popDescription\"></font></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popDetail()\" style=\"padding: 0px 3px; margin-bottom: 0px;\">" +
                "<font color=\"#9e9e9e\" size=\"-2\" data-bind=\"text:popDetail\"></font></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popCode()\" style=\"padding: 0px 3px; margin-bottom: 32px;\">" +
                "<font color=\"#9e9e9e\" size=\"-2\" data-bind=\"text:popCode\"></font></p>" +
                "<p style=\"padding: 0px 0px; margin-bottom:0px\"> <a href=\"javascript:void(0);\" data-bind=\"click:closePop\" class=\"ui-btn  ui-corner-all ui-btn-b\" style=\"background-color: #37474f; color:#fff; text-shadow: 0 1px 0 #111; margin: 0px 0px\">确认</a> </p>" +
                "</div>" +
                "</div>",
            "warning": "<div data-role=\"popup\" data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:300px; max-width:300px; background-image:url(images/tweets-bg.jpg)\">" +
                "<div data-role=\"content\" style=\"padding: 4px 4px;\">" +
                "<p align=\"center\" style=\"margin:8px 8px;\"><font color=\"#FF9800\"><i class=\"fa fa-2x fa-warning\"></i></font></p>" +
                "<hr style=\"border-color: #FF9800; margin-bottom: 0px; margin-top:11px;\">" +
                "<p align=\"left\" style=\"padding: 0px 3px; margin-bottom: 32px;\" data-bind=\"visible:!!popCode(),text:popDescription\"></p>" +
                "<p style=\"padding: 0px 0px;\"> <a href=\"javascript:void(0);\" data-bind=\"click:closePop\" class=\"ui-btn ui-corner-all ui-btn-b\" style=\"background-color: #424242; color:#fff; text-shadow: 0 1px 0 #111; margin: 0px 0px\">确认</a> </p>" +
                "</div>" +
                "</div>",
            "success": "<div data-role=\"popup\" data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:300px; max-width:300px; background-color:#ffffff\">" +
                "<div data-role=\"content\" style=\"padding: 9px 9px; padding-bottom:2px\">" +
                "<p align=\"center\" style=\"margin:8px 8px; margin-top:16px; margin-bottom:24px\"><font color=\"#4CAF50\"><i class=\"fad fa-3x fa-check-circle\"></i></font></p>" +

                "<p align=\"left\"  data-bind=\"visible:!!popTitle()\"  style=\"padding: 0px 3px; margin-bottom: 0px;\">" +
                "<b data-bind=\"text:popTitle\"></b></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popDescription()\" style=\"padding: 0px 3px; margin-bottom: 24px;\">" +
                "<font color=\"#424242\" size=\"-1\" data-bind=\"text:popDescription\"></font></p>" +
                "<p align=\"left\" data-bind=\"visible:!!popDetail()\" style=\"padding: 0px 3px; margin-bottom: 32px;\">" +
                "<font color=\"#757575\" size=\"-1\" data-bind=\"text:popDetail\"></font>" +
                "</p>" +
                "<p style=\"padding: 0px 0px;\"> <a  href=\"javascript:void(0);\" data-bind=\"click:closePop\"  class=\"ui-btn  ui-corner-all ui-btn-b\" style=\"background-color: #37474f; color:#fff; text-shadow: 0 1px 0 #111; margin: 0px 0px\">确认</a> </p>" +
                "</div>" +
                "</div>",
            "info": "<div data-role=\"popup\"  data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:320px; max-width:320px; background-color:#ffffff\">" +
                "<div data-role=\"content\" style=\"padding: 9px 9px; padding-bottom:0px\">" +
                "<p align=\"center\" style=\"margin:8px 8px; margin-top:16px; margin-bottom:24px\"><font color=\"#607D8B\"><i class=\"fad fa-3x fa-info-circle\"></i></font></p>" +

                "<p align=\"left\" style=\"padding: 0px 3px; margin-bottom: 3px;\" data-bind=\"visible:!!popTitle(),text:popTitle\"></p>" +

                "<p align=\"left\" style=\"padding: 0px 3px; margin-bottom: 3px;\" data-bind=\"visible:!!popDetail(),html:popDetail\"></p>" +
                // "<p align=\"left\" style=\"padding: 0px 3px; margin-bottom: 3px;\" data-bind=\"visible:!!popDetail(),text:popDetail\"></p>" +

                "<p align=\"left\" style=\"padding: 0px 3px; margin-bottom: 32px;\" data-bind=\"visible:!!popDescription(),text:popDescription\"></p>" +
                "<p style=\"padding: 0px 0px;\"> <a  href=\"javascript:void(0);\" data-bind=\"click:closePop\"  class=\"ui-btn  ui-corner-all ui-btn-b\" style=\"background-color: #424242; color:#fff; text-shadow: 0 1px 0 #111; margin: 0px 0px\">确认</a> </p>" +
                "</div>" +
                "</div>",
            "image": "<div data-role=\"popup\" data-overlay-theme=\"a\" data-theme=\"b\">" +
                "<a href=\"javascript:void(0);\" data-bind=\"click:closePop\" " +
                "class=\"ui-btn ui-nodisc-icon ui-alt-icon ui-shadow ui-corner-all ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right ui-btn-inline\">Close</a>" +
                "<img class=\"popphoto\">" +
                "</div>",
            //"style=\"max-height:512px;\"
            "login": "<div data-role=\"popup\" data-history=\"false\"   data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:300px; max-width:300px; background-image:url(images/tweets-bg.jpg)\"><a href=\"javascript:void(0)\" data-rel=\"back\" class=\"ui-btn ui-nodisc-icon ui-alt-icon ui-corner-all ui-shadow ui-btn-b ui-icon-delete ui-btn-icon-notext ui-btn-right\" data-bind=\"click:closePop\">Close</a>" +
                "<div data-role=\"content\" style=\"padding: 4px 4px;\">" +
                "<p align=\"center\" style=\"margin:8px 8px;\"><font color=\"#EC407A\"><i class=\"fa fa-3x fa-sign-in\"></i></font><br>" +
                "<font size=\"-1\" color=\"gray\">身份验证</font></p>" +
                "<p align=\"center\" style=\"padding: 8px 8px; padding-bottom:0px;\">" +
                "<input type=\"text\" id=\"switchUserName\" name=\"switchUserName\" data-theme=\"b\" data-clear-btn=\"false\" data-bind=\"disable:true,value:switchUserName\"  placeholder=\"用户名\" >" +
                "<input type=\"password\"  id=\"switchPassword\" name=\"switchPassword\" data-theme=\"b\" data-clear-btn=\"true\"  data-bind=\"value:switchPassword,event:{keydown:keydownLogin}\"  placeholder=\"密码\">" +
                "</p>" +
                "<p align=\"center\" style=\"padding: 8px 8px; padding-bottom:0px;\">" +
                "<button type=\"submit\" id=\"btnReLogin\" data-bind=\"click:reLogin\"  class=\"ui-btn ui-corner-all ui-btn-b\" style=\"background-color:#424242; color:#fff; text-shadow: 0 1px 0 #111\">登录</button>" +
                "</p>" +
                "</div>" +
                "</div>",
            "fullText": "<div data-role=\"popup\" class=\"ui-content\" data-theme=\"a\" style=\"min-width:220px; max-width:320;\">" +
                "<p data-bind=\"html:popDescription\"></p>" +
                "</div>",
            "confirm": "<div data-role=\"popup\"  data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:300px; max-width:300px; background-image:url(images/tweets-bg.jpg)\">" +
                "<div data-role=\"content\" style=\"padding: 9px 9px;\">" +
                "<p align=\"center\" style=\"margin:8px 8px; margin-bottom:24px\"><font color=\"#607D8B\"><i class=\"fad fa-3x fa-info-circle\"></i></font></p>" +
                "<hr style=\"border-color: #607D8B; margin-bottom: 0px; margin-top:11px;\">" +
                "<p align=\"left\" style=\"padding: 0px 3px; margin-bottom: 24px;\"> <b><font color=\"#9e9e9e\" data-bind=\"text:popTitle\"></font></b> </p>" +
                "<p data-bind=\"visible:!!popCode()\" align=\"left\" style=\"padding: 0px 3px; margin-bottom: 6px;\"> <span data-bind=\"text:popCode\"></span></p>" +
                "<p data-bind=\"visible:!!popDetail()\" align=\"left\" style=\"padding: 0px 3px; margin-bottom: 6px;\"> <span data-bind=\"text:popDetail\"></span></p>" +
                "<p data-bind=\"visible:!!popDescription()\" align=\"left\" style=\"padding: 0px 3px; margin-bottom: 16px;\"> <span  data-bind=\"text:popDescription\"></span></p>" +
                "<div class=\"ui-grid-a\" style=\"margin-top:32px\">" +
                "<div class=\"ui-block-a\"><a href=\"javascript:void(0);\" data-bind=\"click:closePop\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b \"  style=\"background-color: #4caf50; color:#fff;  margin-left:2px\"><i class=\"fad fa-fw fa-check\" style=\"margin-right:12px\"></i><span data-i18n=\"confirm\">确认</span></a></div>" +
                "<div class=\"ui-block-b\"><a href=\"javascript:void(0);\" data-bind=\"click:cancelPop\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b\"  style=\"margin-right:2px;\"><i class=\"far fa-fw fa-times\" style=\"margin-right:12px\"></i><span data-i18n=\"close\">取消</span></a></div>" +
                "</div>" +
                "</div>" +
                "</div>",
            "confirmTask": "<div data-role=\"popup\"  data-dismissible=\"false\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\" style=\"min-width:320px; max-width:320px; background-color:#ffffff\">" +
                "<div data-role=\"content\" style=\"padding: 9px 9px; padding-bottom:2px\">" +
                "<p align=\"center\" style=\"margin:8px 8px; margin-bottom:24px\"><font color=\"#607D8B\"><i class=\"fad fa-3x fa-info-circle\"></i></font></p>" +

                "<p align=\"left\" style=\"padding: 0px 3px; margin-bottom: 12px;\"> <font color=\"#607d8b\" data-bind=\"text:popTitle\"></font> </p>" +
                "<p data-bind=\"visible:!!popCode()\" align=\"left\" style=\"padding: 0px 3px; margin-bottom: 0px; font-weight:300\"> <span data-bind=\"text:getCoreResult(popCode())[0]\"></span>: <b data-bind=\"text:getCoreResult(popCode())[1]\"></b> </p>" +
                "<p data-bind=\"visible:!!popDetail()\" align=\"left\" style=\"padding: 0px 3px; margin-bottom: 0px; font-weight:300\"> <span data-bind=\"text:getCoreResult(popDetail())[0]\"></span>: <b data-bind=\"text:getCoreResult(popDetail())[1]\"></b> </p>" +
                "<p data-bind=\"visible:!!popDescription()\" align=\"left\" style=\"padding: 0px 3px; margin-bottom: 16px; font-weight:300\"> <span  data-bind=\"text:getCoreResult(popDescription())[0]\"></span>: <b data-bind=\"html:getCoreResult(popDescription())[1]\"></b></p>" +
                "<div class=\"ui-grid-a\" style=\"margin-top:32px\">" +
                "<div class=\"ui-block-a\"><a href=\"javascript:void(0);\" data-bind=\"click:closePop\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b \"  style=\"background-color: #37474f; color:#fff; text-shadow: 0 1px 0 #616161; margin-left:2px\"><i class=\"fad fa-fw fa-check\" style=\"margin-right:12px\"></i><span data-i18n=\"confirm\">确认</span></a></div>" +
                "<div class=\"ui-block-b\"><a href=\"javascript:void(0);\" data-bind=\"click:cancelPop\" class=\"ui-btn ui-corner-all ui-shadow  ui-btn-b \"  style=\"background-color: #eceff1; margin-right:2px;\"><i class=\"far fa-fw fa-times\" style=\"margin-right:12px\"></i><span data-i18n=\"close\">取消</span></a></div>" +
                "</div>" +
                "</div>" +
                "</div>",
            "attachments": "<div data-role=\"popup\" data-theme=\"b\" data-overlay-theme=\"a\" style=\"border:none\">" +
                "<ul data-role=\"listview\" data-bind=\"jqmTemplate: { name: 'attachmentInPop', foreach: popAttachments }, jqmRefreshList:  popAttachments\" data-inset=\"true\" style=\"min-width:320px; border:none\">" +
                "</ul>" +
                "</div>",
            "attachmentInPop": "<script type=\"text/html\" id=\"attachmentInPop\">" +
                "<!-- ko if: $index() === 0-->" +
                "<li data-role=\"list-divider\" style=\"border:none; padding:14px 14px; background-color:#ffffff; color:#000000; text-shadow: none; font-weight:200\">" +
                "<i class=\"far fa-fw fa-file-search\"></i>&nbsp;<span data-i18n=\"documents\">附件</span>" +
                "</li>" +
                "<!-- /ko -->" +
                "<!-- ko if: $index() > 0 -->" +
                "<li class=\"ui-alt-icon ui-nodisc-icon\" data-bind=\"click:function(){$root.secureExecute('download',$data)}\" data-icon=\"arrow-d\">" +
                "<a href=\"javascript:void(0);\" style=\"border-width:0px\"><font color=\"#03a9f4\">" +
                "<i class=\"far fa-file-import\"></i></font>&nbsp;<span data-bind=\"text:name\"></span>" +
                "<p style=\"margin-bottom:0px;\"><font color=\"gray\" data-bind=\"text:size\"></font></p>" +
                "</a>" +
                "</li>" +
                "<!-- /ko -->" +
                "</script>",

            "scan": "<div data-role=\"popup\"  data-dismissible=\"true\" data-theme=\"b\" data-overlay-theme=\"a\" class=\"ui-corner-all\"   style=\"min-width:300px; max-width:300px; \">" +
                "<div data-role=\"content\" style=\"padding: 4px 4px;\">" +
                "<p align=\"center\" style=\"margin:16px 16px;\"><font color=\"#b0bec5\"><i class=\"fad fa-3x fa-do-not-enter\"></i></font></p>" +
                "<p align=\"center\" style=\"padding: 0px 3px; margin-top: 32px; margin-bottom: 32px; color: #607d8b\">" +
                "抱歉，您所扫描信息<br>" +
                "未包含任何<b>buisnez BPM</b>应用</p>" +
                "<p style=\"padding: 0px 0px; margin-bottom:0px\"> <a  href=\"javascript:void(0);\" data-bind=\"click:closePop\" class=\"ui-btn  ui-corner-all ui-btn-b\" style=\"background-color: #546e7a; color:#fff; text-shadow: 0 1px 0 #111; margin: 0px 0px\">OK</a></p>" +
                "</div>" +
                "</div>"



        };

        this.download = function (item) {
            var path;
            if (item.path) {
                if (item.path.indexOf("http") === 0 || item.path.indexOf("\\") === 0) {
                    path = item.path;
                } else {
                    path = BPMS.config.attachmentUrl + "download" + (item.path.indexOf("/") === 0 ? "" : "/") + item.path;
                }
            } else {
                path = item.links && item.links[0] && item.links[0].href;
            }
            var option = "location=no,enableViewportScale=yes";
            if (this.isCordova && cordova.InAppBrowser && cordova.InAppBrowser.open) {
                cordova.InAppBrowser.open(path, "_blank", option);
            } else {
                //window.open(path, "_blank");
				window.open(encodeURI(path), "_blank");
            }
        };

        this.dialogCallback = null;
        this.getCoreResult = function (coreInfo) {
            var index = -1;
            if (coreInfo) {
                index = coreInfo.indexOf(":");
            }
            if (index >= 0) {
                return [coreInfo.substring(0, index), coreInfo.substring(index + 1)];
            }
            return ["", ""];

        };
        this.popLogin = function (options) {
            var type = "login";
            options = options || {};

            that.popType = type;
            var html = dialogs[type];
            that.currentPop = $(html);
            that.timeoutKey = setTimeout(function () {
                that.currentPop.popup();
                that.currentPop.popup("open");
                $("#switchUserName").textinput().textinput("refresh");
                $("#switchPassword").textinput().textinput("refresh");
                if (that.timeoutKey) {
                    clearTimeout(that.timeoutKey);
                }
                ko.applyBindings(that, that.currentPop[0]);
                that.currentPop.on("popupafterclose", function () {
                    if (typeof (that.loginCode) !== "undefined") {
                        if (that.currentPop) {
                            that.currentPop.remove();
                            that.currentPop = null;
                        }
                        that.pop("error", {
                            "title": "登陆失败",
                            "description": (BPMS.Services.loginError ? "您输入的登陆信息不正确" : "网络异常"),
                            "detail": "请至登陆界面重新登陆",
                            "code": that.loginCode,
                            "callback": that.logout
                        });
                        //that.loginCode = undefined;
                    }

                });


            }, 0);

        };
        this.popImage = function (options) {
            var type = "image";

            options = options || {};

            that.popType = type;
            var html = dialogs[type];

            var i = new Image();
            i.src = options.src;
            i.onload = function () {
                html = html.replace("<img", ("<img src=\"" + (options.src || "") + "\""));
                that.currentPop = $(html);
                //that.currentPop.find("img").attr("src", options.src);
                that.dialogCallback = options.callback;
                that.currentPop.popup({
                    positionTo: "window"
                }).popup("open");
                ko.applyBindings(that, that.currentPop[0]);
            };
        };

        this.pop = function (type, options) {
            if (type === "image") {
                this.popImage(options);
                return;
            }
            if (type === "login") {
                this.popLogin(options);
                return;
            }
            if (type === "attachments" &&
                !(options && options.attachments && ko.unwrap(options.attachments).length)) {
                return;
            }
            if (that.currentPop) {
                that.currentPop.remove();
                that.currentPop = null;
            }

            options = options || {};

            that.popType = type;
            var html = dialogs[type];
            that.currentPop = $(html);
            var popParams = (options && options.positionTo ? {
                positionTo: options.positionTo
            } : null);
            if (popParams === null && typeof (options.history) !== "undefined") {
                popParams = {
                    "history": options.history
                };
            }
            that.currentPop.popup(popParams);
            that.dialogCallback = options.callback;
            var attachments = [{}].concat(options && ko.unwrap(options.attachments) || []);
            that.popAttachments(attachments);
            if (!$("#attachmentInPop").length) {
                $("body").append(dialogs.attachmentInPop);
            }

            var title = options && options.title || "";
            that.popTitle(title);
            var desc = options && options.description || "";
            that.popDescription(desc);
            var detail = options && options.detail || "";

            that.popDetail(detail);
            var code = options && options.code || "";
            that.popCode(code);
            ko.applyBindings(that, that.currentPop[0]);
            that.currentPop.popup("open");

        };
        that.currentPop = null;
        that.popType = "";
        this._cancelPop = function () {
            that.popTitle("");
            that.popDescription("");
            that.popDetail("");
            that.popCode("");
            that.currentPop.popup("close").remove();
            that.currentPop = null;
        };
        this.cancelPop = function () {
            if (!that.currentPop) return;
            that._cancelPop();
            that.dialogCallback = null;
        };
        this.closePop = function () {
            if (!that.currentPop) return;

            var result = that.dialogCallback && that.dialogCallback();
            if (result && result.then) {
                result.then(function () {
                    that.dialogCallback = null;
                    that.popTitle("");
                    that.popDescription("");
                    that.popDetail("");
                    that.popCode("");
                    var curr = that.currentPop;
                    curr.popup("close");
                    //curr.remove();
                });
            } else if (result === false) {
                return false;
            } else {
                that.cancelPop();
            }
        };
        this.delayPop = function (type, options) {
            var targetPop = $("#pop" + type);
            if (targetPop.length) {
                if (options) {
                    targetPop = targetPop.popup(options);
                }
                targetPop.popup("open");
            } else {
                that.pop(type, options);
                targetPop = that.currentPop;
            }
            var listenPop = function () {
                if (that.delayObject && typeof (that.delayObject) === "object") {
                    that.pop(that.delayObject.type, that.delayObject);
                    that.delayObject = "";
                    if (that.isContinue) {
                        $.mobile.popup.active.element.on("popupafterclose", listenPop);
                    }
                }
                else if (that.delayObject && typeof (that.delayObject) === "string") {
                    $("#pop" + that.delayObject).popup("open");
                    that.delayObject = "";
                    if (that.isContinue) {
                        $.mobile.popup.active.element.on("popupafterclose", listenPop);
                    }
                }
            }
            targetPop.on("popupafterclose", listenPop);
        };
        this.triggerDelay = function (type, isContinue) {
            that.delayObject = type;
            that.isContinue = isContinue;
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
        };
        this.clearHash = function () {
            if (location.hash) {
                window.location.href = window.location.href.replace(location.hash, "");
            }
        };
        this.keydownLogin = function (viewModel, event) {
            var element = $(document.activeElement);
            if (event.keyCode === 13 && element.attr("id") === "switchPassword") {
                viewModel.switchUserName($("#switchUserName").val());
                viewModel.switchPassword($("#switchPassword").val());
                element.closest("div[data-role='content']").find("button[type='submit']").first().click();
                return false;
            }
            return true;
        };
        this.reLogin = function () {
            var invalid = false;
            ["switchUserName", "switchPassword"].forEach(function (fieldName) {
                var fieldInvalid = !that[fieldName]();
                that[fieldName + "Invalid"](fieldInvalid);
                var tag = $("#" + fieldName).parent();
                if (fieldInvalid) {
                    invalid = true;
                    tag.addClass("ui-invalid");
                } else {
                    tag.removeClass("ui-invalid");
                }
            });
            if (invalid)
                return;
            that.loginCode = undefined;
            that.loading(true);
            var userName = that.switchUserName();
            var password = that.switchPassword();
            var userNameType = BPMS.config.userNameType || 1;
            if (userNameType == 2) {
                userName = userName.toLowerCase();
            } else if (userNameType == 3) {
                userName = userName.toUpperCase();
            }
            BPMS.Services.login(userName, password)
                .then(function (data) {
                    var token = BPMS.Services.Utils.getAuthToken(userName, password);
                    sessionStorage.setItem("bpms_token", token);
                    return BPMS.Services.getTasks();
                }, function (err) {
                    sessionStorage.removeItem("bpms_token");
                    var code = "";
                    if (err && err.status && err.statusText) {
                        code = "错误代码：" + err.status + " " + err.statusText;
                    }
                    that.loginCode = code;
                    that.loading(false);
                    that.currentPop.popup("close");
                    if (that._dfd) {
                        that._dfd.reject();
                    }
                    //that.currentPop.remove();
                    //that.currentPop = null;

                })
                .then(function (data) {
                    that.currentPop.popup("close");
                    that.loading(false);
                    var currentUser = BPMS.Services.Utils.getUser().userId;
                    if (that.origionalUser && that.origionalUser == currentUser) {
                        if (that._dfd) {
                            that._dfd.resolve();
                        }
                    } else {
                        window.location.href = "index.html";
                    }
                }, function (err) {
                    that.loading(false);
                    if (typeof (that.loginCode) !== "undefined") return;
                    if (that._dfd)
                        that._dfd.reject();
                    sessionStorage.removeItem("bpms_token");
                    var code = "";
                    if (err && err.status && err.statusText)
                        code = "错误代码：" + err.status + " " + err.statusText;
                    that.loginCode = code;
                    that.currentPop.popup("close");
                    //that.currentPop.remove();
                    //that.currentPop = null;
                });
        };
        this.scan = function () {
            var onSuccess = function (s) {
                var isValid = false;
                BPMS.config.redirectList.forEach(function (allowUrl) {
                    var encodedAllow = allowUrl;
                    var reg = new RegExp("^" + encodedAllow + ".*", "i");
                    var matches = reg.exec(s);
                    if (matches && matches.length) {
                        isValid = true;
                    }
                });

                if (isValid) {
                    window.location.href = s;
                    return;
                }
                var matches = /BPTINS\.(.*)/i.exec(s);
                if (matches && matches.length) {
                    var targetUrl = "task_list.html?" + $.param({ processInstanceId: matches[1] });
                    window.location.href = targetUrl;
                    return;
                }

                matches = /BPTNM\.(.*)/i.exec(s);
                if (matches && matches.length) {
                    var targetUrl = "task_list.html?" + $.param({ nameLike: matches[1] });
                    window.location.href = targetUrl;
                    return;
                }

                matches = /BPPDF\.(.*)/i.exec(s);
                if (matches && matches.length) {
                    var id = /BPPDF\.([\u4e00-\u9fa5_a-zA-Z0-9\/\-:]*)/i.exec(s)[1];
                    var key = "";
                    var keyMatches = /BK\.([\u4e00-\u9fa5_a-zA-Z0-9\/\-:]*)/i.exec(s);
                    if (keyMatches && keyMatches.length) {
                        key = keyMatches[1];
                    }
                    var targetUrl = "process_create.html?" + $.param({
                        processDefinitionId: id,
                        businessKey: key
                    });
                    window.location.href = targetUrl;
                    return;
                }
                that.pop("scan");
            }
            if (typeof (wx) !== "undefined" && that.wxReady()) {
                wx.scanQRCode({
                    desc: "扫描",
                    needResult: 1,
                    scanType: ["qrCode", "barCode"],
                    success: function (res) {
                        onSuccess(res.resultStr);
                    },
                    error: function () {
                    }
                });
            }

        };
        this.wxReady = ko.observable(false);
        this.wxConfig = function (fnSuccess, fnError) {

            if (typeof (wx) === "undefined" || that.wxReady()) {
                return;
            }
            var param = {};

            param.timestamp = moment().format("X");
            param.nonceStr = Math.random().toString(36).substr(2);
            BPMS.Services.getAccessToken().then(function (data) {
                if (data.access_token) {
                    param.token = data.access_token;
                    return BPMS.Services.getTicket(param.token);
                }
            }).then(function (data) {
                if (data.ticket) {
                    param.ticket = data.ticket;
                    var s = "jsapi_ticket=" + param.ticket
                        + "&noncestr=" + param.nonceStr
                        + "&timestamp=" + param.timestamp
                        + "&url=" + location.href.split("#")[0];

                    return BPMS.Services.sign(s);
                }
            }).then(function (result) {
                wx.config({
                    beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: BPMS.config.corpId, // 必填，企业微信的corpID
                    timestamp: param.timestamp,
                    nonceStr: param.nonceStr,
                    signature: result.signature,// 必填，签名，见附录1
                    jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {
                    that.wxReady(true);
                    if (fnSuccess) {
                        fnSuccess();
                    }
                });

                wx.error(function () {
                    that.wxReady(false);
                    if (fnError) {
                        fnError();
                    }
                });

            });
        };
    };
})(window.BPMS = window.BPMS || {}, jQuery, ko);
