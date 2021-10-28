(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c4475f82"],{"0b4d":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container"},[n("el-tabs",[t.checkPermission(["admin/admin.Setting/cacheInfo"])?n("el-tab-pane",{attrs:{label:"缓存设置",lazy:""}},[n("cache")],1):t._e(),t.checkPermission(["admin/admin.Setting/tokenInfo"])?n("el-tab-pane",{attrs:{label:"Token设置",lazy:""}},[n("token")],1):t._e(),t.checkPermission(["admin/admin.Setting/captchaInfo"])?n("el-tab-pane",{attrs:{label:"验证码设置",lazy:""}},[n("captcha")],1):t._e(),t.checkPermission(["admin/admin.Setting/logInfo"])?n("el-tab-pane",{attrs:{label:"日志设置",lazy:""}},[n("log")],1):t._e(),t.checkPermission(["admin/admin.Setting/apiInfo"])?n("el-tab-pane",{attrs:{label:"接口设置",lazy:""}},[n("api")],1):t._e()],1)],1)},o=[],i=n("e350"),l=n("4381"),s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-card",{staticClass:"box-card"},[n("el-row",{attrs:{gutter:0}},[n("el-col",{attrs:{xs:24,sm:12}},[n("el-form",{ref:"ref",attrs:{model:t.model,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"",prop:""}},[n("span",[t._v("手动清除所有缓存（后台登录状态不会清除）。")])]),n("el-form-item",{attrs:{label:"缓存类型",prop:"type"}},[n("el-input",{model:{value:t.model.type,callback:function(e){t.$set(t.model,"type",e)},expression:"model.type"}})],1),n("el-form-item",{attrs:{label:""}},[n("el-button",{attrs:{loading:t.loading},on:{click:function(e){return t.refresh()}}},[t._v("刷新")]),n("el-button",{attrs:{loading:t.loading,type:"primary",title:"清除缓存"},on:{click:function(e){return t.submit()}}},[t._v("清除")])],1)],1)],1)],1)],1)},r=[],c=n("5a2e"),u={name:"AdminSettingCache",components:{},data:function(){return{loading:!1,model:{type:""},rules:{}}},created:function(){this.info()},methods:{info:function(){var t=this;Object(c["d"])().then((function(e){t.model=e.data}))},refresh:function(){var t=this;this.loading=!0,Object(c["d"])().then((function(e){t.model=e.data,t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1}))},submit:function(){var t=this;this.$refs["ref"].validate((function(e){e&&(t.loading=!0,Object(c["c"])().then((function(e){t.info(),t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1})))}))}}},m=u,d=n("cba8"),f=Object(d["a"])(m,s,r,!1,null,null,null),p=f.exports,h=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-card",{staticClass:"box-card"},[n("el-row",{attrs:{gutter:0}},[n("el-col",{attrs:{xs:24,sm:12}},[n("el-form",{ref:"ref",attrs:{model:t.model,rules:t.rules,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"Token名称",prop:"token_name"}},[n("el-input",{staticStyle:{width:"90%"},attrs:{type:"text"},model:{value:t.model.token_name,callback:function(e){t.$set(t.model,"token_name",e)},expression:"model.token_name"}}),n("i",{staticClass:"el-icon-warning-outline",attrs:{title:"必须与前端设置一致，否则Token验证失败。"}})],1),n("el-form-item",{attrs:{label:"Token密钥",prop:"token_key"}},[n("el-input",{staticStyle:{width:"90%"},attrs:{type:"text"},model:{value:t.model.token_key,callback:function(e){t.$set(t.model,"token_key",e)},expression:"model.token_key"}}),n("i",{staticClass:"el-icon-warning-outline",attrs:{title:"修改后所有用户登录状态失效，需重新登录。"}})],1),n("el-form-item",{attrs:{label:"Token有效时间",prop:"token_exp"}},[n("el-input",{attrs:{type:"number"},model:{value:t.model.token_exp,callback:function(e){t.$set(t.model,"token_exp",e)},expression:"model.token_exp"}},[n("template",{slot:"append"},[t._v("小时")])],2)],1),n("el-form-item",[n("el-button",{attrs:{loading:t.loading},on:{click:function(e){return t.refresh()}}},[t._v("刷新")]),n("el-button",{attrs:{loading:t.loading,type:"primary"},on:{click:function(e){return t.submit()}}},[t._v("提交")])],1)],1)],1)],1)],1)},g=[],b={name:"AdminSettingToken",components:{},data:function(){return{loading:!1,model:{token_name:"",token_key:"",token_exp:12},rules:{}}},created:function(){this.info()},methods:{info:function(){var t=this;Object(c["j"])().then((function(e){t.model=e.data}))},refresh:function(){var t=this;this.loading=!0,Object(c["j"])().then((function(e){t.model=e.data,t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1}))},submit:function(){var t=this;this.$refs["ref"].validate((function(e){e&&(t.loading=!0,Object(c["i"])(t.model).then((function(e){t.info(),t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1})))}))}}},_=b,v=Object(d["a"])(_,h,g,!1,null,null,null),k=v.exports,w=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-card",{staticClass:"box-card"},[n("el-row",{attrs:{gutter:0}},[n("el-col",{attrs:{xs:24,sm:12}},[n("el-form",{ref:"ref",attrs:{model:t.model,rules:t.rules,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"",prop:""}},[n("span",[t._v("开启后，后台登录需要输入验证码。")])]),n("el-form-item",{attrs:{label:"验证码",prop:"captcha_switch"}},[n("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:t.model.captcha_switch,callback:function(e){t.$set(t.model,"captcha_switch",e)},expression:"model.captcha_switch"}})],1),n("el-form-item",[n("el-button",{attrs:{loading:t.loading},on:{click:function(e){return t.refresh()}}},[t._v("刷新")]),n("el-button",{attrs:{loading:t.loading,type:"primary"},on:{click:function(e){return t.submit()}}},[t._v("提交")])],1)],1)],1)],1)],1)},x=[],y={name:"AdminSettingCaptcha",components:{},data:function(){return{loading:!1,model:{captcha_switch:0},rules:{}}},created:function(){this.info()},methods:{info:function(){var t=this;Object(c["f"])().then((function(e){t.model=e.data}))},refresh:function(){var t=this;this.loading=!0,Object(c["f"])().then((function(e){t.model=e.data,t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1}))},submit:function(){var t=this;this.$refs["ref"].validate((function(e){e&&(t.loading=!0,Object(c["e"])(t.model).then((function(e){t.info(),t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1})))}))}}},$=y,j=Object(d["a"])($,w,x,!1,null,null,null),O=j.exports,S=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-card",{staticClass:"box-card"},[n("el-row",{attrs:{gutter:0}},[n("el-col",{attrs:{xs:24,sm:12}},[n("el-form",{ref:"ref",attrs:{model:t.model,rules:t.rules,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"",prop:""}},[n("span",[t._v("开启后，会记录后台用户日志。")])]),n("el-form-item",{attrs:{label:"日志记录",prop:"log_switch"}},[n("el-switch",{attrs:{"active-value":1,"inactive-value":0},model:{value:t.model.log_switch,callback:function(e){t.$set(t.model,"log_switch",e)},expression:"model.log_switch"}})],1),n("el-form-item",[n("el-button",{attrs:{loading:t.loading},on:{click:function(e){return t.refresh()}}},[t._v("刷新")]),n("el-button",{attrs:{loading:t.loading,type:"primary"},on:{click:function(e){return t.submit()}}},[t._v("提交")])],1)],1)],1)],1)],1)},C=[],A={name:"AdminSettingLog",components:{},data:function(){return{loading:!1,model:{log_switch:0},rules:{}}},created:function(){this.info()},methods:{info:function(){var t=this;Object(c["h"])().then((function(e){t.model=e.data}))},refresh:function(){var t=this;this.loading=!0,Object(c["h"])().then((function(e){t.model=e.data,t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1}))},submit:function(){var t=this;this.$refs["ref"].validate((function(e){e&&(t.loading=!0,Object(c["g"])(t.model).then((function(e){t.info(),t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1})))}))}}},E=A,T=Object(d["a"])(E,S,C,!1,null,null,null),P=T.exports,z=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-card",{staticClass:"box-card"},[n("el-row",{attrs:{gutter:0}},[n("el-col",{attrs:{xs:24,sm:12}},[n("el-form",{ref:"ref",attrs:{model:t.model,rules:t.rules,"label-width":"120px"}},[n("el-form-item",{attrs:{label:"",prop:""}},[n("span",[t._v("次数/时间；3/1：3次1秒；次数设置为 0 则不限制。")])]),n("el-form-item",{attrs:{label:"接口速率"}},[n("el-col",{attrs:{span:11}},[n("el-input",{attrs:{type:"number",placeholder:"次数"},model:{value:t.model.api_rate_num,callback:function(e){t.$set(t.model,"api_rate_num",e)},expression:"model.api_rate_num"}},[n("template",{slot:"append"},[t._v("次")])],2)],1),n("el-col",{staticClass:"line",staticStyle:{"text-align":"center"},attrs:{span:2}},[t._v("/")]),n("el-col",{attrs:{span:11}},[n("el-input",{attrs:{type:"number",placeholder:"时间"},model:{value:t.model.api_rate_time,callback:function(e){t.$set(t.model,"api_rate_time",e)},expression:"model.api_rate_time"}},[n("template",{slot:"append"},[t._v("秒")])],2)],1)],1),n("el-form-item",[n("el-button",{attrs:{loading:t.loading},on:{click:function(e){return t.refresh()}}},[t._v("刷新")]),n("el-button",{attrs:{loading:t.loading,type:"primary"},on:{click:function(e){return t.submit()}}},[t._v("提交")])],1)],1)],1)],1)],1)},I=[],L={name:"AdminSettingApi",components:{},data:function(){return{loading:!1,model:{api_rate_num:3,api_rate_time:1},rules:{}}},created:function(){this.info()},methods:{info:function(){var t=this;Object(c["b"])().then((function(e){t.model=e.data}))},refresh:function(){var t=this;this.loading=!0,Object(c["b"])().then((function(e){t.model=e.data,t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1}))},submit:function(){var t=this;this.$refs["ref"].validate((function(e){e&&(t.loading=!0,Object(c["a"])(t.model).then((function(e){t.info(),t.loading=!1,t.$message.success(e.msg)})).catch((function(){t.loading=!1})))}))}}},J=L,N=Object(d["a"])(J,z,I,!1,null,null,null),V=N.exports,q={name:"AdminSystemSetting",directives:{permission:l["a"]},components:{Cache:p,Token:k,Captcha:O,Log:P,Api:V},data:function(){return{}},created:function(){},methods:{checkPermission:i["a"]}},B=q,D=Object(d["a"])(B,a,o,!1,null,null,null);e["default"]=D.exports},4381:function(t,e,n){"use strict";n("a095"),n("6fc0");var a=n("4360");function o(t,e){var n=e.value,o=a["a"].getters&&a["a"].getters.roles;if(!(n&&n instanceof Array))throw new Error("need roles! Like v-permission=\"['admin','editor']\"");if(n.length>0){var i=n,l=o.some((function(t){return i.includes(t)}));l||t.parentNode&&t.parentNode.removeChild(t)}}var i={inserted:function(t,e){o(t,e)},update:function(t,e){o(t,e)}},l=function(t){t.directive("permission",i)};window.Vue&&(window["permission"]=i,Vue.use(l)),i.install=l;e["a"]=i}}]);