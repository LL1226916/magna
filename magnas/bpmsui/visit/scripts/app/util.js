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
            var serviceUrl = entrance.config.serviceUrl;
            var token = (settings && settings.token);
            if (!token)
                token = sessionStorage.getItem("bpms_token");
            defaultSettings.headers.Authorization = token;

            if (url.indexOf("http") < 0)
                url = serviceUrl + url;

            var httpsServers = entrance.config.httpsServers || [];
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

                    var blob = typeof File === 'function'
                        ? new File([this.response], filename, { type: type })
                        : new Blob([this.response], { type: type });
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
                                window.location = downloadUrl;
                            } else {
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                            }
                        } else {
                            window.location = downloadUrl;
                        }
                        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
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
                if (sections.length == 2 && sections[1] == "item") {
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


        var validateFields = function (fields, byStep) {
            var result = true;

            for (var index in fields) {
                var f = fields[index];
                var controlType = f.controlType || "t1";
                var invalid = false;
                var val = ko.unwrap(f.value);
                var empty = typeof (val) == "undefined" || val == null ||
                    typeof (val) == "string" && val.trim() == "" || controlType === "t9i" && (!val || val === JSON.stringify([]));


                if (f.required && empty)
                    invalid = true;

                switch (f.controlType) {
                    case "t7":
                        // var isMail = jQuery.validator.methods.email.call(jQuery.validator.prototype, val);
                        var reg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
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
                    case "psbn":
                        if (vm.interviewee) {
                            if ((vm.interviewee() && vm.interviewee().intervieweeName || "") !== val) {
                                invalid = true;

                            }
                        }

                        break;
                    default:
                        break;
                }
                if (f.invalid) {
                    f.invalid(invalid);
                }

                var $e = $("[name='" + f.id.replace(/\$/g, "") + "']");
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

        var buildTables = function (tables, rebuild, $root) {
            if (!tables.length)
                return tables;

            for (var i in tables) {
                var tempTable = tables[i];
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
                if (tempTable.rows && tempTable.rows.length && tempTable.fullHeaders) {
                    var newRows = [];
                    tempTable.rows.forEach(function (r) {
                        var newRow = [];
                        tempTable.headers.forEach(function (header) {
                            var matchHeader = tempTable.fullHeaders.filter(function (h) {
                                return h && h.id == header.id;
                            })[0];
                            var cell = r[tempTable.fullHeaders.indexOf(matchHeader)];
                            newRow.push(cell);

                        });
                        newRows.push(newRow);

                    });
                    tempTable.rows = newRows;
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
                tempTable.isMultiText = function (value) {
                    value = ko.unwrap(value);
                    var type = typeof (value);
                    return (type == "string" && value.indexOf("\n") >= 0);
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
                    return value;
                };
            }

            tables = tables.filter(function (t) {
                return t && t.headers.length;
            });

            if (!rebuild)
                return tables;

            var result = [];
            for (var i in tables) {
                var table = tables[i];

                var newTable = {
                    "editable": true,
                    "tableName": table.tableName,
                    "headers": ko.observableArray(),
                    "rows": ko.observableArray(),
                    "item": table.item,
                    isMultiText: table.isMultiText,
                    showFullText: table.showFullText,
                    formatCell: table.formatCell,
                    removeRow: function (row) {
                        this.rows.remove(row);
                        var table = $("table[data-role='table']");
                        if (table && table.length) {
                            var tableWidget = $.data(table[0], "mobile-table");
                            tableWidget.refresh();
                        }
                    },
                    addRow: function () {
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
                            var name = head.id.replace(/\$/g, "");
                            var clearBtn = $("[name='" + name + "']").parent().find("a.ui-input-clear").not(".ui-input-clear-hidden");
                            if (clearBtn && clearBtn.length) {
                                clearBtn.click();
                            }
                            // if (head.controlType == "t6"
                            //     || head.controlType == "t11") {
                            //     if (value != null) {
                            //         var sValue = value.toString();
                            //         if (sValue.length > 0 && sValue.indexOf(".") < 0) {
                            //             sValue += ".0";
                            //         }
                            //         value = sValue;
                            //     }
                            // }
                            row.push(value);
                            //dynamicValue("");
                            dynamicValue(null);
                        }
                        this.rows.push(row);
                        var table = $("table[data-role='table']");
                        if (table && table.length) {
                            var tableWidget = $.data(table[0], "mobile-table");
                            tableWidget.refresh();
                        }
                    }
                };

                result.push(newTable);
                newTable.rows(table.rows);
                newTable.headers(table.headers);
            }

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
                    "rows": [],
                    "item": null,
                    "headers": []
                };

                item.value = item.propertyValue;
                item.seq = itemInfo.seq;
                item.fieldType = itemInfo.fieldType;
                item.controlType = itemInfo.controlType;
                item.block = itemInfo.block;
                item.name = itemInfo.name;

                switch (itemInfo.type) {
                    case "field":
                        if (itemInfo.controlType === "t9i") {
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
                                    t.rows = obj.rows;
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
                    "rows": [],
                    "item": null
                };

                item.seq = itemInfo.seq;
                item.fieldType = itemInfo.fieldType;
                item.controlType = itemInfo.controlType;
                item.block = itemInfo.block;

                switch (itemInfo.type) {

                    case "field":
                        if (itemInfo.controlType === "t9i") {
                            try {
                                var value = JSON.parse(item.value);
                                if (typeof (value) == "object") {
                                    item.value = value;
                                }
                            } catch (err) {

                            }
                        }

                        item.value = ko.observable(item.value);
                        item.invalid = ko.observable(false);
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
                            item.value = ko.observable(item.value);
                            item.invalid = ko.observable(false);
                            t.headers.push(item);
                        } else {

                            t.item = item;
                            try {
                                var obj = JSON.parse(item.value);
                                if (typeof (obj) == "object") {
                                    t.rows = obj.rows;
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
                var value = infos[i].propertyValue;
                var item = analyseId(id);
                coreInfo[item.id] = {
                    "name": item.name,
                    "controlType": item.controlType,
                    "value": value
                };
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
            getAuthToken: getAuthToken,
            formatDateTime: formatDateTime,
            rebuildImage: rebuildImage,
            formatMoney: formatMoney,
            getProperty: getProperty,
            buildTables: buildTables,
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
                    "<li data-bind=\"click:function(){$root.secureExecute('download',$data)}\" data-icon=\"arrow-d\"><a href=\"javascript:void(0);\"><font color=\"#03a9f4\"><i " +
                    "class=\"fa fa-file-code-o\"></i></font>&nbsp;<span data-bind=\"text:name||fileName\"></span> " +
                    "<p data-bind=\"visible:size\" style=\"margin-bottom:0px;\"><font color=\"gray\" data-bind=\"text:size\"></font></p>" +
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
                var idle = entrance.config && entrance.config.delaySearch || 1000;
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
            CreateTypeData: function () {
                this.items = ko.observableArray();
                this.pageIndex = ko.observable(0);
                this.pageCount = ko.observable(0);
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
            }
        };
    })();
})(window.BPMS = window.BPMS || {}, jQuery)