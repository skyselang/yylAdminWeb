<template>
  <div class="app-container">
    <!-- 内容设置 -->
    <el-card>
      <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
        <el-tabs>
          <el-tab-pane label="基本信息" name="" class="dialog-body" :style="{ height: height + 'px' }">
            <el-form-item label="favicon" prop="favicon_id">
              <el-col :span="6">
                <el-image class="ya-height-100" :src="model.favicon_url" :preview-src-list="[model.favicon_url]" title="点击看大图">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-col>
              <el-col :span="6">
                <el-button size="mini" @click="fileUpload('favicon', '上传favicon')">上传favicon</el-button>
                <el-button size="mini" @click="fileDelete('favicon')">删除</el-button>
                <p>图片小于 50 KB，jpg、png、ico格式，128 x 128。</p>
              </el-col>
            </el-form-item>
            <el-form-item label="logo" prop="logo_id">
              <el-col :span="6">
                <el-image class="ya-height-100" :src="model.logo_url" :preview-src-list="[model.logo_url]" title="点击看大图">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-col>
              <el-col :span="6">
                <el-button size="mini" @click="fileUpload('logo', '上传logo')">上传logo</el-button>
                <el-button size="mini" @click="fileDelete('logo')">删除</el-button>
                <p>图片小于 200 KB，jpg、png格式。</p>
              </el-col>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-col :span="12">
                <el-input v-model="model.name" placeholder="name" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-col :span="12">
                <el-input v-model="model.title" placeholder="title" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="关键词" prop="keywords">
              <el-col :span="12">
                <el-input v-model="model.keywords" placeholder="keywords" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-col :span="12">
                <el-input v-model="model.description" type="textarea" placeholder="description" :autosize="{ minRows: 2, maxRows: 20 }" />
              </el-col>
            </el-form-item>
            <el-form-item label="备案号" prop="icp">
              <el-col :span="12">
                <el-input v-model="model.icp" placeholder="icp" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="版权" prop="copyright">
              <el-col :span="12">
                <el-input v-model="model.copyright" placeholder="copyright" clearable />
              </el-col>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="联系信息" name="" class="dialog-body" :style="{ height: height + 'px' }">
            <el-form-item label="公众号" prop="offi_id">
              <el-col :span="12">
                <el-col :span="12">
                  <el-image class="ya-height-100" :src="model.offi_url" :preview-src-list="[model.offi_url]" title="点击看大图">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                </el-col>
                <el-col :span="12">
                  <el-button size="mini" @click="fileUpload('offi', '上传二维码')">上传二维码</el-button>
                  <el-button size="mini" @click="fileDelete('offi')">删除</el-button>
                  <p>图片小于 200 KB，jpg、png格式。</p>
                </el-col>
              </el-col>
            </el-form-item>
            <el-form-item label="小程序" prop="mini_id">
              <el-col :span="12">
                <el-col :span="12">
                  <el-image class="ya-height-100" :src="model.mini_url" :preview-src-list="[model.mini_url]" title="点击看大图">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                </el-col>
                <el-col :span="12">
                  <el-button size="mini" @click="fileUpload('mini', '上传小程序码')">上传小程序码</el-button>
                  <el-button size="mini" @click="fileDelete('mini')">删除</el-button>
                  <p>图片小于 200 KB，jpg、png格式。</p>
                </el-col>
              </el-col>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-col :span="12">
                <el-input v-model="model.address" placeholder="address" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="电话" prop="tel">
              <el-col :span="12">
                <el-input v-model="model.tel" placeholder="tel" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="传真" prop="fax">
              <el-col :span="12">
                <el-input v-model="model.fax" placeholder="fax" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-col :span="12">
                <el-input v-model="model.mobile" placeholder="mobile" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-col :span="12">
                <el-input v-model="model.email" placeholder="email" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="微信" prop="wechat">
              <el-col :span="12">
                <el-input v-model="model.wechat" placeholder="wechat" clearable />
              </el-col>
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
              <el-col :span="12">
                <el-input v-model="model.qq" placeholder="qq" clearable />
              </el-col>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="设置管理" name="" class="dialog-body" :style="{ height: height + 'px' }">
            <el-form-item label="反馈管理" prop="is_feedback">
              <el-col :span="3">
                <el-switch v-model="model.is_feedback" :active-value="1" :inactive-value="0" />
              </el-col>
              <el-col :span="21">
                <span>反馈是否开启。关闭后无法提交反馈。</span>
              </el-col>
            </el-form-item>
            <el-form-item label="自定义设置">
              <el-col :span="3">
                键名
              </el-col>
              <el-col :span="5">
                键值
              </el-col>
              <el-col :span="6">
                说明
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="add()">增加</el-button>
              </el-col>
            </el-form-item>
            <el-form-item v-for="(item, index) in model.diy_config" :key="index" label="">
              <el-col :span="3">
                <el-input v-model="item.config_key" clearable placeholder="请输入键名" />
              </el-col>
              <el-col :span="5">
                <el-input v-model="item.config_val" clearable placeholder="请输入键值" />
              </el-col>
              <el-col :span="6">
                <el-input v-model="item.config_desc" clearable placeholder="请输入说明" />
              </el-col>
              <el-col :span="2">
                <el-button type="text" @click="dele(index)">删除</el-button>
              </el-col>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button :loading="loading" @click="refresh()">刷新</el-button>
          <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 文件管理 -->
    <el-dialog :title="fileTitle" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import FileManage from '@/components/FileManage'
import { info, edit } from '@/api/setting/setting'

export default {
  name: 'SettingSetting',
  components: { FileManage },
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
        qq: '',
        wechat: '',
        is_feedback: 1,
        diy_config: []
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
    // 增加
    add() {
      this.model.diy_config.push({ config_key: '', config_val: '', config_desc: '' })
    },
    // 删除
    dele(index) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.model.diy_config.splice(index, 1)
      }).catch(() => { })
    },
    // 刷新
    refresh() {
      this.loading = true
      info().then((res) => {
        this.model = res.data
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          edit(this.model).then((res) => {
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message.error('请完善必填项*')
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
    fileSubmit(filelists) {
      this.fileDialog = false
      this.fileTitle = ''
      if (this.fileField === 'favicon') {
        this.model.favicon_id = filelists[0]['file_id']
        this.model.favicon_url = filelists[0]['file_url']
      } else if (this.fileField === 'logo') {
        this.model.logo_id = filelists[0]['file_id']
        this.model.logo_url = filelists[0]['file_url']
      } else if (this.fileField === 'offi') {
        this.model.offi_id = filelists[0]['file_id']
        this.model.offi_url = filelists[0]['file_url']
      } else if (this.fileField === 'mini') {
        this.model.mini_id = filelists[0]['file_id']
        this.model.mini_url = filelists[0]['file_url']
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
      }
    }
  }
}
</script>

<style scoped>

</style>
