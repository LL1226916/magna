(function(BPMS, $, ko) {

BPMS.ViewModels = BPMS.ViewModels || {};
//登录页面viewmodel
BPMS.ViewModels.ChangpwdViewModel = function() {
	var self = this;
	self.userName = ko.observable("");
	self.password = ko.observable("");
	self.newPassword = ko.observable("");
	self.rePassword = ko.observable("");
	self.message = ko.observable("");
	self.errorCode = ko.observable("");
	self.info = ko.observable("");

	self.changePwd = function() {
			var userName = self.userName();
			var password = self.password();
			var newPassword = self.newPassword();
			var rePassword = self.rePassword();
			if(password == newPassword) {
				self.message("新密码不能与原密码重复");
				$("#popupInvalid").popup("open");
				return;	
			}
			if(newPassword == "" || newPassword == null){
				self.message("请输入新密码");
				$("#popupInvalid").popup("open");
				return;			 
			}			
			if(rePassword != newPassword){
				self.message("确认密码错误");
				$("#popupInvalid").popup("open");
				return;
			}
			
			var info = self.info();
			if(info != ""){
				return;
			}
			
			var settings = {
				"url": "https://mttid.magna.cn/oauth2/token",
				"method": "POST",
				"timeout": 0,
				"headers": {
					"Authorization": "Basic VUJXdzZXMDhLbmNSWXVBZmFOVzNzV2ZWWVFzYTpubk8zcXV6bUxPWExsSHFkYU5WdF9ja00xelFh",
					"Content-Type": "application/x-www-form-urlencoded"
				},
				"data": {
					"grant_type": "password",
					"username": userName,
					"password": password,
					"scope": "openid email"
				},
				success: function(res) {
					var changePwdSettings = {
						"url": "https://mttbpms.magna.cn/wso2esb/v1/pwd/change?uid=" + userName + "&password=" + encodeURIComponent(newPassword) + "&changTime=" + (new Date()).getTime(),
						"method": "PUT",
						"timeout": 0,
						success: function(success) {
							window.location.href = "https://mttbpms.magna.cn";
						},
						error: function(err) {
							self.message("修改失败");
							$("#popupMessage").popup("open");
							return;	
						}
					};

					$.ajax(changePwdSettings);
				},
				error: function() {
					self.message("用户认证失败");
					$("#popupMessage").popup("open");
					return;		
				}				
			}
			$.ajax(settings);
	};

	self.checkPassword = function() {
		// alert("aaa")
	     var newPassword = self.newPassword();
		 var oldPassword = self.password();

		 var passwordRules = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,20}$/;
	     
		 console.log(passwordRules.test(newPassword))
		 
		 
		 if(!passwordRules.test(newPassword)){ 
			self.info("密码必须是长度不小于8位并且包含至少一个字母、数字和 ._~!@#$^&* 字符");
	     }else{
			self.info("");	
		 }
	}	
	

};


})(window.BPMS = window.BPMS || {}, jQuery, ko);

//ui-input-text ui-body-b ui-corner-all ui-shadow-inset ui-input-has-clear ui-focus
