<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="150px">
    <el-scrollbar :height="height">
      <el-row>
        <el-col :md="24" :lg="16" :xl="14">
          <el-form-item :label="$t('图片大小')" prop="image_size">
            <el-col :span="10">
              <el-input v-model="model.image_size" type="number" clearable>
                <template #append>MB</template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('允许上传的图片大小') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('图片格式')" prop="image_ext">
            <el-checkbox-group v-model="model.image_ext">
              <el-checkbox v-for="v in model.image_exts" :key="v" :value="v" :label="v" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('视频大小')" prop="video_size">
            <el-col :span="10">
              <el-input v-model="model.video_size" type="number" clearable>
                <template #append>MB</template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('允许上传的视频大小') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('视频格式')" prop="video_ext">
            <el-checkbox-group v-model="model.video_ext">
              <el-checkbox v-for="v in model.video_exts" :key="v" :value="v" :label="v" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('音频大小')" prop="audio_size">
            <el-col :span="10">
              <el-input v-model="model.audio_size" type="number" clearable>
                <template #append>MB</template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('允许上传的音频大小') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('音频格式')" prop="audio_ext">
            <el-checkbox-group v-model="model.audio_ext">
              <el-checkbox v-for="v in model.audio_exts" :key="v" :value="v" :label="v" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('文档大小')" prop="word_size">
            <el-col :span="10">
              <el-input v-model="model.word_size" type="number" clearable>
                <template #append>MB</template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('允许上传的文档大小') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('文档格式')" prop="word_ext">
            <el-checkbox-group v-model="model.word_ext">
              <el-checkbox v-for="v in model.word_exts" :key="v" :value="v" :label="v" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('其它大小')" prop="other_size">
            <el-col :span="10">
              <el-input v-model="model.other_size" type="number" clearable>
                <template #append>MB</template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('允许上传的其它文件大小') }}</el-text>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('其它格式')" prop="other_ext">
            <el-input v-model="model.other_ext" clearable />
            <el-text size="default">{{ $t('允许上传的其它文件格式，逗号,隔开；') }}{{ model.other_exts }}</el-text>
          </el-form-item>
          <el-form-item :label="$t('上传个数')" prop="limit_max">
            <el-col :span="10">
              <el-input v-model="model.limit_max" type="number" clearable>
                <template #append>{{ $t('个') }}</template>
              </el-input>
            </el-col>
            <el-col :span="14">
              <el-text size="default">{{ $t('允许上传文件的最大数量') }}</el-text>
            </el-col>
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
import { limitInfoApi as infoApi, limitEditApi as editApi } from '@/api/file/setting'

export default {
  data() {
    return {
      name: '限制设置',
      height: 680,
      loading: false,
      model: {
        image_size: 0,
        image_ext: [],
        image_exts: [],
        video_size: 0,
        video_ext: [],
        video_exts: [],
        audio_size: 0,
        audio_ext: [],
        audio_exts: [],
        word_size: 0,
        word_ext: [],
        word_exts: [],
        other_size: 0,
        other_ext: [],
        other_exts: [],
        limit_max: 9
      },
      rules: {}
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
