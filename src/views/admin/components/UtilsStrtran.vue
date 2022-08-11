<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <div slot="header">
      <span>字符串转换</span>
    </div>
    <div>
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px">
        <el-form-item label="字符串" prop="str">
          <el-input v-model="model.str" type="textarea" placeholder="请输入字符串" clearable />
        </el-form-item>
        <el-form-item label="长度" prop="len">
          <el-input v-model="model.len">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.len, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="小写" prop="lower">
          <el-input v-model="model.lower">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.lower, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="大写" prop="upper">
          <el-input v-model="model.upper">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.upper, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="翻转" prop="rev">
          <el-input v-model="model.rev">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.rev, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="MD5" prop="md5">
          <el-input v-model="model.md5">
            <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.md5, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="clear()">清空</el-button>
          <el-button type="primary" @click="submit()">转换</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import clip from '@/utils/clipboard'
import { strtran } from '@/api/admin/utils'

export default {
  name: 'AdminUtilsStrtran',
  components: {},
  data() {
    return {
      name: '字符串转换',
      height: 680,
      model: {
        str: '',
        len: '',
        lower: '',
        upper: '',
        rev: '',
        md5: ''
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(180)
  },
  methods: {
    clear() {
      this.model = this.$options.data().model
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          strtran({
            str: this.model.str
          }).then(res => {
            this.model = res.data
          })
        }
      })
    },
    copy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message.error('请转换字符串')
      }
    }
  }
}
</script>

<style scoped>

</style>
