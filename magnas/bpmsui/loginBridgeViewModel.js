(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.LoginBridgeViewModel = function () {
        var self = this;
        var loginServer = BPMS.config.attachmentUrl;
        self.userName = ko.observable("");
        self.password = ko.observable("");
        self.code = ko.observable("");
        self.text = ko.observable("");
        self.state = ko.observable("");
        self.token = ko.observable("");
        self.message = ko.observable("");
        self.errorCode = ko.observable("");
        //100002 168918
        self.login = function (userName, password) {
            var dfd = $.Deferred();

            var userNameType = BPMS.config.userNameType || 1;
            if (userNameType === 2) {
                userName = userName.toLowerCase();
            } else if (userNameType === 3) {
                userName = userName.toUpperCase();
            }
            BPMS.Services.login(userName, password).then(
                function () {
                    var token = BPMS.Services.Utils.getAuthToken(userName, password);
                    sessionStorage.setItem("bpms_token", token);
                    return BPMS.Services.getTasks();
                }, function (error) {
                    dfd.reject(error);
                }
            ).then(function (result) {
                dfd.resolve(result)
            }, function (error) {
                dfd.reject(error);
            });
            return dfd;
        };
        self.getAccessToken = function () {
            var url = loginServer + "getAccessToken?" + $.param({ agentid: BPMS.config.agentId });
            return $.get(url);
        };
        self.getUserInfo = function () {
            var url = loginServer + "getUserInfo?access_token="
                + self.token() + "&code=" + self.code();

            return $.get(url);
        };

        self.getUserDetail = function (token, ticket) {
            var url = loginServer + "getUserDetail?access_token="
                + token;
            return $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify({ user_ticket: ticket }),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });
        };
        self.goWeChat = function () {
            var corpId = BPMS.config.corpId;
            var scope = "snsapi_privateinfo"; //snsapi_base
            var state = "wxredirect";
            var url = "https://open.weixin.qq.com/connect/oauth2/authorize?"
                + "appid=" + corpId
                + "&redirect_uri=" + encodeURIComponent(location.href)
                + "&response_type=code"
                + "&scope=" + scope
                + "&agentid=" + BPMS.config.agentId
                + "&state=" + state
                + "#wechat_redirect";
            window.location.href = url;
        };

        self.showError = function (message, code) {
            self.message(message || "你不是有效用户，请联系BPMS管理员");
            self.errorCode(code || "");
            $("#popupMessage").popup("open");
        };
        var code = BPMS.Services.Utils.getUrlParam(window.location.href, "code");
        var state = BPMS.Services.Utils.getUrlParam(window.location.href, "state");
        self.code(code);
        self.state(state);
        if (!code) {
            self.goWeChat();
            return;
        }

        var sWechatUser = sessionStorage.getItem("wechat_user");
        if (sWechatUser) {
            var wechatUser = JSON.parse(sWechatUser);
            BPMS.Services.getLdapUser(wechatUser.userid).then(function (data) {
                if (!(data && data.uid)) {
                    self.showError();
                    return;
                }
                var target = BPMS.Services.Utils.getUrlParam(window.location.href, "target");
                self.login(data.uid, BPMS.config.defaultLogin).then(
                    function () {
                        window.location.replace(target || "index.html");
                    }, function () {
                        var param = { uid: data.uid };
                        if (target) {
                            param.target = target;
                        }
                        window.location.replace("login.html?" + $.param(param));
                        return;
                    }
                );
            });
            return;
        }

        self.getAccessToken().then(
            function (data) {
                if (data.access_token) {
                    self.token(data.access_token);
                    return self.getUserInfo();
                }
            }
        ).then(function (data) {
            var ticket = data.user_ticket;
            if (ticket) {
                return self.getUserDetail(self.token(), ticket);
            }
        }).then(function (data) {
            if (data && data.userid) {
                sessionStorage.setItem("wechat_user", JSON.stringify(data));
            } else {
                sessionStorage.removeItem("wechat_user");
            }
            var target = BPMS.Services.Utils.getUrlParam(window.location.href, "target");
            var param = {};
            if (target) {
                param.target = target;
            }
            window.location.replace("login.html?" + $.param(param));
        });
    };
})(window.BPMS = window.BPMS || {}, jQuery, ko);