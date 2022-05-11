<template>
  <el-card class="box-card">
    <el-row class="dialog-body" :style="{height:height+'px'}">
      <el-col :xs="24" :sm="22" :md="20" :lg="16" :xl="12">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="日志记录开关" prop="log_switch">
            <el-switch v-model="model.log_switch" :active-value="1" :inactive-value="0" />
            <span> 开启后，会记录会员日志。</span>
          </el-form-item>
          <el-form-item label="日志保留时间" prop="log_save_time">
            <el-input v-model="model.log_save_time" type="number">
              <template slot="append">天（0永久保留）</template>
            </el-input>
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
import { logInfo, logEdit } from '@/api/setting/setting'

export default {
  name: 'SettingSettingLog',
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
    this.height = screenHeight(210)
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
