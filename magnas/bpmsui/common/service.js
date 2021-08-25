(function (BPMS, $) {
    var getProcessDefinition = function (id) {
        return BPMS.Services.Utils.request("repository/process-definitions/" + id);
    };
    var getTask = function (id) {
        return BPMS.Services.Utils.request("runtime/tasks/" + id);
    };
    var postTasks = function (id, data) {
        return BPMS.Services.Utils.request("runtime/tasks/" + id, data, {
            "type": "POST"
        });
    };
    var putTasks = function (id, data) {
        return BPMS.Services.Utils.request("runtime/tasks/" + id, data, {
            "type": "PUT"
        });
    };
    var postProcessInstanceLinks = function (id, data) {
        return BPMS.Services.Utils.request("runtime/process-instances/" + id,
            data, {
            "type": "POST"
        });
    };
    var postProcessInstanceVariables = function (id, data) {
        return BPMS.Services.Utils.request("runtime/process-instances/" + id + "/variables",
            data, {
            "type": "POST"
        });
    };
    var putProcessInstanceVariables = function (id, data) {
        return BPMS.Services.Utils.request("runtime/process-instances/" + id + "/variables",
            data, {
            "type": "PUT"
        });
    };
    var addInvolvedUser = function (id, userId) {
        var data = {
            "user": userId,
            "type": "participant"
        };
        return BPMS.Services.Utils.request("runtime/process-instances/" + id + "/identitylinks",
            data, {
            "type": "POST"
        });
    };

    var queryHistoricProcessInstances = function (param) {
        return BPMS.Services.Utils.request("query/historic-process-instances", param, {
            "type": "POST"
        });
    };
    var getProcessInstance = function (id) {
        return BPMS.Services.Utils.request("runtime/process-instances/" + id);
    };

    var deleteProcessInstance = function (id) {
        return BPMS.Services.Utils.request("runtime/process-instances/" + id, null, {
            "type": "DELETE"
        });
    };
    var getComments = function (url) {
        var me = BPMS.Services.Utils.getUser().userId;
        var dfd = $.Deferred();
        var result = [];
        var ids = [];
        var tasks = [];
        BPMS.Services.Utils.request(url).then(function (comments) {
            result = comments.map(function (comment) {
                var item = {
                    from: comment.author,
                    fromName: "",
                    to: "",
                    toName: "",
                    message: comment.message,
                    stamp: moment(comment.time).format("x"),
                    id: comment.id,
                    taskId: comment.taskId,
                    taskName: "",
                    processInstanceId: comment.processInstanceId

                }

                try {
                    var message = JSON.parse(comment.message);
                    if (typeof (message) === "object") {
                        item.message = message.message;
                        item.to = message.to || "";
                    }
                } catch (err) {
                }
                return item;
            }).filter(function (item) {
                return item.from === me || item.to === me || !item.to;
            }).sort(function (a, b) {
                return Number(a.stamp) < Number(b.stamp) ? 1 : -1;
            });
            result.forEach(function (item) {
                if (item.from && ids.indexOf(item.from) < 0) {
                    ids.push(item.from);
                }
                if (item.to && ids.indexOf(item.to) < 0) {
                    ids.push(item.to);
                }
                if (item.taskId && tasks.indexOf(item.taskId) < 0) {
                    tasks.push(item.taskId);
                }

            });
            return BPMS.Services.getUsers(ids);
        }, function () {
            dfd.reject();
        }).then(function () {
            Array.prototype.forEach.call(arguments, function (item, index) {
                if (!item || (!item.length && !item.id) || item.readyState) {
                    return;
                }
                var singleUser = item[0] || item;
                var fullName = singleUser.firstName + " " + singleUser.lastName;
                result.forEach(
                    function (comment) {
                        if (comment.from === singleUser.id) {
                            comment.fromName = fullName;
                        }
                        if (comment.to === singleUser.id) {
                            comment.toName = fullName;
                        }
                    }
                );
            });
            var requests = tasks.map(function (id) {
                return BPMS.Services.Utils.request("history/historic-task-instances/" + id);
            });
            return $.when.apply(this, requests);
        }).then(function () {
            Array.prototype.forEach.call(arguments, function (item, index) {
                if (!item || (!item.length && !item.id) || item.readyState) {
                    return;
                }
                var singleTask = item[0] || item;
                result.forEach(
                    function (comment) {
                        if (comment.taskId === singleTask.id) {
                            comment.taskName = singleTask.name;
                        }
                    }
                );
            });
            dfd.resolve(result);
        });
        return dfd;
    };
    var getProcessInstanceComments = function (id) {
        return getComments("history/historic-process-instances/" + id + "/comments");
    }
    var getTaskComments = function (id) {
        return getComments("runtime/tasks/" + id + "/comments");
    }

    var getProcessInstanceVariables = function (id) {
        return BPMS.Services.Utils.request("runtime/process-instances/" + id + "/variables");
    };

    var getTaskVariables = function (id) {
        return BPMS.Services.Utils.request("runtime/tasks/" + id + "/variables");
    };



    var getProcessInstanceDiagram = function (id) {
        return BPMS.Services.Utils.request("runtime/process-instances/" + id + "/diagram");
    };

    var getHistoricProcessInstance = function (id) {
        return BPMS.Services.Utils.request("history/historic-process-instances/" + id);
    };
    var getDeployment = function (id) {
        return BPMS.Services.Utils.request("repository/deployments/" + id + "/resources");
    };
    var requestOAuth2 = function (userName, password) {
        var token = BPMS.Services.Utils.getAuthToken(BPMS.config.oAuth2Keys[0], BPMS.config.oAuth2Keys[1]);
        var url = BPMS.config.oAuth2Url + "token";
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
    var postIcsNotice = function (data) {
        var url = BPMS.config.icsUrl + "v1/ical";
        var settings = {
            dataType: "json",
            url: url,
            type: "POST",
            headers: BPMS.config.icsHeader
        };
        return BPMS.Services.Utils.request(url, data, settings);
    };

    var getUserInfo = function (accessToken) {
        var url = BPMS.config.oAuth2Url + "userinfo";
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
    var login = function (userName, password) {
        BPMS.Services.loginError = false;
        sessionStorage.removeItem("Bearer");
        sessionStorage.removeItem("bpms_user");
        sessionStorage.removeItem("user");
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
                    BPMS.Services.loginError = true;
                }
                sessionStorage.removeItem("Bearer");
                sessionStorage.removeItem("bpms_user");
                sessionStorage.removeItem("user");
				
				
            }
        ).then(function (user) {
			if(user.changeTime){
				if((new Date().getTime() - user.changeTime)/ 86400000 > 90){
					BPMS.Services.loginError = true;
					return;
				}

			}

            user.lastLogin = +moment();
            var userNameType = BPMS.config.userNameType || 1;
            if (userNameType === 2) {
                userName = userName.toLowerCase();
            } else if (userNameType === 3) {
                userName = userName.toUpperCase();
            }
            user.userId = userName;
			user.id = userName;
            if (user.Roles) {
                var roles = user.Roles.split(",").map(function (role) {
                    return role.replace(/(.*)\//, "");
                });
                user.Roles = roles.join(",");
            }
            sessionStorage.setItem("bpms_user", JSON.stringify(user));
			sessionStorage.setItem("user", JSON.stringify(user));

            var token = BPMS.Services.Utils.getAuthToken(userName, password);
            return BPMS.Services.Utils.request("history/historic-activity-instances", {}, {
                "token": token
            });
        });

    };

    var getEmployee = function () {
        var url = BPMS.config.hrUrl + "v1/employee";
        var token = "Bearer " + JSON.parse(sessionStorage.getItem("Bearer")).access_token;
        return BPMS.Services.Utils.request(url, {}, {
            "token": token
        });
    };
    var getAuto = function (url, keyword, userId) {
        var filters = [{
            "type": "category",
            "target": ["variable", ["template-tag", "param"]],
            "value": keyword
        }, {
            "type": "category",
            "target": ["variable", ["template-tag", "userId"]],
            "value": userId
        }];
        var param = {
            parameters: JSON.stringify(filters)
        }
        var settings = {
            type: "GET",
            data: {},
            dataType: "json",
            url: url + "?" + $.param(param)
        };
        return $.ajax(settings);
    };

    var getSuggestion = function (keyword, url) {
        var accessToken = JSON.parse(sessionStorage.getItem("Bearer")).access_token;
        url = url || BPMS.config.hrUrl + "v1/employee/autoComplete/";
        url += keyword;
        var settings = {
            dataType: "json",
            url: url,
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + accessToken,
                "Content-Type": "application/json"
            }
        };

        settings.url = url;
        settings.type = "GET";
        settings.data = {
            //"str": keyword
        };
        return $.ajax(settings);
    };


    var getDelegates = function (data) {
        if (!data) {
            data = {};
        }
        var filter = data.filter || {};

        data.filter = JSON.stringify(filter);
        var url = BPMS.config.delegateUrl.trim();
        var dfd = $.Deferred();

        var settings = {
            dataType: "json",
            url: url,
        };
        var items = [];

        settings.data = data;
        $.ajax(settings).then(function (response) {
            items = response._embedded || [];
            var userIds = [];
            items.forEach(function (item) {
                if (userIds.indexOf(item.from) < 0) {
                    userIds.push(item.from);
                }
                if (userIds.indexOf(item.to) < 0) {
                    userIds.push(item.to);
                }
            });
            var requests = userIds.map(function (id) {
                return BPMS.Services.Utils.request("identity/users/" + id);
            });
            return $.when.apply(this, requests);
        }).then(function () {
            Array.prototype.forEach.call(arguments, function (item, index) {
                if (!item || (!item.length && !item.id) || item.readyState) {
                    return;
                }
                var singleUser = item[0] || item;
                var fullName = singleUser.firstName + " " + singleUser.lastName;
                items.forEach(
                    function (item) {
                        if (item.from === singleUser.id) {
                            item.fromName = fullName;
                        }
                        if (item.to === singleUser.id) {
                            item.toName = fullName;
                        }
                    }
                );
            });
            dfd.resolve(items);
        });

        return dfd.promise();
    };

    var getDelegators = function (user) {
        var dfd = $.Deferred();

        var now = moment().format("x");
        var data = {
            filter: {
                to: user.userId,
                tenantId: user.tenantId || "",
                start: { $lte: now },
                end: { $gte: now }
            }
        };

        this.getDelegates(data).then(function (result) {
            var items = result.map(function (item) {
                return {
                    userId: item.from,
                    userName: item.fromName
                }
            });
            dfd.resolve(items);
        }, function (error) {
            dfd.reject(error);
        });
        return dfd.promise();

    };

    var deleteDelegate = function (id) {
        var url = BPMS.config.delegateUrl.trim();
        url += id;
        var settings = {
            dataType: "text",
            url: url,
            type: "DELETE",
            data: {}
        };

        return $.ajax(settings);
    };

    var saveDelegate = function (data) {
        var url = BPMS.config.delegateUrl.trim();
        var settings = {
            dataType: "text",
            url: url,
            crossDomain: true,
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            data: JSON.stringify(data)
        };
        return $.ajax(settings);
    };

    var getUsers = function (ids) {
        var requests = ids.map(function (id) {
            return BPMS.Services.Utils.request("identity/users/" + id);
        });
        return $.when.apply(this, requests);
    };

    var addUniqueDocument = function (doc) {
        var dfd = $.Deferred();
        BPMS.Services.getDocuments(doc.type, doc.file.name).then(
            function (result) {
                var items = result && result._embedded || [];
                if (items.length) {
                    dfd.reject({
                        "errorType": "FileAlreadyExist"
                    });
                    return;
                }

                return BPMS.Services.addDocument(doc);
            })
            .then(
                function (res) {
                    if (typeof (res) !== "undefined") {
                        return BPMS.Services.getDocuments(doc.type, doc.file.name);
                    }

                },
                function (res) {
                    dfd.reject(res);
                    // if (res && res.stauts == 200) {
                    // }
                }
            )
            .then(function (result) {
                if (typeof (result) !== "undefined") {
                    var items = result && result._embedded || [];
                    if (items.length) {
                        var item = items[0];
                        dfd.resolve(item);
                        return;
                    }
                    dfd.reject({
                        "errorType": "FileNotCreated"
                    });
                }
            });
        return dfd;
    };


    var addDocument = function (doc) {
        //doc.file.dateTime== BPMS.Services.Utils.getCurrentTimeStamp();
        var url = BPMS.config.draftUrl.trim();
        var settings = {
            dataType: "text",
            url: url,
            crossDomain: true,
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            data: JSON.stringify(doc)
        };
        return $.ajax(settings);
    };
    var deleteDocument = function (id) {
        var url = BPMS.config.draftUrl.trim();
        url += id;
        var settings = {
            dataType: "text",
            url: url,
            type: "DELETE",
            data: {}
        };

        return $.ajax(settings);
    };
    var getDocument = function (id) {
        return BPMS.Services.Utils.request(BPMS.config.draftUrl.trim() + id);
    };

    var getDocuments = function (data) {
        data = data || {};
        var filter = data.filter || {};
        filter.userId = BPMS.Services.Utils.getUser().userId;
        if (!filter.type) {
            // filter.type = {
            //     "$regex": "Instance.*"
            // };
            filter.type = { $in: ["InstanceDraft", "InstanceTemplate"] };
        }
        data.filter = JSON.stringify(filter);
        var url = BPMS.config.draftUrl.trim();
        var settings = {
            dataType: "json",
            url: url,
        };

        settings.data = data;
        return $.ajax(settings);
    };


    var addUniqueForm = function (doc) {
        var dfd = $.Deferred();
        BPMS.Services.getForms({
            filter: {
                type: doc.type,
                name: doc.name,
				createdBy: BPMS.Services.Utils.getUser().userId
            }
        }).then(
            function (result) {
                var items = result && result._embedded || [];
				console.log(items)
                if (items.length) {
                    dfd.reject({
                        "errorType": "FileAlreadyExist"
                    });
                    return;
                }

                return BPMS.Services.addForm(doc);
            })
            .then(
                function (res) {
                    if (typeof (res) !== "undefined") {
                        return BPMS.Services.getForms({
                            filter: {
                                type: doc.type,
                                name: doc.name
                            }
                        });
                    }

                },
                function (res) {
                    dfd.reject(res);
                    // if (res && res.stauts == 200) {
                    // }
                }
            )
            .then(function (result) {
                if (typeof (result) !== "undefined") {
                    var items = result && result._embedded || [];
                    if (items.length) {
                        var item = items[0];
                        dfd.resolve(item);
                        return;
                    }
                    dfd.reject({
                        "errorType": "FileNotCreated"
                    });
                }
            });
        return dfd;
    };

    var updateForm = function (form) {
        if (!form || !form._id) {
            return;
        }
        return addForm(form);
    };

    var addForm = function (doc) {
        var url = BPMS.config.collectionUrl.trim();
        var settings = {
            dataType: "text",
            url: url,
            crossDomain: true,
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            data: JSON.stringify(doc)
        };
        return $.ajax(settings);
    };
    var deleteForm = function (id) {
        var url = BPMS.config.collectionUrl.trim();
        url += id;
        var settings = {
            dataType: "text",
            url: url,
            type: "DELETE",
            data: {}
        };

        return $.ajax(settings);
    };
    var getForm = function (id) {
        return BPMS.Services.Utils.request(BPMS.config.collectionUrl.trim() + id);
    };

    var getForms = function (data) {
        data = data || {};
        var filter = data.filter || {};

        data.filter = JSON.stringify(filter);
        if (data.sort) {
            data.sort = JSON.stringify(data.sort);
        }
        var url = BPMS.config.collectionUrl.trim();
        var settings = {
            dataType: "json",
            url: url,
        };
        settings.data = data;
        return $.ajax(settings);
    };

    var getFormRules = function (filter) {
        var dfd = $.Deferred();
        var url = BPMS.config.collectionUrl.trim();
        var settings = {
            dataType: "json",
            url: url,
            data: {
                filter: JSON.stringify(filter)
            }
        };

        $.ajax(settings).then(function (result) {
            var rules = [];
            result._embedded.forEach(function (item) {
                // var matched = item.formData.filter(function (formField) {
                //     return formField.dataset;
                // });
                rules.push.apply(rules, item.formData);
            });
            console.log(result);
            dfd.resolve(rules);
        }, function (error) {
            dfd.reject(error);
        });

        return dfd.promise();
    };
    var getFormRule = function (id) {
        return BPMS.Services.Utils.request(BPMS.config.ruleUrl.trim() + id);
    };


    var postSQL = function (sql) {
        var dfd = $.Deferred();
        var token = BPMS.Services.Utils.getAuthToken(BPMS.config.sqlUserName, BPMS.config.sqlPassword);
        var settings = {
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: BPMS.config.sqlUrl,
            type: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/sql"
            },
            data: sql
        };
        $.ajax(settings).then(function (result) {
            var items = result &&
                result.items &&
                result.items[0] &&
                result.items[0].resultSet &&
                result.items[0].resultSet.items || [];
            items = items.map(function (item) {
                var newItem = {};
                for (var i in item) {
                    var key = i.toUpperCase();
                    newItem[key] = item[i];
                }
                return newItem;
            });
            dfd.resolve(items);
        }, function (error) {
            dfd.reject(error);
        });

        return dfd.promise();
    };
    var getPurchaseOrder = function (orderNumber, lineNumber, materialNumber, bpsNumber) {
        var sql = "SELECT POQ.ROWID, POQ.POHNUM_0, POQ.POPLIN_0,POQ.POQSEQ_0, POQ.CPY_0,POQ.POHFCY_0, " +
            "POQ.PRHFCY_0, POQ.ITMREF_0, ITM.PCU_0, ITM.PCUSTUCOE_0, POQ.ITMREFBPS_0, " +
            "POQ.PUU_0, POQ.STU_0, POQ.QTYPUU_0, POQ.RCPQTYPUU_0, POQ.RETQTYPUU_0, POQ.XSCAQTYPUU_0, " +
            "POQ.LINCLEFLG_0, ITM.ITMDES1_0, ITM.ITMDES2_0, POH.BPSNUM_0, POH.BPAADD_0, POH.BPRNAM_0, " +
            "BPS.BPSSHO_0, POH.CUR_0, POH.APPFLG_0, POH.CLEFLG_0, POH.RCPFLG_0, POH.ORDDAT_0, AUS.NOMUSR_0 " +
            "FROM PORDERQ POQ " +
            "LEFT JOIN PORDERP POP ON(POQ.POHNUM_0 = POP.POHNUM_0 " +
            "AND POQ.POPLIN_0 = POP.POPLIN_0 AND POQ.POQSEQ_0 = POP.POPSEQ_0) " +
            "LEFT JOIN PORDER POH ON(POQ.POHNUM_0 = POH.POHNUM_0) " +
            "LEFT JOIN AUTILIS AUS ON(POH.BUY_0 = AUS.USR_0) " +
            "LEFT JOIN ITMMASTER ITM ON (POQ.ITMREF_0 = ITM.ITMREF_0) " +
            "LEFT JOIN BPSUPPLIER BPS ON (POH.BPSNUM_0 = BPS.BPSNUM_0) " +
            "WHERE POQ.POHNUM_0 = '{0}'";
        // "WHERE ITM.PCUSTUCOE_0 > 0";
        if (lineNumber) {
            sql += " AND POQ.POPLIN_0 = {1}";
        }
        if (materialNumber) {
            sql += " AND POQ.ITMREF_0 = '{2}'";
        }
        if (bpsNumber) {
            sql += " AND POH.BPSNUM_0 = '{3}'";
        }
        sql = sql.replace(/\{0\}/ig, orderNumber)
            .replace(/\{1\}/ig, lineNumber)
            .replace(/\{2\}/ig, materialNumber)
            .replace(/\{3\}/ig, bpsNumber);
        return postSQL(sql);
    };
    var getPurchaseOrderAPI = function (orderNumber, lineNumber, materialNumber, bpsNumber) {
        var param = {
            pohnum: orderNumber,
            poplin: lineNumber,
            itmref: materialNumber,
            bpsnum: bpsNumber
        };

        var url = BPMS.config.erpUrl + "BarCode?" + $.param(param);
        return $.get(url);
    };

    var getProduceOrder = function (orderNumber, lineNumber) {
        var sql = "SELECT MFI.MFGNUM_0, MFI.MFGLIN_0, MFI.ITMREF_0, MFI.ITMTYP_0 , MFI.MFGSTA_0, MFI.MFGFCY_0, " +
            "MFI.BPCNUM_0, MFI.MFGDES_0, MFI.UOM_0, MFI.STU_0, MFI.UOMSTUCOE_0, MFI.UOMEXTQTY_0,  " +
            "MFI.EXTQTY_0, MFI.CPLQTY_0, MFI.REJCPLQTY_0, MFI.QUACPLQTY_0, MFI.RMNEXTQTY_0,  " +
            "MFI.LOT_0, MFI.BOMALT_0, MFI.VCRTYPORI_0, MFI.VCRNUMORI_0, MFI.VCRLINORI_0,  " +
            "MFI.VCRSEQORI_0, MFI.FMI_0, MFI.ITMSTA_0 , MFG.ALLSTA_0, ITM.ITMDES1_0,  " +
            "ITM.ITMDES2_0, ITM.ITMDES3_0, ITM.PCU_0, ITM.PCUSTUCOE_0,  ITM.PUU_0, " +
            "ITF.STOFCY_0, ITF.DEFLOC_0, ITF.DEFLOC_1,ITF.DEFLOC_2,ITF.DEFLOC_3  " +
            "FROM MFGITM MFI  " +
            "LEFT JOIN MFGHEAD MFG ON(MFI.MFGNUM_0 = MFG.MFGNUM_0)  " +
            "LEFT JOIN ITMMASTER ITM ON(MFI.ITMREF_0 = ITM.ITMREF_0)  " +
            "LEFT JOIN ITMFACILIT ITF ON(MFI.MFGFCY_0 = ITF.STOFCY_0 AND MFI.ITMREF_0 = ITF.ITMREF_0)  " +
            "WHERE MFI.MFGNUM_0 = '{0}' AND MFI.MFGLIN_0 = '{1}' ";

        sql = sql.replace(/\{0\}/ig, orderNumber)
            .replace(/\{1\}/ig, lineNumber);
        return postSQL(sql);
    };


    var getStock = function (itmref, stofcy, loc) {
        var sql = "SELECT STO.STOFCY_0, STO.ITMREF_0, ITM.ITMDES1_0, ITM.ITMDES2_0, " +
            "ITM.ITMDES3_0, ITM.PCU_0, ITM.PCUSTUCOE_0, ITM.PUU_0, " +
            "STO.LOT_0, STO.STA_0, STO.LOC_0, STO.LOCTYP_0, STO.QTYSTU_0  " +
            "FROM STOCK STO  " +
            "LEFT JOIN ITMMASTER ITM ON(STO.ITMREF_0 = ITM.ITMREF_0)  " +
            "WHERE STO.ITMREF_0='{0}' AND STO.STOFCY_0 = '{1}' AND STO.LOC_0 = '{2}'";
        sql = sql.replace(/\{0\}/ig, itmref)
            .replace(/\{1\}/ig, stofcy)
            .replace(/\{2\}/ig, loc);
        return postSQL(sql);
    };

    var getLotStock = function (materialNumber, lotNumber) {
        var sql = "SELECT VCRNUM_0,VCRLIN_0,LOTCREDAT_0,BPSNUM_0 " +
            "FROM STOLOT WHERE ITMREF_0='{0}' AND LOT_0='{1}'";
        sql = sql.replace(/\{0\}/ig, materialNumber)
            .replace(/\{1\}/ig, lotNumber);
        return postSQL(sql);
    };

    var uploadCSV = function (content, param) {
        var url = BPMS.config.fileDownloaderUrl + "pdf/v1/csv/download/riying_070040?" +
            $.param(param);
        return BPMS.Services.Utils.postFile(url, content, { "Content-Type": "text/csv" });
    };

    var downloadPDF = function (data, path) {
        var url = BPMS.config.fileDownloaderUrl + (path || "pdf/v1/pdf/download/riying_070040");
        return BPMS.Services.Utils.postFile(url, data, { "Content-Type": "application/json" });
    };

    var getLdapUser = function (id) {
        var url = BPMS.config.ldapUrl + "uid?" + $.param({ wechatId: id });
        return $.get(url);
    };

    var getOrders = function () {
        var dfd = $.Deferred();
        setTimeout(function () {
            var orders = [{
                name: "订单001",
                id: "12345643",
                category: "ERP",
                fields: [
                    { name: "名称", value: "模块A" },
                    { name: "收货人", value: "张三" },
                    { name: "地址", value: "浙江省宁波市" },
                    { name: "电话", value: "13659874562" },
                    { name: "价格", value: "￥12,325.54" },
                    { name: "数量", value: "1" },
                    { name: "状态", value: "已支付" },
                    { name: "备注", value: "紧急" },
                    { name: "联系人", value: "李四" },
                    { name: "订单时间", value: "2018-03-23 12:34:55" }
                ],
                table: {
                    headers: ["姓名", "职位", "城市", "年龄", "时间", "收入"],
                    rows: [["Garrett Winters", "Accountant", "Tokyo", "63", "2011-07-25", "$170,75"],
                    ["Jim Hagemann Snabe", "Engineer", "Berlin", "42", "2011-07-26", "$256,03"],
                    ["Ann Rosenberg", "Administrator", "Munchen", "53", "2011-07-28", "$698,00"],
                    ["Charles Møller", "Developer", "Stockholm", "20", "2011-02-25", "$888,12"],
                    ["Mark Scavillo", "Architect", "Greenwood", "44", "2010-07-10", "$25,22"],
                    ["Tiger Nixon", "UX Designer", "Helsinki", "41", "2015-02-11", "$77,99"],]
                },

            }, {
                name: "订单002",
                id: "12345644",
                category: "CRM",
                fields: [
                    { name: "名称", value: "模块B" },
                    { name: "收货人", value: "张三" },
                    { name: "地址", value: "浙江省宁波市" },
                    { name: "电话", value: "13659874562" },
                    { name: "价格", value: "￥12,325.54" },
                    { name: "数量", value: "1" },
                    { name: "状态", value: "已支付" },
                    { name: "备注", value: "紧急" },
                    { name: "联系人", value: "李四" },
                    { name: "订单时间", value: "2018-03-23 12:34:55" }
                ],
                table: {
                    headers: ["姓名", "职位", "城市", "年龄", "时间", "收入"],
                    rows: [["Garrett Winters", "Accountant", "Tokyo", "63", "2011-07-25", "$170,75"],
                    ["Jim Hagemann Snabe", "Engineer", "Berlin", "42", "2011-07-26", "$256,03"],
                    ["Ann Rosenberg", "Administrator", "Munchen", "53", "2011-07-28", "$698,00"],
                    ["Charles Møller", "Developer", "Stockholm", "20", "2011-02-25", "$888,12"],
                    ["Mark Scavillo", "Architect", "Greenwood", "44", "2010-07-10", "$25,22"],
                    ["Tiger Nixon", "UX Designer", "Helsinki", "41", "2015-02-11", "$77,99"],]
                },

            }, {
                name: "订单003",
                id: "12345645",
                category: "SCM",
                fields: [
                    { name: "名称", value: "模块C" },
                    { name: "收货人", value: "张三" },
                    { name: "地址", value: "浙江省宁波市" },
                    { name: "电话", value: "13659874562" },
                    { name: "价格", value: "￥12,325.54" },
                    { name: "数量", value: "1" },
                    { name: "状态", value: "已支付" },
                    { name: "备注", value: "紧急" },
                    { name: "联系人", value: "李四" },
                    { name: "订单时间", value: "2018-03-23 12:34:55" }
                ],
                table: {
                    headers: ["姓名", "职位", "城市", "年龄", "时间", "收入"],
                    rows: [["Garrett Winters", "Accountant", "Tokyo", "63", "2011-07-25", "$170,75"],
                    ["Jim Hagemann Snabe", "Engineer", "Berlin", "42", "2011-07-26", "$256,03"],
                    ["Ann Rosenberg", "Administrator", "Munchen", "53", "2011-07-28", "$698,00"],
                    ["Charles Møller", "Developer", "Stockholm", "20", "2011-02-25", "$888,12"],
                    ["Mark Scavillo", "Architect", "Greenwood", "44", "2010-07-10", "$25,22"],
                    ["Tiger Nixon", "UX Designer", "Helsinki", "41", "2015-02-11", "$77,99"],]
                },

            }];
            dfd.resolve(orders);
        }, 1000);
        return dfd.promise();
    };

    var getRules = function (tableName, data) {
        var url = BPMS.config.droolsUrl + tableName;
        var settings = {
            dataType: "json",
            url: url,
            type: "POST",
            headers: { "Content-Type": "application/json" },
            crossDomain: true,

        };

        settings.data = JSON.stringify(data);
        return $.ajax(settings);
    };



    var postDependency = function (data) {
        var url = BPMS.config.dataServiceUrl + "data";
        var settings = {
            dataType: "json",
            url: url,
            type: "POST",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data)
        };
        return $.ajax(settings);
    };
    var getDependency = function (data) {
        var url = BPMS.config.dataServiceUrl + "data";
        var settings = {
            dataType: "json",
            url: url,
            type: "GET",
            headers: { "Content-Type": "application/json" },
            data: data
        };
        return $.ajax(settings);
    };
    var getSingleData = function (data) {
        var url = BPMS.config.dataServiceUrl + "data";
        var settings = {
            dataType: "json",
            url: url,
            type: "GET",
            headers: { "Content-Type": "application/json" },
            data: data
        };
        return $.ajax(settings);
    };

    var getJoinData = function (data) {
        var url = BPMS.config.dataServiceUrl + "report";
        var settings = {
            dataType: "json",
            url: url,
            type: "POST",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data)
        };
        return $.ajax(settings);

        // {
        //     "aggregationFields": [
        //       {
        //         "alias": "string",
        //         "collectionId": "string",
        //         "fieldId": "string",
        //         "op": "string"
        //       }
        //     ],
        //     "basicConditions": [
        //       {
        //         "left": {
        //           "alias": "string",
        //           "collectionId": "string",
        //           "fieldId": "string"
        //         },
        //         "op": "string",
        //         "type": "string",
        //         "value": "string"
        //       }
        //     ],
        //     "groupbyFields": [
        //       {
        //         "alias": "string",
        //         "collectionId": "string",
        //         "fieldId": "string"
        //       }
        //     ],
        //     "inConditions": [
        //       {
        //         "left": {
        //           "alias": "string",
        //           "collectionId": "string",
        //           "fieldId": "string"
        //         },
        //         "type": "string",
        //         "value": [
        //           "string"
        //         ]
        //       }
        //     ],
        //     "joinConditions": [
        //       {
        //         "left": {
        //           "alias": "string",
        //           "collectionId": "string",
        //           "fieldId": "string"
        //         },
        //         "right": {
        //           "alias": "string",
        //           "collectionId": "string",
        //           "fieldId": "string"
        //         }
        //       }
        //     ],
        //     "tenantId": "string"
        //   }
    };

    var getOneLinkage = function (data) {
        var url = BPMS.config.dataServiceUrl + "linkagedata/one";
        var settings = {
            dataType: "json",
            url: url,
            type: "POST",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data)
        };
        return $.ajax(settings);
    };

    var sendCode = function (phone) {
        var param = { phone: phone };
        var url = BPMS.config.accountServiceUrl + "phone/code?" + $.param(param);
        return $.get(url);
    };
    var register = function (data) {
        var url = BPMS.config.accountServiceUrl + "register";
        var settings = {
            dataType: "json",
            url: url,
            crossDomain: true,
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            data: JSON.stringify(data)
        };
        return $.ajax(settings);
    };
    var getDeployment = function (id) {
        return BPMS.Services.Utils.request("repository/deployments/" + id + "/resources");
    };

    var deleteDeployment = function (id) {
        return BPMS.Services.Utils.request("repository/deployments/" + id, {}, {
            type: "DELETE"
        });
    };

    var postMeta = function (data) {
        var url = BPMS.config.dataServiceUrl + "meta";
        var settings = {
            dataType: "json",
            url: url,
            crossDomain: true,
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            data: JSON.stringify(data)
        };
        return $.ajax(settings);
    };

    var getMetaList = function () {
        var url = BPMS.config.dataServiceUrl + "dataset";
        return $.get(url);
    };

    var getMeta = function (collectionId) {
        var url = BPMS.config.dataServiceUrl + collectionId;
        return $.get(url);
    };

    BPMS.Services = BPMS.Services || {};
    BPMS.Services.Utils.defineService("getRules", getRules);
    BPMS.Services.Utils.defineService("getOrders", getOrders);
    BPMS.Services.Utils.defineService("getTask", getTask);
    BPMS.Services.Utils.defineService("getTasks", "runtime/tasks");
    BPMS.Services.Utils.defineService("postTasks", postTasks);
    BPMS.Services.Utils.defineService("putTasks", putTasks);
    BPMS.Services.Utils.defineService("uploadCSV", uploadCSV);
    BPMS.Services.Utils.defineService("downloadPDF", downloadPDF);
    BPMS.Services.Utils.defineService("getPurchaseOrder", getPurchaseOrder);
    BPMS.Services.Utils.defineService("getPurchaseOrderAPI", getPurchaseOrderAPI);


    BPMS.Services.Utils.defineService("getProduceOrder", getProduceOrder);
    BPMS.Services.Utils.defineService("getStock", getStock);
    BPMS.Services.Utils.defineService("getLotStock", getLotStock);
    BPMS.Services.Utils.defineService("getProcessInstance", getProcessInstance);
    BPMS.Services.Utils.defineService("deleteProcessInstance", deleteProcessInstance);
    BPMS.Services.Utils.defineService("getProcessInstances", "runtime/process-instances");
    BPMS.Services.Utils.defineService("postProcessInstance", "runtime/process-instances", {
        "type": "POST"
    });
    BPMS.Services.Utils.defineService("getHistoricDetail", "history/historic-detail");
    BPMS.Services.Utils.defineService("postProcessInstanceLinks", postProcessInstanceLinks);
    BPMS.Services.Utils.defineService("postProcessInstanceVariables", postProcessInstanceVariables);
    BPMS.Services.Utils.defineService("putProcessInstanceVariables", putProcessInstanceVariables);
    BPMS.Services.Utils.defineService("getProcessInstanceVariables", getProcessInstanceVariables);
    BPMS.Services.Utils.defineService("getTaskVariables", getTaskVariables);
    BPMS.Services.Utils.defineService("addInvolvedUser", addInvolvedUser);
    BPMS.Services.Utils.defineService("getProcessInstanceDiagram", getProcessInstanceDiagram);
    BPMS.Services.Utils.defineService("getHistoricProcessInstances", "history/historic-process-instances");
    BPMS.Services.Utils.defineService("queryHistoricProcessInstances", queryHistoricProcessInstances);
    BPMS.Services.Utils.defineService("getHistoricProcessInstance", getHistoricProcessInstance);
    BPMS.Services.Utils.defineService("getActivityInstances", "history/historic-activity-instances");
    BPMS.Services.Utils.defineService("getTaskInstances", "history/historic-task-instances");
    BPMS.Services.Utils.defineService("queryTaskInstances", "query/historic-task-instances", {
        "type": "POST"
    });
    BPMS.Services.Utils.defineService("getVariableInstances", "history/historic-variable-instances");
    BPMS.Services.Utils.defineService("getFormData", "form/form-data");
    BPMS.Services.Utils.defineService("postFormData", "form/form-data", {
        "type": "POST"
    });


    BPMS.Services.Utils.defineService("getProcessDefinitions", "repository/process-definitions");
    BPMS.Services.Utils.defineService("getProcessDefinition", getProcessDefinition);
    BPMS.Services.Utils.defineService("getDeployment", getDeployment);
    BPMS.Services.Utils.defineService("getEmployee", getEmployee);
    BPMS.Services.Utils.defineService("getSuggestion", getSuggestion);
    BPMS.Services.Utils.defineService("getAuto", getAuto);
    BPMS.Services.Utils.defineService("getDelegates", getDelegates);
    BPMS.Services.Utils.defineService("getDelegators", getDelegators);


    BPMS.Services.Utils.defineService("saveDelegate", saveDelegate);
    BPMS.Services.Utils.defineService("deleteDelegate", deleteDelegate);
    BPMS.Services.Utils.defineService("getUsers", getUsers);

    BPMS.Services.Utils.defineService("login", login);
    BPMS.Services.Utils.defineService("getFormRules", getFormRules);
    BPMS.Services.Utils.defineService("getFormRule", getFormRule);
    BPMS.Services.Utils.defineService("getDocument", getDocument);
    BPMS.Services.Utils.defineService("getDocuments", getDocuments);
    BPMS.Services.Utils.defineService("addDocument", addDocument);
    BPMS.Services.Utils.defineService("addUniqueDocument", addUniqueDocument);
    BPMS.Services.Utils.defineService("deleteDocument", deleteDocument);

    BPMS.Services.Utils.defineService("getForm", getForm);
    BPMS.Services.Utils.defineService("getForms", getForms);
    BPMS.Services.Utils.defineService("addForm", addForm);
    BPMS.Services.Utils.defineService("updateForm", updateForm);
    BPMS.Services.Utils.defineService("addUniqueForm", addUniqueForm);
    BPMS.Services.Utils.defineService("deleteForm", deleteForm);
    BPMS.Services.Utils.defineService("getLdapUser", getLdapUser);
    BPMS.Services.Utils.defineService("postIcsNotice", postIcsNotice);
    BPMS.Services.Utils.defineService("getProcessInstanceComments", getProcessInstanceComments);
    BPMS.Services.Utils.defineService("getTaskComments", getTaskComments);
    BPMS.Services.Utils.defineService("postProcessInstanceComments", function (id, data) {
        return BPMS.Services.Utils.request("history/historic-process-instances/" + id + "/comments",
            data, {
            "type": "POST"
        });
    });
    BPMS.Services.Utils.defineService("postTaskComments", function (id, data) {
        return BPMS.Services.Utils.request("runtime/tasks/" + id + "/comments",
            data, {
            "type": "POST"
        });
    });
    BPMS.Services.Utils.defineService("getAccessToken", function () {
        var url = BPMS.config.attachmentUrl + "getAccessToken?" +
            $.param({ agentid: BPMS.config.agentId });
        return $.get(url);
    });
    BPMS.Services.Utils.defineService("getTicket", function (token) {
        var url = BPMS.config.attachmentUrl + "getTicket?" + $.param({
            access_token: token,
            agentid: BPMS.config.agentId
        });
        return $.get(url);
    });
    BPMS.Services.Utils.defineService("sign", function (text) {
        var url = BPMS.config.attachmentUrl + "sign?" + $.param({ text: text });
        return $.get(url);
    });
    BPMS.Services.Utils.defineService("postDependency", postDependency);
    BPMS.Services.Utils.defineService("getDependency", getDependency);
    BPMS.Services.Utils.defineService("getOneLinkage", getOneLinkage);
    BPMS.Services.Utils.defineService("sendCode", sendCode);
    BPMS.Services.Utils.defineService("register", register);
    BPMS.Services.Utils.defineService("getDeployments", "repository/deployments");

    BPMS.Services.Utils.defineService("deleteDeployment", deleteDeployment);
    BPMS.Services.Utils.defineService("getDeployment", getDeployment);
    BPMS.Services.Utils.defineService("postMeta", postMeta);
    BPMS.Services.Utils.defineService("getMetaList", getMetaList);
    BPMS.Services.Utils.defineService("getMeta", getMeta);
    BPMS.Services.Utils.defineService("getSingleData", getSingleData);
    BPMS.Services.Utils.defineService("getJoinData", getJoinData);
})(window.BPMS = window.BPMS || {}, $);

