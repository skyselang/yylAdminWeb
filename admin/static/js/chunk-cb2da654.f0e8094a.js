(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cb2da654"],{"333d":function(e,t,a){"use strict";var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"pagination-container",class:{hidden:e.hidden}},[a("el-pagination",e._b({attrs:{background:e.background,"current-page":e.currentPage,"page-size":e.pageSize,layout:e.layout,"page-sizes":e.pageSizes,total:e.total},on:{"update:currentPage":function(t){e.currentPage=t},"update:current-page":function(t){e.currentPage=t},"update:pageSize":function(t){e.pageSize=t},"update:page-size":function(t){e.pageSize=t},"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},"el-pagination",e.$attrs,!1))],1)},i=[];a("65ba");Math.easeInOutQuad=function(e,t,a,l){return e/=l/2,e<1?a/2*e*e+t:(e--,-a/2*(e*(e-2)-1)+t)};var n=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();function r(e){document.documentElement.scrollTop=e,document.body.parentNode.scrollTop=e,document.body.scrollTop=e}function o(){return document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop}function s(e,t,a){var l=o(),i=e-l,s=20,u=0;t="undefined"===typeof t?500:t;var c=function e(){u+=s;var o=Math.easeInOutQuad(u,l,i,t);r(o),u<t?n(e):a&&"function"===typeof a&&a()};c()}var u={name:"Pagination",props:{total:{required:!0,type:Number},page:{type:Number,default:1},limit:{type:Number,default:20},pageSizes:{type:Array,default:function(){return[10,12,20,30,50,80,100,150,200,300,500,800,1e3]}},layout:{type:String,default:"total, sizes, prev, pager, next, jumper"},background:{type:Boolean,default:!0},autoScroll:{type:Boolean,default:!0},hidden:{type:Boolean,default:!1}},computed:{currentPage:{get:function(){return this.page},set:function(e){this.$emit("update:page",e)}},pageSize:{get:function(){return this.limit},set:function(e){this.$emit("update:limit",e)}}},methods:{handleSizeChange:function(e){this.$emit("pagination",{page:this.currentPage,limit:e}),this.autoScroll&&s(0,800)},handleCurrentChange:function(e){this.$emit("pagination",{page:e,limit:this.pageSize}),this.autoScroll&&s(0,800)}}},c=u,d=(a("e154"),a("4ac2")),m=Object(d["a"])(c,l,i,!1,null,"3f5d1c05",null);t["a"]=m.exports},4381:function(e,t,a){"use strict";a("4318"),a("2e4f");var l=a("4360");function i(e,t){var a=t.value,i=l["a"].getters&&l["a"].getters.roles;if(!(a&&a instanceof Array))throw new Error("need roles! Like v-permission=\"['admin','editor']\"");if(a.length>0){var n=a,r=i.some((function(e){return n.includes(e)}));r||e.parentNode&&e.parentNode.removeChild(e)}}var n={inserted:function(e,t){i(e,t)},update:function(e,t){i(e,t)}},r=function(e){e.directive("permission",n)};window.Vue&&(window["permission"]=n,Vue.use(r)),n.install=r;t["a"]=n},"98b1":function(e,t,a){"use strict";function l(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:230,t=880,a=document.documentElement.clientHeight||document.body.clientHeight;return a?a-e:t-e}a.d(t,"a",(function(){return l}))},d803:function(e,t,a){},e154:function(e,t,a){"use strict";a("d803")},f1da:function(e,t,a){"use strict";a.d(t,"d",(function(){return i})),a.d(t,"c",(function(){return n})),a.d(t,"b",(function(){return r})),a.d(t,"a",(function(){return o})),a.d(t,"e",(function(){return s}));var l=a("b775");function i(e){return Object(l["a"])({url:"/admin/AdminUserLog/list",method:"get",params:e})}function n(e){return Object(l["a"])({url:"/admin/AdminUserLog/info",method:"get",params:e})}function r(e){return Object(l["a"])({url:"/admin/AdminUserLog/dele",method:"post",data:e})}function o(e){return Object(l["a"])({url:"/admin/AdminUserLog/clear",method:"post",data:e})}function s(e){return Object(l["a"])({url:"/admin/AdminUserLog/stat",method:"post",data:e})}},f336:function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"filter-container"},[a("el-row",{attrs:{gutter:0}},[a("el-col",{attrs:{xs:24,sm:21}},[a("el-select",{staticClass:"filter-item",staticStyle:{width:"110px"},attrs:{placeholder:"日志类型",clearable:""},model:{value:e.query.log_type,callback:function(t){e.$set(e.query,"log_type",t)},expression:"query.log_type"}},[a("el-option",{attrs:{value:1,label:"登录日志"}}),a("el-option",{attrs:{value:2,label:"操作日志"}})],1),a("el-input",{staticClass:"filter-item",staticStyle:{width:"150px"},attrs:{placeholder:"用户账号/昵称",clearable:""},model:{value:e.query.user_keyword,callback:function(t){e.$set(e.query,"user_keyword",t)},expression:"query.user_keyword"}}),a("el-input",{staticClass:"filter-item",staticStyle:{width:"155px"},attrs:{placeholder:"请求IP/地区/ISP",clearable:""},model:{value:e.query.request_keyword,callback:function(t){e.$set(e.query,"request_keyword",t)},expression:"query.request_keyword"}}),a("el-input",{staticClass:"filter-item",staticStyle:{width:"250px"},attrs:{placeholder:"菜单链接/名称",clearable:""},model:{value:e.query.menu_keyword,callback:function(t){e.$set(e.query,"menu_keyword",t)},expression:"query.menu_keyword"}}),a("el-date-picker",{staticClass:"filter-item",staticStyle:{width:"240px"},attrs:{type:"daterange","range-separator":"-","value-format":"yyyy-MM-dd","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.query.create_time,callback:function(t){e.$set(e.query,"create_time",t)},expression:"query.create_time"}}),a("el-input",{staticClass:"filter-item",staticStyle:{width:"100px"},attrs:{placeholder:"返回码",clearable:""},model:{value:e.query.response_code,callback:function(t){e.$set(e.query,"response_code",t)},expression:"query.response_code"}}),a("el-button",{staticClass:"filter-item",attrs:{type:"primary"},on:{click:function(t){return e.search()}}},[e._v("查询")]),a("el-button",{staticClass:"filter-item",on:{click:function(t){return e.refresh()}}},[e._v("刷新")])],1),a("el-col",{staticStyle:{"text-align":"right"},attrs:{xs:24,sm:3}},[a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["admin/AdminUserLog/clear"],expression:"['admin/AdminUserLog/clear']"}],staticClass:"filter-item",attrs:{title:"日志清除"},on:{click:function(t){return e.clear()}}},[e._v("清除")]),a("el-button",{directives:[{name:"permission",rawName:"v-permission",value:["admin/AdminUserLog/stat"],expression:"['admin/AdminUserLog/stat']"}],staticClass:"filter-item",attrs:{type:"primary",title:"日志管理统计"},on:{click:e.stat}},[e._v("统计")])],1)],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.data,height:e.height,border:""},on:{"sort-change":e.sort}},[a("el-table-column",{attrs:{prop:"admin_user_log_id",label:"日志ID","min-width":"100",sortable:"custom",fixed:"left"}}),a("el-table-column",{attrs:{prop:"username",label:"用户账号","min-width":"110","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"menu_url",label:"菜单链接","min-width":"240","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"menu_name",label:"菜单名称","min-width":"140","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"request_method",label:"请求方式","min-width":"90"}}),a("el-table-column",{attrs:{prop:"request_ip",label:"请求IP","min-width":"130"}}),a("el-table-column",{attrs:{prop:"request_region",label:"请求地区","min-width":"150","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"request_isp",label:"请求ISP","min-width":"110","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{prop:"create_time",label:"请求时间","min-width":"160",sortable:"custom"}}),a("el-table-column",{attrs:{prop:"response_code",label:"返回码","min-width":"80"}}),a("el-table-column",{attrs:{prop:"response_msg",label:"返回描述","min-width":"130","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{label:"操作","min-width":"145",align:"right",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){var l=t.row;return[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(t){return e.info(l)}}},[e._v("详情")]),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(t){return e.dele(l)}}},[e._v("删除")])]}}])})],1),a("pagination",{directives:[{name:"show",rawName:"v-show",value:e.count>0,expression:"count > 0"}],attrs:{total:e.count,page:e.query.page,limit:e.query.limit},on:{"update:page":function(t){return e.$set(e.query,"page",t)},"update:limit":function(t){return e.$set(e.query,"limit",t)},pagination:e.list}}),a("el-dialog",{attrs:{title:e.dialogTitle,visible:e.dialog,top:"1vh",width:"50%","before-close":e.cancel},on:{"update:visible":function(t){e.dialog=t}}},[a("el-form",{ref:"ref",staticClass:"dialog-body",style:{height:e.height+"px"},attrs:{rules:e.rules,model:e.model,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"用户ID",prop:"admin_user_id"}},[a("el-col",{attrs:{span:10}},[a("el-input",{model:{value:e.model.admin_user_id,callback:function(t){e.$set(e.model,"admin_user_id",t)},expression:"model.admin_user_id"}})],1),a("el-col",{staticClass:"line",staticStyle:{"text-align":"center"},attrs:{span:4}},[e._v("用户昵称")]),a("el-col",{attrs:{span:10}},[a("el-input",{model:{value:e.model.nickname,callback:function(t){e.$set(e.model,"nickname",t)},expression:"model.nickname"}})],1)],1),a("el-form-item",{attrs:{label:"用户账号",prop:"username"}},[a("el-input",{model:{value:e.model.username,callback:function(t){e.$set(e.model,"username",t)},expression:"model.username"}})],1),a("el-form-item",{attrs:{label:"菜单ID",prop:"admin_menu_id"}},[a("el-col",{attrs:{span:10}},[a("el-input",{model:{value:e.model.admin_menu_id,callback:function(t){e.$set(e.model,"admin_menu_id",t)},expression:"model.admin_menu_id"}})],1),a("el-col",{staticClass:"line",staticStyle:{"text-align":"center"},attrs:{span:4}},[e._v("菜单名称")]),a("el-col",{attrs:{span:10}},[a("el-input",{model:{value:e.model.menu_name,callback:function(t){e.$set(e.model,"menu_name",t)},expression:"model.menu_name"}})],1)],1),a("el-form-item",{attrs:{label:"菜单链接",prop:"menu_url"}},[a("el-input",{model:{value:e.model.menu_url,callback:function(t){e.$set(e.model,"menu_url",t)},expression:"model.menu_url"}})],1),a("el-form-item",{attrs:{label:"请求方式",prop:"request_method"}},[a("el-col",{attrs:{span:10}},[a("el-input",{model:{value:e.model.request_method,callback:function(t){e.$set(e.model,"request_method",t)},expression:"model.request_method"}})],1),a("el-col",{staticClass:"line",staticStyle:{"text-align":"center"},attrs:{span:4}},[e._v("请求IP")]),a("el-col",{attrs:{span:10}},[a("el-input",{model:{value:e.model.request_ip,callback:function(t){e.$set(e.model,"request_ip",t)},expression:"model.request_ip"}})],1)],1),a("el-form-item",{attrs:{label:"请求地区",prop:"request_region"}},[a("el-col",{attrs:{span:10}},[a("el-input",{model:{value:e.model.request_region,callback:function(t){e.$set(e.model,"request_region",t)},expression:"model.request_region"}})],1),a("el-col",{staticClass:"line",staticStyle:{"text-align":"center"},attrs:{span:4}},[e._v("请求ISP")]),a("el-col",{attrs:{span:10}},[a("el-input",{model:{value:e.model.request_isp,callback:function(t){e.$set(e.model,"request_isp",t)},expression:"model.request_isp"}})],1)],1),a("el-form-item",{attrs:{label:"请求时间",prop:"create_time"}},[a("el-input",{model:{value:e.model.create_time,callback:function(t){e.$set(e.model,"create_time",t)},expression:"model.create_time"}})],1),a("el-form-item",{attrs:{label:"请求参数",prop:"request_param"}},[a("pre",[e._v(e._s(e.model.request_param))])]),a("el-form-item",{attrs:{label:"返回码",prop:"response_code"}},[a("el-input",{model:{value:e.model.response_code,callback:function(t){e.$set(e.model,"response_code",t)},expression:"model.response_code"}})],1),a("el-form-item",{attrs:{label:"返回描述",prop:"response_msg"}},[a("el-input",{attrs:{type:"textarea"},model:{value:e.model.response_msg,callback:function(t){e.$set(e.model,"response_msg",t)},expression:"model.response_msg"}})],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.cancel}},[e._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("确定")])],1)],1),a("el-dialog",{attrs:{title:e.clearDialogTitle,visible:e.clearDialog,"before-close":e.clearCancel},on:{"update:visible":function(t){e.clearDialog=t}}},[a("el-form",{ref:"clearRef",staticClass:"dialog-body",attrs:{rules:e.clearRules,model:e.clearModel,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"用户ID",prop:"admin_user_id"}},[a("el-input",{attrs:{type:"number",clearable:""},model:{value:e.clearModel.admin_user_id,callback:function(t){e.$set(e.clearModel,"admin_user_id",t)},expression:"clearModel.admin_user_id"}})],1),a("el-form-item",{attrs:{label:"用户账号",prop:"username"}},[a("el-input",{attrs:{type:"text",clearable:""},model:{value:e.clearModel.username,callback:function(t){e.$set(e.clearModel,"username",t)},expression:"clearModel.username"}})],1),a("el-form-item",{attrs:{label:"菜单ID",prop:"admin_menu_id"}},[a("el-input",{attrs:{type:"number",clearable:""},model:{value:e.clearModel.admin_menu_id,callback:function(t){e.$set(e.clearModel,"admin_menu_id",t)},expression:"clearModel.admin_menu_id"}})],1),a("el-form-item",{attrs:{label:"菜单链接",prop:"menu_url"}},[a("el-input",{attrs:{type:"text",clearable:""},model:{value:e.clearModel.menu_url,callback:function(t){e.$set(e.clearModel,"menu_url",t)},expression:"clearModel.menu_url"}})],1),a("el-form-item",{attrs:{label:"日期范围",prop:"date_range"}},[a("el-date-picker",{staticClass:"filter-item",attrs:{type:"daterange","range-separator":"-","value-format":"yyyy-MM-dd","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.clearModel.date_range,callback:function(t){e.$set(e.clearModel,"date_range",t)},expression:"clearModel.date_range"}})],1),a("el-form-item",{attrs:{label:""}},[a("p",[e._v("*清除后不可恢复")]),a("p",[e._v("*根据填写的条件清除")]),a("p",[e._v("*不填写清除条件将清空所有")])])],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){return e.clearCancel()}}},[e._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.clearSubmit()}}},[e._v("确定")])],1)],1)],1)},i=[],n=a("98b1"),r=a("333d"),o=a("4381"),s=a("f1da"),u={name:"UserLog",components:{Pagination:r["a"]},directives:{permission:o["a"]},data:function(){return{height:680,loading:!1,data:[],count:0,query:{page:1,limit:12},dialog:!1,dialogTitle:"",model:{},rules:{},clearDialog:!1,clearDialogTitle:"",clearModel:{admin_user_id:"",username:"",admin_menu_id:"",menu_url:"",date_range:[]},clearRules:{}}},created:function(){this.height=Object(n["a"])(),this.list()},methods:{list:function(){var e=this;this.loading=!0,Object(s["d"])(this.query).then((function(t){e.data=t.data.list,e.count=t.data.count,e.loading=!1})).catch((function(){e.loading=!1}))},info:function(e){var t=this;this.loading=!0,this.dialog=!0,this.dialogTitle="日志管理详情："+e.admin_user_log_id,Object(s["c"])({admin_user_log_id:e.admin_user_log_id}).then((function(e){t.reset(e.data),t.loading=!1})).catch((function(){t.loading=!1}))},dele:function(e){var t=this;this.$confirm('确定要删除日志ID：<span style="color:red">'+e.admin_user_log_id+" </span>吗？","删除日志："+e.admin_user_log_id,{type:"warning",dangerouslyUseHTMLString:!0}).then((function(){t.loading=!0,Object(s["b"])({admin_user_log_id:e.admin_user_log_id}).then((function(e){t.list(),t.reset(),t.$message.success(e.msg)})).catch((function(){t.loading=!1}))}))},cancel:function(){this.reset(),this.dialog=!1},submit:function(){this.reset(),this.dialog=!1},reset:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.model=""===e?this.$options.data().model:e},search:function(){this.query.page=1,this.list()},refresh:function(){this.query=this.$options.data().query,this.list()},sort:function(e){this.query.sort_field=e.prop,this.query.sort_type="","ascending"===e.order&&(this.query.sort_type="asc",this.list()),"descending"===e.order&&(this.query.sort_type="desc",this.list())},clear:function(){this.clearDialog=!0,this.clearDialogTitle="日志管理清除"},clearCancel:function(){this.clearDialog=!1},clearSubmit:function(){var e=this;this.loading=!0,Object(s["a"])(this.clearModel).then((function(t){e.list(),e.clearDialog=!1,e.clearModel=e.$options.data().clearModel,e.$message.success("已清除日志记录 "+t.data.count+" 条")})).catch((function(){e.loading=!1}))},stat:function(){this.$router.push("/admin/rule/user-log-stat")}}},c=u,d=a("4ac2"),m=Object(d["a"])(c,l,i,!1,null,null,null);t["default"]=m.exports}}]);