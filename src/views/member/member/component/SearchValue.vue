<template>
  <template v-for="(item, index) in [modelValue]" :key="index">
    <ElSelectWhether v-if="item.field === 'is_disable' || item.field === 'is_super'" v-model="item.value" />
    <ElDatePickerDatetime
      v-else-if="item.field === 'create_time' || item.field === 'update_time'"
      v-model="item.value"
      class="w-full!"
    />
    <el-select v-else-if="item.field === 'gender'" v-model="item.value" class="w-full">
      <el-option v-for="v in basedata.genders" :key="v.value" :value="v.value" :label="v.label" />
    </el-select>
    <el-cascader
      v-else-if="item.field === 'region_id'"
      v-model="item.value"
      :options="basedata.regions"
      :props="{ value: 'region_id', label: 'region_name', checkStrictly: true, emitPath: false }"
      clearable
      class="w-full"
    />
    <el-select v-else-if="item.field === 'tag_ids'" v-model="item.value" clearable multiple filterable class="w-full">
      <el-option v-for="v in basedata.tags" :key="v.tag_id" :label="v.tag_name" :value="v.tag_id" />
    </el-select>
    <el-select v-else-if="item.field === 'group_ids'" v-model="item.value" clearable multiple filterable class="w-full">
      <el-option v-for="v in basedata.groups" :key="v.group_id" :label="v.group_name" :value="v.group_id" />
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
