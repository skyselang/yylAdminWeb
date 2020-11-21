<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-form ref="verifyRefs" :rules="verifyRules" :model="verifyModel" label-width="120px">
          <el-row>
            <el-col :xs="24" :sm="12">
              <el-form-item v-if="verifyShow" label="验证码" prop="verify_code">
                <el-image style="width:200px;height:50px;" :src="verifySrc" fit="fill" alt="验证码" title="点击刷新验证码" @click="verifyRefresh" />
              </el-form-item>
              <el-form-item label="验证码开关" prop="switch">
                <el-switch v-model="verifyModel.switch" />
              </el-form-item>
              <el-form-item label="验证码曲线" prop="curve">
                <el-switch v-model="verifyModel.curve" />
              </el-form-item>
              <el-form-item label="验证码杂点" prop="noise">
                <el-switch v-model="verifyModel.noise" />
              </el-form-item>
              <el-form-item label="验证码背景图" prop="bgimg">
                <el-switch v-model="verifyModel.bgimg" />
              </el-form-item>
              <el-form-item label="验证码类型" prop="type">
                <el-select v-model="verifyModel.type" filterable placeholder="请选择">
                  <el-option v-for="item in verify_type_arr" :key="item.value" :label="item.label" :value="item.value">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="验证码位数" prop="length">
                <el-select v-model="verifyModel.length" filterable placeholder="请选择">
                  <el-option v-for="item in verify_length_arr" :key="item.value" :label="item.label" :value="item.value">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="验证码有效时间" prop="expire">
                <el-col :xs="24" :sm="12">
                  <el-input v-model="verifyModel.expire" type="number">
                    <template slot="append">秒</template>
                  </el-input>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button :loading="verifyRefLoad" @click="verifyRef()">刷新</el-button>
                <el-button :loading="verifySubLoad" type="primary" @click="verifySub()">提交</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { verify, settingVerify } from '@/api/admin'

export default {
  name: 'SettingVerify',
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
        switch: false,
        curve: false,
        noise: false,
        bgimg: false,
        type: 1,
        length: 4,
        expire: 180
      },
      verifyRules: {
        type: [
          {
            required: true,
            message: '请选择验证码类型',
            trigger: 'blur'
          }
        ],
        length: [
          {
            required: true,
            message: '请选择验证码位数',
            trigger: 'blur'
          }
        ],
        expire: [
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
      this.$refs['verifyRefs'].validate(valid => {
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
    // 验证码获取
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
    // 验证码刷新
    verifyRefresh() {
      this.getVerify()
    }
  }
}
</script>
