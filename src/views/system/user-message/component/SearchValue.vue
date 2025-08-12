<template>
  <template v-for="(item, index) in [modelValue]" :key="index">
    <ElSelectWhether v-if="item.field === 'is_disable' || item.field === 'is_read'" v-model="item.value" />
    <ElDatePickerDatetime
      v-else-if="item.field === 'create_time' || item.field === 'update_time' || item.field === 'read_time'"
      v-model="item.value"
      class="w-full!"
    />
    <el-select-v2
      v-else-if="item.field === 'user_id'"
      v-model="item.value"
      :options="basedata.users"
      :props="{ value: 'user_id', label: 'nickname' }"
      clearable
      filterable
    >
      <template #default="user">
        <span>[{{ user.item.user_id }}] {{ user.item.nickname }}</span>
      </template>
    </el-select-v2>
    <el-select-v2
      v-else-if="item.field === 'message_id'"
      v-model="item.value"
      :options="basedata.messages"
      :props="{ value: 'message_id', label: 'title' }"
      clearable
      filterable
    >
      <template #default="message">
        <span>[{{ message.item.message_id }}] {{ message.item.title }}</span>
      </template>
    </el-select-v2>
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
