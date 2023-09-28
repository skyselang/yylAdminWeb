<template>
  <el-card class="dialog-body" :style="{height:height+'px'}">
    <el-row>
      <el-col :span="16">
        <el-form
          ref="ref"
          :model="model"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="接口速率">
            <el-col :span="6">
              <el-input v-model="model.api_rate_num" type="number" placeholder="次数">
                <template slot="append">次 /</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-input v-model="model.api_rate_time" type="number" placeholder="时间">
                <template slot="append">秒</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="" prop="">
            次数/时间；3/1：3次1秒；次数为 0 则不限制。
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
import { apiInfo, apiEdit } from '@/api/system/setting'

export default {
  name: 'SystemSettingApi',
  components: {},
  data() {
    return {
      name: '接口设置',
      height: 680,
      loading: false,
      model: {
        api_rate_num: 3,
        api_rate_time: 1
      },
      rules: {
        api_rate_num: [{ required: true, message: '请输入次数', trigger: 'blur' }],
        api_rate_time: [{ required: true, message: '请输入时间', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight(180)
    this.info()
  },
  methods: {
    // 信息
    info() {
      apiInfo().then(res => {
        this.model = res.data
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      apiInfo().then((res) => {
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
          apiEdit(this.model).then(res => {
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
