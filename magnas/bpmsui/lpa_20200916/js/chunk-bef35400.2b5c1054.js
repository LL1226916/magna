(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-bef35400"],{"14d9":function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"row"},[e("div",{staticClass:"col-lg-4 col-xl-3 col-md-5"},[e("div",{staticClass:"panel",attrs:{id:"panel-1"}},[t._m(0),e("div",{staticClass:"panel-container show"},[e("div",{staticClass:"panel-content p-0",staticStyle:{"overflow-y":"visible","overflow-x":"visible"}},[e("ul",{staticClass:"nav-menu",attrs:{id:"js-nav-menu"}},t._l(t.forms,(function(a){return e("li",{key:a._id},[e("a",{staticClass:"p-3",attrs:{href:"javascript:void(0);",title:"Category"},on:{click:function(e){return t.selectForm(a)}}},[e("i",{staticClass:"fad fa-fw fa-folder"}),e("span",{staticClass:"nav-link-text",staticStyle:{color:"#263238"}},[t._v(t._s(a.name))]),e("small",[t._v(" "+t._s(a._id)+" "),e("br"),e("b",[t._v(t._s(a.createdName))]),e("br"),e("span",[t._v(t._s(t.moment(Number(a.createdAt)).format("YYYY-MM-DD HH:mm")))])])])])})),0)])])])]),e("div",{staticClass:"col-lg-8 col-xl-9 col-md-7"},[e("div",{staticClass:"panel",attrs:{id:"panel-prev"}},[e("div",{staticClass:"panel-hdr"},[e("h2",[e("span",[t._v(t._s(t.form.name||""))]),e("span",{staticClass:"fw-300"},[e("i",[t._v(t._s(t.form._id||""))])])]),e("div",{staticClass:"panel-toolbar",staticStyle:{"padding-right":"1em"}},[e("a",{directives:[{name:"show",rawName:"v-show",value:t.form._id,expression:"form._id"}],staticClass:"waves-effect waves-themed",staticStyle:{"margin-right":"24px"},attrs:{href:"javascript:void(0)"},on:{click:function(a){return t.editForm()}}},[e("i",{staticClass:"fal fa-fw fa-pen mr-2"}),t._v("编辑 ")]),e("a",{directives:[{name:"show",rawName:"v-show",value:t.form._id,expression:"form._id"}],staticClass:"waves-effect waves-themed text-danger",staticStyle:{"margin-right":"24px"},attrs:{href:"#","data-toggle":"modal","data-target":"#deleteModal"}},[e("i",{staticClass:"fal fa-fw fa-trash-alt mr-2"}),t._v("删除 ")]),t._m(1),t._m(2)]),e("div",{staticClass:"modal fade",attrs:{id:"deleteModal",tabindex:"-1",role:"dialog","aria-labelledby":"deleteModalTitle","aria-hidden":"true"}},[e("div",{staticClass:"modal-dialog modal-dialog-centered",attrs:{role:"document"}},[e("div",{staticClass:"modal-content"},[t._m(3),e("div",{staticClass:"modal-body"},[t._v("是否删除当前记录？ 请注意，此操作不可逆。")]),e("div",{staticClass:"modal-footer"},[e("button",{staticClass:"btn btn-secondary",attrs:{type:"button","data-dismiss":"modal"}},[t._v("取消")]),e("button",{staticClass:"btn btn-warning",attrs:{type:"button"},on:{click:function(a){return t.deleteForm()}}},[e("i",{staticClass:"fal fa-fw fa-trash-alt mr-2"}),t._v("删除 ")])])])])])]),e("div",{staticClass:"panel-container show"},[e("div",{staticClass:"panel-content"},[e("div",{staticClass:"row"},[e("div",{staticClass:"col-3 mt-2"},[e("label",{directives:[{name:"show",rawName:"v-show",value:t.form._id,expression:"form._id"}],staticClass:"form-label fw-300"},[e("i",{staticClass:"fal fa-fw fa-calendar-day mr-2"}),e("span",[t._v(t._s(t.moment(Number(t.form.createdAt)).format("YYYY-MM-DD HH:mm")))])])]),e("div",{staticClass:"col-3 mt-2"},[e("label",{directives:[{name:"show",rawName:"v-show",value:t.form._id,expression:"form._id"}],staticClass:"form-label fw-300",attrs:{for:"simpleinput"}},[e("i",{staticClass:"fal fa-fw fa-user-circle mr-2"}),e("span",[t._v(t._s(t.form.createdName))])])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.form._id&&t.form.updatedAt,expression:"form._id && form.updatedAt"}],staticClass:"col-3 mt-2"},[e("label",{staticClass:"form-label fw-300"},[e("i",{staticClass:"fal fa-fw fa-calendar-day mr-2"}),e("span",[t._v(t._s(t.moment(Number(t.form.updatedAt)).format("YYYY-MM-DD HH:mm")))])])]),e("div",{directives:[{name:"show",rawName:"v-show",value:t.form._id&&t.form.updatedBy,expression:"form._id && form.updatedBy"}],staticClass:"col-3 mt-2"},[e("label",{staticClass:"form-label fw-300"},[e("i",{staticClass:"fal fa-fw fa-user-circle mr-2"}),e("span",[t._v(t._s(t.form.updatedName))])])])])])])]),t._m(4)])])},r=[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"panel-hdr"},[e("h2",{staticClass:"fw-300"},[t._v("表单列表")]),e("div",{staticClass:"panel-toolbar"},[e("button",{staticClass:"btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed",attrs:{"data-action":"panel-collapse","data-toggle":"tooltip","data-offset":"0,10","data-original-title":"Collapse"}},[e("i",{staticClass:"fal fa-fw fa-minus"})]),e("button",{staticClass:"btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed",attrs:{"data-action":"panel-fullscreen","data-toggle":"tooltip","data-offset":"0,10","data-original-title":"Fullscreen"}},[e("i",{staticClass:"fal fa-fw fa-expand"})])])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("button",{staticClass:"btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed",attrs:{"data-action":"panel-collapse","data-toggle":"tooltip","data-offset":"0,10","data-original-title":"Collapse"}},[e("i",{staticClass:"fal fa-fw fa-minus"})])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("button",{staticClass:"btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed",attrs:{"data-action":"panel-fullscreen","data-toggle":"tooltip","data-offset":"0,10","data-original-title":"Fullscreen"}},[e("i",{staticClass:"fal fa-fw fa-expand"})])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"modal-header"},[e("h5",{staticClass:"modal-title",attrs:{id:"deleteModalTitle"}},[t._v("删除记录")]),e("button",{staticClass:"close",attrs:{type:"button","data-dismiss":"modal","aria-label":"Close"}},[e("span",{attrs:{"aria-hidden":"true"}},[t._v("×")])])])},function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"panel",attrs:{id:"panel-preview"}},[e("div",{staticClass:"panel-hdr"},[e("h2",[t._v("预览")]),e("div",{staticClass:"panel-toolbar"},[e("button",{staticClass:"btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed",attrs:{"data-action":"panel-collapse","data-toggle":"tooltip","data-offset":"0,10","data-original-title":"Collapse"}},[e("i",{staticClass:"fal fa-fw fa-minus"})]),e("button",{staticClass:"btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed",attrs:{"data-action":"panel-fullscreen","data-toggle":"tooltip","data-offset":"0,10","data-original-title":"Fullscreen"}},[e("i",{staticClass:"fal fa-fw fa-expand"})])])]),e("div",{staticClass:"panel-container show"},[e("div",{staticClass:"panel-content"},[e("div",{attrs:{id:"formData"}})])])])}],n=e("a49b"),i=e("f523"),o=e("f817"),l={data:function(){return{user:null,forms:[],form:{},moment:o["a"],config:n["a"]}},created:function(){this.refresh()},methods:{refresh:function(){var t=this;this.form={},i["a"].getItems("form").then((function(a){t.forms=a,console.log(a)}))},selectForm:function(t){this.form=t,Formio.createForm(document.getElementById("formData"),{components:t.formData},{language:"ch",i18n:n["a"].i18n}).then((function(t){}))},editForm:function(){this.form&&this.form._id&&this.$router.push({name:"formEdit",query:{id:this.form._id}})},deleteForm:function(){var t=this;this.form._id&&i["a"].deleteItem("form",this.form._id).then((function(a){t.refresh(),$("#deleteModal").modal("hide")}))}}},d=l,f=e("2877"),c=Object(f["a"])(d,s,r,!1,null,"6a17b9b6",null);a["default"]=c.exports},"3ca3":function(t,a,e){"use strict";var s=e("6547").charAt,r=e("69f3"),n=e("7dd0"),i="String Iterator",o=r.set,l=r.getterFor(i);n(String,"String",(function(t){o(this,{type:i,string:String(t),index:0})}),(function(){var t,a=l(this),e=a.string,r=a.index;return r>=e.length?{value:void 0,done:!0}:(t=s(e,r),a.index+=t.length,{value:t,done:!1})}))},f523:function(t,a,e){"use strict";e("4de4"),e("7db0"),e("4160"),e("c975"),e("d81d"),e("b0c0"),e("d3b7"),e("3ca3"),e("498a"),e("159b"),e("ddb0");var s=e("a49b"),r=e("bc3a"),n=e.n(r),i=e("323e"),o=e.n(i);n.a.interceptors.request.use((function(t){return o.a.start(),t})),n.a.interceptors.response.use((function(t){return o.a.done(),t}),(function(t){return o.a.done(),Promise.reject(t.response)})),a["a"]={getUsers:function(t){var a=this,e=t.map((function(t){return a.requestBpmn("identity/users/"+t)}));return Promise.all(e)},getItem:function(t,a){var e,r=this,i=s["a"][t+"Url"];return n.a.get(i+a).then((function(t){e=t;var a=e.data,s=[];return a.createdBy&&s.indexOf(a.createdBy)<0&&s.push(a.createdBy),a.updatedBy&&s.indexOf(a.updatedBy)<0&&s.push(a.updatedBy),r.getUsers(s)})).then((function(t){var a=e.data,s=t.map((function(t){return t.data}));if(a.createdBy){var r=s.find((function(t){return t.id.toLowerCase()===a.createdBy.toLowerCase()}));a.createdName=(r.firstName+" "+r.lastName).trim()}return a.updatedBy&&(r=s.find((function(t){return t.id.toLowerCase()===a.updatedBy.toLowerCase()})),a.updatedName=(r.firstName+" "+r.lastName).trim()),Promise.resolve(e)}))},getItems:function(t,a){var e=this,r=s["a"][t+"Url"];return new Promise((function(s,i){a=a||{},a.filter=a.filter||{},a.filter.type=t,a.filter=JSON.stringify(a.filter),a.sort&&(a.sort=JSON.stringify(a.sort));var o={dataType:"json",url:r,method:"get",params:a},l=[];return n()(o).then((function(t){l=t.data._embedded;var a=[];return l.forEach((function(t){t.createdBy&&a.indexOf(t.createdBy)<0&&a.push(t.createdBy),t.updatedBy&&a.indexOf(t.updatedBy)<0&&a.push(t.updatedBy)})),e.getUsers(a)})).then((function(t){l.forEach((function(a){var e=t.map((function(t){return t.data}));if(a.createdBy){var s=e.find((function(t){return t.id.toLowerCase()===a.createdBy.toLowerCase()}));a.createdName=(s.firstName+" "+s.lastName).trim()}a.updatedBy&&(s=e.find((function(t){return t.id.toLowerCase()===a.updatedBy.toLowerCase()})),a.updatedName=(s.firstName+" "+s.lastName).trim())})),s(l)}))}))},saveItem:function(t,a){return this.getItems(t,{filter:{name:a.name,_id:{$ne:a._id}}}).then((function(e){return e&&e.length?Promise.reject({message:'名称"'+a.name+'"已存在。'}):n()({dataType:"json",url:s["a"][t+"Url"],headers:{"Content-Type":"application/json"},method:"post",data:a})}))},deleteItem:function(t,a){var e=s["a"][t+"Url"];e+=a;var r={dataType:"text",url:e,method:"delete",data:{}};return n()(r)},requestBpmn:function(t,a,e){a=a||"GET";var r=s["a"].bpmnUrl+(t||""),i={dataType:"json",url:r,headers:{Authorization:sessionStorage.getItem("token"),"Content-Type":"application/json"},method:a};return"GET"===a?i.params=e:i.data=e,n()(i)},upload:function(t){return n()({method:"post",url:s["a"].uploadUrl+"upload",data:t,headers:{"Content-Type":"multipart/form-data"}})},getProcessTemplate:function(t){return n()({method:"get",url:"template/"+t+".bpmn",headers:{"Content-Type":"text"}})}}}}]);
//# sourceMappingURL=chunk-bef35400.2b5c1054.js.map