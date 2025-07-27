<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('前台上传')" prop="is_upload_api">
            <ElSwitchOnoff v-model="model.is_upload_api" />
            <el-text size="default">{{ $t('关闭后，前台无法上传文件') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('后台上传')" prop="is_upload_admin">
            <ElSwitchOnoff v-model="model.is_upload_admin" />
            <el-text size="default">{{ $t('关闭后，后台无法上传文件') }}</el-text>
          </el-form-item>
          <el-form-item label="HTTPS" prop="is_storage_https">
            <ElSwitchWhether v-model="model.is_storage_https" />
            <el-text size="default">{{ $t('对象存储是否支持 https 访问') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('存储方式')" prop="storage">
            <el-col :span="24">
              <el-select v-model="model.storage">
                <el-option v-for="v in storages" :key="v.value" :value="v.value" :label="v.label" @change="storage" />
              </el-select>
            </el-col>
          </el-form-item>
          <div v-if="model.storage == 'local'">
            <el-form-item>
              <el-card shadow="never">
                <el-text size="default">
                  {{ $t('文件将存储在服务器，保存在 public/storage 目录，文件以散列 hash 命名') }}
                  <br />
                  {{ $t('文件存储的目录需要有读写权限（777），有足够的存储空间') }}
                </el-text>
              </el-card>
            </el-form-item>
          </div>
          <div v-else-if="model.storage == 'qiniu'">
            <el-form-item>
              <el-card shadow="never">
                <el-text size="default">
                  {{ $t('文件将上传到七牛云 Kodo 存储，对象存储 > 空间管理 > 空间设置 > 访问控制, 设置为 公开空间') }}
                  <br />
                  {{ $t('需要配置跨域访问CORS规则，设置：来源Origin为*，允许Methods为GET,POST，允许Headers为*') }}
                </el-text>
              </el-card>
            </el-form-item>
            <el-form-item label="AccessKey" prop="qiniu_access_key">
              <el-col :span="24">
                <el-input v-model="model.qiniu_access_key" clearable>
                  <template #append><Clipboard :content="model.qiniu_access_key" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('AccessKey（AK）在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item label="SecretKey" prop="qiniu_secret_key">
              <el-col :span="24">
                <el-input v-model="model.qiniu_secret_key" clearable>
                  <template #append><Clipboard :content="model.qiniu_secret_key" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('SecretKey（SK）在 [ 七牛云 > 个人中心 > 密钥管理 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('空间名称')" prop="qiniu_bucket">
              <el-col :span="24">
                <el-input v-model="model.qiniu_bucket" clearable>
                  <template #append><Clipboard :content="model.qiniu_bucket" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('空间名称 在 [ 七牛云 > 对象存储 > 空间管理 ] 设置和获取') }}</el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('访问域名')" prop="qiniu_domain">
              <el-col :span="24">
                <el-input v-model="model.qiniu_domain" clearable>
                  <template #append><Clipboard :content="model.qiniu_domain" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('访问域名 在 [ 七牛云 > 对象存储 > 空间管理 > 域名管理 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
          </div>
          <div v-else-if="model.storage == 'aliyun'">
            <el-form-item>
              <el-card shadow="never">
                <el-text size="default">
                  {{ $t('文件将上传到阿里云 OSS 存储，需要配置 OSS 公开访问及跨域策略') }}
                  <br />
                  {{ $t('需要配置跨域访问CORS规则，设置：来源Origin为*，允许Methods为GET,POST，允许Headers为*') }}
                </el-text>
              </el-card>
            </el-form-item>
            <el-form-item label="AccessKey ID" prop="aliyun_access_key_id">
              <el-col :span="24">
                <el-input v-model="model.aliyun_access_key_id" clearable>
                  <template #append><Clipboard :content="model.aliyun_access_key_id" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('AccessKey ID 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item label="AccessKey Secret" prop="aliyun_access_key_secret">
              <el-col :span="24">
                <el-input v-model="model.aliyun_access_key_secret" clearable>
                  <template #append><Clipboard :content="model.aliyun_access_key_secret" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('AccessKey Secret 在 [ 阿里云 > 个人中心 > AccessKey 管理 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('Bucket名称')" prop="aliyun_bucket">
              <el-col :span="24">
                <el-input v-model="model.aliyun_bucket" clearable>
                  <template #append><Clipboard :content="model.aliyun_bucket" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('Bucket 名称 在 [ 阿里云 > 对象存储 > Bucket 列表 ] 获取') }}</el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('Endpoint地域节点')" prop="aliyun_endpoint">
              <el-col :span="24">
                <el-input v-model="model.aliyun_endpoint" clearable>
                  <template #append><Clipboard :content="model.aliyun_endpoint" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Endpoint（地域节点） 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('Bucket域名')" prop="aliyun_domain">
              <el-col :span="24">
                <el-input v-model="model.aliyun_domain" clearable>
                  <template #append><Clipboard :content="model.aliyun_domain" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Bucket 域名 在 [ 阿里云 > 对象存储 > Bucket 列表 > Bucket 概览 ] 获取') }}
                </el-text>
              </el-col>
            </el-form-item>
          </div>
          <div v-else-if="model.storage == 'tencent'">
            <el-form-item>
              <el-card shadow="never">
                <el-text size="default">
                  {{ $t('文件将上传到腾讯云 COS 存储，需要配置 COS 公有读私有写访问权限及跨域策略') }}
                  <br />
                  {{ $t('需要配置跨域访问CORS规则，设置：来源Origin为*，允许Methods为 GET,POST，允许Headers为*') }}
                </el-text>
              </el-card>
            </el-form-item>
            <el-form-item label="SecretId" prop="tencent_secret_id">
              <el-col :span="24">
                <el-input v-model="model.tencent_secret_id" clearable>
                  <template #append><Clipboard :content="model.tencent_secret_id" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('SecretId 在 [ 腾讯云 > 个人中心 > 访问管理 > 访问密钥 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item label="SecretKey" prop="tencent_secret_key">
              <el-col :span="24">
                <el-input v-model="model.tencent_secret_key" clearable>
                  <template #append><Clipboard :content="model.tencent_secret_key" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('SecretKey 在 [ 腾讯云 > 个人中心 > 访问管理 > 访问密钥 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('存储桶名称')" prop="tencent_bucket">
              <el-col :span="24">
                <el-input v-model="model.tencent_bucket" clearable>
                  <template #append><Clipboard :content="model.tencent_bucket" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('存储桶名称 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取') }}</el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('所属地域')" prop="tencent_region">
              <el-col :span="24">
                <el-input v-model="model.tencent_region" clearable>
                  <template #append><Clipboard :content="model.tencent_region" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('所属地域 在 [ 腾讯云 > 对象存储 > 存储桶列表 ] 获取如：ap-guangzhou') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('访问域名')" prop="tencent_domain">
              <el-col :span="24">
                <el-input v-model="model.tencent_domain" clearable>
                  <template #append><Clipboard :content="model.tencent_domain" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('访问域名 在 [ 腾讯云 > 对象存储 > 存储桶列表 > 概览 ] 获取') }}</el-text>
              </el-col>
            </el-form-item>
          </div>
          <div v-else-if="model.storage == 'baidu'">
            <el-form-item>
              <el-card shadow="never">
                <el-text size="default">
                  {{ $t('文件将上传到百度云 BOS 存储，对象存储>Bucket列表>配置设置>Bucket权限配置, 设置为公共 *') }}
                  <br />
                  {{ $t('需要配置跨域访问CORS规则，设置：来源Origin为*，允许Methods为GET,POST，允许Headers为*') }}
                </el-text>
              </el-card>
            </el-form-item>
            <el-form-item label="Access Key" prop="baidu_access_key">
              <el-col :span="24">
                <el-input v-model="model.baidu_access_key" clearable>
                  <template #append><Clipboard :content="model.baidu_access_key" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Access Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item label="Secret Key" prop="baidu_secret_key">
              <el-col :span="24">
                <el-input v-model="model.baidu_secret_key" clearable>
                  <template #append><Clipboard :content="model.baidu_secret_key" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Secret Key 在 [ 百度云 > 个人中心 > 安全认证 > Access Key ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('Bucket名称')" prop="baidu_bucket">
              <el-col :span="24">
                <el-input v-model="model.baidu_bucket" clearable>
                  <template #append><Clipboard :content="model.baidu_bucket" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('Bucket 名称 在 [ 百度云 > 对象存储 > Bucket 列表 ] 获取') }}</el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('所属地域')" prop="baidu_endpoint">
              <el-col :span="24">
                <el-input v-model="model.baidu_endpoint" clearable>
                  <template #append><Clipboard :content="model.baidu_endpoint" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('所属地域：官方域名去掉 Bucket 名称，如：gz.bcebos.com') }}</el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('官方域名')" prop="baidu_domain">
              <el-col :span="24">
                <el-input v-model="model.baidu_domain" clearable>
                  <template #append><Clipboard :content="model.baidu_domain" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('官方域名 在 [ 百度云 > 对象存储 > Bucket列表 > 发布管理 ]获取') }}
                </el-text>
              </el-col>
            </el-form-item>
          </div>
          <div v-else-if="model.storage == 'upyun'">
            <el-form-item>
              <el-card shadow="never">
                <el-text size="default">
                  {{ $t('文件将上传到又拍云 USS 存储，云存储 > 服务管理 > 配置 > CORS 跨域共享, 设置为 已开启') }}
                  <br />
                  {{ $t('请根据业务域名和需求，配置 CORS 跨域共享 规则，CORS 配置') }}
                </el-text>
              </el-card>
            </el-form-item>
            <el-form-item :label="$t('服务名称')" prop="upyun_service_name">
              <el-col :span="24">
                <el-input v-model="model.upyun_service_name" clearable>
                  <template #append><Clipboard :content="model.upyun_service_name" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('服务名称 在 [ 又拍云 > 云存储 > 服务管理 ] 设置和获取') }}</el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('操作员')" prop="upyun_operator_name">
              <el-col :span="24">
                <el-input v-model="model.upyun_operator_name" clearable>
                  <template #append><Clipboard :content="model.upyun_operator_name" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('操作员 在 [ 又拍云 > 云存储 > 服务管理 > 配置 > 存储管理-操作员授权 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('操作员密码')" prop="upyun_operator_pwd">
              <el-col :span="24">
                <el-input v-model="model.upyun_operator_pwd" clearable>
                  <template #append><Clipboard :content="model.upyun_operator_pwd" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('操作员密码 在 [ 又拍云 > 云存储 > 服务管理 > 配置 > 存储管理-操作员授权 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('加速域名')" prop="upyun_domain">
              <el-col :span="24">
                <el-input v-model="model.upyun_domain" clearable>
                  <template #append><Clipboard :content="model.upyun_domain" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('加速域名 在 [ 又拍云 > 云存储 > 服务管理 > 配置 > 域名管理-加速域名 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
          </div>
          <div v-else-if="model.storage == 'huawei'">
            <el-form-item>
              <el-card shadow="never">
                <el-text size="default">
                  {{ $t('文件将上传到 华为云 OBS') }}
                  <br />
                  {{ $t('请根据业务域名和需求，配置 华为云 OBS 权限控制桶策略，数据安全CORS规则') }}
                </el-text>
              </el-card>
            </el-form-item>
            <el-form-item label="Access Key ID" prop="huawei_access_key_id">
              <el-col :span="24">
                <el-input v-model="model.huawei_access_key_id" clearable>
                  <template #append><Clipboard :content="model.huawei_access_key_id" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Access Key ID 在 [ 华为云 > 我的账号 > 我的凭证 > 访问密钥 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item label="Secret Access KEY" prop="huawei_secret_access_key">
              <el-col :span="24">
                <el-input v-model="model.huawei_secret_access_key" clearable>
                  <template #append><Clipboard :content="model.huawei_secret_access_key" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Secret Access KEY 在 [ 华为云 > 我的账号 > 我的凭证 > 访问密钥 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('桶名称')" prop="huawei_bucket">
              <el-col :span="24">
                <el-input v-model="model.huawei_bucket" clearable>
                  <template #append><Clipboard :content="model.huawei_bucket" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('桶名称 在 [ 华为云 > 对象存储 > 桶列表 ] 设置和获取') }}</el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('Endpoint(地域节点)')" prop="huawei_endpoint">
              <el-col :span="24">
                <el-input v-model="model.huawei_endpoint" clearable>
                  <template #append><Clipboard :content="model.huawei_endpoint" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Endpoint(地域节点) 在 [ 华为云 > 对象存储 > 桶列表 > 概览 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('访问域名')" prop="huawei_domain">
              <el-col :span="24">
                <el-input v-model="model.huawei_domain" clearable>
                  <template #append><Clipboard :content="model.huawei_domain" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('访问域名 在 [ 华为云 > 对象存储 > 桶列表 > 概览 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
          </div>
          <div v-else-if="model.storage == 'aws'">
            <el-form-item>
              <el-card shadow="never">
                <el-text size="default">
                  {{ $t('文件将上传到 AWS S3，兼容基于AWS S3的对象存储，如京东云OSS、火山引擎TOS') }}
                  <br />
                  {{ $t('请根据业务域名和需求，配置 AWS S3 访问控制') }}
                </el-text>
              </el-card>
            </el-form-item>
            <el-form-item label="Access Key ID" prop="aws_access_key_id">
              <el-col :span="24">
                <el-input v-model="model.aws_access_key_id" clearable>
                  <template #append><Clipboard :content="model.aws_access_key_id" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('Access Key ID 在 [ AWS > 我的账号 > 安全凭证 ] 设置和获取') }}</el-text>
              </el-col>
            </el-form-item>
            <el-form-item label="Secret Access KEY" prop="aws_secret_access_key">
              <el-col :span="24">
                <el-input v-model="model.aws_secret_access_key" clearable>
                  <template #append><Clipboard :content="model.aws_secret_access_key" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Secret Access KEY 在 [ AWS > 我的账号 > 安全凭证 ] 设置和获取') }}
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('Bucket 名称')" prop="aws_bucket">
              <el-col :span="24">
                <el-input v-model="model.aws_bucket" clearable>
                  <template #append><Clipboard :content="model.aws_bucket" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('Bucket 名称 在 [ AWS > S3 ] 设置和获取') }}；eg：yyladmin</el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('Region 区域')" prop="aws_region">
              <el-col :span="24">
                <el-input v-model="model.aws_region" clearable>
                  <template #append><Clipboard :content="model.aws_region" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">{{ $t('Region 区域 在 [ AWS > S3 ] 设置和获取') }}；eg：cn-east-1</el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('Endpoint 端点')" prop="aws_endpoint">
              <el-col :span="24">
                <el-input v-model="model.aws_endpoint" clearable>
                  <template #append><Clipboard :content="model.aws_endpoint" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Endpoint 端点 在 [ AWS > S3 ] 设置和获取') }}；eg：https://s3.cn-east-1.jdcloud-oss.com
                </el-text>
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('Bucket 域名')" prop="aws_domain">
              <el-col :span="24">
                <el-input v-model="model.aws_domain" clearable>
                  <template #append><Clipboard :content="model.aws_domain" /></template>
                </el-input>
              </el-col>
              <el-col :span="24">
                <el-text size="default">
                  {{ $t('Bucket 域名 在 [ AWS > S3 ] 设置和获取') }}；eg：https://yyladmin.s3.cn-east-1.jdcloud-oss.com
                </el-text>
              </el-col>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-form-item>
      <el-button :loading="loading" @click="refresh">{{ $t('刷新') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight, hasPerm } from '@/utils/index'
import { basicInfoApi as infoApi, basicEditApi as editApi } from '@/api/file/setting'

export default {
  data() {
    return {
      name: '基本设置',
      height: 680,
      loading: false,
      model: {
        is_upload_admin: 1,
        is_upload_api: 1,
        is_storage_https: 1,
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
        huawei_access_key_id: '',
        huawei_secret_access_key: '',
        huawei_bucket: '',
        huawei_endpoint: '',
        huawei_domain: '',
        aws_access_key_id: '',
        aws_secret_access_key: '',
        aws_bucket: '',
        aws_region: '',
        aws_endpoint: '',
        aws_domain: ''
      },
      rules: {},
      storages: []
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
    this.rules = {
      storage: [{ required: true, message: this.$t('请选择存储方式'), trigger: 'blur' }],
      qiniu_access_key: [{ required: true, message: this.$t('请输入 AccessKey'), trigger: 'blur' }],
      qiniu_secret_key: [{ required: true, message: this.$t('请输入 SecretKey'), trigger: 'blur' }],
      qiniu_bucket: [{ required: true, message: this.$t('请输入空间名称'), trigger: 'blur' }],
      qiniu_domain: [{ required: true, message: this.$t('请输入访问域名'), trigger: 'blur' }],
      aliyun_access_key_id: [{ required: true, message: this.$t('请输入 AccessKey ID'), trigger: 'blur' }],
      aliyun_access_key_secret: [{ required: true, message: this.$t('请输入 AccessKey Secret'), trigger: 'blur' }],
      aliyun_bucket: [{ required: true, message: this.$t('请输入 Bucket 名称'), trigger: 'blur' }],
      aliyun_endpoint: [{ required: true, message: this.$t('请输入 Endpoint 地域节点'), trigger: 'blur' }],
      aliyun_domain: [{ required: true, message: this.$t('请输入 Bucket 域名'), trigger: 'blur' }],
      tencent_secret_id: [{ required: true, message: this.$t('请输入 SecretId'), trigger: 'blur' }],
      tencent_secret_key: [{ required: true, message: this.$t('请输入 SecretKey'), trigger: 'blur' }],
      tencent_bucket: [{ required: true, message: this.$t('请输入存储桶名称'), trigger: 'blur' }],
      tencent_region: [{ required: true, message: this.$t('请输入所属地域'), trigger: 'blur' }],
      tencent_domain: [{ required: true, message: this.$t('请输入访问域名'), trigger: 'blur' }],
      baidu_access_key: [{ required: true, message: this.$t('请输入 Access Key'), trigger: 'blur' }],
      baidu_secret_key: [{ required: true, message: this.$t('请输入 Secret Key'), trigger: 'blur' }],
      baidu_bucket: [{ required: true, message: this.$t('请输入 Bucket 名称'), trigger: 'blur' }],
      baidu_domain: [{ required: true, message: this.$t('请输入所属地域'), trigger: 'blur' }],
      baidu_endpoint: [{ required: true, message: this.$t('请输入官方域名'), trigger: 'blur' }],
      upyun_service_name: [{ required: true, message: this.$t('请输入服务名称'), trigger: 'blur' }],
      upyun_operator_name: [{ required: true, message: this.$t('请输入操作员'), trigger: 'blur' }],
      upyun_operator_pwd: [{ required: true, message: this.$t('请输入操作员密码'), trigger: 'blur' }],
      upyun_domain: [{ required: true, message: this.$t('请输入加速域名'), trigger: 'blur' }],
      huawei_access_key_id: [{ required: true, message: this.$t('请输入 Access Key ID'), trigger: 'blur' }],
      huawei_secret_access_key: [{ required: true, message: this.$t('请输入 Secret Access Key'), trigger: 'blur' }],
      huawei_bucket: [{ required: true, message: this.$t('请输入桶名称'), trigger: 'blur' }],
      huawei_endpoint: [{ required: true, message: this.$t('请输入Endpoint(地域节点)'), trigger: 'blur' }],
      huawei_domain: [{ required: true, message: this.$t('请输入访问域名'), trigger: 'blur' }],
      aws_access_key_id: [{ required: true, message: this.$t('请输入 Access Key ID'), trigger: 'blur' }],
      aws_secret_access_key: [{ required: true, message: this.$t('请输入 Secret Access Key'), trigger: 'blur' }],
      aws_bucket: [{ required: true, message: this.$t('请输入 Bucket 名称'), trigger: 'blur' }],
      aws_region: [{ required: true, message: this.$t('请输入 Region 区域'), trigger: 'blur' }],
      aws_endpoint: [{ required: true, message: this.$t('请输入 Endpoint 端点'), trigger: 'blur' }],
      aws_domain: [{ required: true, message: this.$t('请输入 Bucket 域名'), trigger: 'blur' }]
    }
  },
  methods: {
    hasPerm,
    // 信息
    info(ismsg = false) {
      if (ismsg) {
        this.loading = true
      }
      infoApi()
        .then((res) => {
          this.storages = res.data.basedata.storages
          delete res.data.basedata
          this.model = res.data
          this.loading = false
          if (ismsg) {
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 刷新
    refresh() {
      this.info(true)
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          editApi(this.model)
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
    storage() {
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].clearValidate()
      }
    }
  }
}
</script>
