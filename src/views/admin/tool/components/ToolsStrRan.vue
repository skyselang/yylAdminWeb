<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>随机字符串</span>
    </div>
    <div class="text item">
      <el-form ref="formRef" :rules="formRules" :model="formModel" label-position="right" label-width="80px">
        <el-form-item label="所用字符" prop="ids">
          <el-checkbox-group v-model="formModel.ids" style="width:100px;">
            <el-checkbox v-for="item in formModel.arr" :key="item.id" :label="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="字符长度">
          <el-select v-model="formModel.len" filterable placeholder="请选择">
            <el-option v-for="item in formModel.lens" :key="item" :label="item" :value="item">
              {{ item }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成字符">
          <el-input v-model="formModel.str" type="textarea" rows="4" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCopy(formModel.str, $event)">
            复制
          </el-button>
          <el-button type="primary" @click="randomSubmit(formModel.len)">
            生成
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import clip from '@/utils/clipboard'
import { strran } from '@/api/admin'

export default {
  name: 'ToolsStrRan',
  components: {},
  data() {
    return {
      formModel: {
        arr: [
          { id: 1, name: '数字' },
          { id: 2, name: '小写字母' },
          { id: 3, name: '大写字母' },
          { id: 4, name: '标点符号' }
        ],
        lens: [],
        ids: [1, 2, 3],
        len: 12,
        str: ''
      },
      formRules: {
        ids: [{ required: true, message: '请选择所用字符', trigger: 'blur' }]
      }
    }
  },
  created() {
    for (let i = 1; i <= 128; i++) {
      this.formModel.lens.push(i)
    }
  },
  methods: {
    handleCopy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message({
          message: '请生成随机字符串',
          type: 'error'
        })
      }
    },
    randomSubmit() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          const random = {
            ids: this.formModel.ids,
            len: this.formModel.len
          }
          strran(random).then(res => {
            this.formModel.str = res.data.str
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.item {
  height: 400px;
}
</style>
