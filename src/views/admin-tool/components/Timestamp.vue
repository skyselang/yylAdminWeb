<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>时间戳转换</span>
    </div>
    <div class="text item" style="height:280px">
      <el-form
        ref="timestampRef"
        :inline="true"
        :rules="timestampRules"
        :model="timestampModel"
        label-position="right"
        label-width="80px"
        style="width: 100%; margin-left:50px;"
      >
        <el-form-item label="时间">
          <el-input
            v-model="timestampModel.from_datetime"
            placeholder="2020-02-02 02:02:02"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="datetimeSubmit()">
            转换》
          </el-button>
        </el-form-item>
        <el-form-item label="时间戳">
          <el-input
            v-model="timestampModel.to_timestamp"
            placeholder="1580580122"
            clearable
          />
        </el-form-item>

        <el-form-item label="时间戳">
          <el-input
            v-model="timestampModel.from_timestamp"
            placeholder="1580580122"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="timestampSubmit()">
            转换》
          </el-button>
        </el-form-item>
        <el-form-item label="时间">
          <el-input
            v-model="timestampModel.to_datetime"
            placeholder="2020-02-02 02:02:02"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { timestamp } from '@/api/admin-tool'

export default {
  name: 'Timestamp',
  components: {},
  data() {
    return {
      timestampModel: {
        from_datetime: '',
        to_timestamp: '',
        from_timestamp: '',
        to_datetime: ''
      },
      timestampRules: {}
    }
  },
  created() {},
  methods: {
    datetimeSubmit() {
      timestamp(this.timestampModel).then(res => {
        this.timestampModel.from_datetime = res.data.from_datetime
        this.timestampModel.to_timestamp = res.data.to_timestamp
      })
    },
    timestampSubmit() {
      timestamp(this.timestampModel).then(res => {
        this.timestampModel.from_timestamp = res.data.from_timestamp
        this.timestampModel.to_datetime = res.data.to_datetime
      })
    }
  }
}
</script>
