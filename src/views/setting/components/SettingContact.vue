<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
    <el-row>
      <el-col :span="16">
        <el-form-item label="公众号码" prop="offi_id">
          <FileImage
            v-model="model.offi_id"
            :file-url="model.offi_url"
            file-title="上传公众号码"
            :height="100"
            upload
          />
        </el-form-item>
        <el-form-item label="小程序码" prop="mini_id">
          <FileImage
            v-model="model.mini_id"
            :file-url="model.mini_url"
            file-title="上传小程序码"
            :height="100"
            upload
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="model.address" placeholder="address" clearable />
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="model.tel" placeholder="tel" clearable />
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model="model.fax" placeholder="fax" clearable />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="model.mobile" placeholder="mobile" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="model.email" placeholder="email" clearable />
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="model.wechat" placeholder="wechat" clearable />
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="model.qq" placeholder="qq" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button :loading="loading" @click="refresh()">刷新</el-button>
      <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { info, edit } from '@/api/setting/setting'

export default {
  name: 'SettingContact',
  data() {
    return {
      name: '联系信息',
      loading: false,
      model: {
        offi_id: 0,
        offi_url: '',
        mini_id: 0,
        mini_url: '',
        address: '',
        tel: '',
        fax: '',
        mobile: '',
        email: '',
        wechat: '',
        qq: ''
      },
      rules: {}
    }
  },
  created() {
    this.info()
  },
  methods: {
    // 信息
    info() {
      info().then((res) => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      info()
        .then((res) => {
          this.model = res.data
          this.loading = false
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          edit(this.model)
            .then((res) => {
              this.loading = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
