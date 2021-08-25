(function (BPMS, $) {
    Function.prototype.extend = function (Base) {
        this.prototype = new Base();
        this.prototype.constructor = Base;
    };
    $.fn.doubletap = $.fn.doubletap || function (handler, delay) {
        delay = delay == null ? 300 : delay;
        this.bind('touchend', function (event) {
            var now = new Date().getTime();
            // The first time this will make delta a negative number.
            var lastTouch = $(this).data('lastTouch') || now + 1;
            var delta = now - lastTouch;
            if (delta < delay && 0 < delta) {
                // After we detect a doubletap, start over.
                $(this).data('lastTouch', null);
                if (handler !== null && typeof handler === 'function') {
                    handler(event);
                    return false;
                }
            } else {
                $(this).data('lastTouch', now);
            }
        });
    };
    $.ajaxTransport("+binary", function (options, originalOptions, jqXHR) {
        // check for conditions and support for blob / arraybuffer response type
        if (window.FormData && ((options.dataType && (options.dataType === "binary")) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
            return {
                // create new XMLHttpRequest
                send: function (headers, callback) {
                    // setup all variables
                    var xhr = new XMLHttpRequest(),
                        url = options.url,
                        type = options.type,
                        async = options.async || true,
                        // blob or arraybuffer. Default is blob
                        dataType = options.responseType || "blob",
                        data = options.data || null,
                        username = options.username || null,
                        password = options.password || null;

                    xhr.addEventListener('load', function () {
                        var data = {};
                        data[options.dataType] = xhr.response;
                        // make callback and send data
                        callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                    });

                    xhr.open(type, url, async, username, password);

                    // setup custom headers
                    for (var i in headers) {
                        xhr.setRequestHeader(i, headers[i]);
                    }

                    xhr.responseType = dataType;
                    xhr.send(data);
                },
                abort: function () {
                    jqXHR.abort();
                }
            };
        }
    });
    BPMS.Services = BPMS.Services || {};
    BPMS.Services.Utils = (function () {
        var getImage = function (url) {
            return BPMS.Services.Utils.request(url, null, {
                "dataType": "binary",
                "responseType": "arraybuffer",
                "headers": {
                    'Content-Type': "arraybuffer" // 'image/png',
                },
                processData: false
            });
        };
        var request = function (url, data, settings) {
            settings = settings || {};
            settings.headers = settings.headers || {};
            var defaultSettings = {
                dataType: "json",
                url: url,
                crossDomain: true,
                headers: {}
                //beforeSend: function (xhr) {
                //   xhr.setRequestHeader("authorization", token);
                //}
            };
            $.extend(defaultSettings, settings);
            var serviceUrl = BPMS.config.serviceUrl;
            var token = (settings && settings.token);
            if (!token)
                token = sessionStorage.getItem("bpms_token");
            defaultSettings.headers.Authorization = token;

            if (url.indexOf("http") < 0)
                url = serviceUrl + url;

            var httpsServers = BPMS.config.httpsServers;
            var useHttps = false;
            for (var i in httpsServers) {
                if (url.toLowerCase().indexOf(httpsServers[i]) > 0) {
                    useHttps = true;
                }
            }

            if (useHttps) {
                url = url.replace("http:", "https:");
            }
            defaultSettings.url = url;
            defaultSettings.type = (settings && settings.type) || "GET";
            defaultSettings.dataType = (settings && settings.dataType) || "json";

            defaultSettings.data = data;
            var requestType = defaultSettings.type.toUpperCase();

            if (requestType == "POST" || requestType == "PUT") {
                defaultSettings.headers["Content-Type"] = "application/json";
                defaultSettings.data = defaultSettings.data || {};
                defaultSettings.data = JSON.stringify(defaultSettings.data);
            }
            $.extend(defaultSettings.headers, settings.headers);

            return $.ajax(defaultSettings);
        },

            rebuildImage = function (arrayBuffer) {
                var u8 = new Uint8Array(arrayBuffer);
                var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                var mimetype = "image/png";
                var src = "data:" + mimetype + ";base64," + b64encoded;
                return src;
            },
            defineService = function (name, url, settings) {
                if (arguments.length == 2 && typeof (arguments[1]) == "function")
                    BPMS.Services[name] = arguments[1];
                else
                    BPMS.Services[name] = function (data) {
                        return BPMS.Services.Utils.request(url, data, settings);
                    };

            },
            base64Encode = function (str) {
                var c1, c2, c3;
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                var i = 0,
                    len = str.length,
                    string = '';

                while (i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if (i == len) {
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        string += "==";
                        break;
                    }
                    c2 = str.charCodeAt(i++);
                    if (i == len) {
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        string += "=";
                        break;
                    }
                    c3 = str.charCodeAt(i++);
                    string += base64EncodeChars.charAt(c1 >> 2);
                    string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                    string += base64EncodeChars.charAt(c3 & 0x3F);
                }
                return string;
            },
            base64Decode = function (str) {
                var c1, c2, c3, c4;
                var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
                    58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
                    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                    25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                    37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
                );
                var i = 0,
                    len = str.length,
                    string = '';

                while (i < len) {
                    do {
                        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                    } while (
                        i < len && c1 == -1
                    );

                    if (c1 == -1) break;

                    do {
                        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                    } while (
                        i < len && c2 == -1
                    );

                    if (c2 == -1) break;

                    string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

                    do {
                        c3 = str.charCodeAt(i++) & 0xff;
                        if (c3 == 61)
                            return string;

                        c3 = base64DecodeChars[c3];
                    } while (
                        i < len && c3 == -1
                    );

                    if (c3 == -1) break;

                    string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

                    do {
                        c4 = str.charCodeAt(i++) & 0xff;
                        if (c4 == 61) return string;
                        c4 = base64DecodeChars[c4];
                    } while (
                        i < len && c4 == -1
                    );

                    if (c4 == -1) break;

                    string += String.fromCharCode(((c3 & 0x03) << 6) | c4);
                }
                return string;
            },
            getAuthToken = function (username, password) {
                var rawStr = username + ':' + password;
                var encodeStr = base64Encode(rawStr);
                var token = "Basic " + encodeStr;
                return token;
            };
        var postFile = function (url, data, headers) {
            var dfd = $.Deferred();
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                if (this.status === 200) {
                    var filename = "";
                    var disposition = xhr.getResponseHeader('Content-Disposition');

                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        var matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                    }
                    var type = xhr.getResponseHeader('Content-Type');
                    var supportFile = typeof File === 'function';

                    var blob = supportFile
                        ? new File([this.response], filename, { type: type })
                        : new Blob([this.response], { type: type });

                    //var out = new Blob([this.response], { type: 'application/pdf' });
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {

                        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var URL = window.URL || window.webkitURL;
                        var downloadUrl = URL.createObjectURL(blob);

                        if (filename) {
                            // use HTML5 a[download] attribute to specify filename
                            var a = document.createElement("a");
                            // safari doesn't support this yet
                            if (typeof a.download === 'undefined') {
                                //window.location = downloadUrl;
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    window.location.href = reader.result;
                                }
                                reader.readAsDataURL(blob);
                            } else {
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                            }
                        } else {
                            window.location = downloadUrl;
                        }
                        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 1000);
                    }
                    dfd.resolve(filename);
                } else {
                    dfd.reject();
                }
            };
            if (headers) {
                for (var i in headers) {
                    xhr.setRequestHeader(i, headers[i]);
                }
            }
            if (typeof (data) === "object") {
                data = JSON.stringify(data);
            }
            xhr.send(data);
            return dfd.promise();
        }
        var getUrlParams = function (url) {
            var vars = {},
                hash;
            //var url = decodeURIComponent(url);
            url = url.trim();
            var tempIndex = url.indexOf('?');
            if (tempIndex < 0) {
                return vars;
            }
            var hashes = url.slice(tempIndex + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                //vars.push(hash[0]);
                vars[hash[0]] = decodeURIComponent(hash[1]);
            }
            return vars;
        };
        var getUrlParam = function (url, key) {
            return getUrlParams(url)[key];
        };

        var analyseId = function (id) {
            var itemInfo = {
                "id": id
            };
            id = id.split("$$");
            if (id.length == 2)
                itemInfo.block = (id[1] || "").toUpperCase();
            id = id[0].replace(/^_+|_+$/g, '');


            var sections = id.split("_");
            if (sections.length === 1) {
                return itemInfo;
            }

            if (sections[4] === "t9") {
                //    "id": "attachment_附件_7_string_t9_$$A",
                itemInfo.type = "attachment";
                itemInfo.name = sections[1];
                //itemInfo.seq = parseInt(sections[2], 10);
                itemInfo.fieldType = sections[3].toLowerCase();
                itemInfo.controlType = sections[4];
                return itemInfo;
            }
            // 0:"coreaction"
            // 1:"string"
            // 2:"fs"
            if (sections[0].indexOf("tb") == 0) {
                itemInfo.table = sections[0];
                if (sections.length === 2 && sections[1] == "item") {
                    itemInfo.type = "tableItem";
                }
                else {
                    itemInfo.type = "tableField";
                    itemInfo.name = sections[1];
                    itemInfo.field = sections[2];
                    itemInfo.seq = parseInt(sections[3], 10);
                    itemInfo.fieldType = sections[4] && sections[4].toLowerCase() || "string";
                    itemInfo.controlType = sections[5] && sections[5].toLowerCase() || "t1";
                }
                return itemInfo;

            }
            if (sections.length == 2) {
                return itemInfo;
            }

            itemInfo.type = "field";
            itemInfo.field = sections[0];
            itemInfo.name = sections[1];
            itemInfo.seq = parseInt(sections[2], 10);
            itemInfo.fieldType = sections[3] && sections[3].toLowerCase() || "string";
            itemInfo.controlType = sections[4] && sections[4].toLowerCase() || "t1";
            return itemInfo;
        };
        var resetFields = function (fields) {
            for (var index in fields) {
                var f = fields[index];
                var name = f.id.replace(/\$/g, "").replace(/ /g, "");
                var $e = $("[name='" + name + "']");
                if (f.controlType == "t1" ||
                    f.controlType == "t3" ||
                    f.controlType == "t4" ||
                    f.controlType == "t5" ||
                    f.controlType == "t6" ||
                    f.controlType == "t7" ||
                    f.controlType == "t8" ||
                    f.controlType == "t9i" ||
                    f.controlType == "t10" ||
                    f.controlType == "t11" ||
                    f.controlType == "psbi" ||
                    f.controlType == "psbm" ||
                    f.controlType == "psbn" ||
                    f.controlType == "sbs" ||
                    f.controlType == "sbm" ||
                    f.controlType == "sbft")
                    $e = $e.parent();
                else if (f.controlType == "cbh" ||
                    f.controlType == "cbv" ||
                    f.controlType == "rbh" ||
                    f.controlType == "rbv")
                    $e = $e.children();

                $e.removeClass("ui-invalid");
                var clearBtn = $("[name='" + name + "']").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                if (clearBtn && clearBtn.length && f.controlType !== "cny") {
                    clearBtn.click();
                }
                if (f.attachments) {
                    f.attachments.removeAll();
                }
                var dynamicValue = f.value;
                var newValue = typeof (f.defaultValue) === "undefined" ? null : f.defaultValue;
                dynamicValue(newValue);
                if (ko.isObservable(f.disabled)) {
                    f.disabled(false);
                }
            }
        };

        var validateFields = function (fields, byStep) {
            var result = true;

            for (var index in fields) {
                var f = fields[index];
                var controlType = f.controlType || "t1";
                var invalid = false;
                var val = ko.unwrap(f.value);
                var empty = typeof (val) == "undefined" || val == null ||
                    typeof (val) == "string" && val.trim() == "" || controlType === "t9i" && (!val || val === JSON.stringify([]));


                if (ko.unwrap(f.required) && !BPMS.Services.Utils.isJoinKey(f) && empty) {
                    invalid = true;
                }

                switch (f.controlType) {
                    case "t6":
                        var numberValue = Number()
                        if (val &&
                            (typeof (f.min) !== "undefined" && Number(val) < f.min ||
                                typeof (f.max) !== "undefined" && Number(val) > f.min)) {
                            invalid = true;
                        }
                        break;

                    case "t7":
                        // var isMail = jQuery.validator.methods.email.call(jQuery.validator.prototype, val);
                        var reg = /^([a-zA-Z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/;
                        var isMail = reg.test(val);
                        if (!isMail && val)
                            invalid = true;
                        break;

                    case "t10":
                        for (var i in val) {
                            if ("1234567890".indexOf(val[i]) < 0)
                                invalid = true;

                        }
                        break;
                    default:
                        break;
                }
                f.invalid(invalid);

                var $e = $("[name='" + f.id.replace(/\$/g, "").replace(/ /g, "") + "']");
                if (f.controlType == "t1" ||
                    f.controlType == "t3" ||
                    f.controlType == "t4" ||
                    f.controlType == "t5" ||
                    f.controlType == "t6" ||
                    f.controlType == "t7" ||
                    f.controlType == "t8" ||
                    f.controlType == "t9i" ||
                    f.controlType == "t10" ||
                    f.controlType == "t11" ||
                    f.controlType == "psbi" ||
                    f.controlType == "psbm" ||
                    f.controlType == "psbn" ||
                    f.controlType == "tree" ||
                    f.controlType == "relation" ||
                    f.controlType == "auto" ||
                    f.controlType == "cny" ||
                    f.controlType == "sbs" ||
                    f.controlType == "sbm" ||
                    f.controlType == "sbft")
                    $e = $e.parent();
                else if (f.controlType == "cbh" ||
                    f.controlType == "cbv" ||
                    f.controlType == "rbh" ||
                    f.controlType == "rbv")
                    $e = $e.children();

                if (invalid)
                    $e.addClass("ui-invalid");
                else
                    $e.removeClass("ui-invalid");
                if (invalid) {
                    result = false;
                    if (byStep) {
                        return result;
                    }
                }
            }

            return result;
        };

        var getTable = function (tables, name) {
            var matched = tables.filter(function (t) {
                return t.tableName === name;
            });
            return matched[0];
        };

        var findSubTables = function (tables) {
            var names = tables.map(function (table) {
                return table.tableName;
            });
            for (var i in tables) {
                var tempTable = tables[i];
                ko.unwrap(tempTable.headers).forEach(function (item) {
                    var fieldName = (item.propertyId || item.id).split("_")[1];

                    var subName = tempTable.tableName + "-" + fieldName;
                    var foundName = names.filter(function (name) {
                        return name === subName;
                    })[0];
                    if (foundName) {
                        var subIndex = names.indexOf(foundName);
                        var subTable = tables[subIndex];
                        subTable.parentTable = tempTable;
                        subTable.parentField = item;
                        item.subTable = subTable;
                    }
                });
            }
        }

        var buildTables = function (tables, rebuild, $root) {
            if (!tables.length)
                return tables;

            for (var i in tables) {
                var tempTable = tables[i];
                if (!rebuild) {
                    tempTable.editable = false;
                }

                var noRead = tempTable.item && (!tempTable.item.readable);
                var noWrite = tempTable.item && (!tempTable.item.writable);


                var uniqueHeaders = [];
                tempTable.headers.forEach(function (item) {
                    if (uniqueHeaders.filter(function (uniqueItem) {
                        return uniqueItem.name && (uniqueItem.name == item.name);
                    }).length == 0)
                        uniqueHeaders.push(item);
                });

                tempTable.headers = uniqueHeaders;

                tempTable.headers.sort(function (a, b) {
                    return a.seq - b.seq;
                });

                tempTable.headers.forEach(function (item) {
                    if (noRead)
                        item.readable = false;
                    if (noWrite)
                        item.writable = false;
                });
                if (!ko.isObservable(tempTable.rows)) {
                    tempTable.rows = ko.observableArray(tempTable.rows);
                }
                var rows = ko.unwrap(tempTable.rows);
                if (rows.length && tempTable.fullHeaders) {
                    var newRows = [];
                    rows.forEach(function (r) {
                        var newRow = [];
                        tempTable.headers.forEach(function (header) {
                            var matchHeader = tempTable.fullHeaders.filter(function (h) {
                                var hid = h.id;
                                return hid && hid.replace(/_\$\$.*/, "") == header.id.replace(/_\$\$.*/, "");
                            })[0];
                            var cell = r[tempTable.fullHeaders.indexOf(matchHeader)];
                            newRow.push(cell);
                        });
                        newRows.push(newRow);
                    });

                    tempTable.rows(newRows);
                }
                tempTable.showFullText = function (data, e) {
                    var t = e.target;
                    var link = (t.tagName.toLowerCase() !== "a") ? $(t).closest("a") : $(t);
                    data = data.trim().replace(/\r/g, "").replace(/\n/g, "<br/>");
                    var root = $root || ko.contextFor(t).$root;
                    root.pop("fullText", {
                        "description": data,
                        "positionTo": "#" + link.attr("id")
                    });
                };
                tempTable.showSubTable = function (data, root, index) {
                    root = root.detail || root;
                    //var index = this.rows().indexOf(parent);
                    root.exampleTable(null);
                    var field = ko.unwrap(this.headers)[index];
                    var newTable = {};
                    for (var i in field.subTable) {
                        newTable[i] = field.subTable[i];
                    }
                    newTable.editable = false;
                    newTable.subValues = data || "";
                    root.exampleTable(newTable);
                    $("#popSubTable table").table().table("refresh")
                    $("#popSubTable").popup("open");
                };
                tempTable.isMultiText = function (value) {
                    value = ko.unwrap(value);
                    var type = typeof (value);
                    return (type == "string" && value.indexOf("\n") >= 0);
                };
                tempTable.isAttachment = function (value, headers, index) {
                    var isControl = ko.unwrap(headers)[ko.unwrap(index)].controlType === "t9i";

                    if (isControl && typeof (value) == "string") {
                        value = JSON.parse(value || "[]");
                    }
                    var hasData = value && value.length;
                    return isControl && hasData;
                };

                tempTable.isSubField = function (value, index) {
                    return !!ko.unwrap(this.headers)[index].subTable;
                };
                tempTable.showCell = function (index) {
                    var field = ko.unwrap(this.headers)[index];

                    return !!field && !/\$\$H/i.exec(field.id) && !BPMS.Services.Utils.isJoinKey(field);
                };
                tempTable.getSum = function (index) {
                    var table = this;
                    var field = ko.unwrap(this.headers)[index];

                    if (field.controlType !== "t11" && field.controlType !== "cny") {
                        return "";
                    }
                    var sum = 0;

                    this.rows().forEach(function (row) {
                        if (table.isOwnRow(row)) {
                            var value = row[index];
                            if (value === null || typeof (value) === "undefined") {
                                value = "";
                            }
                            sum += Number(value);
                        }
                    });
                    return BPMS.Services.Utils.formatMoney(sum);

                };
                tempTable.isOwnRow = function (row) {
                    if (!this.parentField) {
                        return true;
                    }
                    var subValues = typeof (this.subValues) === "undefined" ? this.parentField.value() : this.subValues;
                    var items = subValues ? subValues.split(",") : [];

                    var headers = ko.unwrap(this.headers);
                    var subField = headers.filter(function (header) {
                        return BPMS.Services.Utils.isJoinKey(header);
                    })[0];
                    var index = headers.indexOf(subField);

                    if (!row[index] || items.indexOf(row[index]) >= 0) {
                        return true;
                    }
                    return false;
                };
                tempTable.getQuickField = function (value, headers, columnIndex, rowIndex) {
                    var header = ko.unwrap(headers)[ko.unwrap(columnIndex)];
                    var newId = header.id.replace(/_\$\$.*/g, Math.random().toString(36).substr(3, 3));
                    var newValue = ko.observable(ko.unwrap(value));
                    var that = this;

                    newValue.subscribe(function (v) {
                        var row = that.rows()[ko.unwrap(rowIndex)];
                        row[ko.unwrap(columnIndex)] = v;
                    });
                    var newHeader = {
                        ignoreLabel: true,
                        controlType: header.controlType,
                        disabled: header.disabled,
                        enumValues: header.enumValues,
                        fieldType: header.fieldType,
                        id: newId,
                        name: header.name,
                        readable: header.readable,
                        seq: header.seq,
                        type: header.type,
                        value: newValue,
                        visible: header.visible,
                        writable: header.writable,
                    };
                    return newHeader;
                };
                tempTable.formatCell = function (value, headers, index) {
                    value = ko.unwrap(value);
                    if (typeof (value) === "string" && value.indexOf("\n") >= 0) {
                        //var fullValue = value.trim().replace(/\r/g, "").replace(/\n/, "<br/>");
                        value = value.trim().split("\n")[0].trim() + "...";
                        return value;
                    }

                    if (!headers) {
                        return value;
                    }

                    var allHeaders = ko.unwrap(headers);
                    var indexValue = ko.unwrap(index);
                    if (!allHeaders[indexValue]) {
                        return "";
                    }
                    var type = allHeaders[indexValue].controlType;
                    type = type || "";

                    if (type == "t3" || type == "t4" || type == "t5") {
                        if (typeof (value) == "number" && !isNaN(value)) {
                            value = BPMS.Services.Utils.formatDateTime(value, type);
                            return value;
                        }
                        if (typeof (value) == "string" && value) {
                            value = BPMS.Services.Utils.formatDateTime(Number(value), type);
                            return value;
                        }
                    }
                    // if (type == "t6") {
                    //     if (typeof(value) == "string" && value.length > 0) {
                    //         value = Number(value).toString();
                    //         return value;
                    //     }
                    // }
                    if (type == "t11") {
                        if (typeof (value) == "string" && value || typeof (value) == "number") {
                            value = BPMS.Services.Utils.formatMoney(value);
                            return value;
                        } else {
                            value = "";
                            return value;
                        }
                    }

                    if (type == "t9i") {
                      if(value == 'null'){
                        value = 0
                      }else{
                        value = JSON.parse(value || "[]").length;
                      }
                      return value;
                    }

                    if (type == "cny") {
                        if (typeof (value) == "string" && value || typeof (value) == "number") {
                            value = BPMS.Services.Utils.formatMoney(value);//moneyToBig
                            return value;
                        } else {
                            value = "";
                            return value;
                        }
                    }

                    if (type === "auto" || type === "tree" || type === "relation") {
                        return value && value.name || "";
                    }

                    if (type === "join") {
                        return "";
                        //  value = value ? value.split(",").length : 0;
                    }
                    if (type === "cbv") {
                        return value ;
                    }

                    return value;
                };
            }

            tables = tables.filter(function (t) {
                return t && t.headers.length;
            });
            var result = [];
            for (var i in tables) {

                var table = tables[i];
                if (!table.editable) {
                    result.push(table);
                    continue;
                }

                var newTable = {
                    editable: true,
                    tableName: table.tableName,
                    name: table.name || table.item.name,
                    headers: ko.observableArray(),
                    rows: ko.observableArray(),
                    item: table.item,
                    isMultiText: table.isMultiText,
                    isAttachment: table.isAttachment,
                    showFullText: table.showFullText,
                    isSubField: table.isSubField,
                    isOwnRow: table.isOwnRow,
                    showSubTable: table.showSubTable,
                    formatCell: table.formatCell,
                    getQuickField: table.getQuickField,
                    showCell: table.showCell,
                    getSum: table.getSum,
                    editIndex: ko.observable(-1),
                    uploadTableFlag: ko.observable(false),
                    toggleUploadTableFlag: function () {
                        this.uploadTableFlag(!this.uploadTableFlag());
                    },
                    importRow: function (names, cells) {
                        var convertCell = function (controlType, value) {
                            if (typeof (value) == "undefined") {
                                return null;
                            }
                            if (controlType === "t3" ||
                                controlType === "t4" ||
                                controlType === "t5") {
                                return moment(new Date(value)).format("x");
                            }
                            if (controlType === "tree" || controlType === "auto") {
                                var parts = value.split(/[\(\)\[\]（）]/);
                                if (parts.length < 2) {
                                    return null;
                                }
                                return {
                                    code: parts[0],
                                    name: parts[1]
                                }
                            }
                            if (controlType === "relation") {
                                var parts = value.split(/[\(\)\[\]（）]/);
                                if (parts.length < 2) {
                                    return null;
                                }
                                return {
                                    sn: parts[0],
                                    name: parts[1]
                                }
                            }
                            return value.toString();
                        };
                        var row = [];
                        for (var i in this.headers()) {
                            var head = this.headers()[i];
                            var index = names.indexOf(head.name);
                            var value = convertCell(head.controlType, cells[index]);

                            row.push(value);
                        }
                        this.rows.push(row);
                        $("table[data-role='table']").each(function () {
                            if (ko.contextFor(this).editable) {
                                var tableWidget = $.data(this, "mobile-table");
                                tableWidget && tableWidget.refresh();
                            }
                        });
                    },
                    processWorkbook: function (wb) {
                        var ws = wb.Sheets[wb.SheetNames[0]];
                        var tb = this;
                        var aoa = XLSX.utils.sheet_to_json(ws, { header: 1 });
                        if (aoa.length > 1) {
                            var names = aoa.shift();
                            aoa.forEach(function (row) {
                                tb.importRow(names, row);
                            });
                        }
                        $("#tableUpload").val("");
                        this.toggleUploadTableFlag();
                    },
                    uploadTable: function (model, oEvent) {
                        var tb = this;
                        var rABS = true;
                        var files = oEvent.target.files;
                        var f = files[0];
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var data = e.target.result;

                            if (!rABS) data = new Uint8Array(data);
                            var workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
                            tb.processWorkbook(workbook);
                        };
                        if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
                    },
                    removeRow: function (row) {
                        if (this.editIndex() >= 0) {
                            if ($root) {
                                $root.pop("error", {
                                    "title": "不可刪除行项目",
                                    "description": "请先完成行项目的编辑。"
                                });
                            }
                            return;
                        }
                        this.rows.remove(row);
                        $("table[data-role='table']").each(function () {
                            if (ko.contextFor(this).editable) {
                                var tableWidget = $.data(this, "mobile-table");
                                tableWidget && tableWidget.refresh();
                            }
                        });
                    },
                    editRow: function (row, index, root) {
                        this.editIndex(index);
                        for (var i in this.headers()) {
                            var header = this.headers()[i];
                            if (header.controlType === "t9i"
                                && header.attachments
                                && typeof (row[i]) === "string") {
                                header.attachments(JSON.parse(row[i]));
                            }
                            header.value(row[i]);
                            var visible = !/\$\$H/i.exec(header.id);
                            header.visible(visible);
                            var disabled = !!/\$\$V/i.exec(header.id);
                            header.disabled(disabled);
                        }
                        var pageId = jQuery.mobile.activePage.attr("id");
                        if (pageId !== "subTableEdit") {
                            this.setIndex();
                            $.mobile.changePage('#tableEdit');
                        }


                    },
                    setIndex: function () {
                        var tbIndex = null;
                        var eles = $("div[tableName]");
                        var name = this.tableName;
                        eles.each(function (index, ele) {
                            if ($(ele).attr("tableName") === name) {
                                tbIndex = index;
                            }
                        });
                        var $root = ko.contextFor(document.body).$root;
                        if ($root.detail) {
                            $root = $root.detail;
                        }
                        $root.tableIndex(tbIndex);
                    },

                    editSubTable: function (field) {
                        var model = $root.detail || $root;
                        for (var i in field.subTable) {
                            var property = field.subTable[i];
                            if (!ko.isObservable(model.subTable[i])) {
                                model.subTable[i] = property;
                            }
                        }
                        for (var i in field.subTable) {
                            var property = field.subTable[i];
                            if (ko.isObservable(model.subTable[i])) {
                                model.subTable[i](ko.unwrap(property));
                            }
                        }
                        model.subTable.headers().forEach(function (field) {
                            field.required = ko.observable(ko.unwrap(field.required));
                            var visible = !/\$\$H/i.exec(field.id);
                            field.visible = ko.observable(visible);
                            field.disabled = ko.observable(false);
                        });
                        model.subTable.name(field.subTable.item.name || "");
                        // if( model.subTable()){
                        //     for(var i in field.subTable){
                        //         var property = field.subTable[i];
                        //         if(ko.isObservable(property)){
                        //             model.subTable()[i](property());
                        //         }else{
                        //             model.subTable()[i] = property;
                        //         }
                        //     }
                        // }else{
                        //     model.subTable(field.subTable);
                        // }
                        model.joinField = field;
                        this.resetRow();
                        $.mobile.changePage('#subTableEdit');
                    },


                    saveSubTable: function () {
                        for (var i in this.headers()) {
                            var header = this.headers()[i];
                            if (BPMS.Services.Utils.isJoinKey(header)) {
                                break;
                            }
                        }
                        var items = [];
                        var oldItems = (this.parentField.value() || "").split(",");
                        var rows = this.rows();
                        var stamp = BPMS.Services.Utils.getCurrentTimeStamp();
                        for (var j in rows) {
                            var row = rows[j];
                            var value = row[i];
                            var isNew = !value;

                            if (isNew) {
                                row[i] = (stamp++).toString();
                            }
                            var isSub = oldItems.indexOf(value) >= 0;
                            if (isNew || isSub) {
                                items.push(row[i])
                            }

                        }
                        this.parentField.value(items.toString());
                        $.mobile.changePage('#tableEdit');
                    },
                    copyRow: function (row, index) {
                        if (this.editIndex() >= 0) {
                            if ($root) {
                                $root.pop("error", {
                                    "title": "不可复制行项目",
                                    "description": "请先完成行项目的编辑。"
                                });
                            }
                            return;
                        }
                        var newRow = JSON.parse(JSON.stringify(row));

                        ko.unwrap(this.headers).forEach(function (header, i) {
                            if (BPMS.Services.Utils.isJoinKey(header) || header.subTable) {
                                newRow[i] = null;
                            }
                        })

                        this.rows.push(newRow);
                        $("table[data-role='table']").each(function () {
                            if (ko.contextFor(this).editable) {
                                var tableWidget = $.data(this, "mobile-table");
                                tableWidget && tableWidget.refresh();
                            }
                        });
                    },
                    autoNext: function (index) {
                        var fields = this.steps()[index];
                        var field = fields && fields[0];
                        if (fields.length == 1 && field.value.getSubscriptionsCount() === 0) {
                            fields[0].value.subscribe(function (val) {
                                if (typeof (val) !== "undefined" &&
                                    val !== null &&
                                    val !== "" &&
                                    $.mobile.activePage.attr("id") === "extraEdit") {
                                    this.getStep(index);
                                }
                            }, this);
                        }
                    },
                    saveRow: function () {
                        var row = [];
                        if (!BPMS.Services.Utils.validateFields(this.headers())) {
                            if ($root) {
                                $root.pop("error", {
                                    "title": "输入错误",
                                    "description": "您的输入有误，请重新输入。"
                                });
                            }
                            return;
                        }

                        for (var i in this.headers()) {
                            var head = this.headers()[i];
                            var dynamicValue = head.value;
                            var value = dynamicValue();

                            row.push(value);
                        }
                        var index = this.editIndex();
                        if (index >= 0) {
                            this.rows.splice(index, 1, row);
                        } else {
                            this.rows.push(row);
                        }
                        this.editIndex(-1);
                        BPMS.Services.Utils.resetFields(this.headers());
                        $("table[data-role='table']").each(function () {
                            if (ko.contextFor(this).editable) {
                                var tableWidget = $.data(this, "mobile-table");
                                tableWidget && tableWidget.refresh();
                            }
                        });
                        if (!this.parentField) {
                            var page = $("#pageExec").length ? "#pageExec" : "#";
                            $.mobile.changePage(page);
                        }
                    },
                    resetRow: function () {
                        this.editIndex(-1);

                        BPMS.Services.Utils.resetFields(this.headers());
                        for (var i in this.headers()) {
                            var header = this.headers()[i];
                            header.visible(true);
                            header.disabled(false);
                        }
                    }
                };

                var stepFields = table.headers.filter(function (field) {
                    return field.seq <= 0;
                });


                result.push(newTable);
                newTable.rows(ko.unwrap(table.rows));
                newTable.headers(table.headers);
                newTable.steps = ko.observableArray();
                newTable.headers().forEach(function (field) {
                    //field.defaultValue = ko.unwrap(field.value);
                    field.required = ko.observable(ko.unwrap(field.required));
                    var visible = !/\$\$H/i.exec(field.id);
                    field.visible = ko.observable(visible);
                    field.disabled = ko.observable(false);
                });
                if (stepFields.length) {
                    newTable.steps.push(stepFields);
                    newTable.autoNext(0);
                    newTable.saveExtraRow = function () {
                        var table = this;
                        var row = [];
                        if (!BPMS.Services.Utils.validateFields(table.headers())) {
                            ko.contextFor(document.body).$root.pop("error", {
                                "title": "输入错误",
                                "description": "您的输入有误，请重新输入。"
                            });
                            return;
                        }

                        for (var i in table.headers()) {
                            var head = table.headers()[i];
                            var dynamicValue = head.value;
                            var value = dynamicValue();
                            row.push(value);
                        }
                        if (table.editIndex() >= 0) {
                            table.rows.splice(table.editIndex(), 1, row);
                        } else {
                            table.rows.push(row);
                        }

                        table.resetExtraForm();
                        $("table[data-role='table']").each(function () {
                            if (ko.contextFor(this).editable) {
                                var tableWidget = $.data(this, "mobile-table");
                                tableWidget && tableWidget.refresh();
                            }
                        });
                        $.mobile.changePage('#');
                    };

                    newTable.resetExtraForm = function () {
                        this.editIndex(-1);
                        BPMS.Services.Utils.resetFields(this.headers());
                        this.steps.splice(1);
                        this.steps()[0].forEach(function (header) {
                            header.visible(true);
                            header.disabled(false);
                        });
                    };


                    newTable.addExtraRow = function (exampleTable, row, index) {
                        var $root = ko.contextFor(document.body).$root;
                        if (this.editIndex() >= 0) {
                            if ($root) {
                                $root.pop("error", {
                                    "title": "不可添加行项目",
                                    "description": "请先完成行项目的编辑。"
                                });
                            }
                            return;
                        }
                        if (exampleTable) {
                            exampleTable.rows.removeAll();
                            var exampleElement = $("#extraEdit table[data-role='table']")[0];
                            if (exampleElement) {
                                var tableWidget = $.data(exampleElement, "mobile-table");
                                tableWidget && tableWidget.refresh();
                            }
                        }

                        this.resetExtraForm();

                        $.mobile.changePage('#extraEdit');
                    };



                    newTable.editExtraRow = function (row, index) {
                        var $root = ko.contextFor(document.body).$root;
                        var table = this;

                        var headers = table.headers();
                        table.steps.splice(1);
                        var currentFields = Array.prototype.concat.apply([], table.steps());
                        if (currentFields.length >= headers.length) {
                            return;
                        }

                        $root.loading(true);

                        var condition = {};
                        currentFields.forEach(function (field, i) {
                            var value = ko.unwrap(row[i]);
                            if (field.controlType === "tree" ||
                                field.controlType === "auto") {
                                value = value && value.code;
                            }
                            if (field.controlType === "relation") {
                                value = value && value.sn;
                            }
                            condition[field.id] = value;
                        });

                        BPMS.Services.getRules(table.tableName.replace(/tbhd/i, "") + ".xls", [condition]).then(function (response) {
                            var properties = response && response[0];
                            if (!properties) {
                                return;
                            }

                            for (var i in headers) {
                                var field = headers[i];
                                var property = properties[field.id];
                                if (property && currentFields.indexOf(field) < 0) {
                                    var obj = JSON.parse(property);
                                    //RODX
                                    var indicator = obj.edit;
                                    field.required(indicator === "R");
                                }
                            }
                            $root.loading(false);
                        }, function () {

                        });

                        table.editIndex(index);

                        for (var i in headers) {
                            var header = headers[i];
                            header.value(row[i]);
                            var visible = !/\$\$H/i.exec(header.id);
                            header.visible(visible);
                            var disabled = !!/\$\$V/i.exec(header.id);
                            header.disabled(disabled);
                        }
                        this.setIndex();
                        $.mobile.changePage('#tableEdit');
                    };


                    // newTable.editExtraRow = function (exampleTable, row, index) {
                    //     //var root = ko.contextFor(document.body).$root;
                    //     exampleTable.rows.removeAll();
                    //     if (row) {
                    //         exampleTable.rows.push(row);
                    //     }
                    //     var exampleElement = $("#extraEdit table[data-role='table']")[0];
                    //     if (exampleElement) {
                    //         var tableWidget = $.data(exampleElement, "mobile-table");
                    //         tableWidget.refresh();
                    //     }
                    //     this.resetExtraForm();
                    //     this.editIndex(typeof (index) === "number" ? index : -1);
                    //     var headers = this.headers();

                    //     if (row) {
                    //         this.steps()[0].forEach(function (field) {
                    //             var index = headers.indexOf(field);
                    //             field.value(row[index]);
                    //         });
                    //     }

                    //     $.mobile.changePage('#extraEdit');
                    // };

                    newTable.canSaveExtra = function () {
                        var table = this;
                        if (!table) {
                            return false;
                        }
                        var step = table.steps()[table.steps().length - 1];
                        if (!step || !step.length) {
                            return false;
                        }
                        return step[step.length - 1].isEnd;
                    };

                    newTable.getStep = function (index) {
                        var table = this;
                        var headers = table.headers();
                        table.steps.splice(index + 1);
                        var currentFields = Array.prototype.concat.apply([], table.steps());
                        if (currentFields.length >= headers.length) {
                            return;
                        }
                        if (!BPMS.Services.Utils.validateFields(currentFields)) {
                            $root.pop("error", {
                                "title": "输入错误",
                                "description": "您的输入有误，请重新输入。"
                            });
                            return;
                        }

                        $root.loading(true);

                        var condition = {};
                        currentFields.forEach(function (field) {
                            var value = ko.unwrap(field.value());
                            if (field.controlType === "tree" ||
                                field.controlType === "auto") {
                                value = value && value.code;
                            }
                            if (field.controlType === "relation") {
                                value = value && value.sn;
                            }
                            condition[field.id] = value;

                        });

                        BPMS.Services.getRules(table.tableName.replace(/tbhd/i, "") + ".xls", [condition]).then(function (response) {
                            var properties = response && response[0];
                            if (!properties) {
                                return;
                            }
                            currentFields.forEach(function (field) {
                                field.disabled(true);
                            });
                            var newFields = [];

                            for (var i in headers) {
                                var field = headers[i];
                                var property = properties[field.id];
                                if (property && currentFields.indexOf(field) < 0) {
                                    var obj = JSON.parse(property);
                                    //RODX
                                    var indicator = obj.edit;
                                    field.visible(indicator !== "X");
                                    field.required(indicator === "R");
                                    field.disabled(indicator === "D");
                                    field.value(obj.defaultvalue);
                                    newFields.push(field);
                                }
                            }
                            $root.loading(false);
                            if (newFields.length === 0) {
                                return;
                            }
                            var isEnd = currentFields.length + newFields.length >= headers.length;
                            newFields[newFields.length - 1].isEnd = isEnd;
                            table.steps.push(newFields);
                            table.autoNext(index + 1);
                        }, function (err) {
                            $root.loading(false);
                            var detailMessage = (err && err.responseJSON && err.responseJSON.exception) || "该请求无法成功处理，请稍后重试";
                            $root.pop("error", {
                                "title": "规则加载失败",
                                "description": "加载" + table.tableName + "显示规则失败",
                                "detail": "错误信息：" + detailMessage,
                                "code": "错误代码：" + err.status + " " + err.statusText
                            });
                        });
                    }
                }
            }
            result.sort(function (a, b) {
                return a.seq - b.seq;
            });
            findSubTables(result);
            return result;
        };

        var mapType = function (type, subtype) {
            var mapping = {
                text: {
                    text: ["t1", "string"],
                    password: ["t8", "string"],
                    email: ["t7", "string"],
                    tel: ["t10", "string"],
                },
                textarea: ["t2", "string"],
                date: {
                    "date": ["t3", "string"],
                    "time": ["t4", "string"],
                    "datetime": ["t5", "string"],
                    "datetime-local": ["t5", "string"]
                },
                file: {
                    file: ["t9i", "string"],
                    "file-in-tab": ["t9", "string"]
                },
                number: {
                    number: ["t6", "string"],
                    money: ["t11", "string"]
                },
                remotecomplete: {
                    psbi: ["psbi", "string"],
                    psbm: ["psbm", "string"],
                    psbn: ["psbn", "string"],
                    bpid: ["bpid", "string"]
                },
                "checkbox-group": {
                    vertical: ["cbv", "enum"],
                    horizontal: ["cbh", "enum"],
                },
                "radio-group": {
                    vertical: ["rbv", "enum"],
                    horizontal: ["rbh", "enum"],
                },
                select: {
                    single: ["sbs", "enum"],
                    multiple: ["sbm", "enum"],
                    filterable: ["sbft", "enum"]
                },
                flipswitch: ["fs", "enum"],
                auto: ["auto", "string"],
                join: ["join", "string"]
            };
            var mapped = mapping[type];
            if (Array.isArray(mapped)) {
                return mapped;
            }
            if (mapped) {
                return mapped[subtype];
            }
            return null;
        };
        //read write hide
        var formatFormData = function (formFields) {
            var groups = [[]];
            var result = [];
            var lines = [];
            var tables = [];
            var attachments = [];
            var formatAccessibility = function (field) {
                var map = {
                    "write": "",
                    "read": "V",
                    "hide": "H"
                }
                return map[field.accessibility] || "";
            };

            var isRealField = function (f) {
                return f && f.type !== "header" && f.type !== "split";
            };
            for (var i = 0; i < formFields.length; i++) {

                var field = JSON.parse(JSON.stringify(formFields[i]));
                field.accessibility = field.accessibility || "write";
                var type = field.type;
                var subtype = field.subtype;
                if (subtype === "file-in-tab") {
                    attachments.push(field);
                    continue;
                }
                if (type === "header" || type === "split") {
                    groups.push([]);
                }
                groups[groups.length - 1].push(field);
            }
            groups = groups.filter(function (group) {
                return group.filter(isRealField).length;
            });

            tables = groups.filter(function (group) {
                return group[0].type === "header";
            });
            lines = groups.filter(function (group) {
                return group[0].type !== "header";
            });
            var getField = function (field, i, block) {
                var types = mapType(field.type, field.subtype);
                if (!types) {
                    return null;
                }
                var ctrType = types[0];
                var dataType = field.accessibility === "write" ? types[1] : "string";
                var id = field.name + "_" + field.label + "_" + (i) + "_" + types[1] + "_" + ctrType;
                var accFlag = formatAccessibility(field.accessibility);
                if (block || accFlag) {
                    id += "_" + "$$" + accFlag + block;
                }
                var item = {
                    "id": id,
                    "name": field.label,
                    "type": dataType,
                    "value": null,
                    "readable": true,
                    "writable": field.accessibility === "write",
                    "required": !!field.required,
                    "datePattern": null,
                    "enumValues": [],
                    "variable": field.variable,
                    "dataset": field.dataset,
                    "listen": field.listen,
                    "source": field.source,
                    "target": field.target
                };
                if (dataType === "enum") {
                    item.enumValues = field.values.map(function (option) {
                        return { id: option.value, name: option.label };
                    });
                }
                return item;
            };
            lines.forEach(function (line, i) {
                var block = String.fromCharCode(65 + i);

                line.forEach(function (field, j) {
                    var item = getField(field, j + 1, block);
                    if (item) {
                        result.push(item);
                    }
                });
            });
            tables.sort(function (t1, t2) {
                return t1[0].isSubTable - t2[0].isSubTable;
            });
            var subMap = {

            };
            tables.forEach(function (table, i) {
                var header = table[0];
                var prefix = subMap[header.name];
                tableName = "tb" + (prefix ? (prefix + "-") : "") + header.name;
                var hearderField = {
                    "id": tableName + "_item",
                    "name": header.label,
                    "type": "string",
                    "value": "{rows:[],headers:[]}",
                    "readable": true,
                    "writable": header.accessibility === "write",
                    "required": false,
                    "datePattern": null,
                    "enumValues": [],
                    "variable": header.variable
                };
                result.push(hearderField);
                table.forEach(function (field, i) {
                    if (field.type !== "header") {
                        field.name = tableName + "_" + field.name;
                    }
                    if (field.subTable) {
                        subMap[field.subTable] = header.name;
                        field.name = tableName + "_" + field.subTable;
                    }
                    var item = getField(field, i + 1, "A");

                    if (item) {
                        result.push(item);
                    }

                });
                if (header.isSubTable) {
                    result.push({
                        "id": tableName + "_join-key_Key_10_string_t1_$$A",
                        "name": "Key",
                        "type": "string",
                        "value": null,
                        "readable": true,
                        "writable": true,
                        "required": false,
                        "datePattern": null,
                        "enumValues": [],
                        "variable": "",
                        "dataset": "",
                        "listen": "",
                        "source": "",
                        "target": ""
                    });
                }


            });

            attachments.forEach(function (attach, i) {
                // var id = attach.name + "_" + attach.label + "_" + (i + 1) + "_" + "string" + "_" + "t9" + "_" + "A";
                // var item = {
                //     "id": id,
                //     "name": attach.label,
                //     "type": "string",
                //     "value": "[]",
                //     "readable": true,
                //     "writable": false,
                //     "required": !!attach.required,
                //     "datePattern": null,
                //     "enumValues": []
                // };
                result.push(getField(attach, i + 1, "A"));
            });
            return result;
        };

        var reorganize = function (fields) {
            var sections = {};
            fields.forEach(function (f) {
                if (typeof (sections[f.block]) == "undefined")
                    sections[f.block] = [];
                sections[f.block].push(f);
            });

            var result = [];
            for (var i in sections) {
                sections[i].sort(function (a, b) {
                    return a.seq - b.seq;
                });
                result.push(sections[i]);
            }
            var getCharCode = function (block) {
                if (!block) {
                    return 0;
                }
                return block.charCodeAt();
            };
            result.sort(function (a, b) {
                var blockA = (a[0].block || "").replace(/^v/i, "");
                var blockB = (b[0].block || "").replace(/^v/i, "");

                var firstResult = getCharCode(blockA.substring(0, 1)) - getCharCode(blockB.substring(0, 1));
                if (firstResult !== 0) {
                    return firstResult;
                }
                return getCharCode(blockA.substring(1)) - getCharCode(blockB.substring(1));
            });
            return result;
        };
        var formatDateTime = function (value, controlType) {
            if (!value) {
                return "";
            }
            var format;
            if (controlType === "t3") {
                format = "YYYY-MM-DD";
            }
            else if (controlType === "t4") {
                format = "HH:mm";
            }
            else if (controlType === "t5") {
                format = "YYYY-MM-DD HH:mm";
            }
            if (!format) {
                return value;
            }

            var stamp = typeof (value) === "number" ? value : Number(value);
            if (isNaN(stamp)) {
                stamp = value;
            }
            var formattedValue = moment(stamp).format(format);
            return formattedValue;
        };
        var analyseProperties = function (data) {

            var result = {
                tables: [],
                fields: [],
                attachments: []
            };
            var tableContent;
            data.forEach(function (item) {
                if (!item.propertyId ||
                    item.propertyId.startsWith("tb") &&
                    item.propertyId.endsWith("_std"))
                    return;
                var itemInfo = analyseId(item.propertyId);

                var tableInfo = {
                    "tableName": itemInfo.table,
                    "items": [],
                    "rows": ko.observableArray([]),
                    "item": null,
                    "headers": [],
                    editable: false
                };

                item.value = item.propertyValue;
                item.seq = itemInfo.seq;
                item.fieldType = itemInfo.fieldType;
                item.controlType = itemInfo.controlType;
                item.block = itemInfo.block;
                item.name = itemInfo.name;

                switch (itemInfo.type) {
                    case "field":
                        if ((itemInfo.controlType === "t9i" ||
                            item.controlType === "tree" ||
                            item.controlType === "relation" ||
                            item.controlType === "auto") && item.value) {
                            try {
                                var value = JSON.parse(item.value);
                                if (typeof (value) === "object") {
                                    item.value = value;
                                }
                            } catch (err) {

                            }
                        }
                        result.fields.push(item);
                        break;
                    case "attachment":
                        try {
                            var value = JSON.parse(item.value);
                            if (typeof (value) === "object") {
                                item.value = value;
                                result.attachments.push(item);
                            }
                        } catch (err) {

                        }
                        break;

                    case "tableItem":
                    case "tableField":
                        var t = getTable(result.tables, itemInfo.table);
                        if (!t) {
                            t = tableInfo;
                            result.tables.push(t);
                        }

                        if (itemInfo.type === "tableField") {
                            item.value = ko.observable(item.value);
                            t.headers.push(item);
                        } else {
                            t.item = item;
                            try {
                                var obj = JSON.parse(item.value);
                                if (typeof (obj) === "object")
                                    t.rows = ko.observableArray(obj.rows);
                                if (!t.name) {
                                    t.name = obj.name || "";
                                }
                            } catch (err) {
                            }
                        }
                        break;

                }
            });


            result.fields = reorganize(result.fields);
            result.tables = buildTables(result.tables);

            return result;
        };

        var analyseFormData = function (data, rebuild, $root) {

            var tempTables = [];
            var result = {
                "fields": [],
                "tables": [],
                "attachments": []
            };

            for (var i in data) {
                var item = data[i];
                var itemInfo = analyseId(item.id);

                var tableInfo = {
                    "tableName": itemInfo.table,
                    "headers": [],
                    "rows": ko.observableArray([]),
                    "item": null,
                    editable: false
                };

                item.seq = itemInfo.seq;
                item.fieldType = itemInfo.fieldType;
                item.controlType = itemInfo.controlType;
                item.block = itemInfo.block;
                item.required = ko.observable(!!item.required);
                switch (itemInfo.type) {

                    case "field":
                        if (itemInfo.controlType === "t9i" ||
                            item.controlType === "tree" ||
                            item.controlType === "relation" ||
                            item.controlType === "auto" && item.value) {
                            try {
                                var value = JSON.parse(item.value);
                                if (typeof (value) == "object") {
                                    item.value = value;
                                }
                            } catch (err) {

                            }
                        }

                        item.value = ko.observable(ko.unwrap(item.value));
                        item.invalid = ko.observable(false);
                        item.visible = ko.observable(true);
                        result.fields.push(item);
                        break;
                    case "attachment":
                        try {
                            var value = JSON.parse(item.value);
                            if (typeof (value) == "object") {
                                item.value = value;
                                result.attachments.push(item);
                            }
                        } catch (err) {

                        }

                        break;
                    case "tableField":
                    case "tableItem":
                        var t = getTable(tempTables, itemInfo.table);
                        if (!t) {
                            t = tableInfo;
                            tempTables.push(t);
                        }

                        if (itemInfo.type == "tableField") {
                            item.value = ko.observable(ko.unwrap(item.value));
                            var visible = !/\$\$H/i.exec(item.id)
                            item.visible = ko.observable(visible);
                            item.invalid = ko.observable(false);
                            t.headers.push(item);
                        } else {
                            t.editable = !item.block || item.block.indexOf("V") !== 0;
                            t.item = item;
                            try {
                                var obj = JSON.parse(item.value);
                                if (typeof (obj) == "object") {
                                    t.rows = ko.observableArray(obj.rows);
                                    t.fullHeaders = obj.headers;

                                }
                            } catch (err) {
                            }
                        }
                }
            }

            result.fields = reorganize(result.fields);

            result.attachments.sort(function (a, b) {
                return a.block < b.block ? -1 : 1;
            });
            var tables = buildTables(tempTables, rebuild, $root);
            result.tables = tables;

            return result;
        };
        var isCore = function (id) {
            var tempId = id.toLocaleLowerCase();
            return tempId.indexOf("coreaction") >= 0 ||
                tempId.indexOf("corevalue") >= 0 ||
                tempId.indexOf("corecomments") >= 0;
        };
        var getCoreInfo = function (infos) {
            var coreInfo = {};
            var analyseId = function (fullId) {
                var index = fullId.indexOf("_");
                var id = fullId.substring(0, index);
                var name = fullId.substring(index + 1);
                var parts = fullId.split("_");
                var lastItem = parts[parts.length - 1];

                var controlType = lastItem.indexOf("$$") >= 0 ? parts[parts.length - 2] : lastItem;
                id = id.substring(0, 4) + id.substring(4, 5).toUpperCase() + id.substring(5);
                name = name.substring(0, name.indexOf("_"));
                return {
                    "id": id,
                    "name": name,
                    "controlType": controlType
                };
            };

            for (var i in infos) {
                var id = infos[i].propertyId;
                var item = analyseId(id);
                var value = infos[i].propertyValue;
                if (item.controlType && (
                    item.controlType === "t3" ||
                    item.controlType === "t4" ||
                    item.controlType === "t5")) {
                    value = BPMS.Services.Utils.formatDateTime(value, item.controlType);
                } else if (item.controlType === "t11") {
                    if (typeof (value) === "string" && value || typeof (value) === "number") {
                        value = BPMS.Services.Utils.formatMoney(value);
                    } else {
                        value = "";
                    }
                }


                coreInfo[item.id] = {
                    "name": item.name,
                    "controlType": item.controlType,
                    "value": value
                };
                console.log(coreInfo);
            }

            return coreInfo;
        };
        var formatMoney = function (number) {
            if (typeof (number) == "undefined" || number === null)
                return "";
            if (typeof (number) == "number")
                number = number + "";
            number = number.replace(/\,/g, "");
            if (isNaN(number) || number == "") return "";
            number = Math.round(number * 100) / 100;
            if (number < 0)
                return '-' + outputdollars(Math.floor(Math.abs(number) - 0) + '') + outputcents(Math.abs(number) - 0);
            else
                return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
        };
        var outputdollars = function (number) {
            if (number.length <= 3)
                return (number == '' ? '0' : number);
            else {
                var mod = number.length % 3;
                var output = (mod == 0 ? '' : (number.substring(0, mod)));
                for (i = 0; i < Math.floor(number.length / 3); i++) {
                    if ((mod == 0) && (i == 0))
                        output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                    else
                        output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
                }
                return (output);
            }
        };
        var outputcents = function (amount) {
            amount = Math.round(((amount) - Math.floor(amount)) * 100);
            return (amount < 10 ? '.0' + amount : '.' + amount);
        };
        var analyseNeo4j = function (data) {
            // data = [
            //     {
            //         "@id": "1",
            //         "delegator": {"@id": "2", "name": "邵剑秋", "sn": "100000", "mail": "bladeshao@eorionsolution.com", "roles": null, "belongToDepartment": null, "businessBelongToDepartment": [], "managers": [], "staffs": [], "businessManagers": [], "businessStaffs": [], "delegators": [],
            //             "delegatees": [
            //                 {"@ref": "1"},
            //                 {"@id": "3", "delegator": {"@ref": "2"}, "delegatee": {"@id": "4", "name": "陈骏", "sn": "100001", "mail": "tonnychen@eorionsolution.com", "roles": null, "belongToDepartment": null, "businessBelongToDepartment": [], "managers": [], "staffs": [], "businessManagers": [], "businessStaffs": [], "delegators": [
            //                     {"@ref": "3"},
            //                     {"@id": "5", "delegator": {"@ref": "2"}, "delegatee": {"@ref": "4"}, "from": 1477360440000, "expire": 1477446840000, "role": "CEO", "id": 36},
            //                     {"@id": "6", "delegator": {"@ref": "2"}, "delegatee": {"@ref": "4"}, "from": 1477619880000, "expire": 1477706280000, "role": "admin", "id": 37}
            //                 ], "delegatees": [], "id": 10}, "from": 1477359720000, "expire": 1477532520000, "role": "admin", "id": 35},
            //                 {"@ref": "5"},
            //                 {"@ref": "6"}
            //             ], "id": 9},
            //         "delegatee": {"@id": "7", "name": "陈宇", "sn": "100002", "mail": "dhchenyu@163.com", "roles": null, "belongToDepartment": null, "businessBelongToDepartment": [], "managers": [], "staffs": [], "businessManagers": [], "businessStaffs": [], "delegators": [
            //             {"@ref": "1"}
            //         ], "delegatees": [], "id": 11},
            //         "from": 1477401660000,
            //         "expire": 1477488060000,
            //         "role": "admin",
            //         "id": 38},
            //     {"@ref": "6"},
            //     {"@ref": "5"},
            //     {"@ref": "3"}
            // ];
            var items = [];
            var results = [];
            var analyse = function (obj) {
                if (typeof (obj) !== "object") {
                    return;
                }
                if (obj["@id"]) {
                    items.push(obj);
                }
                analyse(obj.delegator);
                analyse(obj.delegators);
                analyse(obj.delegatee);
                analyse(obj.delegatees);

                if ($.isArray(obj)) {
                    obj.forEach(function (tempDelegatee) {
                        analyse(tempDelegatee);
                    });
                }

            };

            analyse(data);

            var buildItem = function (item) {
                var result;
                if (item["@ref"]) {
                    result = items.filter(function (item2) {
                        return item2 && item2["@id"] == item["@ref"]
                    })[0];
                } else {
                    result = item;
                }
                if (result.delegatee)
                    result.delegatee = buildItem(result.delegatee);
                if (result.delegator)
                    result.delegator = buildItem(result.delegator);
                return result;
            };
            for (var i in data) {
                results.push(buildItem(data[i]));
            }
            return results;
        };
        var getProperty = function (obj, prop) {
            var parts = prop.trim().split(".");
            while (parts.length > 0) {
                obj = obj[parts.shift()];
                if (typeof (obj) === "undefined")
                    return undefined;
            }
            return obj;
        };
        var formatSingleProperty = function ($data) {
            var value = $data.value;
            var type = $data.controlType || "";
            value = ko.unwrap(value);
            if (value === null) {
                value = "";
            }
            if (type === "t3" || type === "t4" || type === "t5") {
                if (typeof (value) === "number" && !isNaN(value)) {
                    value = BPMS.Services.Utils.formatDateTime(value, type);
                }
                if (typeof (value) === "string" && value) {
                    value = BPMS.Services.Utils.formatDateTime(Number(value), type);
                }
            }
            if (type === "cny") {
                value = BPMS.Services.Utils.moneyToBig(value);
            }
            if (type === "automulti") {
                var items = value && JSON.parse(value) || [];
                value = items.slice(0, 4).map(function (item) {
                    return item.name;
                }).join(",");
                if (items.length > 4) {
                    value += "...";
                }
            }
            if (type === "tree" || type === "auto" || type === "relation") {
                value = value && value.name || "";
            }

            if (type === "t11") {
                if (typeof (value) === "string" && value || typeof (value) === "number") {
                    value = BPMS.Services.Utils.formatMoney(value);
                }
                else {
                    value = "";
                }
            }
            if (typeof (value) === "string" && value.indexOf("\n") >= 0) {
                value = value.trim().replace(/\r/g, "").replace(/\n/g, "<br/>");
                if (value.indexOf("<br/>") !== 0) {
                    value = "<br/>" + value;
                }
            }
            if (BPMS.Services.Utils.isCore($data.id)) {
                value = "<b>" + value + "</b>";
            }
            return value;
        };
        return {
            analyseNeo4j: analyseNeo4j,
            analyseFormData: analyseFormData,
            analyseProperties: analyseProperties,
            request: request,
            isCore: isCore,
            getCoreInfo: getCoreInfo,
            defineService: defineService,
            formatSingleProperty: formatSingleProperty,
            getImage: getImage,
            validateFields: validateFields,
            resetFields: resetFields,
            getAuthToken: getAuthToken,
            formatDateTime: formatDateTime,
            rebuildImage: rebuildImage,
            formatMoney: formatMoney,
            getProperty: getProperty,
            isJoinKey: function (field) {
                var id = field.propertyId || field.id;
                return id.split("_")[1] === "join-key";
            },
            formatFormData: formatFormData,
            buildTables: buildTables,
            switchLanguage: function () {
                var lang = localStorage.getItem("bpms_language") || "zh";
                var obj = {};
                obj[lang] = "common/i18n/" + lang + ".json";
                $.i18n().load(obj).done(function () {
                    $.i18n().locale = lang;
                    $("title").i18n();
                    $('body').i18n();
                });
            },
            getTaskProperty: function (value, type) {
                if (typeof (value) !== "number") {
                    value = 0;
                }
                value = value.toString();
                var tail = Array(5 - value.length).join("0");
                value += tail;
                type = type || "priority";
                var index = type === "priority" ? 0 : 2;
                return parseInt(value.substring(index, index + 2), 0);
            },
            loadAttachmentTemplate: function () {
                var attachmentRead = "<script type=\"text/html\" id=\"attachmentRead\">" +
                    "<li data-bind=\"click:function(){$root.secureExecute('download',$data)}\" data-icon=\"arrow-d\"><a href=\"javascript:void(0);\" class=\"ui-alt-icon ui-nodisc-icon\"><font color=\"#e91e63\"><i " +
                    "class=\"fal fa-fw fa-file-export\"></i></font>&nbsp;<span data-bind=\"text:name||fileName\"></span> " +
                    "<p data-bind=\"visible:size\" style=\"margin-bottom:0px;\"><font color=\"#78909c\" data-bind=\"text:size\"></font></p>" +
                    "</a></li>" +
                    "</script>";

                if (!$("#attachmentRead").length) {
                    $("body").append(attachmentRead);
                }
            },
            getCategory: function (url) {
                if (!url) {
                    return "";
                }
                var i = url.lastIndexOf("/");
                if (i >= 0) {
                    return url[i + 1].toUpperCase();
                }
                return "";
            },
            getUser: function () {
                var user = sessionStorage.getItem("bpms_user");

                if (!user) {
                    var isInWeChat = BPMS.Services.Utils.isWeChat();
                    var url = isInWeChat ? "login_bridge.html" : "login.html";
                    url += "?target=" + encodeURIComponent(location.href);
                    window.location.href = url;
                    return;
                }
                user = JSON.parse(user);
                if (user && user.Roles) {
                    var roles = user.Roles.trim().split(",");
                    roles = roles.filter(function (role) {
                        return role && role.indexOf("Application/") != 0 &&
                            role.indexOf("Internal/") != 0;
                    });
                    user.Roles = roles.join(",");
                }
                return user;
            },
            getUrlParams: getUrlParams,
            getUrlParam: getUrlParam,
            postFile: postFile,
            go: function (url) {
                window.location.href = url;
            },
            getCurrentTimeStamp: function () {
                return Number(moment().format("x"));
            },
            isWeChat: function () {
                var userAgent = window.navigator.userAgent.toLowerCase();
                var matched = userAgent.match(/MicroMessenger/i);
                return matched && matched.toString() === 'micromessenger';
            },
            isMobile: function () {
                return /Android|webOS|iPhone|iPod|BlackBerry|MicroMessenger/i.test(navigator.userAgent);
            },
            adjustDevice: function () {
                var page = location.pathname.match(/^.*\/(\w+\.\w+)/i);
                page = page && page[1] && page[1].toLowerCase();
                if (!page) {
                    return;
                }
                var index = location.href.indexOf("?");
                var param = index > 0 ? location.href.substring(index) : "";
                var map = {
                    "task_list.html": "task.html",
                    "history_list.html": "history.html",
                    "process_list.html": "process.html",
                    "instance_list.html": "instance.html"
                };
                var toList = "";
                var toLarge = map[page];
                for (var i in map) {
                    if (map[i] === page) {
                        toList = i;
                    }
                }
                var isMobile = BPMS.Services.Utils.isMobile();
                var isForce = BPMS.Services.Utils.getUrlParam(window.location.href, "force");
                if (isForce) {
                    return;
                }
                if (isMobile && toList) {
                    location.href = toList + param;
                }
                if (!isMobile && toLarge) {
                    location.href = toLarge + param;
                }
            },
            debounce: function (action) {
                var idle = BPMS.config.delaySearch || 0;
                var last;
                return function () {
                    var ctx = this,
                        args = arguments;
                    clearTimeout(last);
                    last = setTimeout(function () {
                        action.apply(ctx, args);
                    }, idle);
                };
            },
            getAction: function ($data, $index, historicDetails) {
                if (ko.toJS($index) === 0) {
                    return "创建";
                }
                var mapped = historicDetails.filter(function (h) {
                    return h && h.taskId === $data.id &&
                        h.processInstanceId === $data.processInstanceId
                        && h.propertyId.toLowerCase().indexOf("core") === 0;
                });
                var coreInfo = BPMS.Services.Utils.getCoreInfo(mapped);
                if (coreInfo && coreInfo.coreAction && coreInfo.coreAction.value) {
                    return coreInfo.coreAction.value;
                }
                if (coreInfo && coreInfo.coreaction && coreInfo.coreaction.value) {
                    return coreInfo.coreaction.value;
                }
                if ($data.deleteReason === "completed") {
                    return "已完成";
                } else if ($data.deleteReason === "deleted") {
                    return "已删除";
                }
                return "未开始";
            },
            getDuration: function (dateTime) {
                var result = {
                    days: 0,
                    hours: 0
                };
                if (!dateTime) {
                    return result;
                }
                var now = moment();
                var then = moment(dateTime);
                var d = moment.duration(then.diff(now));
                result.days = parseInt(d.asDays(), 10);
                result.hours = d.hours();
                return result;
            },
            isDue: function (dateTime) {
                if (!dateTime) {
                    return false;
                }
                return (moment(dateTime) - moment()) < 0;
            },

            moneyToBig: function (n) {
                if (n == null || typeof (n) == "undefined" || n === "") {
                    return "";
                }
                var fraction = ['角', '分'];
                var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
                var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
                var head = n < 0 ? '欠' : '';
                n = Math.abs(n);

                var s = '';

                for (var i = 0; i < fraction.length; i++) {
                    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
                }
                s = s || '整';
                n = Math.floor(n);

                for (var i = 0; i < unit[0].length && n > 0; i++) {
                    var p = '';
                    for (var j = 0; j < unit[1].length && n > 0; j++) {
                        p = digit[n % 10] + unit[1][j] + p;
                        n = Math.floor(n / 10);
                    }
                    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
                }
                return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
            },

            CreateTypeData: function (size) {
                if (size) {
                    this.total = ko.observable(0);
                    this.pageSize = ko.observable(size);
                    this.pageCount = ko.computed(function () {
                        return Math.floor((this.total() - 1) / this.pageSize()) + 1;
                    }, this);
                    this.pageIndex = ko.observable(1);
                } else {
                    this.pageCount = ko.observable(0);
                    this.pageIndex = ko.observable(0);
                }
                this.items = ko.observableArray();


                this.hasPrev = ko.computed(function () {
                    return this.pageIndex() > 1;
                }, this);
                this.hasNext = ko.computed(function () {
                    return this.pageIndex() < this.pageCount();
                }, this);
            },
            datatableOptions: {
                "searching": false,
                "pageLength": 5,
                "autoWidth": true,
                "responsive": true,
                "pagingType": "simple_numbers",
                "lengthChange": false,
                "language": {
                    "sProcessing": "处理中...",
                    "sLengthMenu": "显示 _MENU_ 项结果",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sInfoPostFix": "",
                    "sSearch": "搜索:",
                    "sUrl": "",
                    "sEmptyTable": "表中数据为空",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上页",
                        "sNext": "下页",
                        "sLast": "末页"
                    },
                    "oAria": {
                        "sSortAscending": ": 以升序排列此列",
                        "sSortDescending": ": 以降序排列此列"
                    }
                }
            },
            resetKo: function (obj) {
                for (var i in obj) {
                    var property = obj[i];

                    if (ko.observable(property)) {
                        if (property.destroyAll) {
                            property.removeAll();
                        } else {
                            property(null);
                        }
                    }
                }
            },
            getFormData: function (component, data) {
                data = data || {};
                if (component.components) {
                    component.components.forEach(function (c) {
                        data = this.getFormData(c, data);
                    });
                } else {
                    data[component.key] = component.value;
                }
                return data;
            },
            buildVariables: function (formKey, form) {
                var data = form.data;
                var variables = [];
                for (var i in data) {
                    var fieldValue = data[i];
                    if (typeof (fieldValue) == "object" && fieldValue) {
                        fieldValue = JSON.stringify(fieldValue);
                    }
                    if( fieldValue != null){
						variables.push({
							name: i,
							value: fieldValue
						});
                    }
                }
                var wholeVariable = {
                    data: data,
                    fields: JSON.parse(JSON.stringify(form.component.components))
                };
                variables.push({
                    name: formKey,
                    value: JSON.stringify(wholeVariable)
                });
                return variables;
            }
        };
    })();
})(window.BPMS = window.BPMS || {}, jQuery)