<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>生成随机字符</span>
    </div>
    <div class="text item" style="height:280px">
      <el-form
        ref="randomRef"
        :rules="randomRules"
        :model="randomModel"
        label-position="right"
        label-width="80px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="所用字符" prop="random_ids">
          <el-checkbox-group v-model="randomModel.random_ids">
            <el-checkbox
              v-for="item in randomModel.randomArr"
              :key="item.random_id"
              :label="item.random_id"
            >
              {{ item.random_label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="字符长度">
          <el-select v-model="randomModel.random_len" placeholder="请选择">
            <el-option
              v-for="item in randomModel.random_lens"
              :key="item"
              :label="item"
              :value="item"
            >
              {{ item }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成字符">
          <el-input v-model="randomModel.random_str" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleCopy(randomModel.random_str, $event)"
          >
            复制
          </el-button>
          <el-button
            type="primary"
            @click="randomSubmit(randomModel.random_len)"
          >
            生成
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import clip from '@/utils/clipboard'
import { randomStr } from '@/api/admin-tool'

export default {
  name: 'RandomStr',
  components: {},
  data() {
    return {
      randomModel: {
        randomArr: [
          { random_id: 1, random_label: '数字' },
          { random_id: 2, random_label: '小写字母' },
          { random_id: 3, random_label: '大写字母' },
          { random_id: 4, random_label: '标点符号' }
        ],
        random_lens: [],
        random_ids: [1, 2, 3],
        random_len: 12,
        random_str: ''
      },
      randomRules: {
        random_ids: [
          { required: true, message: '请选择所用字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    for (let i = 1; i <= 32; i++) {
      this.randomModel.random_lens.push(i)
    }
  },
  methods: {
    handleCopy(text, event) {
      clip(text, event)
    },
    randomSubmit() {
      this.$refs['randomRef'].validate(valid => {
        if (valid) {
          const random = {
            random_ids: this.randomModel.random_ids,
            random_len: this.randomModel.random_len
          }
          randomStr(random).then(res => {
            this.randomModel.random_str = res.data.random_str
          })
        }
      })
    }
  }
}
</script>
