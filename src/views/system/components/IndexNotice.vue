<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="10vh" center :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 列表 -->
      <el-table ref="table" v-loading="loading" :data="data" :height="height-200" :show-header="false">
        <el-table-column prop="title" min-width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :style="{'color':scope.row.color}">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" width="155" />
        <el-table-column width="50" align="right" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="count>0" :total="count" :page.sync="query.page" :limit.sync="query.limit" align="center" :background="false" :small="true" layout="prev, pager, next" @pagination="list" />
      <div slot="footer" class="dialog-footer">
        <el-button type="text" size="mini" @click="nohint(count)">不再提示</el-button>
        <el-button type="text" size="mini" @click="submit">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="infoTitle" :visible.sync="infoDialog" top="9vh" center :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 详情 -->
      <el-form ref="ref" :model="model" label-width="0" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="" prop="" style="text-align:center; margin-bottom:0">
          <span>{{ model.create_time }}</span>
        </el-form-item>
        <el-form-item label="" prop="content">
          <div v-html="model.content" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { setNotice, getNotice } from '@/utils/settings'
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
      query: { page: 1, limit: 10 },
      data: [],
      exps: [],
      count: 0,
      dialog: false,
      dialogTitle: '公告',
      model: {
        notice_id: '',
        username: '',
        title: '',
        intro: '',
        content: '',
        create_time: ''
      },
      infoTitle: '公告',
      infoDialog: false
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
        notice(this.query).then(res => {
          this.data = res.data.list
          this.count = res.data.count
          this.loading = false
          if (this.count > 0) {
            if (this.count === 1) {
              const row = this.data[0]
              this.$confirm(row.intro, row.title, {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '查看',
                cancelButtonText: '不再提示',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                showClose: false,
                center: true
              }).then(() => {
                this.info(row)
              }).catch(() => {
                this.nohint(this.count)
              })
            } else {
              this.dialog = true
            }
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    info(row) {
      this.infoDialog = true
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.model = res.data
        this.infoTitle = res.data.title
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
