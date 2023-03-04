<template>
  <div class="app-container">
    <!-- 内容设置 -->
    <el-card>
      <el-form ref="ref" :model="model" :rules="rules" label-width="120px">
        <el-tabs>
          <el-tab-pane label="内容设置" name="" class="dialog-body" :style="{height:height+'px'}">
            <el-form-item label="内容管理" prop="is_content">
              <el-col :span="3">
                <el-switch v-model="model.is_content" :active-value="1" :inactive-value="0" />
              </el-col>
              <el-col :span="21">
                <span>内容是否开启。关闭后无法访问。</span>
              </el-col>
            </el-form-item>
            <el-form-item label="自定义设置">
              <el-col :span="3">
                键名
              </el-col>
              <el-col :span="5">
                键值
              </el-col>
              <el-col :span="6">
                说明
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="add()">增加</el-button>
              </el-col>
            </el-form-item>
            <el-form-item v-for="(item, index) in model.diy_config" :key="index" label="">
              <el-col :span="3">
                <el-input v-model="item.config_key" clearable placeholder="请输入键名" />
              </el-col>
              <el-col :span="5">
                <el-input v-model="item.config_val" clearable placeholder="请输入键值" />
              </el-col>
              <el-col :span="6">
                <el-input v-model="item.config_desc" clearable placeholder="请输入说明" />
              </el-col>
              <el-col :span="2">
                <el-button type="text" @click="dele(index)">删除</el-button>
              </el-col>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button :loading="loading" @click="refresh()">刷新</el-button>
          <el-button :loading="loading" type="primary" @click="submit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { info, edit } from '@/api/content/setting'

export default {
  name: 'ContentSetting',
  components: { },
  data() {
    return {
      name: '内容设置',
      height: 680,
      loading: false,
      model: {
        is_content: 1,
        diy_config: []
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
    info() {
      info().then((res) => {
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
      }).catch(() => { })
    },
    // 刷新
    refresh() {
      this.loading = true
      info().then((res) => {
        this.model = res.data
        this.loading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          edit(this.model).then((res) => {
            this.loading = false
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message.error('请完善必填项*')
        }
      })
    }
  }
}
</script>
