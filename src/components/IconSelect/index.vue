<template>
  <div ref="iconRef" class="iconselect-container">
    <el-input
      v-model="inputValue"
      readonly
      clearable
      placeholder="点击选择图标"
      @click="iconShow = !iconShow"
    >
      <template #prepend>
        <svg-icon :icon-class="inputValue" size="1.2em" />
      </template>
    </el-input>

    <el-popover :visible="iconShow" placement="bottom-end" trigger="click" width="488">
      <template #reference>
        <div
          class="cursor-pointer text-[#999] absolute right-[10px] top-0 height-[32px] leading-[32px]"
          @click="iconShow = !iconShow"
        >
          <svg-icon v-show="iconShow" icon-class="caret-top" />
          <svg-icon v-show="!iconShow" icon-class="caret-bottom" />
        </div>
      </template>

      <div ref="iconDialogRef">
        <el-input
          v-model="iconFilter"
          class="px-2 w-[98%]"
          clearable
          placeholder="搜索图标"
          @input="handleFilter"
        />
        <el-scrollbar height="300px">
          <ul class="icon-list">
            <li
              v-for="(iconName, index) in iconFilters"
              :key="index"
              :title="iconName"
              class="icon-item"
              @click="handleSelect(iconName)"
            >
              <svg-icon :icon-class="iconName" size="1.4em" color="var(--el-text-color-regular)" />
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    require: false,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = toRef(props, 'modelValue')
const iconShow = ref(false) // 弹窗显示状态
const iconNames = [] // 图标名称集合
const iconFilter = ref('') // 筛选的值
const iconFilters = ref([]) // 过滤后图标名称集合
const iconRef = ref()
const iconDialogRef = ref()
/**
 * icon 加载
 */
function loadIcons() {
  const icons = import.meta.glob('../../assets/icons/*.svg')
  for (const icon in icons) {
    const iconName = icon.split('assets/icons/')[1].split('.svg')[0]
    iconNames.push(iconName)
  }
  iconFilters.value = iconNames
}
/**
 * icon 筛选
 */
function handleFilter() {
  if (iconFilter.value) {
    iconFilters.value = iconNames.filter((iconName) => iconName.includes(iconFilter.value))
  } else {
    iconFilters.value = iconNames
  }
}
/**
 * icon 选择
 */
function handleSelect(iconName) {
  emit('update:modelValue', iconName)
  iconShow.value = false
  iconFilter.value = ''
  iconFilters.value = iconNames
}
/**
 * icon 关闭
 */
onClickOutside(iconRef, () => (iconShow.value = false), {
  ignore: [iconDialogRef]
})

onMounted(() => {
  loadIcons()
})
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 10px auto !important;
}

.iconselect-container {
  position: relative;
  width: 500px;
}

.icon-list {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  margin-top: 10px;

  .icon-item {
    display: flex;
    flex-direction: column;
    place-items: center center;
    width: 8%;
    padding: 5px;
    margin: 0 8px 8px 0;
    border: 1px solid #ccc;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
      transition: all 0.2s;
      transform: scaleX(1.1);
    }
  }
}
</style>
