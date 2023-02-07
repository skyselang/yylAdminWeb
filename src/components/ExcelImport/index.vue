<template>
  <div style="display:flex;float:right">
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls, .csv" @change="handleClick">
    <el-button :loading="loading" @click="handleUpload">{{ title }}</el-button>
    <el-dialog :title="dialogTitle" :visible.sync="dialogSync" top="5vh" width="70%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="0">
        <el-form-item label="" prop="">
          <el-table v-loading="loading" :data="excelData.results" :height="height">
            <el-table-column v-for="item in excelData.header" :key="item" :prop="item" :label="item" />
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import screenHeight from '@/utils/screen-height'

export default {
  props: {
    limitSize: { type: Number, default: 1 },
    title: { type: String, default: '导入' }
  },
  data() {
    return {
      loading: false,
      height: 580,
      dialogTitle: '导入预览',
      dialogSync: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  created() {
    this.height = screenHeight()
  },
  methods: {
    cancel() {
      this.dialogSync = false
    },
    submit() {
      this.dialogSync = false
      this.$emit('on-import', this.excelData)
    },
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.dialogSync = true
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('只能上传一个文件')
        return
      }
      const rawFile = files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('文件类型仅支持 xlsx、xls、csv')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    beforeUpload(file) {
      const limitSize = this.limitSize
      const fileSize = file.size / 1024 / 1024

      if (fileSize > limitSize) {
        this.$message.error(`文件大小不能大于 ${limitSize} m`)
        return false
      }

      return true
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      for (C = range.s.c; C <= range.e.c; ++C) {
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        let hdr = 'UNKNOWN ' + C
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
</style>
