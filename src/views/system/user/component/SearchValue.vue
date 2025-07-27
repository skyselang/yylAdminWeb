<template>
  <template v-for="(item, index) in [modelValue]" :key="index">
    <ElSelectWhether v-if="item.field === 'is_disable' || item.field === 'is_super'" v-model="item.value" />
    <ElDatePickerDatetime
      v-else-if="item.field === 'create_time' || item.field === 'update_time'"
      v-model="item.value"
      class="w-full!"
    />
    <el-cascader
      v-else-if="item.field === 'dept_ids'"
      v-model="item.value"
      :options="basedata.depts"
      :props="basedata.deptProps"
      clearable
      class="w-full"
    />
    <el-cascader
      v-else-if="item.field === 'post_ids'"
      v-model="item.value"
      :options="basedata.posts"
      :props="basedata.postProps"
      clearable
      class="w-full"
    />
    <el-select v-else-if="item.field === 'role_ids'" v-model="item.value" clearable multiple class="w-full">
      <el-option v-for="v in basedata.roles" :key="v.role_id" :value="v.role_id" :label="v.role_name" />
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
