<template>
  <template v-for="(item, index) in [modelValue]" :key="index">
    <ElSelectWhether v-if="item.field === 'is_disable'" v-model="item.value" />
    <ElDatePickerDatetime
      v-else-if="item.field === 'create_time' || item.field === 'update_time'"
      v-model="item.value"
      class="w-full!"
    />
    <el-cascader
      v-else-if="item.field === 'category_pid'"
      v-model="item.value"
      :options="basedata.trees"
      :props="basedata.props"
      clearable
      filterable
      class="w-full"
    />
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
