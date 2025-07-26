<template>
  <div class="app-container">
    <el-result icon="error" title="404" :sub-title="$t('页面不存在')">
      <template #extra>
        <router-link to="/dashboard">
          <el-button type="primary">{{ $t('首页') }}</el-button>
        </router-link>
      </template>
    </el-result>
  </div>
</template>

<script setup>
defineOptions({
  name: 'System404'
})
</script>
