<template>
  <div class="app-container">
    <el-card>
      <el-form
        ref="ref"
        :model="model"
        :rules="rules"
        label-width="120px"
      >
        <el-tabs>
          <el-tab-pane label="基本信息" class="dialog-body" :style="{ height: height + 'px' }">
            <el-row>
              <el-col :span="16">
                <el-form-item label="favicon" prop="favicon_id">
                  <el-col :span="12" style="height: 100px">
                    <el-image
                      v-if="model.favicon_url"
                      style="height: 100px"
                      fit="contain"
                      :src="model.favicon_url"
                      :preview-src-list="[model.favicon_url]"
                      title="点击看大图"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-button @click="fileUpload('favicon', '上传favicon')">上传favicon</el-button>
                    <el-button @click="fileDelete('favicon')">删除</el-button>
                    <br>
                    图片小于 50 KB，jpg、png、ico格式，128 x 128。
                  </el-col>
                </el-form-item>
                <el-form-item label="logo" prop="logo_id">
                  <el-col :span="12" style="height: 100px">
                    <el-image
                      v-if="model.logo_url"
                      style="height: 100px"
                      fit="contain"
                      :src="model.logo_url"
                      :preview-src-list="[model.logo_url]"
                      title="点击看大图"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-button @click="fileUpload('logo', '上传logo')">上传logo</el-button>
                    <el-button @click="fileDelete('logo')">删除</el-button>
                    <br>
                    图片小于 200 KB，jpg、png格式。
                  </el-col>
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
                    :autosize="{ minRows: 2, maxRows: 20 }"
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
          </el-tab-pane>
          <el-tab-pane label="联系信息" class="dialog-body" :style="{ height: height + 'px' }">
            <el-row>
              <el-col :span="16">
                <el-form-item label="公众号码" prop="offi_id">
                  <el-col :span="12" style="height: 100px">
                    <el-image
                      v-if="model.offi_url"
                      style="height: 100px"
                      fit="contain"
                      :src="model.offi_url"
                      :preview-src-list="[model.offi_url]"
                      title="点击看大图"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-button @click="fileUpload('offi', '上传公众号码')">上传公众号码</el-button>
                    <el-button @click="fileDelete('offi')">删除</el-button>
                    <br>
                    图片小于 200 KB，jpg、png格式。
                  </el-col>
                </el-form-item>
                <el-form-item label="小程序码" prop="mini_id">
                  <el-col :span="12" style="height: 100px">
                    <el-image
                      v-if="model.mini_url"
                      style="height: 100px"
                      fit="contain"
                      :src="model.mini_url"
                      :preview-src-list="[model.mini_url]"
                      title="点击看大图"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-button @click="fileUpload('mini', '上传小程序码')">上传小程序码</el-button>
                    <el-button @click="fileDelete('mini')">删除</el-button>
                    <br>
                    图片小于 200 KB，jpg、png格式。
                  </el-col>
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
          </el-tab-pane>
          <el-tab-pane label="其它信息" class="dialog-body" :style="{ height: height + 'px' }">
            <el-row>
              <el-col :span="16">
                <el-form-item label="内容默认图片" prop="content_default_img_id">
                  <el-col :span="12" style="height: 100px">
                    <el-image
                      v-if="model.content_default_img_url"
                      style="height: 100px"
                      fit="contain"
                      :src="model.content_default_img_url"
                      :preview-src-list="[model.content_default_img_url]"
                      title="点击看大图"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-button @click="fileUpload('content_default_img', '上传内容默认图片')">
                      上传内容默认图片
                    </el-button>
                    <el-button @click="fileDelete('content_default_img')">删除</el-button>
                    <br>
                    图片小于 100 KB，jpg、png格式。
                  </el-col>
                </el-form-item>
                <el-form-item label="" prop="content_default_img_open">
                  <el-col :span="12">
                    <el-switch v-model="model.content_default_img_open" :active-value="1" :inactive-value="0" />
                  </el-col>
                  <el-col :span="12">是否开启内容默认图片。</el-col>
                </el-form-item>
                <el-form-item label="分类默认图片" prop="category_default_img_id">
                  <el-col :span="12" style="height: 100px">
                    <el-image
                      v-if="model.category_default_img_url"
                      style="height: 100px"
                      fit="contain"
                      :src="model.category_default_img_url"
                      :preview-src-list="[model.category_default_img_url]"
                      title="点击看大图"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-button @click="fileUpload('category_default_img', '上传分类默认图片')">
                      上传分类默认图片
                    </el-button>
                    <el-button @click="fileDelete('category_default_img')">删除</el-button>
                    <br>
                    图片小于 100 KB，jpg、png格式。
                  </el-col>
                </el-form-item>
                <el-form-item label="" prop="category_default_img_open">
                  <el-col :span="12">
                    <el-switch v-model="model.category_default_img_open" :active-value="1" :inactive-value="0" />
                  </el-col>
                  <el-col :span="12">是否开启分类默认图片。</el-col>
                </el-form-item>
                <el-form-item label="标签默认图片" prop="tag_default_img_id">
                  <el-col :span="12" style="height: 100px">
                    <el-image
                      v-if="model.tag_default_img_url"
                      style="height: 100px"
                      fit="contain"
                      :src="model.tag_default_img_url"
                      :preview-src-list="[model.tag_default_img_url]"
                      title="点击看大图"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </el-image>
                  </el-col>
                  <el-col :span="12">
                    <el-button @click="fileUpload('tag_default_img', '上传标签默认图片')">
                      上传标签默认图片
                    </el-button>
                    <el-button @click="fileDelete('tag_default_img')">删除</el-button>
                    <br>
                    图片小于 100 KB，jpg、png格式。
                  </el-col>
                </el-form-item>
                <el-form-item label="" prop="tag_default_img_open">
                  <el-col :span="12">
                    <el-switch v-model="model.tag_default_img_open" :active-value="1" :inactive-value="0" />
                  </el-col>
                  <el-col :span="12">是否开启标签默认图片。</el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button :loading="loading" @click="refresh()">刷新</el-button>
          <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      :title="fileTitle"
      :visible.sync="fileDialog"
      width="80%"
      top="1vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import FileManage from '@/components/FileManage'
import { info, edit } from '@/api/content/setting'

export default {
  name: 'ContentSetting',
  components: { FileManage },
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
        qq: '',
        wechat: '',
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
      rules: {},
      fileDialog: false,
      fileField: 'logo',
      fileTitle: '文件管理'
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
          this.$message.success(res.msg)
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
              this.$message.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.$message.error('请完善必填项（带红色星号*）')
        }
      })
    },
    // 上传图片
    fileUpload(field, title = '') {
      this.fileField = field
      this.fileTitle = title
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(fileList) {
      this.fileDialog = false
      const fileField = this.fileField
      const fileLength = fileList.length
      if (fileLength) {
        const i = fileLength - 1
        const file_id = fileList[i]['file_id']
        const file_url = fileList[i]['file_url']
        if (fileField === 'favicon') {
          this.model.favicon_id = file_id
          this.model.favicon_url = file_url
        } else if (fileField === 'logo') {
          this.model.logo_id = file_id
          this.model.logo_url = file_url
        } else if (fileField === 'offi') {
          this.model.offi_id = file_id
          this.model.offi_url = file_url
        } else if (fileField === 'mini') {
          this.model.mini_id = file_id
          this.model.mini_url = file_url
        } else if (fileField === 'content_default_img') {
          this.model.content_default_img_id = file_id
          this.model.content_default_img_url = file_url
        } else if (fileField === 'category_default_img') {
          this.model.category_default_img_id = file_id
          this.model.category_default_img_url = file_url
        } else if (fileField === 'tag_default_img') {
          this.model.tag_default_img_id = file_id
          this.model.tag_default_img_url = file_url
        }
      }
    },
    fileDelete(field = '') {
      if (field === 'favicon') {
        this.model.favicon_id = 0
        this.model.favicon_url = ''
      } else if (field === 'logo') {
        this.model.logo_id = 0
        this.model.logo_url = ''
      } else if (field === 'offi') {
        this.model.offi_id = 0
        this.model.offi_url = ''
      } else if (field === 'mini') {
        this.model.mini_id = 0
        this.model.mini_url = ''
      } else if (field === 'content_default_img') {
        this.model.content_default_img_id = 0
        this.model.content_default_img_url = ''
      } else if (field === 'category_default_img') {
        this.model.category_default_img_id = 0
        this.model.category_default_img_url = ''
      } else if (field === 'tag_default_img') {
        this.model.tag_default_img_id = 0
        this.model.tag_default_img_url = ''
      }
    }
  }
}
</script>
