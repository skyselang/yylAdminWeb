<template>
  <el-row>
    <el-col :span="6">
      <el-button v-if="hasPerm(['admin/file.Import/edit'])" @click="edit()">{{ $t('修改') }}</el-button>
      <el-button v-else-if="hasPerm(['admin/file.Import/info'])" @click="edit()">{{ $t('信息') }}</el-button>
      <el-button v-if="hasPerm(['admin/file.Import/dele'])" @click="update('is_delete')">{{ $t('删除') }}</el-button>
      <el-button v-if="hasPerm(['admin/file.Import/disable'])" @click="update('is_disable')">
        {{ $t('禁用') }}
      </el-button>
    </el-col>
    <el-col :span="14">
      <template v-if="hasPerm(['admin/file.Import/update'])">
        <el-button :title="$t('修改备注')" @click="update('remark')">{{ $t('备注') }}</el-button>
        <el-button :title="$t('下载文件')" @click="download">{{ $t('下载') }}</el-button>
      </template>
      <template v-if="hasPerm(['admin/file.Import/recycleReco'])">
        <el-button v-if="query.recycle" @click="update('restore')">{{ $t('恢复') }}</el-button>
      </template>
    </el-col>
    <el-col :span="4">
      <Exports v-if="hasPerm(['admin/file.Import/export'])" :name="name" :api="exportApi" :query="query" :ids="ids" />
      <Imports v-if="hasPerm(['admin/file.Import/import'])" :name="name" :api="importApi" />
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
        <el-form-item v-else-if="field === 'is_disable'" :label="$t('禁用')">
          <ElSwitchWhether v-model="value" />
        </el-form-item>
        <el-form-item v-else-if="field === 'remark'" :label="$t('备注')">
          <el-input v-model="value" :placeholder="$t('请输入备注')" clearable />
        </el-form-item>
        <el-form-item v-else-if="field === 'restore'" :label="$t('恢复')">
          <el-text size="default">{{ $t('从回收站恢复') }}</el-text>
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
  exportApi,
  importApi,
  infoApi,
  recycleRecoApi,
  recycleDeleApi
} from '@/api/file/import'

export default {
  components: {},
  props: {
    name: {
      type: String,
      default: ''
    },
    idkey: {
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
        if (this.query.recycle) {
          api = recycleDeleApi
        }
      } else if (this.field === 'is_disable') {
        api = disableApi
        data = { ids: this.ids, is_disable: this.value ? 1 : 0 }
      } else if (this.field === 'restore') {
        api = recycleRecoApi
        data = { ids: this.ids }
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
    // 下载
    download() {
      const length = this.ids.length
      if (length) {
        for (let index = 0; index < length; index++) {
          const id = this.ids[index]
          infoApi({ [this.idkey]: id })
            .then((res) => {
              const data = res.data
              if (data.status == 2) {
                let file_name = data.file_name
                if (data.import_num) {
                  infoApi({ [this.idkey]: data[this.idkey], file_name: file_name, file_type: 'import' }, true)
                }
                if (data.success_num) {
                  file_name = file_name.substring(0, file_name.length - 5) + '-' + this.$t('成功') + '.xlsx'
                  infoApi({ [this.idkey]: data[this.idkey], file_name: file_name, file_type: 'success' }, true)
                }
                if (data.fail_num) {
                  file_name = file_name.substring(0, file_name.length - 5) + '-' + this.$t('失败') + '.xlsx'
                  infoApi({ [this.idkey]: data[this.idkey], file_name: file_name, file_type: 'fail' }, true)
                }
              }
            })
            .catch(() => {
              ElMessage.warning(this.$t('下载出错'))
            })
        }
      } else {
        this.alert()
      }
    }
  }
}
</script>
