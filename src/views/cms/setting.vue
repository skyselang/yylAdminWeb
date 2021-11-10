<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="18" :md="12">
          <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
            <el-tabs>
              <el-tab-pane label="基本信息" name="">
                <el-form-item label="logo" prop="logo_id">
                  <el-row :gutter="0">
                    <el-col :span="10">
                      <el-image style="width:100px; height:100px;" :src="model.logo_url" :preview-src-list="[model.logo_url]" title="点击查看大图">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                    </el-col>
                    <el-col :span="14">
                      <el-button size="mini" @click="fileUpload('logo', '上传logo')">上传logo</el-button>
                      <br>
                      <span>jpg、png图片，小于200KB。</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                  <el-input v-model="model.name" clearable placeholder="name" />
                </el-form-item>
                <el-form-item label="标题" prop="title">
                  <el-input v-model="model.title" clearable placeholder="title" />
                </el-form-item>
                <el-form-item label="关键词" prop="keywords">
                  <el-input v-model="model.keywords" clearable placeholder="keywords" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                  <el-input v-model="model.description" type="textarea" clearable placeholder="description" />
                </el-form-item>
                <el-form-item label="备案号" prop="icp">
                  <el-input v-model="model.icp" clearable placeholder="icp" />
                </el-form-item>
                <el-form-item label="版权" prop="copyright">
                  <el-input v-model="model.copyright" clearable placeholder="copyright" />
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="联系信息" name="">
                <el-form-item label="公众号" prop="off_acc_id">
                  <el-row :gutter="0">
                    <el-col :span="10">
                      <el-image style="width:100px; height:100px;" :src="model.off_acc_url" :preview-src-list="[model.off_acc_url]" title="点击查看大图">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                    </el-col>
                    <el-col :span="14">
                      <el-button size="mini" @click="fileUpload('off_acc', '上传二维码')">上传二维码</el-button>
                      <br>
                      <span>jpg、png图片，小于200KB。</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                  <el-input v-model="model.address" clearable placeholder="address" />
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                  <el-input v-model="model.tel" clearable placeholder="tel" />
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="model.mobile" clearable placeholder="mobile" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="model.email" clearable placeholder="email" />
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                  <el-input v-model="model.qq" clearable placeholder="qq" />
                </el-form-item>
                <el-form-item label="微信" prop="wechat">
                  <el-input v-model="model.wechat" clearable placeholder="wechat" />
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <el-form-item>
              <el-button :loading="loading" @click="refresh()">刷新</el-button>
              <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :title="fileTitle" :visible.sync="fileDialog" width="80%" top="1vh">
      <file-manage file-type="image" @file-lists="fileLists" />
    </el-dialog>
  </div>
</template>

<script>
import FileManage from '@/components/FileManage'
import { info, edit } from '@/api/cms/setting'

export default {
  name: 'CmsSetting',
  components: { FileManage },
  data() {
    return {
      loading: false,
      model: {
        logo_id: '',
        logo_url: '',
        name: '',
        title: '',
        keywords: '',
        description: '',
        icp: '',
        copyright: '',
        address: '',
        tel: '',
        mobile: '',
        email: '',
        qq: '',
        wechat: '',
        off_acc_id: '',
        off_acc_url: ''
      },
      fileDialog: false,
      fileField: 'logo',
      fileTitle: '文件管理',
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
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
              this.info()
              this.loading = false
              this.$message.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.$message.error('请完善必填项*')
        }
      })
    },
    // 上传logo、公众号
    fileUpload(field, title = '') {
      this.fileField = field
      this.fileTitle = title
      this.fileDialog = true
    },
    fileLists(filelists) {
      this.fileDialog = false
      this.fileTitle = ''
      if (this.fileField === 'logo') {
        this.model.logo_id = filelists[0]['file_id']
        this.model.logo_url = filelists[0]['file_url']
      } else if (this.fileField === 'off_acc') {
        this.model.off_acc_id = filelists[0]['file_id']
        this.model.off_acc_url = filelists[0]['file_url']
      }
    }
  }
}
</script>

<style scoped>

</style>
