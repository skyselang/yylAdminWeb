<template>
  <div class="app-container">
    <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
      <el-tabs>
        <el-tab-pane label="基本信息">
          <el-scrollbar native :height="height">
            <el-row>
              <el-col :span="16">
                <el-form-item label="favicon" prop="favicon_id">
                  <FileImage
                    v-model="model.favicon_id"
                    :file-url="model.favicon_url"
                    file-title="上传favicon"
                    file-tip="图片小于 50 KB，jpg、png、ico格式，128 x 128。"
                    :height="100"
                    upload
                  />
                </el-form-item>
                <el-form-item label="logo" prop="logo_id">
                  <FileImage
                    v-model="model.logo_id"
                    :file-url="model.logo_url"
                    file-title="上传logo"
                    :height="100"
                    upload
                  />
                </el-form-item>
                <el-form-item label="名称" prop="name">
                  <el-input v-model="model.name" placeholder="name" clearable />
                </el-form-item>
                <el-form-item label="标题" prop="title">
                  <el-input v-model="model.title" placeholder="title" clearable />
                </el-form-item>
                <el-form-item label="关键词" prop="keywords">
                  <el-input v-model="model.keywords" placeholder="keywords" clearable />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                  <el-input
                    v-model="model.description"
                    type="textarea"
                    autosize
                    placeholder="description"
                  />
                </el-form-item>
                <el-form-item label="备案号" prop="icp">
                  <el-input v-model="model.icp" placeholder="icp" clearable />
                </el-form-item>
                <el-form-item label="版权" prop="copyright">
                  <el-input v-model="model.copyright" placeholder="copyright" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="联系信息">
          <el-scrollbar native :height="height">
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
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button :loading="loading" @click="refresh()">刷新</el-button>
        <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { info, edit } from '@/api/setting/setting'

export default {
  name: 'SettingSetting',
  data() {
    return {
      name: '设置管理',
      height: 680,
      loading: false,
      model: {
        setting_id: '',
        favicon_id: 0,
        favicon_url: '',
        logo_id: 0,
        logo_url: '',
        name: '',
        title: '',
        keywords: '',
        description: '',
        icp: '',
        copyright: '',
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
    this.height = screenHeight(270)
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
        } else {
          ElMessage.error('请完善必填项（带红色星号*）')
        }
      })
    }
  }
}
</script>
