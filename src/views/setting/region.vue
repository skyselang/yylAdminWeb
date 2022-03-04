<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="region_name" label="名称" />
            <el-option value="region_pinyin" label="拼音" />
            <el-option value="region_jianpin" label="简拼" />
            <el-option value="region_initials" label="首字母" />
            <el-option value="region_citycode" label="区号" />
            <el-option value="region_zipcode" label="邮编" />
            <el-option value="region_pid" label="PID" />
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
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button @click="selectOpen('pid')">上级</el-button>
          <el-button @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add('')">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :rows="2" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='pid'" label="上级" prop="">
            <el-cascader
              :key="selectPidKey"
              v-model="region_pid"
              :options="regionTree"
              :props="regionProps"
              style="width:100%"
              placeholder="一级地区"
              clearable
              filterable
              @change="selectPidChange"
            />
          </el-form-item>
          <el-form-item v-if="selectType==='dele'" label="" prop="">
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
    <el-table ref="table" :key="tbKey" v-loading="loading" :data="data" :height="height" :row-key="idkey" lazy :load="load" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="region_name" label="名称" min-width="250" />
      <el-table-column prop="region_pinyin" label="拼音" min-width="250" sortable="custom" />
      <el-table-column prop="region_jianpin" label="简拼" min-width="120" sortable="custom" />
      <el-table-column prop="region_initials" label="首字母" min-width="90" sortable="custom" />
      <el-table-column prop="region_citycode" label="区号" min-width="80" sortable="custom" />
      <el-table-column prop="region_zipcode" label="邮编" min-width="80" sortable="custom" />
      <el-table-column :prop="idkey" label="ID" min-width="95" sortable="custom" />
      <el-table-column prop="region_pid" label="PID" min-width="95" />
      <el-table-column prop="region_sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column label="操作" width="130" fixed="right" align="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" title="添加下级" @click="add(row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="dele([row])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height-50+'px'}">
        <el-form-item label="上级" prop="region_pid">
          <el-cascader
            :key="pidKey"
            v-model="model.region_pid"
            :options="regionTree"
            :props="regionProps"
            style="width:100%"
            placeholder="一级地区"
            clearable
            filterable
            @change="pidChange"
          />
        </el-form-item>
        <el-form-item label="名称" prop="region_name">
          <el-input v-model="model.region_name" placeholder="请输入名称，eg：北京市" clearable />
        </el-form-item>
        <el-form-item label="拼音" prop="region_pinyin">
          <el-input v-model="model.region_pinyin" placeholder="请输入拼音，eg：Beijing" clearable />
        </el-form-item>
        <el-form-item label="简拼" prop="region_jianpin">
          <el-input v-model="model.region_jianpin" placeholder="请输入简拼，eg：BJ" clearable />
        </el-form-item>
        <el-form-item label="首字母" prop="region_initials">
          <el-input v-model="model.region_initials" placeholder="请输入首字母，eg：B" clearable />
        </el-form-item>
        <el-form-item label="区号" prop="region_citycode">
          <el-input v-model="model.region_citycode" placeholder="请输入区号，eg：010" clearable />
        </el-form-item>
        <el-form-item label="邮编" prop="region_zipcode">
          <el-input v-model="model.region_zipcode" placeholder="请输入邮编，eg：1000" clearable />
        </el-form-item>
        <el-form-item label="经度" prop="region_longitude">
          <el-input v-model="model.region_longitude" placeholder="请输入经度，eg：116.403263" clearable />
        </el-form-item>
        <el-form-item label="纬度" prop="region_latitude">
          <el-input v-model="model.region_latitude" placeholder="请输入纬度，eg：39.915156" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="region_sort">
          <el-input v-model="model.region_sort" type="number" placeholder="请输入排序，eg：2250" clearable />
        </el-form-item>
        <el-form-item label="" prop="">
          <el-link type="info" href="https://www.ip138.com/post/" style="margin-right:10px" target="_blank">查询区号邮编</el-link>
          <el-link type="info" href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">查询经度纬度</el-link>
        </el-form-item>
        <el-form-item v-if="model.create_time" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" placeholder="" disabled />
        </el-form-item>
        <el-form-item v-if="model.update_time" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" placeholder="" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, pid, dele } from '@/api/setting/region'

export default {
  name: 'SettingRegion',
  components: { },
  data() {
    return {
      name: '地区',
      height: 680,
      loading: false,
      idkey: 'region_id',
      tbKey: 1,
      data: [],
      count: 0,
      query: {
        search_field: 'region_name',
        date_field: 'create_time'
      },
      dialog: false,
      dialogTitle: '',
      pidKey: 500,
      model: {
        region_id: '',
        region_pid: 0,
        region_name: '',
        region_pinyin: '',
        region_jianpin: '',
        region_initials: '',
        region_citycode: '',
        region_zipcode: '',
        region_longitude: '',
        region_latitude: '',
        region_sort: 2250
      },
      rules: {
        region_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      regionTree: [],
      regionProps: { expandTrigger: 'click', checkStrictly: true, value: 'region_id', label: 'region_name' },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      region_pid: 0,
      selectPidKey: 1000
    }
  },
  created() {
    this.height = screenHeight() + 50
    this.list()
    this.tree()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      this.data = []
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 加载
    load(row, treeNode, resolve) {
      list({
        region_pid: row[this.idkey]
      }).then(res => {
        resolve(res.data.list)
      })
    },
    // 树形
    tree() {
      this.regionTree = []
      list({ type: 'tree' }).then(res => {
        this.regionTree = res.data
      }).catch(() => {})
    },
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
      if (row) {
        this.model.region_pid = row[this.idkey]
      }
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      this.reset()
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.model = res.data
      })
    },
    cancel() {
      this.dialog = false
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model[this.idkey]) {
            edit(this.model).then(res => {
              this.list()
              this.reset()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
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
    // 重置
    reset(row) {
      ++this.tbKey
      ++this.pidKey
      ++this.selectPidKey
      this.tree()
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
      }
      if (this.$refs['table'] !== undefined) {
        this.$refs['table'].doLayout()
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
        if (selectType === 'pid') {
          this.selectTitle = '修改上级'
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
        if (selectType === 'pid') {
          this.setpid(this.selection)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改上级
    setpid(row) {
      pid({
        ids: this.selectGetIds(row),
        region_pid: this.region_pid
      }).then(res => {
        this.list()
        this.reset()
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.list()
      })
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
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 上级选择
    pidChange(value) {
      if (value) {
        this.model.region_pid = value[value.length - 1]
      }
    },
    selectPidChange(value) {
      if (value) {
        this.region_pid = value[value.length - 1]
      }
    }
  }
}
</script>
