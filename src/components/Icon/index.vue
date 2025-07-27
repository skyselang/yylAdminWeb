<template>
  <el-icon v-if="icon" :size="size" :color="color">
    <component :is="ElIcons[icon]" />
  </el-icon>
  <el-input v-else v-model="modelValue" :placeholder="$t('请选择图标')" @click="open">
    <template #prepend>
      <el-button>
        <el-icon :size="16"><component :is="selectedIcon" /></el-icon>
      </el-button>
    </template>
    <template #append>
      <el-button>
        <el-icon :title="$t('删除')" @click="dele"><Close /></el-icon>
      </el-button>
    </template>
  </el-input>
  <el-dialog v-model="dialog" :title="$t('选择图标')" center top="8vh" width="60%">
    <el-row class="mb-2">
      <el-col :span="12" :offset="6">
        <el-input v-model="search" :placeholder="$t('搜索图标')" clearable />
      </el-col>
    </el-row>
    <el-scrollbar :height="height">
      <el-row class="text-center cursor-pointer">
        <el-col v-for="item in filterIcons" :key="item.name" :span="3" @click="select(item.name)">
          <el-card shadow="never" :body-style="{ padding: '2px 0px' }">
            <el-col>
              <el-icon :size="20"><component :is="item.component" /></el-icon>
            </el-col>
            <el-col>
              <el-text size="default" truncated>{{ item.name }}</el-text>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup>
import { screenHeight } from '@/utils/index'
import * as ElIcons from '@element-plus/icons-vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  icon: { type: String, default: '' },
  size: { type: [String, Number], default: '' },
  color: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const { modelValue } = toRefs(props)

const height = screenHeight()
const search = ref('')
const dialog = ref(false)

const allIcons = Object.entries(ElIcons).map(([name, component]) => ({ name, component }))

const filterIcons = computed(() => {
  if (!search.value) return allIcons
  const query = search.value.toLowerCase()
  return allIcons.filter((icon) => icon.name.toLowerCase().includes(query))
})

const selectedIcon = computed(() => {
  return modelValue.value ? ElIcons[modelValue.value] : null
})

function open() {
  dialog.value = true
}

function select(name) {
  emit('update:modelValue', name)
  dialog.value = false
}

function dele() {
  emit('update:modelValue', '')
}

watch(modelValue, () => {}, { immediate: true })
</script>
