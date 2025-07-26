<template>
  <template v-for="(item, index) in [modelValue]" :key="index">
    <ElSelectWhether v-if="item.field === 'is_disable'" v-model="item.value" />
    <ElDatePickerDatetime
      v-else-if="item.field === 'create_time' || item.field === 'update_time'"
      v-model="item.value"
      class="w-full!"
    />
    <el-select v-else-if="item.field === 'platform'" v-model="item.value" clearable>
      <el-option v-for="v in basedata.platforms" :key="v.value" :value="v.value" :label="v.label" />
    </el-select>
    <el-select v-else-if="item.field === 'application'" v-model="item.value" clearable>
      <el-option v-for="v in basedata.applications" :key="v.value" :value="v.value" :label="v.label" />
    </el-select>
    <el-input v-else v-model="item.value" :placeholder="$t('查询内容')" clearable />
  </template>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    basedata: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue']
}
</script>
