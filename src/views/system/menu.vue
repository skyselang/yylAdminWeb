<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="menu_pid" label="上级" />
          <el-option value="menu_name" label="名称" />
          <el-option value="menu_url" label="链接" />
          <el-option value="menu_type" label="类型" />
          <el-option value="is_unlogin" label="免登" />
          <el-option value="is_unauth" label="免权" />
          <el-option value="is_unrate" label="免限" />
          <el-option value="hidden" label="隐藏" />
          <el-option value="is_disable" label="禁用" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-cascader
          v-if="query.search_field === 'menu_pid'"
          v-model="query.search_value"
          :options="trees"
          :props="props"
          class="ya-search-value"
          clearable
          filterable
        />
        <el-select v-else-if="query.search_field === 'menu_type'" v-model="query.search_value" class="ya-search-value">
          <el-option :value="0" label="目录" />
          <el-option :value="1" label="菜单" />
          <el-option :value="2" label="按钮" />
        </el-select>
        <el-select
          v-else-if="
            query.search_field === 'is_unlogin' ||
            query.search_field === 'is_unauth' ||
            query.search_field === 'is_unrate' ||
            query.search_field === 'hidden' ||
            query.search_field === 'is_disable'
          "
          v-model="query.search_value"
          class="ya-search-value"
        >
          <el-option :value="1" label="是" />
          <el-option :value="0" label="否" />
        </el-select>
        <el-input v-else v-model="query.search_value" class="ya-search-value" placeholder="查询内容" clearable />
        <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间类型">
          <el-option value="create_time" label="添加时间" />
          <el-option value="update_time" label="修改时间" />
        </el-select>
        <el-date-picker
          v-model="query.date_value"
          type="datetimerange"
          class="ya-date-value"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[new Date(2024, 1, 1, 0, 0, 0), new Date(2024, 1, 1, 23, 59, 59)]"
        />
        <el-button type="primary" title="查询/刷新" @click="search()">查询</el-button>
        <el-button type="default" title="重置查询条件" @click="refresh()">重置</el-button>
        <el-button type="primary" @click="add()">添加</el-button>
      </el-col>
    </el-row>
    <!-- 操作 -->
    <el-row>
      <el-col>
        <el-checkbox border v-model="isExpandAll" class="!mr-[10px] top-[3px]" title="收起/展开" @change="expandAll">
          收起
        </el-checkbox>
        <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="修改上级" @click="selectOpen('editpid')">上级</el-button>
        <el-button title="是否免登" @click="selectOpen('unlogin')">免登</el-button>
        <el-button title="是否免权" @click="selectOpen('unauth')">免权</el-button>
        <el-button title="是否免限" @click="selectOpen('unrate')">免限</el-button>
        <el-button title="是否隐藏" @click="selectOpen('hidden')">隐藏</el-button>
        <el-button title="修改排序" @click="selectOpen('editsort')">排序</el-button>
        <el-button title="解除角色" @click="selectOpen('remover')">解除角色</el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-form ref="selectRef" label-width="120px">
        <el-form-item v-if="selectType === 'remover'">
          <span style="">确定要解除选中的{{ name }}的角色吗？</span>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'editsort'" label="排序">
          <el-input v-model="sort" type="number" placeholder="250" />
          <el-input v-model="sort_incdec" type="text" placeholder="0">
            <template #append>按{{ name }}ID顺序递增或递减排序</template>
          </el-input>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'editpid'" label="上级">
          <el-cascader
            v-model="menu_pid"
            :options="trees"
            :props="props"
            class="w-full"
            placeholder="一级菜单"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'unlogin'" label="是否免登">
          <el-switch v-model="is_unlogin" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'unauth'" label="是否免权">
          <el-switch v-model="is_unauth" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'unrate'" label="是否免限">
          <el-switch v-model="is_unrate" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'hidden'" label="是否隐藏">
          <el-switch v-model="hidden" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'disable'" label="是否禁用">
          <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'dele'">
          <span class="c-red">确定要删除选中的{{ name }}吗？</span>
        </el-form-item>
        <el-form-item :label="name + 'ID'">
          <el-input v-model="selectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="loading" @click="selectCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :height="height"
      :row-key="idkey"
      default-expand-all
      @selection-change="select"
      @select-all="selectAll"
    >
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="menu_name" label="菜单名称" min-width="210" show-overflow-tooltip />
      <el-table-column prop="meta_icon" label="图标" min-width="60">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.meta_icon" />
        </template>
      </el-table-column>
      <el-table-column prop="menu_url" label="菜单链接" min-width="230" show-overflow-tooltip />
      <el-table-column prop="path" label="路由地址" min-width="150" show-overflow-tooltip />
      <el-table-column prop="name" label="路由名称" min-width="130" show-overflow-tooltip />
      <el-table-column prop="component" label="组件路径" min-width="135" show-overflow-tooltip />
      <el-table-column prop="menu_type_name" label="类型" min-width="60" />
      <el-table-column prop="is_unlogin_name" label="免登" min-width="60" />
      <el-table-column prop="is_unauth_name" label="免权" min-width="60" />
      <el-table-column prop="is_unrate_name" label="免限" min-width="60" />
      <el-table-column prop="is_disable_name" label="禁用" min-width="60" />
      <el-table-column prop="hidden_name" label="隐藏" min-width="60" />
      <el-table-column :prop="idkey" label="ID" min-width="60" />
      <el-table-column prop="sort" label="排序" min-width="70" />
      <el-table-column label="操作" width="165">
        <template #default="scope">
          <el-link type="primary" class="mr-1" :underline="false" @click="roleShow(scope.row)"> 角色 </el-link>
          <el-link type="primary" class="mr-1" :underline="false" title="添加下级" @click="add(scope.row)">
            添加
          </el-link>
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)"> 修改 </el-link>
          <el-link type="primary" :underline="false" @click="selectOpen('dele', [scope.row])"> 删除 </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-descriptions title="" :column="12" :colon="false">
        <el-descriptions-item>共 {{ count }} 条</el-descriptions-item>
      </el-descriptions>
    </el-row>
    <!-- 添加修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      top="5vh"
      draggable
      overflow
    >
      <el-scrollbar native :height="height - 50">
        <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
          <el-form-item label="菜单上级" prop="menu_pid">
            <el-cascader
              v-model="model.menu_pid"
              :options="trees"
              :props="props"
              class="w-full"
              placeholder="一级菜单"
              clearable
              filterable
            />
          </el-form-item>
          <el-form-item label="菜单类型" prop="menu_type">
            <el-radio-group v-model="model.menu_type">
              <el-radio :value="0">目录</el-radio>
              <el-radio :value="1">菜单</el-radio>
              <el-radio :value="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="model.menu_type !== 2" label="菜单图标" prop="meta_icon">
            <icon-select v-model="model.meta_icon" />
          </el-form-item>
          <el-form-item label="菜单名称" prop="menu_name">
            <el-input v-model="model.menu_name" clearable placeholder="meta.title；侧边栏菜单名称">
              <template #prepend>
                <el-button title="meta.title；侧边栏菜单名称">
                  <svg-icon icon-class="question-filled" />
                </el-button>
              </template>
              <template #append>
                <el-button title="复制" @click="clipboard(model.menu_name)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="菜单链接" prop="menu_url">
            <el-input v-model="model.menu_url" clearable placeholder="roles；权限标识：应用/控制器/操作；区分大小写">
              <template #prepend>
                <el-button title="roles；权限标识：应用/控制器/操作，区分大小写">
                  <svg-icon icon-class="question-filled" />
                </el-button>
              </template>
              <template #append>
                <el-button title="复制" @click="clipboard(model.menu_url)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="model.menu_type !== 2" label="路由地址" prop="path">
            <el-input
              v-model="model.path"
              clearable
              placeholder="path；路由地址，如：member，一级菜单需在前面加斜杠/；外链为 http 地址"
            >
              <template #prepend>
                <el-button title="path；路由地址，如：member，一级菜单需在前面加斜杠/；外链为 http 地址">
                  <svg-icon icon-class="question-filled" />
                </el-button>
              </template>
              <template #append>
                <el-button title="复制" @click="clipboard(model.path)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="model.menu_type === 1" label="路由名称" prop="name">
            <el-input
              v-model="model.name"
              clearable
              placeholder="name；组件name属性，如：Member，<keep-alive> 用到；外链可随意填写"
            >
              <template #prepend>
                <el-button title="name；组件的name属性，如：Member，<keep-alive> 用到；外链可随意填写">
                  <svg-icon icon-class="question-filled" />
                </el-button>
              </template>
              <template #append>
                <el-button title="复制" @click="clipboard(model.name)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="model.menu_type === 0 || model.menu_type === 1" label="组件路径" prop="component">
            <el-input
              v-model="model.component"
              clearable
              placeholder="component；组件路径，如：member/member，默认在 views 目录下"
            >
              <template #prepend>
                <el-button title="component；组件路径，如：member/member，默认在 views 目录下">
                  <svg-icon icon-class="question-filled" />
                </el-button>
              </template>
              <template #append>
                <el-button title="复制" @click="clipboard(model.component)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="model.menu_type === 1" label="路由参数" prop="meta_query">
            <el-input
              v-model="model.meta_query"
              clearable
              placeholder='meta.query；路由的默认传递参数，如：{ "recycle": 0 }'
            >
              <template #prepend>
                <el-button title='meta.query；路由的默认传递参数，如：{ "recycle": 0 }'>
                  <svg-icon icon-class="question-filled" />
                </el-button>
              </template>
              <template #append>
                <el-button title="复制" @click="clipboard(model.meta_query)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="model.menu_type !== 2" label="是否隐藏" prop="hidden">
            <el-button title="hidden；隐藏后侧边栏不显示，但仍然可以访问">
              <svg-icon icon-class="question-filled" />
            </el-button>
            <el-radio-group v-model="model.hidden" style="margin-left: 10px">
              <el-radio :value="0">否</el-radio>
              <el-radio :value="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="model.menu_type !== 2" label="是否缓存" prop="keep_alive">
            <el-button title="keepAlive；是否缓存组件">
              <svg-icon icon-class="question-filled" />
            </el-button>
            <el-radio-group v-model="model.keep_alive" style="margin-left: 10px">
              <el-radio :value="0">否</el-radio>
              <el-radio :value="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="model.menu_type == 0" label="始终显示" prop="always_show">
            <el-button title="alwaysShow；是否始终显示（只有一个子路由的时候）">
              <svg-icon icon-class="question-filled" />
            </el-button>
            <el-radio-group v-model="model.always_show" style="margin-left: 10px">
              <el-radio :value="0">否</el-radio>
              <el-radio :value="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单排序" prop="sort">
            <el-input v-model="model.sort" type="number" placeholder="250">
              <template #prepend>
                <el-button title="降序，数值越大越排在前面">
                  <svg-icon icon-class="question-filled" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="model.menu_type === 1" label="快速添加" prop="add">
            <el-button class="ya-margin-right" title="快速添加，需要输入菜单链接：应用/控制器/操作；区分大小写">
              <svg-icon icon-class="question-filled" />
            </el-button>
            <el-checkbox v-model="model.add_info">信息</el-checkbox>
            <el-checkbox v-model="model.add_add">添加</el-checkbox>
            <el-checkbox v-model="model.add_edit">修改</el-checkbox>
            <el-checkbox v-model="model.add_dele">删除</el-checkbox>
            <el-checkbox v-model="model.add_disable">禁用</el-checkbox>
          </el-form-item>
          <el-form-item v-if="model.menu_type === 1" v-show="model[idkey]" label="快速修改" prop="edit">
            <el-button class="ya-margin-right" title="快速修改，需要输入菜单链接：应用/控制器/操作；区分大小写">
              <svg-icon icon-class="question-filled" />
            </el-button>
            <el-checkbox v-model="model.edit_info">信息</el-checkbox>
            <el-checkbox v-model="model.edit_add">添加</el-checkbox>
            <el-checkbox v-model="model.edit_edit">修改</el-checkbox>
            <el-checkbox v-model="model.edit_dele">删除</el-checkbox>
            <el-checkbox v-model="model.edit_disable">禁用</el-checkbox>
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
            <el-input v-model="model.create_time" disabled />
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
            <el-input v-model="model.update_time" disabled />
          </el-form-item>
          <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
            <el-input v-model="model.delete_time" disabled />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button :loading="loading" @click="reset('')">重置</el-button>
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 角色 -->
    <el-dialog
      v-model="roleDialog"
      :title="roleDialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="5vh"
      width="65%"
    >
      <!-- 角色操作 -->
      <el-row>
        <el-col>
          <el-button type="primary" title="解除" @click="roleSelectOpen('roleRemove')"> 解除 </el-button>
          <el-input v-model="roleQuery.search_value" class="ya-search-value" placeholder="名称" clearable />
          <el-button type="primary" @click="roleList()">查询</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table
        ref="roleRef"
        v-loading="roleLoad"
        :data="roleData"
        :height="height - 70"
        @sort-change="roleSort"
        @selection-change="roleSelect"
      >
        <el-table-column type="selection" width="42" title="全选/反选" />
        <el-table-column :prop="rolePk" label="角色ID" width="100" sortable="custom" />
        <el-table-column prop="role_name" label="角色名称" min-width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="role_desc" label="描述" min-width="130" show-overflow-tooltip />
        <el-table-column prop="is_disable_name" label="禁用" min-width="85" sortable="custom" />
        <el-table-column prop="sort" label="排序" min-width="85" sortable="custom" />
        <el-table-column label="操作" width="70">
          <template #default="scope">
            <el-link type="primary" :underline="false" @click="roleSelectOpen('roleRemove', scope.row)"> 解除 </el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 角色分页 -->
      <pagination
        v-show="roleCount > 0"
        v-model:total="roleCount"
        v-model:page="roleQuery.page"
        v-model:limit="roleQuery.limit"
        @pagination="roleList"
      />
    </el-dialog>
    <el-dialog
      v-model="roleSelectDialog"
      :title="roleSelectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-form ref="roleSelectRef" label-width="120px">
        <el-form-item v-if="roleSelectType === 'roleRemove'" :label="name + 'ID'">
          <span>{{ roleQuery[idkey] }}</span>
        </el-form-item>
        <el-form-item :label="roleName + 'ID'">
          <el-input v-model="roleSelectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleSelectCancel">取消</el-button>
        <el-button type="primary" @click="roleSelectSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import { arrayColumn, clipboard } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import {
  list,
  info,
  add,
  edit,
  dele,
  editsort,
  editpid,
  unlogin,
  unauth,
  unrate,
  ishidden,
  disable,
  roleList,
  roleRemove
} from '@/api/system/menu'

export default {
  name: 'SystemMenu',
  components: { Pagination },
  data() {
    return {
      name: '菜单',
      height: 680,
      loading: false,
      idkey: 'menu_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: { search_field: 'menu_name', search_exp: 'like', date_field: 'create_time' },
      data: [],
      dialog: false,
      dialogTitle: '',
      model: {
        menu_id: '',
        menu_pid: 0,
        menu_type: 0,
        meta_icon: '',
        menu_name: '',
        menu_url: '',
        path: '',
        name: '',
        component: '',
        meta_query: '',
        hidden: 0,
        keep_alive: 1,
        always_show: 0,
        sort: 250,
        add_info: false,
        add_add: false,
        add_edit: false,
        add_dele: false,
        add_disable: false,
        edit_info: false,
        edit_add: false,
        edit_edit: false,
        edit_dele: false,
        edit_disable: false
      },
      rules: {
        menu_name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
        name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }]
      },
      trees: [],
      props: { checkStrictly: true, value: 'menu_id', label: 'menu_name', emitPath: false },
      isExpandAll: false,
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      sort: 250,
      sort_incdec: '0',
      menu_pid: 0,
      is_unlogin: 0,
      is_unauth: 0,
      is_unrate: 0,
      is_disable: 0,
      hidden: 0,
      rolePk: 'role_id',
      roleName: '角色',
      roleDialog: false,
      roleDialogTitle: '',
      roleLoad: false,
      roleData: [],
      roleCount: 0,
      roleQuery: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'role_name',
        search_exp: 'like',
        search_value: ''
      },
      roleSelection: [],
      roleSelectIds: '',
      roleSelectTitle: '操作',
      roleSelectDialog: false,
      roleSelectType: '',
      count: ''
    }
  },
  created() {
    this.height = screenHeight(290)
    this.list()
  },
  methods: {
    clipboard,
    // 列表
    list() {
      this.loading = true
      list(this.query)
        .then((res) => {
          this.data = res.data.list
          this.trees = res.data.tree
          this.exps = res.data.exps
          this.count = res.data.count
          this.isExpandAll = false
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
      if (row) {
        this.model.menu_pid = row[this.idkey]
      }
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      const id = {}
      id[this.idkey] = row[this.idkey]
      info(id)
        .then((res) => {
          this.reset(res.data)
        })
        .catch(() => {})
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.model[this.idkey]) {
            edit(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            add(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        try {
          this.$refs['ref'].resetFields()
          this.$refs['ref'].clearValidate()
        } catch (error) {}
      }
      this.model.add_info =
        this.model.add_add =
        this.model.add_edit =
        this.model.add_dele =
        this.model.add_disable =
          false
      this.model.edit_info =
        this.model.edit_add =
        this.model.edit_edit =
        this.model.edit_dele =
        this.model.edit_disable =
          false
    },
    // 查询
    search() {
      this.list()
    },
    // 重置查询
    refresh() {
      this.query = this.$options.data().query
      this.list()
    },
    // 收起/展开
    expandAll(e) {
      this.expandFor(this.data, !e)
    },
    expandFor(data, isExpand) {
      data.forEach((i) => {
        this.$refs.table.toggleRowExpansion(i, isExpand)
        if (i.children) {
          this.expandFor(i.children, isExpand)
        }
      })
    },
    // 操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectAll(selection) {
      if (selection) {
        this.selectAllKeys(selection)
        this.selectIds = this.selectGetIds(this.selection).toString()
      } else {
        this.selectIds = ''
      }
    },
    selectAllKeys(tree) {
      for (const i in tree) {
        this.selection.push(tree[i])
        if (tree[i].children) {
          this.selectAllKeys(tree[i].children)
        }
      }
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.name, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        const selectRowLen = selectRow.length
        for (let i = 0; i < selectRowLen; i++) {
          this.$refs['table'].toggleRowSelection(selectRow[i], true)
        }
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '操作'
        if (selectType === 'remover') {
          this.selectTitle = this.name + '解除角色'
        } else if (selectType === 'editsort') {
          this.selectTitle = this.name + '修改排序'
        } else if (selectType === 'editpid') {
          this.selectTitle = this.name + '修改上级'
        } else if (selectType === 'unlogin') {
          this.selectTitle = this.name + '是否免登'
        } else if (selectType === 'unauth') {
          this.selectTitle = this.name + '是否免权'
        } else if (selectType === 'unrate') {
          this.selectTitle = this.name + '是否免限'
        } else if (selectType === 'hidden') {
          this.selectTitle = this.name + '是否隐藏'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'dele') {
          this.selectTitle = this.name + '删除'
        }
        this.selectDialog = true
        this.selectType = selectType
      }
    },
    selectCancel() {
      this.selectDialog = false
    },
    selectSubmit() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        const selectType = this.selectType
        if (selectType === 'remover') {
          this.remover(this.selection)
        } else if (selectType === 'editsort') {
          this.editsort(this.selection)
        } else if (selectType === 'editpid') {
          this.editpid(this.selection)
        } else if (selectType === 'unlogin') {
          this.unlogin(this.selection, true)
        } else if (selectType === 'unauth') {
          this.unauth(this.selection, true)
        } else if (selectType === 'unrate') {
          this.unrate(this.selection, true)
        } else if (selectType === 'hidden') {
          this.ishidden(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 解除角色
    remover(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        roleRemove({
          menu_id: this.selectGetIds(row),
          role_ids: []
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 修改排序
    editsort(row) {
      this.loading = true
      editsort({
        ids: this.selectGetIds(row),
        sort: this.sort,
        sort_incdec: this.sort_incdec
      })
        .then((res) => {
          this.list()
          this.sort_incdec = '0'
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 修改上级
    editpid(row) {
      this.loading = true
      editpid({
        ids: this.selectGetIds(row),
        menu_pid: this.menu_pid
      })
        .then((res) => {
          this.list()
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 是否免登
    unlogin(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        let is_unlogin = row[0].is_unlogin
        if (select) {
          is_unlogin = this.is_unlogin
        }
        unlogin({
          ids: this.selectGetIds(row),
          is_unlogin: is_unlogin
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 是否免权
    unauth(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        let is_unauth = row[0].is_unauth
        if (select) {
          is_unauth = this.is_unauth
        }
        unauth({
          ids: this.selectGetIds(row),
          is_unauth: is_unauth
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 是否免限
    unrate(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        let is_unrate = row[0].is_unrate
        if (select) {
          is_unrate = this.is_unrate
        }
        unrate({
          ids: this.selectGetIds(row),
          is_unrate: is_unrate
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 是否隐藏
    ishidden(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        let hidden = row[0].hidden
        if (select) {
          hidden = this.hidden
        }
        ishidden({
          ids: this.selectGetIds(row),
          hidden: hidden
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 是否禁用
    disable(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        let is_disable = row[0].is_disable
        if (select) {
          is_disable = this.is_disable
        }
        disable({
          ids: this.selectGetIds(row),
          is_disable: is_disable
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        dele({
          ids: this.selectGetIds(row)
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 角色显示
    roleShow(row) {
      this.roleDialog = true
      this.roleDialogTitle = this.name + this.roleName + '：' + row.menu_name
      this.roleQuery.menu_id = row.menu_id
      this.roleQuery.search_value = ''
      this.roleList()
    },
    // 角色列表
    roleList() {
      this.roleLoad = true
      roleList(this.roleQuery)
        .then((res) => {
          this.roleData = res.data.list
          this.roleCount = res.data.count
          this.roleLoad = false
        })
        .catch(() => {
          this.roleLoad = false
        })
    },
    // 角色排序
    roleSort(sort) {
      this.roleQuery.sort_field = sort.prop
      this.roleQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.roleQuery.sort_value = 'asc'
        this.roleList()
      }
      if (sort.order === 'descending') {
        this.roleQuery.sort_value = 'desc'
        this.roleList()
      }
    },
    // 角色操作
    roleSelect(selection) {
      this.roleSelection = selection
      this.roleSelectIds = this.roleSelectGetIds(selection).toString()
    },
    roleSelectGetIds(selection) {
      return arrayColumn(selection, this.rolePk)
    },
    roleSelectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.roleName, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    roleSelectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['roleRef'].clearSelection()
        this.$refs['roleRef'].toggleRowSelection(selectRow)
      }
      if (!this.roleSelection.length) {
        this.roleSelectAlert()
      } else {
        this.roleSelectTitle = '操作'
        if (selectType === 'roleRemove') {
          this.roleSelectTitle = this.name + '解除' + this.roleName
        }
        this.roleSelectDialog = true
        this.roleSelectType = selectType
      }
    },
    roleSelectCancel() {
      this.roleSelectDialog = false
    },
    roleSelectSubmit() {
      if (!this.roleSelection.length) {
        this.roleSelectAlert()
      } else {
        const selectType = this.roleSelectType
        if (selectType === 'roleRemove') {
          this.roleRemove(this.roleSelection)
        }
        this.roleSelectDialog = false
      }
    },
    // 角色解除
    roleRemove(row) {
      if (!row.length) {
        this.roleSelectAlert()
      } else {
        this.roleLoad = true
        roleRemove({
          menu_id: this.roleQuery.menu_id,
          role_ids: this.roleSelectGetIds(row)
        })
          .then((res) => {
            this.roleList()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.roleLoad = false
          })
      }
    }
  }
}
</script>
