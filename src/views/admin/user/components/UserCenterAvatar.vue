<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12">
          <el-form ref="ref" label-width="100px">
            <el-form-item label="头像">
              <el-avatar v-if="avatar" shape="circle" fit="contain" :size="100" :src="avatar" />
            </el-form-item>
            <el-form-item label="">
              <div>jpg、png图片，小于100kb，宽高1:1</div>
            </el-form-item>
            <el-form-item>
              <el-upload
                name="avatar_file"
                :show-file-list="false"
                :before-upload="uploadBefore"
                :action="uploadAction"
                :headers="uploadHeaders"
                :data="uploadData"
                :on-success="uploadSuccess"
                :on-error="uploadError"
              >
                <el-button type="primary">更换</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getAdminUserId, getAdminToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'UserCenterAvatar',
  components: {},
  data() {
    return {
      loading: false,
      uploadAction: process.env.VUE_APP_BASE_API + '/admin/AdminUserCenter/avatar',
      uploadHeaders: { AdminUserId: getAdminUserId(), AdminToken: getAdminToken() },
      uploadData: { admin_user_id: getAdminUserId() }
    }
  },
  computed: {
    ...mapGetters(['avatar'])
  },
  methods: {
    uploadBefore(file) {
      this.loading = true
    },
    uploadSuccess(res, file) {
      if (res.code === 200) {
        store.commit('user/SET_AVATAR', res.data.avatar)
        this.loading = false
        this.$message.success(res.msg)
      } else {
        this.loading = false
        this.$message.error(res.msg)
      }
    },
    uploadError(file) {
      this.loading = false
      this.$message.error('上传出错')
    }
  }
}
</script>
