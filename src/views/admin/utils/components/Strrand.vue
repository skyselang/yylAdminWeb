<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>随机字符串</span>
    </div>
    <div class="text item">
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px">
        <el-form-item label="所用字符" prop="ids">
          <el-checkbox-group v-model="model.ids" style="width:100px;">
            <el-checkbox v-for="item in model.idss" :key="item.id" :label="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="字符长度" prop="len">
          <el-select v-model="model.len" filterable placeholder="请选择">
            <el-option v-for="item in model.lens" :key="item" :label="item" :value="item">
              {{ item }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成字符" prop="str">
          <el-input v-model="model.str" type="textarea" rows="4" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="copy(model.str, $event)">复制</el-button>
          <el-button type="primary" @click="submit()">生成</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import clip from '@/utils/clipboard'
import { strrand } from '@/api/admin-utils'

export default {
  name: 'Strrand',
  components: {},
  data() {
    return {
      model: {
        idss: [
          { id: 1, name: '数字' },
          { id: 2, name: '小写字母' },
          { id: 3, name: '大写字母' },
          { id: 4, name: '标点符号' }
        ],
        lens: [8, 10, 12],
        ids: [1, 2, 3],
        len: 12,
        str: ''
      },
      rules: {
        ids: [{ required: true, message: '请选择所用字符', trigger: 'blur' }],
        len: [{ required: true, message: '请选择字符长度', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.lens()
  },
  methods: {
    lens(l = 128) {
      const lens = []
      this.model.lens = []
      for (let i = 0; i < l; i++) {
        lens[i] = i + 1
      }
      this.model.lens = lens
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          strrand({
            ids: this.model.ids,
            len: this.model.len
          }).then(res => {
            this.model.str = res.data.str
          })
        }
      })
    },
    copy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message.error('请生成随机字符串')
      }
    }
  }
}
</script>

<style scoped>
</style>
