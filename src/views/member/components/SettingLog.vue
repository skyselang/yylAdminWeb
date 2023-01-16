<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <el-row :gutter="0">
      <el-col :span="12">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="日志记录开关" prop="log_switch">
            <el-col :span="8">
              <el-switch v-model="model.log_switch" :active-value="1" :inactive-value="0" />
            </el-col>
            <el-col :span="16">
              开启后，会记录会员日志。
            </el-col>
          </el-form-item>
          <el-form-item label="日志保留时间" prop="log_save_time">
            <el-col :span="8">
              <el-input v-model="model.log_save_time" type="number">
                <template slot="append">天</template>
              </el-input>
            </el-col>
            <el-col :span="16">
              会员日志保留天数，0永久保留。
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="refresh()">刷新</el-button>
            <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { logInfo, logEdit } from '@/api/member/setting'

export default {
  name: 'MemberSettingLog',
  components: {},
  data() {
    return {
      name: '日志设置',
      height: 680,
      loading: false,
      model: {
        log_switch: 0,
        log_save_time: 0
      },
      rules: {}
    }
  },
  created() {
    this.height = screenHeight(170)
    this.info()
  },
  methods: {
    // 信息
    info() {
      logInfo().then(res => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      logInfo().then((res) => {
        this.model = res.data
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          logEdit(this.model).then(res => {
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
