<template>
  <div class="app-container">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form label-width="120px">
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
          </el-form>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { screenHeight } from '@/utils/index'
import { useLangStoreHook } from '@/store/modules/lang'

const height = screenHeight()
const langStore = useLangStoreHook()

const iconView = ref('')
const langMissKeys = ref(JSON.stringify(langStore.missKeys))
</script>

<style lang="scss" scoped></style>
