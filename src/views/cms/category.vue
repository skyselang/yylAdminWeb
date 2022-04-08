<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="category_name" label="名称" />
            <el-option value="is_hide" label="是否隐藏" />
            <el-option value="category_pid" label="PID" />
            <el-option :value="idkey" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-checkbox v-model="isExpandAll" border title="收起/展开" @change="expandAll">收起</el-checkbox>
          <el-button title="修改上级" class="ya-margin-left" @click="selectOpen('pid')">上级</el-button>
          <el-button title="是否隐藏" @click="selectOpen('hide')">隐藏</el-button>
          <el-button @click="selectOpen('dele')">删除</el-button>
          <el-button v-if="recycle===1" type="primary" @click="selectOpen('reco')">恢复</el-button>
          <el-button v-else type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 2, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='pid'" label="分类上级" prop="">
            <el-cascader
              v-model="category_pid"
              :options="data"
              :props="categoryProps"
              style="width:100%"
              clearable
              filterable
              @change="categorySelect"
            />
          </el-form-item>
          <el-form-item v-if="selectType==='hide'" label="是否隐藏" prop="">
            <el-switch v-model="is_hide" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
            <span v-if="recycle===1" style="color:red">确定要彻底删除选中的{{ name }}吗？删除后不可恢复！所有下级即使恢复后也不会显示！</span>
            <span v-else style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
          <el-form-item v-else-if="selectType==='reco'" label="" prop="">
            <span style="color:red">确定要恢复选中的{{ name }}吗？如果不是一级分类需要恢复所有上级分类</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCancel">取消</el-button>
          <el-button type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height+50" :row-key="idkey" default-expand-all @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="category_name" label="名称" min-width="250" show-overflow-tooltip />
      <el-table-column :prop="idkey" label="ID" min-width="100" />
      <el-table-column prop="category_pid" label="PID" min-width="100" />
      <el-table-column prop="is_hide" label="隐藏" min-width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hide" :active-value="1" :inactive-value="0" @change="ishide([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="80" />
      <el-table-column prop="create_time" label="添加时间" min-width="155" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" />
      <el-table-column v-if="recycle===1" prop="delete_time" label="删除时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" min-width="120" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button v-if="recycle===1" size="mini" type="text" @click="selectOpen('reco',row)">恢复</el-button>
          <el-button v-else size="mini" type="text" title="添加下级" @click="add(row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="上级" prop="category_pid">
          <el-cascader
            v-model="model.category_pid"
            :options="data"
            :props="categoryProps"
            style="width:100%"
            placeholder="一级分类"
            clearable
            filterable
            @change="categoryEdit"
          />
        </el-form-item>
        <el-form-item label="名称" prop="category_name">
          <el-input v-model="model.category_name" placeholder="请输入分类名称" clearable />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="title" clearable />
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="model.keywords" placeholder="keywords" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="model.description" type="textarea" placeholder="description" clearable />
        </el-form-item>
        <el-form-item label="图片" prop="imgs">
          <el-row>
            <el-col :span="8">
              <el-button size="mini" @click="fileUpload()">上传图片</el-button>
            </el-col>
            <el-col :span="16">
              <div>每张图片大小不超过 300 KB，jpg、png格式。</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-for="(item, index) in model.imgs" :key="index" :span="6" class="ya-file">
              <el-image class="ya-img-form" :src="item.file_url" :preview-src-list="[item.file_url]" fit="contain" title="点击查看大图" />
              <div>
                <span class="ya-file-name" :title="item.file_name+'.'+item.file_ext">
                  {{ item.file_name }}.{{ item.file_ext }}
                </span>
                <el-link :href="item.file_url" :underline="false" :download="item.file_url" target="_blank" class="ya-file-link">
                  下载
                </el-link>
                <el-button size="mini" @click="fileDelete(index)">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" placeholder="250" clearable />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 文件管理 -->
    <el-dialog title="上传图片" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import FileManage from '@/components/FileManage'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, pid, ishide, recover, recoverReco, recoverDele } from '@/api/cms/category'

export default {
  name: 'CmsCategory',
  components: { FileManage },
  directives: { },
  data() {
    return {
      name: '内容分类',
      recycle: 0, // 是否回收站
      height: 680,
      loading: false,
      idkey: 'category_id',
      query: {
        search_field: 'category_name',
        search_value: ''
      },
      data: [],
      dialog: false,
      dialogTitle: '',
      model: {
        category_id: '',
        category_pid: 0,
        category_name: '',
        title: '',
        keywords: '',
        description: '',
        imgs: [],
        sort: 250
      },
      rules: {
        category_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      categoryProps: { checkStrictly: true, value: 'category_id', label: 'category_name' },
      isExpandAll: false,
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      category_pid: '',
      is_hide: 0,
      fileDialog: false
    }
  },
  created() {
    this.recycle = this.$route.meta.query.recycle
    this.height = screenHeight()
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      if (this.recycle === 1) {
        recover(this.query).then(res => {
          this.data = res.data.list
          this.isExpandAll = false
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        list(this.query).then(res => {
          this.data = res.data.list
          this.isExpandAll = false
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.model = this.$options.data().model
      if (row) {
        this.model.category_pid = row[this.idkey]
      }
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.reset(res.data)
      }).catch(() => {})
    },
    cancel() {
      this.reset()
      this.dialog = false
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
      this.list()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.list()
    },
    // 收起/展开
    expandAll(e) {
      this.expandFor(this.data, !e)
    },
    expandFor(data, isExpand) {
      data.forEach(i => {
        this.$refs.table.toggleRowExpansion(i, isExpand)
        if (i.children) {
          this.expandFor(i.children, isExpand)
        }
      })
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
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
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
        if (selectType === 'pid') {
          this.selectTitle = '修改上级'
        } else if (selectType === 'hide') {
          this.selectTitle = '是否隐藏'
        } else if (selectType === 'dele') {
          this.selectTitle = '删除' + this.name
        } else if (selectType === 'reco') {
          this.selectTitle = '恢复' + this.name
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
        if (selectType === 'pid') {
          this.editpid(this.selection)
        } else if (selectType === 'hide') {
          this.ishide(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        } else if (selectType === 'reco') {
          this.reco(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改上级
    editpid(row) {
      pid({
        ids: this.selectGetIds(row),
        category_pid: this.category_pid
      }).then(res => {
        this.list()
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
      })
    },
    // 是否隐藏
    ishide(row, select = false) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_hide = row[0].is_hide
        if (select) {
          is_hide = this.is_hide
        }
        ishide({
          ids: this.selectGetIds(row),
          is_hide: is_hide
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        if (this.recycle === 1) {
          recoverDele({
            ids: this.selectGetIds(row)
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
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
      }
    },
    // 恢复
    reco(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        recoverReco({
          ids: this.selectGetIds(row)
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 上级
    categoryEdit(value) {
      if (value) {
        this.model.category_pid = value[value.length - 1]
      }
    },
    categorySelect(value) {
      if (value) {
        this.category_pid = value[value.length - 1]
      }
    },
    // 上传图片
    fileUpload() {
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(filelist) {
      this.fileDialog = false
      const fileLength = filelist.length
      if (fileLength) {
        for (let i = 0; i < fileLength; i++) {
          this.model.imgs.push(filelist[i])
        }
      }
    },
    fileDelete(index) {
      this.model.imgs.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.ya-file{
  text-align: center;
  border: 1px solid #DCDFE6;
}
.ya-file-name{
  display: block;
  height: 24px;
  line-height: 24px;
  padding: 0 4px;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ya-file-link{
  margin-right: 6px;
}
</style>
