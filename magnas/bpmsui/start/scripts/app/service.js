(function (entrance) {
    entrance.service = {
        getInterviews: function (tel) {
            var url = entrance.config.ldapUrl + "bpms/interviewer?"
                + $.param({ tel: tel });
            return $.get(url);
        },
        getDockList: function () {
            var filters = [{ "type": "category", "target": ["variable", ["template-tag", "assignee"]], "value": BPMS.Services.Utils.getUser().userId }];
            var param = { parameters: JSON.stringify(filters) }
            var settings = {
                dataType: "json",
                url: entrance.config.dockUrl + "?" + $.param(param)
            };

            settings.type = "GET";
            settings.data = {
            };
            return $.ajax(settings);
        },
        getDockHistory: function (start, end) {
            var filters = [{ "type": "category", "target": ["variable", ["template-tag", "start_time"]], "value": start },
            { "type": "category", "target": ["variable", ["template-tag", "end_time"]], "value": end },
            { "type": "category", "target": ["variable", ["template-tag", "assignee"]], "value": BPMS.Services.Utils.getUser().userId }];
            var param = { parameters: JSON.stringify(filters) }
            var settings = {
                dataType: "json",
                url: entrance.config.dockHistoryUrl + "?" + $.param(param)
            };

            settings.type = "GET";
            settings.data = {
            };
            return $.ajax(settings);
        },
        login: function (userName, password) {
            var getUserInfo = function (accessToken) {
                var url = entrance.config.oAuth2Url + "userinfo";
                var settings = {
                    dataType: "json",
                    url: url,
                    crossDomain: true,
                    headers: {
                        "Authorization": "Bearer " + accessToken
                    }
                };

                settings.url = url;
                settings.type = "GET";
                settings.data = {
                    "schema": "openid"
                };

                return $.ajax(settings);
            };
            var requestOAuth2 = function (userName, password) {
                var token = BPMS.Services.Utils.getAuthToken(entrance.config.oAuth2Keys[0], entrance.config.oAuth2Keys[1]);
                var url = entrance.config.oAuth2Url + "token";
                var settings = {
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: url,
                    crossDomain: true,
                    headers: {
                        "Authorization": token,
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    }
                };

                settings.url = url;
                settings.type = "POST";
                settings.data = {
                    "grant_type": "password",
                    "username": userName,
                    "password": password,
                    "scope": "openid email"
                };

                return $.ajax(settings);
            };
            entrance.service.loginError = false;
            sessionStorage.removeItem("Bearer");
            sessionStorage.removeItem("bpms_user");
            return requestOAuth2(userName, password).then(
                function (response) {
                    if (response && response.access_token)
                        sessionStorage.setItem("Bearer", JSON.stringify(response));
                    return getUserInfo(response.access_token);

                },
                function (response) {
                    if (response && response.responseText &&
                        (response.responseText.indexOf("Authentication failed") >= 0 ||
                            response.responseText.indexOf("Missing parameters") >= 0)) {
                        entrance.service.loginError = true;
                    }
                    sessionStorage.removeItem("Bearer");
                    sessionStorage.removeItem("bpms_user");
                }
            ).then(function (user) {
                user.lastLogin = +moment();
                var userNameType = entrance.config.userNameType || 1;
                if (userNameType === 2) {
                    userName = userName.toLowerCase();
                } else if (userNameType === 3) {
                    userName = userName.toUpperCase();
                }
                user.userId = userName;
                if (user.Roles) {
                    var roles = user.Roles.split(",").map(function (role) {
                        return role.replace(/(.*)\//, "");
                    });
                    user.Roles = roles.join(",");
                }
                sessionStorage.setItem("bpms_user", JSON.stringify(user));

                var token = BPMS.Services.Utils.getAuthToken(userName, password);
                return BPMS.Services.Utils.request("history/historic-activity-instances", {}, {
                    "token": token
                });
            });

        },

        getSuggestion: function (keyword) {
            var url = entrance.config.ldapUrl + "ldap/users?" + $.param({ displayName: keyword });
            var settings = {
                dataType: "json",
                url: url
            };

            settings.url = url;
            settings.type = "GET";
            settings.data = {
            };
            return $.ajax(settings);
        },
        postFormData: function (data) {
            var url = entrance.config.bpmsServiceUrl + "visitor-process";
            var settings = {
                dataType: "json",
                type: "POST",
                url: url,
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data)
            };
            return $.ajax(settings);
        },
        getTasks: function () {
            return BPMS.Services.Utils.request("runtime/tasks");
        },
        postTask: function (id, data) {
            return BPMS.Services.Utils.request("runtime/tasks/" + id, data, {
                "type": "POST"
            });
        },
        putProcessInstanceVariables: function (id, data) {
            return BPMS.Services.Utils.request("runtime/process-instances/" + id + "/variables",
                data, {
                    "type": "PUT"
                });
        }
    };
})(window.entrance = window.entrance || {});