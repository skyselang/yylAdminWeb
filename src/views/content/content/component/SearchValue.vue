<template>
  <template v-for="(item, index) in [modelValue]" :key="index">
    <ElSelectWhether
      v-if="
        item.field === 'is_disable' || item.field === 'is_top' || item.field === 'is_hot' || item.field === 'is_rec'
      "
      v-model="item.value"
    />
    <ElDatePickerDatetime
      v-else-if="item.field === 'create_time' || item.field === 'update_time' || item.field === 'release_time'"
      v-model="item.value"
      class="w-full!"
    />
    <el-cascader
      v-else-if="item.field === 'category_ids'"
      v-model="item.value"
      :options="basedata.categorys"
      :props="basedata.categoryProps"
      clearable
      filterable
      collapse-tags
      class="w-full"
    />
    <el-select v-else-if="item.field === 'tag_ids'" v-model="item.value" clearable filterable multiple collapse-tags>
      <el-option v-for="v in basedata.tags" :key="v.tag_id" :value="v.tag_id" :label="v.tag_name" />
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
