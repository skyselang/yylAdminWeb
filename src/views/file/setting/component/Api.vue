<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('前台文件')" prop="is_api_file">
            <ElSwitchOnoff v-model="model.is_api_file" />
            <el-text size="default">{{ $t('是否开启前台文件功能') }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('文件类型')" prop="api_file_types">
            <el-checkbox-group v-model="model.api_file_types">
              <el-checkbox v-for="(item, index) in file_types" :key="index" :value="index" :label="item" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('文件分组')" prop="api_file_group_ids">
            <el-select v-model="model.api_file_group_ids" clearable filterable multiple>
              <el-option v-for="v in groups" :key="v.group_id" :value="v.group_id" :label="v.group_name" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('文件标签')" prop="api_file_tag_ids">
            <el-select v-model="model.api_file_tag_ids" clearable filterable multiple>
              <el-option v-for="v in tags" :key="v.tag_id" :value="v.tag_id" :label="v.tag_name" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-scrollbar>
    <el-form-item>
      <el-button :loading="loading" @click="refresh">{{ $t('刷新') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight } from '@/utils/index'
import { apiInfoApi as infoApi, apiEditApi as editApi } from '@/api/file/setting'

export default {
  data() {
    return {
      name: '前台设置',
      height: 680,
      loading: false,
      model: {
        is_api_file: 0,
        api_file_types: [],
        api_file_group_ids: [],
        api_file_tag_ids: []
      },
      rules: {},
      storages: [],
      file_types: [],
      groups: [],
      tags: []
    }
  },
  created() {
    this.height = screenHeight(270)
    this.info()
  },
  methods: {
    // 信息
    info(ismsg = false) {
      if (ismsg) {
        this.loading = true
      }
      infoApi()
        .then((res) => {
          this.storages = res.data.basedata.storages
          this.file_types = res.data.basedata.file_types
          this.groups = res.data.basedata.groups
          this.tags = res.data.basedata.tags
          delete res.data.basedata
          this.model = res.data
          this.loading = false
          if (ismsg) {
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 刷新
    refresh() {
      this.info(true)
    },
    // 提交
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          editApi(this.model)
            .then((res) => {
              this.loading = false
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
