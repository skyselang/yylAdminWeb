(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6a82f900"],{"09f4":function(e,t,l){"use strict";l.d(t,"a",(function(){return n})),Math.easeInOutQuad=function(e,t,l,i){return e/=i/2,e<1?l/2*e*e+t:(e--,-l/2*(e*(e-2)-1)+t)};var i=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();function a(e){document.documentElement.scrollTop=e,document.body.parentNode.scrollTop=e,document.body.scrollTop=e}function s(){return document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop}function n(e,t,l){var n=s(),o=e-n,r=20,c=0;t="undefined"===typeof t?500:t;var u=function e(){c+=r;var s=Math.easeInOutQuad(c,n,o,t);a(s),c<t?i(e):l&&"function"===typeof l&&l()};u()}},"98b1":function(e,t,l){"use strict";function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:260,t=880,l=document.documentElement.clientHeight||document.body.clientHeight;return l?l-e:t-e}l.d(t,"a",(function(){return i}))},a3cd:function(e,t,l){},a7ad:function(e,t,l){"use strict";l.r(t);var i=function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",{staticClass:"app-container"},[l("div",{staticClass:"filter-container"},[l("el-row",[l("el-col",[l("el-select",{staticClass:"filter-item ya-search-field",attrs:{placeholder:"搜索字段"},model:{value:e.query.search_field,callback:function(t){e.$set(e.query,"search_field",t)},expression:"query.search_field"}},[l("el-option",{attrs:{value:"role_name",label:"名称"}}),l("el-option",{attrs:{value:"role_desc",label:"描述"}}),l("el-option",{attrs:{value:"is_disable",label:"是否禁用"}}),l("el-option",{attrs:{value:e.idkey,label:"ID"}})],1),l("el-input",{staticClass:"filter-item ya-search-value",attrs:{placeholder:"搜索内容",clearable:""},model:{value:e.query.search_value,callback:function(t){e.$set(e.query,"search_value",t)},expression:"query.search_value"}}),l("el-select",{staticClass:"filter-item ya-date-field",attrs:{placeholder:"时间类型"},model:{value:e.query.date_field,callback:function(t){e.$set(e.query,"date_field",t)},expression:"query.date_field"}},[l("el-option",{attrs:{value:"create_time",label:"添加时间"}}),l("el-option",{attrs:{value:"update_time",label:"修改时间"}})],1),l("el-date-picker",{staticClass:"filter-item ya-date-value",attrs:{type:"daterange","value-format":"yyyy-MM-dd","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.query.date_value,callback:function(t){e.$set(e.query,"date_value",t)},expression:"query.date_value"}}),l("el-button",{staticClass:"filter-item",attrs:{type:"primary"},on:{click:function(t){return e.search()}}},[e._v("查询")]),l("el-button",{staticClass:"filter-item",on:{click:function(t){return e.refresh()}}},[e._v("刷新")])],1)],1),l("el-row",[l("el-col",[l("el-button",{attrs:{title:"是否禁用"},on:{click:function(t){return e.selectOpen("disable")}}},[e._v("禁用")]),l("el-button",{on:{click:function(t){return e.selectOpen("dele")}}},[e._v("删除")]),l("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.add()}}},[e._v("添加")])],1)],1),l("el-dialog",{attrs:{title:e.selectTitle,visible:e.selectDialog,top:"20vh","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.selectDialog=t}}},[l("el-form",{ref:"selectRef",attrs:{"label-width":"120px"}},[l("el-form-item",{attrs:{label:e.name+"ID",prop:""}},[l("el-input",{attrs:{type:"textarea",rows:2,disabled:""},model:{value:e.selectIds,callback:function(t){e.selectIds=t},expression:"selectIds"}})],1),"disable"===e.selectType?l("el-form-item",{attrs:{label:"是否禁用",prop:""}},[l("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:e.is_disable,callback:function(t){e.is_disable=t},expression:"is_disable"}})],1):"dele"===e.selectType?l("el-form-item",{attrs:{label:"",prop:""}},[l("span",{staticStyle:{color:"red"}},[e._v("确定要删除选中的"+e._s(e.name)+"吗？")])]):e._e()],1),l("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{on:{click:e.selectCancel}},[e._v("取消")]),l("el-button",{attrs:{type:"primary"},on:{click:e.selectSubmit}},[e._v("提交")])],1)],1)],1),l("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{data:e.datas,height:e.height},on:{"sort-change":e.sort,"selection-change":e.select}},[l("el-table-column",{attrs:{type:"selection",width:"42",title:"全选/反选"}}),l("el-table-column",{attrs:{prop:e.idkey,label:"ID","min-width":"100",sortable:"custom"}}),l("el-table-column",{attrs:{prop:"role_name",label:"名称","min-width":"160"}}),l("el-table-column",{attrs:{prop:"role_desc",label:"描述","min-width":"130"}}),l("el-table-column",{attrs:{prop:"role_sort",label:"排序","min-width":"100",sortable:"custom"}}),l("el-table-column",{attrs:{prop:"create_time",label:"添加时间","min-width":"160",sortable:"custom"}}),l("el-table-column",{attrs:{prop:"update_time",label:"修改时间","min-width":"160",sortable:"custom"}}),l("el-table-column",{attrs:{prop:"is_disable",label:"是否禁用","min-width":"110",sortable:"custom"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("el-switch",{attrs:{"active-value":1,"inactive-value":0},on:{change:function(l){return e.disable([t.row])}},model:{value:t.row.is_disable,callback:function(l){e.$set(t.row,"is_disable",l)},expression:"scope.row.is_disable"}})]}}])}),l("el-table-column",{attrs:{label:"操作","min-width":"130",align:"right",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.row;return[l("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(t){return e.userShow(i)}}},[e._v("用户")]),l("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(t){return e.edit(i)}}},[e._v("修改")]),l("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(t){return e.selectOpen("dele",i)}}},[e._v("删除")])]}}])})],1),l("pagination",{directives:[{name:"show",rawName:"v-show",value:e.count>0,expression:"count > 0"}],attrs:{total:e.count,page:e.query.page,limit:e.query.limit},on:{"update:page":function(t){return e.$set(e.query,"page",t)},"update:limit":function(t){return e.$set(e.query,"limit",t)},pagination:e.list}}),l("el-dialog",{attrs:{title:e.dialogTitle,visible:e.dialog,top:"5vh","before-close":e.cancel,"close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.dialog=t}}},[l("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.dialogLoad,expression:"dialogLoad"}],ref:"ref",staticClass:"dialog-body",style:{height:e.height+"px"},attrs:{rules:e.rules,model:e.model,"label-width":"100px"}},[l("el-form-item",{attrs:{label:"名称",prop:"role_name"}},[l("el-input",{attrs:{placeholder:"请输入角色名称",clearable:""},model:{value:e.model.role_name,callback:function(t){e.$set(e.model,"role_name",t)},expression:"model.role_name"}})],1),l("el-form-item",{attrs:{label:"描述",prop:"role_desc"}},[l("el-input",{attrs:{placeholder:"",clearable:""},model:{value:e.model.role_desc,callback:function(t){e.$set(e.model,"role_desc",t)},expression:"model.role_desc"}})],1),l("el-form-item",{attrs:{label:"排序",prop:"role_sort",placeholder:"250"}},[l("el-input",{attrs:{type:"number"},model:{value:e.model.role_sort,callback:function(t){e.$set(e.model,"role_sort",t)},expression:"model.role_sort"}})],1),l("el-form-item",{attrs:{label:"菜单"}},[l("span",[l("el-checkbox",{attrs:{title:"全选/反选"},on:{change:e.menuCheckAllChange},model:{value:e.menuCheckAll,callback:function(t){e.menuCheckAll=t},expression:"menuCheckAll"}},[e._v("全选")]),l("el-checkbox",{attrs:{title:"收起/展开"},on:{change:e.menuExpandAllChange},model:{value:e.menuExpandAll,callback:function(t){e.menuExpandAll=t},expression:"menuExpandAll"}},[e._v("收起")])],1),l("el-tree",{key:e.menuKey,ref:"menuRef",attrs:{data:e.menuData,props:e.menuProps,"default-checked-keys":e.model.admin_menu_ids,"expand-on-click-node":!1,"default-expand-all":!0,"check-strictly":!1,"node-key":"admin_menu_id","highlight-current":"","show-checkbox":""},on:{check:e.menuCheck},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.node,a=t.data;return l("span",{staticClass:"custom-tree-node"},[l("span",[e._v(e._s(i.label))]),l("span",[a.menu_url?l("i",{staticClass:"el-icon-link",staticStyle:{"margin-left":"10px"},attrs:{title:a.menu_url}}):l("i",{staticClass:"el-icon-link",staticStyle:{"margin-left":"10px",color:"#fff"}}),a.is_unauth?l("i",{staticClass:"el-icon-unlock",staticStyle:{"margin-left":"10px"},attrs:{title:"无需权限"}}):l("i",{staticClass:"el-icon-unlock",staticStyle:{"margin-left":"10px",color:"#fff"}}),a.is_unlogin?l("i",{staticClass:"el-icon-user",staticStyle:{"margin-left":"10px"},attrs:{title:"无需登录"}}):l("i",{staticClass:"el-icon-user",staticStyle:{"margin-left":"10px",color:"#fff"}})])])}}])})],1)],1),l("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{on:{click:e.cancel}},[e._v("取消")]),l("el-button",{attrs:{type:"primary"},on:{click:e.submit}},[e._v("提交")])],1)],1),l("el-dialog",{attrs:{title:e.userDialogTitle,visible:e.userDialog,width:"65%",top:"5vh","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.userDialog=t}}},[l("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.userLoad,expression:"userLoad"}],ref:"userRef",attrs:{data:e.userData,height:e.height},on:{"sort-change":e.userSort}},[l("el-table-column",{attrs:{prop:"admin_user_id",label:"用户ID","min-width":"100",sortable:"custom"}}),l("el-table-column",{attrs:{prop:"username",label:"账号","min-width":"120",sortable:"custom"}}),l("el-table-column",{attrs:{prop:"nickname",label:"昵称","min-width":"120"}}),l("el-table-column",{attrs:{prop:"remark",label:"备注",width:"100"}}),l("el-table-column",{attrs:{prop:"is_admin",label:"超管","min-width":"80",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("el-switch",{attrs:{"active-value":1,"inactive-value":0,disabled:""},model:{value:t.row.is_admin,callback:function(l){e.$set(t.row,"is_admin",l)},expression:"scope.row.is_admin"}})]}}])}),l("el-table-column",{attrs:{prop:"is_disable",label:"禁用","min-width":"80",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("el-switch",{attrs:{"active-value":1,"inactive-value":0,disabled:""},model:{value:t.row.is_disable,callback:function(l){e.$set(t.row,"is_disable",l)},expression:"scope.row.is_disable"}})]}}])}),l("el-table-column",{attrs:{label:"操作","min-width":"80",align:"right",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.row;return[l("el-button",{attrs:{size:"mini",type:"text"},on:{click:function(t){return e.userRemove(i)}}},[e._v("解除")])]}}])})],1),l("pagination",{directives:[{name:"show",rawName:"v-show",value:e.userCount>0,expression:"userCount > 0"}],attrs:{total:e.userCount,page:e.userQuery.page,limit:e.userQuery.limit},on:{"update:page":function(t){return e.$set(e.userQuery,"page",t)},"update:limit":function(t){return e.$set(e.userQuery,"limit",t)},pagination:e.user}})],1)],1)},a=[],s=(l("3e22"),l("a9b6"),l("3bdf"),l("98b1")),n=l("333d"),o=l("ed08"),r=l("b775"),c="/admin/admin.Role/";function u(e){return Object(r["a"])({url:c+"menu",method:"get",params:e})}function d(e){return Object(r["a"])({url:c+"list",method:"get",params:e})}function m(e){return Object(r["a"])({url:c+"info",method:"get",params:e})}function h(e){return Object(r["a"])({url:c+"add",method:"post",data:e})}function f(e){return Object(r["a"])({url:c+"edit",method:"post",data:e})}function p(e){return Object(r["a"])({url:c+"dele",method:"post",data:e})}function b(e){return Object(r["a"])({url:c+"disable",method:"post",data:e})}function g(e){return Object(r["a"])({url:c+"user",method:"get",params:e})}function _(e){return Object(r["a"])({url:c+"userRemove",method:"post",data:e})}var v={name:"AdminRole",components:{Pagination:n["a"]},data:function(){return{name:"角色",height:680,loading:!1,idkey:"admin_role_id",datas:[],count:0,query:{page:1,limit:15,search_field:"role_name",date_field:"create_time"},dialog:!1,dialogTitle:"",dialogLoad:!1,model:{admin_role_id:"",admin_menu_ids:[],role_name:"",role_desc:"",role_sort:250},rules:{role_name:[{required:!0,message:"请输入角色名称",trigger:"blur"}]},menuKey:1,menuData:[],menuProps:{children:"children",label:"menu_name"},menuCheckAll:!1,menuExpandAll:!1,selection:[],selectIds:"",selectTitle:"选中操作",selectDialog:!1,selectType:"",is_disable:0,userDialog:!1,userDialogTitle:"",userLoad:!1,userData:[],userCount:0,userQuery:{}}},created:function(){this.height=Object(s["a"])(),this.list(),this.menu()},methods:{list:function(){var e=this;this.loading=!0,d(this.query).then((function(t){e.datas=t.data.list,e.count=t.data.count,e.menuExpandAll=!1,e.loading=!1})).catch((function(){e.loading=!1}))},menu:function(){var e=this;u().then((function(t){e.menuData=t.data.list})).catch((function(){}))},add:function(){this.dialogLoad=!0,this.dialog=!0,this.dialogTitle=this.name+"添加",this.reset(),this.dialogLoad=!1},edit:function(e){var t=this;this.dialogLoad=!0,this.dialog=!0,this.dialogTitle=this.name+"修改："+e[this.idkey];var l={};l[this.idkey]=e[this.idkey],m(l).then((function(e){t.reset(e.data),t.dialogLoad=!1})).catch((function(){t.dialogLoad=!1}))},cancel:function(){this.dialog=!1,this.reset()},submit:function(){var e=this;this.$refs["ref"].validate((function(t){t&&(e.loading=!0,e.model[e.idkey]?f(e.model).then((function(t){e.dialog=!1,e.list(),e.reset(),e.$message.success(t.msg)})).catch((function(){e.loading=!1})):h(e.model).then((function(t){e.dialog=!1,e.list(),e.reset(),e.$message.success(t.msg)})).catch((function(){e.loading=!1})))}))},reset:function(e){++this.menuKey,this.menuCheckAll=!1,this.menuExpandAll=!1,this.model=e||this.$options.data().model,void 0!==this.$refs["ref"]&&this.$refs["ref"].resetFields()},search:function(){this.query.page=1,this.list()},refresh:function(){this.query=this.$options.data().query,this.list()},sort:function(e){this.query.sort_field=e.prop,this.query.sort_value="","ascending"===e.order&&(this.query.sort_value="asc",this.list()),"descending"===e.order&&(this.query.sort_value="desc",this.list())},select:function(e){this.selection=e,this.selectIds=this.selectGetIds(e).toString()},selectGetIds:function(e){return Object(o["a"])(e,this.idkey)},selectAlert:function(){this.$alert("请选择需要操作的"+this.name,"提示",{type:"warning",callback:function(e){}})},selectOpen:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";t&&(this.$refs["table"].clearSelection(),this.$refs["table"].toggleRowSelection(t)),this.selection.length?(this.selectTitle="选中操作","disable"===e?this.selectTitle="是否禁用":"dele"===e&&(this.selectTitle="删除"+this.name),this.selectDialog=!0,this.selectType=e):this.selectAlert()},selectCancel:function(){this.selectDialog=!1},selectSubmit:function(){if(this.selection.length){var e=this.selectType;"disable"===e?this.disable(this.selection,!0):"dele"===e&&this.dele(this.selection),this.selectDialog=!1}else this.selectAlert()},disable:function(e){var t=this,l=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(e.length){this.loading=!0;var i=e[0].is_disable;l&&(i=this.is_disable),b({ids:this.selectGetIds(e),is_disable:i}).then((function(e){t.list(),t.$message.success(e.msg)})).catch((function(){t.list(),t.loading=!1}))}else this.selectAlert()},dele:function(e){var t=this;e.length?(this.loading=!0,p({ids:this.selectGetIds(e)}).then((function(e){t.list(),t.$message.success(e.msg)})).catch((function(){t.loading=!1}))):this.selectAlert()},menuCheck:function(){this.menuCheckSetKeys()},menuCheckAllChange:function(){this.menuCheckAll?this.$refs.menuRef.setCheckedNodes(this.menuData):this.$refs.menuRef.setCheckedKeys([]),this.menuCheckSetKeys()},menuCheckSetKeys:function(){this.model.admin_menu_ids=this.$refs.menuRef.getCheckedKeys()},menuExpandAllChange:function(){for(var e=!this.menuExpandAll,t=this.$refs.menuRef.store._getAllNodes().length,l=0;l<t;l++)this.$refs.menuRef.store._getAllNodes()[l].expanded=e},userShow:function(e){this.userDialog=!0,this.userDialogTitle="角色用户："+e.role_name,this.userQuery.admin_role_id=e.admin_role_id,this.user()},user:function(){var e=this;this.userLoad=!0,g(this.userQuery).then((function(t){e.userData=t.data.list,e.userCount=t.data.count,e.userLoad=!1})).catch((function(){e.userLoad=!1}))},userSort:function(e){this.userQuery.sort_field=e.prop,this.userQuery.sort_value="","ascending"===e.order&&(this.userQuery.sort_value="asc",this.user()),"descending"===e.order&&(this.userQuery.sort_value="desc",this.user())},userRemove:function(e){var t=this;this.$confirm('确定要解除该角色与用户 <span style="color:red">'+e.username+" </span>的关联吗？","解除用户："+e.admin_user_id,{type:"warning",dangerouslyUseHTMLString:!0}).then((function(){t.userLoad=!0,_({admin_role_id:t.userQuery.admin_role_id,admin_user_id:e.admin_user_id}).then((function(e){t.user(),t.$message.success(e.msg)})).catch((function(){t.userLoad=!1}))})).catch((function(){}))}}},y=v,k=(l("fbc9"),l("cba8")),w=Object(k["a"])(y,i,a,!1,null,"45d8f891",null);t["default"]=w.exports},ed08:function(e,t,l){"use strict";l.d(t,"b",(function(){return i})),l.d(t,"a",(function(){return a}));l("3fab"),l("aaa2"),l("8c44"),l("3bdf"),l("ed02"),l("a9b6"),l("2690"),l("d4f9"),l("e793"),l("a16b");function i(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:12,t="",l="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",i=0;i<e;i++)t+=l[Math.floor(Math.random()*l.length)];return t}function a(e,t){for(var l=[],i=e.length,a=0;a<i;a++)l.push(e[a][t]);return l}},fbc9:function(e,t,l){"use strict";l("a3cd")}}]);