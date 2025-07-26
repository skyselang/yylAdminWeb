<template>
  <el-scrollbar>
    <div :class="{ hidden: hidden }" class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :background="background"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-scrollbar>
</template>

<script setup>
import { useSettingsStore } from '@/store/modules/settings'
defineOptions({
  name: 'Pagination'
})
defineProps({
  total: {
    required: true,
    type: Number,
    default: 0
  },
  pageSizes: {
    type: Array,
    default() {
      const settingsStore = useSettingsStore()
      return settingsStore.pageLimits
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['pagination'])

const currentPage = defineModel('page', {
  type: Number,
  required: true,
  default: 1
})
const pageSize = defineModel('limit', {
  type: Number,
  required: true,
  default: 20
})

function handleSizeChange(val) {
  emit('pagination', { page: currentPage.value, limit: val })
}

function handleCurrentChange(val) {
  emit('pagination', { page: val, limit: pageSize.value })
}
</script>

<style lang="scss" scoped>
.pagination {
  padding-top: 0;

  &.hidden {
    display: none;
  }
}
</style>
