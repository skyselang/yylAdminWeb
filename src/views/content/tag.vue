<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="tag_name" label="名称" />
            <el-option value="tag_unique" label="标识" />
            <el-option value="tag_desc" label="描述" />
            <el-option value="is_disable" label="禁用" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-select v-if="query.search_field==='is_disable'" v-model="query.search_value" class="filter-item ya-search-value">
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="查询内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker v-model="query.date_value" type="daterange" class="filter-item ya-date-value" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
          <el-button class="filter-item" type="primary" title="查询/刷新" @click="search()">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" title="重置" @click="refresh()" />
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button title="解除内容" @click="selectOpen('removec')">内容</el-button>
          <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='removec'" label="" prop="">
            <span style="">确定要解除选中的{{ name }}的内容吗？</span>
          </el-form-item>
          <el-form-item v-else-if="selectType==='disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
            <span style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCancel">取消</el-button>
          <el-button type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="tag_name" label="名称" min-width="130" show-overflow-tooltip />
      <el-table-column prop="tag_unique" label="标识" min-width="80" show-overflow-tooltip />
      <el-table-column prop="tag_desc" label="描述" min-width="150" show-overflow-tooltip />
      <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="75" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="contentShow(scope.row)">内容</el-button>
          <el-button size="mini" type="text" @click="edit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count>0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="名称" prop="tag_name">
          <el-input v-model="model.tag_name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="标识" prop="tag_unique">
          <el-input v-model="model.tag_unique" placeholder="请输入标识（唯一）" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="tag_desc">
          <el-input v-model="model.tag_desc" placeholder="请输入描述" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
          <el-input v-model="model.delete_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 标签内容 -->
    <el-dialog :title="contentDialogTitle" :visible.sync="contentDialog" width="70%" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button type="primary" title="解除" @click="contentSelectOpen('contentRemove')">解除</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="contentSelectTitle" :visible.sync="contentSelectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
        <el-form ref="contentSelectRef" label-width="120px">
          <el-form-item :label="contentName+'ID'" prop="">
            <el-input v-model="contentSelectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="contentSelectType==='contentRemove'" label="标签ID" prop="">
            <span>{{ contentQuery[idkey] }}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="contentSelectCancel">取消</el-button>
          <el-button type="primary" @click="contentSelectSubmit">提交</el-button>
        </div>
      </el-dialog>
      <!-- 内容列表 -->
      <el-table ref="contentRef" v-loading="contentLoad" :data="contentData" :height="height-20" @sort-change="contentSort" @selection-change="contentSelect">
        <el-table-column type="selection" width="42" title="全选/反选" />
        <el-table-column :prop="contentPk" label="内容ID" min-width="80" sortable="custom" />
        <el-table-column prop="cover_url" label="封面" min-width="60">
          <template slot-scope="scope">
            <div style="height:30px">
              <el-image v-if="scope.row.cover_url" style="height:30px" fit="contain" :src="scope.row.cover_url" :preview-src-list="[scope.row.cover_url]" title="点击看大图">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="230" show-overflow-tooltip />
        <el-table-column prop="unique" label="标识" min-width="80" show-overflow-tooltip />
        <el-table-column prop="category_names" label="分类" min-width="120" show-overflow-tooltip />
        <el-table-column prop="tag_names" label="标签" min-width="120" show-overflow-tooltip />
        <el-table-column prop="is_top" label="置顶" min-width="75" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_top" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_hot" label="热门" min-width="75" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_hot" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_rec" label="推荐" min-width="75" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_rec" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="contentSelectOpen('contentRemove',scope.row)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="contentCount>0" :total="contentCount" :page.sync="contentQuery.page" :limit.sync="contentQuery.limit" @pagination="content" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, disable, content, contentRemove } from '@/api/content/tag'

export default {
  name: 'ContentTag',
  components: { Pagination },
  data() {
    return {
      name: '内容标签',
      height: 680,
      loading: false,
      idkey: 'tag_id',
      exps: [],
      query: { page: 1, limit: 12, search_field: 'tag_name', search_exp: 'like', date_field: 'create_time' },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        tag_id: '',
        tag_name: '',
        tag_unique: '',
        tag_desc: '',
        sort: 250
      },
      rules: {
        tag_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      is_disable: 0,
      contentPk: 'content_id',
      contentName: '内容',
      contentDialog: false,
      contentDialogTitle: '',
      contentLoad: false,
      contentData: [],
      contentCount: 0,
      contentQuery: { page: 1, limit: 12 },
      contentSelection: [],
      contentSelectIds: '',
      contentSelectTitle: '选中操作',
      contentSelectDialog: false,
      contentSelectType: ''
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
        this.count = res.data.count
        this.exps = res.data.exps
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.reset(res.data)
      }).catch(() => { })
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model[this.idkey]) {
            edit(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.list()
              this.dialog = false
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
        this.$refs['ref'].clearValidate()
      }
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.$refs['table'].clearSort()
      this.query.limit = limit
      this.list()
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.prop
      this.query.sort_value = ''
      if (sort.order === 'ascending') {
        this.query.sort_value = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_value = 'desc'
        this.list()
      }
    },
    // 选中操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => { } })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        this.$refs['table'].toggleRowSelection(selectRow)
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '选中操作'
        if (selectType === 'removec') {
          this.selectTitle = this.name + '解除内容'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'dele') {
          this.selectTitle = this.name + '删除'
        }
        this.selectDialog = true
        this.selectType = selectType
      }
    },
    selectCancel() {
      this.selectDialog = false
    },
    selectSubmit() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        const selectType = this.selectType
        if (selectType === 'removec') {
          this.removec(this.selection)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection, true)
        }
        this.selectDialog = false
      }
    },
    // 解除内容
    removec(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        contentRemove({
          tag_id: this.selectGetIds(row),
          content_ids: []
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 是否禁用
    disable(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_disable = row[0].is_disable
        if (select) {
          is_disable = this.is_disable
        }
        disable({
          ids: this.selectGetIds(row),
          is_disable: is_disable
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
      }
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        dele({
          ids: this.selectGetIds(row)
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 标签内容显示
    contentShow(row) {
      this.contentDialog = true
      this.contentDialogTitle = this.name + '内容：' + row.tag_name
      this.contentQuery.tag_id = row.tag_id
      this.content()
    },
    // 标签内容列表
    content() {
      this.contentLoad = true
      content(this.contentQuery).then(res => {
        this.contentData = res.data.list
        this.contentCount = res.data.count
        this.contentLoad = false
      }).catch(() => {
        this.contentLoad = false
      })
    },
    // 标签内容排序
    contentSort(sort) {
      this.contentQuery.sort_field = sort.prop
      this.contentQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.contentQuery.sort_value = 'asc'
        this.content()
      }
      if (sort.order === 'descending') {
        this.contentQuery.sort_value = 'desc'
        this.content()
      }
    },
    // 标签内容选中操作
    contentSelect(selection) {
      this.contentSelection = selection
      this.contentSelectIds = this.contentSelectGetIds(selection).toString()
    },
    contentSelectGetIds(selection) {
      return arrayColumn(selection, this.contentPk)
    },
    contentSelectAlert() {
      this.$alert('请选择需要操作的' + this.contentName, '提示', { type: 'warning', callback: action => { } })
    },
    contentSelectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['contentRef'].clearSelection()
        this.$refs['contentRef'].toggleRowSelection(selectRow)
      }
      if (!this.contentSelection.length) {
        this.contentSelectAlert()
      } else {
        this.contentSelectTitle = '选中操作'
        if (selectType === 'contentRemove') {
          this.contentSelectTitle = '解除标签'
        }
        this.contentSelectDialog = true
        this.contentSelectType = selectType
      }
    },
    contentSelectCancel() {
      this.contentSelectDialog = false
    },
    contentSelectSubmit() {
      if (!this.contentSelection.length) {
        this.contentSelectAlert()
      } else {
        const selectType = this.contentSelectType
        if (selectType === 'contentRemove') {
          this.contentRemove(this.contentSelection)
        }
        this.contentSelectDialog = false
      }
    },
    // 标签内容解除
    contentRemove(row) {
      if (!row.length) {
        this.contentSelectAlert()
      } else {
        this.contentLoad = true
        contentRemove({
          tag_id: this.contentQuery.tag_id,
          content_ids: this.contentSelectGetIds(row)
        }).then(res => {
          this.content()
          this.$message.success(res.msg)
        }).catch(() => {
          this.contentLoad = false
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
