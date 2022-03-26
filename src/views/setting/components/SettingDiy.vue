<template>
  <el-card class="box-card">
    <el-row class="dialog-body" :style="{height:height+'px'}">
      <el-col :xs="24" :sm="24" :md="24">
        <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
          <el-form-item label="" prop="">
            <span>自定义配置提交后前台{{ name }}接口会返回。</span>
            <el-button size="mini" type="primary" @click="add()">增加</el-button>
          </el-form-item>
          <el-form-item v-for="(item, index) in model.diy_config" :key="index" label="">
            <el-col :span="5">
              <el-input v-model="item.config_key" clearable placeholder="请输入键名">
                <template slot="prepend">键名</template>
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-input v-model="item.config_val" clearable placeholder="请输入键值">
                <template slot="prepend">键值</template>
              </el-input>
            </el-col>
            <el-col :span="10">
              <el-input v-model="item.config_desc" clearable placeholder="请输入说明">
                <template slot="prepend">说明</template>
              </el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="danger" @click="dele(index)">删除</el-button>
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
import { diyInfo, diyEdit } from '@/api/setting/setting'

export default {
  name: 'SettingSettingDiy',
  components: {},
  data() {
    return {
      name: '自定义设置',
      height: 680,
      loading: false,
      model: {
        diy_config: []
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
      diyInfo().then(res => {
        this.model = res.data
      })
    },
    // 增加
    add() {
      this.model.diy_config.push({ config_key: '', config_val: '', config_desc: '' })
    },
    // 删除
    dele(index) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.model.diy_config.splice(index, 1)
      }).catch(() => {})
    },
    // 刷新
    refresh() {
      this.loading = true
      diyInfo().then((res) => {
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
          diyEdit(this.model).then(res => {
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
