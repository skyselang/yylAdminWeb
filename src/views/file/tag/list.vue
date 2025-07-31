<template>
  <div class="app-container">
    <!-- 查询 -->
    <Search :name="name" :idkey="idkey" :basedata="basedata" @search="search" @reset="reset" />
    <!-- 操作 -->
    <Operate :name="name" :ids="ids" :basedata="basedata" :query="query" @list="list" @add="add" @edit="edit" />
    <!-- 列表 -->
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
      <el-table-column prop="tag_unique" :label="$t('编号')" min-width="120" sortable="custom" />
      <el-table-column prop="tag_name" :label="$t('名称')" min-width="130" sortable="custom" />
      <el-table-column prop="desc" :label="$t('描述')" min-width="150" />
      <el-table-column prop="remark" :label="$t('备注')" min-width="130" />
      <el-table-column
        prop="is_disable_name"
        :label="$t('禁用')"
        min-width="80"
        sortable="custom"
        column-key="is_disable"
      />
      <el-table-column prop="sort" :label="$t('排序')" min-width="80" sortable="custom" />
      <el-table-column prop="create_time" :label="$t('添加时间')" width="162" sortable="custom" />
      <el-table-column prop="update_time" :label="$t('修改时间')" width="162" sortable="custom" />
      <el-table-column :label="$t('操作')" width="145">
        <template #default="{ row }">
          <ElLinkOperate v-if="hasPerm([permEdit])" :text="$t('修改')" @click="edit(row)" />
          <ElLinkOperate v-else-if="hasPerm([permInfo])" :text="$t('信息')" @click="edit(row)" />
          <ElLinkOperate v-if="hasPerm([permDele])" :text="$t('删除')" @click="dele(row)" />
          <ElLinkOperate v-if="hasPerm([permFile])" :text="$t('文件')" @click="file(row)" />
        </template>
      </el-table-column>
    </el-table>
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
      align-center
      center
    >
      <AddEdit :id="id" :type="type" dialog @close="close" />
    </el-dialog>
    <!-- 文件 -->
    <File
      :id="tag_id"
      :id-pk="idkey"
      :names="name"
      title-pk="tag_name"
      :title="tag_name"
      :list-api="fileListApi"
      :lift-api="fileLiftApi"
      @close="file"
    />
  </div>
</template>

<script>
import Search from './component/Search.vue'
import Operate from './component/Operate.vue'
import AddEdit from './component/AddEdit.vue'
import { hasPerm, screenHeight, arrayColumn, getAddEditDialog } from '@/utils/index'
import { listApi, deleApi, fileListApi, fileLiftApi } from '@/api/file/tag'
import File from '@/views/file/file/component/File.vue'

export default {
  name: 'FileTagList',
  components: { Search, Operate, AddEdit, File },
  data() {
    return {
      name: '',
      height: 700,
      loading: false,
      idkey: 'tag_id',
      query: {},
      data: [],
      count: 0,
      ids: [],
      addEditDialog: getAddEditDialog(),
      id: '',
      type: 'edit',
      dialog: false,
      dialogTitle: '',
      basedata: { exps: [] },
      permInfo: 'admin/file.Tag/info',
      permEdit: 'admin/file.Tag/edit',
      permDele: 'admin/file.Tag/dele',
      permFile: 'admin/file.Tag/fileList',
      routeInfo: 'FileTagInfo',
      routeAdd: 'FileTagAdd',
      routeEdit: 'FileTagEdit',
      tag_id: 0,
      tag_name: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    fileListApi,
    fileLiftApi,
    init() {
      this.name = this.$t('文件标签')
      this.height = screenHeight()
      this.type = hasPerm([this.permEdit]) ? 'edit' : 'info'
      this.basedata.exps = [{ exp: 'like', name: this.$t('包含') }]
    },
    // 列表
    list() {
      this.loading = true
      listApi(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.loading = false
          this.basedata.exps = res.data.basedata.exps
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
      this.query.sort_field = sort.column?.columnKey ?? sort.prop
      this.query.sort_value = ''
      if (sort.order === 'ascending') {
        this.query.sort_value = 'asc'
      } else if (sort.order === 'descending') {
        this.query.sort_value = 'desc'
      }
      this.list()
    },
    // 选择
    select(rows) {
      this.ids = arrayColumn(rows, this.idkey)
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
          deleApi({ ids: [row[this.idkey]] })
            .then(() => {
              this.list()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 文件
    file(row) {
      this.tag_id = row[this.idkey]
      this.tag_name = row.tag_name
    }
  }
}
</script>
