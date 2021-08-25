(function (BPMS, $, ko) {

    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.RegisterViewModel = function () {
        var self = this;
        window.vm = self;

        var loader = $.mobile.loading();
        this.loading = function (isLoading) {
            if (isLoading) {
                loader.show();
            }
            else {
                loader.hide();
            }
        };
        this.error = {
            title: ko.observable(""),
            message: ko.observable(""),
            show: function (title, message) {
                this.title(title);
                this.message(message);
                $("#popupError").popup("open");
            }
        };
        this.success = {
            title: ko.observable(""),
            message: ko.observable(""),
            show: function (title, message) {
                this.title(title);
                this.message(message);
                $("#popupSuccess").popup("open");
            }
        };
        this.user = {
            phone: ko.observable(""),
            firstName: ko.observable(""),
            lastName: ko.observable(""),
            code: ko.observable(""),
            isSent: ko.observable(false),
            isAgree: ko.observable(false),
            password: ko.observable(""),
            password2: ko.observable(""),
            codeTime: ko.observable(0)
        };
        this.canRegister = ko.computed(function () {
            return this.user.phone() && this.user.firstName() &&
                this.user.lastName() && this.user.code() && this.user.isAgree() &&
                this.user.password() && this.user.password2();
        }, this);
        this.interval = null;
        this.send = function () {
            var root = this;
            var phone = this.user.phone();
            if (!phone) {
                return;
            }
            root.loading(true);
            var downCount = function () {
                var newTime = Math.max(0, root.user.codeTime() - 1);
                root.user.codeTime(newTime);
                if (newTime === 0) {
                    root.user.isSent(false);
                }
            };
            BPMS.Services.sendCode(phone).then(function (result) {
                root.loading(false);
                if (result.s !== 200) {
                    root.error.show("发送验证码失败", result.m);
                    return;
                }
                root.user.isSent(true);

                root.user.codeTime(60);
                root.interval = setInterval(downCount, 1000);

            });
        };
        this.register = function () {
            var root = this;
            root.loading(true);
            if (this.user.password() !== this.user.password2()) {
                root.loading(false);
                root.error.show("输入错误", "密码与确认密码不一致。");
                $("#password,#password2").parent().addClass("ui-invalid");
                return;
            }
            $("#password,#password2").parent().removeClass("ui-invalid");
            BPMS.Services.register({
                phone: this.user.phone(),
                firstName: this.user.firstName(),
                lastName: this.user.lastName(),
                code: this.user.code(),
                password: this.user.password()
            }).then(function (result) {
                root.loading(false);
                console.log(result);
                if (result.s !== 200) {
                    root.error.show("注册失败", result.m);
                    return;
                }
                root.success.show("注册成功", "注册成功，将前往登陆页面。");
            });
        };
    };

})(window.BPMS = window.BPMS || {}, jQuery, ko);