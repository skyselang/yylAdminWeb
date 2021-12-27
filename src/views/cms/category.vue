<template>
  <div class="app-container">
    <!-- 查询、选中操作 -->
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <div>
            <el-checkbox v-model="isExpandAll" border @change="expandAll">收起</el-checkbox>
            <el-button class="ya-margin-left" @click="selectOpen('pid')">父级</el-button>
            <el-button @click="selectOpen('hide')">隐藏</el-button>
            <el-button @click="dele(selection)">删除</el-button>
            <el-button type="primary" @click="add()">添加</el-button>
          </div>
        </el-col>
      </el-row>
      <el-dialog title="选中操作" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item v-if="selectType==='pid'" label="分类父级" prop="">
            <el-cascader
              v-model="category_pid"
              :options="data"
              :props="categoryProps"
              style="width:100%"
              placeholder="分类"
              clearable
              filterable
              @change="selectCategoryChange"
            />
          </el-form-item>
          <el-form-item v-if="selectType==='hide'" label="隐藏" prop="">
            <el-switch v-model="is_hide" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="selectCancel">取消</el-button>
          <el-button type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height+30" row-key="category_id" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="category_name" label="名称" min-width="250" show-overflow-tooltip />
      <el-table-column prop="category_id" label="ID" min-width="80" />
      <el-table-column prop="is_hide" label="隐藏" min-width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hide" :active-value="1" :inactive-value="0" @change="ishide([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="80" />
      <el-table-column prop="create_time" label="添加时间" min-width="160" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" />
      <el-table-column label="操作" min-width="120" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" title="添加下级" @click="add(row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="父级" prop="category_pid">
          <el-cascader
            v-model="model.category_pid"
            :options="data"
            :props="categoryProps"
            style="width:100%"
            placeholder="一级分类"
            clearable
            filterable
            @change="categoryChange"
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
                <el-button size="mini" @click="fileDele(index)">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" placeholder="250" clearable />
        </el-form-item>
        <el-form-item v-if="model.category_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.category_id" label="修改时间" prop="update_time">
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
import { list, info, add, edit, dele, pid, ishide } from '@/api/cms/category'

export default {
  name: 'CmsCategory',
  components: { FileManage },
  directives: { },
  data() {
    return {
      name: '内容分类',
      height: 680,
      loading: false,
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
      categoryProps: { checkStrictly: true, value: 'category_id', label: 'category_name' },
      isExpandAll: true,
      selection: [],
      selectButton: false,
      selectDialog: false,
      selectType: '',
      category_pid: '',
      is_hide: 0,
      fileDialog: false,
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
        this.isExpandAll = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.model = this.$options.data().model
      if (row) {
        this.model.category_pid = row.category_id
      }
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.category_id
      info({
        category_id: row.category_id
      }).then(res => {
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
          if (this.model.category_id) {
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
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].category_id
          message = '确定要删除' + this.name + ' <span style="color:red">' + row[0].category_name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            ids: arrayColumn(row, 'category_id')
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
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
      this
    },
    // 刷新
    refresh() {
      this.reset()
      this.list()
    },
    // 收起
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
    // 分类选择（添加修改）
    categoryChange(value) {
      if (value) {
        this.model.category_pid = value[value.length - 1]
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
      const file_len = filelist.length
      if (file_len) {
        for (let i = 0; i < file_len; i++) {
          this.model.imgs.push(filelist[i])
        }
      }
    },
    fileDele(index) {
      this.model.imgs.splice(index, 1)
    },
    // 选中操作
    select(selection) {
      this.selection = selection
    },
    selectAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { confirmButtonText: '确定', callback: action => {} })
    },
    selectOpen(selectType) {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
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
        const type = this.selectType
        if (type === 'pid') {
          this.setpid(this.selection, true)
        } else if (type === 'hide') {
          this.ishide(this.selection, true)
        }
        this.selectDialog = false
      }
    },
    selectCategoryChange(value) {
      if (value) {
        this.category_pid = value[value.length - 1]
      }
    },
    // 设置父级
    setpid(row) {
      pid({
        ids: arrayColumn(row, 'category_id'),
        category_pid: this.category_pid
      }).then(res => {
        this.selectDialog = false
        this.list()
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
          ids: arrayColumn(row, 'category_id'),
          is_hide: is_hide
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
