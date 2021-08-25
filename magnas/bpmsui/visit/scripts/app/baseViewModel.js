(function (entrance) {
    Function.prototype.extend = function (Base) {
        this.prototype = new Base();
    };
    entrance.BaseViewModel = function () {
        var loader = $.mobile.loading();
        this.popupInfo = {
            title: ko.observable(""),
            subTitle: ko.observable(""),
            message: ko.observable(""),
            code: ko.observable(""),
			action: ko.observable(""),
			data: ko.observable(""),
        };
        this.logout = function () {
            sessionStorage.removeItem("bpms_token");
            sessionStorage.removeItem("bpms_user");
            sessionStorage.removeItem("Bearer");
            window.location.href = "login.html";
        };
        this.wxConfig = function (fnSuccess, fnError) {
            var self = this;
            self.timestamp = moment().format("X");
            self.nonceStr = Math.random().toString(36).substr(2);
            entrance.service.getAccessToken().then(function (data) {
                if (data.access_token) {
                    self.token = data.access_token;
                    return entrance.service.getTicket(self.token);
                }
            }).then(function (data) {
                if (data.ticket) {
                    self.ticket = data.ticket;
                    var s = "jsapi_ticket=" + self.ticket
                        + "&noncestr=" + self.nonceStr
                        + "&timestamp=" + self.timestamp
                        + "&url=" + location.href.split("#")[0];

                    return entrance.service.sign(s);
                }
            }).then(function (result) {
                wx.config({
                    beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: entrance.config.corpId, // 必填，企业微信的corpID
                    timestamp: self.timestamp,
                    nonceStr: self.nonceStr,
                    signature: result.signature,// 必填，签名，见附录1
                    jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                if (fnSuccess) {
                    wx.ready(fnSuccess);

                }
                if (fnError) {
                    wx.error(fnError);
                }
            });
        };
        this.closePop = function () {
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

        this.show = function (info, isSuccess) {
            this.popupInfo.title(info.title || "");
            this.popupInfo.subTitle(info.subTitle || "");
            this.popupInfo.message(info.message || "");
            this.popupInfo.code(info.code || "");
            var id = (isSuccess || info.isSuccess) ? "popupSuccess" : "popupError";
            $("#" + id).popup("open");
         //   $("#" + id).popup().popup("open");
        };
        this.showSuccess = function (info) {
            this.show(info, true);
        }

        this.loading = function (isLoading) {
            if (isLoading === false) {
                loader.hide();
            } else {
                loader.show();
            }
        };
        this.go = function (url) {
            location.href = url;
        };
        this.showConfirm = function (info, id) {
            this.popupInfo.message(info.message || "");
			this.popupInfo.action(info.action || "");
			this.popupInfo.data(info.data|| "");
            $("#" + id).popup("open");
         //   $("#" + id).popup().popup("open");
        };
    };
})(window.entrance = window.entrance || {});