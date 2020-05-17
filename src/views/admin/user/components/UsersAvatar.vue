<template>
  <el-card class="box-card">
    <el-form
      ref="formRef"
      label-position="right"
      label-width="120px"
      style="width: 60%; margin-left:50px;"
    >
      <el-form-item label="头像">
        <el-avatar
          v-if="avatar"
          shape="circle"
          fit="contain"
          :size="100"
          :src="avatar"
        />
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          name="avatar_file"
          :show-file-list="false"
          :action="uploadAction"
          :headers="uploadHeaders"
          :data="uploadData"
          :on-success="uploadSuccess"
        >
          <div slot="tip">
            只能上传jpg、png图片，且大小不超过100kb
          </div>
          <el-button type="primary">更换头像</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import { getAdminUserId, getToken } from '@/utils/auth'
export default {
  name: 'UsersAvatar',
  components: {},
  data() {
    return {
      uploadAction:
        process.env.VUE_APP_BASE_API + '/admin/AdminUsers/usersAvatar',
      uploadHeaders: {
        AdminToken: getToken(),
        AdminUserId: getAdminUserId()
      },
      uploadData: { admin_user_id: getAdminUserId() }
    }
  },
  computed: {
    ...mapGetters(['avatar'])
  },
  created() {},
  methods: {
    message(msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.message(res.msg)
        store.commit('user/SET_AVATAR', res.data.avatar)
      } else {
        this.message(res.msg, 'error')
      }
    }
  }
}
</script>
