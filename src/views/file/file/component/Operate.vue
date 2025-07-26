<template>
  <el-row>
    <el-col :span="9">
      <el-upload
        v-if="hasPerm(['admin/file.File/add'])"
        v-model:file-list="uploadFilelist"
        :multiple="true"
        :auto-upload="true"
        :show-file-list="false"
        :action="uploadAction"
        :headers="uploadHeaders"
        :data="uploadData"
        :accept="uploadAccept"
        :limit="uploadLimit"
        :before-upload="uploadBefore"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :on-change="uploadChange"
        :on-exceed="uploadExceed"
        class="inline-block mr-3"
      >
        <el-button type="primary" :title="$t('上传文件')" @click="uploadClear">{{ $t('上传') }}</el-button>
      </el-upload>
      <el-button v-if="hasPerm(['admin/file.File/add'])" @click="add()">{{ $t('添加') }}</el-button>
      <el-button v-if="hasPerm(['admin/file.File/edit'])" @click="edit()">{{ $t('修改') }}</el-button>
      <el-button v-else-if="hasPerm(['admin/file.File/info'])" @click="edit()">{{ $t('信息') }}</el-button>
      <el-button v-if="hasPerm(['admin/file.File/dele']) && !query.recycle" @click="update('is_delete')">
        {{ $t('删除') }}
      </el-button>
      <el-button v-if="hasPerm(['admin/file.File/dele']) && query.recycle" @click="update('is_delete')">
        {{ $t('删除') }}
      </el-button>
      <el-button v-if="hasPerm(['admin/file.File/disable'])" @click="update('is_disable')">{{ $t('禁用') }}</el-button>
    </el-col>
    <el-col :span="12">
      <template v-if="hasPerm(['admin/file.File/update'])">
        <el-button :title="$t('修改编号')" @click="update('unique')">{{ $t('编号') }}</el-button>
        <el-button :title="$t('修改备注')" @click="update('remark')">{{ $t('备注') }}</el-button>
        <el-button :title="$t('修改排序')" @click="update('sort')">{{ $t('排序') }}</el-button>
        <el-button :title="$t('修改分组')" @click="update('group_id')">{{ $t('分组') }}</el-button>
        <el-button :title="$t('修改标签')" @click="update('tag_ids')">{{ $t('标签') }}</el-button>
        <el-button :title="$t('修改域名')" @click="update('domain')">{{ $t('域名') }}</el-button>
        <el-button :title="$t('下载文件')" @click="download">{{ $t('下载') }}</el-button>
      </template>
      <template v-if="hasPerm(['admin/file.File/recycleReco'])">
        <el-button v-if="query.recycle" @click="update('restore')">{{ $t('恢复') }}</el-button>
      </template>
    </el-col>
    <el-col :span="3">
      <Exports v-if="hasPerm(['admin/file.File/export'])" :name="name" :api="exportApi" :query="query" :ids="ids" />
      <Imports v-if="hasPerm(['admin/file.File/import'])" :name="name" :api="importApi" />
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
        <el-form-item v-else-if="field === 'group_id'" :label="$t('分组')">
          <el-select v-model="value" class="w-full" clearable filterable>
            <el-option v-for="v in basedata.groups" :key="v.group_id" :value="v.group_id" :label="v.group_name" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="field === 'tag_ids'" :label="$t('标签')">
          <el-select v-model="value" class="w-full" clearable filterable multiple>
            <el-option v-for="v in basedata.tags" :key="v.tag_id" :value="v.tag_id" :label="v.tag_name" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="field === 'domain'" :label="$t('域名')">
          <el-input v-model="value" :placeholder="$t('请输入', { name: $t('域名') })" clearable />
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
import { hasPerm, screenHeight, uploadData, clipboard } from '@/utils/index'
import {
  deleApi,
  disableApi,
  updateApi,
  exportApi,
  importApi,
  addApi,
  infoApi,
  recycleRecoApi,
  recycleDeleApi
} from '@/api/file/file'

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
        return { groups: [], tags: [], settings: { limit_max: 9, accept_ext: '' } }
      }
    }
  },
  emits: ['list', 'add', 'edit', 'load'],
  data() {
    return {
      height: 600,
      loading: false,
      dialog: false,
      title: '',
      field: '',
      value: '',
      uploadAction: addApi(),
      uploadHeaders: {},
      uploadData: {},
      uploadLimit: 9,
      uploadAccept: '',
      uploadFilelist: [],
      uploadCount: 0,
      uploadNumber: 0
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
      this.uploadHeaders = uploadData()
      this.uploadLimit = this.basedata.settings.limit_max
      this.uploadAccept = this.basedata.settings.accept_ext
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
              const file = res.data
              if (file['storage'] === 'local' && file['add_type'] === 'upload') {
                infoApi({ [this.idkey]: id, file_name: file['file_name'] }, true)
              } else {
                clipboard(file.file_name + '.' + file.file_ext, '文件名已复制')
                setTimeout(() => {
                  window.open(file.file_url, '_blank')
                }, 500)
              }
            })
            .catch(() => {
              ElMessage.warning(this.$t('下载出错'))
            })
        }
      } else {
        this.alert()
      }
    },
    // 上传
    uploadBefore() {
      this.$emit('load', true)
      this.uploadData.add_type = 'upload'
      this.uploadData.group_id = this.query.group_id
      this.uploadData.tag_ids = this.query.tag_ids
    },
    uploadSuccess(res) {
      this.uploadNumber++
      if (res.code === 200) {
        if (this.uploadNumber >= this.uploadCount) {
          this.uploadNumber = this.uploadCount = 0
          this.uploadData = { add_type: 'upload' }
          this.$emit('list')
          ElMessage.success(res.msg)
        }
      } else {
        if (this.uploadNumber >= this.uploadCount) {
          this.$emit('load', false)
        }
        ElMessage.error(res.msg)
      }
    },
    uploadError(res) {
      this.$emit('load', false)
      ElMessage.error(res.msg || this.$t('上传出错'))
    },
    uploadChange(file, fileList) {
      this.$emit('load', true)
      this.uploadCount = fileList.length
      if (this.uploadNumber >= this.uploadCount) {
        this.$.emit('load', false)
      }
    },
    uploadExceed() {
      ElMessage.error(this.$t('每次最多只能选择个文件', { name: this.uploadLimit }))
    },
    uploadClear() {
      this.uploadNumber = this.uploadCount = 0
      this.uploadFilelist = []
    }
  }
}
</script>
