<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
        <el-tabs class="dialog-body" :style="{height:height+'px'}">
          <el-tab-pane label="上传设置" lazy>
            <el-form-item label="存储方式" prop="storage">
              <el-radio-group v-model="model.storage">
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
              <el-form-item label="AccessKey" prop="qiniu_access_key" class="margin-bottom">
                <el-input v-model="model.qiniu_access_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_access_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">AccessKey（AK） 在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="SecretKey" prop="qiniu_secret_key" class="margin-bottom">
                <el-input v-model="model.qiniu_secret_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_secret_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">SecretKey（SK） 在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="空间名称" prop="qiniu_bucket" class="margin-bottom">
                <el-input v-model="model.qiniu_bucket" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_bucket, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">空间名称 在 [ 七牛云 > 对象存储 > 空间管理] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="外链域名" prop="qiniu_domain" class="margin-bottom">
                <el-input v-model="model.qiniu_domain" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_domain, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">外链域名 在 [ 七牛云 > 对象存储 > 空间管理 > 域名设置 ] 设置和获取</el-col>
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
              <el-form-item label="AccessKey ID" prop="aliyun_access_key_id" class="margin-bottom">
                <el-input v-model="model.aliyun_access_key_id" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_access_key_id, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">AccessKey ID 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="AccessKey Secret" prop="aliyun_access_key_secret" class="margin-bottom">
                <el-input v-model="model.aliyun_access_key_secret" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_access_key_secret, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">AccessKey Secret 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="Bucket名称" prop="aliyun_bucket" class="margin-bottom">
                <el-input v-model="model.aliyun_bucket" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_bucket, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">Bucket 名称 在 [ 阿里云 > 对象存储 > Bucket 列表 ] 获取</el-col>
              </el-form-item>
              <el-form-item label="Endpoint地域节点" prop="aliyun_endpoint" class="margin-bottom">
                <el-input v-model="model.aliyun_endpoint" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_endpoint, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">Endpoint（地域节点） 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取</el-col>
              </el-form-item>
              <el-form-item label="Bucket域名" prop="aliyun_bucket_domain" class="margin-bottom">
                <el-input v-model="model.aliyun_bucket_domain" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_bucket_domain, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">Bucket 域名 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取</el-col>
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
              <el-form-item label="SecretId" prop="tencent_secret_id" class="margin-bottom">
                <el-input v-model="model.tencent_secret_id" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_secret_id, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">SecretId 在 [ 腾讯云 > 个人中心 > 访问管理 > API密钥 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="SecretKey" prop="tencent_secret_key" class="margin-bottom">
                <el-input v-model="model.tencent_secret_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_secret_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">SecretKey 在 [ 腾讯云 > 个人中心 > 访问管理 > API密钥 ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="存储桶名称" prop="tencent_bucket" class="margin-bottom">
                <el-input v-model="model.tencent_bucket" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_bucket, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">存储桶名称 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取</el-col>
              </el-form-item>
              <el-form-item label="所属地域" prop="tencent_region" class="margin-bottom">
                <el-input v-model="model.tencent_region" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_region, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">所属地域 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取。如：ap-guangzhou</el-col>
              </el-form-item>
              <el-form-item label="访问域名" prop="tencent_domain" class="margin-bottom">
                <el-input v-model="model.tencent_domain" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_domain, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">访问域名 在 [ 腾讯云 > 对象存储 > 存储桶列表 > 概览 ] 获取</el-col>
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
              <el-form-item label="Access Key" prop="baidu_access_key" class="margin-bottom">
                <el-input v-model="model.baidu_access_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_access_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">Access Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="Secret Key" prop="baidu_secret_key" class="margin-bottom">
                <el-input v-model="model.baidu_secret_key" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_secret_key, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">Secret Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取</el-col>
              </el-form-item>
              <el-form-item label="Bucket名称" prop="baidu_bucket" class="margin-bottom">
                <el-input v-model="model.baidu_bucket" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_bucket, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">Bucket 名称 在 [ 百度云 > 对象存储 > Bucket 列表 ] 获取。如：yyladmin</el-col>
              </el-form-item>
              <el-form-item label="官方域名" prop="baidu_domain" class="margin-bottom">
                <el-input v-model="model.baidu_domain" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_domain, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">官方域名 在 [ 百度云 > 对象存储 > 发布管理 ] 获取。如：yyladmin.gz.bcebos.com</el-col>
              </el-form-item>
              <el-form-item label="所属地域" prop="baidu_endpoint" class="margin-bottom">
                <el-input v-model="model.baidu_endpoint" clearable>
                  <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_endpoint, $event)" />
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-col class="line" :span="24">所属地域：官方域名去掉 Bucket 名称，如：gz.bcebos.com</el-col>
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
            <el-form-item label="图片类型" prop="image_ext" class="margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.image_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的图片后缀，逗号,隔开，为空则不限制
              </el-col>
            </el-form-item>
            <el-form-item label="图片大小" prop="image_size">
              <el-col :span="11">
                <el-input v-model="model.image_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的图片大小，单位 MB，为0则不限制
              </el-col>
            </el-form-item>

            <el-form-item label="视频类型" prop="video_ext" class="margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.video_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的视频后缀，逗号,隔开，为空则不限制
              </el-col>
            </el-form-item>
            <el-form-item label="视频大小" prop="video_size">
              <el-col :span="11">
                <el-input v-model="model.video_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的视频大小，单位 MB，为0则不限制
              </el-col>
            </el-form-item>

            <el-form-item label="音频类型" prop="audio_ext" class="margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.audio_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的音频后缀，逗号,隔开，为空则不限制
              </el-col>
            </el-form-item>
            <el-form-item label="音频大小" prop="audio_size">
              <el-col :span="11">
                <el-input v-model="model.audio_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的音频大小，单位 MB，为0则不限制
              </el-col>
            </el-form-item>

            <el-form-item label="文档类型" prop="word_ext" class="margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.word_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的文档后缀，逗号,隔开，为空则不限制
              </el-col>
            </el-form-item>
            <el-form-item label="文档大小" prop="word_size">
              <el-col :span="11">
                <el-input v-model="model.word_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的文档大小，单位 MB，为0则不限制
              </el-col>
            </el-form-item>

            <el-form-item label="其它类型" prop="other_ext" class="margin-bottom">
              <el-col :span="11">
                <el-input v-model="model.other_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                允许上传的其它文件后缀，逗号,隔开，为空则不限制
              </el-col>
            </el-form-item>
            <el-form-item label="其它大小" prop="other_size">
              <el-col :span="11">
                <el-input v-model="model.other_size" clearable>
                  <template slot="append">MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13">
                允许上传的其它文件大小，单位 MB，为0则不限制
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
      rules: {}
    }
  },
  created() {
    this.height = screenHeight()
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
.margin-bottom {
  margin-bottom: 5px;
}
</style>
