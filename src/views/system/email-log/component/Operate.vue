<template>
  <el-row>
    <el-col :span="6">
      <el-button v-if="hasPerm(['admin/system.EmailLog/add'])" type="primary" @click="add()">
        {{ $t('添加') }}
      </el-button>
      <el-button v-if="hasPerm(['admin/system.EmailLog/edit'])" @click="edit()">{{ $t('修改') }}</el-button>
      <el-button v-else-if="hasPerm(['admin/system.EmailLog/info'])" @click="edit()">{{ $t('信息') }}</el-button>
      <el-button v-if="hasPerm(['admin/system.EmailLog/dele'])" @click="update('is_delete')">
        {{ $t('删除') }}
      </el-button>
      <el-button v-if="hasPerm(['admin/system.EmailLog/clear'])" @click="clear()">{{ $t('清空') }}</el-button>
    </el-col>
    <el-col :span="14">
      <template v-if="hasPerm(['admin/system.EmailLog/update'])">
        <el-button :title="$t('修改发件人')" @click="update('sender')">{{ $t('发件人') }}</el-button>
        <el-button :title="$t('修改收件人')" @click="update('recipient')">{{ $t('收件人') }}</el-button>
        <el-button :title="$t('修改主题')" @click="update('theme')">{{ $t('主题') }}</el-button>
        <el-button :title="$t('修改内容')" @click="update('content')">{{ $t('内容') }}</el-button>
        <el-button :title="$t('修改错误')" @click="update('error')">{{ $t('错误') }}</el-button>
      </template>
    </el-col>
    <el-col :span="4">
      <Exports
        v-if="hasPerm(['admin/system.EmailLog/export'])"
        :name="name"
        :api="exportApi"
        :query="query"
        :ids="ids"
      />
      <Imports v-if="hasPerm(['admin/system.EmailLog/import'])" :name="name" :api="importApi" />
    </el-col>
  </el-row>
  <el-dialog
    v-model="dialog"
    :title="name + '：' + title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    center
    align-center
  >
    <el-scrollbar :height="height">
      <el-form ref="ref" label-width="120px">
        <el-form-item v-if="field === 'is_delete'" :label="$t('删除')">
          <el-text size="default" type="danger">{{ $t('确定要删除选中的吗', { name: name }) }}</el-text>
        </el-form-item>
        <el-form-item v-else-if="field === 'sender'" :label="$t('发件人')">
          <el-input v-model="value" :placeholder="$t('请输入发件人')" clearable />
        </el-form-item>
        <el-form-item v-else-if="field === 'recipient'" :label="$t('收件人')">
          <el-input v-model="value" :placeholder="$t('请输入收件人')" clearable />
        </el-form-item>
        <el-form-item v-else-if="field === 'theme'" :label="$t('主题')">
          <el-input v-model="value" :placeholder="$t('请输入主题')" clearable />
        </el-form-item>
        <el-form-item v-else-if="field === 'content'" :label="$t('内容')">
          <el-input v-model="value" :placeholder="$t('请输入内容')" type="textarea" autosize />
        </el-form-item>
        <el-form-item v-else-if="field === 'error'" :label="$t('错误')">
          <el-input v-model="value" :placeholder="$t('请输入错误')" type="textarea" autosize />
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
import { deleApi, updateApi, exportApi, importApi, clearApi } from '@/api/system/email-log'

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
        return {}
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
      this.height = screenHeight(550)
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
      } else if (this.field === 'clear') {
        api = clearApi
        data = this.query
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
    },
    clear() {
      ElMessageBox.confirm(this.$t('确定清空所有记录或查询记录吗？'), this.$t('清空'), {
        type: 'warning',
        center: true
      })
        .then(() => {
          this.value = ''
          this.field = 'clear'
          this.submit()
        })
        .catch(() => {})
    }
  }
}
</script>
