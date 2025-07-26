<template>
  <el-row>
    <el-col :span="6">
      <el-button v-if="hasPerm(['admin/member.Member/add'])" type="primary" @click="add()">{{ $t('添加') }}</el-button>
      <el-button v-if="hasPerm(['admin/member.Member/edit'])" @click="edit()">{{ $t('修改') }}</el-button>
      <el-button v-else-if="hasPerm(['admin/member.Member/info'])" @click="edit()">{{ $t('信息') }}</el-button>
      <el-button v-if="hasPerm(['admin/member.Member/dele'])" @click="update('is_delete')">{{ $t('删除') }}</el-button>
      <el-button v-if="hasPerm(['admin/member.Member/disable'])" @click="update('is_disable')">
        {{ $t('禁用') }}
      </el-button>
    </el-col>
    <el-col :span="14">
      <template v-if="hasPerm(['admin/member.Member/update'])">
        <el-button :title="$t('修改编号')" @click="update('unique')">{{ $t('编号') }}</el-button>
        <el-button :title="$t('修改备注')" @click="update('remark')">{{ $t('备注') }}</el-button>
        <el-button :title="$t('修改排序')" @click="update('sort')">{{ $t('排序') }}</el-button>
        <el-button :title="$t('修改头像')" @click="update('avatar_id')">{{ $t('头像') }}</el-button>
        <el-button :title="$t('修改性别')" @click="update('gender')">{{ $t('性别') }}</el-button>
        <el-button :title="$t('修改所在地')" @click="update('region_id')">{{ $t('所在地') }}</el-button>
        <el-button :title="$t('修改标签')" @click="update('tag_ids')">{{ $t('标签') }}</el-button>
      </template>
      <el-button v-if="hasPerm(['admin/member.Member/editGroup'])" :title="$t('修改分组')" @click="update('group_ids')">
        {{ $t('分组') }}
      </el-button>
      <el-button v-if="hasPerm(['admin/member.Member/editSuper'])" :title="$t('修改超会')" @click="update('is_super')">
        {{ $t('超会') }}
      </el-button>
      <el-button v-if="hasPerm(['admin/member.Member/editPwd'])" :title="$t('修改密码')" @click="update('password')">
        {{ $t('密码') }}
      </el-button>
    </el-col>
    <el-col :span="4">
      <Exports v-if="hasPerm(['admin/member.Member/export'])" :name="name" :api="exportApi" :query="query" :ids="ids" />
      <Imports v-if="hasPerm(['admin/member.Member/import'])" :name="name" :api="importApi" />
    </el-col>
  </el-row>
  <el-dialog
    v-model="dialog"
    :title="name + '：' + title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    center
    top="18vh"
  >
    <el-scrollbar :height="height">
      <el-form ref="ref" label-width="120px">
        <el-form-item v-if="field === 'is_delete'" :label="$t('删除')">
          <el-text size="default" type="danger">{{ $t('确定要删除选中的吗', { name: name }) }}</el-text>
        </el-form-item>
        <el-form-item v-else-if="field === 'is_disable'" :label="$t('禁用')">
          <ElSwitchWhether v-model="value" />
        </el-form-item>
        <el-form-item v-else-if="field === 'unique'" :label="$t('编号')">
          <el-col><el-input v-model="value" :placeholder="$t('前缀起始数')" clearable /></el-col>
          <el-col>
            <el-text size="default">eg：SN,001；{{ $t('根据ID顺序进行前缀和起始数递增生成编号') }}</el-text>
          </el-col>
        </el-form-item>
        <el-form-item v-else-if="field === 'remark'" :label="$t('备注')">
          <el-input v-model="value" :placeholder="$t('请输入备注')" clearable />
        </el-form-item>
        <el-form-item v-else-if="field === 'sort'" :label="$t('排序')">
          <el-col><el-input v-model="value" :placeholder="$t('排序步长')" clearable /></el-col>
          <el-col>
            <el-text size="default">eg：250,-10；{{ $t('根据ID顺序进行步长递增或递减生成排序') }}</el-text>
          </el-col>
        </el-form-item>
        <el-form-item v-else-if="field === 'avatar_id'" :label="$t('头像')">
          <el-col><el-input v-model="value" :placeholder="$t('请输入文件ID')" clearable /></el-col>
        </el-form-item>
        <el-form-item v-else-if="field === 'gender'" :label="$t('性别')">
          <el-select v-model="value">
            <el-option v-for="v in basedata.genders" :key="v.value" :value="v.value" :label="v.label" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="field === 'region_id'" :label="$t('所在地')">
          <el-cascader
            v-model="value"
            :options="basedata.regions"
            :props="{ value: 'region_id', label: 'region_name', checkStrictly: true, emitPath: false }"
            clearable
            class="w-full"
          />
        </el-form-item>
        <el-form-item v-else-if="field === 'tag_ids'" :label="$t('标签')">
          <el-select v-model="value" clearable multiple filterable class="w-full">
            <el-option v-for="v in basedata.tags" :key="v.tag_id" :label="v.tag_name" :value="v.tag_id" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="field === 'group_ids'" :label="$t('分组')">
          <el-select v-model="value" clearable multiple filterable class="w-full">
            <el-option v-for="v in basedata.groups" :key="v.group_id" :label="v.group_name" :value="v.group_id" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="field === 'password'" :label="$t('密码')">
          <el-input v-model="value" :placeholder="$t('请输入密码')" clearable />
        </el-form-item>
        <el-form-item v-else-if="field === 'is_super'" :label="$t('超会')">
          <ElSwitchWhether v-model="value" />
        </el-form-item>
        <el-form-item label="ID">
          <el-col>
            <el-text size="default">{{ ids.toString() }}</el-text>
          </el-col>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button :loading="loading" @click="cancel">{{ $t('取消') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { hasPerm, screenHeight } from '@/utils/index'
import {
  deleApi,
  disableApi,
  updateApi,
  editPwdApi,
  editGroupApi,
  editSuperApi,
  exportApi,
  importApi
} from '@/api/member/member'

export default {
  components: {},
  props: {
    name: {
      type: String,
      default: ''
    },
    ids: {
      type: Array,
      default() {
        return []
      }
    },
    query: {
      type: Object,
      default() {
        return {}
      }
    },
    basedata: {
      type: Object,
      default() {
        return { tags: [], groups: [], regions: [] }
      }
    }
  },
  emits: ['list', 'add', 'edit'],
  data() {
    return {
      height: 600,
      loading: false,
      dialog: false,
      title: '',
      field: '',
      value: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    exportApi,
    importApi,
    init() {
      this.title = this.$t('批量操作')
      this.height = screenHeight(500)
    },
    update(field) {
      this.value = ''
      if (this.ids.length) {
        this.dialog = true
        this.field = field
      } else {
        this.alert()
      }
    },
    cancel() {
      this.dialog = false
      this.loading = false
      this.value = ''
    },
    submit() {
      this.loading = true
      let api = updateApi
      let data = { ids: this.ids, field: this.field, value: this.value }
      if (this.field === 'is_delete') {
        api = deleApi
        data = { ids: this.ids }
      } else if (this.field === 'is_disable') {
        api = disableApi
        data = { ids: this.ids, is_disable: this.value ? 1 : 0 }
      } else if (this.field === 'group_ids') {
        api = editGroupApi
        data = { ids: this.ids, group_ids: this.value }
      } else if (this.field === 'password') {
        api = editPwdApi
        data = { ids: this.ids, password: this.value }
      } else if (this.field === 'is_super') {
        api = editSuperApi
        data = { ids: this.ids, is_super: this.value ? 1 : 0 }
      }
      api(data)
        .then((res) => {
          ElMessage.success(res.msg)
          this.dialog = false
          this.loading = false
          this.$emit('list')
        })
        .catch(() => {
          this.loading = false
        })
    },
    add() {
      this.$emit('add')
    },
    edit() {
      this.$emit('edit')
    },
    alert() {
      ElMessageBox.alert(this.$t('请选择需要操作的', { name: this.name }), this.$t('提示'), {
        type: 'warning',
        center: true,
        callback: () => {}
      })
    }
  }
}
</script>
