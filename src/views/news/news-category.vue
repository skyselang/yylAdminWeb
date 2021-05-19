<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="22">
          <el-input v-model="query.news_category_id" class="filter-item" style="width: 110px;" placeholder="分类ID" clearable />
          <el-input v-model="query.category_name" class="filter-item" style="width: 200px;" placeholder="分类名称" clearable />
          <el-select v-model="query.date_type" class="filter-item" style="width:110px;" placeholder="时间类型" clearable>
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_range"
            type="daterange"
            class="filter-item"
            style="width: 240px;"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="2" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="data" :height="height+80" style="width: 100%" border @sort-change="sort">
      <el-table-column prop="news_category_id" label="分类ID" min-width="100" sortable="custom" />
      <el-table-column prop="category_name" label="分类名称" min-width="250" show-overflow-tooltip />
      <el-table-column prop="category_sort" label="分类排序" min-width="110" sortable="custom" />
      <el-table-column prop="is_hide" label="是否隐藏" min-width="110" sortable="custom" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hide" :active-value="1" :inactive-value="0" @change="ishide(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" min-width="160" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" sortable="custom" />
      <el-table-column label="操作" min-width="150" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="success" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="50%" :before-close="cancel" @opened="dialogOpened()" @closed="dialogClosed()" @close-on-click-modal="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item label="分类名称" prop="category_name">
          <el-input v-model="model.category_name" clearable placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类排序" prop="category_sort">
          <el-input v-model="model.category_sort" clearable placeholder="" />
        </el-form-item>
        <el-form-item v-if="model.news_category_id" label="添加时间" prop="create_time">
          <el-col :span="10">
            <el-input v-model="model.create_time" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">修改时间</el-col>
          <el-col :span="10">
            <el-input v-model="model.update_time" disabled />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { list, info, add, edit, dele, ishide } from '@/api/news-category'

export default {
  name: 'NewsCategory',
  components: { Pagination },
  directives: { },
  data() {
    return {
      height: 680,
      loading: false,
      query: {
        page: 1,
        limit: 13
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        news_category_id: '',
        category_name: '',
        category_sort: 200
      },
      rules: {
        category_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加
    add() {
      this.dialog = true
      this.dialogTitle = '新闻分类添加'
      this.model = this.$options.data().model
    },
    // 修改
    edit(row) {
      this.loading = true
      this.dialog = true
      this.dialogTitle = '新闻分类修改：' + row.news_category_id
      info({
        news_category_id: row.news_category_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    dele(row) {
      this.$confirm(
        '确定要删除新闻分类 <span style="color:red">' + row.category_name + ' </span>吗？',
        '删除新闻分类：' + row.news_category_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          news_category_id: row.news_category_id
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 取消
    cancel() {
      this.reset()
      this.dialog = false
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.news_category_id) {
            edit(this.model).then(res => {
              this.dialog = false
              this.list()
              this.reset()
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.dialog = false
              this.list()
              this.reset()
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
      }
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.list()
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.prop
      this.query.sort_type = ''
      if (sort.order === 'ascending') {
        this.query.sort_type = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_type = 'desc'
        this.list()
      }
    },
    // 是否隐藏
    ishide(row) {
      this.loading = true
      ishide({
        news_category_id: row.news_category_id,
        is_hide: row.is_hide
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
        this.loading = false
      })
    }
  }
}
</script>
