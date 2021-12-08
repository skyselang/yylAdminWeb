<template>
  <div class="app-container">
    <el-form ref="ref" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
      <el-form-item label="标题" prop="title">
        <div v-html="model.title" />
      </el-form-item>
      <el-form-item label="简介" prop="intro">
        <div v-html="model.intro" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <div v-html="model.content" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { info } from '@/api/admin/message'

export default {
  name: 'AdminSystemMessageInfo',
  components: { },
  data() {
    return {
      name: '消息信息',
      height: 680,
      loading: false,
      model: {
        admin_message_id: '',
        admin_user_id: 0,
        admin_user: '',
        title: '',
        type: 1,
        sort: 250,
        is_open: 1,
        intro: '',
        content: ''
      }
    }
  },
  created() {
    this.model.admin_message_id = this.$route.query.id
    this.height = screenHeight(150)
    this.info()
  },
  methods: {
    info() {
      info({
        admin_message_id: this.model.admin_message_id
      }).then(res => {
        this.model = res.data
      })
    }
  }
}
</script>
