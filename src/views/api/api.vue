<template>
  <div class="app-container">
    <!-- 接口添加 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="24" style="text-align:right;">
          <el-button class="filter-item" @click="apiRefresh()">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="apiAddition()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 接口列表 -->
    <el-table v-loading="loading" :data="apiData" :height="height+80" style="width: 100%" row-key="api_id" border>
      <el-table-column prop="api_name" label="接口名称" min-width="200" fixed="left" />
      <el-table-column prop="api_url" label="接口链接" min-width="260" show-overflow-tooltip />
      <el-table-column prop="api_sort" label="接口排序" min-width="90" />
      <el-table-column prop="api_id" label="接口ID" min-width="80" />
      <el-table-column prop="api_pid" label="接口PID" min-width="80" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" />
      <el-table-column prop="is_disable" label="是否禁用" min-width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="apiIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unauth" label="无需权限" min-width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.api_url" v-model="scope.row.is_unauth" :active-value="1" :inactive-value="0" @change="apiIsUnauth(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="280" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button v-permission="['admin/Api/apiDoc']" size="mini" type="primary" @click="apiDoc(row)">文档</el-button>
          <el-button size="mini" type="primary" @click="apiAddition(row)">添加</el-button>
          <el-button size="mini" type="success" @click="apiModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="apiDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 接口添加、修改 -->
    <el-dialog :title="apiDialogTitle" :visible.sync="apiDialog" width="65%" top="1vh" :before-close="apiCancel" @opened="DialogOpened()" @closed="DialogClosed()">
      <el-form ref="apiRef" :rules="apiRules" :model="apiModel" class="dialog-body" label-width="100px" :style="{height:height+50+'px'}">
        <el-form-item label="接口父级" prop="api_pid">
          <el-cascader
            v-model="apiModel.api_pid"
            :options="apiData"
            :props="apiProps"
            style="width:100%"
            clearable
            filterable
            placeholder="一级接口"
            @change="apiPidChange"
          />
        </el-form-item>
        <el-form-item label="接口名称" prop="api_name">
          <el-input v-model="apiModel.api_name" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item label="请求方式" prop="api_method">
          <el-col :span="10">
            <el-select v-model="apiModel.api_method" placeholder="请选择请求方式">
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
              <el-option label="PUT" value="PUT" />
              <el-option label="DELETE" value="DELETE" />
            </el-select>
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">接口排序</el-col>
          <el-col :span="10">
            <el-input v-model="apiModel.api_sort" type="number" placeholder="200" />
          </el-col>
        </el-form-item>
        <el-form-item label="接口链接" prop="api_url">
          <el-input v-model="apiModel.api_url" />
        </el-form-item>
        <el-form-item label="请求参数" prop="api_request">
          <div id="api_request" />
        </el-form-item>
        <el-form-item label="返回参数" prop="api_response">
          <div id="api_response" />
        </el-form-item>
        <el-form-item label="接口说明" prop="api_explain">
          <el-input v-model="apiModel.api_explain" type="textarea" placeholder="接口额外说明" />
        </el-form-item>
        <el-form-item v-if="apiModel.api_id" label="添加时间" prop="create_time">
          <el-col :span="10">
            <el-input v-model="apiModel.create_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">修改时间</el-col>
          <el-col :span="10">
            <el-input v-model="apiModel.update_time" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="apiModel.api_footer" slot="footer" class="dialog-footer">
        <el-button @click="apiCancel">取消</el-button>
        <el-button type="primary" @click="apiSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getAdminToken, getAdminUserId } from '@/utils/auth'
import { apiList, apiDoc, apiAdd, apiEdit, apiDele, apiDisable, apiUnauth } from '@/api/api'
import E from 'wangeditor'

export default {
  name: 'Api',
  components: { },
  directives: { permission },
  data() {
    return {
      height: 680,
      loading: false,
      apiData: [],
      apiDialog: false,
      apiDialogTitle: '',
      apiProps: {
        checkStrictly: true,
        value: 'api_id',
        label: 'api_name'
      },
      apiModel: {
        api_id: '',
        api_pid: 0,
        api_name: '',
        api_method: 'POST',
        api_url: '',
        api_request: '<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"text-align:center;\"><tbody><tr><th>参数</th><th>类型</th><th>属性</th><th>说明</th><th>示例</th></tr><tr><td>field_name</td><td>string</td><td>选填</td><td>请求参数示例字段</td><td>示例值</td></tr></tbody></table>',
        api_response: '<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"text-align:center;\"><tbody><tr><th>参数</th><th>类型</th><th>属性</th><th>说明</th><th>示例</th></tr><tr><td>code</td><td>integer</td><td>必返</td><td>返回码，200成功，401登录失效，404接口地址错误，500服务器错误，其它失败</td><td>200</td></tr><tr><td>msg</td><td>string</td><td>必返</td><td>返回描述</td><td>成功</td></tr><tr><td>data</td><td>array</td><td>必返</td><td>返回数据</td><td></td></tr></tbody></table><p>返回数据data：</p><table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"text-align:center;\"><tbody><tr><th>字段</th><th>类型</th><th>属性</th><th>说明</th><th>示例</th></tr><tr><td>field_name</td><td>string</td><td>选返</td><td>返回数据示例字段</td><td>示例值</td></tr></tbody></table>',
        api_explain: '',
        api_sort: 200,
        api_footer: true
      },
      api_request_editor: null,
      api_response_editor: null,
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/Api/apiUpload',
      uploadHeaders: {
        AdminToken: getAdminToken(),
        AdminUserId: getAdminUserId()
      },
      apiRules: {
        api_name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.apiList()
  },
  methods: {
    // 接口列表
    apiList() {
      this.loading = true
      apiList().then(res => {
        this.apiData = res.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口刷新
    apiRefresh() {
      this.apiList()
    },
    // 接口是否禁用
    apiIsProhibit(row) {
      this.loading = true
      apiDisable({
        api_id: row.api_id,
        is_disable: row.is_disable
      }).then(res => {
        this.apiList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口是否无需权限
    apiIsUnauth(row) {
      this.loading = true
      apiUnauth({
        api_id: row.api_id,
        is_unauth: row.is_unauth
      }).then(res => {
        this.apiList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口文档打开
    apiDoc(row) {
      this.loading = true
      this.apiDialogTitle = '接口文档：' + row.api_name
      apiDoc({
        api_id: row.api_id
      }).then(res => {
        this.apiReset(res.data)
        this.apiModel.api_footer = false
        this.apiDialog = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口添加打开
    apiAddition(row) {
      this.apiDialog = true
      this.apiDialogTitle = '接口添加'
      this.apiModel = this.$options.data().apiModel
      if (row) {
        this.apiModel.api_pid = row.api_id
      }
    },
    // 接口修改打开
    apiModify(row) {
      this.loading = true
      this.apiDialogTitle = '接口修改：' + row.api_name
      apiEdit({
        api_id: row.api_id
      }).then(res => {
        this.apiReset(res.data)
        this.apiDialog = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口父级选择
    apiPidChange(value) {
      if (value) {
        this.apiModel.api_pid = value[value.length - 1]
      }
    },
    // 接口添加、修改取消
    apiCancel() {
      this.apiDialog = false
      this.apiReset()
    },
    // 接口添加、修改提交
    apiSubmit() {
      this.$refs['apiRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.apiModel.api_id) {
            apiEdit(this.apiModel, 'post').then(res => {
              this.apiList()
              this.apiReset()
              this.apiDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            apiAdd(this.apiModel).then(res => {
              this.apiList()
              this.apiReset()
              this.apiDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 接口添加、修改重置
    apiReset(row) {
      if (row) {
        this.apiModel = row
        this.apiModel.api_footer = true
      } else {
        this.apiModel = this.$options.data().apiModel
      }
      if (this.$refs['apiRef'] !== undefined) {
        this.$refs['apiRef'].resetFields()
      }
    },
    // 接口请求、返回参数编辑器
    DialogOpened() {
      const that = this
      const { BtnMenu } = E
      class menuRequest extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="请求参数模板"><el-button>模板</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.api_request_editor.txt.append(that.$options.data().apiModel.api_request)
        }
        tryChangeActive() {}
      }
      class menuClear extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="清空内容"><el-button>清空</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.api_request_editor.txt.clear()
        }
        tryChangeActive() {}
      }
      this.api_request_editor = new E('#api_request')
      this.api_request_editor.menus.extend('menuRequestKey', menuRequest)
      this.api_request_editor.config.menus = this.api_request_editor.config.menus.concat('menuRequestKey')
      this.api_request_editor.menus.extend('menuClearKey', menuClear)
      this.api_request_editor.config.menus = this.api_request_editor.config.menus.concat('menuClearKey')
      this.api_request_editor.config.uploadImgServer = this.uploadAction // server 接口地址
      this.api_request_editor.config.uploadImgMaxLength = 1 // 一次最多上传图片数
      this.api_request_editor.config.uploadImgParams = { image_field: 'api_request' }
      this.api_request_editor.config.uploadFileName = 'image_file'
      this.api_request_editor.config.uploadImgHeaders = this.uploadHeaders
      this.api_request_editor.config.uploadImgHooks = {
        customInsert: function(insertImgFn, result) {
          if (result.code === 200) {
            insertImgFn(result.data.image_src)
          } else {
            that.$message.error(result.msg)
          }
        }
      }
      this.api_request_editor.config.height = 300
      this.api_request_editor.config.focus = false
      this.api_request_editor.config.placeholder = ''
      this.api_request_editor.config.onchange = (newHtml) => {
        this.apiModel.api_request = newHtml
      }
      this.api_request_editor.create()
      this.api_request_editor.txt.html(this.apiModel.api_request)

      class menuResponse extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="返回参数模板"><el-button>模板</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.api_response_editor.txt.append(that.$options.data().apiModel.api_response)
        }
        tryChangeActive() {}
      }
      class menuResponseClear extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="清空内容"><el-button>清空</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.api_response_editor.txt.clear()
        }
        tryChangeActive() {}
      }
      this.api_response_editor = new E('#api_response')
      this.api_response_editor.menus.extend('menuResponseKey', menuResponse)
      this.api_response_editor.config.menus = this.api_response_editor.config.menus.concat('menuResponseKey')
      this.api_response_editor.menus.extend('menuResponseClearKey', menuResponseClear)
      this.api_response_editor.config.menus = this.api_response_editor.config.menus.concat('menuResponseClearKey')
      this.api_response_editor.config.uploadImgServer = this.uploadAction// server 接口地址
      this.api_response_editor.config.uploadImgMaxLength = 1 // 一次最多上传图片数
      this.api_response_editor.config.uploadImgParams = { image_field: 'api_response' }
      this.api_response_editor.config.uploadFileName = 'image_file'
      this.api_response_editor.config.uploadImgHeaders = this.uploadHeaders
      this.api_response_editor.config.uploadImgHooks = {
        customInsert: function(insertImgFn, result) {
          if (result.code === 200) {
            insertImgFn(result.data.image_src)
          } else {
            that.$message.error(result.msg)
          }
        }
      }
      this.api_response_editor.config.height = 500
      this.api_response_editor.config.focus = false
      this.api_response_editor.config.placeholder = ''
      this.api_response_editor.config.onchange = (newHtml) => {
        this.apiModel.api_response = newHtml
      }
      this.api_response_editor.create()
      this.api_response_editor.txt.html(this.apiModel.api_response)

      if (this.apiModel.api_footer) {
        this.api_response_editor.enable()
        this.api_request_editor.enable()
      } else {
        this.api_response_editor.disable()
        this.api_request_editor.disable()
      }
    },
    DialogClosed() {
      this.api_request_editor.destroy()
      this.api_request_editor = null
      this.api_response_editor.destroy()
      this.api_response_editor = null
    },
    // 接口删除
    apiDelete(row) {
      this.$confirm(
        '确定要删除接口 <span style="color:red">' + row.api_name + ' </span>吗？',
        '删除：' + row.api_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        apiDele({
          api_id: row.api_id
        }).then(res => {
          this.apiReset()
          this.apiList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    }
  }
}
</script>
