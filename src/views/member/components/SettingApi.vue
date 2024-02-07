<template>
  <el-row>
    <el-col :span="16">
      <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
        <el-form-item label="接口速率">
          <el-col :span="5">
            <el-input v-model="model.api_rate_num" type="number" placeholder="次数">
              <template #append>次 /</template>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="model.api_rate_time" type="number" placeholder="时间">
              <template #append>秒</template>
            </el-input>
          </el-col>
          <el-col :span="14">eg：3/1：3次1秒；次数为 0 则不限制</el-col>
        </el-form-item>
        <el-form-item label="会员接口" prop="is_member_api">
          <el-col :span="4">
            <el-switch v-model="model.is_member_api" :active-value="1" :inactive-value="0" />
          </el-col>
          <el-col :span="20"> 关闭后，不校验接口和权限，所有接口（免登除外）均需登录访问 </el-col>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" @click="refresh()">刷新</el-button>
          <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { apiInfo, apiEdit } from '@/api/member/setting'

export default {
  name: 'MemberSettingApi',
  data() {
    return {
      name: '接口设置',
      height: 680,
      loading: false,
      model: {
        is_member_api: 0,
        api_rate_num: 3,
        api_rate_time: 1
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(210)
    this.info()
  },
  methods: {
    // 信息
    info() {
      apiInfo().then((res) => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      apiInfo()
        .then((res) => {
          this.model = res.data
          this.loading = false
          ElMessage.success(res.msg)
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
          apiEdit(this.model)
            .then((res) => {
              this.loading = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
