<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="15vh" center :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 列表 -->
      <el-table ref="table" v-loading="loading" :data="data" :height="height" :show-header="false">
        <el-table-column prop="title" min-width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :style="{'color':scope.row.color}">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" width="155" />
        <el-table-column width="50" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="text" @click="info(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" align="center" :background="false" :small="true" layout="prev, pager, next" @pagination="list" />
      <div slot="footer" class="dialog-footer">
        <el-button type="text" size="mini" @click="nohint(count)">不再提示</el-button>
        <el-button type="text" size="mini" @click="submit">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="infoTitle" :visible.sync="infoDialog" top="15vh" center :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :model="model" label-width="0" class="dialog-body" :style="{height:height+100+'px'}">
        <el-form-item label="" prop="" style="text-align:center">
          <h2>{{ model.title }}</h2>
          <span>{{ model.create_time }}</span>
        </el-form-item>
        <el-form-item label="" prop="intro" style="text-align:center">
          <div v-html="model.intro" />
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
import { setMessage, getMessage } from '@/utils/auth'
import { message } from '@/api/index'
import { info } from '@/api/admin/message'

export default {
  name: 'IndexMessage',
  components: { Pagination },
  data() {
    return {
      height: 680,
      loading: false,
      query: {
        page: 1,
        limit: 10
      },
      data: [],
      count: 0,
      model: {
        admin_message_id: '',
        title: '',
        intro: '',
        content: '',
        create_time: ''
      },
      dialog: false,
      dialogTitle: '消息',
      infoTitle: '详情',
      infoDialog: false
    }
  },
  created() {
    this.height = screenHeight(500)
    this.list()
  },
  methods: {
    list() {
      const msg = getMessage()
      if (!msg) {
        this.loading = true
        message(this.query).then(res => {
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
      info({
        admin_message_id: row.admin_message_id
      }).then(res => {
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
      setMessage(count)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
