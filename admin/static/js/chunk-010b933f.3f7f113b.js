(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-010b933f"],{"0532":function(e,t,n){"use strict";n.d(t,"f",(function(){return i})),n.d(t,"e",(function(){return a})),n.d(t,"a",(function(){return c})),n.d(t,"d",(function(){return l})),n.d(t,"b",(function(){return u})),n.d(t,"c",(function(){return s}));var o=n("b775"),r="/admin/file.Group/";function i(e){return Object(o["a"])({url:r+"list",method:"get",params:e})}function a(e){return Object(o["a"])({url:r+"info",method:"get",params:e})}function c(e){return Object(o["a"])({url:r+"add",method:"post",data:e})}function l(e){return Object(o["a"])({url:r+"edit",method:"post",data:e})}function u(e){return Object(o["a"])({url:r+"dele",method:"post",data:e})}function s(e){return Object(o["a"])({url:r+"disable",method:"post",data:e})}},"09f4":function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),Math.easeInOutQuad=function(e,t,n,o){return e/=o/2,e<1?n/2*e*e+t:(e--,-n/2*(e*(e-2)-1)+t)};var o=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();function r(e){document.documentElement.scrollTop=e,document.body.parentNode.scrollTop=e,document.body.scrollTop=e}function i(){return document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop}function a(e,t,n){var a=i(),c=e-a,l=20,u=0;t="undefined"===typeof t?500:t;var s=function e(){u+=l;var i=Math.easeInOutQuad(u,a,c,t);r(i),u<t?o(e):n&&"function"===typeof n&&n()};s()}},4381:function(e,t,n){"use strict";n("89a8"),n("2788"),n("aa08"),n("8fec");var o=n("4360");function r(e,t){var n=t.value,r=o["a"].getters&&o["a"].getters.roles;if(!(n&&n instanceof Array))throw new Error("need roles! Like v-permission=\"['admin','editor']\"");if(n.length>0){var i=n,a=r.some((function(e){return i.includes(e)}));a||e.parentNode&&e.parentNode.removeChild(e)}}var i={inserted:function(e,t){r(e,t)},update:function(e,t){r(e,t)}},a=function(e){e.directive("permission",i)};window.Vue&&(window["permission"]=i,Vue.use(a)),i.install=a;t["a"]=i},"98b1":function(e,t,n){"use strict";function o(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:260,t=880,n=document.documentElement.clientHeight||document.body.clientHeight;return n?n-e:t-e}n.d(t,"a",(function(){return o}))},dbe5:function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("el-tabs",[e.checkPermission(["admin/setting.Wechat/offiInfo"])?n("el-tab-pane",{attrs:{label:"公众号",lazy:""}},[n("wechat-offi")],1):e._e(),e.checkPermission(["admin/setting.Wechat/miniInfo"])?n("el-tab-pane",{attrs:{label:"小程序",lazy:""}},[n("wechat-mini")],1):e._e()],1)],1)},r=[],i=n("e350"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("el-card",{staticClass:"box-card"},[n("el-row",{staticClass:"dialog-body",style:{height:e.height+"px"}},[n("el-col",{attrs:{xs:24,sm:18,md:12}},[n("el-form",{ref:"ref",attrs:{model:e.model,rules:e.rules,"label-width":"130px"}},[n("el-form-item",{attrs:{label:"名称",prop:"name"}},[n("el-input",{model:{value:e.model.name,callback:function(t){e.$set(e.model,"name",t)},expression:"model.name"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.name,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"原始ID",prop:"origin_id"}},[n("el-input",{model:{value:e.model.origin_id,callback:function(t){e.$set(e.model,"origin_id",t)},expression:"model.origin_id"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.origin_id,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"二维码",prop:"qrcode_url"}},[n("el-col",{attrs:{span:10}},[n("el-image",{staticClass:"ya-img-form",attrs:{src:e.model.qrcode_url,"preview-src-list":[e.model.qrcode_url],title:"点击查看大图"}},[n("div",{staticClass:"image-slot",attrs:{slot:"error"},slot:"error"},[n("i",{staticClass:"el-icon-picture-outline"})])])],1),n("el-col",{attrs:{span:14}},[n("el-button",{attrs:{size:"mini"},on:{click:function(t){return e.fileUpload()}}},[e._v("上传二维码")]),n("el-button",{attrs:{size:"mini"},on:{click:function(t){return e.fileDelete()}}},[e._v("删除")]),n("p",[e._v("jpg、png图片，小于200kb，宽高1:1")])],1)],1),n("el-form-item",{attrs:{label:"AppID",prop:"appid"}},[n("el-input",{model:{value:e.model.appid,callback:function(t){e.$set(e.model,"appid",t)},expression:"model.appid"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.appid,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"AppSecret",prop:"appsecret"}},[n("el-input",{model:{value:e.model.appsecret,callback:function(t){e.$set(e.model,"appsecret",t)},expression:"model.appsecret"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.appsecret,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"服务器地址(URL)",prop:"server_url"}},[n("el-input",{model:{value:e.model.server_url,callback:function(t){e.$set(e.model,"server_url",t)},expression:"model.server_url"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.server_url,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"令牌(Token)",prop:"token"}},[n("el-input",{model:{value:e.model.token,callback:function(t){e.$set(e.model,"token",t)},expression:"model.token"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.token,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"消息加解密密钥",prop:"encoding_aes_key"}},[n("el-input",{model:{value:e.model.encoding_aes_key,callback:function(t){e.$set(e.model,"encoding_aes_key",t)},expression:"model.encoding_aes_key"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.encoding_aes_key,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"消息加解密方式",prop:"encoding_aes_type"}},[n("el-radio-group",{model:{value:e.model.encoding_aes_type,callback:function(t){e.$set(e.model,"encoding_aes_type",t)},expression:"model.encoding_aes_type"}},e._l(e.encoding_aes_types,(function(t){return n("el-radio",{key:t.value,attrs:{label:t.value}},[e._v(e._s(t.label))])})),1)],1),n("el-form-item",[n("el-button",{attrs:{loading:e.loading},on:{click:function(t){return e.refresh()}}},[e._v("刷新")]),n("el-button",{attrs:{loading:e.loading,type:"primary"},on:{click:function(t){return e.submit()}}},[e._v("提交")])],1)],1)],1)],1)],1),n("el-dialog",{attrs:{title:"上传二维码",visible:e.fileDialog,width:"80%",top:"1vh","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.fileDialog=t}}},[n("file-manage",{attrs:{"file-type":"image"},on:{fileCancel:e.fileCancel,fileSubmit:e.fileSubmit}})],1)],1)},c=[],l=n("98b1"),u=n("f71e"),s=n("36598"),d=n("b775"),f="/admin/setting.Wechat/";function p(e){return Object(d["a"])({url:f+"offiInfo",method:"get",params:e})}function m(e){return Object(d["a"])({url:f+"offiEdit",method:"post",data:e})}function h(e){return Object(d["a"])({url:f+"miniInfo",method:"get",params:e})}function g(e){return Object(d["a"])({url:f+"miniEdit",method:"post",data:e})}var b={name:"SettingWechatOffi",components:{FileManage:s["a"]},data:function(){return{name:"微信公众号",height:680,loading:!1,model:{name:"",origin_id:"",qrcode_id:0,qrcode_url:"",appid:"",appsecret:"",server_url:"",token:"",encoding_aes_key:"",encoding_aes_type:1},rules:{appid:[{required:!0,message:"请输入appid",trigger:"blur"}],appsecret:[{required:!0,message:"请输入appsecret",trigger:"blur"}]},encoding_aes_types:[{value:1,label:"明文模式"},{value:2,label:"兼容模式"},{value:3,label:"安全模式"}],fileDialog:!1}},created:function(){this.height=Object(l["a"])(210),this.info()},methods:{info:function(){var e=this;p().then((function(t){e.model=t.data}))},refresh:function(){var e=this;this.loading=!0,p().then((function(t){e.model=t.data,e.loading=!1,e.$message.success(t.msg)})).catch((function(){e.loading=!1}))},submit:function(){var e=this;this.$refs["ref"].validate((function(t){t&&(e.loading=!0,m(e.model).then((function(t){e.loading=!1,e.$message.success(t.msg)})).catch((function(){e.loading=!1})))}))},fileUpload:function(){this.fileDialog=!0},fileCancel:function(){this.fileDialog=!1},fileSubmit:function(e){this.fileDialog=!1,e&&(this.model.qrcode_id=e[0]["file_id"],this.model.qrcode_url=e[0]["file_url"])},fileDelete:function(){this.model.qrcode_id=0,this.model.qrcode_url=""},copy:function(e,t){e?Object(u["a"])(e,t):this.$message.error("内容为空")}}},y=b,v=n("cba8"),_=Object(v["a"])(y,a,c,!1,null,"10a4f52a",null),k=_.exports,w=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("el-card",{staticClass:"box-card"},[n("el-row",{staticClass:"dialog-body",style:{height:e.height+"px"}},[n("el-col",{attrs:{xs:24,sm:18,md:12}},[n("el-form",{ref:"ref",attrs:{model:e.model,rules:e.rules,"label-width":"130px"}},[n("el-form-item",{attrs:{label:"名称",prop:"name"}},[n("el-input",{model:{value:e.model.name,callback:function(t){e.$set(e.model,"name",t)},expression:"model.name"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.name,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"原始ID",prop:"origin_id"}},[n("el-input",{model:{value:e.model.origin_id,callback:function(t){e.$set(e.model,"origin_id",t)},expression:"model.origin_id"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.origin_id,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"二维码",prop:"qrcode_url"}},[n("el-col",{attrs:{span:10}},[n("el-image",{staticClass:"ya-img-form",attrs:{src:e.model.qrcode_url,"preview-src-list":[e.model.qrcode_url],title:"点击查看大图"}},[n("div",{staticClass:"image-slot",attrs:{slot:"error"},slot:"error"},[n("i",{staticClass:"el-icon-picture-outline"})])])],1),n("el-col",{attrs:{span:14}},[n("el-button",{attrs:{size:"mini"},on:{click:function(t){return e.fileUpload()}}},[e._v("上传二维码")]),n("el-button",{attrs:{size:"mini"},on:{click:function(t){return e.fileDelete()}}},[e._v("删除")]),n("p",[e._v("jpg、png图片，小于200kb，宽高1:1")])],1)],1),n("el-form-item",{attrs:{label:"AppID",prop:"appid"}},[n("el-input",{model:{value:e.model.appid,callback:function(t){e.$set(e.model,"appid",t)},expression:"model.appid"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.appid,t)}},slot:"append"})],1)],1),n("el-form-item",{attrs:{label:"AppSecret",prop:"appsecret"}},[n("el-input",{model:{value:e.model.appsecret,callback:function(t){e.$set(e.model,"appsecret",t)},expression:"model.appsecret"}},[n("el-button",{attrs:{slot:"append",icon:"el-icon-document-copy"},on:{click:function(t){return e.copy(e.model.appsecret,t)}},slot:"append"})],1)],1),n("el-form-item",[n("el-button",{attrs:{loading:e.loading},on:{click:function(t){return e.refresh()}}},[e._v("刷新")]),n("el-button",{attrs:{loading:e.loading,type:"primary"},on:{click:function(t){return e.submit()}}},[e._v("提交")])],1)],1)],1)],1)],1),n("el-dialog",{attrs:{title:"上传二维码",visible:e.fileDialog,width:"80%",top:"1vh","close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.fileDialog=t}}},[n("file-manage",{attrs:{"file-type":"image"},on:{fileCancel:e.fileCancel,fileSubmit:e.fileSubmit}})],1)],1)},x=[],O={name:"SettingWechatMini",components:{FileManage:s["a"]},data:function(){return{name:"微信小程序",height:680,loading:!1,model:{name:"",origin_id:"",qrcode_id:0,qrcode_url:"",appid:"",appsecret:""},rules:{appid:[{required:!0,message:"请输入appid",trigger:"blur"}],appsecret:[{required:!0,message:"请输入appsecret",trigger:"blur"}]},fileDialog:!1}},created:function(){this.height=Object(l["a"])(210),this.info()},methods:{info:function(){var e=this;h().then((function(t){e.model=t.data}))},refresh:function(){var e=this;this.loading=!0,h().then((function(t){e.model=t.data,e.loading=!1,e.$message.success(t.msg)})).catch((function(){e.loading=!1}))},submit:function(){var e=this;this.$refs["ref"].validate((function(t){t&&(e.loading=!0,g(e.model).then((function(t){e.loading=!1,e.$message.success(t.msg)})).catch((function(){e.loading=!1})))}))},fileUpload:function(){this.fileDialog=!0},fileCancel:function(){this.fileDialog=!1},fileSubmit:function(e){this.fileDialog=!1,this.model.qrcode_id=e[0]["file_id"],this.model.qrcode_url=e[0]["file_url"]},fileDelete:function(){this.model.qrcode_id=0,this.model.qrcode_url=""},copy:function(e,t){e?Object(u["a"])(e,t):this.$message.error("内容为空")}}},j=O,S=Object(v["a"])(j,w,x,!1,null,"6850b588",null),E=S.exports,T={name:"SettingWechat",components:{WechatOffi:k,WechatMini:E},data:function(){return{name:"微信设置"}},created:function(){},methods:{checkPermission:i["a"]}},C=T,q=Object(v["a"])(C,o,r,!1,null,null,null);t["default"]=q.exports},e08b:function(e,t,n){"use strict";n.d(t,"h",(function(){return i})),n.d(t,"j",(function(){return a})),n.d(t,"i",(function(){return c})),n.d(t,"a",(function(){return l})),n.d(t,"d",(function(){return u})),n.d(t,"b",(function(){return s})),n.d(t,"f",(function(){return d})),n.d(t,"g",(function(){return f})),n.d(t,"e",(function(){return p})),n.d(t,"c",(function(){return m})),n.d(t,"k",(function(){return h})),n.d(t,"m",(function(){return g})),n.d(t,"l",(function(){return b}));var o=n("b775"),r="/admin/file.File/";function i(e){return Object(o["a"])({url:r+"group",method:"get",params:e})}function a(e){return Object(o["a"])({url:r+"list",method:"get",params:e})}function c(e){return Object(o["a"])({url:r+"info",method:"get",params:e})}function l(){return r+"add"}function u(e){return Object(o["a"])({url:r+"edit",method:"post",data:e})}function s(e){return Object(o["a"])({url:r+"dele",method:"post",data:e})}function d(e){return Object(o["a"])({url:r+"editgroup",method:"post",data:e})}function f(e){return Object(o["a"])({url:r+"edittype",method:"post",data:e})}function p(e){return Object(o["a"])({url:r+"editdomain",method:"post",data:e})}function m(e){return Object(o["a"])({url:r+"disable",method:"post",data:e})}function h(e){return Object(o["a"])({url:r+"recover",method:"get",params:e})}function g(e){return Object(o["a"])({url:r+"recoverReco",method:"post",data:e})}function b(e){return Object(o["a"])({url:r+"recoverDele",method:"post",data:e})}},ed08:function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"a",(function(){return r}));n("4c1e"),n("a5db"),n("87bf"),n("cea3"),n("6370"),n("d5ee"),n("d1ba"),n("89a8"),n("b110"),n("fe35"),n("7216"),n("609b");function o(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:12,t="",n="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",o=0;o<e;o++)t+=n[Math.floor(Math.random()*n.length)];return t}function r(e,t){for(var n=[],o=e.length,r=0;r<o;r++)n.push(e[r][t]);return n}},f71e:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var o=n("430a"),r=n("f962"),i=n.n(r);function a(){o["default"].prototype.$message({message:"复制成功",type:"success",duration:1500})}function c(){o["default"].prototype.$message({message:"复制失败",type:"error"})}function l(e,t){var n=new i.a(t.target,{text:function(){return e}});n.on("success",(function(){a(),n.destroy()})),n.on("error",(function(){c(),n.destroy()})),n.onClick(t)}},f962:function(e,t,n){
/*!
 * clipboard.js v2.0.10
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */
(function(t,n){e.exports=n()})(0,(function(){return function(){var e={686:function(e,t,n){"use strict";n.d(t,{default:function(){return A}});var o=n(279),r=n.n(o),i=n(370),a=n.n(i),c=n(817),l=n.n(c);function u(e){try{return document.execCommand(e)}catch(t){return!1}}var s=function(e){var t=l()(e);return u("cut"),t},d=s;function f(e){var t="rtl"===document.documentElement.getAttribute("dir"),n=document.createElement("textarea");n.style.fontSize="12pt",n.style.border="0",n.style.padding="0",n.style.margin="0",n.style.position="absolute",n.style[t?"right":"left"]="-9999px";var o=window.pageYOffset||document.documentElement.scrollTop;return n.style.top="".concat(o,"px"),n.setAttribute("readonly",""),n.value=e,n}var p=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body},n="";if("string"===typeof e){var o=f(e);t.container.appendChild(o),n=l()(o),u("copy"),o.remove()}else n=l()(e),u("copy");return n},m=p;function h(e){return h="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},h(e)}var g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.action,n=void 0===t?"copy":t,o=e.container,r=e.target,i=e.text;if("copy"!==n&&"cut"!==n)throw new Error('Invalid "action" value, use either "copy" or "cut"');if(void 0!==r){if(!r||"object"!==h(r)||1!==r.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===n&&r.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===n&&(r.hasAttribute("readonly")||r.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes')}return i?m(i,{container:o}):r?"cut"===n?d(r):m(r,{container:o}):void 0},b=g;function y(e){return y="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},y(e)}function v(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function k(e,t,n){return t&&_(e.prototype,t),n&&_(e,n),e}function w(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&x(e,t)}function x(e,t){return x=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},x(e,t)}function O(e){var t=E();return function(){var n,o=T(e);if(t){var r=T(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return j(this,n)}}function j(e,t){return!t||"object"!==y(t)&&"function"!==typeof t?S(e):t}function S(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function E(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function T(e){return T=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},T(e)}function C(e,t){var n="data-clipboard-".concat(e);if(t.hasAttribute(n))return t.getAttribute(n)}var q=function(e){w(n,e);var t=O(n);function n(e,o){var r;return v(this,n),r=t.call(this),r.resolveOptions(o),r.listenClick(e),r}return k(n,[{key:"resolveOptions",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"===typeof e.action?e.action:this.defaultAction,this.target="function"===typeof e.target?e.target:this.defaultTarget,this.text="function"===typeof e.text?e.text:this.defaultText,this.container="object"===y(e.container)?e.container:document.body}},{key:"listenClick",value:function(e){var t=this;this.listener=a()(e,"click",(function(e){return t.onClick(e)}))}},{key:"onClick",value:function(e){var t=e.delegateTarget||e.currentTarget,n=this.action(t)||"copy",o=b({action:n,container:this.container,target:this.target(t),text:this.text(t)});this.emit(o?"success":"error",{action:n,text:o,trigger:t,clearSelection:function(){t&&t.focus(),document.activeElement.blur(),window.getSelection().removeAllRanges()}})}},{key:"defaultAction",value:function(e){return C("action",e)}},{key:"defaultTarget",value:function(e){var t=C("target",e);if(t)return document.querySelector(t)}},{key:"defaultText",value:function(e){return C("text",e)}},{key:"destroy",value:function(){this.listener.destroy()}}],[{key:"copy",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body};return m(e,t)}},{key:"cut",value:function(e){return d(e)}},{key:"isSupported",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],t="string"===typeof e?[e]:e,n=!!document.queryCommandSupported;return t.forEach((function(e){n=n&&!!document.queryCommandSupported(e)})),n}}]),n}(r()),A=q},828:function(e){var t=9;if("undefined"!==typeof Element&&!Element.prototype.matches){var n=Element.prototype;n.matches=n.matchesSelector||n.mozMatchesSelector||n.msMatchesSelector||n.oMatchesSelector||n.webkitMatchesSelector}function o(e,n){while(e&&e.nodeType!==t){if("function"===typeof e.matches&&e.matches(n))return e;e=e.parentNode}}e.exports=o},438:function(e,t,n){var o=n(828);function r(e,t,n,o,r){var i=a.apply(this,arguments);return e.addEventListener(n,i,r),{destroy:function(){e.removeEventListener(n,i,r)}}}function i(e,t,n,o,i){return"function"===typeof e.addEventListener?r.apply(null,arguments):"function"===typeof n?r.bind(null,document).apply(null,arguments):("string"===typeof e&&(e=document.querySelectorAll(e)),Array.prototype.map.call(e,(function(e){return r(e,t,n,o,i)})))}function a(e,t,n,r){return function(n){n.delegateTarget=o(n.target,t),n.delegateTarget&&r.call(e,n)}}e.exports=i},879:function(e,t){t.node=function(e){return void 0!==e&&e instanceof HTMLElement&&1===e.nodeType},t.nodeList=function(e){var n=Object.prototype.toString.call(e);return void 0!==e&&("[object NodeList]"===n||"[object HTMLCollection]"===n)&&"length"in e&&(0===e.length||t.node(e[0]))},t.string=function(e){return"string"===typeof e||e instanceof String},t.fn=function(e){var t=Object.prototype.toString.call(e);return"[object Function]"===t}},370:function(e,t,n){var o=n(879),r=n(438);function i(e,t,n){if(!e&&!t&&!n)throw new Error("Missing required arguments");if(!o.string(t))throw new TypeError("Second argument must be a String");if(!o.fn(n))throw new TypeError("Third argument must be a Function");if(o.node(e))return a(e,t,n);if(o.nodeList(e))return c(e,t,n);if(o.string(e))return l(e,t,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function a(e,t,n){return e.addEventListener(t,n),{destroy:function(){e.removeEventListener(t,n)}}}function c(e,t,n){return Array.prototype.forEach.call(e,(function(e){e.addEventListener(t,n)})),{destroy:function(){Array.prototype.forEach.call(e,(function(e){e.removeEventListener(t,n)}))}}}function l(e,t,n){return r(document.body,e,t,n)}e.exports=i},817:function(e){function t(e){var t;if("SELECT"===e.nodeName)e.focus(),t=e.value;else if("INPUT"===e.nodeName||"TEXTAREA"===e.nodeName){var n=e.hasAttribute("readonly");n||e.setAttribute("readonly",""),e.select(),e.setSelectionRange(0,e.value.length),n||e.removeAttribute("readonly"),t=e.value}else{e.hasAttribute("contenteditable")&&e.focus();var o=window.getSelection(),r=document.createRange();r.selectNodeContents(e),o.removeAllRanges(),o.addRange(r),t=o.toString()}return t}e.exports=t},279:function(e){function t(){}t.prototype={on:function(e,t,n){var o=this.e||(this.e={});return(o[e]||(o[e]=[])).push({fn:t,ctx:n}),this},once:function(e,t,n){var o=this;function r(){o.off(e,r),t.apply(n,arguments)}return r._=t,this.on(e,r,n)},emit:function(e){var t=[].slice.call(arguments,1),n=((this.e||(this.e={}))[e]||[]).slice(),o=0,r=n.length;for(o;o<r;o++)n[o].fn.apply(n[o].ctx,t);return this},off:function(e,t){var n=this.e||(this.e={}),o=n[e],r=[];if(o&&t)for(var i=0,a=o.length;i<a;i++)o[i].fn!==t&&o[i].fn._!==t&&r.push(o[i]);return r.length?n[e]=r:delete n[e],this}},e.exports=t,e.exports.TinyEmitter=t}},t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={exports:{}};return e[o](r,r.exports,n),r.exports}return function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),n(686)}().default}))}}]);