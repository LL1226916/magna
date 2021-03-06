(function (BPMS, $, ko) {

    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.LoginViewModel = function () {
        var self = this;
        self.userName = ko.observable("");
        self.password = ko.observable("");
        self.message = ko.observable("");
        self.errorCode = ko.observable("");

        var uid = BPMS.Services.Utils.getUrlParam(window.location.href, "uid");
        self.uid = uid && uid.trim();
        if (self.uid) {
            self.userName(self.uid);
        }
        self.keyDownHandler = function (e) {
            var ev = document.all ? window.event : e;
            var element = $(document.activeElement);
            if (ev.keyCode === 13 && element.attr("name") === "password") {
                self.userName($("#userName").val());
                self.password(element.val());
                element.closest(".jqm-block-content").find("button[type='submit']").first().click();
            }
        };

        self.login = function () {
            var userName = self.userName();
            var password = self.password();
            var stopLogin = false;
            ["userName", "password"].forEach(
                function (key) {
                    var text = self[key]();
                    var invalid = !text;
                    var $e = $("input[name='" + key + "']").parent();
                    if (invalid) {
                        $e.addClass("ui-invalid");
                    }
                    else {
                        $e.removeClass("ui-invalid");
                    }
                    stopLogin = stopLogin || invalid;
                }
            );
            if (stopLogin) {
                self.message(self.uid ? "请输入有效的密码" : "请输入有效的用户名和密码");
                $("#popupInvalid").popup("open");
                return;
            }
            var loader = $.mobile.loading();
            loader.show();
            var hasError = false;
            var userNameType = entrance.config.userNameType || 1;
            if (userNameType === 2) {
                userName = userName.toLowerCase();
            } else if (userNameType === 3) {
                userName = userName.toUpperCase();
            }
            entrance.service.login(userName, password)
                .then(function (data) {
                    var token = BPMS.Services.Utils.getAuthToken(userName, password);
                    sessionStorage.setItem("bpms_token", token);
                    return entrance.service.getTasks();

                }, function (err) {
                    sessionStorage.removeItem("bpms_token");
                    var message =  entrance.service.loginError ? "您输入的登陆信息不正确" : "网络异常";
                    self.message(message);
                    if (err && err.status && err.statusText) {
                        self.errorCode("错误代码：" + err.status + " " + err.statusText);
                    }
                    $("#popupMessage").popup("open");
                    hasError = true;
                    loader.hide();

                })
                .then(function (data) {
                    loader.hide();
                    var target = BPMS.Services.Utils.getUrlParam(window.location.href, "target") || "dock_management.html";
                    window.location.replace(target);
                }, function () {
                    loader.hide();
                    if (hasError) {
                        return;
                    }
                    sessionStorage.removeItem("bpms_token");
                    self.message("获取任务失败");
                    $("#popupMessage").popup("open");
                });
        };

        self.startWechatLogin = function () {
            var url = "login_bridge.html";
            var target = BPMS.Services.Utils.getUrlParam(window.location.href, "target");
            if (target) {
                url += "?target=" + target;
            }
            window.location.href = url;
        };
    };

})(window.BPMS = window.BPMS || {}, jQuery, ko);

//ui-input-text ui-body-b ui-corner-all ui-shadow-inset ui-input-has-clear ui-focus