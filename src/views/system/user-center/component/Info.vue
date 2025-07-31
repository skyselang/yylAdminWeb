<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('头像')">
            <FileImage :file-url="model.avatar_url" :height="100" avatar />
          </el-form-item>
          <el-form-item :label="$t('编号')" prop="unique">
            <el-input v-model="model.unique" />
          </el-form-item>
          <el-form-item :label="$t('昵称')" prop="nickname">
            <el-input v-model="model.nickname" />
          </el-form-item>
          <el-form-item :label="$t('账号')" prop="username">
            <el-input v-model="model.username" />
          </el-form-item>
          <el-form-item :label="$t('手机')" prop="phone">
            <el-input v-model="model.phone" />
          </el-form-item>
          <el-form-item :label="$t('邮箱')" prop="email">
            <el-input v-model="model.email" />
          </el-form-item>
          <el-form-item :label="$t('部门')" prop="dept_names">
            <el-input v-model="model.dept_names" />
          </el-form-item>
          <el-form-item :label="$t('职位')" prop="post_names">
            <el-input v-model="model.post_names" />
          </el-form-item>
          <el-form-item :label="$t('添加时间')" prop="create_time">
            <el-input v-model="model.create_time" disabled />
          </el-form-item>
          <el-form-item :label="$t('修改时间')" prop="update_time">
            <el-input v-model="model.update_time" disabled />
          </el-form-item>
          <el-form-item :label="$t('退出时间')" prop="logout_time">
            <el-input v-model="model.logout_time" disabled />
          </el-form-item>
          <el-form-item :label="$t('登录IP')" prop="login_ip">
            <el-col :span="9">
              <el-input v-model="model.login_ip" disabled />
            </el-col>
            <el-col :span="6" class="ya-form-item__label">
              <el-text>{{ $t('上次登录IP') }}</el-text>
            </el-col>
            <el-col :span="9">
              <el-input v-model="model.last_login_ip" disabled />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('登录地区')" prop="login_time">
            <el-col :span="9">
              <el-input v-model="model.login_region" disabled />
            </el-col>
            <el-col :span="6" class="ya-form-item__label">
              <el-text>{{ $t('上次登录地区') }}</el-text>
            </el-col>
            <el-col :span="9">
              <el-input v-model="model.last_login_region" disabled />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('登录时间')" prop="last_login_time">
            <el-col :span="9">
              <el-input v-model="model.login_time" disabled />
            </el-col>
            <el-col :span="6" class="ya-form-item__label">
              <el-text>{{ $t('上次登录时间') }}</el-text>
            </el-col>
            <el-col :span="9">
              <el-input v-model="model.last_login_time" disabled />
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-form-item>
      <el-button :loading="loading" @click="refresh">{{ $t('刷新') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight } from '@/utils/index'
import { infoApi } from '@/api/system/user-center'

export default {
  data() {
    return {
      name: '我的信息',
      height: 680,
      loading: false,
      model: {
        avatar_id: 0,
        avatar_url: '',
        username: '',
        nickname: '',
        phone: '',
        email: '',
        dept_names: '',
        post_names: '',
        create_time: '',
        update_time: '',
        logout_time: '',
        login_ip: '',
        login_time: '',
        login_region: '',
        last_login_ip: '',
        last_login_time: '',
        last_login_region: ''
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
    info(msg = false) {
      this.loading = true
      infoApi()
        .then((res) => {
          this.model = res.data
          this.loading = false
          if (msg) {
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
    }
  }
}
</script>

<style scoped lang="scss">
.ya-form-item__label {
  display: inline-flex;
  justify-content: flex-end;
  text-align: right;
  padding: 0 12px 0 0;
}
</style>
