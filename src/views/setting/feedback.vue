<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="type" label="类型" />
            <el-option value="status" label="状态" />
            <el-option value="title" label="标题" />
            <el-option value="phone" label="手机" />
            <el-option value="email" label="邮箱" />
            <el-option value="receipt_no" label="回执" />
            <el-option value="remark" label="备注" />
            <el-option value="is_disable" label="禁用" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-select v-if="query.search_field === 'status'" v-model="query.search_value" class="filter-item ya-search-value">
            <el-option v-for="(item, index) in statuss" :key="index" :label="item" :value="index" />
          </el-select>
          <el-select v-else-if="query.search_field === 'is_disable'" v-model="query.search_value" class="filter-item ya-search-value">
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-select v-else-if="query.search_field === 'type'" v-model="query.search_value" class="filter-item ya-search-value">
            <el-option v-for="(item, index) in types" :key="index" :label="item" :value="index" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="查询内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker v-model="query.date_value" type="datetimerange" class="filter-item ya-date-value" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00','23:59:59']" value-format="yyyy-MM-dd HH:mm:ss" />
          <el-button class="filter-item" type="primary" title="查询/刷新" @click="search()">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" title="重置" @click="refresh()" />
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button title="状态" @click="selectOpen('status')">状态</el-button>
          <el-button title="禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form label-width="120px">
          <el-form-item :label="name + 'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{ minRows: 5, maxRows: 12 }" disabled />
          </el-form-item>
          <el-form-item v-if="selectType === 'status'" label="状态" prop="">
            <el-select v-model="status" class="filter-item ya-search-value">
              <el-option v-for="(item, index) in statuss" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'dele'" label="" prop="">
            <span style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="loading" @click="selectCancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="member_username" label="会员" min-width="80" show-overflow-tooltip />
      <el-table-column prop="type_name" label="类型" min-width="80" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="130" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" min-width="100" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" min-width="75" sortable="custom">
        <template slot-scope="scope">
          {{ statuss[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="receipt_no" label="回执编号" min-width="100" show-overflow-tooltip />
      <el-table-column prop="create_time" label="添加时间" width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" width="155" sortable="custom" />
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button size="mini" type="text" title="修改" @click="edit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{ height: height + 'px' }">
        <el-form-item label="会员ID" prop="member_id">
          <el-col :span="8">
            <el-input v-model="model.member_id" placeholder="请输入会员ID" clearable />
          </el-col>
          <el-col class="ya-center" :span="4">会员用户名</el-col>
          <el-col :span="12">
            <el-input v-model="model.member_username" placeholder="" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="model.type">
            <el-option v-for="(item, index) in types" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="model.content" type="textarea" :autosize="{ minRows: 5, maxRows: 20 }" placeholder="请输入内容" clearable />
        </el-form-item>
        <el-form-item label="图片" prop="images">
          <el-row>
            <el-col :span="12">
              <el-button size="mini" @click="fileUpload('image', 'images', '上传图片')">上传图片</el-button>
            </el-col>
            <el-col :span="12">
              <span><el-button size="mini" @click="fileDelete('all', 'images')">全部删除</el-button>图片小于 200 KB，jpg、png格式。</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-for="(item, index) in model.images" :key="index" :span="6" class="ya-file">
              <el-image style="height:100px" fit="contain" :src="item.file_url" :preview-src-list="[item.file_url]" title="点击看大图" />
              <div>
                <span class="ya-file-name" :title="item.file_name + '.' + item.file_ext">{{ item.file_name }}.{{ item.file_ext }}</span>
                <el-button type="text" size="medium" icon="el-icon-d-arrow-left" title="向左移动" @click="fileRemoval(index, 'images', 'left')" />
                <el-button type="text" size="medium" icon="el-icon-d-arrow-right" title="向左移动" @click="fileRemoval(index, 'images', 'right')" />
                <el-button type="text" size="medium" icon="el-icon-download" title="下载" @click="fileDownload(item, $event)" />
                <el-button type="text" size="medium" icon="el-icon-delete" title="删除" @click="fileDelete(index, 'images')" />
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="model.phone" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="model.email" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="回复" prop="reply">
          <el-input v-model="model.reply" type="textarea" :autosize="{ minRows: 5, maxRows: 20 }" placeholder="请输入回复" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="model.status">
            <el-option v-for="(item, index) in statuss" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="回执" prop="receipt_no">
          <el-input v-model="model.receipt_no" placeholder="回执编号（唯一）" clearable />
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
    <!-- 文件管理 -->
    <el-dialog :title="fileTitle" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage :file-type="fileType" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import FileManage from '@/components/FileManage'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, status as editsta, disable } from '@/api/setting/feedback'

export default {
  name: 'SettingFeedback',
  components: { Pagination, FileManage },
  directives: {},
  data() {
    return {
      name: '反馈',
      height: 680,
      loading: false,
      idkey: 'feedback_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: { page: 1, limit: 12, search_field: 'title', search_exp: 'like', date_field: 'create_time' },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        feedback_id: '',
        member_id: 0,
        member_username: '',
        receipt_no: '',
        type: 0,
        title: '',
        content: '',
        images: [],
        phone: '',
        email: '',
        reply: '',
        remark: '',
        status: 0
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      types: [],
      statuss: [],
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      status: 0,
      is_disable: 0,
      fileDialog: false,
      fileTitle: '文件管理',
      fileType: 'image',
      fileField: ''
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
        this.types = res.data.types
        this.statuss = res.data.statuss
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
        if (selectType === 'status') {
          this.selectTitle = this.name + '状态'
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
        if (selectType === 'status') {
          this.editsta(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 状态
    editsta(row, select) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var status = row[0].status
        if (select) {
          status = this.status
        }
        editsta({
          ids: this.selectGetIds(row),
          status: status
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
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
    // 上传图片
    fileUpload(fileType, fileField = '', fileTitle = '文件管理') {
      this.fileType = fileType
      this.fileField = fileField
      this.fileTitle = fileTitle
      this.fileDialog = true
    },
    fileCancel() {
      this.fileType = 'image'
      this.fileField = ''
      this.fileTitle = '文件管理'
      this.fileDialog = false
    },
    fileSubmit(fileList) {
      this.fileDialog = false
      const fileField = this.fileField
      const fileLength = fileList.length
      if (fileLength) {
        for (let i = 0; i < fileLength; i++) {
          if (fileField === 'images') {
            this.model.images.push(fileList[i])
          }
        }
      }
    },
    fileRemoval(index, field, direction) {
      const length = this.model[field].length
      var index1 = index
      if (direction === 'left') {
        if (index <= 0) {
          return false
        }
        --index1
      } else {
        if (index >= (length - 1)) {
          return false
        }
        ++index1
      }
      const value = this.model[field][index]
      const value1 = this.model[field][index1]
      this.model[field][index] = value1
      this.model[field][index1] = value
      this.$forceUpdate()
    },
    fileDownload(file, event) {
      clip(file.file_name, event, '文件名复制成功')
      setTimeout(() => { window.open(file.file_url, '_blank') }, 500)
    },
    fileDelete(index, field = '') {
      if (field === 'images') {
        if (index === 'all') {
          this.model.images = []
        } else {
          this.model.images.splice(index, 1)
        }
      }
    }
  }
}
</script>
<style scoped>
.ya-file {
  text-align: center;
  border: 1px solid #dcdfe6;
}

.ya-file-name {
  display: block;
  height: 24px;
  line-height: 24px;
  padding: 0 4px;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
