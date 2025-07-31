<template>
  <el-button class="mr-3" @click="exports">{{ $t('导出') }}</el-button>
  <el-dialog
    v-model="dialog"
    :title="title"
    :before-close="cancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    center
    align-center
  >
    <el-scrollbar :height="height">
      <el-form label-width="120px">
        <el-form-item :label="$t('备注')">
          <el-col>
            <el-input v-model="model.remark" :placeholder="$t('请输入备注')" clearable />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('提示')">
          <el-col>
            <el-text size="default">{{ $t('导出结果可在导出文件查看下载') }}</el-text>
          </el-col>
        </el-form-item>
        <el-form-item label="ID">
          <el-col v-if="ids.length">
            <el-text size="default">{{ ids.toString() }}</el-text>
          </el-col>
          <el-col v-else>
            <el-text size="default">{{ $t('未选择将导出所有查询结果') }}</el-text>
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
import { screenHeight, getTimeout } from '@/utils/index'

export default {
  name: 'Exports',
  props: {
    name: {
      type: String,
      default: ''
    },
    api: {
      type: Function,
      required: true
    },
    query: {
      type: Object,
      default() {
        return {}
      }
    },
    ids: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      height: 600,
      loading: false,
      dialog: false,
      title: '',
      model: { remark: '' }
    }
  },
  created() {
    this.height = screenHeight(600)
  },
  methods: {
    exports() {
      this.dialog = true
      this.title = this.name + '：' + this.$t('导出')
    },
    cancel() {
      this.dialog = false
      this.title = ''
    },
    submit() {
      let startTime = Date.now()
      this.loading = true
      this.api(Object.assign({}, this.query, this.model, { ids: this.ids }))
        .then((res) => {
          this.loading = false
          this.dialog = false
          ElMessage.success(res.msg)
          this.api({ file_path: res.data.file_path, file_name: res.data.file_name }, 'get')
        })
        .catch((res) => {
          this.loading = false
          const endTime = Date.now()
          const time = (endTime - startTime) / 1000
          let timeout = getTimeout()
          if (timeout > 60) {
            timeout = 60
          }
          if (time >= timeout) {
            this.dialog = false
            ElMessageBox.alert(this.$t('导出已提交请在导出文件查看结果'), this.title, { callback: () => {} })
          } else {
            ElMessage({
              message: res.msg || 'Server error',
              type: 'error',
              showClose: true,
              duration: 0,
              grouping: true
            })
          }
        })
    }
  }
}
</script>
