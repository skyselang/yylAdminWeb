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
                    :height="50"
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
        <el-tab-pane label="其它信息">
          <el-scrollbar native :height="height">
            <el-row>
              <el-col :span="16">
                <el-form-item label="前台内容" prop="is_api_content">
                  <el-switch v-model="model.is_api_content" :active-value="1" :inactive-value="0" />
                  <span> 是否开启前台内容功能</span>
                </el-form-item>
                <el-form-item label="内容默认图片" prop="content_default_img_id">
                  <FileImage
                    v-model="model.content_default_img_id"
                    :file-url="model.content_default_img_url"
                    file-title="上传内容默认图片"
                    file-tip="图片小于 100 KB，jpg、png格式。"
                    :height="100"
                    upload
                  />
                </el-form-item>
                <el-form-item prop="content_default_img_open">
                  <el-col :span="12">
                    <el-switch
                      v-model="model.content_default_img_open"
                      :active-value="1"
                      :inactive-value="0"
                    />
                  </el-col>
                  <el-col :span="12">是否开启内容默认图片。</el-col>
                </el-form-item>
                <el-form-item label="分类默认图片" prop="category_default_img_id">
                  <FileImage
                    v-model="model.category_default_img_id"
                    :file-url="model.category_default_img_url"
                    file-title="上传分类默认图片"
                    file-tip="图片小于 100 KB，jpg、png格式。"
                    :height="100"
                    upload
                  />
                </el-form-item>
                <el-form-item prop="category_default_img_open">
                  <el-col :span="12">
                    <el-switch
                      v-model="model.category_default_img_open"
                      :active-value="1"
                      :inactive-value="0"
                    />
                  </el-col>
                  <el-col :span="12">是否开启分类默认图片。</el-col>
                </el-form-item>
                <el-form-item label="标签默认图片" prop="tag_default_img_id">
                  <FileImage
                    v-model="model.tag_default_img_id"
                    :file-url="model.tag_default_img_url"
                    file-title="上传标签默认图片"
                    file-tip="图片小于 100 KB，jpg、png格式。"
                    :height="100"
                    upload
                  />
                </el-form-item>
                <el-form-item prop="tag_default_img_open">
                  <el-col :span="12">
                    <el-switch
                      v-model="model.tag_default_img_open"
                      :active-value="1"
                      :inactive-value="0"
                    />
                  </el-col>
                  <el-col :span="12">是否开启标签默认图片。</el-col>
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
import { info, edit } from '@/api/content/setting'

export default {
  name: 'ContentSetting',
  data() {
    return {
      name: '内容设置',
      height: 680,
      loading: false,
      model: {
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
        qq: '',
        is_api_content: 0,
        content_default_img_id: 0,
        content_default_img_url: '',
        content_default_img_open: 0,
        category_default_img_id: 0,
        category_default_img_url: '',
        category_default_img_open: 0,
        tag_default_img_id: 0,
        tag_default_img_url: '',
        tag_default_img_open: 0
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
