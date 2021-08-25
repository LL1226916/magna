(function (BPMS, $, ko) {

    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.LoginViewModel = function () {
        var self = this;
        self.userName = ko.observable(localStorage.getItem("userName") || "");
        self.password = ko.observable(localStorage.getItem("password") || "");
        self.message = ko.observable("");
        self.errorCode = ko.observable("");
        self.language = ko.observable(localStorage.getItem("bpms_language") || "");
        self.selectLanguage = function (language) {
            self.language(language);
            localStorage.setItem("bpms_language", language);
            BPMS.Services.Utils.switchLanguage();
            self.startWechatLogin();
        };
		
		self.remberMe = function () {
            localStorage.setItem("userName", self.userName());
			localStorage.setItem("password", self.password());
        };
        var uid = BPMS.Services.Utils.getUrlParam(window.location.href, "uid");
        var sUser = sessionStorage.getItem("wechat_user");
        self.wechatUser = sUser ? JSON.parse(sUser) : null;
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
                element.closest(".jqm-block-content").find("a.ui-btn.ui-corner-all.ui-btn-b").first().click();
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
            var userNameType = BPMS.config.userNameType || 1;
            if (userNameType === 2) {
                userName = userName.toLowerCase();
            } else if (userNameType === 3) {
                userName = userName.toUpperCase();
            }
            BPMS.Services.login(userName, password)
                .then(function (data) {
                    var token = BPMS.Services.Utils.getAuthToken(userName, password);
                    sessionStorage.setItem("bpms_token", token);
					sessionStorage.setItem("token", token);
                    return BPMS.Services.getTasks();

                }, function (err) {
                    sessionStorage.removeItem("bpms_token");
                    sessionStorage.removeItem("token");
					
                    var message = BPMS.Services.loginError ? "您输入的登陆信息不正确" : "您输入的登陆信息不正确";
                    self.message(message);
                    if (err && err.status && err.statusText) {
                        self.errorCode("错误代码：" + err.status + " " + err.statusText);
                    }
                    $("#popupMessage").popup("open");
                    hasError = true;
                    loader.hide();
                })
                .then(function (data) {
					if(BPMS.Services.loginError){
						sessionStorage.removeItem("bpms_token");
						sessionStorage.removeItem("token");
						self.errorCode("您的密码已过期，请点击“密码自助修改”按钮修改您的密码" );
						$("#popupMessage").popup("open");
						hasError = true;
						loader.hide();
						return
					}

					localStorage.setItem("userName", self.userName());
					localStorage.setItem("password", self.password());
                    loader.hide();
                    var target = BPMS.Services.Utils.getUrlParam(window.location.href, "target") || "index.html";
                    window.location.replace(target);
                }, function () {
                    loader.hide();
                    if (hasError) {
                        return;
                    }
                    sessionStorage.removeItem("bpms_token");
                    sessionStorage.removeItem("token");
                    self.message("获取任务失败");
                    $("#popupMessage").popup("open");
                });
        };

        self.startWechatLogin = function () {
            if (!!self.language() &&
                !self.uid &&
                !self.wechatUser &&
                BPMS.Services.Utils.isWeChat()) {
                var url = "login_bridge.html";

                var target = BPMS.Services.Utils.getUrlParam(window.location.href, "target");
                if (target) {
                    url += "?" + $.param({ target: target });

                }

                window.location.href = url;
            }
        };

        self.startUidLogin = function () {
            if (!!self.language() &&
                !self.uid &&
                self.wechatUser &&
                BPMS.Services.Utils.isWeChat()) {
                var url = "login_bridge.html";
                var target = BPMS.Services.Utils.getUrlParam(window.location.href, "target");
                if (target) {
                    url += "?" + $.param({ target: target });
                }
                window.location.href = url;
            }
        };

        self.startWechatLogin();

    };

})(window.BPMS = window.BPMS || {}, jQuery, ko);

//ui-input-text ui-body-b ui-corner-all ui-shadow-inset ui-input-has-clear ui-focus