<template>
  <div class="app-container">
    <!-- 菜单添加 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="24" style="text-align:right;">
          <el-button class="filter-item" @click="menuRefresh()">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="menuAddition()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 菜单列表 -->
    <el-table v-loading="loading" :data="menuData" :height="height+80" style="width: 100%" row-key="admin_menu_id" border>
      <el-table-column prop="menu_name" label="菜单名称" min-width="220" fixed="left" />
      <el-table-column prop="menu_url" label="菜单链接" min-width="260" show-overflow-tooltip />
      <el-table-column prop="menu_sort" label="排序" min-width="60" />
      <el-table-column prop="admin_menu_id" label="ID" min-width="60" />
      <el-table-column prop="menu_pid" label="PID" min-width="60" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" />
      <el-table-column prop="is_disable" label="是否禁用" min-width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="menuIsProhibit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="is_unauth" label="无需权限" min-width="80" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch v-if="scope.row.menu_url" v-model="scope.row.is_unauth" :active-value="1" :inactive-value="0" @change="menuIsUnauth(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="410" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button v-permission="['admin/AdminMenu/menuDoc']" size="mini" type="primary" @click="menuDoc(row)">文档</el-button>
          <el-button size="mini" type="primary" @click="menuRoleShow(row)">角色</el-button>
          <el-button size="mini" type="primary" @click="menuUserShow(row,'admin_menu_id')">管理员</el-button>
          <el-button size="mini" type="primary" @click="menuAddition(row)">添加</el-button>
          <el-button size="mini" type="success" @click="menuModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="menuDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 菜单添加、修改 -->
    <el-dialog :title="menuDialogTitle" :visible.sync="menuDialog" top="1vh" width="65%" :before-close="menuCancel" @opened="DialogOpened()" @closed="DialogClosed()">
      <el-form ref="menuRef" :rules="menuRules" :model="menuModel" class="dialog-body" label-width="100px" :style="{height:height+50+'px'}">
        <el-form-item label="菜单父级" prop="menu_pid">
          <el-cascader
            v-model="menuModel.menu_pid"
            :options="menuData"
            :props="menuProps"
            style="width:100%"
            clearable
            filterable
            placeholder="一级菜单"
            @change="menuPidChange"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="menuModel.menu_name" clearable placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_url">
          <el-input v-model="menuModel.menu_url" clearable placeholder="" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="menu_sort">
          <el-input v-model="menuModel.menu_sort" type="number" placeholder="200" />
        </el-form-item>
        <el-form-item label="请求参数" prop="menu_request">
          <div id="menu_request" />
        </el-form-item>
        <el-form-item label="返回参数" prop="menu_response">
          <div id="menu_response" />
        </el-form-item>
        <el-form-item label="额外说明" prop="menu_explain">
          <el-input v-model="menuModel.menu_explain" type="textarea" />
        </el-form-item>
        <el-form-item v-if="menuModel.admin_menu_id" label="添加时间" prop="create_time">
          <el-col :span="10">
            <el-input v-model="menuModel.create_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">修改时间</el-col>
          <el-col :span="10">
            <el-input v-model="menuModel.update_time" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div v-if="menuModel.menu_footer" slot="footer" class="dialog-footer">
        <el-button @click="menuCancel">取消</el-button>
        <el-button type="primary" @click="menuSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 菜单角色 -->
    <el-dialog :title="roleTitle" :visible.sync="roleDialog" width="65%" top="1vh">
      <el-table ref="roleRef" v-loading="roleLoad" :data="roleData" :height="height+30" style="width: 100%" border @sort-change="menuRoleSort">
        <el-table-column prop="admin_role_id" label="ID" min-width="100" sortable="custom" fixed="left" />
        <el-table-column prop="role_name" label="角色" min-width="120" sortable="custom" />
        <el-table-column prop="role_desc" label="描述" min-width="130" />
        <el-table-column prop="is_disable" label="是否禁用" min-width="110" align="center" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" align="right" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="menuUserShow(row)">管理员</el-button>
            <el-button size="mini" type="danger" @click="menuRoleRemove(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="roleCount > 0" :total="roleCount" :page.sync="roleQuery.page" :limit.sync="roleQuery.limit" @pagination="menuRoleList" />
    </el-dialog>
    <!-- 菜单管理员 -->
    <el-dialog :title="userTitle" :visible.sync="userDialog" width="65%" top="1vh">
      <el-table ref="userRef" v-loading="userLoad" :data="userData" :height="height+30" style="width: 100%" border @sort-change="menuUserSort">
        <el-table-column prop="admin_user_id" label="ID" min-width="100" sortable="custom" fixed="left" />
        <el-table-column prop="username" label="账号" min-width="120" sortable="custom" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" width="100" />
        <el-table-column prop="is_admin" label="是否超管" min-width="96" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_admin" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_disable" label="是否禁用" min-width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="right" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{ row }">
            <el-button v-if="userQuery.admin_menu_id" size="mini" type="danger" @click="menuUserRemove(row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="userCount > 0" :total="userCount" :page.sync="userQuery.page" :limit.sync="userQuery.limit" @pagination="menuUserList" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getAdminToken, getAdminUserId } from '@/utils/auth'
import {
  menuList,
  menuDoc,
  menuAdd,
  menuEdit,
  menuDele,
  menuDisable,
  menuUnauth,
  menuRole,
  menuRoleRemove,
  menuUser,
  menuUserRemove
} from '@/api/admin'
import E from 'wangeditor'

export default {
  name: 'Menu',
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      height: 680,
      loading: false,
      menuData: [],
      menuDialog: false,
      menuDialogTitle: '',
      menuProps: {
        checkStrictly: true,
        value: 'admin_menu_id',
        label: 'menu_name'
      },
      menuModel: {
        admin_menu_id: '',
        menu_pid: 0,
        menu_name: '',
        menu_url: '',
        menu_sort: 200,
        menu_request: '<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"text-align:center;\"><tbody><tr><th>参数</th><th>类型</th><th>属性</th><th>说明</th><th>示例</th></tr><tr><td>field_name</td><td>string</td><td>选填</td><td>请求参数示例字段</td><td>示例值</td></tr></tbody></table>',
        menu_response: '<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"text-align:center;\"><tbody><tr><th>参数</th><th>类型</th><th>属性</th><th>说明</th><th>示例</th></tr><tr><td>code</td><td>integer</td><td>必返</td><td>返回码，200成功，401登录失效，404接口地址错误，500服务器错误，其它失败</td><td>200</td></tr><tr><td>msg</td><td>string</td><td>必返</td><td>返回描述</td><td>成功</td></tr><tr><td>data</td><td>array</td><td>必返</td><td>返回数据</td><td></td></tr></tbody></table><p>返回数据data：</p><table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"text-align:center;\"><tbody><tr><th>字段</th><th>类型</th><th>属性</th><th>说明</th><th>示例</th></tr><tr><td>field_name</td><td>string</td><td>选返</td><td>返回数据示例字段</td><td>示例值</td></tr></tbody></table>',
        menu_explain: '',
        menu_footer: true
      },
      menu_request_editor: null,
      menu_response_editor: null,
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/AdminMenu/menuUpload',
      uploadHeaders: {
        AdminToken: getAdminToken(),
        AdminUserId: getAdminUserId()
      },
      menuRules: {
        menu_name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
      },
      roleDialog: false,
      roleTitle: '',
      roleLoad: false,
      roleData: [],
      roleCount: 0,
      roleQuery: {
        page: 1,
        limit: 13
      },
      userDialog: false,
      userTitle: '',
      userLoad: false,
      userData: [],
      userCount: 0,
      userQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.menuList()
  },
  methods: {
    // 菜单列表
    menuList() {
      this.loading = true
      menuList().then(res => {
        this.menuData = res.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 菜单刷新
    menuRefresh() {
      this.menuList()
    },
    // 菜单是否禁用
    menuIsProhibit(row) {
      this.loading = true
      menuDisable({
        admin_menu_id: row.admin_menu_id,
        is_disable: row.is_disable
      }).then(res => {
        this.menuList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 菜单无需权限
    menuIsUnauth(row) {
      this.loading = true
      menuUnauth({
        admin_menu_id: row.admin_menu_id,
        is_unauth: row.is_unauth
      }).then(res => {
        this.menuList()
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 接口文档打开
    menuDoc(row) {
      this.loading = true
      this.menuDialogTitle = '接口文档：' + row.menu_name
      menuDoc({
        admin_menu_id: row.admin_menu_id
      }).then(res => {
        this.menuReset(res.data)
        this.menuModel.menu_footer = false
        this.menuDialog = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 菜单添加打开
    menuAddition(row) {
      this.menuDialog = true
      this.menuDialogTitle = '菜单添加'
      this.menuModel = this.$options.data().menuModel
      if (row) {
        this.menuModel.menu_pid = row.admin_menu_id
      }
    },
    // 菜单修改打开
    menuModify(row) {
      this.loading = true
      this.menuDialogTitle = '菜单修改：' + row.menu_name
      menuEdit({
        admin_menu_id: row.admin_menu_id
      }).then(res => {
        this.menuReset(res.data)
        this.menuDialog = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 菜单父级选择
    menuPidChange(value) {
      if (value) {
        this.menuModel.menu_pid = value[value.length - 1]
      }
    },
    // 菜单添加、修改取消
    menuCancel() {
      this.menuReset()
      this.menuDialog = false
    },
    // 菜单添加、修改提交
    menuSubmit() {
      this.$refs['menuRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.menuModel.admin_menu_id) {
            menuEdit(this.menuModel, 'post').then(res => {
              this.menuDialog = false
              this.menuList()
              this.menuReset()
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            menuAdd(this.menuModel).then(res => {
              this.menuDialog = false
              this.menuList()
              this.menuReset()
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 菜单添加、修改数据重置
    menuReset(row) {
      if (row) {
        this.menuModel = row
        this.menuModel.menu_footer = true
      } else {
        this.menuModel = this.$options.data().menuModel
      }
      if (this.$refs['menuRef'] !== undefined) {
        this.$refs['menuRef'].resetFields()
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
          that.menu_request_editor.txt.append(that.$options.data().menuModel.menu_request)
        }
        tryChangeActive() {}
      }
      class menuClear extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="清空内容"><el-button>清空</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.menu_request_editor.txt.clear()
        }
        tryChangeActive() {}
      }
      this.menu_request_editor = new E('#menu_request')
      this.menu_request_editor.menus.extend('menuRequestKey', menuRequest)
      this.menu_request_editor.config.menus = this.menu_request_editor.config.menus.concat('menuRequestKey')
      this.menu_request_editor.menus.extend('menuClearKey', menuClear)
      this.menu_request_editor.config.menus = this.menu_request_editor.config.menus.concat('menuClearKey')
      this.menu_request_editor.config.uploadImgServer = this.uploadAction // server 接口地址
      this.menu_request_editor.config.uploadImgMaxLength = 1 // 一次最多上传图片数
      this.menu_request_editor.config.uploadImgParams = { image_field: 'menu_request' }
      this.menu_request_editor.config.uploadFileName = 'image_file'
      this.menu_request_editor.config.uploadImgHeaders = this.uploadHeaders
      this.menu_request_editor.config.uploadImgHooks = {
        customInsert: function(insertImgFn, result) {
          if (result.code === 200) {
            insertImgFn(result.data.image_src)
          } else {
            that.$message.error(result.msg)
          }
        }
      }
      this.menu_request_editor.config.height = 300
      this.menu_request_editor.config.focus = false
      this.menu_request_editor.config.placeholder = ''
      this.menu_request_editor.config.onchange = (newHtml) => {
        this.menuModel.menu_request = newHtml
      }
      this.menu_request_editor.create()
      this.menu_request_editor.txt.html(this.menuModel.menu_request)

      class menuResponse extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="返回参数模板"><el-button>模板</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.menu_response_editor.txt.append(that.$options.data().menuModel.menu_response)
        }
        tryChangeActive() {}
      }
      class menuResponseClear extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(`<div class="w-e-menu" data-title="清空内容"><el-button>清空</el-button></div>`)
          super($elem, editor)
        }
        clickHandler() {
          that.menu_response_editor.txt.clear()
        }
        tryChangeActive() {}
      }
      this.menu_response_editor = new E('#menu_response')
      this.menu_response_editor.menus.extend('menuResponseKey', menuResponse)
      this.menu_response_editor.config.menus = this.menu_response_editor.config.menus.concat('menuResponseKey')
      this.menu_response_editor.menus.extend('menuResponseClearKey', menuResponseClear)
      this.menu_response_editor.config.menus = this.menu_response_editor.config.menus.concat('menuResponseClearKey')
      this.menu_response_editor.config.uploadImgServer = this.uploadAction// server 接口地址
      this.menu_response_editor.config.uploadImgMaxLength = 1 // 一次最多上传图片数
      this.menu_response_editor.config.uploadImgParams = { image_field: 'menu_response' }
      this.menu_response_editor.config.uploadFileName = 'image_file'
      this.menu_response_editor.config.uploadImgHeaders = this.uploadHeaders
      this.menu_response_editor.config.uploadImgHooks = {
        customInsert: function(insertImgFn, result) {
          if (result.code === 200) {
            insertImgFn(result.data.image_src)
          } else {
            that.$message.error(result.msg)
          }
        }
      }
      this.menu_response_editor.config.height = 500
      this.menu_response_editor.config.focus = false
      this.menu_response_editor.config.placeholder = ''
      this.menu_response_editor.config.onchange = (newHtml) => {
        this.menuModel.menu_response = newHtml
      }
      this.menu_response_editor.create()
      this.menu_response_editor.txt.html(this.menuModel.menu_response)

      if (this.menuModel.menu_footer) {
        this.menu_response_editor.enable()
        this.menu_request_editor.enable()
      } else {
        this.menu_response_editor.disable()
        this.menu_request_editor.disable()
      }
    },
    DialogClosed() {
      this.menu_request_editor.destroy()
      this.menu_request_editor = null
      this.menu_response_editor.destroy()
      this.menu_response_editor = null
    },
    // 菜单删除
    menuDelete(row) {
      this.$confirm(
        '确定要删除菜单 <span style="color:red">' + row.menu_name + ' </span>吗？',
        '删除：' + row.admin_menu_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        menuDele({
          admin_menu_id: row.admin_menu_id
        }).then(res => {
          this.menuList()
          this.menuReset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 菜单角色显示
    menuRoleShow(row) {
      this.roleDialog = true
      this.roleTitle = '菜单角色：' + row.menu_name
      this.roleQuery.admin_menu_id = row.admin_menu_id
      this.menuRoleList()
    },
    // 菜单角色列表
    menuRoleList() {
      this.roleLoad = true
      menuRole(this.roleQuery).then(res => {
        this.roleData = res.data.list
        this.roleCount = res.data.count
        this.roleLoad = false
        this.$nextTick(() => {
          this.$refs['roleRef'].doLayout()
        })
      }).catch(() => {
        this.roleLoad = false
      })
    },
    // 菜单角色排序
    menuRoleSort(sort) {
      this.roleQuery.sort_field = sort.prop
      this.roleQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.roleQuery.sort_type = 'asc'
        this.menuRoleList()
      }
      if (sort.order === 'descending') {
        this.roleQuery.sort_type = 'desc'
        this.menuRoleList()
      }
    },
    // 菜单角色解除
    menuRoleRemove(row) {
      this.$confirm(
        '确定要解除菜单与角色 <span style="color:red">' + row.role_name + ' </span>的关联吗？',
        '解除：' + row.admin_role_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.roleLoad = true
        menuRoleRemove({
          admin_menu_id: this.roleQuery.admin_menu_id,
          admin_role_id: row.admin_role_id
        }).then(res => {
          this.menuRoleList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.roleLoad = false
        })
      }).catch(() => {})
    },
    // 菜单管理员显示
    menuUserShow(row, type = 'admin_role_id') {
      this.userDialog = true
      if (type === 'admin_menu_id') {
        this.userTitle = '菜单管理员（按菜单）：' + row.menu_name
        this.userQuery.admin_menu_id = row.admin_menu_id
        this.userQuery.admin_role_id = ''
      } else {
        this.userTitle = '菜单管理员（按角色）：' + row.role_name
        this.userQuery.admin_menu_id = ''
        this.userQuery.admin_role_id = row.admin_role_id
      }
      this.menuUserList()
    },
    // 菜单管理员列表
    menuUserList() {
      this.userLoad = true
      menuUser(this.userQuery).then(res => {
        this.userData = res.data.list
        this.userCount = res.data.count
        this.userLoad = false
        this.$nextTick(() => {
          this.$refs['userRef'].doLayout()
        })
      }).catch(() => {
        this.userLoad = false
      })
    },
    // 菜单管理员排序
    menuUserSort(sort) {
      this.userQuery.sort_field = sort.prop
      this.userQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.userQuery.sort_type = 'asc'
        this.menuUserList()
      }
      if (sort.order === 'descending') {
        this.userQuery.sort_type = 'desc'
        this.menuUserList()
      }
    },
    // 菜单管理员解除
    menuUserRemove(row) {
      this.$confirm(
        '确定要解除菜单与管理员 <span style="color:red">' + row.username + ' </span>的关联吗？',
        '解除：' + row.admin_user_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.userLoad = true
        menuUserRemove({
          admin_menu_id: this.userQuery.admin_menu_id,
          admin_user_id: row.admin_user_id
        }).then(res => {
          this.menuUserList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.userLoad = false
        })
      }).catch(() => {})
    }
  }
}
</script>
