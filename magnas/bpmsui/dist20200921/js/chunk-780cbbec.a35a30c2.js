(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-780cbbec"],{"2a41":function(a,t,e){"use strict";e.r(t);var i=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"d-flex flex-grow-1 p-0"},[e("div",{staticClass:"d-flex flex-column flex-grow-1 bg-white"},[e("div",{staticClass:"flex-wrap align-items-center flex-grow-1 position-relative bg-gray-50"},[e("div",{staticClass:"position-absolute pos-top pos-bottom w-100 custom-scroll"},[e("div",{staticClass:"d-flex h-100 flex-column"},[e("div",{staticClass:"d-flex align-items-center pl-2 pr-3 py-3 pl-sm-3 pr-sm-4 py-sm-4 px-lg-3 py-lg-3 flex-shrink-0 bg-white"},[e("h1",{staticClass:"subheader-title fs-md mb-0 mt-1 ml-3 text-black-50 fw-900"},[a._v(a._s(a.task.name))]),e("small",{style:{visibility:a.task.dueDate?"visible":"hidden"}},[e("i",{staticClass:"far fa-fw fa-alarm-exclamation mr-2"}),a._v(" "+a._s(a.moment(a.task.dueDate).format("YYYY-MM-DD HH:mm"))+" ")])]),a._l(a.formData,(function(t,i){return e("div",{key:t.id,staticClass:"d-flex flex-column border-faded border-top-0 border-left-0 border-right-0 py-3 px-3 px-sm-4 px-lg-0 mr-0 mr-lg-5 flex-shrink-0",attrs:{id:"legend"+t.id}},[e("div",{staticClass:"d-flex align-items-center flex-row"},[e("div",{staticClass:"ml-0 mr-3 mx-lg-4"},[e("i",{staticClass:"fad fa-2x fa-fw",class:{"fa-question-square":!t.complete,"text-default":!t.complete,"fa-check":!!t.complete,"text-success":!!t.complete}})]),e("div",{staticClass:"fw-500 flex-1 d-flex flex-column cursor-pointer",attrs:{"data-toggle":"collapse","data-target":"#legend"+t.id+" > .js-collapse"}},[e("div",{staticClass:"fs-sm"},[e("span",{staticClass:"fw-900 color-black"},[a._v(a._s(t.legend))])])]),e("div",{staticClass:"color-fusion-200 fs-sm",staticStyle:{"text-align":"right"}},[e("span",{staticClass:"text-primary"},[e("strong",[a._v(a._s(i+1))])])])]),e("div",{staticClass:"collapse js-collapse"},[e("div",{staticClass:"pl-lg-5 ml-lg-5 pt-3 pb-4 mt-0"},[e("div",{staticClass:"row color-black panel-tag ml-0 mt-0 mb-0 fs-sm"},[e("div",{staticClass:"col-12 mb-2"},a._l(t.components,(function(t){return e("field",{directives:[{name:"show",rawName:"v-show",value:!t.hidden,expression:"!field.hidden"}],key:t.id,attrs:{data:t},on:{change:a.updateVisibility,"update:data":function(a){t=a}}})})),1),a._m(0,!0),e("div",{staticClass:"col-6 mt-2"},[e("a",{staticClass:"btn btn-default btn-sm btn-block fw-400",class:{disabled:0===i},attrs:{href:"javascript:void(0);"},on:{click:function(t){return a.goStep(i,i-1)}}},[e("i",{staticClass:"fad fa-fw fa-angle-double-left mr-2"}),a._v("上一条 ")])]),e("div",{staticClass:"col-6 mt-2"},[e("a",{staticClass:"btn btn-default btn-sm btn-block fw-400",class:{disabled:i===a.formData.length-1},attrs:{href:"javascript:void(0);"},on:{click:function(t){return a.goStep(i,i+1)}}},[e("i",{staticClass:"fad fa-fw fa-angle-double-right mr-2"}),a._v("下一条 ")])])])])])])}))],2)])])])])},s=[function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"col-12 mb-2"},[e("div",{staticClass:"dropdown-divider"})])}],r=(e("99af"),e("7db0"),e("4160"),e("c975"),e("d81d"),e("fb6a"),e("d3b7"),e("159b"),e("a49b"),e("90b9")),n=e("f523"),l=e("f817"),o=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"form-group"},["textfield"===a.data.type?e("div",[e("label",{staticClass:"form-label fw-400 text-black-50",attrs:{for:a.data.id}},[a._v(a._s(a.data.label)+" "),e("i",{directives:[{name:"show",rawName:"v-show",value:a.data.validate.required,expression:"data.validate.required"}],staticClass:"fal fa-fw fa-asterisk text-danger "})]),e("input",{directives:[{name:"model",rawName:"v-model",value:a.data.value,expression:"data.value"}],staticClass:"form-control form-control-sm",class:{"is-invalid":a.data.invalid},attrs:{type:"text",id:a.data.id},domProps:{value:a.data.value},on:{input:function(t){t.target.composing||a.$set(a.data,"value",t.target.value)}}})]):a._e(),"textarea"===a.data.type?e("div",[e("label",{staticClass:"form-label fw-400 text-black-50",attrs:{for:a.data.id}},[a._v(a._s(a.data.label)+" "),e("i",{directives:[{name:"show",rawName:"v-show",value:a.data.validate.required,expression:"data.validate.required"}],staticClass:"fal fa-fw fa-asterisk text-danger"})]),e("textarea",{directives:[{name:"model",rawName:"v-model",value:a.data.value,expression:"data.value"}],staticClass:"form-control",class:{"is-invalid":a.data.invalid},attrs:{id:a.data.id,rows:"3"},domProps:{value:a.data.value},on:{input:function(t){t.target.composing||a.$set(a.data,"value",t.target.value)}}})]):a._e(),"number"===a.data.type?e("div",[e("label",{staticClass:"form-label fw-400 text-black-50",attrs:{for:a.data.id}},[a._v(a._s(a.data.label)+" "),e("i",{directives:[{name:"show",rawName:"v-show",value:a.data.validate.required,expression:"data.validate.required"}],staticClass:"fal fa-fw fa-asterisk text-danger"})]),e("input",{directives:[{name:"model",rawName:"v-model",value:a.data.value,expression:"data.value"}],staticClass:"form-control form-control-sm",class:{"is-invalid":a.data.invalid},attrs:{type:"number",id:a.data.id},domProps:{value:a.data.value},on:{input:function(t){t.target.composing||a.$set(a.data,"value",t.target.value)}}})]):a._e(),"date"===a.data.type?e("div",[e("label",{staticClass:"form-label fw-400 text-black-50",attrs:{for:a.data.id}},[a._v(a._s(a.data.label)+" "),e("i",{directives:[{name:"show",rawName:"v-show",value:a.data.validate.required,expression:"data.validate.required"}],staticClass:"fal fa-fw fa-asterisk text-danger"})]),e("input",{directives:[{name:"model",rawName:"v-model",value:a.data.value,expression:"data.value"}],staticClass:"form-control form-control-sm",class:{"is-invalid":a.data.invalid},attrs:{type:"date",id:a.data.id},domProps:{value:a.data.value},on:{input:function(t){t.target.composing||a.$set(a.data,"value",t.target.value)}}})]):a._e(),"radio"===a.data.type?e("div",[e("label",{staticClass:"form-label fw-400 text-black-50",attrs:{for:a.data.id}},[a._v(a._s(a.data.label)+" "),e("i",{directives:[{name:"show",rawName:"v-show",value:a.data.validate.required,expression:"data.validate.required"}],staticClass:"fal fa-fw fa-asterisk text-danger ml-2"})]),e("div",a._l(a.data.values,(function(t,i){return e("div",{key:i,staticClass:"custom-control custom-radio custom-control-inline",class:{"is-invalid":a.data.invalid}},[e("input",{directives:[{name:"model",rawName:"v-model",value:a.data.value,expression:"data.value"}],staticClass:"custom-control-input",class:{"is-invalid":a.data.invalid},attrs:{type:"radio",id:a.data.id+i,name:a.data.id},domProps:{value:t.value,checked:a._q(a.data.value,t.value)},on:{change:[function(e){return a.$set(a.data,"value",t.value)},function(t){return a.changeSelection(t,a.data)}]}}),e("label",{staticClass:"custom-control-label",attrs:{for:a.data.id+i}},[a._v(a._s(t.label))])])})),0)]):a._e(),"file"===a.data.type?e("File",{attrs:{data:a.data},on:{"update:data":function(t){a.data=t}}}):a._e(),"select"===a.data.type?e("div",[e("label",{staticClass:"form-label fw-400 text-black-50",attrs:{for:a.data.id}},[a._v(a._s(a.data.label)+" "),e("i",{directives:[{name:"show",rawName:"v-show",value:a.data.validate.required,expression:"data.validate.required"}],staticClass:"fal fa-fw fa-asterisk text-danger"})]),e("select",{directives:[{name:"model",rawName:"v-model",value:a.data.value,expression:"data.value"}],staticClass:"form-control",class:{"is-invalid":a.data.invalid},attrs:{id:a.data.id,name:a.data.id},on:{change:[function(t){var e=Array.prototype.filter.call(t.target.options,(function(a){return a.selected})).map((function(a){var t="_value"in a?a._value:a.value;return t}));a.$set(a.data,"value",t.target.multiple?e:e[0])},function(t){return a.changeSelection(t,a.data)}]}},a._l(a.data.data.values,(function(t,i){return e("option",{key:i,domProps:{value:t.value}},[a._v(a._s(t.label))])})),0)]):a._e()],1)},d=[],c=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",[e("label",{staticClass:"form-label fw-400 text-black-50",attrs:{for:a.data.id}},[a._v(a._s(a.data.label)+" "),e("i",{directives:[{name:"show",rawName:"v-show",value:a.data.validate.required,expression:"data.validate.required"}],staticClass:"fal fa-fw fa-asterisk text-danger"})]),e("div",{staticClass:"input-group"},[e("div",{staticClass:"custom-file"},[e("input",{staticClass:"custom-file-input",class:{"is-invalid":a.data.invalid},attrs:{type:"file",id:a.data.id,"aria-describedby":"btn"+a.data.id},on:{change:function(t){return a.changeFile(t)}}}),e("label",{staticClass:"custom-file-label",attrs:{for:a.data.id}},[a._v(a._s(a.name||"选择文件"))])]),e("div",{staticClass:"input-group-append"},[e("button",{staticClass:"btn btn-outline-default waves-effect waves-themed",class:{disabled:!a.name},attrs:{type:"button",id:"btn"+a.data.id},on:{click:function(t){return a.upload(t)}}},[a._v("上传")])])]),a._l(a.files,(function(t,i){return e("ul",{key:t.path,staticClass:"list-group shadow-sm"},[e("li",{staticClass:"list-group-item d-flex justify-content-between align-items-center"},[a._v(" "+a._s(t.name)+" "),e("a",{staticClass:"badge badge-danger badge-pill",attrs:{href:"javascript:void(0);"},on:{click:function(t){return a.removeFile(i)}}},[e("i",{staticClass:"far fa-fw fa-times mr-2"}),a._v("删除 ")])])])}))],2)},u=[],f=(e("b0c0"),{data:function(){return r["a"].createModel({name:"",files:[]})},props:["data"],created:function(){var a=this;this.data.value||(this.data.value="[]");var t=JSON.parse(this.data.value);t.forEach((function(t){a.files.push(t)}))},mounted:function(){},methods:{changeFile:function(a){var t=a.target.files[0],e=t&&t.name||"";this.name=e},upload:function(a){var t=this,e=$(a.target).closest(".input-group").find("input"),i=e[0].files;if(i&&0!==i.length){var s=new FormData;s.append("fileUploaded",i[0]),s.append("user",this.user.id),s.append("id","lpa"),n["a"].upload(s).then((function(a){t.files.push(a.data),e.val(""),t.name="",t.data.value=JSON.stringify(t.files)}))}},removeFile:function(a){this.$delete(this.files,a),this.data.value=JSON.stringify(this.files)}}}),m=f,v=e("2877"),p=Object(v["a"])(m,c,u,!1,null,"3d7b04fa",null),h=p.exports,g={name:"Field",data:function(){return{}},props:["data"],created:function(){},mounted:function(){},methods:{changeSelection:function(a,t){this.$emit("change",t)}},components:{File:h}},b=g,w=Object(v["a"])(b,o,d,!1,null,"1815b5ce",null),y=w.exports,x={data:function(){return r["a"].createModel({moment:l["a"],task:{},formData:[]})},created:function(){var a=this;this.user.id;n["a"].requestBpmn("runtime/tasks/"+this.$route.query.id).then((function(t){return a.task=t.data,a.task.formKey?n["a"].getItem("form",a.task.formKey):Promise.reject()})).then((function(t){t.data.formData.forEach((function(a){a.complete=!1,a.components.forEach((function(a,t){a.hidden=t>0,a.invalid=!1}))})),a.formData=t.data.formData,"desktop"===myapp_config.thisDevice&&$(".custom-scroll:not(.disable-slimscroll) >:first-child").slimscroll({height:$(a).data("scrollHeight")||"100%",size:$(a).data("scrollSize")||"4px",position:$(a).data("scrollPosition")||"right",color:$(a).data("scrollColor")||"rgba(0,0,0,0.6)",alwaysVisible:$(a).data("scrollAlwaysVisible")||!1,distance:$(a).data("scrollDistance")||"4px",railVisible:$(a).data("scrollRailVisible")||!1,railColor:$(a).data("scrollRailColor")||"#fafafa",allowPageScroll:!1,disableFadeOut:!1})}),(function(a){})),this.$on("submit",(function(){var t=a.validate(a.formData);if(t){var e=[].concat.apply([],a.formData.map((function(a){return a.components}))),i=e.map((function(a){return{name:a.key,value:a.value}})),s={};e.forEach((function(a){s[a.key]=a.value}));var r={data:s,fields:JSON.parse(JSON.stringify(a.formData))};i.push({name:a.task.formKey,value:JSON.stringify(r)}),n["a"].requestBpmn("runtime/tasks/"+a.task.id,"POST",{action:"complete",variables:i}).then((function(t){a.$parent.$emit("message",{type:"success",title:"提交成功",message:"任务提交成功。"}),a.$router.push({name:"tasks"})}),(function(t){a.$parent.$emit("message",{type:"error",title:"提交失败",message:"任务提交失败。"})}))}}))},mounted:function(){},methods:{validate:function(a){var t=!0;return a.forEach((function(a){var e,i=!0,s=a.components;s.forEach((function(a){e="file"===a.type?"string"===typeof a.value&&a.value&&JSON.parse(a.value).length>0:!!a.value,a.invalid=!a.hidden&&a.validate.required&&!e,a.invalid&&(t=!1,i=!1)})),a.complete=i})),t||this.$parent.$emit("message",{type:"error",title:"填写表单",message:"表单信息填写不完整。"}),t},updateVisibility:function(a){var t=this.formData.find((function(t){return t.components.indexOf(a)>=0})).components;if(a===t[0]){var e="存在问题"!==a.value;t.slice(1).forEach((function(a){return a.hidden=e}))}},goStep:function(a,t){if(!(t<0||t>this.formData.length-1)){this.formData[a].components;var e=this.validate([this.formData[a]]);if(e){var i=$(".position-absolute .js-collapse");i.eq(a).collapse().hide(),i.eq(t).collapse().show()}}}},components:{Field:y}},C=x,_=Object(v["a"])(C,i,s,!1,null,"530d2476",null);t["default"]=_.exports},"3ca3":function(a,t,e){"use strict";var i=e("6547").charAt,s=e("69f3"),r=e("7dd0"),n="String Iterator",l=s.set,o=s.getterFor(n);r(String,"String",(function(a){l(this,{type:n,string:String(a),index:0})}),(function(){var a,t=o(this),e=t.string,s=t.index;return s>=e.length?{value:void 0,done:!0}:(a=i(e,s),t.index+=a.length,{value:a,done:!1})}))},"99af":function(a,t,e){"use strict";var i=e("23e7"),s=e("d039"),r=e("e8b5"),n=e("861d"),l=e("7b0b"),o=e("50c4"),d=e("8418"),c=e("65f0"),u=e("1dde"),f=e("b622"),m=e("2d00"),v=f("isConcatSpreadable"),p=9007199254740991,h="Maximum allowed index exceeded",g=m>=51||!s((function(){var a=[];return a[v]=!1,a.concat()[0]!==a})),b=u("concat"),w=function(a){if(!n(a))return!1;var t=a[v];return void 0!==t?!!t:r(a)},y=!g||!b;i({target:"Array",proto:!0,forced:y},{concat:function(a){var t,e,i,s,r,n=l(this),u=c(n,0),f=0;for(t=-1,i=arguments.length;t<i;t++)if(r=-1===t?n:arguments[t],w(r)){if(s=o(r.length),f+s>p)throw TypeError(h);for(e=0;e<s;e++,f++)e in r&&d(u,f,r[e])}else{if(f>=p)throw TypeError(h);d(u,f++,r)}return u.length=f,u}})},f523:function(a,t,e){"use strict";e("4de4"),e("7db0"),e("4160"),e("c975"),e("d81d"),e("b0c0"),e("d3b7"),e("3ca3"),e("498a"),e("159b"),e("ddb0");var i=e("a49b"),s=e("bc3a"),r=e.n(s),n=e("323e"),l=e.n(n);r.a.interceptors.request.use((function(a){return l.a.start(),a})),r.a.interceptors.response.use((function(a){return l.a.done(),a}),(function(a){return l.a.done(),Promise.reject(a.response)})),t["a"]={getUsers:function(a){var t=this,e=a.map((function(a){return t.requestBpmn("identity/users/"+a)}));return Promise.all(e)},getItem:function(a,t){var e,s=this,n=i["a"][a+"Url"];return r.a.get(n+t).then((function(a){e=a;var t=e.data,i=[];return t.createdBy&&i.indexOf(t.createdBy)<0&&i.push(t.createdBy),t.updatedBy&&i.indexOf(t.updatedBy)<0&&i.push(t.updatedBy),s.getUsers(i)})).then((function(a){var t=e.data,i=a.map((function(a){return a.data}));if(t.createdBy){var s=i.find((function(a){return a.id.toLowerCase()===t.createdBy.toLowerCase()}));t.createdName=(s.firstName+" "+s.lastName).trim()}return t.updatedBy&&(s=i.find((function(a){return a.id.toLowerCase()===t.updatedBy.toLowerCase()})),t.updatedName=(s.firstName+" "+s.lastName).trim()),Promise.resolve(e)}))},getItems:function(a,t){var e=this,s=i["a"][a+"Url"];return new Promise((function(i,n){t=t||{},t.filter=t.filter||{},t.filter.type=a,t.filter=JSON.stringify(t.filter),t.sort&&(t.sort=JSON.stringify(t.sort));var l={dataType:"json",url:s,method:"get",params:t},o=[];return r()(l).then((function(a){o=a.data._embedded;var t=[];return o.forEach((function(a){a.createdBy&&t.indexOf(a.createdBy)<0&&t.push(a.createdBy),a.updatedBy&&t.indexOf(a.updatedBy)<0&&t.push(a.updatedBy)})),e.getUsers(t)})).then((function(a){o.forEach((function(t){var e=a.map((function(a){return a.data}));if(t.createdBy){var i=e.find((function(a){return a.id.toLowerCase()===t.createdBy.toLowerCase()}));t.createdName=(i.firstName+" "+i.lastName).trim()}t.updatedBy&&(i=e.find((function(a){return a.id.toLowerCase()===t.updatedBy.toLowerCase()})),t.updatedName=(i.firstName+" "+i.lastName).trim())})),i(o)}))}))},saveItem:function(a,t){return this.getItems(a,{filter:{name:t.name,_id:{$ne:t._id}}}).then((function(e){return e&&e.length?Promise.reject({message:'名称"'+t.name+'"已存在。'}):r()({dataType:"json",url:i["a"][a+"Url"],headers:{"Content-Type":"application/json"},method:"post",data:t})}))},deleteItem:function(a,t){var e=i["a"][a+"Url"];e+=t;var s={dataType:"text",url:e,method:"delete",data:{}};return r()(s)},requestBpmn:function(a,t,e){t=t||"GET";var s=i["a"].bpmnUrl+(a||""),n={dataType:"json",url:s,headers:{Authorization:sessionStorage.getItem("token"),"Content-Type":"application/json"},method:t};return"GET"===t?n.params=e:n.data=e,r()(n)},upload:function(a){return r()({method:"post",url:i["a"].uploadUrl+"upload",data:a,headers:{"Content-Type":"multipart/form-data"}})},getProcessTemplate:function(a){return r()({method:"get",url:"template/"+a+".bpmn",headers:{"Content-Type":"text"}})}}}}]);
//# sourceMappingURL=chunk-780cbbec.a35a30c2.js.map