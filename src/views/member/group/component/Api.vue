<template>
  <el-checkbox v-model="checkAlled" :indeterminate="checkInd" :title="$t('全选/反选')" @change="checkAll">
    <el-text size="small">{{ $t('全选') }}</el-text>
  </el-checkbox>
  <el-checkbox v-model="expandAlled" :title="$t('展开/收起')" @change="expandAll">
    <el-text size="small">{{ $t('展开') }}</el-text>
  </el-checkbox>
  <el-tree-v2
    :ref="ref"
    :data="data"
    :props="props"
    :height="height"
    :default-checked-keys="modelValue"
    :expand-on-click-node="false"
    show-checkbox
    check-strictly
    class="w-full"
    @check="check"
    @node-click="checkClick"
  >
    <template #default="row">
      <el-row class="w-full">
        <el-col :span="16">
          <el-text size="default">{{ row.data.api_name }}</el-text>
          <el-checkbox v-if="row.data.children" class="ml-2" :title="$t('全选/反选')" @change="checkAllChild">
            <el-text size="small" type="info">{{ $t('全选') }}</el-text>
          </el-checkbox>
        </el-col>
        <el-col :span="2">
          <el-text v-if="row.data.api_url" size="small" type="info" :title="row.data.api_url">{{ $t('链接') }}</el-text>
        </el-col>
        <el-col :span="2">
          <el-text v-if="row.data.is_unlogin" size="small" type="info" :title="$t('无需登录')">
            {{ $t('免登') }}
          </el-text>
        </el-col>
        <el-col :span="2">
          <el-text v-if="row.data.is_unauth" size="small" type="info" :title="$t('无需权限')">{{ $t('免权') }}</el-text>
        </el-col>
        <el-col :span="2">
          <el-text v-if="row.data.is_disable" size="small" type="info" :title="$t('已禁用')">{{ $t('禁用') }}</el-text>
        </el-col>
      </el-row>
    </template>
  </el-tree-v2>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [Array],
      default() {
        return []
      }
    },
    data: {
      type: [Array],
      default() {
        return []
      }
    },
    ids: {
      type: [Array],
      default() {
        return []
      }
    },
    height: {
      type: [Number],
      default() {
        return 450
      }
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      ref: 'ref',
      idkey: 'api_id',
      props: { value: 'api_id', label: 'api_name' },
      checkData: [],
      checkAlled: false,
      expandAlled: false
    }
  },
  computed: {
    checkInd() {
      const ids_length = this.ids.length
      const check_length = this.modelValue.length
      return check_length > 0 && check_length < ids_length
    }
  },
  methods: {
    check() {
      this.checkSetKeys()
    },
    checkClick(data) {
      this.checkData = data
      this.checkSetKeys()
    },
    checkAll() {
      if (this.checkAlled) {
        const data = this.ids
        const length = data.length
        for (let i = 0; i < length; i++) {
          this.$refs[this.ref].setChecked(data[i], true)
        }
      } else {
        this.$refs[this.ref].setCheckedKeys([])
      }
      this.checkSetKeys()
    },
    checkAllChild(value) {
      const data = this.checkData
      const length = data.children.length
      this.$refs[this.ref].setChecked(data[this.idkey], value)
      for (let i = 0; i < length; i++) {
        this.$refs[this.ref].setChecked(data.children[i][this.idkey], value)
      }
      this.checkSetKeys()
    },
    checkSetKeys() {
      this.$emit('update:modelValue', this.$refs[this.ref].getCheckedKeys())
    },
    expandAll() {
      if (this.expandAlled) {
        this.$refs[this.ref].setExpandedKeys(this.ids)
      } else {
        this.$refs[this.ref].setExpandedKeys([])
      }
    }
  }
}
</script>
