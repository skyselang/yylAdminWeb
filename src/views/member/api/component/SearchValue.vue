<template>
  <template v-for="(item, index) in [modelValue]" :key="index">
    <ElSelectWhether
      v-if="
        item.field === 'is_disable' ||
        item.field === 'is_unlogin' ||
        item.field === 'is_unauth' ||
        item.field === 'is_unrate'
      "
      v-model="item.value"
    />
    <ElDatePickerDatetime
      v-else-if="item.field === 'create_time' || item.field === 'update_time'"
      v-model="item.value"
      class="w-full!"
    />
    <el-cascader
      v-else-if="item.field === 'api_pid'"
      v-model="item.value"
      :options="basedata.trees"
      :props="basedata.props"
      clearable
      filterable
      class="w-full"
    />
    <el-select v-else-if="item.field === 'log_type'" v-model="item.value">
      <el-option v-for="v in basedata.log_types" :key="v.value" :value="v.value" :label="v.label" />
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
