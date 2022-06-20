<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="file_name" label="文件名称" />
            <el-option value="file_md5" label="文件MD5" />
            <el-option value="file_hash" label="文件散列" />
            <el-option value="file_ext" label="文件扩展" />
            <el-option :value="idkey" label="文件ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
            <el-option v-if="recycle" value="delete_time" label="删除时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 选中操作 -->
    <el-row>
      <el-col>
        <el-checkbox v-model="selectAll" style="margin-right:10px;top:-2px" border :indeterminate="selectAllInd" @change="selectAllChange">全选</el-checkbox>
        <el-button title="修改分组" @click="selectOpen('editgroup')">分组</el-button>
        <el-button title="修改类型" @click="selectOpen('edittype')">类型</el-button>
        <el-button title="修改域名" @click="selectOpen('editdomain')">域名</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
        <el-button v-if="recycle" type="primary" @click="selectOpen('reco')">恢复</el-button>
        <el-upload
          v-else
          name="file"
          class="ya-upload"
          :limit="uploadLimit"
          :file-list="uploadFilelist"
          :multiple="true"
          :show-file-list="false"
          :auto-upload="true"
          :action="uploadAction"
          :headers="uploadHeaders"
          :data="uploadData"
          :before-upload="uploadBefore"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-change="uploadChange"
          :on-exceed="uploadExceed"
        >
          <el-button type="primary" title="上传文件" @click="uploadClear">上传</el-button>
        </el-upload>
        <el-select v-model="query.sort_field" class="filter-item ya-search-field ya-margin-left" filterable clearable placeholder="排序字段" @change="sort">
          <el-option value="file_name" label="文件名称" />
          <el-option value="file_md5" label="文件MD5" />
          <el-option value="file_hash" label="文件散列" />
          <el-option value="file_ext" label="文件扩展" />
          <el-option :value="idkey" label="文件ID" />
          <el-option value="create_time" label="添加时间" />
          <el-option value="update_time" label="修改时间" />
          <el-option v-if="recycle" value="delete_time" label="删除时间" />
        </el-select>
        <el-select v-model="query.sort_value" class="filter-item ya-search-field" filterable clearable placeholder="排序类型" @change="sort">
          <el-option value="asc" label="升序" />
          <el-option value="desc" label="降序" />
        </el-select>
        <el-select v-model="query.group_id" class="filter-item ya-search-field ya-margin-left" filterable clearable placeholder="分组" @change="groupSelect">
          <el-option v-for="(item, index) in group" :key="index" :value="item.group_id" :label="item.group_name" />
        </el-select>
        <el-button-group>
          <el-button type="text" icon="el-icon-plus" title="添加分组" @click="groupAdd()" />
          <el-button type="text" icon="el-icon-edit" title="修改分组" @click="groupEdit()" />
          <el-button type="text" icon="el-icon-delete" title="删除分组" @click="groupDele()" />
        </el-button-group>
      </el-col>
    </el-row>
    <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="120px">
        <el-form-item :label="name+'ID'" prop="">
          <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 2, maxRows: 12}" disabled />
        </el-form-item>
        <el-form-item v-if="selectType==='editgroup'" label="文件分组" prop="">
          <el-select v-model="group_id" placeholder="">
            <el-option v-for="(item, index) in group" :key="index" :value="item.group_id" :label="item.group_name" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType==='edittype'" label="文件类型" prop="file_type">
          <el-select v-model="file_type" placeholder="">
            <el-option v-for="(item, index) in filetype" :key="index" :value="index" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType==='editdomain'" label="文件域名" prop="">
          <el-input v-model="domain" placeholder="" clearable />
          <span class="ya-margin-left">修改文件域名会影响文件的访问，请确认无误后修改！</span>
        </el-form-item>
        <el-form-item v-else-if="selectType==='disable'" label="是否禁用" prop="">
          <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          <span v-if="is_disable" class="ya-margin-left" style="color:red">禁用会对已使用该文件的业务造成影响！</span>
        </el-form-item>
        <el-form-item v-else-if="selectType==='dele'" label="" prop="">
          <span v-if="recycle" class="ya-margin-left" style="color:red">确定要彻底删除选中的{{ name }}吗？删除后不可恢复！</span>
          <span v-else class="ya-margin-left" style="color:red">确定要删除选中的{{ name }}吗？删除会对已使用该文件的业务造成影响！</span>
        </el-form-item>
        <el-form-item v-else-if="selectType==='reco'" label="" prop="">
          <span class="ya-margin-left" style="color:red">确定要恢复选中的{{ name }}吗？</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectCancel">取消</el-button>
        <el-button type="primary" @click="selectSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 分组管理 -->
    <el-dialog :title="groupTitle" :visible.sync="groupDialog" :before-close="groupCancel" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="groupRef" :rules="groupRules" :model="groupModel" label-width="100px" class="dialog-body">
        <el-form-item label="名称" prop="group_name">
          <el-input v-model="groupModel.group_name" placeholder="请输入分组名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="group_desc">
          <el-input v-model="groupModel.group_desc" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="group_sort">
          <el-input v-model="groupModel.group_sort" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupCancel">取消</el-button>
        <el-button type="primary" @click="groupSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 列表 -->
    <el-row v-loading="loading" :gutter="3">
      <el-col :span="3" class="dialog-body" :style="{height:height+'px'}">
        <!-- 类型筛选 -->
        <el-row>
          <el-col><el-button type="text" class="ya-color-inherit">类型：</el-button></el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.file_type===''?'primary':''" :underline="false" class="ya-height-26" @click="typeSelect('')">全部</el-link>
          </el-col>
          <el-col v-for="(item, index) in filetype" :key="index" class="ya-padding-left">
            <el-link :type="query.file_type===index?'primary':''" :underline="false" class="ya-height-26" @click="typeSelect(index)">{{ item }}</el-link>
          </el-col>
        </el-row>
        <!-- 禁用筛选 -->
        <el-row>
          <el-col><el-button type="text" class="ya-color-inherit">禁用：</el-button></el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_disable===''?'primary':''" :underline="false" class="ya-height-26" @click="disableSelect('')">全部</el-link>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_disable===0?'primary':''" :underline="false" class="ya-height-26" @click="disableSelect(0)">已启用</el-link>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_disable===1?'primary':''" :underline="false" class="ya-height-26" @click="disableSelect(1)">已禁用</el-link>
          </el-col>
        </el-row>
        <!-- 上传筛选 -->
        <el-row>
          <el-col><el-button type="text" class="ya-color-inherit">上传：</el-button></el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_front===''?'primary':''" :underline="false" class="ya-height-26" @click="frontSelect('')">全部</el-link>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_front===0?'primary':''" :underline="false" class="ya-height-26" @click="frontSelect(0)">后台</el-link>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_front===1?'primary':''" :underline="false" class="ya-height-26" @click="frontSelect(1)">前台</el-link>
          </el-col>
        </el-row>
        <!-- 存储筛选 -->
        <el-row>
          <el-col><el-button type="text" class="ya-color-inherit">存储：</el-button></el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.storage===''?'primary':''" :underline="false" class="ya-height-26" @click="storageSelect('')">全部</el-link>
          </el-col>
          <el-col v-for="(item, index) in storage" :key="index" class="ya-padding-left">
            <el-link :type="query.storage===index?'primary':''" :underline="false" class="ya-height-26" @click="storageSelect(index)">{{ item }}</el-link>
          </el-col>
        </el-row>
      </el-col>
      <!-- 列表 -->
      <el-col v-if="count > 0" :span="21" class="dialog-body" :style="{height:height+'px'}">
        <el-row :gutter="3">
          <el-checkbox-group v-model="selection" @change="select">
            <el-col v-for="(item, index) in data" :key="index" :span="4" style="margin-bottom:6px;text-align:center">
              <el-card class="ya-file-card" :body-style="{minWidth:'16.5%', height:(height-height*0.1)/3+'px', minHeight:'126px', padding:'0 6px'}">
                <div class="ya-file-ext">
                  <span>{{ item.file_ext }}</span>
                </div>
                <div style="text-align:left">
                  <el-checkbox :key="item[idkey]" :label="item[idkey]" />
                </div>
                <div :style="{width:'100%', height:((height-height*0.1)/3)-((height-height*0.1)/3*0.5)+'px', minHeight:'62px'}">
                  <el-image v-if="item.file_type==='image'" fit="contain" :src="item.file_url" :preview-src-list="fileImgPre" title="点击查看大图" style="height:100%" />
                  <video v-else-if="item.file_type==='video'" width="100%" height="100%" controls>
                    <source :src="item.file_url" type="video/mp4">
                    <object :data="item.file_url" width="100%" height="100%">
                      <embed :src="item.file_url" width="100%" height="100%">
                    </object>
                  </video>
                  <audio v-else-if="item.file_type==='audio'" width="100%" height="100%" controls>
                    <source :src="item.file_url" type="audio/mp3">
                    <embed :src="item.file_url" width="100%" height="100%">
                  </audio>
                  <el-image v-else-if="item.file_type==='word'" :src="item.file_url" class="ya-file-img">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-document ya-file-icon" />
                    </div>
                  </el-image>
                  <div v-else class="image-slot">
                    <i class="el-icon-folder ya-file-icon" />
                  </div>
                </div>
                <div :style="{paddingTop:'5px', minHeight:'50px'}">
                  <span class="ya-file-name" :title="item.file_name+'.'+item.file_ext">{{ item.file_name }}.{{ item.file_ext }}</span>
                  <div class="bottom clearfix">
                    <el-button v-if="item.is_disable" size="medium" type="text" icon="el-icon-warning" title="已禁用,点击修改" @click="selectOpen('disable',[item.file_id])" />
                    <el-button v-else size="medium" type="text" icon="el-icon-warning-outline" title="已启用,点击修改" @click="selectOpen('disable',[item.file_id])" />
                    <el-button type="text" icon="el-icon-copy-document" title="复制文件名" @click="copy(item.file_name, $event)" />
                    <el-link type="primary" icon="el-icon-download" title="下载文件" style="margin:-8px 10px 0 10px" :href="item.file_url" :underline="false" :download="item.file_url" target="_blank" />
                    <el-button size="mini" type="text" title="详情/修改" @click="edit(item)">修改</el-button>
                    <el-button size="mini" type="text" title="删除文件" @click="selectOpen('dele',[item.file_id])">删除</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-checkbox-group>
        </el-row>
      </el-col>
      <el-col v-else :span="21">
        <el-empty :description="'暂无'+name" />
      </el-col>
    </el-row>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="文件名称" prop="file_name">
          <el-input v-model="model.file_name" placeholder="" :title="model.file_name" clearable>
            <el-button slot="append" icon="el-icon-copy-document" title="复制文件名" style="margin-right:3px" @click="copy(model.file_name, $event)" />
            <el-link slot="append" icon="el-icon-download" title="下载文件" :href="model.file_url" :underline="false" :download="model.file_url" target="_blank" />
          </el-input>
        </el-form-item>
        <el-form-item label="文件分组" prop="group_id">
          <el-select v-model="model.group_id" placeholder="未分组" clearable>
            <el-option v-for="(item, index) in group" :key="index" :value="item.group_id" :label="item.group_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件类型" prop="file_type">
          <el-select v-model="model.file_type" placeholder="">
            <el-option v-for="(item, index) in filetype" :key="index" :value="index" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件排序" prop="sort">
          <el-input v-model="model.sort" type="number" placeholder="250" />
        </el-form-item>
        <el-form-item label="文件域名" prop="domain">
          <el-input v-model="model.domain" placeholder="" clearable>
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.domain, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="文件路径" prop="file_path">
          <el-input v-model="model.file_path" placeholder="" :title="model.file_path" disabled>
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.file_path, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="文件链接" prop="file_url">
          <el-input v-model="model.file_url" placeholder="" :title="model.file_url" disabled>
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.file_url, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="存储方式" prop="storage">
          <el-select v-model="model.storage" placeholder="" disabled>
            <el-option v-for="(item, index) in storage" :key="index" :value="index" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用" prop="is_disable">
          <el-switch v-model="model.is_disable" :active-value="1" :inactive-value="0" disabled />
        </el-form-item>
        <el-form-item label="文件大小" prop="file_size">
          <el-input v-model="model.file_size" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="文件后缀" prop="file_ext">
          <el-input v-model="model.file_ext" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="文件MD5" prop="file_md5">
          <el-input v-model="model.file_md5" placeholder="" disabled>
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.file_md5, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="文件散列" prop="file_hash">
          <el-input v-model="model.file_hash" placeholder="" disabled>
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.file_hash, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="model.file_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.file_id" label="修改时间" prop="update_time">
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
    <!-- 文件管理操作 -->
    <el-row v-show="fileType">
      <el-col style="text-align:right;margin-top:20px">
        <el-button @click="fileCancel()">取消</el-button>
        <el-button type="primary" @click="fileSubmit(selection)">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import clip from '@/utils/clipboard'
import { getAdminToken } from '@/utils/auth'
import { list, info, add, edit, dele, editgroup, edittype, editdomain, disable, recover, recoverReco, recoverDele } from '@/api/file/file'
import { info as groupInfo, add as groupAdd, edit as groupEdit, dele as groupDele } from '@/api/file/group'

export default {
  name: 'FileManage',
  components: { Pagination },
  directives: { },
  props: {
    isRecycle: { type: Number, default: 0 },
    fileType: { type: String, default: '' }
  },
  data() {
    return {
      name: '文件',
      recycle: 0, // 是否回收站
      height: 680,
      loading: false,
      idkey: 'file_id',
      query: {
        page: 1,
        limit: 18,
        group_id: '',
        storage: '',
        file_type: '',
        is_front: 0,
        is_disable: '',
        search_field: 'file_name',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        file_id: '',
        group_id: 0,
        storage: 'local',
        domain: '',
        file_md5: '',
        file_hash: '',
        file_name: '',
        file_type: '',
        file_path: '',
        file_size: '',
        file_ext: '',
        file_url: '',
        sort: 250,
        is_front: 0,
        is_disable: 0,
        is_delete: 0
      },
      rules: {
        file_name: [{ required: true, message: '请输入文件名称', trigger: 'blur' }]
      },
      group: [],
      storage: [],
      fileIds: [],
      filetype: [],
      fileImgPre: [],
      selectAll: false,
      selectAllInd: false,
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      group_id: 0,
      file_type: 'image',
      domain: '',
      is_disable: 0,
      uploadAction: add(),
      uploadHeaders: {},
      uploadData: {},
      uploadLimit: 9,
      uploadFilelist: [],
      groupDialog: false,
      groupTitle: '',
      groupModel: {
        group_id: '',
        group_name: '',
        group_desc: '',
        group_sort: 250
      },
      groupRules: {
        group_name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'isRecycle': function(value) {
      this.recycle = value
      this.list()
    },
    'fileType': function(value) {
      this.recycle = this.isRecycle
      this.query.file_type = value
      this.list()
    }
  },
  created() {
    this.height = screenHeight()
    this.recycle = this.isRecycle
    if (this.fileType) {
      this.query.is_disable = 0
      this.query.file_type = this.fileType
      this.height = this.height - 100
    }
    this.list()
    const tokenType = process.env.VUE_APP_TOKEN_TYPE || 'header'
    const tokenName = process.env.VUE_APP_TOKEN_NAME || 'AdminToken'
    const tokenValue = getAdminToken()
    if (tokenType === 'header') {
      const uploadHeaders = {}
      uploadHeaders[tokenName] = tokenValue
      this.uploadHeaders = uploadHeaders
    } else {
      const uploadData = { group_id: 0 }
      uploadData[tokenName] = tokenValue
      this.uploadData = uploadData
    }
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      if (this.recycle) {
        recover(this.query).then(res => {
          this.data = res.data.list
          this.count = res.data.count
          this.filetype = res.data.filetype
          this.storage = res.data.storage
          this.fileIds = res.data.ids
          this.loading = false
          this.groupList(res.data.group)
          this.imagePreview(res.data.list)
        }).catch(() => {
          this.loading = false
        })
      } else {
        list(this.query).then(res => {
          this.data = res.data.list
          this.count = res.data.count
          this.filetype = res.data.filetype
          this.storage = res.data.storage
          this.fileIds = res.data.ids
          this.loading = false
          this.groupList(res.data.group)
          this.imagePreview(res.data.list)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 上传
    uploadBefore() {
      this.loading = true
    },
    uploadSuccess(res) {
      if (res.code === 200) {
        this.query = this.$options.data().query
        this.list()
        this.$message.success(res.msg)
      } else {
        this.loading = false
        this.$message.error(res.msg)
      }
    },
    uploadError(res) {
      this.loading = false
      this.$message.error(res.msg || '上传出错')
    },
    uploadChange() {
    },
    uploadExceed() {
      this.$message.error(`每次最多只能选择 ${this.uploadLimit} 个文件`)
    },
    uploadClear() {
      this.uploadFilelist = []
    },
    // 修改
    edit(row) {
      this.dialog = true
      this.loading = true
      this.dialogTitle = this.name + '修改：' + row.file_id
      info({
        file_id: row.file_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.file_id) {
            edit(this.model).then(res => {
              this.list()
              this.reset()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.reset()
      this.list()
    },
    // 排序
    sort() {
      if (this.query.sort_value && this.query.sort_value) {
        this.list()
      }
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      this.selection = []
      this.selectIds = ''
      this.selectAll = false
      this.selectAllInd = false
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
      }
    },
    // 选中操作
    select(selection) {
      const selectCount = selection.length
      this.selection = selection
      this.selectIds = this.selectGetIds().toString()
      this.selectAll = selectCount === this.fileIds.length
      this.selectAllInd = selectCount > 0 && selectCount < this.fileIds.length
    },
    selectAllChange(value) {
      this.selection = value ? this.fileIds : []
      this.selectIds = this.selectGetIds().toString()
      this.selectAllInd = false
    },
    selectGetIds() {
      return this.selection
    },
    selectAlert() {
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
    },
    selectOpen(selectType, selection = '') {
      if (selection) {
        this.select(selection)
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '选中操作'
        if (selectType === 'editgroup') {
          this.selectTitle = '修改分组'
        } else if (selectType === 'edittype') {
          this.selectTitle = '修改类型'
        } else if (selectType === 'editdomain') {
          this.selectTitle = '修改域名'
        } else if (selectType === 'disable') {
          this.selectTitle = '是否禁用'
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
        if (selectType === 'editgroup') {
          this.editgroup()
        } else if (selectType === 'edittype') {
          this.edittype()
        } else if (selectType === 'editdomain') {
          this.editdomain()
        } else if (selectType === 'disable') {
          this.disable()
        } else if (selectType === 'dele') {
          this.dele()
        } else if (selectType === 'reco') {
          this.reco()
        }
        this.selectDialog = false
      }
    },
    // 修改分组
    editgroup() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editgroup({
          ids: this.selectGetIds(),
          group_id: this.group_id
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改类型
    edittype() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        edittype({
          ids: this.selectGetIds(),
          file_type: this.file_type
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 修改域名
    editdomain() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editdomain({
          ids: this.selectGetIds(),
          domain: this.domain
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 是否禁用
    disable() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        disable({
          ids: this.selectGetIds(),
          is_disable: this.is_disable
        }).then(res => {
          this.list()
          this.reset()
          this.disableDialog = false
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    // 删除
    dele() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        if (this.recycle) {
          recoverDele({
            ids: this.selectGetIds()
          }).then(res => {
            this.list()
            this.reset()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        } else {
          dele({
            ids: this.selectGetIds()
          }).then(res => {
            this.list()
            this.reset()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }
      }
    },
    // 恢复
    reco() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        recoverReco({
          ids: this.selectGetIds()
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 图片预览
    imagePreview(list) {
      var preview = []
      const length = list.length
      for (let index = 0; index < length; index++) {
        if (list[index]['file_type'] === 'image') {
          preview.push(list[index]['file_url'])
        }
      }
      this.fileImgPre = preview
    },
    // 分组筛选
    groupSelect() {
      this.uploadData.group_id = this.query.group_id
      this.list()
    },
    // 类型筛选
    typeSelect(file_type = '') {
      this.query.file_type = file_type
      this.list()
    },
    // 禁用筛选
    disableSelect(is_disable = '') {
      this.query.is_disable = is_disable
      this.list()
    },
    // 上传筛选
    frontSelect(is_front = '') {
      this.query.is_front = is_front
      this.list()
    },
    // 存储筛选
    storageSelect(storage = '') {
      this.query.storage = storage
      this.list()
    },
    // 分组管理
    groupList(group) {
      if (group) {
        this.group = group
      } else {
        this.list()
      }
      this.group.unshift({ group_id: 0, group_name: '(未分组)' })
    },
    groupAdd() {
      this.groupDialog = true
      this.groupTitle = '分组添加'
      this.groupReset()
    },
    groupEdit() {
      const group_id = this.query.group_id
      if (!group_id) {
        this.$alert('请选择需要修改的分组', '提示', { type: 'warning', callback: action => {} })
      } else {
        this.groupDialog = true
        this.groupTitle = '分组修改：' + this.query.group_id
        groupInfo({
          group_id: this.query.group_id
        }).then(res => {
          this.groupReset(res.data)
        }).catch(res => {
          this.groupDialog = false
        })
      }
    },
    groupCancel() {
      this.groupDialog = false
      this.groupReset()
    },
    groupSubmit() {
      this.$refs['groupRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.groupModel.group_id) {
            groupEdit(this.groupModel).then(res => {
              this.groupList()
              this.groupReset()
              this.groupDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            groupAdd(this.groupModel).then(res => {
              this.groupList()
              this.groupReset()
              this.groupDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    groupDele() {
      const group_id = this.query.group_id
      if (!group_id) {
        this.$alert('请选择需要删除的分组', '提示', { type: 'warning', callback: action => {} })
      } else {
        const group = this.group
        const grouplen = group.length
        const title = '删除分组：' + group_id
        let group_name = ''
        for (let i = 0; i < grouplen; i++) {
          if (group[i].group_id === group_id) {
            group_name = group[i].group_name
            break
          }
        }
        const message = '确定要删除分组 <span style="color:red">' + group_name + ' </span>吗？'
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          groupDele({
            ids: [group_id]
          }).then(res => {
            this.groupList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    groupReset(row) {
      if (row) {
        this.groupModel = row
      } else {
        this.groupModel = this.$options.data().groupModel
      }
    },
    // 文件管理操作
    fileCancel() {
      this.reset()
      this.$emit('fileCancel')
    },
    fileSubmit(row) {
      if (!row.length) {
        this.$alert('请选择文件')
      } else {
        const files = []
        const data = this.data
        const data_len = data.length
        const row_len = row.length
        for (let i = 0; i < data_len; i++) {
          for (let j = 0; j < row_len; j++) {
            if (data[i].file_id === row[j]) {
              files.push(data[i])
              break
            }
          }
        }
        this.reset()
        this.$emit('fileSubmit', files, this.fileType)
      }
    },
    // 复制
    copy(text, event) {
      clip(text, event)
    }
  }
}
</script>

<style scoped>
.ya-height-26{
  height: 26px;
}
.ya-margin-left{
  margin-left: 10px;
}
.ya-padding-left{
  padding-left: 10px;
}
.ya-color-inherit{
  color: inherit;
  padding: 10px 20px 0 0;
}
.ya-upload{
 display: inline-block;
 margin-left: 10px;
}
.ya-file-card{
  position: relative;
  overflow: hidden;
  background: #fff;
}
.ya-file-name{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  padding-right: 0;
  font-size: 14px;
}
.ya-file-icon{
  font-size: 50px;
}
.ya-file-img{
  width:100%;
  height:100%;
}
.ya-file-image{
  max-width:100%;
  max-height:100%;
}
.ya-file-ext{
  position: absolute;
  width: 100px;
  height: 100px;
  top: -66px;
  right: -66px;
  transform: rotate(45deg);
  z-index: 1000;
}
.ya-file-ext span{
  display: block;
  position: absolute;
  width: 100px;
  bottom: 0;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background: #C0C4CC;
}
</style>
