var model = {
    el: "#app",
    data: {
        user: null,
        forms:[]
    },
    created: function () {
        var that = this;
       that.refresh();
    },
    methods: {
        refresh: function () {
            var that = this;
            var forms = [];

            bpmn.utils.getForms().then(function(){
                
            });
        },
        
     
        upload: function () {
            var that = this;
            if (!this.uploadContent.resourceId ||
                !this.uploadContent.file1 &&
                !this.uploadContent.file2 &&
                !this.uploadContent.file3) {
                return;
            }
            $("#uploadForm").ajaxSubmit({
                success: function (data) {
                    that.closeModal();
                    that.message.title = that.$t("uploadCustomizedPictures");
                    that.message.content = that.$t("uploadSuccess");
                    $("#messageModal").modal("show");
                },
                error: function (err) {
                    that.closeModal();
                    that.message.title = that.$t("uploadCustomizedPictures");
                    that.message.content = that.$t("uploadFail");
                    $("#messageModal").modal("show");
                }
            });
        },
        startUpload: function () {
            this.resetUpload();
            $("#uploadModal").modal("show");
        },
        resetUpload: function () {
            for (var i in this.uploadContent) {
                this.uploadContent[i] = "";
            }
            $("#file1").val("");
            $("#file2").val("");
            $("#file3").val("");
        },
        changeFile: function (oEvent) {
            console.log(oEvent);
            var field = oEvent.target.id;
            var name = (oEvent.target.files && oEvent.target.files.length) ? oEvent.target.files[0].name : "";
            this.uploadContent[field] = name;
        },
        closeModal: function () {
            $(".modal.show").modal("hide");
        }
    }
};


bpmn.utils.createModel(model);