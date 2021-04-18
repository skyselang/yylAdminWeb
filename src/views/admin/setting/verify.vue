<template>
  <div class="app-container">
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="ref" :model="model" :rules="rules" label-width="130px">
            <el-form-item v-if="model.verify_switch" label="验证码" prop="verify_code">
              <el-image style="width:200px;height:50px;" :src="model.verify_src" fit="fill" alt="验证码" title="点击刷新验证码" @click="refresh()" />
            </el-form-item>
            <el-form-item label="验证码开关" prop="switch">
              <el-switch v-model="model.switch" />
            </el-form-item>
            <el-form-item label="验证码曲线" prop="curve">
              <el-switch v-model="model.curve" />
            </el-form-item>
            <el-form-item label="验证码杂点" prop="noise">
              <el-switch v-model="model.noise" />
            </el-form-item>
            <el-form-item label="验证码背景图" prop="bgimg">
              <el-switch v-model="model.bgimg" />
            </el-form-item>
            <el-form-item label="验证码类型" prop="type">
              <el-select v-model="model.type" filterable placeholder="请选择">
                <el-option v-for="item in verify_type_arr" :key="item.value" :label="item.label" :value="item.value">
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="验证码位数" prop="length">
              <el-select v-model="model.length" filterable placeholder="请选择">
                <el-option v-for="item in verify_length_arr" :key="item.value" :label="item.label" :value="item.value">
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="验证码有效时间" prop="expire">
              <el-col :xs="24" :sm="8">
                <el-input v-model="model.expire" type="number">
                  <template slot="append">秒</template>
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button @click="refresh()">刷新</el-button>
              <el-button type="primary" @click="submit()">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { info, verify } from '@/api/admin-setting'

export default {
  name: 'SettingVerify',
  components: {},
  data() {
    return {
      loading: false,
      verify: false,
      verifySrc: '',
      verify_type_arr: [
        { value: 1, label: '数字' },
        { value: 2, label: '字母' },
        { value: 3, label: '数字字母' },
        { value: 4, label: '算术' },
        { value: 5, label: '中文' }
      ],
      verify_length_arr: [
        { value: 3, label: '3位' },
        { value: 4, label: '4位' },
        { value: 5, label: '5位' },
        { value: 6, label: '6位' }
      ],
      model: {
        switch: false,
        curve: false,
        noise: false,
        bgimg: false,
        type: 1,
        length: 4,
        expire: 180
      },
      rules: {
        type: [{ required: true, message: '请选择验证码类型', trigger: 'blur' }],
        length: [{ required: true, message: '请选择验证码位数', trigger: 'blur' }],
        expire: [{ required: true, message: '请输入验证码有效时间', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.info()
  },
  methods: {
    // 信息
    info() {
      info().then(res => {
        this.model = res.data.verify
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          verify(this.model).then(res => {
            this.info()
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 刷新
    refresh() {
      this.loading = true
      info().then(res => {
        this.model = res.data.verify
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
