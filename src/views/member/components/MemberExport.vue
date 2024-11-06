<template>
  <el-button class="mr-3" @click="show()">导出</el-button>
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
      <el-form-item label="导出备注">
        <el-input v-model="model.export_remark" type="text" placeholder="请输入备注" clearable />
      </el-form-item>
      <el-form-item label="">
        <el-col><el-text>导出结果可在【导出文件】查看下载</el-text></el-col>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :loading="loading" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { exports } from '@/api/member/member'

export default {
  name: 'MemberExport',
  components: {},
  props: {
    query: Object
  },
  data() {
    return {
      name: '会员导出',
      loading: false,
      dialog: false,
      model: { export_remark: '' }
    }
  },
  created() {},
  methods: {
    show() {
      this.dialog = true
    },
    cancel() {
      this.dialog = false
    },
    submit() {
      this.loading = true
      exports(Object.assign({}, this.query, this.model))
        .then((res) => {
          this.loading = false
          ElMessage.success(res.msg)
          exports(
            {
              file_path: res.data.file_path,
              file_name: res.data.file_name
            },
            'get'
          )
          this.dialog = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
