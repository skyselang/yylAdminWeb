<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>随机字符串</span>
    </div>
    <div class="text item">
      <el-form ref="strRandRef" :rules="strRandRules" :model="strRandModel" label-position="right" label-width="80px">
        <el-form-item label="所用字符" prop="ids">
          <el-checkbox-group v-model="strRandModel.ids" style="width:100px;">
            <el-checkbox v-for="item in strRandModel.idss" :key="item.id" :label="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="字符长度" prop="len">
          <el-select v-model="strRandModel.len" filterable placeholder="请选择">
            <el-option v-for="item in strRandModel.lens" :key="item" :label="item" :value="item">
              {{ item }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成字符">
          <el-input v-model="strRandModel.str" type="textarea" rows="4" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="strRandCopy(strRandModel.str, $event)">复制</el-button>
          <el-button type="primary" @click="strRandSubmit()">生成</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import clip from '@/utils/clipboard'
import { strRand } from '@/api/admin'

export default {
  name: 'GatherStrRand',
  components: {},
  data() {
    return {
      strRandModel: {
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
      strRandRules: {
        ids: [{ required: true, message: '请选择所用字符', trigger: 'blur' }],
        len: [{ required: true, message: '请选择字符长度', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.strRandLens()
  },
  methods: {
    strRandLens(l = 128) {
      const lens = []
      this.strRandModel.lens = []
      for (let i = 0; i < l; i++) {
        lens[i] = i + 1
      }
      this.strRandModel.lens = lens
    },
    strRandCopy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message({
          message: '请生成随机字符串',
          type: 'error'
        })
      }
    },
    strRandSubmit() {
      this.$refs['strRandRef'].validate(valid => {
        if (valid) {
          strRand({
            ids: this.strRandModel.ids,
            len: this.strRandModel.len
          }).then(res => {
            this.strRandModel.str = res.data.str
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.item {
  height: 410px;
}
</style>
