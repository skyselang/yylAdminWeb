<template>
  <div class="app-container">
    <!-- 查询 -->
    <Search :name="name" :idkey="idkey" :basedata="basedata" @search="search" @reset="reset" />
    <!-- 操作 -->
    <Operate
      :name="name"
      :idkey="idkey"
      :ids="ids"
      :basedata="basedata"
      :query="query"
      @list="list"
      @add="add"
      @edit="edit"
      @load="load"
    />
    <!-- 列表 -->
    <el-row class="mt-2">
      <!-- 筛选 -->
      <el-col :span="3">
        <el-scrollbar :height="height">
          <el-row>
            <el-col>
              <el-text size="default">{{ $t('类型：') }}</el-text>
            </el-col>
            <el-col v-for="v in basedata.file_types" :key="v.value" class="pl-2">
              <el-link
                :type="query.file_type === v.value ? 'primary' : 'default'"
                underline="never"
                @click="typeSelect(v.value)"
              >
                {{ v.label }}
              </el-link>
            </el-col>
            <el-col>
              <el-text size="default">{{ $t('禁用：') }}</el-text>
            </el-col>
            <el-col v-for="v in basedata.disables" :key="v.value" class="pl-2">
              <el-link
                :type="query.is_disable === v.value ? 'primary' : 'default'"
                underline="never"
                @click="disableSelect(v.value)"
              >
                {{ v.label }}
              </el-link>
            </el-col>
            <el-col>
              <el-text size="default">{{ $t('上传：') }}</el-text>
            </el-col>
            <el-col v-for="v in basedata.is_fronts" :key="v.value" class="pl-2">
              <el-link
                :type="query.is_front === v.value ? 'primary' : 'default'"
                underline="never"
                @click="frontSelect(v.value)"
              >
                {{ v.label }}
              </el-link>
            </el-col>
            <el-col>
              <el-text size="default">{{ $t('存储：') }}</el-text>
            </el-col>
            <el-col v-for="v in basedata.storages" :key="v.value" class="pl-2">
              <el-link
                :type="query.storage === v.value ? 'primary' : 'default'"
                underline="never"
                @click="storageSelect(v.value)"
              >
                {{ v.label }}
              </el-link>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-col>
      <!-- 表格 -->
      <el-col v-if="query.table" :span="21">
        <el-table
          ref="table"
          v-loading="loading"
          :data="data"
          :height="height"
          show-overflow-tooltip
          @sort-change="sort"
          @selection-change="select"
        >
          <el-table-column type="selection" width="42" :title="$t('全选/反选')" />
          <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
          <el-table-column prop="unique" :label="$t('编号')" min-width="80" />
          <el-table-column prop="file_url" :label="$t('文件')" min-width="80">
            <template #default="{ row }">
              <FilePreview :file="row" lazy :preview-src-list="fileImgPre" />
            </template>
          </el-table-column>
          <el-table-column prop="file_type_name" :label="$t('类型')" min-width="55" column-key="file_type" />
          <el-table-column prop="file_name" :label="$t('名称')" min-width="110" sortable="custom" />
          <el-table-column prop="file_ext" :label="$t('后缀')" min-width="80" sortable="custom" />
          <el-table-column
            prop="file_size_name"
            :label="$t('大小')"
            min-width="90"
            sortable="custom"
            column-key="file_size"
          />
          <el-table-column prop="group_name" :label="$t('分组')" min-width="110" />
          <el-table-column prop="tag_names" :label="$t('标签')" min-width="110" />
          <el-table-column
            prop="is_disable_name"
            :label="$t('禁用')"
            min-width="80"
            sortable="custom"
            column-key="is_disable"
          />
          <el-table-column prop="sort" :label="$t('排序')" min-width="80" sortable="custom" />
          <el-table-column prop="create_time" :label="$t('添加时间')" width="162" sortable="custom" />
          <el-table-column
            v-if="query.recycle"
            prop="delete_time"
            :label="$t('删除时间')"
            width="162"
            sortable="custom"
          />
          <el-table-column v-else prop="update_time" :label="$t('修改时间')" width="162" sortable="custom" />
          <el-table-column :label="$t('操作')" width="110">
            <template #default="{ row }">
              <ElLinkOperate v-if="hasPerm([permEdit])" :text="$t('修改')" @click="edit(row)" />
              <ElLinkOperate v-else-if="hasPerm([permInfo])" :text="$t('信息')" @click="edit(row)" />
              <ElLinkOperate v-if="hasPerm([permDele])" :text="$t('删除')" @click="dele(row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <!-- 卡片 -->
      <el-col v-else v-loading="loading" :span="21">
        <el-scrollbar :height="height">
          <el-row class="mb-2">
            <el-col :span="2" class="pl-2">
              <el-checkbox v-model="selectAll" :indeterminate="selectAllInd" @change="selectCardAll">
                {{ $t('全选') }}
              </el-checkbox>
            </el-col>
            <el-col :span="3">
              <el-select v-model="query.group_ids" filterable clearable :placeholder="$t('分组')" @change="groupSelect">
                <el-option v-for="v in basedata.groups" :key="v.group_id" :value="v.group_id" :label="v.group_name" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button-group>
                <el-button v-if="hasPerm(['admin/file.Group/add'])" :title="$t('添加分组')" @click="groupAdd()">
                  <Icons icon="Plus" />
                </el-button>
                <el-button v-if="hasPerm(['admin/file.Group/edit'])" :title="$t('修改分组')" @click="groupEdit()">
                  <Icons icon="Edit" />
                </el-button>
                <el-button v-if="hasPerm(['admin/file.Group/dele'])" :title="$t('删除分组')" @click="groupDele()">
                  <Icons icon="Delete" />
                </el-button>
              </el-button-group>
            </el-col>
            <el-col :span="3">
              <el-select
                v-model="query.tag_ids"
                filterable
                clearable
                multiple
                collapse-tags
                :placeholder="$t('标签')"
                @change="tagSelect"
              >
                <el-option v-for="v in basedata.tags" :key="v.tag_id" :value="v.tag_id" :label="v.tag_name" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button-group>
                <el-button v-if="hasPerm(['admin/file.Tag/add'])" :title="$t('添加标签')" @click="tagAdd()">
                  <Icons icon="Plus" />
                </el-button>
                <el-button v-if="hasPerm(['admin/file.Tag/edit'])" :title="$t('修改标签')" @click="tagEdit()">
                  <Icons icon="Edit" />
                </el-button>
                <el-button v-if="hasPerm(['admin/file.Tag/dele'])" :title="$t('删除标签')" @click="tagDele()">
                  <Icons icon="Delete" />
                </el-button>
              </el-button-group>
            </el-col>
            <el-col :span="3">
              <el-select v-model="query.sort_field" filterable clearable :placeholder="$t('排序字段')" @change="sort">
                <el-option :value="idkey" label="ID" />
                <el-option value="file_name" :label="$t('名称')" />
                <el-option value="file_md5" label="MD5" />
                <el-option value="file_hash" :label="$t('散列')" />
                <el-option value="file_ext" :label="$t('后缀')" />
                <el-option value="file_size" :label="$t('大小')" />
                <el-option value="is_disable" :label="$t('禁用')" />
                <el-option value="sort" :label="$t('排序')" />
                <el-option value="create_time" :label="$t('添加时间')" />
                <el-option value="update_time" :label="$t('修改时间')" />
                <el-option v-if="query.recycle" value="delete_time" :label="$t('删除时间')" />
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-select v-model="query.sort_value" filterable clearable :placeholder="$t('排序类型')" @change="sort">
                <el-option value="asc" :label="$t('升序')" />
                <el-option value="desc" :label="$t('降序')" />
              </el-select>
            </el-col>
          </el-row>
          <el-row :gutter="3" class="!ml-0 !mr-0">
            <el-col v-for="(v, i) in data" :key="v.file_id" :span="4" class="mb-1 text-center">
              <el-card
                :body-style="{
                  minWidth: '16%',
                  height: (height - height * 0.2) / 3 + 'px',
                  minHeight: '180px',
                  padding: '0 6px'
                }"
                shadow="never"
              >
                <el-row>
                  <el-col class="text-left">
                    <el-checkbox :key="v.file_id" v-model="idsed[i]" @change="selectCardOne($event, i)">
                      <el-text size="default" truncated>{{ v.file_id }} ({{ v.file_size }}, {{ v.file_ext }}</el-text>
                    </el-checkbox>
                  </el-col>
                </el-row>
                <div :style="{ width: '100%', height: '40%', minHeight: '62px' }">
                  <el-image
                    v-if="v.file_type === 'image'"
                    :src="v.file_url"
                    :preview-src-list="fileImgPre"
                    :initial-index="imagePreIndex(v.file_url)"
                    :title="$t('点击看大图')"
                    lazy
                    class="h-full"
                    fit="contain"
                  />
                  <video v-else-if="v.file_type === 'video'" height="100%" controls>
                    <source :src="v.file_url" type="video/mp4" />
                    <object :data="v.file_url" height="100%">
                      <embed :src="v.file_url" height="100%" />
                    </object>
                  </video>
                  <audio v-else-if="v.file_type === 'audio'" height="100%" controls style="width: 100%">
                    <source :src="v.file_url" type="audio/mp3" />
                    <embed :src="v.file_url" height="100%" />
                  </audio>
                  <div v-else-if="v.file_type === 'word'">
                    <Icons icon="Document" size="50" />
                  </div>
                  <div v-else>
                    <Icons icon="Folder" size="50" />
                  </div>
                </div>
                <div :style="{ paddingTop: '5px', minHeight: '50px' }">
                  <div>
                    <el-text size="default" :title="v.file_name + '.' + v.file_ext" truncated>
                      {{ v.file_name }}.{{ v.file_ext }}
                    </el-text>
                  </div>
                  <div>
                    <el-link v-if="v.is_disable" class="mr-1" underline="never" :title="$t('已禁用')">
                      <Icons icon="WarningFilled" />
                    </el-link>
                    <el-link v-else class="mr-2" underline="never" :title="$t('未禁用')">
                      <Icons icon="Warning" />
                    </el-link>
                    <el-link v-if="hasPerm([permEdit])" type="primary" underline="never" class="mr-2" @click="edit(v)">
                      {{ $t('修改') }}
                    </el-link>
                    <el-link
                      v-else-if="hasPerm([permInfo])"
                      type="primary"
                      underline="never"
                      class="mr-2"
                      @click="edit(v)"
                    >
                      {{ $t('信息') }}
                    </el-link>
                    <el-link v-if="hasPerm([permDele])" type="primary" underline="never" class="mr-2" @click="dele(v)">
                      {{ $t('删除') }}
                    </el-link>
                    <el-link v-if="hasPerm([permInfo])" type="primary" underline="never" @click="down(v)">
                      {{ $t('下载') }}
                    </el-link>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row class="mt-5 ml-3">
      <el-col :span="3">
        <el-checkbox v-model="addEditDialog" class="pr-6" :title="$t('添加修改时是弹窗还是新标签页')">
          <el-text size="default">{{ $t('弹窗') }}</el-text>
        </el-checkbox>
      </el-col>
      <el-col :span="21">
        <Pagination v-model:total="count" v-model:page="query.page" v-model:limit="query.limit" @pagination="list" />
      </el-col>
    </el-row>
    <!-- 文件操作 -->
    <el-row v-show="fileType">
      <el-col class="text-center mt-2">
        <el-button @click="fileCancel()">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="fileSubmit()">{{ $t('确定') }}</el-button>
      </el-col>
    </el-row>
    <!-- 添加修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      destroy-on-close
      append-to-body
      draggable
      center
      align-center
    >
      <AddEdit :id="id" dialog @close="close" />
    </el-dialog>
    <!-- 分组管理 -->
    <el-dialog
      v-model="groupDialog"
      :title="groupTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="groupCancel"
      append-to-body
      draggable
      center
      align-center
    >
      <el-form ref="groupRef" :rules="groupRules" :model="groupModel" label-width="120px">
        <el-form-item :label="$t('编号')" prop="group_unique">
          <el-input v-model="groupModel.group_unique" clearable />
        </el-form-item>
        <el-form-item :label="$t('名称')" prop="group_name">
          <el-input v-model="groupModel.group_name" :placeholder="$t('请输入分组名称')" clearable />
        </el-form-item>
        <el-form-item :label="$t('描述')" prop="desc">
          <el-input v-model="groupModel.desc" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="remark">
          <el-input v-model="groupModel.remark" clearable />
        </el-form-item>
        <el-form-item :label="$t('排序')" prop="sort">
          <el-input v-model="groupModel.sort" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupCancel">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="groupSubmit">{{ $t('提交') }}</el-button>
      </template>
    </el-dialog>
    <!-- 标签管理 -->
    <el-dialog
      v-model="tagDialog"
      :title="tagTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="tagCancel"
      append-to-body
      draggable
      center
      align-center
    >
      <el-form ref="tagRef" :rules="tagRules" :model="tagModel" label-width="120px">
        <el-form-item :label="$t('编号')" prop="tag_unique">
          <el-input v-model="tagModel.tag_unique" clearable />
        </el-form-item>
        <el-form-item :label="$t('名称')" prop="tag_name">
          <el-input v-model="tagModel.tag_name" :placeholder="$t('请输入标签名称')" clearable />
        </el-form-item>
        <el-form-item :label="$t('描述')" prop="desc">
          <el-input v-model="tagModel.desc" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="remark">
          <el-input v-model="tagModel.remark" clearable />
        </el-form-item>
        <el-form-item :label="$t('排序')" prop="sort">
          <el-input v-model="tagModel.sort" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="tagCancel">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="tagSubmit">{{ $t('提交') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Search from './component/Search.vue'
import Operate from './component/Operate.vue'
import AddEdit from './component/AddEdit.vue'
import { hasPerm, screenHeight, arrayColumn, getAddEditDialog, clipboard } from '@/utils/index'
import { listApi, infoApi, deleApi, recycleListApi, recycleDeleApi } from '@/api/file/file'
import { infoApi as groupInfo, addApi as groupAdd, editApi as groupEdit, deleApi as groupDele } from '@/api/file/group'
import { infoApi as tagInfo, addApi as tagAdd, editApi as tagEdit, deleApi as tagDele } from '@/api/file/tag'

export default {
  name: 'FileList',
  components: { Search, Operate, AddEdit },
  props: {
    fileType: { type: String, default: '' }
  },
  data() {
    return {
      name: '',
      height: 700,
      loading: false,
      idkey: 'file_id',
      query: {},
      data: [],
      count: 0,
      dataIds: [],
      fileImgPre: [],
      selectAll: false,
      ids: [],
      idsed: [],
      addEditDialog: getAddEditDialog(),
      id: '',
      type: 'edit',
      dialog: false,
      dialogTitle: '',
      basedata: {
        exps: [],
        add_types: [],
        file_types: [],
        groups: [],
        tags: [],
        disables: [],
        is_fronts: [],
        storages: [],
        settings: []
      },
      permInfo: 'admin/file.File/info',
      permEdit: 'admin/file.File/edit',
      permDele: 'admin/file.File/dele',
      routeInfo: 'FileInfo',
      routeAdd: 'FileAdd',
      routeEdit: 'FileEdit',
      groupPk: 'group_id',
      groupName: '',
      groupData: [],
      groupDialog: false,
      groupTitle: '',
      groupModel: {
        group_id: '',
        group_unique: '',
        group_name: '',
        desc: '',
        remark: '',
        sort: 250
      },
      groupRules: {},
      tagPk: 'tag_id',
      tagName: '',
      tagData: [],
      tagDialog: false,
      tagTitle: '',
      tagModel: {
        tag_id: '',
        tag_unique: '',
        tag_name: '',
        desc: '',
        remark: '',
        sort: 250
      },
      tagRules: {}
    }
  },
  computed: {
    selectAllInd() {
      const ids_length = this.ids.length
      const data_length = this.data.length
      return ids_length > 0 && ids_length < data_length
    }
  },
  watch: {
    fileType(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.query.file_type = newVal
        this.list()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('文件')
      this.height = screenHeight()
      this.type = hasPerm([this.permEdit]) ? 'edit' : 'info'
      this.basedata.exps = [{ exp: 'like', name: this.$t('包含') }]
      this.basedata.disables = [
        { value: '', label: this.$t('全部') },
        { value: 0, label: this.$t('未禁用') },
        { value: 1, label: this.$t('已禁用') }
      ]
      this.basedata.is_fronts = [
        { value: '', label: this.$t('全部') },
        { value: 1, label: this.$t('前台') },
        { value: 0, label: this.$t('后台') }
      ]
      this.groupName = this.$t('分组')
      this.groupRules = { group_name: [{ required: true, message: this.$t('请输入分组名称'), trigger: 'blur' }] }
      this.tagName = this.$t('标签')
      this.tagRules = { tag_name: [{ required: true, message: this.$t('请输入标签名称'), trigger: 'blur' }] }
      if (this.fileType) {
        this.height = this.height - 100
      }
    },
    // 列表
    list() {
      this.loading = true
      let api = listApi
      if (this.query.recycle) {
        api = recycleListApi
      }
      if (this.fileType && this.query.file_type == '') {
        this.query.file_type = this.fileType
        if (this.fileType == 'all') {
          this.query.file_type = ''
        }
      }
      api(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.loading = false
          this.basedata.exps = res.data.basedata.exps
          this.basedata.settings = res.data.basedata.settings
          this.basedata.storages = res.data.basedata.storages
          this.basedata.file_types = res.data.basedata.file_types
          this.basedata.add_types = res.data.basedata.add_types
          this.basedata.groups = res.data.basedata.groups
          this.basedata.tags = res.data.basedata.tags
          const all = { value: '', label: this.$t('全部') }
          this.basedata.file_types.unshift(all)
          this.basedata.storages.unshift(all)
          this.dataIds = arrayColumn(res.data.list, this.idkey)
          this.imagePreview(res.data.list)
          this.selectCardInit()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 查询
    search(query) {
      this.query = query
      this.list()
    },
    // 重置
    reset(query) {
      try {
        this.$refs['table'].clearSort()
      } catch (error) {}
      this.query = query
      this.list()
    },
    // 排序
    sort(sort) {
      if (this.query.table) {
        this.query.sort_field = sort.column?.columnKey ?? sort.prop
        this.query.sort_value = ''
        if (sort.order === 'ascending') {
          this.query.sort_value = 'asc'
        } else if (sort.order === 'descending') {
          this.query.sort_value = 'desc'
        }
        this.list()
      } else {
        if (this.query.sort_field && this.query.sort_value) {
          this.list()
        }
      }
    },
    // 选择
    select(rows) {
      this.ids = arrayColumn(rows, this.idkey)
    },
    selectCardInit(checked = false) {
      const length = this.dataIds.length
      let idsed = []
      for (let index = 0; index < length; index++) {
        idsed.push(checked)
      }
      this.idsed = idsed
      this.selectAll = checked
    },
    selectCardOne(checked, index) {
      let id = this.dataIds[index]
      if (checked) {
        if (!this.ids.includes(id)) {
          this.ids.push(id)
        }
      } else {
        if (this.ids.includes(id)) {
          this.ids.splice(this.ids.indexOf(id), 1)
        }
      }
    },
    selectCardAll(checked) {
      if (checked) {
        this.ids = this.dataIds
        try {
          this.$refs['table'].toggleAllSelection()
        } catch (error) {}
      } else {
        this.ids = []
        try {
          this.$refs['table'].clearSelection()
        } catch (error) {}
      }
      this.selectAll = checked
      this.selectCardInit(checked)
    },
    // 添加
    add() {
      this.id = ''
      if (this.addEditDialog) {
        this.dialog = true
        this.dialogTitle = this.name + this.$t('添加')
      } else {
        this.$router.push({ name: this.routeAdd })
      }
    },
    // 修改
    async edit(row) {
      const route = this.type === 'edit' ? this.routeEdit : this.routeInfo
      const title = this.type === 'edit' ? this.$t('修改：') : this.$t('信息：')
      if (row) {
        this.id = row[this.idkey]
        if (this.addEditDialog) {
          this.dialog = true
          this.dialogTitle = this.name + title + this.id
        } else {
          this.$router.push({ name: route, params: { id: this.id } })
        }
      } else {
        const length = this.ids.length
        if (length) {
          if (this.addEditDialog) {
            this.id = this.ids[length - 1]
            this.dialog = true
            this.dialogTitle = this.name + title + this.id
          } else {
            for (let index = 0; index < length; index++) {
              await this.$router.push({ name: route, params: { id: this.ids[index] } })
            }
          }
        } else {
          ElMessageBox.alert(this.$t('请选择需要操作的', { name: this.name }), this.$t('提示'), {
            type: 'warning',
            center: true,
            callback: () => {}
          })
        }
      }
    },
    cancel() {
      this.dialog = false
      this.dialogTitle = ''
      this.id = ''
    },
    close() {
      this.cancel()
      this.list()
    },
    // 删除
    dele(row) {
      ElMessageBox.confirm(this.$t('确定要删除吗'), this.name + '：' + row[this.idkey], {
        type: 'warning',
        center: true
      })
        .then(() => {
          let api = deleApi
          if (this.query.recycle) {
            api = recycleDeleApi
          }
          api({ ids: [row[this.idkey]] })
            .then(() => {
              this.list()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    load(loading) {
      this.loading = loading
    },
    // 下载
    down(row) {
      const id = row[this.idkey]
      infoApi({ [this.idkey]: id })
        .then((res) => {
          const file = res.data
          if (file['add_type'] === 'upload' && file['storage'] === 'local') {
            infoApi({ [this.idkey]: id, file_name: file['file_name'] }, true)
          } else {
            clipboard(file.file_name + '.' + file.file_ext, this.$t('文件名已复制'))
            setTimeout(() => {
              window.open(file.file_url, '_blank')
            }, 500)
          }
        })
        .catch(() => {
          ElMessage({ message: this.$t('下载出错'), type: 'warning', grouping: true })
        })
    },
    // 图片预览
    imagePreview(data) {
      let preview = []
      const length = data.length
      for (let index = 0; index < length; index++) {
        if (data[index]['file_type'] === 'image') {
          preview.push(data[index]['file_url'])
        }
      }
      this.fileImgPre = preview
    },
    imagePreIndex(fileUrl) {
      return this.fileImgPre.indexOf(fileUrl)
    },
    // 分组筛选
    groupSelect(group_id) {
      this.query.group_id = group_id
      this.list()
    },
    // 标签筛选
    tagSelect(tag_ids) {
      this.query.tag_ids = tag_ids
      this.list()
    },
    // 类型筛选
    typeSelect(file_type) {
      this.query.file_type = file_type
      this.list()
    },
    // 禁用筛选
    disableSelect(is_disable) {
      this.query.is_disable = is_disable
      this.list()
    },
    // 上传筛选
    frontSelect(is_front) {
      this.query.is_front = is_front
      this.list()
    },
    // 存储筛选
    storageSelect(storage) {
      this.query.storage = storage
      this.list()
    },
    // 分组管理
    groupList() {
      this.list()
    },
    groupAdd() {
      this.groupDialog = true
      this.groupTitle = this.groupName + this.$t('添加')
      this.groupReset()
    },
    groupEdit() {
      const group_id = this.query.group_id
      if (!group_id) {
        ElMessageBox.alert(this.$t('请选择需要修改的', { name: this.groupName }), this.$t('提示'), {
          type: 'warning',
          center: true,
          callback: () => {}
        })
      } else {
        this.groupDialog = true
        this.groupTitle = this.groupName + this.$t('修改：') + this.query.group_id
        groupInfo({
          group_id: this.query.group_id
        })
          .then((res) => {
            this.groupReset(res.data)
          })
          .catch(() => {
            this.groupDialog = false
          })
      }
    },
    groupCancel() {
      this.groupDialog = false
      this.groupReset()
    },
    groupSubmit() {
      this.$refs['groupRef'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          delete this.groupModel.basedata
          if (this.groupModel.group_id) {
            groupEdit(this.groupModel)
              .then((res) => {
                this.groupList()
                this.groupDialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            groupAdd(this.groupModel)
              .then((res) => {
                this.groupList()
                this.groupDialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    groupDele() {
      const group_id = this.query.group_id
      if (!group_id) {
        ElMessageBox.alert(this.$t('请选择需要删除的', { name: this.groupName }), this.$t('提示'), {
          type: 'warning',
          center: true,
          callback: () => {}
        })
      } else {
        const title = this.groupName + this.$t('删除：') + group_id
        const message = this.$t('确定要删除吗？')
        ElMessageBox.confirm(message, title, { type: 'warning', center: true })
          .then(() => {
            this.loading = true
            groupDele({
              ids: [group_id]
            })
              .then((res) => {
                this.groupList()
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          })
          .catch(() => {})
      }
    },
    groupReset(row) {
      if (row) {
        this.groupModel = row
      } else {
        this.groupModel = this.$options.data().groupModel
      }
    },
    // 标签管理
    tagList() {
      this.list()
    },
    tagAdd() {
      this.tagDialog = true
      this.tagTitle = this.tagName + this.$t('添加')
      this.tagReset()
    },
    tagEdit() {
      const tag_ids = this.query.tag_ids
      const tag_id = tag_ids[0]
      if (!tag_id) {
        ElMessageBox.alert(this.$t('请选择需要修改的', { name: this.tagName }), this.$t('提示'), {
          type: 'warning',
          center: true,
          callback: () => {}
        })
      } else {
        this.tagDialog = true
        this.tagTitle = this.tagName + this.$t('修改：') + tag_id
        tagInfo({
          tag_id: tag_id
        })
          .then((res) => {
            this.tagReset(res.data)
          })
          .catch(() => {
            this.tagDialog = false
          })
      }
    },
    tagCancel() {
      this.tagDialog = false
      this.tagReset()
    },
    tagSubmit() {
      this.$refs['tagRef'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          delete this.tagModel.basedata
          if (this.tagModel.tag_id) {
            tagEdit(this.tagModel)
              .then((res) => {
                this.tagList()
                this.tagReset()
                this.tagDialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            tagAdd(this.tagModel)
              .then((res) => {
                this.tagList()
                this.tagReset()
                this.tagDialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    tagDele() {
      const tag_ids = this.query.tag_ids
      const tag_id = tag_ids[0]
      if (!tag_id) {
        ElMessageBox.alert(this.$t('请选择需要删除的', { name: this.tagName }), this.$t('提示'), {
          type: 'warning',
          center: true,
          callback: () => {}
        })
      } else {
        const title = this.tagName + this.$t('删除：') + tag_id
        const message = this.$t('确定要删除吗？')
        ElMessageBox.confirm(message, title, { type: 'warning', center: true })
          .then(() => {
            this.loading = true
            tagDele({
              ids: [tag_id]
            })
              .then((res) => {
                this.tagList()
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          })
          .catch(() => {})
      }
    },
    tagReset(row) {
      if (row) {
        this.tagModel = row
      } else {
        this.tagModel = this.$options.data().tagModel
      }
    },
    // 文件操作
    fileCancel() {
      this.selectCardAll(false)
      this.$emit('fileCancel')
    },
    fileSubmit() {
      const ids = this.ids
      const ids_length = ids.length
      if (!ids_length) {
        ElMessageBox.alert(this.$t('请选择文件'))
      } else {
        const files = []
        const data = this.data
        const data_length = data.length
        for (let i = 0; i < ids_length; i++) {
          for (let j = 0; j < data_length; j++) {
            if (ids[i] === data[j][this.idkey]) {
              files.push(data[j])
              break
            }
          }
        }
        this.selectCardAll(false)
        this.$emit('fileSubmit', files, this.fileType)
      }
    }
  }
}
</script>
