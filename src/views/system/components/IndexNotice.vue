<template>
  <div>
    <!-- 公告列表 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      top="10vh"
      center
    >
      <el-table ref="table" v-loading="loading" :data="data" :height="height - 200" :show-header="false">
        <el-table-column prop="image_id" min-width="90">
          <template #default="scope">
            <FileImage :file-url="scope.row.image_url" lazy />
          </template>
        </el-table-column>
        <el-table-column prop="title" min-width="250" show-overflow-tooltip>
          <template #default="scope">
            <span :style="{ color: scope.row.title_color }">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" width="165" />
        <el-table-column width="100">
          <template #default="scope">
            <el-button text type="primary" @click="info(scope.row)">
              {{ $t('common.view') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="count > 0"
        v-model:total="count"
        v-model:page="query.page"
        v-model:limit="query.limit"
        :background="false"
        layout="prev, pager, next"
        @pagination="list"
      />
      <template #footer>
        <el-button text @click="nohint(count)">{{ $t('common.Don not prompt again') }}</el-button>
        <el-button text @click="submit">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>
    <!-- 一条公告 -->
    <el-dialog
      v-model="oneDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="18vh"
      width="33%"
      center
    >
      <template #header>
        <span :style="{ color: oneModel.title_color }">{{ oneModel.title }}</span>
      </template>
      <el-scrollbar native :height="430">
        <el-form ref="ref" :model="oneModel" label-width="0" class="text-center">
          <el-form-item prop="start_time">
            <el-col class="text-center">{{ oneModel.start_time }}</el-col>
          </el-form-item>
          <el-form-item v-if="oneModel.image_url" prop="image_url">
            <FileImage :file-url="oneModel.image_url" :height="150" />
          </el-form-item>
          <el-form-item prop="desc">
            <el-col class="text-center">{{ oneModel.desc }}</el-col>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button @click="oneNohint(count)">{{ $t('common.Don not prompt again') }}</el-button>
        <el-button @click="oneSubmit">{{ $t('common.close') }}</el-button>
        <el-button type="primary" @click="info(oneModel)">{{ $t('common.view') }}</el-button>
      </template>
    </el-dialog>
    <!-- 公告详情 -->
    <el-dialog v-model="infoDialog" :close-on-click-modal="false" :close-on-press-escape="false" top="9vh" center>
      <template #header>
        <span :style="{ color: infoModel.title_color }">{{ infoModel.title }}</span>
      </template>
      <el-scrollbar native :height="height">
        <el-form ref="ref" :model="infoModel" label-width="0" class="text-center">
          <el-form-item prop="start_time">
            <el-col class="text-center">{{ infoModel.start_time }}</el-col>
          </el-form-item>
          <el-form-item v-if="infoModel.image_url" prop="image_url">
            <FileImage :file-url="infoModel.image_url" :height="150" />
          </el-form-item>
          <el-form-item prop="desc">
            <el-col class="text-center">{{ infoModel.desc }}</el-col>
          </el-form-item>
          <el-form-item prop="content">
            <el-col class="text-center"><div v-html="infoModel.content"></div></el-col>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import { setNotice, getNotice, getPageLimit } from '@/utils/settings'
import { notice } from '@/api/system/index'
import { info } from '@/api/system/notice'

export default {
  name: 'SystemIndexNotice',
  components: { Pagination },
  data() {
    return {
      name: '公告',
      height: 680,
      loading: false,
      idkey: 'notice_id',
      query: { page: 1, limit: getPageLimit() },
      data: [],
      exps: [{ exp: 'like', name: '包含' }],
      count: 0,
      dialog: false,
      dialogTitle: this.$t('common.Notice'),
      infoDialog: false,
      infoModel: {},
      oneDialog: false,
      oneModel: {}
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
  },
  methods: {
    list() {
      if (!getNotice()) {
        this.loading = true
        notice(this.query)
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
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then((res) => {
        this.infoModel = res.data
      })
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
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then((res) => {
        this.oneModel = res.data
      })
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
