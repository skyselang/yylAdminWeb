(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ec5cc6f0"],{4381:function(t,e,i){"use strict";i("a095"),i("6fc0");var a=i("4360");function n(t,e){var i=e.value,n=a["a"].getters&&a["a"].getters.roles;if(!(i&&i instanceof Array))throw new Error("need roles! Like v-permission=\"['admin','editor']\"");if(i.length>0){var l=i,o=n.some((function(t){return l.includes(t)}));o||t.parentNode&&t.parentNode.removeChild(t)}}var l={inserted:function(t,e){n(t,e)},update:function(t,e){n(t,e)}},o=function(t){t.directive("permission",l)};window.Vue&&(window["permission"]=l,Vue.use(o)),l.install=o;e["a"]=l},"98b1":function(t,e,i){"use strict";function a(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:230,e=880,i=document.documentElement.clientHeight||document.body.clientHeight;return i?i-t:e-t}i.d(e,"a",(function(){return a}))},f0a3:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-container"},[i("div",{staticClass:"filter-container"},[i("el-row",{attrs:{gutter:0}},[i("el-col",{staticStyle:{"text-align":"right"},attrs:{xs:24,sm:24}},[i("el-checkbox",{staticClass:"filter-item",attrs:{border:""},on:{change:t.expandAll},model:{value:t.isExpandAll,callback:function(e){t.isExpandAll=e},expression:"isExpandAll"}},[t._v("收起")]),i("el-button",{staticClass:"filter-item",on:{click:function(e){return t.refresh()}}},[t._v("刷新")]),i("el-button",{staticClass:"filter-item",attrs:{type:"primary"},on:{click:function(e){return t.add()}}},[t._v("添加")])],1)],1)],1),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{data:t.data,height:t.height+50,"row-key":"api_id"}},[i("el-table-column",{attrs:{prop:"api_name",label:"接口名称","min-width":"210"}}),i("el-table-column",{attrs:{prop:"api_url",label:"接口链接","min-width":"300"}}),i("el-table-column",{attrs:{prop:"is_disable",label:"是否禁用","min-width":"95",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.api_url?i("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(i){return t.disable(e.row)}},model:{value:e.row.is_disable,callback:function(i){t.$set(e.row,"is_disable",i)},expression:"scope.row.is_disable"}}):t._e()]}}])},[i("template",{slot:"header"},[i("span",[t._v("是否禁用 ")]),i("el-tooltip",{attrs:{placement:"top"}},[i("div",{attrs:{slot:"content"},slot:"content"},[t._v("开启后无法访问")]),i("i",{staticClass:"el-icon-info",attrs:{title:""}})])],1)],2),i("el-table-column",{attrs:{prop:"is_unlogin",label:"无需登录","min-width":"95",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.api_url?i("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(i){return t.unlogin(e.row)}},model:{value:e.row.is_unlogin,callback:function(i){t.$set(e.row,"is_unlogin",i)},expression:"scope.row.is_unlogin"}}):t._e()]}}])},[i("template",{slot:"header"},[i("span",[t._v("无需登录 ")]),i("el-tooltip",{attrs:{placement:"top"}},[i("div",{attrs:{slot:"content"},slot:"content"},[t._v("开启后不用登录也可以访问，如登录注册等")]),i("i",{staticClass:"el-icon-info",attrs:{title:""}})])],1)],2),i("el-table-column",{attrs:{prop:"api_id",label:"接口ID","min-width":"80"}}),i("el-table-column",{attrs:{prop:"api_sort",label:"排序","min-width":"80"}}),i("el-table-column",{attrs:{label:"操作","min-width":"130",align:"right",fixed:"right"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[i("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(e){return t.add(a)}}},[t._v("添加")]),i("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(e){return t.edit(a)}}},[t._v("修改")]),i("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(e){return t.dele(a)}}},[t._v("删除")])]}}])})],1),i("el-dialog",{attrs:{title:t.dialogTitle,visible:t.dialog,width:"50%",top:"1vh","before-close":t.cancel},on:{"update:visible":function(e){t.dialog=e}}},[i("el-form",{ref:"ref",staticClass:"dialog-body",style:{height:t.height+"px"},attrs:{rules:t.rules,model:t.model,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"接口父级",prop:"api_pid"}},[i("el-cascader",{staticStyle:{width:"100%"},attrs:{options:t.data,props:t.props,clearable:"",filterable:"",placeholder:"一级接口"},on:{change:t.pidChange},model:{value:t.model.api_pid,callback:function(e){t.$set(t.model,"api_pid",e)},expression:"model.api_pid"}})],1),i("el-form-item",{attrs:{label:"接口名称",prop:"api_name"}},[i("el-input",{attrs:{placeholder:"请输入接口名称",clearable:""},model:{value:t.model.api_name,callback:function(e){t.$set(t.model,"api_name",e)},expression:"model.api_name"}})],1),i("el-form-item",{attrs:{label:"接口链接",prop:"api_url"}},[i("el-input",{attrs:{placeholder:"应用/控制器/操作，区分大小写"},model:{value:t.model.api_url,callback:function(e){t.$set(t.model,"api_url",e)},expression:"model.api_url"}})],1),i("el-form-item",{attrs:{label:"接口排序",prop:"api_sort"}},[i("el-input",{attrs:{type:"number",placeholder:"200"},model:{value:t.model.api_sort,callback:function(e){t.$set(t.model,"api_sort",e)},expression:"model.api_sort"}})],1),t.model.api_id?i("el-form-item",{attrs:{label:"添加时间",prop:"create_time"}},[i("el-input",{attrs:{disabled:""},model:{value:t.model.create_time,callback:function(e){t.$set(t.model,"create_time",e)},expression:"model.create_time"}})],1):t._e(),t.model.api_id?i("el-form-item",{attrs:{label:"修改时间",prop:"update_time"}},[i("el-input",{attrs:{disabled:""},model:{value:t.model.update_time,callback:function(e){t.$set(t.model,"update_time",e)},expression:"model.update_time"}})],1):t._e()],1),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:t.cancel}},[t._v("取消")]),i("el-button",{attrs:{type:"primary"},on:{click:t.submit}},[t._v("提交")])],1)],1)],1)},n=[],l=(i("36db"),i("98b1")),o=i("4381"),s=i("b775"),r="/admin/Api/";function c(){return Object(s["a"])({url:r+"list",method:"get"})}function d(t){return Object(s["a"])({url:r+"info",method:"get",params:t})}function u(t){return Object(s["a"])({url:r+"add",method:"post",data:t})}function p(t){return Object(s["a"])({url:r+"edit",method:"post",data:t})}function m(t){return Object(s["a"])({url:r+"dele",method:"post",data:t})}function f(t){return Object(s["a"])({url:r+"disable",method:"post",data:t})}function h(t){return Object(s["a"])({url:r+"unlogin",method:"post",data:t})}var g={name:"SettingApi",components:{},directives:{permission:o["a"]},data:function(){return{height:680,loading:!1,data:[],dialog:!1,dialogTitle:"",props:{checkStrictly:!0,value:"api_id",label:"api_name"},model:{api_id:"",api_pid:0,api_name:"",api_method:"GET",api_url:"",api_sort:200},isExpandAll:!0,rules:{api_name:[{required:!0,message:"请输入接口名称",trigger:"blur"}]}}},created:function(){this.height=Object(l["a"])(),this.list()},methods:{list:function(){var t=this;this.loading=!0,c().then((function(e){t.data=e.data.list,t.isExpandAll=!0,t.loading=!1})).catch((function(){t.loading=!1}))},expandAll:function(t){this.expandFor(this.data,!t)},expandFor:function(t,e){var i=this;t.forEach((function(t){i.$refs.table.toggleRowExpansion(t,e),t.children&&i.expandFor(t.children,e)}))},add:function(t){this.dialog=!0,this.dialogTitle="接口添加",this.model=this.$options.data().model,t&&(this.model.api_pid=t.api_id)},edit:function(t){var e=this;this.dialog=!0,this.loading=!0,this.dialogTitle="接口修改："+t.api_id,d({api_id:t.api_id}).then((function(t){e.reset(t.data),e.loading=!1})).catch((function(){e.loading=!1}))},dele:function(t){var e=this;this.$confirm('确定要删除接口 <span style="color:red">'+t.api_name+" </span>吗？","删除接口："+t.api_id,{type:"warning",dangerouslyUseHTMLString:!0}).then((function(){e.loading=!0,m({api_id:t.api_id}).then((function(t){e.reset(),e.list(),e.$message.success(t.msg)})).catch((function(){e.loading=!1}))})).catch((function(){}))},refresh:function(){this.list()},cancel:function(){this.dialog=!1,this.reset()},submit:function(){var t=this;this.$refs["ref"].validate((function(e){e&&(t.loading=!0,t.model.api_id?p(t.model,"post").then((function(e){t.list(),t.reset(),t.dialog=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1})):u(t.model).then((function(e){t.list(),t.reset(),t.dialog=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1})))}))},reset:function(t){this.model=t||this.$options.data().model,void 0!==this.$refs["ref"]&&this.$refs["ref"].resetFields()},disable:function(t){var e=this;this.loading=!0,f({api_id:t.api_id,is_disable:t.is_disable}).then((function(t){e.list(),e.$message.success(t.msg)})).catch((function(){e.list(),e.loading=!1}))},unlogin:function(t){var e=this;this.loading=!0,h({api_id:t.api_id,is_unlogin:t.is_unlogin}).then((function(t){e.list(),e.$message.success(t.msg)})).catch((function(){e.list(),e.loading=!1}))},pidChange:function(t){t&&(this.model.api_pid=t[t.length-1])}}},_=g,b=i("cba8"),v=Object(b["a"])(_,a,n,!1,null,null,null);e["default"]=v.exports}}]);