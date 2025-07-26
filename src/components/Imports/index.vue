<template>
  <el-button class="mr-3" @click="show">{{ $t('导入') }}</el-button>
  <el-dialog
    v-model="dialog"
    :title="title"
    :before-close="cancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    center
    top="20vh"
  >
    <el-scrollbar :height="height">
      <el-form label-width="120px">
        <el-form-item :label="$t('导入模板')">
          <el-button :loading="loading" @click="downloadTpl">{{ $t('下载模板', { name: name }) }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('导入文件')">
          <el-col class="h-20">
            <el-upload
              ref="ref"
              v-model:file-list="importFiles"
              name="import_file"
              accept=".xlsx"
              :limit="1"
              :action="importAction"
              :data="importData"
              :auto-upload="false"
              :on-success="importSuccess"
              :on-error="importError"
              :on-exceed="importExceed"
            >
              <template #trigger>
                <el-button :loading="loading">{{ $t('选择文件', { name: name }) }}</el-button>
              </template>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('是否更新')">
          <ElSwitchWhether v-model="model.is_update" />
          <el-text size="default">{{ $t('如果ID存在是否更新数据') }}</el-text>
        </el-form-item>
        <el-form-item :label="$t('备注')">
          <el-input v-model="model.remark" :placeholder="$t('请输入备注')" clearable />
        </el-form-item>
        <el-form-item :label="$t('提示')">
          <el-col>
            <el-text size="default">{{ $t('导入结果可在导入文件查看下载') }}</el-text>
          </el-col>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button :loading="loading" @click="cancel">{{ $t('取消') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </template>
  </el-dialog>
  <el-dialog
    v-model="resultDialog"
    :title="resultTitle"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    width="76%"
    top="10vh"
  >
    <el-tabs v-model="resultTab">
      <el-tab-pane :label="resultSuccessLabel" name="success" :style="{ height: resultHeight + 'px' }" lazy>
        <el-auto-resizer>
          <template #default="scope">
            <el-table-v2
              :columns="resultColumnSuccess"
              :data="resultSuccess"
              :width="scope.width"
              :height="scope.height"
              :fixed="false"
            />
          </template>
        </el-auto-resizer>
      </el-tab-pane>
      <el-tab-pane :label="resultFailLabel" name="fail" :style="{ height: resultHeight + 'px' }" lazy>
        <el-auto-resizer>
          <template #default="scope">
            <el-table-v2
              :columns="resultColumnFail"
              :data="resultFail"
              :width="scope.width"
              :height="scope.height"
              :fixed="false"
            />
          </template>
        </el-auto-resizer>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { screenHeight, uploadData } from '@/utils/index'
import { genFileId } from 'element-plus'

export default {
  name: 'Imports',
  props: {
    name: {
      type: String,
      default: ''
    },
    api: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      height: 600,
      loading: false,
      dialog: false,
      title: '',
      model: { is_update: 0, remark: '' },
      importAction: '',
      importData: {},
      importFiles: [],
      resultDialog: false,
      resultTitle: '',
      resultTab: 'fail',
      resultSuccess: [],
      resultFail: [],
      resultSuccessLabel: '',
      resultFailLabel: '',
      resultHeight: 840,
      resultColumnSuccess: [],
      resultColumnFail: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.height = screenHeight(600)
      this.resultHeight = screenHeight(320)
      this.importData = uploadData()
      this.importAction = this.api()
      this.resultTitle = this.$t('导入结果')
    },
    show() {
      this.dialog = true
      this.resultTab = 'fail'
      this.title = this.name + '：' + this.$t('导入')
    },
    cancel() {
      this.dialog = false
      this.loading = false
      this.$refs['ref'].clearFiles()
      this.title = ''
    },
    submit() {
      if (this.importFiles.length <= 0) {
        ElMessage.error(`${this.$t('请选择文件')}：${this.name}`)
      } else {
        this.loading = true
        Object.assign(this.importData, this.model)
        this.$refs['ref'].submit()
      }
    },
    downloadTpl() {
      this.loading = true
      this.api({}, 'get')
        .then((res) => {
          this.api({ file_path: res.data.file_path, file_name: res.data.file_name }, 'get')
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.loading = false
        })
    },
    importSuccess(res) {
      this.$refs['ref'].clearFiles()
      if (res.code !== 200) {
        ElMessage({
          message: res.msg || 'Server error',
          type: 'error',
          showClose: true,
          duration: 60000,
          grouping: true
        })
      } else {
        ElMessage.success(res.msg)
        this.dialog = false
        this.resultTitle = `${this.title}，${this.$t('结果')}；${this.$t('导入')}：${res.data.import_num}，
        ${this.$t('成功')}：${res.data.success_num}，${this.$t('失败')}：${res.data.fail_num}`
        this.resultDialog = true
        this.importColumn(res.data.header)
        this.resultFail = res.data.fail
        this.resultSuccess = res.data.success
        this.resultSuccessLabel = this.$t('成功') + '：' + res.data.success_num
        this.resultFailLabel = this.$t('失败') + '：' + res.data.fail_num
        if (this.resultFail.length == 0) {
          this.resultTab = 'success'
        }
      }
      this.loading = false
    },
    importError() {
      this.loading = false
      this.dialog = false
      ElMessageBox.alert(this.$t('导入已提交请在导入文件查看结果'), this.title, { callback: () => {} })
    },
    importExceed(files) {
      this.$refs['ref'].clearFiles()
      const file = files[0]
      file.uid = genFileId()
      this.$refs['ref'].handleStart(file)
    },
    importColumn(header) {
      let columnSuccess = []
      let columnFail = []
      const lenght = header.length
      for (let index = 0; index < lenght; index++) {
        const temp = header[index]
        const column = {
          dataKey: temp.field,
          title: temp.name,
          maxWidth: 200,
          minWidth: 100,
          width: temp['width'] * 5
        }
        if (temp['index'] == -1) {
          let resultMsgSuccess = JSON.parse(JSON.stringify(column))
          resultMsgSuccess['style'] = { color: '#409EFF' }
          columnSuccess.unshift(resultMsgSuccess)
          let resultMsgFail = JSON.parse(JSON.stringify(column))
          resultMsgFail['style'] = { color: '#F56C6C' }
          columnFail.unshift(resultMsgFail)
        } else {
          columnSuccess.push(column)
          columnFail.push(column)
        }
      }
      this.resultColumnSuccess = columnSuccess
      this.resultColumnFail = columnFail
    }
  }
}
</script>
