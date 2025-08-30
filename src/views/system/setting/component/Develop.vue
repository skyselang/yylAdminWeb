<template>
  <div class="app-container">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form :model="model" label-width="150px">
            <el-form-item :label="$t('图标')">
              <el-col :span="8">
                <Icons v-model="iconView" />
              </el-col>
              <el-col :span="16">
                <Clipboard :content="iconView" />
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('多语言缺失')" prop="langMissKeys">
              <el-col>
                <Clipboard :content="langMissKeys" />
              </el-col>
              <el-input v-model="langMissKeys" type="textarea" placeholder="json" autosize />
            </el-form-item>
            <el-form-item :label="$t('清除所有缓存')" prop="clear_all_cache">
              <el-col :span="10">
                <el-switch v-model="model.clear_all_cache" />
              </el-col>
            </el-form-item>
            <el-form-item :label="$t('删除runtime目录')" prop="delete_runtime">
              <el-col :span="10">
                <el-switch v-model="model.delete_runtime" />
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { screenHeight } from '@/utils/index'
import { useLangStoreHook } from '@/store/modules/lang'
import { developApi as editApi } from '@/api/system/setting'

const height = screenHeight()
const langStore = useLangStoreHook()

const iconView = ref('')
const langMissKeys = ref(JSON.stringify(langStore.missKeys))

const model = ref({
  clear_all_cache: false,
  delete_runtime: false
})
const loading = ref(false)

function submit() {
  loading.value = true
  editApi(model.value)
    .then((res) => {
      loading.value = false
      ElMessage.success(res.msg)
    })
    .catch(() => {
      loading.value = false
    })
}
</script>

<style lang="scss" scoped></style>
