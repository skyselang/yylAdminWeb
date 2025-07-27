<template>
  <div class="app-container">
    <el-result icon="warning" title="401" :sub-title="$t('没有权限')">
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
  name: 'System401'
})
</script>
