<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <el-tabs v-model="tabActName">
          <el-tab-pane label="修改信息" name="edit">
            <UsersEdit />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="pwd">
            <UsersPwd />
          </el-tab-pane>
          <el-tab-pane label="更换头像" name="avatar">
            <UsersAvatar />
          </el-tab-pane>
          <el-tab-pane label="日志记录" name="log">
            <UsersLog />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import UsersAvatar from './components/UsersAvatar'
import UsersEdit from './components/UsersEdit'
import UsersPwd from './components/UsersPwd'
import UsersLog from './components/UsersLog'

export default {
  name: 'Users',
  components: { UsersAvatar, UsersEdit, UsersPwd, UsersLog },
  data() {
    return {
      tabActName: 'edit'
    }
  },
  created() {},
  methods: {}
}
</script>
