<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('菜单上级')" prop="menu_pid">
                <el-cascader
                  v-model="model.menu_pid"
                  :options="basedata.trees"
                  :props="basedata.props"
                  clearable
                  filterable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item :label="$t('菜单类型')" prop="menu_type">
                <el-button class="mr-2" :title="$t('目录和菜单会在侧边栏菜单显示，按钮则不显示')">
                  <Icons icon="QuestionFilled" />
                </el-button>
                <el-radio-group v-model="model.menu_type">
                  <el-radio v-for="v in basedata.menu_types" :key="v.value" :value="v.value" :label="v.label" />
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="model.menu_type !== 2" :label="$t('菜单图标')" prop="meta_icon">
                <Icons v-model="model.meta_icon" />
              </el-form-item>
              <el-form-item :label="$t('菜单名称')" prop="menu_name">
                <el-input v-model="model.menu_name" clearable :placeholder="$t('meta.title；侧边栏菜单名称')">
                  <template #prepend>
                    <el-button :title="$t('meta.title；侧边栏菜单名称')">
                      <Icons icon="QuestionFilled" />
                    </el-button>
                  </template>
                  <template #append><Clipboard :content="model.menu_name" /></template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('菜单链接')" prop="menu_url">
                <el-input
                  v-model="model.menu_url"
                  clearable
                  :placeholder="$t('roles；权限标识：应用/控制器/操作，区分大小写')"
                >
                  <template #prepend>
                    <el-button :title="$t('roles；权限标识：应用/控制器/操作，区分大小写')">
                      <Icons icon="QuestionFilled" />
                    </el-button>
                  </template>
                  <template #append><Clipboard :content="model.menu_url" /></template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="model.menu_type !== 2" :label="$t('路由地址')" prop="path" :rules="rulesPath">
                <el-input
                  v-model="model.path"
                  clearable
                  :placeholder="$t('path；路由地址，如：member，一级菜单需在前面加斜杠/；外链为 http 地址')"
                >
                  <template #prepend>
                    <el-button :title="$t('path；路由地址，如：member，一级菜单需在前面加斜杠/；外链为 http 地址')">
                      <Icons icon="QuestionFilled" />
                    </el-button>
                  </template>
                  <template #append><Clipboard :content="model.path" /></template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="model.menu_type === 1" :label="$t('路由名称')" prop="name">
                <el-input
                  v-model="model.name"
                  clearable
                  :placeholder="$t('name；组件name属性，如：Member，keep-alive 用到；外链可随意填写')"
                >
                  <template #prepend>
                    <el-button :title="$t('name；组件name属性，如：Member，keep-alive 用到；外链可随意填写')">
                      <Icons icon="QuestionFilled" />
                    </el-button>
                  </template>
                  <template #append><Clipboard :content="model.name" /></template>
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="model.menu_type === 0 || model.menu_type === 1"
                :label="$t('组件路径')"
                prop="component"
              >
                <el-input
                  v-model="model.component"
                  clearable
                  :placeholder="$t('component；组件路径，如：member/member，默认在 views 目录下')"
                >
                  <template #prepend>
                    <el-button :title="$t('component；组件路径，如：member/member，默认在 views 目录下')">
                      <Icons icon="QuestionFilled" />
                    </el-button>
                  </template>
                  <template #append><Clipboard :content="model.component" /></template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="model.menu_type === 1" :label="$t('路由参数')" prop="meta_query">
                <el-input
                  v-model="model.meta_query"
                  clearable
                  placeholder='meta.query；路由的默认传递参数，如：{ "recycle": 0 }'
                >
                  <template #prepend>
                    <el-button title='meta.query；路由的默认传递参数，如：{ "recycle": 0 }'>
                      <Icons icon="QuestionFilled" />
                    </el-button>
                  </template>
                  <template #append><Clipboard :content="model.meta_query" /></template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="model.menu_type !== 2" :label="$t('是否缓存')" prop="keep_alive">
                <el-button :title="$t('keepAlive；是否缓存组件')">
                  <Icons icon="QuestionFilled" />
                </el-button>
                <el-radio-group v-model="model.keep_alive" class="ml-2">
                  <el-radio :value="0">否</el-radio>
                  <el-radio :value="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="model.menu_type === 0" :label="$t('始终显示')" prop="always_show">
                <el-button :title="$t('alwaysShow；是否始终显示（只有一个子路由的时候）')">
                  <Icons icon="QuestionFilled" />
                </el-button>
                <el-radio-group v-model="model.always_show" class="ml-2">
                  <el-radio :value="0">否</el-radio>
                  <el-radio :value="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="model.menu_type !== 2" :label="$t('是否隐藏')" prop="hidden">
                <el-button :title="$t('hidden；隐藏后侧边栏不显示，但仍然可以访问')">
                  <Icons icon="QuestionFilled" />
                </el-button>
                <el-radio-group v-model="model.hidden" class="ml-2">
                  <el-radio :value="0">否</el-radio>
                  <el-radio :value="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="model.menu_type === 1" :label="$t('激活菜单')" prop="active_menu_id">
                <el-button :title="$t('隐藏菜单的激活菜单，如会员添加修改菜单是会员管理菜单')">
                  <Icons icon="QuestionFilled" />
                </el-button>
                <el-cascader
                  v-model="model.active_menu_id"
                  :options="basedata.trees"
                  :props="basedata.props"
                  :placeholder="$t('隐藏菜单的激活菜单，如会员添加修改菜单是会员管理菜单')"
                  clearable
                  filterable
                  class="w-[86%]"
                />
              </el-form-item>
              <el-form-item :label="$t('日志类型')" prop="log_type">
                <el-button class="mr-2" :title="$t('对应日志记录的日志类型')">
                  <Icons icon="QuestionFilled" />
                </el-button>
                <el-radio-group v-model="model.log_type">
                  <el-radio v-for="v in basedata.log_types" :key="v.value" :value="v.value" :label="v.label" />
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="remark">
                <el-input v-model="model.remark" clearable>
                  <template #prepend>
                    <el-button :title="$t('备注')">
                      <Icons icon="QuestionFilled" />
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input v-model="model.sort" type="number" placeholder="250">
                  <template #prepend>
                    <el-button :title="$t('降序，数值越大越排在前面')">
                      <Icons icon="QuestionFilled" />
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="id" :label="$t('禁用')" prop="is_disable">
                <ElSwitchWhether v-model="model.is_disable" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('添加时间')" prop="create_time">
                <el-input v-model="model.create_time" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('修改时间')" prop="update_time">
                <el-input v-model="model.update_time" disabled />
              </el-form-item>
              <el-form-item v-if="model.delete_time" :label="$t('删除时间')" prop="delete_time">
                <el-input v-model="model.delete_time" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <el-form-item>
      <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
        <el-button :loading="loading" @click="reset">{{ resetText }}</el-button>
        <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
        <el-button
          v-if="id && type === 'edit' && hasPerm(['admin/system.Menu/add'])"
          :loading="loading"
          :title="$t('修改将会变成添加')"
          class="float-right"
          @click="submit('add')"
        >
          {{ $t('添加') }}
        </el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight, addEditSuccessAlert, defaultSettings, hasPerm } from '@/utils/index'
import { infoApi, addApi, editApi } from '@/api/system/menu'

export default {
  components: {},
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'edit'
    },
    dialog: {
      type: Boolean,
      default: false
    },
    pid: {
      type: [String, Number],
      default: ''
    }
  },
  emits: ['close'],
  data() {
    return {
      name: '',
      height: 750,
      loading: false,
      idkey: 'menu_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
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
        keep_alive: 1,
        always_show: 0,
        hidden: 0,
        active_menu_id: 0,
        log_type: 1,
        remark: '',
        sort: 250,
        is_disable: 0,
        create_time: '',
        update_time: '',
        delete_time: ''
      },
      rules: {},
      rulesPath: {},
      resetText: '',
      basedata: {
        trees: [],
        props: { value: 'menu_id', label: 'menu_name', checkStrictly: true, emitPath: false },
        log_types: [],
        menu_types: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('菜单')
      this.height = screenHeight()
      this.rules = { menu_name: [{ required: true, message: this.$t('请输入菜单名称'), trigger: 'blur' }] }
      this.rulesPath = { required: true, message: this.$t('请输入路由地址'), trigger: 'blur' }
      if (defaultSettings().frontRouter) {
        this.rulesPath.required = false
      }
      if (this.dialog) {
        this.height = this.height - 100
        this.rowcol = { md: 23, lg: 23, xl: 23 }
        this.formclass = false
      }
      if (this.id) {
        this.resetText = this.$t('刷新')
        this.edit()
      } else {
        this.resetText = this.$t('清空')
        this.add()
      }
    },
    add() {
      addApi({}, 'get')
        .then((res) => {
          this.data(res.data)
        })
        .catch(() => {})
    },
    edit(ismsg = false) {
      let api = editApi
      if (this.type === 'info') {
        api = infoApi
      }
      api({ [this.idkey]: this.id }, 'get')
        .then((res) => {
          this.data(res.data)
          if (ismsg) {
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {})
    },
    data(data) {
      if (data) {
        this.basedata.trees = data.basedata.trees
        this.basedata.log_types = data.basedata.log_types
        this.basedata.menu_types = data.basedata.menu_types
        delete data.basedata
        if (data[this.idkey]) {
          this.model = data
        } else {
          this.model = this.$options.data().model
        }
      } else {
        this.model = this.$options.data().model
      }
      if (this.pid) {
        this.model.menu_pid = Number(this.pid)
      }
      this.$refs['ref'].resetFields()
      this.$refs['ref'].clearValidate()
    },
    reset() {
      this.loading = true
      if (this.id) {
        this.edit(true)
      } else {
        this.data()
      }
      this.loading = false
    },
    submit(type = '') {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          let api = addApi
          if (this.id) {
            if (type === 'add') {
              api = addApi
            } else {
              api = editApi
            }
          }
          api(this.model)
            .then((res) => {
              this.success(res, type)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    success(res, type = '') {
      this.loading = false
      ElMessage.success(res.msg)
      if (this.dialog) {
        this.$emit('close')
      } else {
        const id = type === 'add' ? '' : this.id
        addEditSuccessAlert(id, this.name, this.$route)
      }
    }
  }
}
</script>
