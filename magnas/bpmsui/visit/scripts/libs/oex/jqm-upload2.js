// note: this does not rely on knockout's upload binding
ko.bindingHandlers[getBindingName("upload")] = (function () {
    $.fn.localResizeIMG = function (obj) {
        var file = this[0].files[0];
        var URL = window.URL || window.webkitURL;
        var blob = URL.createObjectURL(file);

        // 执行前函数
        if ($.isFunction(obj.before)) {
            obj.before(this, blob, file)
        };
        _create(blob, file);

        /**
         * 生成base64
         * @param blob 通过file获得的二进制
         */
        function _create(blob) {
            var img = new Image();
            img.src = blob;

            img.onload = function () {
                var that = this;

                //生成比例
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = obj.width || w;
                h = w / scale;

                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                $(canvas).attr({
                    width: w,
                    height: h
                });
                ctx.drawImage(that, 0, 0, w, h);

                /**
                 * 生成base64
                 * 兼容修复移动设备需要引入mobileBUGFix.js
                 */
                var base64 = canvas.toDataURL('image/jpeg', obj.quality || 0.8);

                // 修复IOS
                if (navigator.userAgent.match(/iphone/i)) {
                    var mpImg = new MegaPixImage(img);
                    mpImg.render(canvas, {
                        maxWidth: w,
                        maxHeight: h,
                        quality: obj.quality || 0.8
                    });
                    base64 = canvas.toDataURL('image/jpeg', obj.quality || 0.8);
                }

                // 修复android
                if (navigator.userAgent.match(/Android/i)) {
                    var encoder = new JPEGEncoder();
                    base64 = encoder.encode(ctx.getImageData(0, 0, w, h), obj.quality * 100 || 80);
                }

                // 生成结果
                var result = {
                    base64: base64,
                    clearBase64: base64.substr(base64.indexOf(',') + 1)
                };

                // 执行后函数
                obj.success(result);
            };
        }
    };


    return {
        //after: ["attr", "value"],
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $root = bindingContext.$root;
            var modelValue = valueAccessor();
            var $element = $(element);
            var fnInvalid = allBindings() && allBindings().invalid;
            if (modelValue() === null) {
                modelValue("[]");
            }
            var controlType = $element.attr("control-type");
            var $form = $element.closest("form");
            $form.attr("action", entrance.config.attachmentUrl + "upload");
            $form.attr("enctype", "multipart/form-data");
            $form.attr("method", "post");
            if (!$("#uploadItemTemplate").length) {
                var template = "<script type=\"text/html\" id=\"uploadItemTemplate\">" +
                    "<li data-icon=\"delete\">" +
                    "<a href=\"javascript:void(0);\" data-bind=\"click:$parent.removeAttachment\">" +
                    "<i class=\"fa fa-file-pdf-o\"></i><span data-bind=\"text:('&nbsp;'+name)\"></span>" +
                    "<p style=\"margin-bottom:0px;\"><font color=\"gray\" data-bind=\"text:size\"></font></p>" +
                    "</a>" +
                    "</li>" +
                    "</script>";
                $("body").append(template);

            }
            viewModel.selectFile = function () {
                var value = $($element).val();
                this.canAddAttachment(!!value);
            };
            viewModel.removeAttachment = function ($data) {
                viewModel.attachments.remove($data);
                var value = JSON.stringify(viewModel.attachments());
                modelValue(value);
            };
            viewModel.addAttachment = function () {

                if (!this.canAddAttachment()) {
                    return false;
                }
                $root.loading(true);

                var file = $element[0].files[0];
                if ((file.type).indexOf("image/") < 0) {
                    $root.loading(false);
                    $root.show({
                        "title": "文件类型错误",
                        "subTitle": "请上传图片文件（格式BMP、JPG、JPEG、PNG、GIF等）",
                        "detail": ""
                    });
                    return;
                }

                var quality = Math.min(1, 50000 / file.size);
                var dataURLtoBlob = function (dataurl) {
                    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    return new Blob([u8arr], { type: mime });
                }
                $element.localResizeIMG({
                    quality: 1,
                    width: 300,
                    //before: function (that, blob) {},
                    success: function (result) {
                        var formData = new FormData();
                        var compressImage = dataURLtoBlob(result.base64);
                        var fileOfBlob = new File([compressImage], file.name);
                        formData.append("attachment", fileOfBlob);
                        formData.append("user", $root.tel());
                        formData.append("id", entrance.config.processDefinitionId);
                        $form.ajaxSubmit({
                            formData: formData,
                            "success": function (data) {
                                $root.loading(false);
                                viewModel.attachments.push(data);
                                viewModel.canAddAttachment(false);
                                $element.val("");
                                var value = JSON.stringify(viewModel.attachments());
                                modelValue(value);
                            },
                            "error": function (err) {
                                var code = "";
                                if (err && err.status && err.statusText)
                                    code = "错误代码：" + err.status + " " + err.statusText;
                                $root.show({
                                    "title": "上传附件失败",
                                    "description": "",
                                    "subTitle": "该请求无法成功处理，请稍后重试。",
                                    "code": code
                                });
                                $root.loading(false);
                            }
                        });

                    }
                });

            };
            viewModel.canAddAttachment = ko.observable(false);
            viewModel.attachments = ko.observableArray([]);
            ko.applyBindingsToNode(element, { event: { change: viewModel.selectFile } }, bindingContext);



        },

        update: function (element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var $element = $(element);
            var fnInvalid = allBindings() && allBindings().invalid;


        }
    };


})();
