<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
        <el-tabs class="dialog-body" :style="{height:height+'px'}">
          <el-tab-pane label="上传设置" lazy>
            <el-form-item label="存储方式" prop="storage">
              <el-radio-group v-model="model.storage" @change="storageChange">
                <el-radio v-for="(item, index) in storages" :key="index" :label="index">{{ item }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if="model.storage=='qiniu'">
              <el-form-item label="">
                <el-card class="box-card">
                  <div class="text item">
                    文件将上传到七牛云 Kodo 存储，对象存储 > 空间管理 > 空间设置 > 访问控制, 设置为 公开空间。
                    <br>
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为 GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="AccessKey" prop="qiniu_access_key" class="ya-margin-bottom">
                <el-input v-model="model.qiniu_access_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_access_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">AccessKey（AK） 在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="SecretKey" prop="qiniu_secret_key" class="ya-margin-bottom">
                <el-input v-model="model.qiniu_secret_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_secret_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">SecretKey（SK） 在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="空间名称" prop="qiniu_bucket" class="ya-margin-bottom">
                <el-input v-model="model.qiniu_bucket" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_bucket, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">空间名称 在 [ 七牛云 > 对象存储 > 空间管理] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="外链域名" prop="qiniu_domain" class="ya-margin-bottom">
                <el-input v-model="model.qiniu_domain" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_domain, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">外链域名 在 [ 七牛云 > 对象存储 > 空间管理 > 域名设置 ] 设置和获取</el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage=='aliyun'">
              <el-form-item label="">
                <el-card class="box-card">
                  <div class="text item">
                    文件将上传到阿里云 OSS 存储，需要配置 OSS 公开访问及跨域策略。
                    <br>
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为 GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="AccessKey ID" prop="aliyun_access_key_id" class="ya-margin-bottom">
                <el-input v-model="model.aliyun_access_key_id" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_access_key_id, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">AccessKey ID 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="AccessKey Secret" prop="aliyun_access_key_secret" class="ya-margin-bottom">
                <el-input v-model="model.aliyun_access_key_secret" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_access_key_secret, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">AccessKey Secret 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="Bucket名称" prop="aliyun_bucket" class="ya-margin-bottom">
                <el-input v-model="model.aliyun_bucket" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_bucket, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">Bucket 名称 在 [ 阿里云 > 对象存储 > Bucket 列表 ] 获取</el-col>
              </el-form-item>
              <el-form-item label="Bucket域名" prop="aliyun_bucket_domain" class="ya-margin-bottom">
                <el-input v-model="model.aliyun_bucket_domain" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_bucket_domain, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">Bucket 域名 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取</el-col>
              </el-form-item>
              <el-form-item label="Endpoint地域节点" prop="aliyun_endpoint" class="ya-margin-bottom">
                <el-input v-model="model.aliyun_endpoint" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_endpoint, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">Endpoint（地域节点） 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取</el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage=='tencent'">
              <el-form-item label="">
                <el-card class="box-card">
                  <div class="text item">
                    文件将上传到腾讯云 COS 存储，需要配置 COS 公有读私有写访问权限及跨域策略。
                    <br>
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为 GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="SecretId" prop="tencent_secret_id" class="ya-margin-bottom">
                <el-input v-model="model.tencent_secret_id" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_secret_id, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">SecretId 在 [ 腾讯云 > 个人中心 > 访问管理 > 访问密钥 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="SecretKey" prop="tencent_secret_key" class="ya-margin-bottom">
                <el-input v-model="model.tencent_secret_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_secret_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">SecretKey 在 [ 腾讯云 > 个人中心 > 访问管理 > 访问密钥 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="存储桶名称" prop="tencent_bucket" class="ya-margin-bottom">
                <el-input v-model="model.tencent_bucket" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_bucket, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">存储桶名称 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取</el-col>
              </el-form-item>
              <el-form-item label="所属地域" prop="tencent_region" class="ya-margin-bottom">
                <el-input v-model="model.tencent_region" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_region, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">所属地域 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取。如：ap-guangzhou</el-col>
              </el-form-item>
              <el-form-item label="访问域名" prop="tencent_domain" class="ya-margin-bottom">
                <el-input v-model="model.tencent_domain" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_domain, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">访问域名 在 [ 腾讯云 > 对象存储 > 存储桶列表 > 概览 ] 获取</el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage=='baidu'">
              <el-form-item label="">
                <el-card class="box-card">
                  <div class="text item">
                    文件将上传到百度云 BOS 存储，对象存储 > Bucket列表 > 配置设置 > Bucket权限配置, 设置为 公共 *。
                    <br>
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为 GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="Access Key" prop="baidu_access_key" class="ya-margin-bottom">
                <el-input v-model="model.baidu_access_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_access_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">Access Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="Secret Key" prop="baidu_secret_key" class="ya-margin-bottom">
                <el-input v-model="model.baidu_secret_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_secret_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">Secret Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="Bucket名称" prop="baidu_bucket" class="ya-margin-bottom">
                <el-input v-model="model.baidu_bucket" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_bucket, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">Bucket 名称 在 [ 百度云 > 对象存储 > Bucket 列表 ] 获取。如：yyladmin</el-col>
              </el-form-item>
              <el-form-item label="官方域名" prop="baidu_domain" class="ya-margin-bottom">
                <el-input v-model="model.baidu_domain" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_domain, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">官方域名 在 [ 百度云 > 对象存储 > 发布管理 ] 获取。如：yyladmin.gz.bcebos.com</el-col>
              </el-form-item>
              <el-form-item label="所属地域" prop="baidu_endpoint" class="ya-margin-bottom">
                <el-input v-model="model.baidu_endpoint" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_endpoint, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line">所属地域：官方域名去掉 Bucket 名称，如：gz.bcebos.com</el-col>
              </el-form-item>
            </div>
            <div v-else>
              <el-form-item label="">
                <el-card class="box-card">
                  <div class="text item">
                    文件将存储在本地服务器，默认保存在 public/storage 目录，文件以 hash 命名。
                    <br>
                    文件存储的目录需要有读写权限（777），有足够的存储空间。
                  </div>
                </el-card>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="上传限制" lazy>
            <el-form-item label="图片格式" prop="image_ext" class="ya-margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.image_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的图片后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="图片大小" prop="image_size">
              <el-col :span="11">
                <el-input v-model="model.image_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的图片大小，单位 MB
              </el-col>
            </el-form-item>

            <el-form-item label="视频格式" prop="video_ext" class="ya-margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.video_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的视频后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="视频大小" prop="video_size">
              <el-col :span="11">
                <el-input v-model="model.video_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的视频大小，单位 MB
              </el-col>
            </el-form-item>

            <el-form-item label="音频格式" prop="audio_ext" class="ya-margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.audio_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的音频后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="音频大小" prop="audio_size">
              <el-col :span="11">
                <el-input v-model="model.audio_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的音频大小，单位 MB
              </el-col>
            </el-form-item>

            <el-form-item label="文档格式" prop="word_ext" class="ya-margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.word_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的文档后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="文档大小" prop="word_size">
              <el-col :span="11">
                <el-input v-model="model.word_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的文档大小，单位 MB
              </el-col>
            </el-form-item>

            <el-form-item label="其它格式" prop="other_ext" class="ya-margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.other_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的其它文件后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="其它大小" prop="other_size">
              <el-col :span="11">
                <el-input v-model="model.other_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的其它文件大小，单位 MB
              </el-col>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-form label-width="150px">
        <el-form-item>
          <el-button :loading="loading" @click="refresh()">刷新</el-button>
          <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import checkPermission from '@/utils/permission' // 权限判断函数
import clip from '@/utils/clipboard'
import { info, edit } from '@/api/file/setting'

export default {
  name: 'FileSetting',
  components: { },
  data() {
    return {
      name: '文件设置',
      height: 680,
      loading: false,
      storages: [],
      model: {
        setting_id: '',
        storage: 'local',
        qiniu_access_key: '',
        qiniu_secret_key: '',
        qiniu_bucket: '',
        qiniu_domain: '',
        aliyun_access_key_id: '',
        aliyun_access_key_secret: '',
        aliyun_bucket: '',
        aliyun_bucket_domain: '',
        aliyun_endpoint: '',
        tencent_secret_id: '',
        tencent_secret_key: '',
        tencent_bucket: '',
        tencent_region: '',
        tencent_domain: '',
        baidu_access_key: '',
        baidu_secret_key: '',
        baidu_bucket: '',
        baidu_endpoint: '',
        baidu_domain: '',
        image_ext: '',
        image_size: 0,
        video_ext: '',
        video_size: 0,
        audio_ext: '',
        audio_size: 0,
        word_ext: '',
        word_size: 0,
        other_ext: '',
        other_size: 0
      },
      rules: {
        storage: [{ required: true, message: '请选择存储方式', trigger: 'blur' }],
        qiniu_access_key: [{ required: true, message: '请输入 AccessKey', trigger: 'blur' }],
        qiniu_secret_key: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
        qiniu_bucket: [{ required: true, message: '请输入空间名称', trigger: 'blur' }],
        qiniu_domain: [{ required: true, message: '请输入外链域名', trigger: 'blur' }],
        aliyun_access_key_id: [{ required: true, message: '请输入 AccessKey ID', trigger: 'blur' }],
        aliyun_access_key_secret: [{ required: true, message: '请输入 AccessKey Secret', trigger: 'blur' }],
        aliyun_bucket: [{ required: true, message: '请输入 Bucket 名称', trigger: 'blur' }],
        aliyun_bucket_domain: [{ required: true, message: '请输入 Bucket 域名', trigger: 'blur' }],
        aliyun_endpoint: [{ required: true, message: '请输入 Endpoint 地域节点', trigger: 'blur' }],
        tencent_secret_id: [{ required: true, message: '请输入 SecretId', trigger: 'blur' }],
        tencent_secret_key: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
        tencent_bucket: [{ required: true, message: '请输入存储桶名称', trigger: 'blur' }],
        tencent_region: [{ required: true, message: '请输入所属地域', trigger: 'blur' }],
        tencent_domain: [{ required: true, message: '请输入访问域名', trigger: 'blur' }],
        baidu_access_key: [{ required: true, message: '请输入 Access Key', trigger: 'blur' }],
        baidu_secret_key: [{ required: true, message: '请输入 Secret Key', trigger: 'blur' }],
        baidu_bucket: [{ required: true, message: '请输入 Bucket 名称', trigger: 'blur' }],
        baidu_endpoint: [{ required: true, message: '请输入官方域名', trigger: 'blur' }],
        baidu_domain: [{ required: true, message: '请输入所属地域', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight(220)
    this.info()
  },
  methods: {
    checkPermission,
    // 信息
    info() {
      info().then((res) => {
        this.storages = res.data.storage
        this.model = res.data.setting
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      info()
        .then((res) => {
          this.storages = res.data.storage
          this.model = res.data.setting
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
        }
      })
    },
    // 存储方式选择
    storageChange() {
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].clearValidate()
      }
    },
    // 复制
    copy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message.error('内容为空')
      }
    }
  }
}
</script>

<style scoped>
.ya-margin-bottom {
  margin-bottom: 5px;
}
</style>
