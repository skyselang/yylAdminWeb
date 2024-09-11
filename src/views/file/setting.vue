<template>
  <div class="app-container">
    <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
      <el-tabs>
        <el-tab-pane label="文件设置" lazy>
          <el-scrollbar native :height="height">
            <el-form-item label="前台上传" prop="is_upload_api">
              <el-switch v-model="model.is_upload_api" :active-value="1" :inactive-value="0" />
              <span> 关闭后，前台无法上传文件</span>
            </el-form-item>
            <el-form-item label="后台上传" prop="is_upload_admin">
              <el-switch v-model="model.is_upload_admin" :active-value="1" :inactive-value="0" />
              <span> 关闭后，后台无法上传文件</span>
            </el-form-item>
            <el-form-item label="存储方式" prop="storage">
              <el-select v-model="model.storage" placeholder="请选择" class="!w-xs">
                <el-option
                  v-for="(item, index) in storages"
                  :key="index"
                  :label="item"
                  :value="index"
                  @change="storageChange"
                />
              </el-select>
            </el-form-item>
            <div v-if="model.storage == 'local'">
              <el-form-item>
                <el-card shadow="never">
                  <div>
                    文件将存储在服务器，保存在 public/storage 目录，文件以散列 hash 命名。
                    <br />
                    文件存储的目录需要有读写权限（777），有足够的存储空间。
                  </div>
                </el-card>
              </el-form-item>
            </div>
            <div v-else-if="model.storage == 'qiniu'">
              <el-form-item>
                <el-card shadow="never">
                  <div>
                    文件将上传到七牛云 Kodo 存储，对象存储 > 空间管理 > 空间设置 > 访问控制, 设置为
                    公开空间。
                    <br />
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为
                    GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="AccessKey" prop="qiniu_access_key">
                <el-col :span="11">
                  <el-input v-model="model.qiniu_access_key" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.qiniu_access_key)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  AccessKey（AK）在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="SecretKey" prop="qiniu_secret_key">
                <el-col :span="11">
                  <el-input v-model="model.qiniu_secret_key" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.qiniu_secret_key)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  SecretKey（SK）在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="空间名称" prop="qiniu_bucket">
                <el-col :span="11">
                  <el-input v-model="model.qiniu_bucket" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.qiniu_bucket)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  空间名称 在 [ 七牛云 > 对象存储 > 空间管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="访问域名" prop="qiniu_domain">
                <el-col :span="11">
                  <el-input v-model="model.qiniu_domain" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.qiniu_domain)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  访问域名 在 [ 七牛云 > 对象存储 > 空间管理 > 域名管理 ] 设置和获取
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage == 'aliyun'">
              <el-form-item>
                <el-card shadow="never">
                  <div>
                    文件将上传到阿里云 OSS 存储，需要配置 OSS 公开访问及跨域策略。
                    <br />
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为
                    GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="AccessKey ID" prop="aliyun_access_key_id">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_access_key_id" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aliyun_access_key_id)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  AccessKey ID 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="AccessKey Secret" prop="aliyun_access_key_secret">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_access_key_secret" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aliyun_access_key_secret)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  AccessKey Secret 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="Bucket名称" prop="aliyun_bucket">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_bucket" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aliyun_bucket)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Bucket 名称 在 [ 阿里云 > 对象存储 > Bucket 列表 ] 获取
                </el-col>
              </el-form-item>
              <el-form-item label="Endpoint地域节点" prop="aliyun_endpoint">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_endpoint" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aliyun_endpoint)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Endpoint（地域节点） 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取
                </el-col>
              </el-form-item>
              <el-form-item label="Bucket域名" prop="aliyun_domain">
                <el-col :span="11">
                  <el-input v-model="model.aliyun_domain" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aliyun_domain)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Bucket 域名 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage == 'tencent'">
              <el-form-item>
                <el-card shadow="never">
                  <div>
                    文件将上传到腾讯云 COS 存储，需要配置 COS 公有读私有写访问权限及跨域策略。
                    <br />
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为
                    GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="SecretId" prop="tencent_secret_id">
                <el-col :span="11">
                  <el-input v-model="model.tencent_secret_id" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.tencent_secret_id)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  SecretId 在 [ 腾讯云 > 个人中心 > 访问管理 > 访问密钥 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="SecretKey" prop="tencent_secret_key">
                <el-col :span="11">
                  <el-input v-model="model.tencent_secret_key" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.tencent_secret_key)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  SecretKey 在 [ 腾讯云 > 个人中心 > 访问管理 > 访问密钥 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="存储桶名称" prop="tencent_bucket">
                <el-col :span="11">
                  <el-input v-model="model.tencent_bucket" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.tencent_bucket)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  存储桶名称 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取
                </el-col>
              </el-form-item>
              <el-form-item label="所属地域" prop="tencent_region">
                <el-col :span="11">
                  <el-input v-model="model.tencent_region" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.tencent_region)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  所属地域 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取。如：ap-guangzhou
                </el-col>
              </el-form-item>
              <el-form-item label="访问域名" prop="tencent_domain">
                <el-col :span="11">
                  <el-input v-model="model.tencent_domain" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.tencent_domain)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  访问域名 在 [ 腾讯云 > 对象存储 > 存储桶列表 > 概览 ] 获取
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage == 'baidu'">
              <el-form-item>
                <el-card shadow="never">
                  <div>
                    文件将上传到百度云 BOS 存储，对象存储 > Bucket列表 > 配置设置 > Bucket权限配置,
                    设置为 公共 *。
                    <br />
                    需要配置跨域访问 CORS 规则，设置：来源 Origin 为 *，允许 Methods 为
                    GET,POST，允许 Headers 为 *。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="Access Key" prop="baidu_access_key">
                <el-col :span="11">
                  <el-input v-model="model.baidu_access_key" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.baidu_access_key)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Access Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="Secret Key" prop="baidu_secret_key">
                <el-col :span="11">
                  <el-input v-model="model.baidu_secret_key" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.baidu_secret_key)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Secret Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="Bucket名称" prop="baidu_bucket">
                <el-col :span="11">
                  <el-input v-model="model.baidu_bucket" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.baidu_bucket)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Bucket 名称 在 [ 百度云 > 对象存储 > Bucket 列表 ] 获取
                </el-col>
              </el-form-item>
              <el-form-item label="所属地域" prop="baidu_endpoint">
                <el-col :span="11">
                  <el-input v-model="model.baidu_endpoint" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.baidu_endpoint)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  所属地域：官方域名去掉 Bucket 名称，如：gz.bcebos.com
                </el-col>
              </el-form-item>
              <el-form-item label="官方域名" prop="baidu_domain">
                <el-col :span="11">
                  <el-input v-model="model.baidu_domain" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.baidu_domain)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  官方域名 在 [ 百度云 > 对象存储 > Bucket列表 > 发布管理 ]获取
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage == 'upyun'">
              <el-form-item>
                <el-card shadow="never">
                  <div>
                    文件将上传到又拍云 USS 存储，云存储 > 服务管理 > 配置 > CORS 跨域共享, 设置为
                    已开启。
                    <br />
                    请根据业务域名和需求，配置 CORS 跨域共享 规则，CORS 配置。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="服务名称" prop="upyun_service_name">
                <el-col :span="11">
                  <el-input v-model="model.upyun_service_name" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.upyun_service_name)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  服务名称 在 [ 又拍云 > 云存储 > 服务管理 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="操作员" prop="upyun_operator_name">
                <el-col :span="11">
                  <el-input v-model="model.upyun_operator_name" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.upyun_operator_name)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  操作员 在 [ 又拍云 > 云存储 > 服务管理 > 配置 > 存储管理-操作员授权 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="操作员密码" prop="upyun_operator_pwd">
                <el-col :span="11">
                  <el-input v-model="model.upyun_operator_pwd" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.upyun_operator_pwd)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  操作员密码 在 [ 又拍云 > 云存储 > 服务管理 > 配置 > 存储管理-操作员授权 ]
                  设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="加速域名" prop="upyun_domain">
                <el-col :span="11">
                  <el-input v-model="model.upyun_domain" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.upyun_domain)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  加速域名 在 [ 又拍云 > 云存储 > 服务管理 > 配置 > 域名管理-加速域名 ] 设置和获取
                </el-col>
              </el-form-item>
            </div>
            <div v-else-if="model.storage == 'huawei'">
              <el-form-item>
                <el-card shadow="never">
                  <div>
                    文件将上传到 华为云 OBS。
                    <br />
                    请根据业务域名和需求，配置 华为云 OBS 权限控制桶策略，数据安全CORS规则。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="Access Key ID" prop="huawei_access_key_id">
                <el-col :span="11">
                  <el-input v-model="model.huawei_access_key_id" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.huawei_access_key_id)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Access Key ID 在 [ 华为云 > 我的账号 > 我的凭证 > 访问密钥 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="Secret Access KEY" prop="huawei_secret_access_key">
                <el-col :span="11">
                  <el-input v-model="model.huawei_secret_access_key" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.huawei_secret_access_key)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Secret Access KEY 在 [ 华为云 > 我的账号 > 我的凭证 > 访问密钥 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="桶名称" prop="huawei_bucket">
                <el-col :span="11">
                  <el-input v-model="model.huawei_bucket" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.huawei_bucket)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  桶名称 在 [ 华为云 > 对象存储 > 桶列表 ] 设置和获取</el-col
                >
              </el-form-item>
              <el-form-item label="Endpoint(地域节点)" prop="huawei_endpoint">
                <el-col :span="11">
                  <el-input v-model="model.huawei_endpoint" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.huawei_endpoint)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Endpoint(地域节点) 在 [ 华为云 > 对象存储 > 桶列表 > 概览 ] 设置和获取</el-col
                >
              </el-form-item>
              <el-form-item label="访问域名" prop="huawei_domain">
                <el-col :span="11">
                  <el-input v-model="model.huawei_domain" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.huawei_domain)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  访问域名 在 [ 华为云 > 对象存储 > 桶列表 > 概览 ] 设置和获取</el-col
                >
              </el-form-item>
            </div>
            <div v-else-if="model.storage == 'aws'">
              <el-form-item>
                <el-card shadow="never">
                  <div>
                    文件将上传到 AWS S3。
                    <br />
                    请根据业务域名和需求，配置 AWS S3 访问控制。
                  </div>
                </el-card>
              </el-form-item>
              <el-form-item label="Access Key ID" prop="aws_access_key_id">
                <el-col :span="11">
                  <el-input v-model="model.aws_access_key_id" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aws_access_key_id)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Access Key ID 在 [ AWS > 我的账号 > 安全凭证 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="Secret Access KEY" prop="aws_secret_access_key">
                <el-col :span="11">
                  <el-input v-model="model.aws_secret_access_key" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aws_secret_access_key)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13">
                  Secret Access KEY 在 [ AWS > 我的账号 > 安全凭证 ] 设置和获取
                </el-col>
              </el-form-item>
              <el-form-item label="存储桶名称" prop="aws_bucket">
                <el-col :span="11">
                  <el-input v-model="model.aws_bucket" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aws_bucket)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13"> 存储桶名称 在 [ AWS > S3 ] 设置和获取 </el-col>
              </el-form-item>
              <el-form-item label="区域终端节点" prop="aws_region">
                <el-col :span="11">
                  <el-input v-model="model.aws_region" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aws_region)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13"> 区域终端节点 在 [ AWS > S3 ] 设置和获取 </el-col>
              </el-form-item>
              <el-form-item label="访问域名" prop="aws_domain">
                <el-col :span="11">
                  <el-input v-model="model.aws_domain" clearable>
                    <template #append>
                      <el-button title="复制" @click="copy(model.aws_domain)">
                        <svg-icon icon-class="copy-document" />
                      </el-button>
                    </template>
                  </el-input>
                </el-col>
                <el-col class="line" :span="13"> 访问域名 在 [ AWS > S3 ] 设置和获取 </el-col>
              </el-form-item>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="文件限制" lazy>
          <el-scrollbar native :height="height">
            <el-form-item label="图片格式" prop="image_ext" class="!mb-[5px]">
              <el-col :span="11">
                <el-input v-model="model.image_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                <el-tooltip :content="model.image_exts">
                  <svg-icon icon-class="question-filled" />
                </el-tooltip>
                允许上传的图片后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="图片大小" prop="image_size">
              <el-col :span="11">
                <el-input v-model="model.image_size" type="number" clearable>
                  <template #append>MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13"> 允许上传的图片大小，单位 MB </el-col>
            </el-form-item>

            <el-form-item label="视频格式" prop="video_ext" class="!mb-[5px]">
              <el-col :span="11">
                <el-input v-model="model.video_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                <el-tooltip :content="model.video_exts">
                  <svg-icon icon-class="question-filled" />
                </el-tooltip>
                允许上传的视频后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="视频大小" prop="video_size">
              <el-col :span="11">
                <el-input v-model="model.video_size" type="number" clearable>
                  <template #append>MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13"> 允许上传的视频大小，单位 MB </el-col>
            </el-form-item>

            <el-form-item label="音频格式" prop="audio_ext" class="!mb-[5px]">
              <el-col :span="11">
                <el-input v-model="model.audio_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                <el-tooltip :content="model.audio_exts">
                  <svg-icon icon-class="question-filled" />
                </el-tooltip>
                允许上传的音频后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="音频大小" prop="audio_size">
              <el-col :span="11">
                <el-input v-model="model.audio_size" type="number" clearable>
                  <template #append>MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13"> 允许上传的音频大小，单位 MB </el-col>
            </el-form-item>

            <el-form-item label="文档格式" prop="word_ext" class="!mb-[5px]">
              <el-col :span="11">
                <el-input v-model="model.word_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                <el-tooltip :content="model.word_exts">
                  <svg-icon icon-class="question-filled" />
                </el-tooltip>
                允许上传的文档后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="文档大小" prop="word_size">
              <el-col :span="11">
                <el-input v-model="model.word_size" type="number" clearable>
                  <template #append>MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13"> 允许上传的文档大小，单位 MB </el-col>
            </el-form-item>

            <el-form-item label="其它格式" prop="other_ext" class="!mb-[5px]">
              <el-col :span="11">
                <el-input v-model="model.other_ext" clearable />
              </el-col>
              <el-col class="line" :span="13">
                <el-tooltip :content="model.other_exts">
                  <svg-icon icon-class="question-filled" />
                </el-tooltip>
                允许上传的其它文件后缀，逗号,隔开
              </el-col>
            </el-form-item>
            <el-form-item label="其它大小" prop="other_size">
              <el-col :span="11">
                <el-input v-model="model.other_size" type="number" clearable>
                  <template #append>MB</template>
                </el-input>
              </el-col>
              <el-col class="line" :span="13"> 允许上传的其它文件大小，单位 MB </el-col>
            </el-form-item>

            <el-form-item label="最大上传个数" prop="limit_max" class="!mb-[5px]">
              <el-col :span="11">
                <el-input v-model="model.limit_max" type="number" clearable />
              </el-col>
              <el-col class="line" :span="13"> 允许上传最大文件个数（每次最多选择） </el-col>
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="前台设置" lazy>
          <el-scrollbar native :height="height">
            <el-form-item label="前台文件" prop="is_api_file">
              <el-switch v-model="model.is_api_file" :active-value="1" :inactive-value="0" />
              <span> 是否开启前台文件功能</span>
            </el-form-item>
            <el-form-item label="文件类型" prop="api_file_types">
              <el-checkbox-group v-model="model.api_file_types">
                <el-checkbox
                  v-for="(item, index) in file_types"
                  :key="index"
                  :value="index"
                  :label="item"
                />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="文件分组" prop="api_file_group_ids">
              <el-select
                v-model="model.api_file_group_ids"
                clearable
                filterable
                multiple
                class="!w-[50%]"
              >
                <el-option
                  v-for="(item, index) in group"
                  :key="index"
                  :value="item.group_id"
                  :label="item.group_name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="文件标签" prop="api_file_tag_ids">
              <el-select
                v-model="model.api_file_tag_ids"
                clearable
                filterable
                multiple
                class="!w-[50%]"
              >
                <el-option
                  v-for="item in tag"
                  :key="item.tag_id"
                  :label="item.tag_name"
                  :value="item.tag_id"
                />
              </el-select>
            </el-form-item>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-form label-width="150px">
      <el-form-item>
        <el-button :loading="loading" @click="refresh()">刷新</el-button>
        <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import checkPermission from '@/utils/permission'
import clip from '@/utils/clipboard'
import { info, edit } from '@/api/file/setting'

export default {
  name: 'FileSetting',

  data() {
    return {
      name: '文件设置',
      height: 680,
      loading: false,
      storages: [],
      file_types: [],
      group: [],
      tag: [],
      model: {
        is_upload_admin: 1,
        is_upload_api: 1,
        storage: 'local',
        qiniu_access_key: '',
        qiniu_secret_key: '',
        qiniu_bucket: '',
        qiniu_domain: '',
        aliyun_access_key_id: '',
        aliyun_access_key_secret: '',
        aliyun_bucket: '',
        aliyun_domain: '',
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
        aws_access_key_id: '',
        aws_secret_access_key: '',
        aws_bucket: '',
        aws_region: '',
        aws_domain: '',
        huawei_access_key_id: '',
        huawei_secret_access_key: '',
        huawei_bucket: '',
        huawei_endpoint: '',
        huawei_domain: '',
        image_ext: '',
        image_exts: '',
        image_size: 0,
        video_ext: '',
        video_exts: '',
        video_size: 0,
        audio_ext: '',
        audio_exts: '',
        audio_size: 0,
        word_ext: '',
        word_exts: '',
        word_size: 0,
        other_ext: '',
        other_exts: '',
        other_size: 0,
        is_api_file: 0,
        api_file_types: [],
        api_file_group_ids: [],
        api_file_tag_ids: []
      },
      rules: {
        storage: [{ required: true, message: '请选择存储方式', trigger: 'blur' }],
        qiniu_access_key: [{ required: true, message: '请输入 AccessKey', trigger: 'blur' }],
        qiniu_secret_key: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
        qiniu_bucket: [{ required: true, message: '请输入空间名称', trigger: 'blur' }],
        qiniu_domain: [{ required: true, message: '请输入访问域名', trigger: 'blur' }],
        aliyun_access_key_id: [{ required: true, message: '请输入 AccessKey ID', trigger: 'blur' }],
        aliyun_access_key_secret: [
          { required: true, message: '请输入 AccessKey Secret', trigger: 'blur' }
        ],
        aliyun_bucket: [{ required: true, message: '请输入 Bucket 名称', trigger: 'blur' }],
        aliyun_endpoint: [{ required: true, message: '请输入 Endpoint 地域节点', trigger: 'blur' }],
        aliyun_domain: [{ required: true, message: '请输入 Bucket 域名', trigger: 'blur' }],
        tencent_secret_id: [{ required: true, message: '请输入 SecretId', trigger: 'blur' }],
        tencent_secret_key: [{ required: true, message: '请输入 SecretKey', trigger: 'blur' }],
        tencent_bucket: [{ required: true, message: '请输入存储桶名称', trigger: 'blur' }],
        tencent_region: [{ required: true, message: '请输入所属地域', trigger: 'blur' }],
        tencent_domain: [{ required: true, message: '请输入访问域名', trigger: 'blur' }],
        baidu_access_key: [{ required: true, message: '请输入 Access Key', trigger: 'blur' }],
        baidu_secret_key: [{ required: true, message: '请输入 Secret Key', trigger: 'blur' }],
        baidu_bucket: [{ required: true, message: '请输入 Bucket 名称', trigger: 'blur' }],
        baidu_domain: [{ required: true, message: '请输入所属地域', trigger: 'blur' }],
        baidu_endpoint: [{ required: true, message: '请输入官方域名', trigger: 'blur' }],
        upyun_service_name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
        upyun_operator_name: [{ required: true, message: '请输入操作员', trigger: 'blur' }],
        upyun_operator_pwd: [{ required: true, message: '请输入操作员密码', trigger: 'blur' }],
        upyun_domain: [{ required: true, message: '请输入加速域名', trigger: 'blur' }],
        huawei_access_key_id: [
          { required: true, message: '请输入 Access Key ID', trigger: 'blur' }
        ],
        huawei_secret_access_key: [
          { required: true, message: '请输入 Secret Access Key', trigger: 'blur' }
        ],
        huawei_bucket: [{ required: true, message: '请输入桶名称', trigger: 'blur' }],
        huawei_endpoint: [{ required: true, message: '请输入Endpoint(地域节点)', trigger: 'blur' }],
        huawei_domain: [{ required: true, message: '请输入访问域名', trigger: 'blur' }],
        aws_access_key_id: [{ required: true, message: '请输入 Access Key ID', trigger: 'blur' }],
        aws_secret_access_key: [
          { required: true, message: '请输入 Secret Access Key', trigger: 'blur' }
        ],
        aws_bucket: [{ required: true, message: '请输入存储桶名称', trigger: 'blur' }],
        aws_region: [{ required: true, message: '请输入区域终端节点', trigger: 'blur' }],
        aws_domain: [{ required: true, message: '请输入访问域名', trigger: 'blur' }]
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
        this.setData(res)
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      info()
        .then((res) => {
          this.setData(res)
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    setData(res) {
      this.model = { ...res.data }
      this.storages = res.data.storages
      this.file_types = res.data.file_types
      this.group = res.data.group
      this.tag = res.data.tag
      delete this.model.storages
      delete this.model.file_types
      delete this.model.group
      delete this.model.tag
      this.loading = false
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
