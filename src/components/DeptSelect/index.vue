<template>
  <el-dropdown trigger="click" @command="handleDeptChange">
    <div>
      <!-- 部门切换 -->
      <span title="部门切换">部门：{{ dept_name }}</span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-if="!deptList.length" disabled>暂无部门，请联系管理员</el-dropdown-item>
        <el-dropdown-item v-for="item in deptList" :key="item.dept_id" :command="item">
          {{ item.dept_name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
// 表格导入
export default {
  data() {
    return {
      deptList: [],
      dept_name: '请选择部门'
    }
  },
  created() {
    const userStore = useUserStore()
    const { user, dept } = storeToRefs(userStore)
    // 判断是否有部门信息，如果有则显示部门名称
    if (user.value.hasOwnProperty('dept_lists')) {
      this.deptList = user.value.dept_lists
    }
    this.dept_name = dept.value.dept_name
  },
  methods: {
    handleDeptChange(item) {
      //切换部门
      const userStore = useUserStore()
      userStore.changeDept(item)
      ElMessage.success('部门切换成功！')
      this.dept_name = item.dept_name
    }
  }
}
</script>
<style scoped>
.el-dropdown {
  vertical-align: middle;
}
</style>
