<template>
  <el-button class="mr-3" @click="show()">导入</el-button>
  <el-dialog
    v-model="dialog"
    :title="name"
    top="20vh"
    :before-close="cancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
  >
    <el-form label-width="120px">
      <el-form-item label="导入模板">
        <el-button @click="download">下载{{ name }}模板</el-button>
      </el-form-item>
      <el-form-item label="导入文件">
        <el-col>
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
              <el-button>选择{{ name }}文件</el-button>
            </template>
          </el-upload>
        </el-col>
      </el-form-item>
      <el-form-item label="导入备注">
        <el-input v-model="model.import_remark" type="text" placeholder="请输入备注" clearable />
      </el-form-item>
      <el-form-item label="">
        <el-col><el-text>导入结果可在【导入文件】查看下载</el-text></el-col>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="loading" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
    </template>
  </el-dialog>
  <el-dialog
    v-model="resultDialog"
    :title="resultTitle"
    top="10vh"
    width="75%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
  >
    <el-tabs v-model="resultTab">
      <el-tab-pane label="成功列表" name="success" :style="{ height: resultHeight + 'px' }">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2 :columns="resultColumn" :data="resultSuccess" :width="width" :height="height" />
          </template>
        </el-auto-resizer>
      </el-tab-pane>
      <el-tab-pane label="失败列表" name="fail" :style="{ height: resultHeight + 'px' }">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2 :columns="resultColumn" :data="resultFail" :width="width" :height="height" />
          </template>
        </el-auto-resizer>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { tokenName, tokenValue, datetime } from '@/utils/index'
import { imports } from '@/api/member/member'
import { genFileId } from 'element-plus'
import screenHeight from '@/utils/screen-height'

export default {
  name: 'MemberImport',
  data() {
    return {
      name: '会员导入',
      loading: false,
      dialog: false,
      model: { import_remark: '', import_url: '' },
      importAction: imports(),
      importData: {},
      importFiles: [],
      resultDialog: false,
      resultTitle: '',
      resultTab: 'fail',
      resultSuccess: [],
      resultFail: [],
      resultWidth: 1366,
      resultHeight: screenHeight(320),
      resultColumn: [
        { dataKey: 'nickname', title: '昵称', width: 160 },
        { dataKey: 'username', title: '用户名', width: 160 },
        { dataKey: 'phone', title: '手机', width: 110 },
        { dataKey: 'email', title: '邮箱', width: 220 },
        { dataKey: 'is_super', title: '超会', width: 85 },
        { dataKey: 'is_disable', title: '禁用', width: 85 },
        { dataKey: 'create_time', title: '注册时间', width: 165 },
        { dataKey: 'result_msg', title: '导入结果', width: 400 }
      ]
    }
  },
  created() {
    this.importData[tokenName()] = tokenValue()
  },
  methods: {
    show() {
      this.dialog = true
      this.resultTab = 'fail'
      this.model.import_url = ''
    },
    cancel() {
      this.dialog = false
      this.loading = false
      this.model.import_url = ''
      this.$refs['ref'].clearFiles()
    },
    submit() {
      if (this.importFiles.length <= 0) {
        ElMessage.error(`请选择${this.name}文件`)
      } else {
        this.loading = true
        this.importData['import_remark'] = this.model.import_remark
        this.$refs['ref'].submit()
      }
    },
    download() {
      imports({ file_name: this.name + '模板' + datetime('', '', '-') }, 'get')
    },
    importSuccess(res) {
      this.$refs['ref'].clearFiles()
      if (res.code !== 200) {
        ElMessage.error(res.msg)
      } else {
        ElMessage.success(res.msg)
        this.dialog = false
        this.resultTitle = `${this.name}结果：导入数 ${res.data.import_num}，成功数 ${res.data.success_num}，失败数 ${res.data.fail_num}`
        this.resultDialog = true
        this.resultFail = res.data.fail
        this.resultSuccess = res.data.success
      }
      this.loading = false
    },
    importError() {
      this.loading = false
      this.dialog = false
      ElMessageBox.alert('导入已提交请在【导入文件】查看结果', this.name, {
        callback: () => {}
      })
    },
    importExceed(files) {
      this.$refs['ref'].clearFiles()
      const file = files[0]
      file.uid = genFileId()
      this.$refs['ref'].handleStart(file)
    }
  }
}
</script>
