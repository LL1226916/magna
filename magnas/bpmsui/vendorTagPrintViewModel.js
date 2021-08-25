(function (BPMS, $, ko, moment) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    //登录页面viewmodel
    BPMS.ViewModels.VendorTagPrintViewModel = function () {
        var root = this;
        window.vm = root;
        root.type = ko.observable();
        this.fileContent = ko.observable("");
        this.order = ko.observable("");
        this.material = {
            orderNumber: ko.observable(""),//01011807POH0017
            lineNumber: ko.observable(""),
            materialNumber: ko.observable("")//0660011060
        };
        this.stock = {
            //{0 ITMREF_0} 物料编码 
            //{1 STOFCY} 地点 
            //{2 LOC} 库位
            itemref: ko.observable(""),//580205000 581206100
            stofcy: ko.observable(""),//0101
            loc: ko.observable("")//00B60 CM014
        };
        this.items = ko.observableArray();
        this.stockItems = ko.observableArray();
        this.line = {
            orderNumber: ko.observable(),
            lineNumber: ko.observable(),
            batch: ko.observable(null),
            additionalBatch: ko.observable(null),
            number: ko.observable(null),
            remain: ko.observable(),
            standard: ko.observable(),
            unit: ko.observable()
        };

        var defaultOrder = {
            MFGNUM_0: "",
            MFGLIN_0: "",
            ITMREF_0: "",
            ITMTYP_0: "",
            MFGSTA_0: "",
            MFGFCY_0: "",
            BPCNUM_0: "",
            MFGDES_0: "",
            UOM_0: "",
            STU_0: "",
            UOMSTUCOE_0: "",
            UOMEXTQTY_0: 0,
            EXTQTY_0: 0,
            CPLQTY_0: 0,
            REJCPLQTY_0: 0,
            QUACPLQTY_0: 0,
            RMNEXTQTY_0: 0,
            LOT_0: "",
            BOMALT_0: "",
            VCRTYPORI_0: "",
            VCRNUMORI_0: "",
            VCRLINORI_0: "",
            VCRSEQORI_0: "",
            FMI_0: "",
            STOFCY_0: "",
            ITMSTA_0: "",
            ALLSTA_0: "",
            ITMDES1_0: "",
            ITMDES2_0: "",
            ITMDES3_0: "",
            PCU_0: "",
            PUU_0: "",
            PCUSTUCOE_0: "",
            DEFLOC_0: "",
            DEFLOC_1: "",
            DEFLOC_2: "",
            DEFLOC_3: ""
        };
        this.productOrder = ko.mapping.fromJS(defaultOrder);
        this.offline = {
            date: ko.observable(),
            number: ko.observable()
        };
        this.stockItem = {
            "STOFCY_0": ko.observable(""),
            "ITMREF_0": ko.observable(""),
            "ITMDES1_0": ko.observable(""),
            "ITMDES2_0": ko.observable(""),
            "ITMDES3_0": ko.observable(""),
            "PCU_0": ko.observable(""),
            "PUU_0": ko.observable(""),
            "PCUSTUCOE_0": ko.observable(0),
            "LOT_0": ko.observable(""),
            "STA_0": ko.observable(""),
            "LOC_0": ko.observable(""),
            "LOCTYP_0": ko.observable(""),
            "QTYSTU_0": ko.observable(0),
            "assignBatch": ko.observable(""),
            "assignNumber": ko.observable("")
        };
        this.device = {
            deviceType: {
                "id": "deviceType",
                name: "资源类型",
                value: ko.observable("1"),
                controlType: "sbs",
                "readable": true,
                "writable": true,
                "required": true,
                "enumValues": [
                    {
                        "id": "1",
                        "name": "人力"
                    },
                    {
                        "id": "2",
                        "name": "料箱"
                    },
                    {
                        "id": "3",
                        "name": "工装"
                    },
                    {
                        "id": "4",
                        "name": "模具"
                    },
                    {
                        "id": "5",
                        "name": "设备"
                    }
                ],
                "seq": 1,
                "fieldType": "string"
            },
            deviceNumber: {
                "id": "deviceNumber",
                name: "资源编号",
                value: ko.observable(""),
                controlType: "t1",
                "readable": true,
                "writable": true,
                "required": true,
                "seq": 2,
                "fieldType": "string",
                "placeholder": ""
            },
            deviceName: {
                "id": "deviceName",
                name: "资源名称",
                value: ko.observable(""),
                controlType: "t1",
                "readable": true,
                "writable": true,
                "required": true,
                "seq": 3,
                "fieldType": "string",
                "placeholder": ""
            }
        };
        for (var i = 0; i < 4; i++) {
            this.device["deviceProperty" + (i + 1)] = {
                "id": "deviceProperty" + (i + 1),
                name: "资源属性" + (i + 1),
                value: ko.observable(""),
                controlType: "t1",
                "readable": true,
                "writable": true,
                "required": false,
                "seq": (4 + i),
                "fieldType": "string",
                "placeholder": ""
            };
        };
        this.printDevice = function () {
            var root = this;
            var typeValid = !!this.device.deviceType.value();
            var numberValid = !!this.device.deviceNumber.value();
            var nameValid = !!this.device.deviceName.value();
            this.setInputState("deviceType", typeValid);
            this.setInputState("deviceNumber", numberValid);
            this.setInputState("deviceName", nameValid);
            if (!typeValid || !numberValid || !nameValid) {
                return;
            }
            var qrCode = "DV." + this.device.deviceNumber.value() + "@@DVT." + this.device.deviceType.value() + "@@DVN." + this.device.deviceName.value();

            var data = {
                "pdf": {
                    "form": {
                        "details": [{
                            "qrCode": qrCode,
                            "resId": this.device.deviceNumber.value(),
                            "resType": this.device.deviceType.value(),
                            "resProp1": this.device.deviceProperty1.value(),
                            "resProp2": this.device.deviceProperty2.value(),
                            "resProp3": this.device.deviceProperty3.value(),
                            "resProp4": this.device.deviceProperty4.value(),
                            "resName": this.device.deviceName.value(),
                            "code128": this.device.deviceNumber.value()
                        }]
                    },
                    "filename": "riying_resources",
                    "templateName": "riying_resources"
                }
            };
            root.loading(true);
            return BPMS.Services.downloadPDF(data).then(
                function () {
                    root.loading(false);
                    root.pop("success", {
                        "title": "文件下载成功",
                        "description": "已成功下载文件。",
                    });
                }, function () {
                    root.loading(false);
                    root.pop("error", {
                        "title": "文件下载失败",
                        "description": "下载文件出错。",
                    });
                }
            );

        };
        this.offline.packageNumber = ko.pureComputed(function () {
            var number = Number(this.offline.number());

            if (!number || typeof (this.productOrder.PCUSTUCOE_0()) !== "number") {
                return 0;
            }
            if (this.productOrder.PCUSTUCOE_0() === 0) {
                return 1;
            }
            var packageNumber = Math.ceil(number / this.productOrder.PCUSTUCOE_0());
            return packageNumber;
        }, this);
        this.offline.remainder = ko.pureComputed(function () {
            var number = Number(this.offline.number());
            if (!number || !this.productOrder.PCUSTUCOE_0()) {
                return 0;
            }
            var remainder = Math.ceil(number % this.productOrder.PCUSTUCOE_0());
            return remainder;
        }, this);
        this.offline.available = ko.pureComputed(function () {
            var number = Number(this.offline.number());
            return number > 0 && number <= (this.productOrder.EXTQTY_0() - this.productOrder.CPLQTY_0());
        }, this);

        this.startUpload = function (type) {
            this.uploadType = type;
            this.fileContent("");
            this.delayPop('Upload');
        };
        this.upload = function () {
            var param = {
                template_name: "riying_" + this.uploadType,
                file_name: "riying_" + this.uploadType,
                list_name: "details"
            }
            var root = this;
            var value = this.fileContent();
            if (!value) {
                return;
            }
            root.loading(true);
            BPMS.Services.uploadCSV(value, param).then(
                function () {
                    root.loading(false);
                    root.triggerDelay({
                        "type": "success",
                        "title": "文件导入成功",
                        "description": "已成功导入文件。",
                    });
                }, function () {
                    root.loading(false);
                    root.triggerDelay({
                        "type": "error",
                        "title": "文件导入失败",
                        "description": "导入文件出错。",
                    });
                }
            );
        };
        this.removeBatch = function (item, batch) {
            console.log(item);
            console.log(batch);
            item.batches.remove(batch);
        };
        this.startSearchMaterial = function () {
            //$("#popSearchMaterial").popup("open");
            this.setInputState("orderNumber", true);
            this.delayPop('SearchMaterial');
        };
        this.canAssign = function (data) {
            var item = ko.toJS(data);
            var pcu = (item.PCU_0 || "").trim();
            return pcu && typeof (item.PCUSTUCOE_0) === "number" && item.PCUSTUCOE_0 >= 0;
        };
        this.canAssignOrder = function () {
            var pcu = (this.productOrder.PCU_0() || "").trim();
            return pcu &&
                typeof (this.productOrder.PCUSTUCOE_0()) === "number"
                && this.productOrder.PCUSTUCOE_0() > 0
                && this.productOrder.MFGNUM_0();
        };
        this.searchMaterial = function () {
            //01131603POH0001, 01021601POH0009
            var isValid = !!this.material.orderNumber();
            this.setInputState("orderNumber", isValid);
            if (!isValid) {
                return;
            }
            var root = this;
            root.loading(true);

            BPMS.Services.getPurchaseOrderAPI(this.material.orderNumber(),
                this.material.lineNumber(),
                this.material.materialNumber(), this.user.userId).then(
                    function (items) {
                        //items = [{ "ROWID": "AABMRnAAGAAD7UaAAB", "POHNUM_0": "01131603POH0001", "POPLIN_0": 1000.0, "POQSEQ_0": 1.0, "CPY_0": "01", "POHFCY_0": "0113", "PRHFCY_0": "0113", "ITMREF_0": "064015000A", "PCU_0": "DX", "PCUSTUCOE_0": 200.0, "ITMREFBPS_0": " ", "PUU_0": "UN", "STU_0": "UN", "QTYPUU_0": 1200.0, "RCPQTYPUU_0": 1200.0, "RETQTYPUU_0": 0.0, "XSCAQTYPUU_0": 0.0, "LINCLEFLG_0": 2, "ITMDES1_0": "DQQ4150前照灯清洗器(左)CKD", "ITMDES2_0": "8W0.955.101", "BPSNUM_0": "UQ002", "BPAADD_0": "1", "BPRNAM_0": "一汽-大众汽车有限公司", "BPSSHO_0": "一汽大众", "CUR_0": "CNY", "APPFLG_0": 4, "CLEFLG_0": 2, "RCPFLG_0": 3, "ORDDAT_0": "2016-03-07T00:00:00", "NOMUSR_0": "郭海林" }, { "ROWID": "AABMRnAAGAAD7UaAAC", "POHNUM_0": "01131603POH0001", "POPLIN_0": 2000.0, "POQSEQ_0": 1.0, "CPY_0": "01", "POHFCY_0": "0113", "PRHFCY_0": "0113", "ITMREF_0": "064151000A", "PCU_0": "DX", "PCUSTUCOE_0": 200.0, "ITMREFBPS_0": " ", "PUU_0": "UN", "STU_0": "UN", "QTYPUU_0": 1200.0, "RCPQTYPUU_0": 1200.0, "RETQTYPUU_0": 0.0, "XSCAQTYPUU_0": 0.0, "LINCLEFLG_0": 2, "ITMDES1_0": "DQQ4151前照灯清洗器（右）CKD", "ITMDES2_0": "8W0.955.102", "BPSNUM_0": "UQ002", "BPAADD_0": "1", "BPRNAM_0": "一汽-大众汽车有限公司", "BPSSHO_0": "一汽大众", "CUR_0": "CNY", "APPFLG_0": 4, "CLEFLG_0": 2, "RCPFLG_0": 3, "ORDDAT_0": "2016-03-07T00:00:00", "NOMUSR_0": "郭海林" }, { "ROWID": "AABMRnAAGAAD7UZAAJ", "POHNUM_0": "01131603POH0001", "POPLIN_0": 3000.0, "POQSEQ_0": 1.0, "CPY_0": "01", "POHFCY_0": "0113", "PRHFCY_0": "0113", "ITMREF_0": "1160136200A", "PCU_0": "DX", "PCUSTUCOE_0": 50.0, "ITMREFBPS_0": " ", "PUU_0": "UN", "STU_0": "UN", "QTYPUU_0": 2400.0, "RCPQTYPUU_0": 2400.0, "RETQTYPUU_0": 0.0, "XSCAQTYPUU_0": 0.0, "LINCLEFLG_0": 2, "ITMDES1_0": "3710136T88大灯喷嘴支架CKD", "ITMDES2_0": "8W0 955 775", "BPSNUM_0": "UQ002", "BPAADD_0": "1", "BPRNAM_0": "一汽-大众汽车有限公司", "BPSSHO_0": "一汽大众", "CUR_0": "CNY", "APPFLG_0": 4, "CLEFLG_0": 2, "RCPFLG_0": 3, "ORDDAT_0": "2016-03-07T00:00:00", "NOMUSR_0": "郭海林" }, { "ROWID": "AABMRnAAGAAD7UZAAK", "POHNUM_0": "01131603POH0001", "POPLIN_0": 4000.0, "POQSEQ_0": 1.0, "CPY_0": "01", "POHFCY_0": "0113", "PRHFCY_0": "0113", "ITMREF_0": "064152000A", "PCU_0": " ", "PCUSTUCOE_0": 0.0, "ITMREFBPS_0": " ", "PUU_0": "GEN", "STU_0": "GEN", "QTYPUU_0": 1200.0, "RCPQTYPUU_0": 1200.0, "RETQTYPUU_0": 0.0, "XSCAQTYPUU_0": 0.0, "LINCLEFLG_0": 2, "ITMDES1_0": "DQQ4152水管总成CKD", "ITMDES2_0": "8W0 955 970 A", "BPSNUM_0": "UQ002", "BPAADD_0": "1", "BPRNAM_0": "一汽-大众汽车有限公司", "BPSSHO_0": "一汽大众", "CUR_0": "CNY", "APPFLG_0": 4, "CLEFLG_0": 2, "RCPFLG_0": 3, "ORDDAT_0": "2016-03-07T00:00:00", "NOMUSR_0": "郭海林" }];
                        var computer = function () {
                            //var total = this.QTYPUU_0;
                            var total = 0;
                            for (var i in this.batches()) {
                                var batch = this.batches()[i];
                                total += batch.number;
                            }
                            return total;
                        };
                        items.forEach(function (item) {
                            item.batches = ko.observableArray();
                            item.assignedNumber = ko.pureComputed(computer, item);
                        });
                        root.loading(false);
                        $.mobile.popup.active.close();
                        root.items(items);
                    }, function () {
                        root.loading(false);
                        root.triggerDelay({
                            "type": "error",
                            "title": "查询失败",
                            "description": "接口错误",
                        });
                    }
                );
        };
        this.setInputState = function (id, isValid) {
            var ele = $("#" + id);
            if (!ele.length) {
                ele = $("[name='" + id + "']");
            }
            ele = ele.parent();
            if (isValid) {
                ele.removeClass("ui-invalid");
            } else {
                ele.addClass("ui-invalid");
            }
        };
        this.clearInputState = function (id) {
            var ele = $("#" + id).parent();
            var clearBtn = ele.find("a.ui-input-clear").not(".ui-input-clear-hidden");
            if (clearBtn && clearBtn.length) {
                clearBtn.click();
            }
        };

        this.startAssign = function (item) {
            this.line.orderNumber(item.POHNUM_0);
            this.line.lineNumber(item.POPLIN_0);
            this.line.batch(null);
            this.line.additionalBatch(null);
            this.line.number(null);
            this.line.remain(item.QTYPUU_0 - item.assignedNumber());
            this.line.standard(item.PCUSTUCOE_0);
            this.line.unit(item.PUU_0);
            this.setInputState("additionalBatch", true);
            this.setInputState("batch", true);
            this.setInputState("number", true);
            //this.clearInputState("batch");
            $("#popAssign").popup("open");
        };
        this.assign = function () {
            var line = this.line;
            var batch = line.batch();
            var additionalBatch = line.additionalBatch() || "";
            var number = Number(line.number());
            var isBatchValid = !!batch;
            var isNumberValid = !isNaN(number) && number > 0 && number <= line.remain();
            var isAdditionalBatchValid = additionalBatch.length < 5;
            this.setInputState("batch", isBatchValid);
            this.setInputState("number", isNumberValid);
            this.setInputState("additionalBatch", isAdditionalBatchValid);

            if (!isBatchValid || !isNumberValid || !isAdditionalBatchValid) {
                return;
            }
            var item = this.items().filter(function (i) {
                return i.POHNUM_0 === line.orderNumber() && i.POPLIN_0 === line.lineNumber();
            })[0];
            if (!item) {
                return;
            }
            var formattedBatch;
            if (additionalBatch) {
                formattedBatch = moment(Number(batch)).format("YYMMDD") + additionalBatch;
            } else {
                formattedBatch = moment(Number(batch)).format("YYMMDDHHmm");
            }

            var newLine = {
                batch: formattedBatch,
                number: number,
            };
            if (line.standard() === 0) {
                newLine.part1 = number;
                newLine.part2 = 0;
                newLine.package = 1;
            } else {
                var part2 = parseInt(number % line.standard(), 10);
                var part1 = parseInt((number - part2) / line.standard(), 10) * line.standard();
                newLine.part1 = part1;
                newLine.part2 = part2;
                newLine.package = Math.ceil(number / line.standard());
            }

            item.batches.push(newLine);
            line.batch(null);
            line.additionalBatch(null);
            line.number(null);
            //this.clearInputState("batch");
            //$.mobile.popup.active.close();
        };
        this.buildPrintData = function (item, data) {
            for (var i in item.batches()) {
                var batch = item.batches()[i];
                var qrCode = "PO." + item.POHNUM_0 + "@@LN." + item.POPLIN_0 +
                    "@@MT." + item.ITMREF_0 + "@@VLC." + batch.batch + "@@LC." + batch.batch + "@@QT.";
                var v4Code = (item.BPSSHO_0 || "").trim();
                if (v4Code.length > 6) {
                    v4Code = v4Code.substring(0, 6) + "...";
                }
                var stamp = moment().format("YYMMDDHH");
                var detail = {
                    "qrCode": qrCode,
                    "matId": item.ITMREF_0,
                    "matDes1Des2": item.ITMDES1_0 + " " + item.ITMDES2_0,
                    "batchNo": batch.batch,
                    "unit": item.PUU_0,
                    "vendorCode": item.BPSNUM_0,
                    "v4Code": v4Code,
                    "po_poln": item.POHNUM_0 + "/" + item.POPLIN_0,
                    "seq2": stamp,
                };
                var count = item.PCUSTUCOE_0 === 0 ? 1 : parseInt(batch.part1 / item.PCUSTUCOE_0, 10);
                for (var j = 0; j < count; j++) {
                    var package = JSON.parse(JSON.stringify(detail));
                    package.seq1 = (data.length + 1).toString();
                    package.qty = (item.PCUSTUCOE_0 === 0 ? batch.part1 : item.PCUSTUCOE_0).toString();
                    package.qrCode += package.qty;
                    data.push(package);
                }
                if (batch.part2) {
                    var package = JSON.parse(JSON.stringify(detail));
                    package.seq1 = (data.length + 1).toString();
                    package.qty = batch.part2.toString();
                    package.qrCode += package.qty;
                    data.push(package);
                }
            }
        }
        this.print = function () {
            var root = this;
            this.loading(true);
            //   var fileName = item.POHNUM_0 + "_" + item.POPLIN_0;
            var data = {
                "pdf": {
                    "form": {
                        "details": [
                        ]
                    },
                    "filename": "riying_material",
                    "templateName": "riying_material"
                }
            };
            var details = [];
            for (var i in arguments) {
                var item = arguments[i];
                root.buildPrintData(item, details);
            }

            data.pdf.form.details = details;
            console.log(data);
            return BPMS.Services.downloadPDF(data).then(
                function () {
                    root.loading(false);
                    root.pop("success", {
                        "title": "文件下载成功",
                        "description": "已成功下载文件。",
                    });
                }, function () {
                    root.loading(false);
                    root.pop("error", {
                        "title": "文件下载失败",
                        "description": "下载文件出错。",
                    });
                }
            );
        };
        this.printLine = function (item) {
            return this.print(item);
        };
        this.printOrder = function () {
            return this.print.apply(this, this.items());
        };
        this.keydown = function (data, e) {
            var element = $(e.target);
            var id = element.attr("id");
            var value = element.val().trim();
            var searchType = id.substring(0, 1).toUpperCase() + id.substring(1);

            if ((!e.keyCode || e.keyCode === 13) && value) {
                this[id](value);
                this["search" + searchType]();
            }
            return true;
        };
        this.searchOrder = function () {
            //PD.01011806MFG0005@@LN.1000
            //PD.01011807POH0017@@LN.1000

            //PD.01021808MFG0001@@LN.1000
            //PD.01021807MFG0500@@LN.1000
            var root = this;
            this.order($("#order").val());
            keyword = (this.order() || "").trim();
            var matches = /PD\.([0-9a-zA-Z]*)/ig.exec(keyword);
            var orderNumber = matches && matches[1];
            matches = /LN\.([0-9a-zA-Z]*)/ig.exec(keyword);
            var lineNumber = matches && matches[1];

            if (!orderNumber || !lineNumber) {
                this.pop("error", {
                    "title": "查找生产订单",
                    "description": "订单号格式错误",
                });
                return;
            }
            root.loading(true);
            BPMS.Services.getProduceOrder(orderNumber, lineNumber).then(
                function (orders) {
                    root.loading(false);
                    root.clearInputState("order");
                    root.order("");
                    $("#order").val("");
                    if (!orders || orders.length == 0) {
                        root.pop("error", {
                            "title": "查找生产订单",
                            "subTitle": orderNumber,
                            "description": "找不到此订单",
                        });
                        return;
                    }
                    ko.mapping.fromJS(orders[0], root.productOrder);
                    //todo
                    //root.productOrder.PCUSTUCOE_0(10);
                },
                function (error) {
                    root.loading(false);
                    root.clearInputState("order");
                    root.order("");

                    $("#order").val("");
                    root.pop("error", {
                        title: "查找生产订单",
                        subTitle: orderNumber,
                        description: "接口错误"
                    });
                }
            );
        };
        this.searchStock = function () {
            var root = this;
            var itemrefValid = !!this.stock.itemref();
            var stofcyValid = !!this.stock.stofcy();
            var locValid = !!this.stock.loc();
            this.setInputState("itemref", itemrefValid);
            this.setInputState("stofcy", stofcyValid);
            this.setInputState("loc", locValid);
            if (!itemrefValid || !stofcyValid || !locValid) {
                return;
            }
            root.loading(true);
            BPMS.Services.getStock(this.stock.itemref(), this.stock.stofcy(), this.stock.loc()).then(
                function (items) {
                    items.forEach(function (item) {

                    });
                    root.loading(false);
                    $.mobile.popup.active.close();
                    root.stockItems(items);
                }, function () {
                    root.loading(false);
                    // root.triggerDelay({
                    //     "type": "error",
                    //     "title": "查询失败",
                    //     "description": "接口错误",
                    // });
                }
            );
        };

        this.startAssignOffline = function () {
            this.offline.number(null);
            this.offline.date(null);
            this.clearInputState("offlineNumber");
            this.clearInputState("offlineData");
            this.delayPop("AssignOffline");
        };
        this.selectStock = function (data) {
            for (var i in data) {
                if (this.stockItem[i]) {
                    this.stockItem[i](data[i]);
                }
            }
            this.stockItem.assignBatch("");
            this.stockItem.assignNumber("");
            this.clearInputState("assignBatch");
            this.clearInputState("assignNumber");
            this.setInputState("assignBatch", true);
            this.setInputState("assignNumber", true);
            this.delayPop("StockAssign");
        };
        this.printStock = function () {
            var root = this;
            root.loading(true);
            var item = ko.toJS(this.stockItem);
            var qty = Number(item.assignNumber);
            var batch = item.assignBatch.trim();
            var barCode = "MT." + item.ITMREF_0 + "@@LC." + item.LOT_0 + "@@LCORG." + batch + "@@QT." + qty;
            var data = {
                "pdf": {
                    "form": {
                        "details": [{
                            "qrCode": barCode,
                            "matId": item.ITMREF_0,
                            "matDes1Des2": item.ITMDES1_0 + item.ITMDES2_0,
                            "batchNo": batch,
                            "qty": qty.toString(),
                            "unit": item.PUU_0,
                            "seq1": (1).toString(),
                            "seq2": moment().format("YYMMDDHH")
                        }]
                    },
                    "filename": "riying_return",
                    "templateName": "riying_return"
                }
            }
            return BPMS.Services.downloadPDF(data).then(
                function () {
                    root.loading(false);
                    root.triggerDelay({
                        "type": "success",
                        "title": "文件下载成功",
                        "description": "已成功下载文件。",
                    });
                }, function () {
                    root.loading(false);
                    root.triggerDelay({
                        "type": "error",
                        "title": "文件下载失败",
                        "description": "下载文件出错。",
                    });
                }
            );

        };
        this.assignStock = function () {
            //16012501012206
            //16062301012604
            //16071201011274
            var root = this;
            var assignBatch = (this.stockItem.assignBatch() || "").trim();
            var assignNumber = Number(this.stockItem.assignNumber());
            var assignBatchValid = !!assignBatch;
            var assignNumberValid = assignNumber &&
                assignNumber > 0 &&
                assignNumber <= this.stockItem.QTYSTU_0() &&
                (assignNumber <= this.stockItem.PCUSTUCOE_0() || this.stockItem.PCUSTUCOE_0() === 0);
            this.setInputState("assignBatch", assignBatchValid);
            this.setInputState("assignNumber", assignNumberValid);
            if (!assignBatchValid || !assignNumberValid) {
                return;
            }
            root.loading(true);
            BPMS.Services.getLotStock(root.stockItem.ITMREF_0(), assignBatch).then(
                function (stocks) {

                    if (!stocks || stocks.length == 0) {
                        root.loading(false);
                        root.triggerDelay({
                            "type": "error",
                            "title": "分配批次失败",
                            "description": "找不到该批次的库存信息",
                        });
                        return;
                    }
                    root.printStock();
                },
                function (error) {
                    root.loading(false);
                    root.triggerDelay({
                        "type": "error",
                        "title": "分配批次失败",
                        "description": "接口错误",
                    });
                }
            );
        };

        this.assignOffline = function () {
            var root = this;
            this.loading(true);
            var data = {
                "pdf": {
                    "form": {
                        "details": [
                        ]
                    },
                    "filename": "riying_final",
                    "templateName": "riying_final"
                }
            };
            var number = Number(root.offline.number());
            var count = root.offline.packageNumber();
            var item = ko.toJS(root.productOrder);
            var lastQty = root.offline.remainder();
            if (lastQty === 0) {
                lastQty = item.PCUSTUCOE_0 === 0 ? number : item.PCUSTUCOE_0;
            }
            var stamp = moment().format("YYMMDDHH");
            var date = moment().format("YYMMDD");
            for (var i = 0; i < count; i++) {
                var qty = i === count - 1 ? lastQty : item.PCUSTUCOE_0;
                var qrCode = "PD." + item.MFGNUM_0 + "@@LN." + item.MFGLIN_0 +
                    "@@MT." + item.ITMREF_0 + "@@LC." + item.MFGNUM_0 + "@@QT." + qty;
                var detail = {
                    "qrCode": qrCode,
                    "matId": item.ITMREF_0,
                    "matDes1Des2": item.ITMDES1_0 + " " + item.ITMDES2_0,
                    "batchNo": item.MFGNUM_0,
                    "qty": qty.toString(),
                    "unit": item.PUU_0,
                    "seq1": (i + 1).toString(),
                    "seq2": stamp,
                    "lot": item.LOT_0,
                    "date": date,
                    "address": item.STOFCY_0
                };
                data.pdf.form.details.push(detail);
            }
            console.log(data);
            return BPMS.Services.downloadPDF(data).then(
                function () {
                    root.loading(false);
                    root.triggerDelay({
                        "type": "success",
                        "title": "文件下载成功",
                        "description": "已成功下载文件。",
                    });
                }, function () {
                    root.loading(false);
                    root.triggerDelay({
                        "type": "error",
                        "title": "文件下载失败",
                        "description": "下载文件出错。",
                    });
                }
            );
        };
    };


    BPMS.ViewModels.VendorTagPrintViewModel.extend(BPMS.ViewModels.BaseViewModel);
    BPMS.ViewModels.VendorTagPrintViewModel.prototype.switchTab = function (vm, e) {
        var a = $(e.target).closest("a");
        var tempType = a.attr("id").replace("-tab", "");
        this.type(tempType);
    };

    BPMS.ViewModels.VendorTagPrintViewModel.prototype.init = function () {
        var root = this;
        this.clearHash();
        var type = BPMS.Services.Utils.getUrlParam(window.location.href, "type") || "print";
        root.type(type);
    };

})(window.BPMS = window.BPMS || {}, jQuery, ko, moment);