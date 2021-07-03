(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4a5bdf4c"],{"98b1":function(e,t,a){"use strict";function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:230,t=880,a=document.documentElement.clientHeight||document.body.clientHeight;return a?a-e:t-e}a.d(t,"a",(function(){return o}))},f97a:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"filter-container"},[a("el-row",{attrs:{gutter:0}},[a("el-col",{staticStyle:{"text-align":"right"},attrs:{xs:24,sm:24}},[a("el-checkbox",{staticClass:"filter-item",attrs:{border:""},on:{change:e.expandAll}},[e._v("收起")]),a("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px"},on:{click:function(t){return e.refresh()}}},[e._v("刷新")]),a("el-button",{staticClass:"filter-item",attrs:{type:"primary"},on:{click:function(t){return e.add()}}},[e._v("添加")])],1)],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{data:e.data,height:e.height,"row-key":"download_category_id","default-expand-all":"",border:""},on:{"selection-change":e.select}},[a("el-table-column",{attrs:{type:"selection",width:"40"}}),a("el-table-column",{attrs:{prop:"category_name",label:"分类名称","min-width":"250","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"download_category_id",label:"分类ID","min-width":"80"}}),a("el-table-column",{attrs:{prop:"download_category_pid",label:"PID","min-width":"80"}}),a("el-table-column",{attrs:{prop:"sort",label:"排序","min-width":"80"}}),a("el-table-column",{attrs:{prop:"is_hide",label:"是否隐藏","min-width":"80",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(a){return e.ishide([t.row])}},model:{value:t.row.is_hide,callback:function(a){e.$set(t.row,"is_hide",a)},expression:"scope.row.is_hide"}})]}}])}),a("el-table-column",{attrs:{prop:"create_time",label:"添加时间","min-width":"160"}}),a("el-table-column",{attrs:{prop:"update_time",label:"修改时间","min-width":"160"}}),a("el-table-column",{attrs:{label:"操作","min-width":"210",align:"right",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){var o=t.row;return[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(t){return e.add(o)}}},[e._v("添加")]),a("el-button",{attrs:{size:"mini",type:"success"},on:{click:function(t){return e.edit(o)}}},[e._v("修改")]),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(t){return e.dele([o])}}},[e._v("删除")])]}}])})],1),a("div",{staticStyle:{"margin-top":"20px"}},[a("el-switch",{staticStyle:{"margin-left":"10px"},attrs:{"active-value":1,"inactive-value":0},model:{value:e.is_hide,callback:function(t){e.is_hide=t},expression:"is_hide"}}),a("el-button",{attrs:{size:"mini"},on:{click:function(t){return e.ishide(e.selection,!0)}}},[e._v("隐藏")]),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(t){return e.dele(e.selection)}}},[e._v("删除")])],1),a("el-dialog",{attrs:{title:e.dialogTitle,visible:e.dialog,top:"1vh",width:"65%","before-close":e.cancel,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialog=t}}},[a("el-form",{ref:"ref",staticClass:"dialog-body",style:{height:e.height+"px"},attrs:{rules:e.rules,model:e.model,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"分类父级",prop:"download_category_pid"}},[a("el-cascader",{staticStyle:{width:"100%"},attrs:{options:e.data,props:{checkStrictly:!0,value:"download_category_id",label:"category_name"},clearable:"",filterable:"",placeholder:"一级分类"},on:{change:e.pidChange},model:{value:e.model.download_category_pid,callback:function(t){e.$set(e.model,"download_category_pid",t)},expression:"model.download_category_pid"}})],1),a("el-form-item",{attrs:{label:"分类名称",prop:"category_name"}},[a("el-input",{attrs:{clearable:"",placeholder:"请输入分类名称"},model:{value:e.model.category_name,callback:function(t){e.$set(e.model,"category_name",t)},expression:"model.category_name"}})],1),a("el-form-item",{attrs:{label:"标题",prop:"title"}},[a("el-input",{attrs:{clearable:"",placeholder:"title"},model:{value:e.model.title,callback:function(t){e.$set(e.model,"title",t)},expression:"model.title"}})],1),a("el-form-item",{attrs:{label:"关键词",prop:"keywords"}},[a("el-input",{attrs:{clearable:"",placeholder:"keywords"},model:{value:e.model.keywords,callback:function(t){e.$set(e.model,"keywords",t)},expression:"model.keywords"}})],1),a("el-form-item",{attrs:{label:"描述",prop:"description"}},[a("el-input",{attrs:{type:"textarea",clearable:"",placeholder:"description"},model:{value:e.model.description,callback:function(t){e.$set(e.model,"description",t)},expression:"model.description"}})],1),a("el-form-item",{attrs:{label:"图片",prop:"imgs"}},[a("el-row",{attrs:{gutter:0}},[a("el-col",{attrs:{span:8}},[a("el-upload",{attrs:{name:"file","file-list":e.model.imgs,"show-file-list":!1,action:e.uploadAction,headers:e.uploadHeaders,data:e.uploadData,"on-success":e.uploadSuccess,"on-error":e.uploadError}},[a("el-button",{attrs:{size:"mini"}},[e._v("上传图片")])],1)],1),a("el-col",{attrs:{span:16}},[a("div",[e._v("jpg、png格式，每张图片大小不超过 500 KB。")])])],1),a("el-row",{attrs:{gutter:0}},e._l(e.model.imgs,(function(t,o){return a("el-col",{key:o,staticStyle:{border:"1px solid #DCDFE6"},attrs:{span:6}},[a("el-image",{staticStyle:{width:"100%",height:"100px"},attrs:{src:t.url,"preview-src-list":[t.url],fit:"contain",title:"点击查看大图"}}),a("br",{staticStyle:{"line-height":"0"}}),a("el-link",{staticStyle:{margin:"0 1px"},attrs:{href:t.url,underline:!1,download:t.url,target:"_blank"}},[e._v(" 下载"),a("span",{staticStyle:{"font-size":"10px"}},[e._v("("+e._s(t.size)+")")])]),a("el-button",{attrs:{size:"mini"},on:{click:function(t){return e.uploadDele(o)}}},[e._v("删除")])],1)})),1)],1),a("el-form-item",{attrs:{label:"排序",prop:"sort"}},[a("el-input",{attrs:{clearable:"",placeholder:"200"},model:{value:e.model.sort,callback:function(t){e.$set(e.model,"sort",t)},expression:"model.sort"}})],1),e.model.download_category_id?a("el-form-item",{attrs:{label:"添加时间",prop:"create_time"}},[a("el-input",{attrs:{disabled:""},model:{value:e.model.create_time,callback:function(t){e.$set(e.model,"create_time",t)},expression:"model.create_time"}})],1):e._e(),e.model.download_category_id?a("el-form-item",{attrs:{label:"修改时间",prop:"update_time"}},[a("el-input",{attrs:{disabled:""},model:{value:e.model.update_time,callback:function(t){e.$set(e.model,"update_time",t)},expression:"model.update_time"}})],1):e._e()],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.cancel}},[e._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("提交")])],1)],1)],1)},i=[],l=(a("1e6a"),a("dcd4"),a("b4e6"),a("98b1")),n=a("5f87"),s=a("b775");function r(e){return Object(s["a"])({url:"/admin/DownloadCategory/list",method:"get",params:e})}function d(e){return Object(s["a"])({url:"/admin/DownloadCategory/info",method:"get",params:e})}function c(e){return Object(s["a"])({url:"/admin/DownloadCategory/add",method:"post",data:e})}function u(e){return Object(s["a"])({url:"/admin/DownloadCategory/edit",method:"post",data:e})}function m(e){return Object(s["a"])({url:"/admin/DownloadCategory/dele",method:"post",data:e})}function h(e){return Object(s["a"])({url:"/admin/DownloadCategory/ishide",method:"post",data:e})}var p={name:"DownloadCategory",components:{},directives:{},data:function(){return{name:"下载分类",height:680,loading:!1,data:[],dialog:!1,dialogTitle:"",model:{download_category_id:"",download_category_pid:0,category_name:"",title:"",keywords:"",description:"",imgs:[],sort:200},is_hide:0,selection:[],uploadAction:"/admin/DownloadCategory/upload",uploadHeaders:{AdminToken:Object(n["d"])()},uploadData:{type:"image"},rules:{category_name:[{required:!0,message:"请输入分类名称",trigger:"blur"}]}}},created:function(){this.height=Object(l["a"])(),this.list()},methods:{list:function(){var e=this;this.loading=!0,r(this.query).then((function(t){e.data=t.data.list,e.loading=!1})).catch((function(){e.loading=!1}))},select:function(e){this.selection=e},selectAlert:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.$alert(e||"请选择需要操作的"+this.name,"提示",{confirmButtonText:"确定",callback:function(e){}})},expandAll:function(e){this.expandFor(this.data,!e)},expandFor:function(e,t){var a=this;e.forEach((function(e){a.$refs.table.toggleRowExpansion(e,t),e.children&&a.expandFor(e.children,t)}))},add:function(e){this.dialog=!0,this.dialogTitle=this.name+"添加",this.model=this.$options.data().model,e&&(this.model.download_category_pid=e.download_category_id)},edit:function(e){var t=this;this.loading=!0,this.dialog=!0,this.dialogTitle=this.name+"修改："+e.download_category_id,d({download_category_id:e.download_category_id}).then((function(e){t.reset(e.data),t.loading=!1})).catch((function(){t.loading=!1}))},dele:function(e){var t=this;if(0===e.length)this.selectAlert();else{var a="删除"+this.name,o='确定要删除选中的 <span style="color:red">'+e.length+" </span> 条"+this.name+"吗？";1===e.length&&(a=a+"："+e[0].download_category_id,o="确定要删除"+this.name+' <span style="color:red">'+e[0].category_name+" </span>吗？"),this.$confirm(o,a,{type:"warning",dangerouslyUseHTMLString:!0}).then((function(){t.loading=!0,m({download_category:e}).then((function(e){t.list(),t.$message.success(e.msg)})).catch((function(){t.loading=!1}))})).catch((function(){}))}},cancel:function(){this.reset(),this.dialog=!1},submit:function(){var e=this;this.$refs["ref"].validate((function(t){t&&(e.loading=!0,e.model.download_category_id?u(e.model).then((function(t){e.dialog=!1,e.list(),e.reset(),e.$message.success(t.msg)})).catch((function(){e.loading=!1})):c(e.model).then((function(t){e.dialog=!1,e.list(),e.reset(),e.$message.success(t.msg)})).catch((function(){e.loading=!1})))}))},reset:function(e){this.model=e||this.$options.data().model,void 0!==this.$refs["ref"]&&(this.$refs["ref"].resetFields(),this.$refs["ref"].clearValidate())},search:function(){this.query.page=1,this.list()},refresh:function(){this.query=this.$options.data().query,this.list()},ishide:function(e){var t=this,a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(0===e.length)this.selectAlert();else{this.loading=!0;var o=e[0].is_hide;a&&(o=this.is_hide),h({download_category:e,is_hide:o}).then((function(e){t.list(),t.$message.success(e.msg)})).catch((function(){t.list(),t.loading=!1}))}},pidChange:function(e){e&&(this.model.download_category_pid=e[e.length-1])},uploadSuccess:function(e,t,a){console.log(e),200===e.code?(this.model.imgs.push(e.data),this.$message.success(e.msg)):this.$message.error(e.msg)},uploadError:function(e,t,a){this.$message.error(e.msg||"上传出错")},uploadDele:function(e){this.model.imgs.splice(e,1)}}},g=p,f=a("4ac2"),_=Object(f["a"])(g,o,i,!1,null,null,null);t["default"]=_.exports}}]);