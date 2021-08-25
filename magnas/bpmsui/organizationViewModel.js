(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.OrganizationViewModel = function () {
        var request = function (url, data, type) {
            var url = "https://my.zhizaozu.com/bpms-rest/service/" + url;
            return BPMS.Services.Utils.request(url, data, {
                token: BPMS.Services.Utils.getAuthToken("18501648407", "12345678"),
                type: type || "GET"
            })
        };
        window.vm = this;
        this.pageSize = 15;
        this.groups = ko.observableArray([]);
        this.selectedUserId = "";
        this.userGroups = ko.observableArray([]);
        this.avaiableGroups = ko.observableArray([]);
        this.displayGroups = ko.observableArray([]);
        this.organization = {
            "": new BPMS.Services.Utils.CreateTypeData(this.pageSize)
        };
        this.test = function () {
            //   https://my.zhizaozu.com/api/account/orgs
            BPMS.Services.Utils.request("https://my.zhizaozu.com/api/account/login?" + $.param({
                phone: 18501648407,
                password: 12345678
            }), null, {
                    token: BPMS.Services.Utils.getAuthToken("18501648407", "12345678"),
                    type: "GET"
                }).then(
                    function () {
                        return BPMS.Services.Utils.request("https://my.zhizaozu.com/api/account/orgs", null, {
                            token: BPMS.Services.Utils.getAuthToken("18501648407", "12345678"),
                            type: "GET"
                        })
                    }
                );

        };
        this.groupId = ko.observable();
        this.getPrev = function () {
            var group = this.organization[this.groupId()];
            if (group.hasPrev()) {
                group.pageIndex(group.pageIndex() - 1);
                self.getData();
            }
        };
        this.getNext = function () {
            var group = this.organization[this.groupId()];
            if (group.hasPrev()) {
                group.pageIndex(group.pageIndex() + 1);
                self.getData();
            }
        };
        this.selectGroup = function (data) {
            var groupId = data.id;
            this.groupId(groupId);
            this.organization[groupId].pageIndex(1);
            return this.getData(groupId);
        };
        this.selectUserGroup = function (data) {
            if ($.mobile.popup && $.mobile.popup.active) {
                $.mobile.popup.active.close();
            }
            return this.selectGroup(data);
        };
        this.getUserGroups = function (user, index) {
            var self = this;
            this.loading(true);
            request("identity/groups", {
                member: user.id,
                size: 10000
            }).then(function (result) {
                var groups = result.data;
                self.loading(false);
                self.userGroups(groups);
                $("#popRoleMenu").popup("open", { positionTo: "#userRole" + index });
            });

        };
        this.selectUserMenu = function (user, index) {
            this.selectedUserId = user && user.id;
            this.delayPop("Menu", { positionTo: "#userMenu" + index });
        };

        this.startAssign = function () {
            var self = this;
            this.loading(true);
            request("identity/groups", {
                member: self.selectedUserId,
                size: 10000
            }).then(function (result) {
                self.loading(false);
                var groups = result.data;
                self.userGroups(groups);
                var findGroup = function (id) {
                    return function (group) {
                        return group.id === id;
                    }
                }
                var avaiableGroups = self.groups().filter(function (group) {
                    return groups.filter(findGroup(group.id)).length === 0;
                });
                self.avaiableGroups(avaiableGroups);
                if (avaiableGroups.length > 1) {
                    self.triggerDelay("GroupAssign", true);
                } else {
                    self.triggerDelay({
                        type: "error",
                        title: "无可分配组",
                        description: "无可分配组。"
                    });
                }
            });
        };

        this.assign = function (group) {
            var self = this;
            this.loading(true);
            request("identity/groups/" + group.id + "/members", {
                userId: self.selectedUserId
            }, "POST").then(function (result) {
                self.loading(false);
                self.triggerDelay({
                    type: "success",
                    "title": "分配组成功",
                    "description": "分配组成功",
                    callback: function () {
                        self.init();
                    }
                });
            }, function (error) {
                self.loading(false);
                self.triggerDelay({
                    type: "error",
                    "title": "分配组失败",
                    "description": "分配组失败"
                });
            });

        };

        this.remove = function () {

        };

        this.deleteUser = function () {

        };

        this.getData = function (groupId) {
            var self = this;
            var handleLoading = $.mobile.loading().is(':hidden');
            if (handleLoading) {
                self.loading(true);
            }
            if (typeof (groupId) === "undefined") {
                groupId = self.groupId();
            }
            var dfd = $.Deferred();
            request("identity/users", groupId ? {
                memberOfGroup: groupId
            } : null).then(function (result) {
                if (handleLoading) {
                    self.loading(false);
                }
                var group = self.organization[groupId];
                group.total(result.total);
                group.items(result.data);
                dfd.resolve();
            });
            return dfd.promise();
        };
        this.getCurrentGroup = function () {
            var id = this.groupId() || "";
            var currentGroup = this.groups().filter(function (group) {
                return group.id === id;
            })[0];
            return currentGroup || {};
        };
        this.init = function () {
            var self = this;
            this.selectedUserId = "";
            this.groups.removeAll();
            this.displayGroups.removeAll();
            this.avaiableGroups.removeAll();
            this.userGroups.removeAll();
            self.loading(true);

            request("identity/groups", { size: 10000 }).then(function (result) {
                self.loading(false);

                // self.groups(result.data);
                var arr = result.data;
                arr.unshift({
                    "id": "",
                    "name": "内部用户",
                    "type": ""
                });

                // arr.forEach(function (group) {
                //     if (!self.organization[group.id]) {
                //         self.organization[group.id] = new BPMS.Services.Utils.CreateTypeData(self.pageSize);
                //     }
                //     self.getData(group.id).then(function () {
                //         self.groups.push(group);
                //         if (group.id) {
                //             self.displayGroups.push(group);
                //         }
                //     });
                // });

                arr.forEach(function (group) {
                    if (!self.organization[group.id]) {
                        self.organization[group.id] = new BPMS.Services.Utils.CreateTypeData(self.pageSize);
                    }
                });
                var requests = arr.map(function (group) {
                    return self.getData(group.id);
                });
                $.when.apply(this, requests).then(function () {
                    self.groups(arr);
                    self.displayGroups(arr.slice(1));
                });
                self.groupId("");
            });


        };
    };
    BPMS.ViewModels.OrganizationViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, jQuery, ko);