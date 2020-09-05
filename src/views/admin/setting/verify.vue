<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">

        <el-form ref="verifyRef" :rules="verifyRules" :model="verifyModel" label-width="120px">
          <el-row>
            <el-col :xs="24" :sm="12">
              <el-form-item label="验证码开关" prop="verify_switch">
                <el-switch v-model="verifyModel.verify_switch" />
              </el-form-item>
              <el-form-item label="验证码曲线" prop="verify_curve">
                <el-switch v-model="verifyModel.verify_curve" />
              </el-form-item>
              <el-form-item label="验证码杂点" prop="verify_noise">
                <el-switch v-model="verifyModel.verify_noise" />
              </el-form-item>
              <el-form-item label="验证码背景图" prop="verify_bgimg">
                <el-switch v-model="verifyModel.verify_bgimg" />
              </el-form-item>
              <el-form-item label="验证码类型" prop="verify_type">
                <el-select v-model="verifyModel.verify_type" filterable placeholder="请选择">
                  <el-option v-for="item in verify_type_arr" :key="item.value" :label="item.label" :value="item.value">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="验证码位数" prop="verify_length">
                <el-select v-model="verifyModel.verify_length" filterable placeholder="请选择">
                  <el-option v-for="item in verify_length_arr" :key="item.value" :label="item.label" :value="item.value">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="验证码有效时间" prop="verify_expire">
                <el-col :xs="24" :sm="12">
                  <el-input v-model="verifyModel.verify_expire" type="number">
                    <template slot="append">秒</template>
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button :loading="verifyRefLoad" type="primary" @click="verifyRef()">
                  刷新
                </el-button>
                <el-button :loading="verifySubLoad" type="primary" @click="verifySub()">
                  提交
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item v-if="verifyShow" prop="verify_code">
                <el-image style="width:200px;height:50px;" :src="verifySrc" fit="fill" alt="验证码" title="点击刷新验证码" @click="verifyRefresh" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { verify } from '@/api/admin'
import { settingVerify } from '@/api/admin'

export default {
  name: 'Verify',
  components: {},
  data() {
    return {
      verifyRefLoad: false,
      verifySubLoad: false,
      verifyShow: false,
      verifySrc: '',
      verify_type_arr: [
        { value: '1', label: '数字' },
        { value: '2', label: '字母' },
        { value: '3', label: '数字字母' },
        { value: '4', label: '算术' },
        { value: '5', label: '中文' }
      ],
      verify_length_arr: [
        { value: '3', label: '3位' },
        { value: '4', label: '4位' },
        { value: '5', label: '5位' },
        { value: '6', label: '6位' }
      ],
      verifyModel: {
        verify_switch: false,
        verify_curve: false,
        verify_noise: false,
        verify_bgimg: false,
        verify_type: 1,
        verify_length: 4,
        verify_expire: 180
      },
      verifyRules: {
        verify_type: [
          {
            required: true,
            message: '请选择验证码类型',
            trigger: 'blur'
          }
        ],
        verify_length: [
          {
            required: true,
            message: '请选择验证码位数',
            trigger: 'blur'
          }
        ],
        verify_expire: [
          {
            required: true,
            message: '请输入验证码有效时间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getVerify()
    this.verifyGet()
  },
  methods: {
    // 获取
    verifyGet() {
      settingVerify().then(res => {
        this.verifyModel = res.data
      })
    },
    // 刷新
    verifyRef() {
      this.verifyRefLoad = true
      settingVerify()
        .then(res => {
          this.getVerify()
          this.verifyModel = res.data
          this.verifyRefLoad = false
          this.$message({ message: res.msg, type: 'success' })
        })
        .catch(() => {
          this.verifyRefLoad = false
        })
    },
    // 提交
    verifySub() {
      this.$refs['verifyRef'].validate(valid => {
        if (valid) {
          this.verifySubLoad = true
          settingVerify(this.verifyModel)
            .then(res => {
              this.getVerify()
              this.verifySubLoad = false
              this.$message({ message: res.msg, type: 'success' })
            })
            .catch(() => {
              this.verifySubLoad = false
            })
        }
      })
    },
    // 验证码
    getVerify() {
      verify()
        .then(res => {
          this.verifyShow = res.data.verify_switch
          if (res.data.verify_switch) {
            this.verifySrc = res.data.verify_src
          }
        })
        .catch(() => {})
    },
    // 刷新验证码
    verifyRefresh() {
      this.getVerify()
    }
  }
}
</script>
