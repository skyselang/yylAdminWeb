<template>
  <template v-for="(item, index) in [modelValue]" :key="index">
    <ElSelectWhether v-if="item.field === 'is_disable'" v-model="item.value" />
    <ElDatePickerDatetime
      v-else-if="item.field === 'create_time' || item.field === 'update_time'"
      v-model="item.value"
      class="w-full!"
    />
    <el-select v-else-if="item.field === 'user_id'" v-model="item.value" multiple collapse-tags filterable clearable>
      <el-option v-for="v in basedata.users" :key="v.user_id" :value="v.user_id" :label="v.nickname">
        {{ v.nickname }} ({{ v.username }})
      </el-option>
    </el-select>
    <el-cascader
      v-else-if="item.field === 'menu_id'"
      v-model="item.value"
      :options="basedata.menus"
      :props="{ value: 'menu_id', label: 'menu_name', checkStrictly: true, multiple: true, emitPath: false }"
      multiple
      collapse-tags
      filterable
      clearable
    />
    <el-select v-else-if="item.field === 'log_type'" v-model="item.value" clearable filterable>
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
