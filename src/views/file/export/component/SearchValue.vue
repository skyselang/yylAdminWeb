<template>
  <template v-for="(item, index) in [modelValue]" :key="index">
    <ElSelectWhether v-if="item.field === 'is_disable'" v-model="item.value" />
    <el-select v-else-if="item.field === 'type'" v-model="item.value" clearable>
      <el-option v-for="v in basedata.types" :key="v.value" :value="v.value" :label="v.label" />
    </el-select>
    <el-select v-else-if="item.field === 'status'" v-model="item.value" clearable>
      <el-option v-for="v in basedata.statuss" :key="v.value" :value="v.value" :label="v.label" />
    </el-select>
    <ElDatePickerDatetime
      v-else-if="item.field === 'create_time' || item.field === 'update_time'"
      v-model="item.value"
      class="w-full!"
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
