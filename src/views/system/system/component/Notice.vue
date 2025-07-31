<template>
  <!-- 公告列表 -->
  <el-dialog
    v-model="dialog"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancel"
    draggable
    center
    align-center
  >
    <el-table ref="table" v-loading="loading" :data="data" :height="height - 100" :show-header="false">
      <el-table-column prop="image_id" min-width="80">
        <template #default="{ row }">
          <FileImage :file-url="row.image_url" lazy />
        </template>
      </el-table-column>
      <el-table-column prop="title" min-width="250">
        <template #default="{ row }">
          <el-text size="default" :style="{ color: row.title_color }">{{ row.title }}</el-text>
        </template>
      </el-table-column>
      <el-table-column prop="start_time" width="165" />
      <el-table-column width="100">
        <template #default="{ row }">
          <el-button text type="primary" @click="info(row)">{{ $t('查看') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="count > 0"
      v-model:total="count"
      v-model:page="query.page"
      v-model:limit="query.limit"
      :background="false"
      layout="prev, pager, next"
      @pagination="list"
    />
    <template #footer>
      <el-button text @click="nohint(count)">{{ $t('不再提示') }}</el-button>
      <el-button text @click="submit">{{ $t('关闭') }}</el-button>
    </template>
  </el-dialog>
  <!-- 一条公告 -->
  <el-dialog
    v-model="oneDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    center
    align-center
  >
    <template #header>
      <el-text size="default" :style="{ color: oneModel.title_color }">{{ oneModel.title }}</el-text>
    </template>
    <el-scrollbar :height="height - 200">
      <el-form ref="ref" :model="oneModel" label-width="0" class="text-center">
        <el-form-item prop="start_time">
          <el-col class="text-center">{{ oneModel.start_time }}</el-col>
        </el-form-item>
        <el-form-item v-if="oneModel.image_url" prop="image_url">
          <FileImage :file-url="oneModel.image_url" :height="150" />
        </el-form-item>
        <el-form-item prop="desc">
          <el-col class="text-center">
            <el-card shadow="never">
              {{ oneModel.desc }}
            </el-card>
          </el-col>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button @click="oneNohint(count)">{{ $t('不再提示') }}</el-button>
      <el-button @click="oneSubmit">{{ $t('关闭') }}</el-button>
      <el-button type="primary" @click="info(oneModel)">{{ $t('查看') }}</el-button>
    </template>
  </el-dialog>
  <!-- 公告详情 -->
  <el-dialog
    v-model="infoDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    center
    align-center
  >
    <template #header>
      <el-text size="default" :style="{ color: infoModel.title_color }">{{ infoModel.title }}</el-text>
    </template>
    <el-scrollbar :height="height">
      <el-form ref="ref" :model="infoModel" label-width="0" class="text-center">
        <el-form-item prop="start_time">
          <el-col class="text-center">{{ infoModel.start_time }}</el-col>
        </el-form-item>
        <el-form-item v-if="infoModel.image_url" prop="image_url">
          <FileImage :file-url="infoModel.image_url" :height="150" />
        </el-form-item>
        <el-form-item prop="desc">
          <el-col class="text-center">
            <el-card shadow="never">
              {{ infoModel.desc }}
            </el-card>
          </el-col>
        </el-form-item>
        <el-form-item prop="content">
          <el-col class="text-center"><div v-html="infoModel.content"></div></el-col>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </el-dialog>
</template>
<script>
import { screenHeight, getPageLimit, setNotice, getNotice } from '@/utils/index'
import { noticeApi } from '@/api/system/index'
import { infoApi } from '@/api/system/notice'

export default {
  components: {},
  data() {
    return {
      name: '',
      height: 680,
      loading: false,
      idkey: 'notice_id',
      query: { page: 1, limit: getPageLimit() },
      data: [],
      count: 0,
      dialog: false,
      title: '',
      infoDialog: false,
      infoModel: {},
      oneDialog: false,
      oneModel: {}
    }
  },
  created() {
    this.name = this.$t('公告')
    this.height = screenHeight()
    this.title = this.$t('公告')
    this.list()
  },
  methods: {
    list() {
      if (!getNotice()) {
        this.loading = true
        noticeApi(this.query)
          .then((res) => {
            this.data = res.data.list
            this.count = res.data.count
            this.loading = false
            if (this.count > 0) {
              if (this.count === 1) {
                const row = this.data[0]
                this.oneInfo(row)
              } else {
                this.dialog = true
              }
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    info(row) {
      this.infoDialog = true
      let param = {}
      param[this.idkey] = row[this.idkey]
      infoApi(param)
        .then((res) => {
          this.infoModel = res.data
        })
        .catch(() => {})
    },
    cancel() {
      this.dialog = false
    },
    submit() {
      this.dialog = false
    },
    nohint(count) {
      this.dialog = false
      setNotice(count)
    },
    oneInfo(row) {
      this.oneDialog = true
      let param = {}
      param[this.idkey] = row[this.idkey]
      infoApi(param)
        .then((res) => {
          this.oneModel = res.data
        })
        .catch(() => {})
    },
    oneCancel() {
      this.oneDialog = false
    },
    oneSubmit() {
      this.oneDialog = false
    },
    oneNohint(count) {
      this.oneDialog = false
      setNotice(count)
    }
  }
}
</script>
