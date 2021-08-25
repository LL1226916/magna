(function (BPMS, $, ko) {
    BPMS.ViewModels = BPMS.ViewModels || {};
    BPMS.ViewModels.ReportListViewModel = function () {
        window.vm = this;
        this.sourceId = ko.observable("");
        this.joinId = ko.observable("");

        this.group = {
            collections: ko.observableArray([]),
            fields: ko.observableArray([]),
            collectionId: ko.observable(null),
            fieldId: ko.observable(null)
        };
        this.aggregation = {
            collections: ko.observableArray([]),
            fields: ko.observableArray([]),
            collectionId: ko.observable(null),
            fieldId: ko.observable(null),
            aggregationType: ko.observable(null),
            options: [
                { id: "sum", name: "总和" },
                { id: "count", name: "数量" },
                { id: "avg", name: "平均值" },
                { id: "min", name: "最小值" },
                { id: "max", name: "最大值" }
            ]
        };
        this.condition = {
            collections: ko.observableArray([]),
            fields: ko.observableArray([]),
            collectionId: ko.observable(null),
            fieldId: ko.observable(null),
            conditionType: ko.observable(null),
            options: [
                { id: "eq", name: "等于", icon: "fa-equals" },
                { id: "lt", name: "小于", icon: "fa-less-than" },
                { id: "gt", name: "大于", icon: "fa-greater-than" }
            ],
            value: ko.observable(null)
        };

        this.formatAggregationType = function (type) {
            return this.aggregation.options.filter(function (item) {
                return item.id === type;
            })[0].name;
        };
        this.formatConditionType = function (type) {
            return this.condition.options.filter(function (item) {
                return item.id === type;
            })[0].icon;
        };
        this.group.collectionId.subscribe(function (value) {
            if (!value) {
                this.group.fields.removeAll();
                $("#groupField").selectmenu("refresh");
                this.group.fieldId(null);
                return;
            }
            var self = this;
            this.loading(true);
            BPMS.Services.getMeta(value).then(
                function (result) {
                    self.loading(false);
                    var fields = result.value.fields;
                    self.group.fields(fields);
                    $("#groupField").selectmenu("refresh");
                    self.group.fieldId(fields[0].id);
                });
        }, this);
        this.aggregation.collectionId.subscribe(function (value) {
            if (!value) {
                this.aggregation.fields.removeAll();
                $("#aggregationField").selectmenu("refresh");
                this.aggregation.fieldId(null);
                return;
            }
            var self = this;
            this.loading(true);
            BPMS.Services.getMeta(value).then(
                function (result) {
                    self.loading(false);
                    var fields = result.value.fields;
                    self.aggregation.fields(fields);
                    $("#aggregationField").selectmenu("refresh");
                    self.aggregation.fieldId(fields[0].id);
                });
        }, this);
        this.condition.collectionId.subscribe(function (value) {
            if (!value) {
                this.condition.fields.removeAll();
                $("#conditionField").selectmenu("refresh");
                this.condition.fieldId(null);
                return;
            }
            var self = this;
            this.loading(true);
            BPMS.Services.getMeta(value).then(
                function (result) {
                    self.loading(false);
                    var fields = result.value.fields;
                    self.condition.fields(fields);
                    $("#conditionField").selectmenu("refresh");
                    self.condition.fieldId(fields[0].id);
                });
        }, this);
        this.init = function () {
            var self = this;
            this.criteria.id("");
            this.criteria.name("");
            this.creatingName("");
            this.getData().then(function () {
                var items = self.report.items();
                var id = items.length ? items[0].id : "";
                if (id && !self.editingReport.id()) {
                    self.selectReport(id);
                }
            });

        };
        this.sources = ko.observableArray([]);
        this.joins = ko.observableArray([]);

        this.preview = {
            table: ko.observable({
                headers: [],
                rows: []
            })
        };

        this.chartTypes = [
            { id: "table", icon: "fa-table", name: "表格" },
            { id: "bar", icon: "fa-chart-bar", name: "柱状图" },
            { id: "line", icon: "fa-chart-line", name: "折线图" },
            { id: "pie", icon: "fa-chart-pie", name: "饼状图" },
            { id: "area", icon: "fa-chart-area", name: "区域图" }
        ];
        this.removeSource = function (source) {
            var index = this.editingReport.dataSource.indexOf(source);
            this.editingReport.join.splice(index, 1);
            this.editingReport.dataSource.splice(index, 1);
        };
        this.removeGroup = function (group) {
            var index = this.editingReport.group.indexOf(group);
            this.editingReport.group.splice(index, 1);
        };
        this.removeAggregation = function (aggregation) {
            var index = this.editingReport.aggregation.indexOf(aggregation);
            this.editingReport.aggregation.splice(index, 1);
        };
        this.removeCondition = function (condition) {
            var index = this.editingReport.condition.indexOf(condition);
            this.editingReport.condition.splice(index, 1);
        };

        this.getJoin = function (data) {
            var self = this;
            this.joinId(data.id || "");
            var index = this.editingReport.join.indexOf(data);
            this.joinIndex = index;
            var metaId = this.editingReport.dataSource()[index].id;
            BPMS.Services.getMeta(metaId).then(
                function (result) {
                    var fields = result.value.fields;

                    // .filter(function (field) {
                    //     return field.id !== data.id;
                    // })

                    self.joins(fields);
                    self.delayPop("EditJoin", { positionTo: "#joinMenu" });
                });
        };
        this.getGroup = function () {
            this.loading(true);
            var collections = this.editingReport.dataSource();
            this.group.collections(collections);
            $("#groupCollection").selectmenu("refresh");
            this.group.fields.removeAll();
            this.group.collectionId(null);
            this.group.fieldId(null);
            if (collections.length) {
                this.group.collectionId(collections[0].id);
            }
            this.delayPop("Group", {
                positionTo: "#groupMenu"
            });
        };
        this.getAggregation = function () {
            this.loading(true);
            var collections = this.editingReport.dataSource();
            this.aggregation.collections(collections);
            $("#aggregationCollection").selectmenu("refresh");
            this.aggregation.fields.removeAll();
            this.aggregation.collectionId(null);
            this.aggregation.fieldId(null);
            this.aggregation.aggregationType("sum");
            if (collections.length) {
                this.aggregation.collectionId(collections[0].id);
            }
            this.delayPop("Aggregation", {
                positionTo: "#aggregationMenu"
            });
        };
        this.getCondition = function () {
            var collections = this.editingReport.dataSource();
            this.condition.collections(collections);
            $("#conditionCollection").selectmenu("refresh");
            this.condition.fields.removeAll();
            this.condition.collectionId(null);
            this.condition.fieldId(null);
            this.condition.conditionType("eq");
            this.condition.value(null);
            if (collections.length) {
                this.condition.collectionId(collections[0].id);
            }
            this.delayPop("Condition", {
                positionTo: "#conditionMenu"
            });
        };

        this.getSource = function () {
            var self = this;
            this.loading(true);
            this.sourceId("");
            this.sources.removeAll();
            BPMS.Services.getMetaList().then(function (result) {
                var original = self.editingReport.dataSource();
                var fnFilter = function (source) {
                    return original.filter(function (originalItem) {
                        return originalItem.id === source.collection;
                    }).length === 0;
                }
                var sources = result.value.filter(fnFilter);
                self.loading(false);
                self.sources(sources);
                self.delayPop("Source", { positionTo: "#sourceMenu" });
            });
        };
        this.selectSource = function (source) {
            this.sourceId(source.collection);
        };
        this.selectJoin = function (join) {
            this.joinId(join.id);
        };
        this.addJoin = function () {
            var self = this;
            var item = this.joins().filter(function (join) {
                return join.id === self.joinId();
            })[0];
            if (item) {
                this.editingReport.join.splice(this.joinIndex, 1, item);
                $.mobile.popup.active.close();
            }
        };

        this.addSource = function () {
            var self = this;
            var selected = this.sources().filter(function (source) {
                return source.collection === self.sourceId();
            })[0];
            if (selected) {
                var newItem = {
                    id: selected.collection,
                    name: selected.name
                }
                self.editingReport.dataSource.push(newItem);
                self.editingReport.join.push({
                    id: "",
                    name: ""
                });
                $.mobile.popup.active.close();
            }
        };
        this.addGroup = function () {
            var self = this;
            var collection = this.group.collections().filter(function (collection) {
                return collection.id === self.group.collectionId();
            })[0];
            var field = this.group.fields().filter(function (field) {
                return field.id === self.group.fieldId();
            })[0];
            if (!collection || !field) {
                return;
            }
            var item = {
                collectionId: collection.id,
                collectionName: collection.name,
                fieldId: field.id,
                fieldName: field.name
            }
            var existGroup = self.editingReport.group().filter(function (group) {
                return group.collectionId === item.collectionId && group.fieldId === item.fieldId;
            })[0];
            var existAggregation = self.editingReport.aggregation().filter(function (aggregation) {
                return aggregation.collectionId === item.collectionId
                    && aggregation.fieldId === item.fieldId
            })[0];

            if (existGroup || existAggregation) {
                self.triggerDelay({
                    type: "error",
                    "title": "字段已经存在",
                    "description": "该分组条件已经存在。"
                });
            } else {
                self.editingReport.group.push(item);
                self.triggerDelay();
            }
        };
        this.addAggregation = function () {
            var self = this;
            var collection = this.aggregation.collections().filter(function (collection) {
                return collection.id === self.aggregation.collectionId();
            })[0];
            var field = this.aggregation.fields().filter(function (field) {
                return field.id === self.aggregation.fieldId();
            })[0];
            if (!collection || !field) {
                return;
            }
            var item = {
                collectionId: collection.id,
                collectionName: collection.name,
                fieldId: field.id,
                fieldName: field.name,
                aggregationType: self.aggregation.aggregationType()
            }
            var existAggregation = self.editingReport.aggregation().filter(function (aggregation) {
                return aggregation.collectionId === item.collectionId
                    && aggregation.fieldId === item.fieldId
                    && aggregation.aggregationType === item.aggregationType;
            })[0];
            var existGroup = self.editingReport.group().filter(function (group) {
                return group.collectionId === item.collectionId && group.fieldId === item.fieldId;
            })[0];
            if (existGroup || existAggregation) {
                self.triggerDelay({
                    type: "error",
                    "title": "字段已经存在",
                    "description": "该查看字段已经存在。"
                });
            } else {
                self.editingReport.aggregation.push(item);
                self.triggerDelay();
            }
        };
        this.addCondition = function () {
            var self = this;
            var collection = this.condition.collections().filter(function (collection) {
                return collection.id === self.condition.collectionId();
            })[0];
            var field = this.condition.fields().filter(function (field) {
                return field.id === self.condition.fieldId();
            })[0];
            if (!collection || !field) {
                return;
            }
            var item = {
                collectionId: collection.id,
                collectionName: collection.name,
                fieldId: field.id,
                fieldName: field.name,
                conditionType: self.condition.conditionType(),
                value: self.condition.value()
            }
            var existCondition = self.editingReport.condition().filter(function (condition) {
                return condition.collectionId === item.collectionId
                    && condition.fieldId === item.fieldId
                    && condition.conditionType === item.conditionType
                    && condition.value === item.value;
            })[0];

            if (existCondition) {
                self.triggerDelay({
                    type: "error",
                    "title": "条件已经存在",
                    "description": "该条件已经存在。"
                });
            } else {
                self.editingReport.condition.push(item);
                self.triggerDelay();
            }
        };
        this.getChart = function (type) {
            if (!type) {
                return {};
            }
            var item = this.chartTypes.filter(function (chart) {
                return chart.id === type;
            })[0];
            return item;
        };
        this.criteria = {
            id: ko.observable(""),
            name: ko.observable("")
        };
        this.editingReport = {
            id: ko.observable(""),
            name: ko.observable(""),
            createdBy: ko.observable(""),
            createdName: ko.observable(""),
            createdAt: ko.observable(""),
            updatedBy: ko.observable(""),
            updatedName: ko.observable(""),
            updatedAt: ko.observable(""),
            dataSource: ko.observableArray([]),
            join: ko.observableArray([]),
            group: ko.observableArray([]),
            aggregation: ko.observableArray([]),
            condition: ko.observableArray([]),
            showType: ko.observable("")
        };
        this.creatingName = ko.observable("");
        this.doSearch = function () {
            $.mobile.popup.active.close();
            this.getData();
        };
        this.formatCell = function (item, property) {
            var paths = property.split(".");
            while (paths.length) {
                item = item[paths.shift()];
            }
            return item;
        };
        this.saveReport = function () {
            var self = this;
            this.editingReport.updatedAt(BPMS.Services.Utils.getCurrentTimeStamp().toString());
            this.editingReport.updatedBy(this.user.userId);
            var data = ko.toJS(this.editingReport);
            this.loading(true);
            data.type = "report";
            data._id = data.id;
            delete data.id;
            delete data.createdName;
            delete data.updatedName;
            return BPMS.Services.updateForm(data).then(
                function () {
                    self.loading(false);
                    self.pop("success", {
                        title: "保存报告成功",
                        description: "已成功保存该报告。",
                        callback: function () {
                            self.refresh();
                        }
                    });
                }, function () {
                    self.loading(false);
                    self.pop("error", {
                        title: "保存报告失败",
                        description: "保存报告失败, 请重试。"
                    });
                }
            );

        };
        this.previewReport = function () {
            var self = this;
            var fields;
            var join = this.editingReport.join();

            var source = this.editingReport.dataSource();
            if (source.length === 0) {
                this.preview.table({
                    headers: [],
                    rows: [],
                    formatCell: self.formatCell
                })
                return;
            }
            else if (source.length === 1) {
                this.loading(true);
                BPMS.Services.getMeta(source[0].id).then(function (response) {
                    fields = response.value.fields;
                    return BPMS.Services.getSingleData({
                        collection: source[0].id,
                        tenantId: "",
                        page: 1,
                        pageSize: 100
                    });
                }).then(
                    function (response) {
                        self.loading(false);

                        self.preview.table({
                            headers: fields,
                            rows: response.value,
                            formatCell: self.formatCell
                        });
                    }
                );
                var ctx = document.getElementById('previewChart').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            } else if (source.length === 2) {
                self.loading(true);
                var aggregationFields = self.editingReport.aggregation().map(function (aggregation) {
                    return {
                        //   alias: aggregation.fieldName + "(" + self.formatAggregationType(aggregation.aggregationType) + ")",
                        alias: aggregation.aggregationType + "(" + aggregation.fieldId + ")",
                        collectionId: aggregation.collectionId,
                        fieldId: aggregation.fieldId,
                        op: aggregation.aggregationType
                    };
                });
                var groupbyFields = self.editingReport.group().map(function (group) {
                    return {
                        collectionId: group.collectionId,
                        fieldId: group.fieldId,
                    };
                });

                var basicConditions = self.editingReport.condition().map(function (condition) {
                    return {
                        left: {
                            collectionId: condition.collectionId,
                            fieldId: condition.fieldId
                        },
                        op: condition.conditionType,
                        value: condition.value
                    };

                });
                $.when(BPMS.Services.getMeta(source[0].id), BPMS.Services.getMeta(source[1].id), BPMS.Services.getJoinData({
                    aggregationFields: aggregationFields,
                    basicConditions: basicConditions,
                    groupbyFields: groupbyFields,
                    inConditions: [],
                    joinConditions: [
                        {
                            left: {
                                collectionId: source[0].id,
                                fieldId: join[0].id
                            },
                            right: {
                                collectionId: source[1].id,
                                fieldId: join[1].id
                            }
                        }
                    ],
                    tenantId: ""
                })).then(function (meta1, meta2, data) {

                    var displayFields = [];
                    if (groupbyFields.length) {
                        var fields1 = meta1[0].value.fields.map(function (field) {
                            return {
                                collectionId: self.editingReport.dataSource()[0].id,
                                collectionName: self.editingReport.dataSource()[0].name,
                                fieldId: field.id,
                                fieldName: field.name
                            };
                        });
                        var fields2 = meta2[0].value.fields.map(function (field) {
                            return {
                                collectionId: self.editingReport.dataSource()[1].id,
                                collectionName: self.editingReport.dataSource()[1].name,
                                fieldId: field.id,
                                fieldName: field.name
                            };
                        });

                        var allFields = fields1.concat(fields2);
                        for (var i in groupbyFields) {
                            var groupField = groupbyFields[i];
                            var findField = allFields.filter(function (field) {
                                return field.collectionId == groupField.collectionId &&
                                    field.fieldId == groupField.fieldId;
                            })[0];
                            var id = groupbyFields.length == 1 ? "_id" : findField.fieldId;
                            displayFields.push({
                                id: id,
                                name: findField.fieldName
                            });
                        }
                        for (var i in aggregationFields) {
                            var aggregationField = aggregationFields[i];
                            var findField = allFields.filter(function (field) {
                                return field.collectionId == aggregationField.collectionId &&
                                    field.fieldId == aggregationField.fieldId;
                            })[0];
                            var id = aggregationField.op + "(" + findField.fieldId + ")";
                            var name = findField.fieldName + "(" + self.formatAggregationType(aggregationField.op) + ")";
                            displayFields.push({
                                id: id,
                                name: name
                            });
                        }
                    } else {
                        var fields1 = meta1[0].value.fields;
                        var fields2 = meta2[0].value.fields.map(function (field) {
                            return {
                                id: source[1].id + "." + field.id,
                                name: field.name
                            }
                        });
                        var allFields = fields1.concat(fields2);
                        displayFields = allFields;
                    }

                    var items = data[0].value;
                    self.loading(false);
                    self.preview.table({
                        headers: displayFields,
                        rows: items,
                        formatCell: self.formatCell
                    });
                });
            }
        };
        this.showMore = function () {
            this.delayPop("More", { positionTo: "#moreMenu" });
        };
        this.deleteReport = function () {
            var self = this;
            return BPMS.Services.deleteForm(this.editingReport.id()).then(function () {
                self.triggerDelay({
                    type: "success",
                    title: "删除报告成功",
                    description: "删除报告成功",
                    callback: function () {
                        self.editingReport.id("");
                        self.refresh();
                    }
                });


            });
        };
        this.refresh = function () {
            var self = this;
            return this.getData().then(function () {
                return self.selectReport(self.editingReport.id());
            });
        };

        this.createReport = function () {
            this.creatingName("");
            this.delayPop("CreateReport");
        };

        this.selectShowType = function (model) {
            this.editingReport.showType(model.id);
            $.mobile.popup.active.close();
        };

        this.doCreateReport = function () {
            var self = this;
            var statusElement = $("#createName").parent();
            statusElement.removeClass("ui-invalid");
            var name = this.creatingName() && this.creatingName().trim() || "";
            if (!name) {
                statusElement.addClass("ui-invalid");
                return;
            }
            var stamp = BPMS.Services.Utils.getCurrentTimeStamp().toString();

            var item = {
                _id: stamp,
                name: name,
                type: "report",
                createdBy: this.user.userId,
                createdAt: stamp,
                dataSource: [],
                join: [],
                showType: "table"
            };
            this.loading(true);

            BPMS.Services.addUniqueForm(item).then(
                function (res) {
                    self.loading(false);
                    self.getData();
                    self.triggerDelay({
                        type: "success",
                        title: "创建报告成功",
                        description: "已成功创建报告, 可继续编辑报告内容。",
                        callback: function () {
                            self.getData().then(function () {
                                self.selectReport(stamp);
                            });
                        }
                    });
                }, function (res) {
                    self.loading(false);
                    if (res && res.errorType &&
                        res.errorType === "FileAlreadyExist") {
                        statusElement.addClass("ui-invalid");
                        this.loading(false);
                        return;
                    }
                    self.triggerDelay({
                        type: "error",
                        title: "创建报告失败",
                        description: "创建报告失败, 请重试。"
                    });
                }
            );
        };
        this.getPrev = function () {
            var report = this.report;
            if (report.hasPrev()) {
                report.pageIndex(report.pageIndex() - 1);
                this.getData();
            }
        };
        this.getNext = function () {
            var report = this.report;
            if (report.hasPrev()) {
                report.pageIndex(report.pageIndex() + 1);
                this.getData();
            }
        };
        this.report = new BPMS.Services.Utils.CreateTypeData(BPMS.config.pageSize);
        this.selectReport = function (id) {
            var dfd = $.Deferred();
            var self = this;
            if (!id) {
                BPMS.Services.Utils.resetKo(self.editingReport);
                dfd.resolve();
                return dfd.promise();
            }
            this.loading(true);
            BPMS.Services.getForm(id).then(function (result) {
                return self.appendName([result]);
            }).then(function (items) {
                self.loading(false);
                var item = items[0];
                for (var i in self.editingReport) {
                    var value = item[i];
                    self.editingReport[i](value);
                }
                self.previewReport();
                dfd.resolve();
            });
            return dfd.promise();
        };
        this.getData = function () {
            var self = this;
            this.loading(true);
            var filter = { type: "report" };
            if (self.criteria.id()) {
                filter._id = {
                    "$regex": ".*" + self.criteria.id() + ".*"
                }
            }
            if (self.criteria.name()) {
                filter.name = {
                    "$regex": ".*" + self.criteria.name() + ".*"
                }
            }
            this.filter = filter;
            this.loading(true);
            return BPMS.Services.getForms({ count: "", pagesize: 0, filter: this.filter }).then(function (result) {
                self.report.total(result._size);
            }).then(function () {
                return self.getReports();
            });
        };
        this.appendName = function (items) {
            var ids = [];
            var dfd = $.Deferred();
            items.forEach(function (item) {
                item.id = item._id;
                delete item._id;
                item.createdBy = item.createdBy || "";
                item.createdAt = item.createdAt || "";
                item.createdName = "";
                item.updatedBy = item.updatedBy || "";
                item.updatedAt = item.updatedAt || "";
                item.updatedName = "";
                if (item.createdBy && ids.indexOf(item.createdBy) < 0) {
                    ids.push(item.createdBy);
                }
                if (item.updatedBy && ids.indexOf(item.updatedBy) < 0) {
                    ids.push(item.updatedBy);
                }
            });
            BPMS.Services.getUsers(ids).then(function () {
                Array.prototype.forEach.call(arguments, function (tempUser) {
                    if (!tempUser || (!tempUser.length && !tempUser.id) || tempUser.readyState) {
                        return;
                    }
                    var singleUser = tempUser[0] || tempUser;
                    items.forEach(
                        function (item) {
                            var fullName = (singleUser.firstName + " " + singleUser.lastName).trim();
                            if (item && item.createdBy && item.createdBy === singleUser.id) {
                                item.createdName = fullName;
                            }
                            if (item && item.updatedBy && item.updatedBy === singleUser.id) {
                                item.updatedName = fullName;
                            }
                        }
                    );

                });
                dfd.resolve(items);
            }, function () {
                dfd.reject();
            });
            return dfd.promise();

        };
        this.getReports = function () {
            var self = this;
            this.report.items.removeAll();
            var size = this.report.pageSize();
            var page = this.report.pageIndex();

            var failCallback = function () {
                self.pop("error", {
                    title: "获取报告列表失败",
                    description: "由于网络原因，无法成功获取数据，请稍后重试。"
                });
                self.loading(false);
            };

            baseRequest = BPMS.Services.getForms({
                pagesize: size,
                page: page,
                filter: this.filter
            }).then(function (result) {
                return self.appendName(result._embedded);
            }, failCallback).then(function (items) {
                self.loading(false);
                self.report.items(items);
            }, failCallback);
            return baseRequest;
        };
    };
    BPMS.ViewModels.ReportListViewModel.extend(BPMS.ViewModels.BaseViewModel);
})(window.BPMS = window.BPMS || {}, jQuery, ko);