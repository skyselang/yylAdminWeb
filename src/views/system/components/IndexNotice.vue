<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="10vh" center :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 列表 -->
      <el-table ref="table" v-loading="loading" :data="data" :height="height-200" :show-header="false">
        <el-table-column prop="image_id" label="" min-width="60">
          <template slot-scope="scope">
            <div style="height:30px">
              <el-image v-if="scope.row.image_url" style="height:30px" fit="contain" :src="scope.row.image_url" :preview-src-list="[scope.row.image_url]" title="点击看大图">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" min-width="300" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :style="{'color':scope.row.title_color}">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" width="155" />
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
    <el-dialog :visible.sync="infoDialog" top="9vh" center :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 详情 -->
      <span slot="title">
        <span :style="{'color':infoModel.title_color}">{{ infoModel.title }}</span>
      </span>
      <el-form ref="ref" :model="infoModel" label-width="0" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="" prop="" style="text-align:center; margin-bottom:0">
          <span>{{ infoModel.start_time }}</span>
        </el-form-item>
        <el-form-item label="" prop="content">
          <div v-html="infoModel.content" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="oneDialog" width="33%" top="18vh" center :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 一条 -->
      <span slot="title">
        <span :style="{'color':oneModel.title_color}">{{ oneModel.title }}</span>
      </span>
      <el-form ref="ref" :model="oneModel" label-width="0" class="dialog-body" style="height: 430px; text-align:center; margin-bottom:0">
        <el-form-item label="" prop="">
          <span>{{ oneModel.start_time }}</span>
        </el-form-item>
        <el-form-item v-if="oneModel.image_url" label="" prop="">
          <el-image style="height:220px;" fit="contain" :src="oneModel.image_url" :preview-src-list="[oneModel.image_url]" title="点击看大图">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </el-form-item>
        <el-form-item label="" prop="">
          <span>{{ oneModel.intro }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" size="small" @click="oneNohint(count)">不再提示</el-button>
        <el-button type="" size="small" @click="oneSubmit">关闭</el-button>
        <el-button type="primary" size="small" @click="info(oneModel)">查看</el-button>
      </span>
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
        notice(this.query).then(res => {
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
      info(id).then(res => {
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

<style lang="scss" scoped>
</style>
