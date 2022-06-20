<template>
  <div class="app-container">
    <el-card>
      <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
        <el-tabs>
          <el-tab-pane label="上传设置" class="dialog-body" :style="{height:height+'px'}" lazy>
            <el-form-item label="文件上传" prop="is_open">
              <el-switch v-model="model.is_open" :active-value="1" :inactive-value="0" />
              <span> 关闭后无法上传文件</span>
            </el-form-item>
            <el-form-item label="存储方式" prop="storage">
              <el-select v-model="model.storage" placeholder="请选择">
                <el-option
                  v-for="(item, index) in storages"
                  :key="index"
                  :label="item"
                  :value="index"
                  @change="storageChange"
                />
              </el-select>
            </el-form-item>
            <div v-if="model.storage=='local'">
              <el-form-item label="">
                <el-card>
                  <div>
                    文件将存储在本地服务器，默认保存在 public/storage 目录，文件以散列 hash 命名。
                    <br>
                    文件存储的目录需要有读写权限（777），有足够的存储空间。
                  </div>
                </el-card>
              </el-form-item>
            </div>
            <div v-else-if="model.storage=='qiniu'">
              <el-form-item label="">
                <el-card>
                  <div>
                    文件将上传到七牛云 Kodo 存储，对象存储 > 空间管理 > 空间设置 > 访问控制, 设置为 公开空间。
                    <br>
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为 GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="AccessKey" prop="qiniu_access_key">
                <el-col :span="11">
                  <el-input v-model="model.qiniu_access_key" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_access_key, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  AccessKey（AK）在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="SecretKey" prop="qiniu_secret_key">
                <el-col :span="11">
                  <el-input v-model="model.qiniu_secret_key" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_secret_key, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  SecretKey（SK）在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="空间名称" prop="qiniu_bucket">
                <el-col :span="11">
                  <el-input v-model="model.qiniu_bucket" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_bucket, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  空间名称 在 [ 七牛云 > 对象存储 > 空间管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="外链域名" prop="qiniu_domain">
                <el-col :span="11">
                  <el-input v-model="model.qiniu_domain" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.qiniu_domain, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  外链域名 在 [ 七牛云 > 对象存储 > 空间管理 > 域名设置 ] 设置和获取
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage=='aliyun'">
              <el-form-item label="">
                <el-card>
                  <div>
                    文件将上传到阿里云 OSS 存储，需要配置 OSS 公开访问及跨域策略。
                    <br>
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为 GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="AccessKey ID" prop="aliyun_access_key_id">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_access_key_id" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_access_key_id, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  AccessKey ID 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="AccessKey Secret" prop="aliyun_access_key_secret">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_access_key_secret" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_access_key_secret, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  AccessKey Secret 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="Bucket名称" prop="aliyun_bucket">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_bucket" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_bucket, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Bucket 名称 在 [ 阿里云 > 对象存储 > Bucket 列表 ] 获取
                </el-col>
              </el-form-item>
              <el-form-item label="Bucket域名" prop="aliyun_bucket_domain">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_bucket_domain" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_bucket_domain, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Bucket 域名 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取
                </el-col>
              </el-form-item>
              <el-form-item label="Endpoint地域节点" prop="aliyun_endpoint">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_endpoint" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.aliyun_endpoint, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Endpoint（地域节点） 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage=='tencent'">
              <el-form-item label="">
                <el-card>
                  <div>
                    文件将上传到腾讯云 COS 存储，需要配置 COS 公有读私有写访问权限及跨域策略。
                    <br>
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为 GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="SecretId" prop="tencent_secret_id">
                <el-col :span="11">
                  <el-input v-model="model.tencent_secret_id" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_secret_id, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  SecretId 在 [ 腾讯云 > 个人中心 > 访问管理 > 访问密钥 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="SecretKey" prop="tencent_secret_key">
                <el-col :span="11">
                  <el-input v-model="model.tencent_secret_key" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_secret_key, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  SecretKey 在 [ 腾讯云 > 个人中心 > 访问管理 > 访问密钥 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="存储桶名称" prop="tencent_bucket">
                <el-col :span="11">
                  <el-input v-model="model.tencent_bucket" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_bucket, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  存储桶名称 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取
                </el-col>
              </el-form-item>
              <el-form-item label="所属地域" prop="tencent_region">
                <el-col :span="11">
                  <el-input v-model="model.tencent_region" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_region, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  所属地域 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取。如：ap-guangzhou
                </el-col>
              </el-form-item>
              <el-form-item label="访问域名" prop="tencent_domain">
                <el-col :span="11">
                  <el-input v-model="model.tencent_domain" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.tencent_domain, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  访问域名 在 [ 腾讯云 > 对象存储 > 存储桶列表 > 概览 ] 获取
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage=='baidu'">
              <el-form-item label="">
                <el-card>
                  <div>
                    文件将上传到百度云 BOS 存储，对象存储 > Bucket列表 > 配置设置 > Bucket权限配置, 设置为 公共 *。
                    <br>
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为 GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="Access Key" prop="baidu_access_key">
                <el-col :span="11">
                  <el-input v-model="model.baidu_access_key" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_access_key, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Access Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="Secret Key" prop="baidu_secret_key">
                <el-col :span="11">
                  <el-input v-model="model.baidu_secret_key" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_secret_key, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Secret Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="Bucket名称" prop="baidu_bucket">
                <el-col :span="11">
                  <el-input v-model="model.baidu_bucket" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_bucket, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Bucket 名称 在 [ 百度云 > 对象存储 > Bucket 列表 ] 获取。如：yyladmin
                </el-col>
              </el-form-item>
              <el-form-item label="官方域名" prop="baidu_domain">
                <el-col :span="11">
                  <el-input v-model="model.baidu_domain" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_domain, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  官方域名 在 [ 百度云 > 对象存储 > 发布管理 ] 获取。如：yyladmin.gz.bcebos.com
                </el-col>
              </el-form-item>
              <el-form-item label="所属地域" prop="baidu_endpoint">
                <el-col :span="11">
                  <el-input v-model="model.baidu_endpoint" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.baidu_endpoint, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  所属地域：官方域名去掉 Bucket 名称，如：gz.bcebos.com
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage=='upyun'">
              <el-form-item label="">
                <el-card>
                  <div>
                    文件将上传到又拍云 USS 存储，云存储 > 服务管理 > 配置 > CORS 跨域共享, 设置为 已开启。
                    <br>
                    请根据业务域名和需求，配置 CORS 跨域共享 规则，CORS 配置。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="服务名称" prop="upyun_service_name">
                <el-col :span="11">
                  <el-input v-model="model.upyun_service_name" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.upyun_service_name, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  服务名称 在 [ 又拍云 > 云存储 > 服务管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="操作员" prop="upyun_operator_name">
                <el-col :span="11">
                  <el-input v-model="model.upyun_operator_name" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.upyun_operator_name, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  操作员 在 [ 又拍云 > 云存储 > 服务管理 > 配置 > 存储管理-操作员授权 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="操作员密码" prop="upyun_operator_pwd">
                <el-col :span="11">
                  <el-input v-model="model.upyun_operator_pwd" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.upyun_operator_pwd, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  操作员密码 在 [ 又拍云 > 云存储 > 服务管理 > 配置 > 存储管理-操作员授权 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="加速域名" prop="upyun_domain">
                <el-col :span="11">
                  <el-input v-model="model.upyun_domain" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.upyun_domain, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  加速域名 在 [ 又拍云 > 云存储 > 服务管理 > 配置 > 域名管理-加速域名 ] 设置和获取
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage=='s3'">
              <el-form-item label="">
                <el-card>
                  <div>
                    文件将上传到 AWS S3。
                    <br>
                    请根据业务域名和需求，配置 AWS S3 访问控制。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="Access Key ID" prop="s3_access_key_id">
                <el-col :span="11">
                  <el-input v-model="model.s3_access_key_id" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.s3_access_key_id, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Access Key ID 在 [ AWS > 我的账号 > 安全凭证 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="Secret Access KEY" prop="s3_secret_access_key">
                <el-col :span="11">
                  <el-input v-model="model.s3_secret_access_key" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.s3_secret_access_key, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Secret Access KEY 在 [ AWS > 我的账号 > 安全凭证 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="区域终端节点" prop="s3_region">
                <el-col :span="11">
                  <el-input v-model="model.s3_region" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.s3_region, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  区域终端节点 在 [ AWS > S3 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="存储桶名称" prop="s3_bucket">
                <el-col :span="11">
                  <el-input v-model="model.s3_bucket" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.s3_bucket, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  存储桶名称 在 [ AWS > S3 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="访问域名" prop="s3_domain">
                <el-col :span="11">
                  <el-input v-model="model.s3_domain" clearable>
                    <el-button slot="append" icon="el-icon-document-copy" @click="copy(model.s3_domain, $event)" />
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  访问域名 在 [ AWS > S3 ] 设置和获取
                </el-col>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="上传限制" class="dialog-body" :style="{height:height+'px'}" lazy>
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
        is_open: 1,
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
        upyun_service_name: '',
        upyun_operator_name: '',
        upyun_operator_pwd: '',
        upyun_domain: '',
        s3_access_key_id: '',
        s3_secret_access_key: '',
        s3_bucket: '',
        s3_region: '',
        s3_domain: '',
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
        baidu_domain: [{ required: true, message: '请输入所属地域', trigger: 'blur' }],
        upyun_service_name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
        upyun_operator_name: [{ required: true, message: '请输入操作员', trigger: 'blur' }],
        upyun_operator_pwd: [{ required: true, message: '请输入操作员密码', trigger: 'blur' }],
        upyun_domain: [{ required: true, message: '请输入加速域名', trigger: 'blur' }],
        s3_access_key_id: [{ required: true, message: '请输入 Access Key ID', trigger: 'blur' }],
        s3_secret_access_key: [{ required: true, message: '请输入 Secret Access Key', trigger: 'blur' }],
        s3_bucket: [{ required: true, message: '请输入存储桶名称', trigger: 'blur' }],
        s3_region: [{ required: true, message: '请输入区域终端节点', trigger: 'blur' }],
        s3_domain: [{ required: true, message: '请输入访问域名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight(270)
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
      info().then((res) => {
        this.storages = res.data.storage
        this.model = res.data.setting
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
        }
      })
    },
    // 存储方式
    storageChange() {
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].clearValidate()
      }
    },
    // 复制
    copy(text, event) {
      clip(text, event)
    }
  }
}
</script>

<style scoped>
.ya-margin-bottom {
  margin-bottom: 5px;
}
</style>
