<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="0">
        <el-col :sm="24" :md="12">
          <el-form ref="usersRef" label-width="100px">
            <el-form-item label="头像">
              <el-avatar v-if="avatar" shape="circle" fit="contain" :size="100" :src="avatar" />
            </el-form-item>
            <el-form-item>
              <el-upload class="upload-demo" name="avatar_file" :show-file-list="false" :action="uploadAction" :headers="uploadHeaders" :data="uploadData" :on-success="uploadSuccess">
                <div slot="tip">jpg、png图片，小于50kb！</div>
                <el-button type="primary">更换头像</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import { getAdminUserId, getToken } from '@/utils/auth'

export default {
  name: 'Avatar',
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
    uploadSuccess(res, file) {
      if (res.code === 200) {
        this.$message({ message: res.msg, type: 'success' })
        store.commit('user/SET_AVATAR', res.data.avatar_url)
      } else {
        this.$message({ message: res.msg, type: 'error' })
      }
    }
  }
}
</script>
