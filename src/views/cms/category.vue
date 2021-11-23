<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="24" style="text-align:right;">
          <el-checkbox v-model="isExpandAll" class="filter-item" border @change="expandAll">收起</el-checkbox>
          <el-button class="filter-item" style="margin-left:10px" @click="refresh()">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table ref="table" v-loading="loading" :data="data" :height="height" style="width: 100%" row-key="category_id" @selection-change="select">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="category_name" label="分类名称" min-width="250" show-overflow-tooltip />
      <el-table-column prop="category_id" label="分类ID" min-width="80" />
      <el-table-column prop="is_hide" label="是否隐藏" min-width="80" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hide" :active-value="1" :inactive-value="0" @change="ishide([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" min-width="160" />
      <el-table-column prop="update_time" label="修改时间" min-width="160" />
      <el-table-column prop="sort" label="排序" min-width="80" />
      <el-table-column label="操作" min-width="120" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="add(row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-switch v-model="is_hide" style="margin-left: 10px;" :active-value="1" :inactive-value="0" />
      <el-button size="mini" type="text" @click="ishide(selection,true)">隐藏</el-button>
      <el-button size="mini" type="text" @click="dele(selection)">删除</el-button>
    </div>
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" width="65%" :before-close="cancel" :close-on-click-modal="false">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="分类父级" prop="category_pid">
          <el-cascader
            v-model="model.category_pid"
            :options="data"
            :props="{checkStrictly: true, value: 'category_id', label: 'category_name'}"
            style="width:100%"
            clearable
            filterable
            placeholder="一级分类"
            @change="pidChange"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="category_name">
          <el-input v-model="model.category_name" clearable placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" clearable placeholder="title" />
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="model.keywords" clearable placeholder="keywords" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="model.description" type="textarea" clearable placeholder="description" />
        </el-form-item>
        <el-form-item label="图片" prop="imgs">
          <el-row :gutter="0">
            <el-col :span="8">
              <el-button size="mini" @click="fileUpload()">上传图片</el-button>
            </el-col>
            <el-col :span="16">
              <div>每张图片大小不超过 500 KB，jpg、png格式。</div>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col v-for="(item, index) in model.imgs" :key="index" :span="6" style="border:1px solid #DCDFE6">
              <el-image style="width:100%;height:100px;" :src="item.file_url" :preview-src-list="[item.file_url]" fit="contain" title="点击查看大图" />
              <br style="line-height: 0">
              <el-link :href="item.file_url" :underline="false" :download="item.file_url" target="_blank" style="margin:0 1px">
                下载<span style="font-size:10px">({{ item.file_size }})</span>
              </el-link>
              <el-button size="mini" @click="uploadDele(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" clearable placeholder="200" />
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
    <el-dialog title="上传图片" :visible.sync="fileDialog" width="80%" top="1vh">
      <file-manage file-type="image" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import FileManage from '@/components/FileManage'
import { list, info, add, edit, dele, ishide } from '@/api/cms/category'

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
        sort: 200
      },
      isExpandAll: true,
      is_hide: 0,
      selection: [],
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
    // 选择
    select(selection) {
      this.selection = selection
    },
    selectAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { confirmButtonText: '确定', callback: action => {} })
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
    // 刷新
    refresh() {
      this.list()
    },
    // 添加
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.model = this.$options.data().model
      if (row) {
        this.model.category_pid = row.category_id
      }
    },
    // 修改
    edit(row) {
      this.loading = true
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.category_id
      info({
        category_id: row.category_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    dele(row) {
      if (row.length === 0) {
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
            category: row
          }).then(res => {
            this.list()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
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
          category: row,
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
    // 父级选择
    pidChange(value) {
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
    fileSubmit(filelists) {
      this.fileDialog = false
      const file_len = filelists.length
      if (filelists) {
        for (let i = 0; i < file_len; i++) {
          this.model.imgs.push(filelists[i])
        }
      }
    },
    uploadDele(index) {
      this.model.imgs.splice(index, 1)
    }
  }
}
</script>
