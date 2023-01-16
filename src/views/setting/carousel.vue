<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="title" label="标题" />
            <el-option value="file_type" label="类型" />
            <el-option value="position" label="位置" />
            <el-option value="is_disable" label="禁用" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-select v-if="query.search_field==='file_type'" v-model="query.search_value" class="filter-item ya-search-value">
            <el-option v-for="(item, index) in filetypes" :key="index" :value="index" :label="item" />
          </el-select>
          <el-select v-else-if="query.search_field==='is_disable'" v-model="query.search_value" class="filter-item ya-search-value">
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
          <el-button title="修改位置" @click="selectOpen('editpos')">位置</el-button>
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
          <el-form-item v-if="selectType==='editpos'" label="位置" prop="">
            <el-input v-model="positions" placeholder="请输入位置" clearable />
          </el-form-item>
          <el-form-item v-else-if="selectType==='disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
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
    <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select" @cell-dblclick="cellDbclick">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="file_url" label="文件" min-width="130">
        <template slot-scope="scope">
          <div v-if="scope.row.file_url" style="height:40px">
            <div v-if="scope.row.file_type==='image'" style="width:100%">
              <el-image :src="scope.row.file_url" :preview-src-list="[scope.row.file_url]" style="height:40px" title="点击看大图">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </div>
            <video v-else-if="scope.row.file_type==='video'" width="100%" height="100%" controls>
              <source :src="scope.row.file_url" type="video/mp4">
              <object :data="scope.row.file_url" width="100%" height="100%">
                <embed :src="scope.row.file_url" width="100%" height="100%">
              </object>
            </video>
            <audio v-else-if="scope.row.file_type==='audio'" width="100%" height="100%" controls>
              <source :src="scope.row.file_url" type="audio/mp3">
              <embed :src="scope.row.file_url" width="100%" height="100%">
            </audio>
            <el-image v-else-if="scope.row.file_type==='word'" :src="scope.row.file_url" class="ya-file-img">
              <div slot="error" class="image-slot">
                <i class="el-icon-document ya-file-icon" />
              </div>
            </el-image>
            <div v-else class="image-slot">
              <i class="el-icon-folder ya-file-icon" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="file_type" label="类型" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.file_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="150" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="link" label="链接" min-width="180" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="position" label="位置" min-width="120" sortable="custom" show-overflow-tooltip />
      <el-table-column prop="is_disable" label="禁用" min-width="75" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="75" sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="edit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="文件" prop="file_id">
          <el-col :span="16">
            <div style="height:220px">
              <div v-if="model.file_type==='image'" style="height:180px;width:100%">
                <el-image v-if="model.file_url" :src="model.file_url" :preview-src-list="[model.file_url]" style="height:180px;" title="点击查大图">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <el-image v-else class="ya-img-form" title="">
                  <div slot="error" class="image-slot" />
                </el-image>
              </div>
              <video v-else-if="model.file_type==='video'" width="100%" height="180" controls>
                <source :src="model.file_url" type="video/mp4">
                <object :data="model.file_url" width="100%" height="180">
                  <embed :src="model.file_url" width="100%" height="180">
                </object>
              </video>
              <audio v-else-if="model.file_type==='audio'" width="100%" height="180" controls>
                <source :src="model.file_url" type="audio/mp3">
                <embed :src="model.file_url" width="100%" height="180">
              </audio>
              <el-image v-else-if="model.file_type==='word'" :src="model.file_url">
                <div slot="error" class="image-slot">
                  <i class="el-icon-document ya-file-icon" />
                </div>
              </el-image>
              <div v-else class="image-slot">
                <i class="el-icon-folder ya-file-icon" />
              </div>
              <p><span class="ya-file-name" :title="model.file_name">{{ model.file_name }}</span></p>
            </div>
          </el-col>
          <el-col :span="8">
            <el-button size="mini" @click="fileUpload()">上传</el-button>
            <el-button size="mini" @click="fileDelete()">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="类型" prop="file_type">
          <el-select v-model="model.file_type" class="filter-item ya-search-value">
            <el-option v-for="(item, index) in filetypes" :key="index" :value="index" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="请输入标题" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.title, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="model.link" placeholder="请输入链接" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.link, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="位置" prop="position">
          <el-input v-model="model.position" placeholder="请输入位置" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.position, $event)" />
          </el-input>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="上传文件" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import FileManage from '@/components/FileManage'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, position, disable } from '@/api/setting/carousel'

export default {
  name: 'SettingCarousel',
  components: { Pagination, FileManage },
  directives: {},
  data() {
    return {
      name: '轮播',
      height: 680,
      loading: false,
      idkey: 'carousel_id',
      exps: [],
      query: { page: 1, limit: 12, search_field: 'title', search_exp: 'like', date_field: 'create_time' },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        carousel_id: '',
        file_id: 0,
        file_url: '',
        file_type: 'image',
        file_name: '',
        title: '',
        link: '',
        position: '',
        sort: 250,
        is_disable: 0
      },
      rules: {
        file_type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      },
      filetypes: [],
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      positions: '',
      is_disable: 0,
      fileDialog: false
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
        this.filetypes = res.data.filetypes
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
      this.query = this.$options.data().query
      this.$refs['table'].clearSort()
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
        if (selectType === 'editpos') {
          this.selectTitle = this.name + '修改位置'
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
        if (selectType === 'editpos') {
          this.editpos(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改位置
    editpos(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var positions = row[0].position
        if (select) {
          positions = this.positions
        }
        position({
          ids: this.selectGetIds(row),
          position: positions
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
    // 文件
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelists) {
      this.fileDialog = false
      this.model.file_id = filelists[0]['file_id']
      this.model.file_url = filelists[0]['file_url']
      this.model.file_type = filelists[0]['file_type']
      this.model.file_name = filelists[0]['file_name'] + '.' + filelists[0]['file_ext']
    },
    fileDelete() {
      this.model.file_id = 0
      this.model.file_url = ''
      this.model.file_type = 'image'
      this.model.file_name = ''
    },
    // 复制
    copy(text, event) {
      clip(text, event)
    },
    // 单元格双击复制
    cellDbclick(row, column, cell, event) {
      this.copy(row[column.property], event)
    }
  }
}
</script>
<style scoped>
.ya-file-icon {
  font-size: 50px;
}
.ya-file-img {
  width: 100%;
  height: 100%;
}
.ya-file-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  padding-right: 0;
  font-size: 14px;
}
</style>
