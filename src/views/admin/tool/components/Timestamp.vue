<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>时间戳转换</span>
    </div>
    <div class="text item" style="height:280px">
      <el-form
        ref="formRef"
        :rules="formRules"
        :model="formModel"
        label-position="right"
        label-width="80px"
        style="width: 80%; margin-left:50px;"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item label="时间">
              <el-date-picker
                v-model="formModel.from_datetime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="2020-02-02 02:02:02"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="时间戳">
              <el-input
                v-model="formModel.to_timestamp"
                placeholder="1580580122"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleCopy(formModel.to_timestamp, $event)"
          >
            复制
          </el-button>
          <el-button type="primary" @click="datetimeSubmit()">
            转换
          </el-button>
        </el-form-item>

        <el-row>
          <el-col :span="11">
            <el-form-item label="时间戳">
              <el-input
                v-model="formModel.from_timestamp"
                placeholder="1580580122"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="时间">
              <el-input
                v-model="formModel.to_datetime"
                placeholder="2020-02-02 02:02:02"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleCopy(formModel.to_datetime, $event)"
          >
            复制
          </el-button>
          <el-button type="primary" @click="timestampSubmit()">
            转换
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import clip from '@/utils/clipboard'
import { timestamp } from '@/api/admin'

export default {
  name: 'Timestamp',
  components: {},
  data() {
    return {
      formModel: {
        from_datetime: '',
        to_timestamp: '',
        from_timestamp: '',
        to_datetime: ''
      },
      formRules: {}
    }
  },
  created() {},
  methods: {
    handleCopy(text, event) {
      if (text) {
        clip(text, event)
      } else {
        this.$message({
          message: '请点击转换',
          type: 'error'
        })
      }
    },
    datetimeSubmit() {
      timestamp(this.formModel).then(res => {
        this.formModel.from_datetime = res.data.from_datetime
        this.formModel.to_timestamp = res.data.to_timestamp
      })
    },
    timestampSubmit() {
      timestamp(this.formModel).then(res => {
        this.formModel.from_timestamp = res.data.from_timestamp
        this.formModel.to_datetime = res.data.to_datetime
      })
    }
  }
}
</script>
