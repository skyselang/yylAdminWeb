<template>
  <div class="app-container">
    <!-- 内容 -->
    <el-card class="box-card">
      <el-row class="dialog-body" :style="{height:height+'px'}">
        <el-col :xs="24" :sm="18" :md="16">
          <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
            <el-tabs>
              <el-tab-pane label="基本信息" name="">
                <el-form-item label="logo" prop="logo_id">
                  <el-row>
                    <el-col :span="10">
                      <el-image class="ya-height-100" fit="scale-down" :src="model.logo_url" :preview-src-list="[model.logo_url]" title="点击查看大图">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                    </el-col>
                    <el-col :span="14">
                      <el-button size="mini" @click="fileUpload('logo', '上传logo')">上传logo</el-button>
                      <el-button size="mini" @click="fileDelete('logo')">删除</el-button>
                      <p>jpg、png图片，小于200KB。</p>
                    </el-col>
                  </el-row>
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
                  <el-input v-model="model.description" type="textarea" placeholder="description" clearable :autosize="{minRows:1,maxRows:20}" />
                </el-form-item>
                <el-form-item label="备案号" prop="icp">
                  <el-input v-model="model.icp" placeholder="icp" clearable />
                </el-form-item>
                <el-form-item label="版权" prop="copyright">
                  <el-input v-model="model.copyright" placeholder="copyright" clearable />
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="联系信息" name="">
                <el-form-item label="公众号" prop="off_acc_id">
                  <el-row>
                    <el-col :span="10">
                      <el-image class="ya-height-100" fit="scale-down" :src="model.off_acc_url" :preview-src-list="[model.off_acc_url]" title="点击查看大图">
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                    </el-col>
                    <el-col :span="14">
                      <el-button size="mini" @click="fileUpload('off_acc', '上传二维码')">上传二维码</el-button>
                      <el-button size="mini" @click="fileDelete('off_acc')">删除</el-button>
                      <p>jpg、png图片，小于200KB。</p>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                  <el-input v-model="model.address" placeholder="address" clearable />
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                  <el-input v-model="model.tel" placeholder="tel" clearable />
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="model.mobile" placeholder="mobile" clearable />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="model.email" placeholder="email" clearable />
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                  <el-input v-model="model.qq" placeholder="qq" clearable />
                </el-form-item>
                <el-form-item label="微信" prop="wechat">
                  <el-input v-model="model.wechat" placeholder="wechat" clearable />
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="自定义信息" name="">
                <el-form-item label="自定义配置">
                  <el-col :span="5" class="yyl-ml">
                    键名
                  </el-col>
                  <el-col :span="8" class="yyl-ml">
                    键值
                  </el-col>
                  <el-col :span="9" class="yyl-ml">
                    说明
                  </el-col>
                  <el-col :span="2">
                    <el-button type="primary" @click="add()">增加</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item v-for="(item, index) in model.diy_config" :key="index" label="">
                  <el-col :span="5">
                    <el-input v-model="item.config_key" clearable placeholder="请输入键名" />
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="item.config_val" clearable placeholder="请输入键值" />
                  </el-col>
                  <el-col :span="9">
                    <el-input v-model="item.config_desc" clearable placeholder="请输入说明" />
                  </el-col>
                  <el-col :span="2">
                    <el-button type="danger" @click="dele(index)">删除</el-button>
                  </el-col>
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
    <!-- 文件管理 -->
    <el-dialog :title="fileTitle" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import FileManage from '@/components/FileManage'
import { info, edit } from '@/api/cms/setting'

export default {
  name: 'CmsSetting',
  components: { FileManage },
  data() {
    return {
      name: '内容设置',
      height: 680,
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
        off_acc_id: '',
        off_acc_url: '',
        address: '',
        tel: '',
        mobile: '',
        email: '',
        qq: '',
        wechat: '',
        diy_config: []
      },
      rules: {},
      fileDialog: false,
      fileTitle: '文件管理',
      fileField: 'logo'
    }
  },
  created() {
    this.height = screenHeight(160)
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
      }).catch(() => {})
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
    // 上传logo、公众号
    fileUpload(field, title = '') {
      this.fileDialog = true
      this.fileField = field
      this.fileTitle = title
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelist) {
      this.fileDialog = false
      this.fileTitle = ''
      if (filelist) {
        if (this.fileField === 'logo') {
          this.model.logo_id = filelist[0]['file_id']
          this.model.logo_url = filelist[0]['file_url']
        } else if (this.fileField === 'off_acc') {
          this.model.off_acc_id = filelist[0]['file_id']
          this.model.off_acc_url = filelist[0]['file_url']
        }
      }
    },
    fileDelete(field = '') {
      if (field === 'logo') {
        this.model.logo_id = 0
        this.model.logo_url = ''
      } else if (field === 'off_acc') {
        this.model.off_acc_id = 0
        this.model.off_acc_url = ''
      }
    }
  }
}
</script>

<style scoped>
  .yyl-ml {
    padding-left: 12px;
  }
</style>
