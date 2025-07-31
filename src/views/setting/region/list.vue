<template>
  <div class="app-container">
    <!-- 查询 -->
    <Search :name="name" :idkey="idkey" :basedata="basedata" @search="search" @reset="reset" />
    <!-- 操作 -->
    <Operate :name="name" :ids="ids" :basedata="basedata" :query="query" @list="list" @add="add" @edit="edit" />
    <!-- 列表 -->
    <div class="ml-6">
      <el-row>
        <el-col :span="4">
          <el-checkbox v-model="selectAlled" :indeterminate="selectInd" :title="$t('全选/反选')" @change="selectAll" />
          <el-text size="default">{{ $t('名称') }}</el-text>
        </el-col>
        <el-col :span="2">
          <el-text size="default">ID</el-text>
        </el-col>
        <el-col :span="1">
          <el-text size="default">{{ $t('级别') }}</el-text>
        </el-col>
        <el-col :span="4">
          <el-text size="default">{{ $t('拼音') }}</el-text>
        </el-col>
        <el-col :span="2">
          <el-text size="default">{{ $t('区号') }}</el-text>
        </el-col>
        <el-col :span="2">
          <el-text size="default">{{ $t('邮编') }}</el-text>
        </el-col>
        <el-col :span="3">
          <el-text size="default">{{ $t('经度') }},{{ $t('纬度') }}</el-text>
        </el-col>
        <el-col :span="1">
          <el-text size="default">{{ $t('禁用') }}</el-text>
        </el-col>
        <el-col :span="2">
          <el-text size="default">{{ $t('排序') }}</el-text>
        </el-col>
        <el-col :span="3">
          <el-text size="default">{{ $t('操作') }}</el-text>
        </el-col>
      </el-row>
    </div>
    <el-scrollbar :height="height">
      <el-tree-v2
        ref="table"
        v-loading="loading"
        :data="data"
        :props="props"
        :height="height"
        :default-checked-keys="ids"
        :check-strictly="props.checkStrictly"
        :expand-on-click-node="false"
        show-checkbox
        @check="select"
      >
        <template #default="scope">
          <el-row class="w-full">
            <el-col :span="4">
              <el-text size="default">{{ scope.data.region_name }}</el-text>
            </el-col>
            <el-col :span="2">
              <el-text size="default">{{ scope.data.region_id }}</el-text>
            </el-col>
            <el-col :span="1">
              <el-text size="default">{{ scope.data.level }}</el-text>
            </el-col>
            <el-col :span="4">
              <el-text size="default">{{ scope.data.pinyin }}</el-text>
            </el-col>
            <el-col :span="2">
              <el-text size="default">{{ scope.data.citycode }}</el-text>
            </el-col>
            <el-col :span="2">
              <el-text size="default">{{ scope.data.zipcode }}</el-text>
            </el-col>
            <el-col :span="3">
              <el-text size="default">{{ scope.data.longitude }},{{ scope.data.latitude }}</el-text>
            </el-col>
            <el-col :span="1">
              <el-text size="default">{{ scope.data.is_disable_name }}</el-text>
            </el-col>
            <el-col :span="2">
              <el-text size="default">{{ scope.data.sort }}</el-text>
            </el-col>
            <el-col :span="3">
              <ElLinkOperate v-if="hasPerm([permAdd])" :text="$t('添加')" @click="add(scope.data)" />
              <ElLinkOperate v-if="hasPerm([permEdit])" :text="$t('修改')" @click="edit(scope.data)" />
              <ElLinkOperate v-else-if="hasPerm([permInfo])" :text="$t('信息')" @click="edit(scope.data)" />
              <ElLinkOperate v-if="hasPerm([permDele])" :text="$t('删除')" @click="dele(scope.data)" />
            </el-col>
          </el-row>
        </template>
      </el-tree-v2>
    </el-scrollbar>
    <el-row class="mt-5">
      <el-col class="pl-3">
        <el-checkbox v-model="addEditDialog" :title="$t('添加修改时是弹窗还是新标签页')">
          <el-text size="default">{{ $t('弹窗') }}</el-text>
        </el-checkbox>
        <el-checkbox v-model="expandAlled" :title="$t('收起/展开')" @change="expandAll">
          <el-text size="default">{{ $t('收起') }}</el-text>
        </el-checkbox>
        <el-checkbox :title="$t('关联时选择父节点子节点也会被选择')" @change="checkStrictly">
          <el-text size="default">{{ $t('关联') }}</el-text>
        </el-checkbox>
        <el-checkbox v-model="islist" true-value="1" false-value="0" :title="$t('以列表或树形展示')" @change="list">
          <el-text size="default">{{ $t('列表') }}</el-text>
        </el-checkbox>
        <el-text size="default" tag="label">{{ $t('共') }} {{ count }} {{ $t('条') }}</el-text>
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
      <AddEdit :id="id" :pid="pid" :type="type" dialog @close="close" />
    </el-dialog>
  </div>
</template>

<script>
import Search from './component/Search.vue'
import Operate from './component/Operate.vue'
import AddEdit from './component/AddEdit.vue'
import { hasPerm, screenHeight, getAddEditDialog } from '@/utils/index'
import { listApi, deleApi } from '@/api/setting/region'

export default {
  name: 'SettingRegionList',
  components: { Search, Operate, AddEdit },
  data() {
    return {
      name: '',
      height: 700,
      loading: false,
      idkey: 'region_id',
      query: {},
      data: [],
      count: '',
      dataIds: [],
      ids: [],
      islist: 0,
      addEditDialog: getAddEditDialog(true),
      id: '',
      pid: '',
      type: 'edit',
      dialog: false,
      dialogTitle: '',
      basedata: {
        exps: [],
        trees: [],
        props: { value: 'region_id', label: 'region_name', checkStrictly: true, emitPath: false },
        levels: []
      },
      permInfo: 'admin/setting.Region/info',
      permAdd: 'admin/setting.Region/add',
      permEdit: 'admin/setting.Region/edit',
      permDele: 'admin/setting.Region/dele',
      routeInfo: 'SettingRegionInfo',
      routeAdd: 'SettingRegionAdd',
      routeEdit: 'SettingRegionEdit',
      props: { value: 'region_id', label: 'region_name', checkStrictly: true },
      expandAlled: true,
      selectAlled: false
    }
  },
  computed: {
    selectInd() {
      const data_length = this.dataIds.length
      const ids_length = this.ids.length
      return ids_length > 0 && ids_length < data_length
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('地区')
      this.height = screenHeight(320)
      this.type = hasPerm([this.permEdit]) ? 'edit' : 'info'
      this.basedata.exps = [{ exp: 'like', name: this.$t('包含') }]
    },
    // 列表
    list() {
      this.loading = true
      this.query.islist = this.islist
      listApi(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.dataIds = res.data.ids
          this.loading = false
          this.basedata.exps = res.data.basedata.exps
          this.basedata.trees = res.data.basedata.trees
          this.basedata.levels = res.data.basedata.levels
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
      this.ids = []
      this.selectAlled = false
      this.$refs.table.setCheckedKeys(this.ids)
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
    select(data, info) {
      this.ids = info.checkedKeys
    },
    // 添加
    add(row) {
      this.id = ''
      if (row) {
        this.pid = row[this.idkey]
      }
      if (this.addEditDialog) {
        this.dialog = true
        this.dialogTitle = this.name + this.$t('添加')
      } else {
        this.$router.push({ name: this.routeAdd, params: { pid: this.pid } })
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
      this.pid = ''
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
    // 全选
    selectAll() {
      if (this.selectAlled) {
        this.ids = this.dataIds
      } else {
        this.ids = []
        this.$refs.table.setCheckedKeys(this.ids)
      }
    },
    // 收起
    expandAll(value) {
      if (!value) {
        this.$refs.table.setExpandedKeys(this.dataIds)
      } else {
        this.$refs.table.setExpandedKeys([])
      }
    },
    // 关联
    checkStrictly(value) {
      this.props.checkStrictly = !value
    }
  }
}
</script>
