(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1f21290b"],{"0532":function(e,t,n){"use strict";n.d(t,"f",(function(){return l})),n.d(t,"e",(function(){return r})),n.d(t,"a",(function(){return a})),n.d(t,"d",(function(){return s})),n.d(t,"b",(function(){return c})),n.d(t,"c",(function(){return u}));var i=n("b775"),o="/admin/file.Group/";function l(e){return Object(i["a"])({url:o+"list",method:"get",params:e})}function r(e){return Object(i["a"])({url:o+"info",method:"get",params:e})}function a(e){return Object(i["a"])({url:o+"add",method:"post",data:e})}function s(e){return Object(i["a"])({url:o+"edit",method:"post",data:e})}function c(e){return Object(i["a"])({url:o+"dele",method:"post",data:e})}function u(e){return Object(i["a"])({url:o+"disable",method:"post",data:e})}},"09f4":function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),Math.easeInOutQuad=function(e,t,n,i){return e/=i/2,e<1?n/2*e*e+t:(e--,-n/2*(e*(e-2)-1)+t)};var i=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();function o(e){document.documentElement.scrollTop=e,document.body.parentNode.scrollTop=e,document.body.scrollTop=e}function l(){return document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop}function r(e,t,n){var r=l(),a=e-r,s=20,c=0;t="undefined"===typeof t?500:t;var u=function e(){c+=s;var l=Math.easeInOutQuad(c,r,a,t);o(l),c<t?i(e):n&&"function"===typeof n&&n()};u()}},"2a4a":function(e,t,n){},4381:function(e,t,n){"use strict";n("caad"),n("2532");var i=n("4360");function o(e,t){var n=t.value,o=i["a"].getters&&i["a"].getters.roles;if(!(n&&n instanceof Array))throw new Error("need roles! Like v-permission=\"['admin','editor']\"");if(n.length>0){var l=n,r=o.some((function(e){return l.includes(e)}));r||e.parentNode&&e.parentNode.removeChild(e)}}var l={inserted:function(e,t){o(e,t)},update:function(e,t){o(e,t)}},r=function(e){e.directive("permission",l)};window.Vue&&(window["permission"]=l,Vue.use(r)),l.install=r;t["a"]=l},8783:function(e,t,n){"use strict";n("2a4a")},"98b1":function(e,t,n){"use strict";function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:260,t=880,n=document.documentElement.clientHeight||document.body.clientHeight;return n?n-e:t-e}n.d(t,"a",(function(){return i}))},"9e90":function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("div",{staticClass:"filter-container"},[n("el-row",[n("el-col",[n("el-select",{staticClass:"filter-item ya-search-field",attrs:{placeholder:"搜索字段"},model:{value:e.query.search_field,callback:function(t){e.$set(e.query,"search_field",t)},expression:"query.search_field"}},[n("el-option",{attrs:{value:"username",label:"账号"}}),n("el-option",{attrs:{value:"nickname",label:"昵称"}}),n("el-option",{attrs:{value:"phone",label:"手机"}}),n("el-option",{attrs:{value:"email",label:"邮箱"}}),n("el-option",{attrs:{value:e.idkey,label:"ID"}}),n("el-option",{attrs:{value:"is_super",label:"是否超管"}}),n("el-option",{attrs:{value:"is_disable",label:"是否禁用"}})],1),n("el-input",{staticClass:"filter-item ya-search-value",attrs:{placeholder:"搜索内容",clearable:""},model:{value:e.query.search_value,callback:function(t){e.$set(e.query,"search_value",t)},expression:"query.search_value"}}),n("el-select",{staticClass:"filter-item ya-date-field",attrs:{placeholder:"时间类型"},model:{value:e.query.date_field,callback:function(t){e.$set(e.query,"date_field",t)},expression:"query.date_field"}},[n("el-option",{attrs:{value:"create_time",label:"添加时间"}}),n("el-option",{attrs:{value:"update_time",label:"修改时间"}}),n("el-option",{attrs:{value:"login_time",label:"登录时间"}}),n("el-option",{attrs:{value:"logout_time",label:"退出时间"}})],1),n("el-date-picker",{staticClass:"filter-item ya-date-value",attrs:{type:"daterange","value-format":"yyyy-MM-dd","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.query.date_value,callback:function(t){e.$set(e.query,"date_value",t)},expression:"query.date_value"}}),n("el-button",{staticClass:"filter-item",attrs:{type:"primary"},on:{click:function(t){return e.search()}}},[e._v("查询")]),n("el-button",{staticClass:"filter-item",on:{click:function(t){return e.refresh()}}},[e._v("刷新")])],1)],1),n("el-row",[n("el-col",[n("el-button",{attrs:{title:"是否超管"},on:{click:function(t){return e.selectOpen("super")}}},[e._v("超管")]),n("el-button",{attrs:{title:"是否禁用"},on:{click:function(t){return e.selectOpen("disable")}}},[e._v("禁用")]),n("el-button",{attrs:{title:"重置密码"},on:{click:function(t){return e.selectOpen("password")}}},[e._v("密码")]),n("el-button",{on:{click:function(t){return e.selectOpen("dele")}}},[e._v("删除")]),n("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.add()}}},[e._v("添加")])],1)],1),n("el-dialog",{attrs:{title:e.selectTitle,visible:e.selectDialog,top:"20vh","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.selectDialog=t}}},[n("el-form",{ref:"selectRef",attrs:{"label-width":"120px"}},[n("el-form-item",{attrs:{label:e.name+"ID",prop:""}},[n("el-input",{attrs:{type:"textarea",rows:2,disabled:""},model:{value:e.selectIds,callback:function(t){e.selectIds=t},expression:"selectIds"}})],1),"super"===e.selectType?n("el-form-item",{attrs:{label:"是否超管",prop:""}},[n("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:e.is_super,callback:function(t){e.is_super=t},expression:"is_super"}})],1):"disable"===e.selectType?n("el-form-item",{attrs:{label:"是否禁用",prop:""}},[n("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:e.is_disable,callback:function(t){e.is_disable=t},expression:"is_disable"}})],1):"password"===e.selectType?n("el-form-item",{attrs:{label:"新密码",prop:"password"}},[n("el-input",{attrs:{placeholder:"请输入新密码",clearable:"","show-password":""},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1):"dele"===e.selectType?n("el-form-item",{attrs:{label:"",prop:""}},[n("span",{staticStyle:{color:"red"}},[e._v("确定要删除选中的"+e._s(e.name)+"吗？")])]):e._e()],1),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:e.selectCancel}},[e._v("取消")]),n("el-button",{attrs:{type:"primary"},on:{click:e.selectSubmit}},[e._v("提交")])],1)],1)],1),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{data:e.datas,height:e.height},on:{"sort-change":e.sort,"selection-change":e.select}},[n("el-table-column",{attrs:{type:"selection",width:"42",title:"全选/反选"}}),n("el-table-column",{attrs:{prop:e.idkey,label:"ID","min-width":"100",sortable:"custom"}}),n("el-table-column",{attrs:{prop:"username",label:"账号","min-width":"120",sortable:"custom","show-overflow-tooltip":""}}),n("el-table-column",{attrs:{prop:"nickname",label:"昵称","min-width":"120",sortable:"custom","show-overflow-tooltip":""}}),n("el-table-column",{attrs:{prop:"email",label:"邮箱","min-width":"250",sortable:"custom","show-overflow-tooltip":""}}),n("el-table-column",{attrs:{prop:"is_super",label:"超管","min-width":"75",sortable:"custom"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(n){return e.isSuper([t.row])}},model:{value:t.row.is_super,callback:function(n){e.$set(t.row,"is_super",n)},expression:"scope.row.is_super"}})]}}])}),n("el-table-column",{attrs:{prop:"is_disable",label:"禁用","min-width":"75",sortable:"custom"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(n){return e.isDisable([t.row])}},model:{value:t.row.is_disable,callback:function(n){e.$set(t.row,"is_disable",n)},expression:"scope.row.is_disable"}})]}}])}),n("el-table-column",{attrs:{prop:"sort",label:"排序",width:"75",sortable:"custom"}}),n("el-table-column",{attrs:{prop:"login_num",label:"登录次数","min-width":"105",sortable:"custom"}}),n("el-table-column",{attrs:{prop:"login_time",label:"登录时间","min-width":"160",sortable:"custom"}}),n("el-table-column",{attrs:{prop:"create_tie",label:"添加时间","min-width":"160",sortable:"custom"}}),n("el-table-column",{attrs:{label:"操作","min-width":"160",align:"right",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.row;return[n("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(t){return e.rule(i)}}},[e._v("权限")]),n("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(t){return e.selectOpen("password",i)}}},[e._v("密码")]),n("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(t){return e.edit(i)}}},[e._v("修改")]),n("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(t){return e.selectOpen("dele",i)}}},[e._v("删除")])]}}])})],1),n("pagination",{directives:[{name:"show",rawName:"v-show",value:e.count>0,expression:"count > 0"}],attrs:{total:e.count,page:e.query.page,limit:e.query.limit},on:{"update:page":function(t){return e.$set(e.query,"page",t)},"update:limit":function(t){return e.$set(e.query,"limit",t)},pagination:e.list}}),n("el-dialog",{attrs:{title:e.dialogTitle,visible:e.dialog,top:"5vh","before-close":e.cancel,"close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.dialog=t}}},[n("el-form",{ref:"ref",staticClass:"dialog-body",style:{height:e.height+"px"},attrs:{model:e.model,rules:e.rules,"label-width":"100px"}},[n("el-form-item",{attrs:{label:"头像",prop:"avatar_url"}},[n("el-col",{attrs:{span:10}},[e.model.avatar_url?n("el-avatar",{attrs:{shape:"circle",fit:"contain",size:100,src:e.model.avatar_url}}):n("el-avatar",{attrs:{icon:"el-icon-user-solid",size:100}})],1),n("el-col",{attrs:{span:14}},[n("el-button",{attrs:{size:"mini"},on:{click:function(t){return e.fileUpload()}}},[e._v("上传头像")]),n("el-button",{attrs:{size:"mini"},on:{click:function(t){return e.fileDelete("avatar")}}},[e._v("删除")]),n("p",[e._v("jpg、png图片，小于100kb，宽高1:1")])],1)],1),n("el-form-item",{attrs:{label:"账号",prop:"username"}},[n("el-input",{key:"username",attrs:{placeholder:"请输入账号",clearable:""},model:{value:e.model.username,callback:function(t){e.$set(e.model,"username",t)},expression:"model.username"}})],1),n("el-form-item",{attrs:{label:"昵称",prop:"nickname"}},[n("el-input",{key:"nickname",attrs:{placeholder:"请输入昵称",clearable:""},model:{value:e.model.nickname,callback:function(t){e.$set(e.model,"nickname",t)},expression:"model.nickname"}})],1),""==e.model[e.idkey]?n("el-form-item",{attrs:{label:"密码",prop:"password"}},[n("el-input",{key:"password",attrs:{placeholder:"请输入密码",clearable:"","show-password":""},model:{value:e.model.password,callback:function(t){e.$set(e.model,"password",t)},expression:"model.password"}})],1):e._e(),n("el-form-item",{attrs:{label:"手机",prop:"phone"}},[n("el-input",{attrs:{clearable:""},model:{value:e.model.phone,callback:function(t){e.$set(e.model,"phone",t)},expression:"model.phone"}})],1),n("el-form-item",{attrs:{label:"邮箱",prop:"email"}},[n("el-input",{attrs:{clearable:""},model:{value:e.model.email,callback:function(t){e.$set(e.model,"email",t)},expression:"model.email"}})],1),n("el-form-item",{attrs:{label:"备注",prop:"remark"}},[n("el-input",{attrs:{clearable:""},model:{value:e.model.remark,callback:function(t){e.$set(e.model,"remark",t)},expression:"model.remark"}})],1),n("el-form-item",{attrs:{label:"排序",prop:"sort"}},[n("el-input",{attrs:{type:"number"},model:{value:e.model.sort,callback:function(t){e.$set(e.model,"sort",t)},expression:"model.sort"}})],1),e.model[e.idkey]?n("el-form-item",{attrs:{label:"登录IP",prop:"login_ip"}},[n("el-input",{attrs:{disabled:""},model:{value:e.model.login_ip,callback:function(t){e.$set(e.model,"login_ip",t)},expression:"model.login_ip"}})],1):e._e(),e.model[e.idkey]?n("el-form-item",{attrs:{label:"登录地区",prop:"login_region"}},[n("el-input",{attrs:{disabled:""},model:{value:e.model.login_region,callback:function(t){e.$set(e.model,"login_region",t)},expression:"model.login_region"}})],1):e._e(),e.model.login_time?n("el-form-item",{attrs:{label:"登录时间",prop:"login_time"}},[n("el-input",{attrs:{disabled:""},model:{value:e.model.login_time,callback:function(t){e.$set(e.model,"login_time",t)},expression:"model.login_time"}})],1):e._e(),e.model.logout_time?n("el-form-item",{attrs:{label:"退出时间",prop:"logout_time"}},[n("el-input",{attrs:{disabled:""},model:{value:e.model.logout_time,callback:function(t){e.$set(e.model,"logout_time",t)},expression:"model.logout_time"}})],1):e._e(),e.model.create_time?n("el-form-item",{attrs:{label:"添加时间",prop:"create_time"}},[n("el-input",{attrs:{disabled:""},model:{value:e.model.create_time,callback:function(t){e.$set(e.model,"create_time",t)},expression:"model.create_time"}})],1):e._e(),e.model.update_time?n("el-form-item",{attrs:{label:"修改时间",prop:"update_time"}},[n("el-input",{attrs:{disabled:""},model:{value:e.model.update_time,callback:function(t){e.$set(e.model,"update_time",t)},expression:"model.update_time"}})],1):e._e()],1),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:e.cancel}},[e._v("取消")]),n("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("提交")])],1)],1),n("el-dialog",{attrs:{title:e.name+"分配权限："+e.model[e.idkey],visible:e.ruleDialog,top:"5vh","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.ruleDialog=t}}},[n("el-form",{ref:"roleRef",staticClass:"dialog-body",style:{height:e.height+"px"},attrs:{model:e.model,"label-width":"100px"}},[n("el-form-item",{attrs:{label:"账号"}},[n("el-input",{attrs:{disabled:""},model:{value:e.model.username,callback:function(t){e.$set(e.model,"username",t)},expression:"model.username"}})],1),n("el-form-item",{attrs:{label:"昵称"}},[n("el-input",{attrs:{disabled:""},model:{value:e.model.nickname,callback:function(t){e.$set(e.model,"nickname",t)},expression:"model.nickname"}})],1),n("el-form-item",{attrs:{label:"按角色"}},[n("el-checkbox-group",{model:{value:e.model.admin_role_ids,callback:function(t){e.$set(e.model,"admin_role_ids",t)},expression:"model.admin_role_ids"}},e._l(e.roleData,(function(t){return n("el-checkbox",{key:t.admin_role_id,attrs:{label:t.admin_role_id}},[e._v(e._s(t.role_name))])})),1)],1),n("el-form-item",{attrs:{label:"按菜单"}},[n("span",[n("el-checkbox",{attrs:{title:"全选/反选"},on:{change:e.menuCheckAllChange},model:{value:e.menuCheckAll,callback:function(t){e.menuCheckAll=t},expression:"menuCheckAll"}},[e._v("全选")]),n("el-checkbox",{attrs:{title:"收起/展开"},on:{change:e.menuExpandAllChange},model:{value:e.menuExpandAll,callback:function(t){e.menuExpandAll=t},expression:"menuExpandAll"}},[e._v("收起")])],1),n("el-tree",{key:e.menuKey,ref:"menuRef",attrs:{data:e.menuData,props:e.menuProps,"default-checked-keys":e.model.admin_menu_ids,"expand-on-click-node":!1,"default-expand-all":!0,"check-strictly":!1,"node-key":"admin_menu_id","highlight-current":"","show-checkbox":""},on:{check:e.menuCheck},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.node,o=t.data;return n("span",{staticClass:"custom-tree-node"},[n("span",[e._v(e._s(i.label)),o.is_check?n("i",{staticClass:"el-icon-check",staticStyle:{color:"#1890ff"},attrs:{title:"已分配"}}):e._e()]),n("span",[o.is_role?n("i",{staticClass:"el-icon-s-custom",staticStyle:{"margin-left":"10px"},attrs:{title:"按角色"}}):e._e(),o.is_menu?n("i",{staticClass:"el-icon-menu",staticStyle:{"margin-left":"10px"},attrs:{title:"按菜单"}}):e._e(),o.menu_url?n("i",{staticClass:"el-icon-link",staticStyle:{"margin-left":"10px"},attrs:{title:o.menu_url}}):n("i",{staticClass:"el-icon-link",staticStyle:{"margin-left":"10px",color:"#fff"}}),o.is_unauth?n("i",{staticClass:"el-icon-unlock",staticStyle:{"margin-left":"10px"},attrs:{title:"无需权限"}}):n("i",{staticClass:"el-icon-unlock",staticStyle:{"margin-left":"10px",color:"#fff"}}),o.is_unlogin?n("i",{staticClass:"el-icon-user",staticStyle:{"margin-left":"10px"},attrs:{title:"无需登录"}}):n("i",{staticClass:"el-icon-user",staticStyle:{"margin-left":"10px",color:"#fff"}})])])}}])})],1)],1),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:e.ruleCancel}},[e._v("取消")]),n("el-button",{attrs:{type:"primary"},on:{click:e.ruleSubmit}},[e._v("提交")])],1)],1),n("el-dialog",{attrs:{title:"上传头像",visible:e.fileDialog,top:"1vh",width:"80%","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.fileDialog=t}}},[n("file-manage",{attrs:{"file-type":"image"},on:{fileCancel:e.fileCancel,fileSubmit:e.fileSubmit}})],1)],1)},o=[],l=(n("b0c0"),n("d3b7"),n("25f0"),n("98b1")),r=n("333d"),a=n("3659"),s=n("ed08"),c=n("b775"),u="/admin/admin.User/";function d(e){return Object(c["a"])({url:u+"list",method:"get",params:e})}function m(e){return Object(c["a"])({url:u+"info",method:"get",params:e})}function f(e){return Object(c["a"])({url:u+"add",method:"post",data:e})}function p(e){return Object(c["a"])({url:u+"edit",method:"post",data:e})}function h(e){return Object(c["a"])({url:u+"dele",method:"post",data:e})}function b(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"get";return"post"===t?Object(c["a"])({url:u+"rule",method:"post",data:e}):Object(c["a"])({url:u+"rule",method:"get",params:e})}function v(e){return Object(c["a"])({url:u+"pwd",method:"post",data:e})}function g(e){return Object(c["a"])({url:u+"super",method:"post",data:e})}function y(e){return Object(c["a"])({url:u+"disable",method:"post",data:e})}var _={name:"AuthUser",components:{Pagination:r["a"],FileManage:a["a"]},data:function(){return{name:"用户",height:680,loading:!1,idkey:"admin_user_id",datas:[],count:0,query:{page:1,limit:15,search_field:"username",date_field:"create_time"},dialog:!1,dialogTitle:"",model:{admin_user_id:"",avatar_id:0,avatar_url:"",admin_role_ids:[],admin_menu_ids:[],menu_ids:[],username:"",nickname:"",password:"",phone:"",email:"",remark:"",sort:250,login_ip:"",login_region:"",login_time:"",logout_time:"",create_time:"",update_time:""},rules:{username:[{required:!0,message:"请输入账号",trigger:"blur"}],nickname:[{required:!0,message:"请输入昵称",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]},selection:[],selectIds:"",selectTitle:"选中操作",selectDialog:!1,selectType:"",is_super:0,is_disable:0,password:"",ruleDialog:!1,roleData:[],menuKey:1,menuData:[],menuProps:{children:"children",label:"menu_name"},menuCheckAll:!1,menuExpandAll:!1,fileDialog:!1}},created:function(){this.height=Object(l["a"])(),this.list()},methods:{list:function(){var e=this;this.loading=!0,d(this.query).then((function(t){e.datas=t.data.list,e.count=t.data.count,e.loading=!1})).catch((function(){e.loading=!1}))},add:function(){this.dialog=!0,this.dialogTitle=this.name+"添加",this.reset()},edit:function(e){var t=this;this.dialog=!0,this.dialogTitle=this.name+"修改："+e[this.idkey];var n={};n[this.idkey]=e[this.idkey],m(n).then((function(e){t.reset(e.data)})),this.$refs["table"].clearSelection()},cancel:function(){this.dialog=!1,this.reset()},submit:function(){var e=this;this.$refs["ref"].validate((function(t){t&&(e.loading=!0,e.model.admin_user_id?p(e.model,"post").then((function(t){e.list(),e.dialog=!1,e.$message.success(t.msg)})).catch((function(){e.loading=!1})):f(e.model).then((function(t){e.list(),e.dialog=!1,e.$message.success(t.msg)})).catch((function(){e.loading=!1})))}))},reset:function(e){++this.menuKey,this.model=e||this.$options.data().model,void 0!==this.$refs["ref"]&&this.$refs["ref"].resetFields()},search:function(){this.query.page=1,this.list()},refresh:function(){this.query=this.$options.data().query,this.list()},sort:function(e){this.query.sort_field=e.prop,this.query.sort_value="","ascending"===e.order&&(this.query.sort_value="asc",this.list()),"descending"===e.order&&(this.query.sort_value="desc",this.list())},select:function(e){this.selection=e,this.selectIds=this.selectGetIds(e).toString()},selectGetIds:function(e){return Object(s["a"])(e,this.idkey)},selectAlert:function(){this.$alert("请选择需要操作的"+this.name,"提示",{type:"warning",callback:function(e){}})},selectOpen:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";t&&(this.$refs["table"].clearSelection(),this.$refs["table"].toggleRowSelection(t)),this.selection.length?(this.selectTitle="选中操作","super"===e?this.selectTitle="是否超管":"disable"===e?this.selectTitle="是否禁用":"password"===e?this.selectTitle="重置密码":"dele"===e&&(this.selectTitle="删除"+this.name),this.selectDialog=!0,this.selectType=e):this.selectAlert()},selectCancel:function(){this.selectDialog=!1},selectSubmit:function(){if(this.selection.length){var e=this.selectType;"super"===e?this.isSuper(this.selection,!0):"disable"===e?this.isDisable(this.selection,!0):"password"===e?this.rePassword(this.selection,!0):"dele"===e&&this.dele(this.selection),this.selectDialog=!1}else this.selectAlert()},isSuper:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e.length){this.loading=!0;var i=e[0].is_super;n&&(i=this.is_super),g({ids:this.selectGetIds(e),is_super:i}).then((function(e){t.list(),t.$message.success(e.msg)})).catch((function(){t.list()}))}else this.selectAlert()},isDisable:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e.length){this.loading=!0;var i=e[0].is_disable;n&&(i=this.is_disable),y({ids:this.selectGetIds(e),is_disable:i}).then((function(e){t.list(),t.$message.success(e.msg)})).catch((function(){t.list()}))}else this.selectAlert()},rePassword:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e.length){if(!this.password)return this.$message.error("请输入新密码"),!1;this.loading=!0;var i=e[0].password;n&&(i=this.password),v({ids:this.selectGetIds(e),password:i}).then((function(e){t.list(),t.$message.success(e.msg)})).catch((function(){t.loading=!1}))}else this.selectAlert()},dele:function(e){var t=this;e.length?(this.loading=!0,h({ids:this.selectGetIds(e)}).then((function(e){t.list(),t.$message.success(e.msg)})).catch((function(){t.loading=!1}))):this.selectAlert()},rule:function(e){var t=this;this.ruleDialog=!0,this.menuCheckAll=!1,this.menuExpandAll=!1;var n={};n[this.idkey]=e[this.idkey],b(n).then((function(n){t.model[t.idkey]=e[t.idkey],t.roleData=n.data.admin_role,t.menuData=n.data.admin_menu,t.model.username=n.data.username,t.model.nickname=n.data.nickname,t.model.admin_role_ids=n.data.admin_role_ids,t.model.admin_menu_ids=n.data.admin_menu_ids,t.model.menu_ids=n.data.menu_ids})),this.$refs["table"].clearSelection()},ruleCancel:function(){this.ruleDialog=!1,this.reset()},ruleSubmit:function(){var e=this;this.$refs["roleRef"].validate((function(t){t&&(e.loading=!0,b({admin_user_id:e.model.admin_user_id,admin_role_ids:e.model.admin_role_ids,admin_menu_ids:e.model.admin_menu_ids},"post").then((function(t){e.list(),e.ruleDialog=!1,e.$message.success(t.msg)})).catch((function(){e.loading=!1})))}))},menuCheck:function(){this.menuCheckSetKeys()},menuCheckAllChange:function(){this.menuCheckAll?this.$refs.menuRef.setCheckedNodes(this.menuData):this.$refs.menuRef.setCheckedKeys([]),this.menuCheckSetKeys()},menuCheckSetKeys:function(){this.model.admin_menu_ids=this.$refs.menuRef.getCheckedKeys()},menuExpandAllChange:function(){for(var e=!this.menuExpandAll,t=this.$refs.menuRef.store._getAllNodes().length,n=0;n<t;n++)this.$refs.menuRef.store._getAllNodes()[n].expanded=e},fileUpload:function(){this.fileDialog=!0},fileCancel:function(){this.fileDialog=!1},fileSubmit:function(e){this.fileDialog=!1,this.model.avatar_id=e[0]["file_id"],this.model.avatar_url=e[0]["file_url"]},fileDelete:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";"avatar"===e&&(this.model.avatar_id=0,this.model.avatar_url="")}}},k=_,w=(n("8783"),n("2877")),x=Object(w["a"])(k,i,o,!1,null,"eb871000",null);t["default"]=x.exports},b311:function(e,t,n){
/*!
 * clipboard.js v2.0.10
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */
(function(t,n){e.exports=n()})(0,(function(){return function(){var e={686:function(e,t,n){"use strict";n.d(t,{default:function(){return E}});var i=n(279),o=n.n(i),l=n(370),r=n.n(l),a=n(817),s=n.n(a);function c(e){try{return document.execCommand(e)}catch(t){return!1}}var u=function(e){var t=s()(e);return c("cut"),t},d=u;function m(e){var t="rtl"===document.documentElement.getAttribute("dir"),n=document.createElement("textarea");n.style.fontSize="12pt",n.style.border="0",n.style.padding="0",n.style.margin="0",n.style.position="absolute",n.style[t?"right":"left"]="-9999px";var i=window.pageYOffset||document.documentElement.scrollTop;return n.style.top="".concat(i,"px"),n.setAttribute("readonly",""),n.value=e,n}var f=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body},n="";if("string"===typeof e){var i=m(e);t.container.appendChild(i),n=s()(i),c("copy"),i.remove()}else n=s()(e),c("copy");return n},p=f;function h(e){return h="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},h(e)}var b=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.action,n=void 0===t?"copy":t,i=e.container,o=e.target,l=e.text;if("copy"!==n&&"cut"!==n)throw new Error('Invalid "action" value, use either "copy" or "cut"');if(void 0!==o){if(!o||"object"!==h(o)||1!==o.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===n&&o.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===n&&(o.hasAttribute("readonly")||o.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes')}return l?p(l,{container:i}):o?"cut"===n?d(o):p(o,{container:i}):void 0},v=b;function g(e){return g="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},g(e)}function y(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function k(e,t,n){return t&&_(e.prototype,t),n&&_(e,n),e}function w(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&x(e,t)}function x(e,t){return x=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},x(e,t)}function S(e){var t=T();return function(){var n,i=A(e);if(t){var o=A(this).constructor;n=Reflect.construct(i,arguments,o)}else n=i.apply(this,arguments);return C(this,n)}}function C(e,t){return!t||"object"!==g(t)&&"function"!==typeof t?O(e):t}function O(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function T(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function A(e){return A=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},A(e)}function $(e,t){var n="data-clipboard-".concat(e);if(t.hasAttribute(n))return t.getAttribute(n)}var j=function(e){w(n,e);var t=S(n);function n(e,i){var o;return y(this,n),o=t.call(this),o.resolveOptions(i),o.listenClick(e),o}return k(n,[{key:"resolveOptions",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"===typeof e.action?e.action:this.defaultAction,this.target="function"===typeof e.target?e.target:this.defaultTarget,this.text="function"===typeof e.text?e.text:this.defaultText,this.container="object"===g(e.container)?e.container:document.body}},{key:"listenClick",value:function(e){var t=this;this.listener=r()(e,"click",(function(e){return t.onClick(e)}))}},{key:"onClick",value:function(e){var t=e.delegateTarget||e.currentTarget,n=this.action(t)||"copy",i=v({action:n,container:this.container,target:this.target(t),text:this.text(t)});this.emit(i?"success":"error",{action:n,text:i,trigger:t,clearSelection:function(){t&&t.focus(),document.activeElement.blur(),window.getSelection().removeAllRanges()}})}},{key:"defaultAction",value:function(e){return $("action",e)}},{key:"defaultTarget",value:function(e){var t=$("target",e);if(t)return document.querySelector(t)}},{key:"defaultText",value:function(e){return $("text",e)}},{key:"destroy",value:function(){this.listener.destroy()}}],[{key:"copy",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body};return p(e,t)}},{key:"cut",value:function(e){return d(e)}},{key:"isSupported",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],t="string"===typeof e?[e]:e,n=!!document.queryCommandSupported;return t.forEach((function(e){n=n&&!!document.queryCommandSupported(e)})),n}}]),n}(o()),E=j},828:function(e){var t=9;if("undefined"!==typeof Element&&!Element.prototype.matches){var n=Element.prototype;n.matches=n.matchesSelector||n.mozMatchesSelector||n.msMatchesSelector||n.oMatchesSelector||n.webkitMatchesSelector}function i(e,n){while(e&&e.nodeType!==t){if("function"===typeof e.matches&&e.matches(n))return e;e=e.parentNode}}e.exports=i},438:function(e,t,n){var i=n(828);function o(e,t,n,i,o){var l=r.apply(this,arguments);return e.addEventListener(n,l,o),{destroy:function(){e.removeEventListener(n,l,o)}}}function l(e,t,n,i,l){return"function"===typeof e.addEventListener?o.apply(null,arguments):"function"===typeof n?o.bind(null,document).apply(null,arguments):("string"===typeof e&&(e=document.querySelectorAll(e)),Array.prototype.map.call(e,(function(e){return o(e,t,n,i,l)})))}function r(e,t,n,o){return function(n){n.delegateTarget=i(n.target,t),n.delegateTarget&&o.call(e,n)}}e.exports=l},879:function(e,t){t.node=function(e){return void 0!==e&&e instanceof HTMLElement&&1===e.nodeType},t.nodeList=function(e){var n=Object.prototype.toString.call(e);return void 0!==e&&("[object NodeList]"===n||"[object HTMLCollection]"===n)&&"length"in e&&(0===e.length||t.node(e[0]))},t.string=function(e){return"string"===typeof e||e instanceof String},t.fn=function(e){var t=Object.prototype.toString.call(e);return"[object Function]"===t}},370:function(e,t,n){var i=n(879),o=n(438);function l(e,t,n){if(!e&&!t&&!n)throw new Error("Missing required arguments");if(!i.string(t))throw new TypeError("Second argument must be a String");if(!i.fn(n))throw new TypeError("Third argument must be a Function");if(i.node(e))return r(e,t,n);if(i.nodeList(e))return a(e,t,n);if(i.string(e))return s(e,t,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function r(e,t,n){return e.addEventListener(t,n),{destroy:function(){e.removeEventListener(t,n)}}}function a(e,t,n){return Array.prototype.forEach.call(e,(function(e){e.addEventListener(t,n)})),{destroy:function(){Array.prototype.forEach.call(e,(function(e){e.removeEventListener(t,n)}))}}}function s(e,t,n){return o(document.body,e,t,n)}e.exports=l},817:function(e){function t(e){var t;if("SELECT"===e.nodeName)e.focus(),t=e.value;else if("INPUT"===e.nodeName||"TEXTAREA"===e.nodeName){var n=e.hasAttribute("readonly");n||e.setAttribute("readonly",""),e.select(),e.setSelectionRange(0,e.value.length),n||e.removeAttribute("readonly"),t=e.value}else{e.hasAttribute("contenteditable")&&e.focus();var i=window.getSelection(),o=document.createRange();o.selectNodeContents(e),i.removeAllRanges(),i.addRange(o),t=i.toString()}return t}e.exports=t},279:function(e){function t(){}t.prototype={on:function(e,t,n){var i=this.e||(this.e={});return(i[e]||(i[e]=[])).push({fn:t,ctx:n}),this},once:function(e,t,n){var i=this;function o(){i.off(e,o),t.apply(n,arguments)}return o._=t,this.on(e,o,n)},emit:function(e){var t=[].slice.call(arguments,1),n=((this.e||(this.e={}))[e]||[]).slice(),i=0,o=n.length;for(i;i<o;i++)n[i].fn.apply(n[i].ctx,t);return this},off:function(e,t){var n=this.e||(this.e={}),i=n[e],o=[];if(i&&t)for(var l=0,r=i.length;l<r;l++)i[l].fn!==t&&i[l].fn._!==t&&o.push(i[l]);return o.length?n[e]=o:delete n[e],this}},e.exports=t,e.exports.TinyEmitter=t}},t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={exports:{}};return e[i](o,o.exports,n),o.exports}return function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),n(686)}().default}))},e08b:function(e,t,n){"use strict";n.d(t,"h",(function(){return l})),n.d(t,"j",(function(){return r})),n.d(t,"i",(function(){return a})),n.d(t,"a",(function(){return s})),n.d(t,"d",(function(){return c})),n.d(t,"b",(function(){return u})),n.d(t,"f",(function(){return d})),n.d(t,"g",(function(){return m})),n.d(t,"e",(function(){return f})),n.d(t,"c",(function(){return p})),n.d(t,"k",(function(){return h})),n.d(t,"m",(function(){return b})),n.d(t,"l",(function(){return v}));var i=n("b775"),o="/admin/file.File/";function l(e){return Object(i["a"])({url:o+"group",method:"get",params:e})}function r(e){return Object(i["a"])({url:o+"list",method:"get",params:e})}function a(e){return Object(i["a"])({url:o+"info",method:"get",params:e})}function s(){return o+"add"}function c(e){return Object(i["a"])({url:o+"edit",method:"post",data:e})}function u(e){return Object(i["a"])({url:o+"dele",method:"post",data:e})}function d(e){return Object(i["a"])({url:o+"editgroup",method:"post",data:e})}function m(e){return Object(i["a"])({url:o+"edittype",method:"post",data:e})}function f(e){return Object(i["a"])({url:o+"editdomain",method:"post",data:e})}function p(e){return Object(i["a"])({url:o+"disable",method:"post",data:e})}function h(e){return Object(i["a"])({url:o+"recover",method:"get",params:e})}function b(e){return Object(i["a"])({url:o+"recoverReco",method:"post",data:e})}function v(e){return Object(i["a"])({url:o+"recoverDele",method:"post",data:e})}},ed08:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"a",(function(){return o}));n("ac1f"),n("466d"),n("4d63"),n("25f0"),n("5319"),n("d3b7"),n("3ca3"),n("ddb0"),n("2b3d");function i(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:12,t="",n="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",i=0;i<e;i++)t+=n[Math.floor(Math.random()*n.length)];return t}function o(e,t){for(var n=[],i=e.length,o=0;o<i;o++)n.push(e[o][t]);return n}},f71e:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var i=n("2b0e"),o=n("b311"),l=n.n(o);function r(){i["default"].prototype.$message({message:"复制成功",type:"success",duration:1500})}function a(){i["default"].prototype.$message({message:"复制失败",type:"error"})}function s(e,t){var n=new l.a(t.target,{text:function(){return e}});n.on("success",(function(){r(),n.destroy()})),n.on("error",(function(){a(),n.destroy()})),n.onClick(t)}}}]);