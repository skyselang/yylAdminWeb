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
            <el-option value="title" label="标题" />
            <el-option value="desc" label="描述" />
            <el-option value="remark" label="备注" />
            <el-option value="is_disable" label="禁用" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option
              v-for="exp in exps"
              :key="exp.exp"
              :value="exp.exp"
              :label="exp.name"
            />
          </el-select>
          <el-select
            v-if="query.search_field === 'is_disable'"
            v-model="query.search_value"
            class="filter-item ya-search-value"
          >
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-select
            v-else-if="query.search_field === 'type'"
            v-model="query.search_value"
            class="filter-item ya-search-value"
          >
            <el-option
              v-for="(item, index) in types"
              :key="index"
              :value="index"
              :label="item"
            />
          </el-select>
          <el-input
            v-else
            v-model="query.search_value"
            class="filter-item ya-search-value"
            placeholder="查询内容"
            clearable
          />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间字段">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
            <el-option value="start_time" label="开始时间" />
            <el-option value="end_time" label="结束时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="datetimerange"
            class="filter-item ya-date-value"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <el-button
            class="filter-item"
            type="primary"
            title="查询/刷新"
            @click="search()"
          >查询</el-button>
          <el-button
            class="filter-item"
            icon="el-icon-refresh"
            title="重置"
            @click="refresh()"
          />
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button title="修改类型" @click="selectOpen('edittype')">类型</el-button>
          <el-button title="时间范围" @click="selectOpen('datetime')">时间</el-button>
          <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog
        :title="selectTitle"
        :visible.sync="selectDialog"
        top="20vh"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name + 'ID'" prop="">
            <el-input
              v-model="selectIds"
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 12 }"
              disabled
            />
          </el-form-item>
          <el-form-item v-if="selectType === 'edittype'" label="类型" prop="">
            <el-select v-model="type">
              <el-option
                v-for="(item, index) in types"
                :key="index"
                :value="index"
                :label="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'datetime'" label="时间范围" prop="">
            <el-date-picker
              v-model="start_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
              placeholder="开始时间"
            />
            <span>至</span>
            <el-date-picker
              v-model="end_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="23:59:59"
              placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'dele'" label="" prop="">
            <span class="ya-color-red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="loading" @click="selectCancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :height="height"
      @sort-change="sort"
      @selection-change="select"
    >
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column
        :prop="idkey"
        label="ID"
        width="80"
        sortable="custom"
      />
      <el-table-column prop="image_id" label="图片" min-width="60">
        <template slot-scope="scope">
          <div style="height:30px">
            <el-image
              v-if="scope.row.image_url"
              style="height:30px"
              fit="contain"
              :src="scope.row.image_url"
              :preview-src-list="[scope.row.image_url]"
              title="点击看大图"
              lazy
              scroll-container=".el-table__body-wrapper"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type_name" label="类型" min-width="75" />
      <el-table-column
        prop="title"
        label="标题"
        min-width="260"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span :style="{ 'color': scope.row.title_color }">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_time"
        label="开始时间"
        width="155"
        sortable="custom"
      />
      <el-table-column
        prop="end_time"
        label="结束时间"
        width="155"
        sortable="custom"
      />
      <el-table-column
        prop="is_disable"
        label="禁用"
        min-width="75"
        sortable="custom"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_disable"
            :active-value="1"
            :inactive-value="0"
            @change="disable([scope.row])"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        min-width="75"
        sortable="custom"
      />
      <el-table-column
        prop="create_time"
        label="添加时间"
        width="155"
        sortable="custom"
      />
      <el-table-column
        prop="update_time"
        label="修改时间"
        width="155"
        sortable="custom"
      />
      <el-table-column label="操作" width="85">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="selectOpen('dele', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="count > 0"
      :total="count"
      :page.sync="query.page"
      :limit.sync="query.limit"
      @pagination="list"
    />
    <!-- 添加修改 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialog"
      top="5vh"
      :before-close="cancel"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="ref"
        :model="model"
        :rules="rules"
        label-width="100px"
        class="dialog-body"
        :style="{ height: height + 'px' }"
      >
        <el-form-item label="图片" prop="image_url">
          <el-col :span="12" style="height:100px">
            <el-image
              v-if="model.image_url"
              style="height:100px"
              fit="contain"
              :src="model.image_url"
              :preview-src-list="[model.image_url]"
              title="点击看大图"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-col>
          <el-col :span="12">
            <el-button @click="fileUpload()">上传图片</el-button>
            <el-button @click="fileDelete()">删除</el-button>
            <p>图片小于 200 KB，jpg、png格式。</p>
          </el-col>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="model.type">
            <el-option
              v-for="(item, index) in types"
              :key="index"
              :value="index"
              :label="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-col :span="18">
            <el-input v-model="model.title" placeholder="请输入标题" clearable />
          </el-col>
          <el-col :span="3" class="ya-center">标题颜色</el-col>
          <el-col :span="3">
            <el-color-picker v-model="model.title_color" />
          </el-col>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="model.desc"
            type="textarea"
            autosize
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            v-model="model.start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            placeholder="开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            v-model="model.end_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" placeholder="请输入备注" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <rich-editor v-model="model.content" />
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
    <el-dialog
      title="上传图片"
      :visible.sync="fileDialog"
      width="80%"
      top="1vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import FileManage from '@/components/FileManage'
import RichEditor from '@/components/RichEditor'
import { arrayColumn } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import { list, info, add, edit, dele, edittype, datetime, disable } from '@/api/setting/notice'

export default {
  name: 'SettingNotice',
  components: { Pagination, FileManage, RichEditor },
  data() {
    return {
      name: '通告',
      height: 680,
      loading: false,
      idkey: 'notice_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: { page: 1, limit: getPageLimit(), search_field: 'title', search_exp: 'like', date_field: 'create_time' },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        notice_id: '',
        image_id: 0,
        image_url: '',
        type: 0,
        title: '',
        title_color: '#606266',
        start_time: '',
        end_time: '',
        desc: '',
        content: '',
        remark: '',
        sort: 250
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        start_time: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
        end_time: [{ required: true, message: '请输入结束时间', trigger: 'blur' }]
      },
      types: [],
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      type: 0,
      start_time: '',
      end_time: '',
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
        this.types = res.data.types
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
        } else {
          this.$message.error('请完善必填项（带红色星号*）')
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
        if (selectType === 'edittype') {
          this.selectTitle = this.name + '修改类型'
        } else if (selectType === 'datetime') {
          this.selectTitle = this.name + '时间范围'
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
        if (selectType === 'edittype') {
          this.edittype(this.selection)
        } else if (selectType === 'datetime') {
          this.datetime(this.selection)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改类型
    edittype(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        edittype({
          ids: this.selectGetIds(row),
          type: this.type
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 时间范围
    datetime(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        datetime({
          ids: this.selectGetIds(row),
          start_time: this.start_time,
          end_time: this.end_time
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
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(fileList) {
      this.fileDialog = false
      const fileLength = fileList.length
      if (fileLength) {
        const i = fileLength - 1
        this.model.image_id = fileList[i]['file_id']
        this.model.image_url = fileList[i]['file_url']
      }
    },
    fileDelete() {
      this.model.image_id = 0
      this.model.image_url = ''
    }
  }
}
</script>
