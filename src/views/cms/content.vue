<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="name" label="名称" />
            <el-option value="is_top" label="是否置顶" />
            <el-option value="is_hot" label="是否热门" />
            <el-option value="is_rec" label="是否推荐" />
            <el-option value="is_hide" label="是否隐藏" />
            <el-option :value="idkey" label="ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-cascader
            v-model="query.category_id"
            class="filter-item ya-width-150"
            :options="categoryData"
            :props="categoryProps"
            placeholder="分类"
            clearable
            filterable
            @change="categoryChangeQuery"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button @click="selectOpen('cate')">分类</el-button>
          <el-button @click="selectOpen('top')">置顶</el-button>
          <el-button @click="selectOpen('hot')">热门</el-button>
          <el-button @click="selectOpen('rec')">推荐</el-button>
          <el-button @click="selectOpen('hide')">隐藏</el-button>
          <el-button @click="selectOpen('dele')">删除</el-button>
          <el-button v-permission="['admin/cms.Content/recover']" @click="recover()">回收站</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :rows="2" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='cate'" label="分类" prop="">
            <el-cascader
              v-model="category_id"
              :options="categoryData"
              :props="categoryProps"
              style="width:100%"
              clearable
              filterable
              @change="selectCategoryChange"
            />
          </el-form-item>
          <el-form-item v-else-if="selectType==='top'" label="是否置顶" prop="">
            <el-switch v-model="is_top" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='hot'" label="是否热门" prop="">
            <el-switch v-model="is_hot" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='rec'" label="是否推荐" prop="">
            <el-switch v-model="is_rec" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType==='hide'" label="是否隐藏" prop="">
            <el-switch v-model="is_hide" :active-value="1" :inactive-value="0" />
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
      <el-table-column :prop="idkey" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="img_url" label="图片" min-width="70">
        <template slot-scope="scope">
          <el-image v-if="scope.row.img_url" class="ya-img-table" :src="scope.row.img_url" :preview-src-list="[scope.row.img_url]" title="点击查看大图" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="230" show-overflow-tooltip />
      <el-table-column prop="category_name" label="分类" min-width="100" show-overflow-tooltip />
      <el-table-column prop="hits" label="点击" min-width="80" sortable="custom" />
      <el-table-column prop="sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column prop="is_top" label="置顶" min-width="80" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_top" :active-value="1" :inactive-value="0" @change="istop([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_hot" label="热门" min-width="80" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hot" :active-value="1" :inactive-value="0" @change="ishot([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_rec" label="推荐" min-width="80" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_rec" :active-value="1" :inactive-value="0" @change="isrec([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_hide" label="隐藏" min-width="80" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hide" :active-value="1" :inactive-value="0" @change="ishide([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" min-width="155" sortable="custom" />
      <el-table-column label="操作" min-width="85" align="right" fixed="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="分类" prop="category_id">
          <el-cascader
            v-model="model.category_id"
            :options="categoryData"
            :props="categoryProps"
            style="width:100%"
            clearable
            filterable
            @change="categoryChange"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="model.name" placeholder="请输入名称" clearable />
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
        <el-form-item label="链接" prop="url">
          <el-input v-model="model.url" placeholder="url" clearable />
        </el-form-item>
        <el-form-item label="图片" prop="imgs">
          <el-row>
            <el-col :span="8">
              <el-button size="mini" @click="fileUpload('image', '上传图片')">上传图片</el-button>
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
                <el-button size="mini" @click="fileImgDele(index)">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="视频" prop="videos">
          <el-row>
            <el-col :span="8">
              <el-button size="mini" @click="fileUpload('video', '上传视频')">上传视频</el-button>
            </el-col>
            <el-col :span="16">
              <div>每个视频大小不超过 50 MB。</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-for="(item, index) in model.videos" :key="index" :span="6" class="ya-file">
              <video width="100%" height="100%" controls>
                <source :src="item.file_url" type="video/mp4">
                <object :data="item.file_url" width="100%" height="100%">
                  <embed :src="item.file_url" width="100%" height="100%">
                </object>
              </video>
              <div>
                <span class="ya-file-name" :title="item.file_name+'.'+item.file_ext">
                  {{ item.file_name }}.{{ item.file_ext }}
                </span>
                <el-link :href="item.file_url" :underline="false" :download="item.file_url" target="_blank" class="ya-file-link">
                  下载
                </el-link>
                <el-button size="mini" @click="fileVideoDele(index)">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="附件" prop="files">
          <el-row>
            <el-col :span="8">
              <el-button size="mini" @click="fileUpload('word', '上传附件')">上传附件</el-button>
            </el-col>
            <el-col :span="16">
              <div>每个附件大小不超过 5 MB。</div>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in model.files" :key="index">
            <el-col :span="20" class="ya-file-name">
              <i v-if="item.file_type==='image'" class="el-icon-picture" />
              <i v-else-if="item.file_type==='audio'" class="el-icon-headset" />
              <i v-else-if="item.file_type==='video'" class="el-icon-video-play" />
              <i v-else-if="item.file_type==='word'" class="el-icon-document" />
              <i v-else class="el-icon-folder" />
              <span :title="item.file_name+'.'+item.file_ext">
                {{ item.file_name }}.{{ item.file_ext }}
              </span>
            </el-col>
            <el-col :span="4">
              <el-link :href="item.file_url" :underline="false" :download="item.file_url" target="_blank" class="ya-file-link">
                下载
              </el-link>
              <el-button size="mini" @click="fileFileDele(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" placeholder="sort" clearable />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <rich-editor v-model="model.content" />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.update_time" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
          <el-input v-model="model.delete_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 回收站 -->
    <el-dialog :title="recoverDialogTitle" :visible.sync="recoverDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 回收站查询操作 -->
      <div class="filter-container">
        <!-- 查询 -->
        <el-row>
          <el-col>
            <el-select v-model="recoverQuery.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
              <el-option value="name" label="名称" />
              <el-option value="is_top" label="是否置顶" />
              <el-option value="is_hot" label="是否热门" />
              <el-option value="is_rec" label="是否推荐" />
              <el-option value="is_hide" label="是否隐藏" />
              <el-option :value="idkey" label="ID" />
            </el-select>
            <el-input v-model="recoverQuery.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
            <el-select v-model="recoverQuery.date_field" class="filter-item ya-date-field" placeholder="时间类型">
              <el-option value="delete_time" label="删除时间" />
              <el-option value="create_time" label="添加时间" />
            </el-select>
            <el-date-picker
              v-model="recoverQuery.date_value"
              type="daterange"
              class="filter-item ya-date-value"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-cascader
              v-model="recoverQuery.category_id"
              class="filter-item ya-width-150"
              :options="categoryData"
              :props="categoryProps"
              placeholder="分类"
              clearable
              filterable
              @change="recoverCategoryChangeQuery"
            />
            <el-button class="filter-item" type="primary" @click="recoverSearch()">查询</el-button>
            <el-button class="filter-item" @click="recoverRefresh()">刷新</el-button>
          </el-col>
        </el-row>
        <!-- 选中操作 -->
        <el-row>
          <el-col>
            <el-button @click="recoverSelectOpen('reco')">恢复</el-button>
            <el-button @click="recoverSelectOpen('dele')">删除</el-button>
          </el-col>
        </el-row>
        <el-dialog :title="recoverSelectTitle" :visible.sync="recoverSelectDialog" top="20vh" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
          <el-form label-width="120px">
            <el-form-item :label="name+'ID'" prop="">
              <el-input v-model="recoverSelectIds" type="textarea" :rows="2" disabled />
            </el-form-item>
            <el-form-item v-if="recoverSelectType==='reco'" label="" prop="">
              <span>确定要恢复选中的{{ name }}吗？</span>
            </el-form-item>
            <el-form-item v-else-if="recoverSelectType==='dele'" label="" prop="">
              <span style="color:red">确定要彻底删除选中的{{ name }}吗？删除后不可恢复！</span>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="recoverSelectCancel">取消</el-button>
            <el-button type="primary" @click="recoverSelectSubmit">提交</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 回收站列表 -->
      <el-table ref="recoverRef" v-loading="recoverLoad" :data="recoverData" :height="height" @sort-change="recoverSort" @selection-change="recoverSelect">
        <el-table-column type="selection" width="42" title="全选/反选" />
        <el-table-column :prop="idkey" label="ID" min-width="80" sortable="custom" />
        <el-table-column prop="img_url" label="图片" min-width="70" align="center">
          <template slot-scope="scope">
            <el-image v-if="scope.row.img_url" class="ya-img-table" :src="scope.row.img_url" :preview-src-list="[scope.row.img_url]" title="点击查看大图" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="230" show-overflow-tooltip />
        <el-table-column prop="category_name" label="分类" min-width="100" show-overflow-tooltip />
        <el-table-column prop="hits" label="点击" min-width="80" />
        <el-table-column prop="is_top" label="置顶" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_top" size="medium">是</el-tag><el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_hot" label="热门" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_hot" size="medium">是</el-tag><el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_rec" label="推荐" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_rec" size="medium">是</el-tag><el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_hide" label="隐藏" min-width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_hide" size="medium">是</el-tag><el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="80" sortable="custom" />
        <el-table-column prop="create_time" label="添加时间" min-width="155" sortable="custom" />
        <el-table-column prop="delete_time" label="删除时间" min-width="155" sortable="custom" />
        <el-table-column label="操作" min-width="85" align="right" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="text" @click="recoverSelectOpen('reco',row)">恢复</el-button>
            <el-button size="mini" type="text" @click="recoverSelectOpen('dele',row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 回收站分页 -->
      <pagination v-show="recoverCount > 0" :total="recoverCount" :page.sync="recoverQuery.page" :limit.sync="recoverQuery.limit" @pagination="recoverList" />
    </el-dialog>
    <!-- 文件管理 -->
    <el-dialog :title="fileTitle" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage :file-type="fileType" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import permission from '@/directive/permission/index.js' // 权限判断指令
import Pagination from '@/components/Pagination'
import FileManage from '@/components/FileManage'
import RichEditor from '@/components/RichEditor'
import { arrayColumn } from '@/utils/index'
import { list, category, info, add, edit, dele, cate, istop, ishot, isrec, ishide, recover, recoverReco, recoverDele } from '@/api/cms/content'

export default {
  name: 'CmsContent',
  components: { Pagination, FileManage, RichEditor },
  directives: { permission },
  data() {
    return {
      name: '内容',
      height: 680,
      loading: false,
      idkey: 'content_id',
      query: {
        page: 1,
        limit: 12,
        search_field: 'name',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        content_id: '',
        category_id: '',
        name: '',
        title: '',
        keywords: '',
        description: '',
        url: '',
        imgs: [],
        files: [],
        videos: [],
        content: '',
        sort: 250
      },
      rules: {
        category_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      categoryData: [],
      categoryProps: { checkStrictly: true, value: 'category_id', label: 'category_name' },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      category_id: 0,
      is_top: 0,
      is_hot: 0,
      is_rec: 0,
      is_hide: 0,
      recoverDialog: false,
      recoverDialogTitle: '',
      recoverLoad: false,
      recoverData: [],
      recoverCount: 0,
      recoverQuery: {
        page: 1,
        limit: 12,
        search_field: 'name',
        date_field: 'delete_time'
      },
      recoverSelection: [],
      recoverSelectIds: '',
      recoverSelectTitle: '选中操作',
      recoverSelectDialog: false,
      recoverSelectType: '',
      fileDialog: false,
      fileTitle: '文件管理',
      fileType: 'image'
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
    this.category()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
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
      }).catch(() => {})
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          if (this.model[this.idkey]) {
            edit(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {})
          } else {
            add(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {})
          }
        }
      })
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
        if (this.model.category_id === 0) {
          this.model.category_id = ''
        }
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
      this.list()
      this.category()
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
        if (selectType === 'cate') {
          this.selectTitle = '设置分类'
        } else if (selectType === 'top') {
          this.selectTitle = '是否置顶'
        } else if (selectType === 'hot') {
          this.selectTitle = '是否热门'
        } else if (selectType === 'rec') {
          this.selectTitle = '是否推荐'
        } else if (selectType === 'hide') {
          this.selectTitle = '是否隐藏'
        } else if (selectType === 'dele') {
          this.selectTitle = '删除' + this.name
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
        if (selectType === 'cate') {
          this.setcate(this.selection)
        } else if (selectType === 'top') {
          this.istop(this.selection, true)
        } else if (selectType === 'hot') {
          this.ishot(this.selection, true)
        } else if (selectType === 'rec') {
          this.isrec(this.selection, true)
        } else if (selectType === 'hide') {
          this.ishide(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 设置分类
    setcate(row) {
      cate({
        ids: this.selectGetIds(row),
        category_id: this.category_id
      }).then(res => {
        this.list()
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
      })
    },
    // 是否置顶
    istop(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_top = row[0].is_top
        if (select) {
          is_top = this.is_top
        }
        istop({
          ids: this.selectGetIds(row),
          is_top: is_top
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 是否热门
    ishot(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_hot = row[0].is_hot
        if (select) {
          is_hot = this.is_hot
        }
        ishot({
          ids: this.selectGetIds(row),
          is_hot: is_hot
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 是否推荐
    isrec(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_rec = row[0].is_rec
        if (select) {
          is_rec = this.is_rec
        }
        isrec({
          ids: this.selectGetIds(row),
          is_rec: is_rec
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 是否隐藏
    ishide(row, select = false) {
      if (!row.length) {
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
    // 分类选择
    category() {
      category().then(res => {
        this.categoryData = res.data.list
      }).catch(() => {})
    },
    categoryChange(value) {
      if (value) {
        this.model.category_id = value[value.length - 1]
      }
    },
    categoryChangeQuery(value) {
      if (value) {
        this.query.category_id = value[value.length - 1]
      }
    },
    selectCategoryChange(value) {
      if (value) {
        this.category_id = value[value.length - 1]
      }
    },
    recoverCategoryChangeQuery(value) {
      if (value) {
        this.recoverQuery.category_id = value[value.length - 1]
      }
    },
    // 回收站
    recover() {
      this.recoverDialog = true
      this.recoverDialogTitle = this.name + '回收站'
      this.recoverList()
    },
    // 回收站查询
    recoverSearch() {
      this.recoverQuery.page = 1
      this.recoverList()
    },
    // 回收站刷新
    recoverRefresh() {
      this.recoverQuery = this.$options.data().recoverQuery
      this.recoverList()
    },
    // 回收站列表
    recoverList() {
      this.recoverLoad = true
      recover(this.recoverQuery).then(res => {
        this.recoverData = res.data.list
        this.recoverCount = res.data.count
        this.recoverLoad = false
      }).catch(() => {
        this.recoverLoad = false
      })
    },
    // 回收站排序
    recoverSort(sort) {
      this.recoverQuery.sort_field = sort.prop
      this.recoverQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.recoverQuery.sort_value = 'asc'
        this.recoverList()
      }
      if (sort.order === 'descending') {
        this.recoverQuery.sort_value = 'desc'
        this.recoverList()
      }
    },
    // 回收站选中操作
    recoverSelect(selection) {
      this.recoverSelection = selection
      this.recoverSelectIds = this.recoverSelectGetIds(selection).toString()
    },
    recoverSelectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    recoverSelectAlert() {
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
    },
    recoverSelectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['recoverRef'].clearSelection()
        this.$refs['recoverRef'].toggleRowSelection(selectRow)
      }
      if (!this.recoverSelection.length) {
        this.selectAlert()
      } else {
        this.recoverSelectTitle = '选中操作'
        if (selectType === 'reco') {
          this.recoverSelectTitle = '恢复' + this.name
        } else if (selectType === 'dele') {
          this.recoverSelectTitle = '删除' + this.name
        }
        this.recoverSelectDialog = true
        this.recoverSelectType = selectType
      }
    },
    recoverSelectCancel() {
      this.recoverSelectDialog = false
    },
    recoverSelectSubmit() {
      if (!this.recoverSelection.length) {
        this.selectAlert()
      } else {
        const recoverSelectType = this.recoverSelectType
        if (recoverSelectType === 'reco') {
          this.recoverReco(this.recoverSelection)
        } else if (recoverSelectType === 'dele') {
          this.recoverDele(this.recoverSelection)
        }
        this.recoverSelectDialog = false
      }
    },
    // 回收站恢复
    recoverReco(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        recoverReco({
          ids: this.recoverSelectGetIds(row)
        }).then(res => {
          this.list()
          this.recoverList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.recoverLoad = false
        })
      }
    },
    // 回收站删除
    recoverDele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        recoverDele({
          ids: this.recoverSelectGetIds(row)
        }).then(res => {
          this.recoverList()
          this.$message.success(res.msg)
        }).catch(() => {
          this.recoverLoad = false
        })
      }
    },
    // 上传图片、视频、附件
    fileUpload(fileType, fileTitle = '文件管理') {
      this.fileType = fileType
      this.fileTitle = fileTitle
      this.fileDialog = true
    },
    fileCancel() {
      this.fileDialog = false
    },
    fileSubmit(fileList, fileType) {
      this.fileDialog = false
      this.fileTitle = ''
      const fileLength = fileList.length
      if (fileLength) {
        for (let i = 0; i < fileLength; i++) {
          if (fileType === 'image') {
            this.model.imgs.push(fileList[i])
          } else if (fileType === 'video') {
            this.model.videos.push(fileList[i])
          } else {
            this.model.files.push(fileList[i])
          }
        }
      }
    },
    fileImgDele(index) {
      this.model.imgs.splice(index, 1)
    },
    fileVideoDele(index) {
      this.model.videos.splice(index, 1)
    },
    fileFileDele(index) {
      this.model.files.splice(index, 1)
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
