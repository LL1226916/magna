(function () {
    var init = function () {
        alert(1);
        var loginVue = new Vue({
            el: "#logonView",
            data: {
                message: "用户名或密码不正确",
                userName: "a",
                password: "b"
            },
            mounted:function(){
          
             //   $("#userName").textinput().textinput("refresh");
            //    $("#password").textinput().textinput("refresh");

            },
            methods: {
                login: function () {
                    //用户名或密码不正确/用户无权限
                    alert(this.userName + "  " + this.password);
                }
            }
        });
    };
  //$(init);
  //$(document).bind('pageshow',init);

  $(document).on("pageshow",init);
  //init();
})();